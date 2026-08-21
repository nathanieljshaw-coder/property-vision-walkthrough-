import { useCallback, useRef, useState } from "react";

type BeforeAfterProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
};

export function BeforeAfter({ beforeSrc, afterSrc, beforeLabel, afterLabel, alt }: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-border bg-black"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
      }}
      role="slider"
      aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
    >
      {/* After (base layer) */}
      <img src={afterSrc} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Before (clipped top layer) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        <img
          src={beforeSrc}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.6)]"
        style={{ left: `${pos}%` }}
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 shadow-lg backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 8-4 4 4 4" />
            <path d="m15 8 4 4-4 4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
