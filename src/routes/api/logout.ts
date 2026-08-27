import { createFileRoute } from "@tanstack/react-router";
import { deleteSession } from "@/lib/db.server";

export const Route = createFileRoute("/api/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
        if (token) deleteSession(token);

        return new Response(null, {
          status: 200,
          headers: {
            "Set-Cookie": "lumen_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
          },
        });
      },
    },
  },
});
