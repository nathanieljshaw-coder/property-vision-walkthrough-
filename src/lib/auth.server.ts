import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
  createSession,
  findSession,
  deleteSession,
} from "./db.server";

/* ── Register ──────────────────────────────────────────── */

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const register = createServerFn({ method: "POST" })
  .validator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const existing = await findUserByEmail(data.email);
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const hash = await bcrypt.hash(data.password, 12);
    const user = await createUser(data.email, data.name, hash);
    const token = await createSession(user.id);

    return {
      ok: true,
      user: { name: user.name, email: user.email },
      cookie: `lumen_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
    };
  });

/* ── Login ─────────────────────────────────────────────── */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await findUserByEmail(data.email);
    if (!user) throw new Error("No account found with this email.");

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) throw new Error("Incorrect password.");

    const token = await createSession(user.id);
    return {
      ok: true,
      user: { name: user.name, email: user.email },
      cookie: `lumen_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
    };
  });

/* ── Logout ────────────────────────────────────────────── */

export const logout = createServerFn({ method: "POST" }).handler(
  async ({ context }: any) => {
    const cookieHeader = context?.request?.headers?.get("cookie") ?? "";
    const token = cookieHeader.match(/lumen_session=([^;]+)/)?.[1];
    if (token) await deleteSession(token);

    return {
      ok: true,
      cookie: "lumen_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    };
  }
);
