// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The Lovable assets-proxy plugin reads LOVABLE_PREVIEW_HOST from process.env when the
// config loads. Vite does not push .env.local values into process.env by itself, so surface
// it here (the host lives in .env.local) — otherwise /__l5e/assets-v1/* URLs (AI walkthrough
// videos) 404 in local dev.
const env = loadEnv("development", process.cwd(), "");
const previewHost = env["LOVABLE_PREVIEW_HOST"];
if (previewHost) {
  process.env["LOVABLE_PREVIEW_HOST"] = previewHost;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
