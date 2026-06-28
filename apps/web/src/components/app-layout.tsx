import { Outlet } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import Loader from "@/components/loader";
import { TitleBarStrip } from "@/components/title-bar-strip";
import { useAppConfig } from "@/hooks/use-app-config";
import { usePlansScan } from "@/hooks/use-plans-scan";

const AppShell = lazy(() =>
  import("@/components/app-shell").then((module) => ({ default: module.AppShell })),
);

export function AppLayout() {
  const { isLoading, needsOnboarding } = useAppConfig();
  const showShell = !isLoading && !needsOnboarding;

  usePlansScan(showShell);

  if (!showShell) {
    return (
      <div className="flex h-svh flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-svh items-center justify-center">
          <Loader />
        </div>
      }
    >
      <AppShell>
        <Outlet />
      </AppShell>
    </Suspense>
  );
}
