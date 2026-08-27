import { createFileRoute } from "@tanstack/react-router";
import { findSession, findImageRequestsByUserId } from "@/lib/db.server";

function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.match(/lumen_session=([^;]+)/)?.[1] ?? null;
}

export const Route = createFileRoute("/api/image-requests")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = getSessionToken(request);
        if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

        const session = await findSession(token);
        if (!session) return Response.json({ error: "Session expired" }, { status: 401 });

        const requests = await findImageRequestsByUserId(session.user.id);
        const pending = requests.filter((r) => r.status === "pending");

        return Response.json({ pending, all: requests });
      },
    },
  },
});
