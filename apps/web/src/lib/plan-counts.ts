import type { AgentId } from "@planview/shared/agents";
import type { Plan } from "@planview/shared/plan";
import { GLOBAL_PROJECT_NAME } from "@planview/shared/plan";

import { RECENT_WINDOW_MS } from "@/lib/plan-filter";

export type PlanCounts = {
  all: number;
  recent: number;
  byAgent: Record<AgentId, number>;
  byProject: Record<string, number>;
};

export function getPlanCounts(plans: Plan[], now = Date.now()): PlanCounts {
  const byAgent: Record<AgentId, number> = { cursor: 0, claude: 0 };
  const byProject: Record<string, number> = {};

  let recent = 0;

  for (const plan of plans) {
    if (now - plan.lastModified <= RECENT_WINDOW_MS) {
      recent += 1;
    }

    byAgent[plan.tool] += 1;
    byProject[plan.project] = (byProject[plan.project] ?? 0) + 1;
  }

  return {
    all: plans.length,
    recent,
    byAgent,
    byProject,
  };
}

export function getSortedProjectNames(byProject: Record<string, number>): string[] {
  return Object.keys(byProject)
    .filter((name) => name !== GLOBAL_PROJECT_NAME)
    .sort((a, b) => a.localeCompare(b));
}
