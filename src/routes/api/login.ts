import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, createSession, isAdmin } from "@/lib/db.server";

export const Route = createFileRoute("/api/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, password, remember } = await request.json();

          if (!email) {
            return Response.json({ error: "Email and password required" }, { status: 400 });
          }

          // Admin can sign in with just their email — no password needed.
          const isAdminEmail = isAdmin(email);

          let user = await findUserByEmail(email);

          // Auto-create admin account on first login so registration is never needed.
          if (!user && isAdminEmail) {
            const dummyHash = await bcrypt.hash("admin-auto", 10);
            user = await createUser(email, "Nathaniel (Admin)", dummyHash);
          }

          if (!user) {
            return Response.json({ error: "No account found with this email." }, { status: 401 });
          }
          if (!isAdminEmail && !password) {
            return Response.json({ error: "Email and password required" }, { status: 400 });
          }
          if (!isAdminEmail) {
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
              return Response.json({ error: "Incorrect password." }, { status: 401 });
            }
          }

          // Keep me signed in: remember → 30-day persistent cookie;
          // otherwise a browser-session cookie (cleared on close).
          const rememberDays = remember === false ? 1 : 30;
          const token = await createSession(user.id, rememberDays);
          const maxAge = remember === false ? undefined : rememberDays * 24 * 60 * 60;

          return Response.json(
            { ok: true, user: { name: user.name, email: user.email } },
            {
              status: 200,
              headers: {
                "Set-Cookie": `lumen_session=${token}; Path=/; HttpOnly; SameSite=Lax${maxAge ? `; Max-Age=${maxAge}` : ""}`,
              },
            }
          );
        } catch (err: any) {
          return Response.json({ error: err.message || "Login failed" }, { status: 500 });
        }
      },
    },
  },
});
