import { createFileRoute } from "@tanstack/react-router";
import { findSession, isAdmin, createImageRequest, findOrderById } from "@/lib/db.server";
import { sendBrandedEmail } from "@/lib/email.server";

async function getAdminUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;
  if (!isAdmin(session.user.email)) return null;
  return session.user;
}

export const Route = createFileRoute("/api/admin/request-images")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = await request.json();
        const { orderId, message } = body;

        if (!orderId || !message?.trim()) {
          return Response.json({ error: "orderId and message are required" }, { status: 400 });
        }

        // Create the image request
        const imageRequest = await createImageRequest(Number(orderId), message.trim());

        // Notify the customer via email
        try {
          const order = await findOrderById(Number(orderId));
          if (order) {
            const { findUserById } = await import("@/lib/db.server");
            const owner = await findUserById(order.user_id);
            if (owner?.email) {
              const origin = request.headers.get("origin") || new URL(request.url).origin;
              await sendBrandedEmail({
                email: owner.email,
                name: owner.name || owner.email,
                productName: order.product_name,
                template: "need_info",
                message: `${message.trim()}\n\nPlease upload your images here: ${origin}/upload-images?request=${imageRequest.id}`,
                origin,
              });
            }
          }
        } catch (emailErr) {
          console.error("Image request email failed:", emailErr);
        }

        return Response.json({ ok: true, request: imageRequest });
      },

      GET: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const url = new URL(request.url);
        const orderId = url.searchParams.get("orderId");
        if (!orderId) {
          return Response.json({ error: "orderId param required" }, { status: 400 });
        }

        const { findImageRequestsByOrderId, findUploadedImagesByRequestId } = await import("@/lib/db.server");
        const requests = await findImageRequestsByOrderId(Number(orderId));
        
        // Attach uploads to each request
        const requestsWithUploads = await Promise.all(
          requests.map(async (r) => ({
            ...r,
            uploads: await findUploadedImagesByRequestId(r.id),
          }))
        );

        return Response.json({ requests: requestsWithUploads });
      },
    },
  },
});
