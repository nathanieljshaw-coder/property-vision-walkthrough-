import { createFileRoute, notFound } from "@tanstack/react-router";
import { servicePages } from "@/content/services";
import { OfferingPage } from "@/components/offering-page";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const offering = servicePages.find((s) => s.slug === params.slug);
    if (!offering) throw notFound();
    return { offering };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found | LUMEN" }, { name: "robots", content: "noindex" }],
      };
    }
    const o = loaderData.offering;
    return {
      meta: [
        { title: o.metaTitle },
        { name: "description", content: o.metaDescription },
        { property: "og:title", content: o.metaTitle },
        { property: "og:description", content: o.metaDescription },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { offering } = Route.useLoaderData();
  return <OfferingPage offering={offering} />;
}
