import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { useApplySettings } from "@/hooks/use-settings";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tap below to try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-input bg-background px-5 py-3 text-base font-medium text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      { name: "theme-color", content: "#cfe6f5" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Little Learners" },
      { title: "Little Learners — Calm Early Learning" },
      {
        name: "description",
        content:
          "A calm, ad-free, offline learning app for Grade 1 children — Math, English, and the World.",
      },
      { property: "og:title", content: "Little Learners — Calm Early Learning" },
      {
        property: "og:description",
        content: "Calm, offline, child-friendly Grade 1 learning.",
      },
      { name: "twitter:title", content: "Little Learners — Calm Early Learning" },
      { name: "description", content: "A FREE, ad-free Android app for Grade 1 children to learn Math, English, and General Knowledge offline." },
      { property: "og:description", content: "A FREE, ad-free Android app for Grade 1 children to learn Math, English, and General Knowledge offline." },
      { name: "twitter:description", content: "A FREE, ad-free Android app for Grade 1 children to learn Math, English, and General Knowledge offline." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1213cc7c-efda-493f-9454-e4e4cfe3945f/id-preview-eafbe3e5--76edf61d-9377-492e-a82e-8f66c975990f.lovable.app-1778128859906.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1213cc7c-efda-493f-9454-e4e4cfe3945f/id-preview-eafbe3e5--76edf61d-9377-492e-a82e-8f66c975990f.lovable.app-1778128859906.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ApplySettings() {
  useApplySettings();
  return null;
}

function PWARegister() {
  if (typeof window === "undefined") return null;
  // Run once on mount
  if (!(window as unknown as { __pwaRegistered?: boolean }).__pwaRegistered) {
    (window as unknown as { __pwaRegistered?: boolean }).__pwaRegistered = true;
    queueMicrotask(() => {
      const inIframe = (() => {
        try {
          return window.self !== window.top;
        } catch {
          return true;
        }
      })();
      const host = window.location.hostname;
      const isPreview =
        host.includes("id-preview--") ||
        host.includes("lovableproject.com") ||
        host.includes("lovable.dev");
      if (inIframe || isPreview) {
        navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
        return;
      }
      if ("serviceWorker" in navigator && import.meta.env.PROD) {
        navigator.serviceWorker.register("/sw.js").catch((e) => console.warn("SW register failed", e));
      }
    });
  }
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ApplySettings />
      <PWARegister />
      <div className="flex min-h-screen flex-col">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
