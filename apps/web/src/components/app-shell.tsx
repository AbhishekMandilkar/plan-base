import { AGENTS } from "@planview/shared/agents";
import { Separator } from "@planview/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@planview/ui/components/sidebar";
import { TooltipProvider } from "@planview/ui/components/tooltip";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  LayoutList,
  Settings,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";

import { PlanStatusBar } from "@/components/plan-status-bar";
import { AgentIcon } from "@/lib/agents";
import { getPlanCounts, getSortedProjectNames } from "@/lib/plan-counts";
import {
  ALL_PLANS_SEARCH,
  getPlanFilterLabel,
  isSamePlanFilter,
  parsePlanFilterFromSearch,
  searchForAgent,
  searchForProject,
  searchForView,
  type HomeSearchParams,
} from "@/lib/plan-filter";
import { usePlansStore } from "@/stores/plans-store";

const SIDEBAR_WIDTH = "13.75rem"; // 220px per PRD
const DETAIL_WIDTH = "17.5rem"; // 280px per PRD

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const search = useRouterState({ select: (state) => state.location.search as HomeSearchParams });
  const isSettings = pathname === "/settings";
  const isHome = pathname === "/";
  const filter = useMemo(
    () => (isHome ? parsePlanFilterFromSearch(search) : { type: "all" as const }),
    [isHome, search],
  );
  const plans = usePlansStore((state) => state.plans);
  const counts = getPlanCounts(plans);
  const projectNames = getSortedProjectNames(counts.byProject);
  const headerTitle = isSettings
    ? "Settings"
    : isHome && filter.type !== "all"
      ? getPlanFilterLabel(filter)
      : "Plans";

  return (
    <TooltipProvider>
      <SidebarProvider
        className="h-svh overflow-hidden"
        style={{ "--sidebar-width": SIDEBAR_WIDTH } as CSSProperties}
      >
        <Sidebar collapsible="none" className="h-svh border-r border-sidebar-border">
          <div
            className="electrobun-webkit-app-region-drag h-11 shrink-0 border-b border-sidebar-border"
            aria-hidden
          />

          <SidebarContent className="electrobun-webkit-app-region-no-drag">
            <SidebarGroup>
              <SidebarGroupLabel>Views</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isHome && isSamePlanFilter(filter, { type: "all" })}
                      render={<Link to="/" search={ALL_PLANS_SEARCH} />}
                    >
                      <LayoutList />
                      <span>All plans</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{counts.all}</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isHome && isSamePlanFilter(filter, { type: "view", view: "recent" })}
                      render={<Link to="/" search={searchForView("recent")} />}
                    >
                      <Clock />
                      <span>Recent</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{counts.recent}</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={
                        isHome && isSamePlanFilter(filter, { type: "view", view: "completed" })
                      }
                      render={<Link to="/" search={searchForView("completed")} />}
                    >
                      <CheckCircle2 />
                      <span>Completed</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{counts.completed}</SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Agents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {AGENTS.map((agent) => (
                    <SidebarMenuItem key={agent.id}>
                      <SidebarMenuButton
                        isActive={isHome && isSamePlanFilter(filter, { type: "agent", agent: agent.id })}
                        render={<Link to="/" search={searchForAgent(agent.id)} />}
                      >
                        <AgentIcon agent={agent.id} className="size-4 shrink-0" />
                        <span>{agent.label}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{counts.byAgent[agent.id]}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Project</SidebarGroupLabel>
              <SidebarGroupContent>
                {projectNames.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-sidebar-foreground/60">
                    Projects appear after the first scan.
                  </p>
                ) : (
                  <SidebarMenu>
                    {projectNames.map((project) => (
                      <SidebarMenuItem key={project}>
                        <SidebarMenuButton
                          isActive={
                            isHome && isSamePlanFilter(filter, { type: "project", project })
                          }
                          render={<Link to="/" search={searchForProject(project)} />}
                        >
                          <span>{project}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{counts.byProject[project]}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="electrobun-webkit-app-region-no-drag border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isSettings} render={<Link to="/settings" />}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex min-h-0 flex-col overflow-hidden">
          <header className="flex h-11 shrink-0 border-b border-border">
            <div className="electrobun-webkit-app-region-drag flex min-w-0 flex-1 items-center px-4">
              <div className="electrobun-webkit-app-region-no-drag flex min-w-0 flex-1 items-center gap-3">
                <h1 className="shrink-0 text-sm font-medium">{headerTitle}</h1>
              </div>
            </div>

            {!isSettings ? (
              <div className="electrobun-webkit-app-region-drag flex w-70 shrink-0 items-center border-l border-border px-4">
                <span className="text-sm font-medium text-muted-foreground">Details</span>
              </div>
            ) : null}
          </header>

          <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
            <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>

            {!isSettings ? (
              <aside
                className="flex min-h-0 shrink-0 flex-col border-l border-border bg-background"
                style={{ width: DETAIL_WIDTH }}
              >
                <div className="flex flex-1 items-center justify-center p-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Select a plan to view its contents.
                  </p>
                </div>
              </aside>
            ) : null}
          </div>

          {!isSettings ? <PlanStatusBar /> : null}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function SidebarSeparator() {
  return <Separator className="mx-0 bg-sidebar-border" />;
}
