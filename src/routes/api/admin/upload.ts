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

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getAdminUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const formData = await request.formData();
        const file = formData.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Limit to ~500MB for safety
        if (file.size > 500 * 1024 * 1024) {
          return Response.json({ error: "File too large (max 500MB)" }, { status: 400 });
        }

        // Sanitise the filename
        const original = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
        const ext = path.extname(original) || ".mp4";
        const base = path.basename(original, ext).slice(0, 40) || "walkthrough";
        const unique = `${base}-${Date.now()}${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "walkthroughs", "uploads");
        fs.mkdirSync(uploadDir, { recursive: true });
        const dest = path.join(uploadDir, unique);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(dest, buffer);

        return Response.json({
          ok: true,
          url: `/walkthroughs/uploads/${unique}`,
          size: file.size,
        });
      },
    },
  },
});
