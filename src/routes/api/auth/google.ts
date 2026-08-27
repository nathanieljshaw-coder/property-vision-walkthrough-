import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/google")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env["GOOGLE_CLIENT_ID"];
        if (!clientId) {
          return new Response("Google sign-in is not configured yet.", { status: 501 });
        }

        const url = new URL(request.url);
        const redirectUri = `${url.origin}/api/auth/google/callback`;
        const state = crypto.randomUUID();

        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          state,
          prompt: "select_account",
        });

        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
            "Set-Cookie": `google_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
          },
        });
      },
    },
  },
});
