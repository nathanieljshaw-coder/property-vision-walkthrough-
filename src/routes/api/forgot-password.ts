import { createFileRoute } from "@tanstack/react-router";
import { findUserByEmail, createPasswordResetToken } from "@/lib/db.server";

const SITE_URL = process.env["SITE_URL"] || "https://property-vision-walkthrough-main.vercel.app";

export const Route = createFileRoute("/api/forgot-password")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email } = await request.json();

          if (!email) {
            return Response.json({ error: "Email is required" }, { status: 400 });
          }

          // Always return success to prevent email enumeration
          const user = await findUserByEmail(email);
          if (!user) {
            return Response.json({ ok: true });
          }

          const token = await createPasswordResetToken(user.id);
          const resetUrl = `${SITE_URL}/reset-password?token=${token}`;

          // Send branded email with reset link
          try {
            const { sendBrandedEmail } = await import("@/lib/email.server");
            await sendBrandedEmail({
              template: "custom",
              email: user.email,
              name: user.name,
              productName: "Password Reset",
              message: `We received a request to reset your password. Click the link below to set a new one. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
              origin: SITE_URL,
            });
          } catch (emailErr) {
            console.error("Failed to send password reset email:", emailErr);
            // Don't fail the request — the token is still valid
          }

          return Response.json({ ok: true });
        } catch (err: any) {
          console.error("Forgot password error:", err);
          return Response.json({ error: "Something went wrong" }, { status: 500 });
        }
      },
    },
  },
});
