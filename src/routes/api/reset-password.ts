import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findPasswordResetToken, consumePasswordResetToken, updateUserPassword } from "@/lib/db.server";

export const Route = createFileRoute("/api/reset-password")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { token, password } = await request.json();

          if (!token || !password) {
            return Response.json({ error: "Token and password are required" }, { status: 400 });
          }

          if (password.length < 8) {
            return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
          }

          // Validate the token
          const resetToken = await findPasswordResetToken(token);
          if (!resetToken) {
            return Response.json({ error: "Invalid or expired reset link" }, { status: 400 });
          }

          // Hash the new password
          const passwordHash = await bcrypt.hash(password, 12);

          // Update the user's password
          await updateUserPassword(resetToken.user_id, passwordHash);

          // Mark the token as used
          await consumePasswordResetToken(token);

          return Response.json({ ok: true });
        } catch (err: any) {
          console.error("Reset password error:", err);
          return Response.json({ error: "Something went wrong" }, { status: 500 });
        }
      },
    },
  },
});
