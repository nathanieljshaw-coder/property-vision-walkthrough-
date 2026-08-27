import { createFileRoute } from "@tanstack/react-router";
import { findSession, findOrdersByUserId } from "@/lib/db.server";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
        if (!token) return new Response(null, { status: 401 });

        const session = await findSession(token);
        if (!session) return new Response(null, { status: 401 });

        const orders = await findOrdersByUserId(session.user.id);

        return Response.json({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
          },
          orders: orders.map((o) => ({
            id: o.id,
            slug: o.slug,
            product_name: o.product_name,
            amount: o.amount,
            status: o.status,
            approval_status: o.approval_status ?? null,
            walkthrough_status: o.walkthrough_status,
            walkthrough_url: o.walkthrough_url,
            notes: o.notes,
            created_at: o.created_at,
            updated_at: o.updated_at,
          })),
        });
      },
    },
  },
});
