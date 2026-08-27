import { createFileRoute } from "@tanstack/react-router";
import {
  findSession,
  findOrderById,
  updateOrderApprovalStatus,
  updateOrderNotes,
} from "@/lib/db.server";
import { createStripeCheckoutSession } from "@/lib/checkout.server";

export const Route = createFileRoute("/api/order-decision")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
        if (!token) return new Response(null, { status: 401 });
        const session = await findSession(token);
        if (!session) return new Response(null, { status: 401 });

        const body = await request.json();
        const { orderId, decision } = body;
        if (!orderId || !decision) {
          return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const order = await findOrderById(Number(orderId));
        if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
        if (order.user_id !== session.user.id) {
          return Response.json({ error: "Not your order" }, { status: 403 });
        }

        const origin = request.headers.get("origin") || new URL(request.url).origin;

        if (decision === "agree") {
          // Customer approved the demo — take them to Stripe to pay.
          const { url } = await createStripeCheckoutSession({
            slug: order.slug,
            productName: order.product_name,
            amount: order.amount,
            origin,
            email: session.user.email,
            phone: order.phone ?? undefined,
            whatsappOptIn: order.whatsapp_opt_in,
            orderId: order.id,
          });
          updateOrderApprovalStatus(order.id, "agreed");
          return Response.json({ ok: true, url });
        }

        if (decision === "decline") {
          // Customer declined — keep the order so we can revise it.
          updateOrderApprovalStatus(order.id, "declined");
          updateOrderNotes(order.id, order.notes ? `${order.notes}\nCustomer declined the demo.` : "Customer declined the demo.");
          return Response.json({ ok: true, declined: true });
        }

        return Response.json({ error: "Invalid decision" }, { status: 400 });
      },
    },
  },
});
