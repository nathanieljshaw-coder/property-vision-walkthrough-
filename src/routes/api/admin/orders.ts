import { createFileRoute } from "@tanstack/react-router";
import { findSession, isAdmin, findAllOrders, updateOrderStatus, updateWalkthroughStatus, updateWalkthroughUrl, updateOrderNotes, updateUserPhone, updateOrderAutoEmail, findUserById } from "@/lib/db.server";
import { sendDemoReadyEmail, sendBrandedEmail } from "@/lib/email.server";
import { sendWhatsAppText, normalizePhoneE164, whatsappConfigured } from "@/lib/whatsapp.server";

async function getAdminUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;
  if (!isAdmin(session.user.email)) return null;
  return session.user;
}

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const orders = await findAllOrders();
        return Response.json({ orders });
      },

      PATCH: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = await request.json();
        const { orderId, field, value } = body;

        if (!orderId || !field || value === undefined) {
          return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const allOrders = await findAllOrders();

        const AUTO_MESSAGES: Record<"work_started" | "delivered", string> = {
          work_started:
            "Hi {name}, we've started working on your {product}. We'll keep you updated!",
          delivered:
            "Hi {name}, your {product} has been delivered! You can watch it from your dashboard. Thank you for choosing LUMEN!",
        };

        function fill(msg: string, o: (typeof allOrders)[number]) {
          return msg.replace("{name}", o.user_name).replace("{product}", o.product_name);
        }

        async function autoSend(
          o: (typeof allOrders)[number],
          template: "work_started" | "delivered"
        ) {
          if (o.auto_email === false) return;
          const origin = request.headers.get("origin") || new URL(request.url).origin;
          try {
            await sendBrandedEmail({
              email: o.user_email,
              name: o.user_name,
              productName: o.product_name,
              template,
              message: fill(AUTO_MESSAGES[template], o),
              demoUrl: o.walkthrough_url,
              origin,
            });
            console.log(`Auto-sent "${template}" for order ${o.id} to ${o.user_email}`);
          } catch (err) {
            console.error(
              `Auto-send "${template}" failed for order ${o.id}:`,
              err instanceof Error ? err.message : err
            );
          }
        }

        // WhatsApp auto-send — mirrors the email above. Only fires for customers
        // who opted in and have a phone number on the order.
        async function autoWhatsApp(
          o: (typeof allOrders)[number],
          template: "work_started" | "delivered" | "demo_ready"
        ) {
          if (o.auto_email === false) return;
          if (!whatsappConfigured()) return;
          if (!o.whatsapp_opt_in) return;
          if (!o.phone) return;
          const e164 = normalizePhoneE164(o.phone);
          if (!e164) return;
          const WA_MESSAGES: Record<string, string> = {
            work_started: fill(AUTO_MESSAGES.work_started, o),
            delivered: fill(AUTO_MESSAGES.delivered, o),
            demo_ready: `Hi ${o.user_name}, your ${o.product_name} walkthrough is ready to review! Watch it here: ${o.walkthrough_url ?? "your dashboard"}`,
          };
          try {
            await sendWhatsAppText(e164, WA_MESSAGES[template] ?? "");
            console.log(`Auto-sent WhatsApp "${template}" for order ${o.id} to ${e164}`);
          } catch (err) {
            console.error(
              `Auto-send WhatsApp "${template}" failed for order ${o.id}:`,
              err instanceof Error ? err.message : err
            );
          }
        }

        switch (field) {
          case "status": {
            const order = allOrders.find((o) => o.id === orderId);
            const prev = order?.status;
            updateOrderStatus(orderId, value);
            if (order) {
              if (value === "in_progress" && prev !== "in_progress") {
                void autoSend(order, "work_started");
                void autoWhatsApp(order, "work_started");
              } else if (
                (value === "completed" || value === "delivered") &&
                prev !== "completed" &&
                prev !== "delivered"
              ) {
                void autoSend(order, "delivered");
                void autoWhatsApp(order, "delivered");
              }
            }
            break;
          }
          case "auto_email":
            updateOrderAutoEmail(orderId, value === "true");
            break;
          case "walkthrough_status":
            updateWalkthroughStatus(orderId, value);
            // Demo ready — email the customer their review link (with the logo).
            if (value === "review") {
              const order = (await findAllOrders()).find((o) => o.id === orderId);
              if (order?.walkthrough_url && order.user_email) {
                sendDemoReadyEmail({
                  email: order.user_email,
                  name: order.user_name,
                  productName: order.product_name,
                  demoUrl: order.walkthrough_url,
                  origin: request.headers.get("origin") || new URL(request.url).origin,
                  pendingPayment: order.status === "pending" && order.approval_status === "pending",
                }).catch((err) => {
                  console.error("Demo-ready email failed:", err instanceof Error ? err.message : err);
                });
                void autoWhatsApp(order, "demo_ready");
              }
            }
            break;
          case "walkthrough_url":
            updateWalkthroughUrl(orderId, value);
            break;
          case "notes":
            updateOrderNotes(orderId, value);
            break;
          case "phone": {
            const order = (await findAllOrders()).find((o) => o.id === orderId);
            const owner = order ? await findUserById(order.user_id) : undefined;
            if (owner) await updateUserPhone(owner.id, value);
            break;
          }
          default:
            return Response.json({ error: "Invalid field" }, { status: 400 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
