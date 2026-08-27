import { createFileRoute } from "@tanstack/react-router";
import { findSession, findImageRequestById, createUploadedImage, updateImageRequestStatus } from "@/lib/db.server";
import fs from "fs";
import path from "path";

function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  return cookie.match(/lumen_session=([^;]+)/)?.[1] ?? null;
}

export const Route = createFileRoute("/api/upload-images")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = getSessionToken(request);
        if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

        const session = await findSession(token);
        if (!session) return Response.json({ error: "Session expired" }, { status: 401 });

        const url = new URL(request.url);
        const requestId = url.searchParams.get("requestId");
        if (!requestId) return Response.json({ error: "requestId required" }, { status: 400 });

        const { findUploadedImagesByRequestId } = await import("@/lib/db.server");
        const images = await findUploadedImagesByRequestId(Number(requestId));
        return Response.json({ images });
      },

      POST: async ({ request }) => {
        const token = getSessionToken(request);
        if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

        const session = await findSession(token);
        if (!session) return Response.json({ error: "Session expired" }, { status: 401 });

        const formData = await request.formData();
        const requestId = formData.get("requestId");
        const files = formData.getAll("files");

        if (!requestId || files.length === 0) {
          return Response.json({ error: "requestId and at least one file required" }, { status: 400 });
        }

        // Verify the request belongs to this user
        const imageRequest = await findImageRequestById(Number(requestId));
        if (!imageRequest) return Response.json({ error: "Request not found" }, { status: 404 });

        const { findOrderById } = await import("@/lib/db.server");
        const order = await findOrderById(imageRequest.order_id);
        if (!order || order.user_id !== session.user.id) {
          return Response.json({ error: "Not authorized" }, { status: 403 });
        }

        // Save each file
        const uploadDir = path.join(process.cwd(), "public", "uploads", "images", String(requestId));
        fs.mkdirSync(uploadDir, { recursive: true });

        const saved = [];
        for (const file of files) {
          if (!(file instanceof File)) continue;
          if (file.size > 50 * 1024 * 1024) continue; // 50MB limit per file

          const ext = path.extname(file.name) || ".jpg";
          const base = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase().slice(0, 60);
          const unique = `${base}-${Date.now()}${ext}`;

          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(path.join(uploadDir, unique), buffer);

          const url = `/uploads/images/${requestId}/${unique}`;
          const uploaded = await createUploadedImage(
            Number(requestId),
            session.user.id,
            file.name,
            url,
            file.size
          );
          saved.push(uploaded);
        }

        // Check if all expected images are uploaded, mark request as fulfilled
        const { findUploadedImagesByRequestId } = await import("@/lib/db.server");
        const allUploads = await findUploadedImagesByRequestId(Number(requestId));
        if (allUploads.length >= 3) {
          await updateImageRequestStatus(Number(requestId), "fulfilled");
        }

        return Response.json({ ok: true, uploaded: saved });
      },
    },
  },
});
