import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findSession, updateUserName, updateUserPassword, updateUserPhone } from "@/lib/db.server";

function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/lumen_session=([^;]+)/);
  return match?.[1] ?? null;
}

export const Route = createFileRoute("/api/account")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const token = getSessionToken(request);
          if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

          const session = await findSession(token);
          if (!session) return Response.json({ error: "Session expired" }, { status: 401 });

          const { password_hash, ...safeUser } = session.user;
          return Response.json({ user: safeUser });
        } catch (err: any) {
          return Response.json({ error: err.message || "Failed" }, { status: 500 });
        }
      },

      PUT: async ({ request }) => {
        try {
          const token = getSessionToken(request);
          if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

          const session = await findSession(token);
          if (!session) return Response.json({ error: "Session expired" }, { status: 401 });

          const body = await request.json();
          const { name, phone, currentPassword, newPassword } = body;

          // Update name if provided
          if (name && name.trim() && name !== session.user.name) {
            await updateUserName(session.user.id, name.trim());
          }

          // Update phone if provided
          if (phone !== undefined) {
            await updateUserPhone(session.user.id, phone || "");
          }

          // Update password if provided
          if (newPassword) {
            if (newPassword.length < 8) {
              return Response.json({ error: "New password must be at least 8 characters" }, { status: 400 });
            }

            // Admin accounts skip current password check
            const isAdmin = session.user.email.toLowerCase() === "nathaniel.j.shaw@outlook.com";

            if (!isAdmin) {
              if (!currentPassword) {
                return Response.json({ error: "Current password is required to set a new password" }, { status: 400 });
              }
              const valid = await bcrypt.compare(currentPassword, session.user.password_hash);
              if (!valid) {
                return Response.json({ error: "Current password is incorrect" }, { status: 400 });
              }
            }

            const hash = await bcrypt.hash(newPassword, 12);
            await updateUserPassword(session.user.id, hash);
          }

          return Response.json({ ok: true });
        } catch (err: any) {
          return Response.json({ error: err.message || "Failed" }, { status: 500 });
        }
      },
    },
  },
});
