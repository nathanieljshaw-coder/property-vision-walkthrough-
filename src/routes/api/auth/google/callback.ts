import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, createSession } from "@/lib/db.server";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
  picture?: string;
};

export const Route = createFileRoute("/api/auth/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const clientId = process.env["GOOGLE_CLIENT_ID"];
        const clientSecret = process.env["GOOGLE_CLIENT_SECRET"];

        // CSRF check: state must match what we set in the cookie.
        const cookieHeader = request.headers.get("cookie") ?? "";
        const expectedState = cookieHeader.match(/google_oauth_state=([^;]+)/)?.[1];

        if (!code || !state || state !== expectedState || !clientId || !clientSecret) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?google=error" },
          });
        }

        const redirectUri = `${url.origin}/api/auth/google/callback`;

        // Exchange the auth code for tokens.
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        });
        const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
        if (!tokenData.access_token) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?google=error" },
          });
        }

        // Fetch the user's profile.
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const info = (await userRes.json()) as GoogleUserInfo;
        const email = info.email;
        if (!email) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?google=error" },
          });
        }

        // Find-or-create the account (no password for Google accounts).
        let user = await findUserByEmail(email);
        if (!user) {
          const hash = await bcrypt.hash(crypto.randomUUID(), 12);
          const displayName = info.name || email.split("@")[0] || "";
          user = await createUser(email, displayName, hash);
        }

        const token = await createSession(user.id, 30);

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/dashboard",
            "Set-Cookie": `lumen_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
          },
        });
      },
    },
  },
});
