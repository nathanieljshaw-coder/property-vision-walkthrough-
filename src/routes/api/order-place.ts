import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, createSession, updateUserPhone, createOrder } from "@/lib/db.server";
import { findOffering } from "@/content/services";
import { advertPages } from "@/content/adverts";
import { addonAmount, addonsForSlug } from "@/lib/addons";

export const Route = createFileRoute("/api/order-place")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { slug, email, name, phone, whatsappOptIn, password, addonIds, photoCount } = body;

          if (!slug || !email || !phone) {
            return Response.json({ error: "Email and phone number are required." }, { status: 400 });
          }
          if (!password || password.length < 8) {
            return Response.json(
              { error: "Please create a password (8+ characters) so you can log in to manage your order." },
              { status: 400 }
            );
          }

          const offering = findOffering(slug) ?? advertPages.find((a) => a.slug === slug);
          if (!offering) return Response.json({ error: "Unknown package." }, { status: 400 });

          const allowed = addonsForSlug(offering.slug);
          const addons = (addonIds ?? []).filter((id: string) => allowed.includes(id));
          const amount = offering.amount + addonAmount(addons);

          // Find-or-create the customer account with their chosen password.
          let user = await findUserByEmail(email);
          if (user) {
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
              return Response.json(
                { error: "An account already exists with this email. Log in instead, or use that account's password." },
                { status: 409 }
              );
            }
          } else {
            const hash = await bcrypt.hash(password, 12);
            user = await createUser(email, name || email.split("@")[0], hash);
          }
          if (phone) await updateUserPhone(user.id, phone);

          const order = await createOrder(
            user.id,
            offering.slug,
            offering.productName,
            amount,
            undefined,
            phone,
            whatsappOptIn ?? false,
            "pending", // not paid yet
            "pending" // awaiting customer approval of the demo
          );

          // Auto-login so the customer can reach the dashboard immediately.
          const token = await createSession(user.id);
          const cookie = `lumen_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;

          return Response.json(
            { ok: true, orderId: order.id, user: { name: user.name, email: user.email } },
            { status: 200, headers: { "Set-Cookie": cookie } }
          );
        } catch (err: any) {
          return Response.json({ error: err.message || "Could not place your order." }, { status: 500 });
        }
      },
    },
  },
});
