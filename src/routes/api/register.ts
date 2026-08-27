import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, createSession } from "@/lib/db.server";

export const Route = createFileRoute("/api/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { name, email, password, remember } = await request.json();

          if (!name || !email || !password || password.length < 8) {
            return Response.json({ error: "Invalid input" }, { status: 400 });
          }

          const existing = await findUserByEmail(email);
          if (existing) {
            return Response.json({ error: "An account with this email already exists." }, { status: 409 });
          }

          const hash = await bcrypt.hash(password, 12);
          const user = await createUser(email, name, hash);
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
          return Response.json({ error: err.message || "Registration failed" }, { status: 500 });
        }
      },
    },
  },
});
