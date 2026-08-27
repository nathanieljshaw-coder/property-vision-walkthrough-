import { createFileRoute } from "@tanstack/react-router";
import { findSession, isAdmin } from "@/lib/db.server";
import { buildOrderConfirmationHtml, buildDemoReadyHtml } from "@/lib/email.server";

async function getAdminUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;
  if (!isAdmin(session.user.email)) return null;
  return session.user;
}

export const Route = createFileRoute("/api/email-preview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const origin = request.headers.get("origin") || new URL(request.url).origin;
        const type = new URL(request.url).searchParams.get("type") ?? "confirmation";
        const html = type === "demo"
          ? buildDemoReadyHtml(
              {
                email: "customer@example.com",
                name: "Sample Customer",
                productName: "Property Experience — Airbnb & Holiday Rentals",
                demoUrl: "https://demo.lumen.co.uk/villa-sereno",
                origin,
              },
              `${origin}/logo.png`
            )
          : buildOrderConfirmationHtml(
          {
            email: "customer@example.com",
            name: "Sample Customer",
            phone: "07700 900123",
            whatsappOptIn: true,
            productName: "Property Experience — Airbnb & Holiday Rentals",
            amount: 19900,
            slug: "airbnb",
            orderId: "cs_test_preview123456",
            origin,
          },
          `${origin}/logo.png`
        );

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
