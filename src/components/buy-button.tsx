import { Link } from "@tanstack/react-router";

export function BuyButton({
  slug,
  label,
  variant = "solid",
}: {
  slug: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "gold-fill text-primary-foreground shadow-gold-glow hover:brightness-110"
      : "border border-border text-gold hover:bg-gold hover:text-primary-foreground";

  return (
    <div className="w-full">
      <Link to="/checkout/$slug" params={{ slug }} className={`${base} ${styles}`}>
        {label}
      </Link>
    </div>
  );
}
