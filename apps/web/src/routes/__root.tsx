import { Toaster } from "@planview/ui/components/sonner";
import { HeadContent, createRootRouteWithContext } from "@tanstack/react-router";

import { AppLayout } from "@/components/app-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { AppConfigProvider } from "@/hooks/use-app-config";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Planbase",
      },
      {
        name: "description",
        content: "Browse and open AI agent plan files from Cursor and Claude Code.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AppConfigProvider>
          <AppLayout />
        </AppConfigProvider>
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}
