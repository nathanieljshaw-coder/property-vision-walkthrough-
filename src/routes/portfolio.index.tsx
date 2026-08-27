import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, X } from "lucide-react";
import { portfolioProjects, type PortfolioProject } from "@/content/portfolio";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Demo | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "Selected websites and cinematic walkthroughs created for villas, hotels, golf resorts, restaurants and property businesses.",
      },
      { property: "og:title", content: "Demo | LUMEN Digital Experiences" },
      {
        property: "og:description",
        content: "Selected projects across hospitality, property and golf.",
      },
    ],
  }),
  component: PortfolioPage,
});

function VideoModal({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} AI walkthrough`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              {project.type}
            </p>
            <h3 className="mt-1 truncate font-display text-xl text-foreground">{project.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close walkthrough"
            className="shrink-0 rounded-full border border-border p-2 text-muted-foreground transition hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <video
          key={project.slug}
          src={project.videoUrl}
          poster={project.heroImage}
          controls
          autoPlay
          muted
          playsInline
          className="aspect-video w-full bg-black object-contain"
        />
        <p className="px-6 py-4 text-sm leading-relaxed text-muted-foreground">{project.intro}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project, onPlay }: { project: PortfolioProject; onPlay: () => void }) {
  return (
    <article className="card-lift overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Watch the AI walkthrough for ${project.name}`}
        className="group relative block h-52 w-full overflow-hidden text-left"
      >
        <img
          src={project.heroImage}
          alt={project.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition group-hover:bg-gold group-hover:text-primary-foreground">
          <Play className="h-3 w-3 fill-current" /> Watch AI Walkthrough
        </span>
      </button>
      <div className="p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
          {project.type}
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground">{project.name}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{project.location}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.note}</p>
      </div>
    </article>
  );
}

function PortfolioPage() {
  const [active, setActive] = useState<PortfolioProject | null>(null);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Our Work</p>
        <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">Selected Projects</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A selection of AI video walkthroughs, websites and cinematic experiences created for
          hospitality, property and golf businesses.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground/70 italic">
          For copyright reasons, these places are fake and do not exist in real life.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} onPlay={() => setActive(p)} />
          ))}
        </div>

        <div className="mt-16">
          <Link
            to="/pricing"
            className="inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Create Your Experience
          </Link>
        </div>
      </div>

      {active && <VideoModal project={active} onClose={() => setActive(null)} />}
    </div>
  );
}
