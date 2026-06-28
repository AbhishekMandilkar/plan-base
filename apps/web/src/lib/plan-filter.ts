import { AGENTS_BY_ID, type AgentId } from "@planview/shared/agents";
import type { Plan } from "@planview/shared/plan";

export const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type PlanViewFilter = "recent" | "completed";

export type PlanFilter =
  | { type: "all" }
  | { type: "view"; view: PlanViewFilter }
  | { type: "agent"; agent: AgentId }
  | { type: "project"; project: string };

export type HomeSearchParams = {
  view?: PlanViewFilter;
  agent?: AgentId;
  project?: string;
};

export function parsePlanFilterFromSearch(search: HomeSearchParams): PlanFilter {
  if (search.project) {
    return { type: "project", project: search.project };
  }
  if (search.agent) {
    return { type: "agent", agent: search.agent };
  }
  if (search.view) {
    return { type: "view", view: search.view };
  }
  return { type: "all" };
}

export function filterPlans(plans: Plan[], filter: PlanFilter, now = Date.now()): Plan[] {
  switch (filter.type) {
    case "all":
      return plans;
    case "view":
      if (filter.view === "recent") {
        return plans.filter((plan) => now - plan.lastModified <= RECENT_WINDOW_MS);
      }
      return plans.filter(
        (plan) => plan.totalTasks > 0 && plan.completedTasks === plan.totalTasks,
      );
    case "agent":
      return plans.filter((plan) => plan.tool === filter.agent);
    case "project":
      return plans.filter((plan) => plan.project === filter.project);
  }
}

export function getPlanFilterLabel(filter: PlanFilter): string {
  switch (filter.type) {
    case "all":
      return "All plans";
    case "view":
      return filter.view === "recent" ? "Recent" : "Completed";
    case "agent":
      return AGENTS_BY_ID[filter.agent].label;
    case "project":
      return filter.project;
  }
}

export function isSamePlanFilter(a: PlanFilter, b: PlanFilter): boolean {
  if (a.type !== b.type) {
    return false;
  }
  switch (a.type) {
    case "all":
      return true;
    case "view":
      return b.type === "view" && a.view === b.view;
    case "agent":
      return b.type === "agent" && a.agent === b.agent;
    case "project":
      return b.type === "project" && a.project === b.project;
  }
}

export function planFilterToSearch(filter: PlanFilter): HomeSearchParams {
  switch (filter.type) {
    case "all":
      return {};
    case "view":
      return { view: filter.view };
    case "agent":
      return { agent: filter.agent };
    case "project":
      return { project: filter.project };
  }
}

export function searchForView(view: PlanViewFilter): HomeSearchParams {
  return { view, agent: undefined, project: undefined };
}

export function searchForAgent(agent: AgentId): HomeSearchParams {
  return { agent, view: undefined, project: undefined };
}

export function searchForProject(project: string): HomeSearchParams {
  return { project, view: undefined, agent: undefined };
}

export const ALL_PLANS_SEARCH: HomeSearchParams = {
  view: undefined,
  agent: undefined,
  project: undefined,
};
