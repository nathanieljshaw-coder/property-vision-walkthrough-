import { createFileRoute, notFound } from "@tanstack/react-router";
import { advertPages } from "@/content/adverts";
import { OfferingPage } from "@/components/offering-page";

export const Route = createFileRoute("/adverts/$slug")({
  loader: ({ params }) => {
    const offering = advertPages.find((advert) => advert.slug === params.slug);
    if (!offering) throw notFound();
    return { offering };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Advert not found | LUMEN" }, { name: "robots", content: "noindex" }],
      };
    }
    const advert = loaderData.offering;
    return {
      meta: [
        { title: advert.metaTitle },
        { name: "description", content: advert.metaDescription },
        { property: "og:title", content: advert.metaTitle },
        { property: "og:description", content: advert.metaDescription },
      ],
    };
  },
  component: AdvertDetail,
});

function AdvertDetail() {
  const { offering } = Route.useLoaderData();
  return <OfferingPage offering={offering} />;
}
