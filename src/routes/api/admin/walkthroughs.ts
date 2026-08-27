import { createFileRoute } from "@tanstack/react-router";
import { findSession, isAdmin } from "@/lib/db.server";
import fs from "fs";
import path from "path";

async function getAdminUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;
  if (!isAdmin(session.user.email)) return null;
  return session.user;
}

export const Route = createFileRoute("/api/admin/walkthroughs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        // The walkthroughs generated for the portfolio (public/walkthroughs/*.mp4),
        // excluding the hero montage and the admin-uploaded files.
        const dir = path.join(process.cwd(), "public", "walkthroughs");
        let files: string[] = [];
        try {
          files = fs
            .readdirSync(dir)
            .filter((f) => f.endsWith(".mp4") && f !== "hero-montage.mp4")
            .sort();
        } catch {
          files = [];
        }

        return Response.json({
          walkthroughs: files.map((f) => ({
            name: f.replace(/\.mp4$/, ""),
            url: `/walkthroughs/${f}`,
          })),
        });
      },
    },
  },
});
