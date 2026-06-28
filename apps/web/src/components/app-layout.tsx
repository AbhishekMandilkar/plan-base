import { Outlet } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import Header from "@/components/header";
import { useAppConfig } from "@/hooks/use-app-config";
import { usePlansScan } from "@/hooks/use-plans-scan";

export function AppLayout() {
  const { isLoading, needsOnboarding } = useAppConfig();
  const showShell = !isLoading && !needsOnboarding;

  usePlansScan(showShell);

  if (!showShell) {
    return (
      <div className="grid h-svh grid-rows-[auto_1fr]">
        <Header />
        <Outlet />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
