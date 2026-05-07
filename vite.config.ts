// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null, // we register manually with iframe/preview guard
        devOptions: { enabled: false },
        manifest: false, // we ship our own /manifest.webmanifest
        workbox: {
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/api/, /^\/~oauth/],
          globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
          runtimeCaching: [
            {
              // HTML navigations: network first so updates ship
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "html", networkTimeoutSeconds: 3 },
            },
            {
              // AI content fetches: stale-while-revalidate so kids see something offline
              urlPattern: ({ url }) => url.pathname.startsWith("/_serverFn/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "ai-content",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
          ],
        },
      }),
    ],
  },
});
