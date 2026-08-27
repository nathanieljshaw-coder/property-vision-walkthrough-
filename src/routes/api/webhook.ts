import { createFileRoute } from "@tanstack/react-router";
import {
  findUserByEmailOrCreate,
  findOrderById,
  createOrder,
  updateUserPhone,
  updateOrderStatus,
  updateOrderApprovalStatus,
  updateOrderStripeSession,
} from "@/lib/db.server";
import { sendOrderConfirmation } from "@/lib/email.server";
import bcrypt from "bcryptjs";

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");
        const origin = request.headers.get("origin") || new URL(request.url).origin;

        // In production, verify the webhook signature with Stripe.
        // For now, parse the event directly (works for development).
        let event: any;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data?.object;
          if (!session) return new Response("No session", { status: 400 });

          // Pay-after-approval: the session carries the existing order id, so
          // mark that order paid instead of creating a duplicate.
          const existingOrderId = session.metadata?.order_id
            ? Number(session.metadata.order_id)
            : null;
          if (existingOrderId) {
            const order = await findOrderById(existingOrderId);
            if (order) {
              await updateOrderStripeSession(order.id, session.id);
              await updateOrderStatus(order.id, "paid");
              await updateOrderApprovalStatus(order.id, "agreed");
              console.log(`Pay-after-approval order ${order.id} marked paid`);
            }
            return Response.json({ received: true });
          }

          const email = session.customer_email || session.customer_details?.email;
          const slug = session.metadata?.slug;
          const addons = session.metadata?.addons;
          const phone = session.metadata?.phone || session.customer_details?.phone || null;
          const whatsappOptIn = session.metadata?.whatsapp_opt_in === "true";
          const productName = session.display_items?.[0]?.description || slug || "Order";
          const amount = session.amount_total || 0;

          if (!email || !slug) {
            return new Response("Missing data", { status: 400 });
          }

          // Find or create user
          const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);
          const user = await findUserByEmailOrCreate(email, email.split("@")[0], passwordHash);
          if (phone) await updateUserPhone(user.id, phone);

          // Create order
          await createOrder(user.id, slug, productName, amount, session.id, phone, whatsappOptIn);

          // Send the order confirmation email (branded HTML with the LUMEN logo).
          sendOrderConfirmation({
            email,
            name: user.name,
            phone,
            whatsappOptIn,
            productName,
            amount,
            slug,
            orderId: session.id,
            origin,
          }).catch((err) => {
            console.error("Order confirmation email failed:", err?.message ?? err);
          });

          console.log(`Order created for ${email}: ${slug} (£${(amount / 100).toFixed(2)})`);
        }

        return Response.json({ received: true });
      },
    },
  },
});
