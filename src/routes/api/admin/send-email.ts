import { createFileRoute } from "@tanstack/react-router";
import { findSession, isAdmin, findAllOrders, findUserById } from "@/lib/db.server";
import { sendBrandedEmail, type BrandedTemplate } from "@/lib/email.server";

async function getAdminUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;
  if (!isAdmin(session.user.email)) return null;
  return session.user;
}

const TEMPLATES: BrandedTemplate[] = ["work_started", "demo_ready", "need_info", "delivered", "custom"];

export const Route = createFileRoute("/api/admin/send-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = await request.json();
        const orderId = body?.orderId;
        const template = body?.template as BrandedTemplate;
        const message = String(body?.message ?? "").trim();

        if (!orderId || !TEMPLATES.includes(template) || !message) {
          return Response.json({ error: "orderId, template and message are required" }, { status: 400 });
        }

        const order = (await findAllOrders()).find((o) => o.id === orderId);
        if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
        const owner = await findUserById(order.user_id);
        if (!owner?.email) return Response.json({ error: "Customer not found" }, { status: 404 });

        const origin = request.headers.get("origin") || new URL(request.url).origin;

        try {
          const status = await sendBrandedEmail({
            email: owner.email,
            name: owner.name || owner.email,
            productName: order.product_name,
            template,
            message,
            demoUrl: order.walkthrough_url,
            origin,
          });
          return Response.json({ ok: true, sentTo: owner.email, delivery: status });
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : "Failed to send email." },
            { status: 400 }
          );
        }
      },
    },
  },
});
