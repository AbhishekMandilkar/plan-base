import { AGENTS_BY_ID } from "@planview/shared/agents";
import type { Plan } from "@planview/shared/plan";
import { cn } from "@planview/ui/lib/utils";

import { AgentIcon } from "@/lib/agents";
import { formatRelativeTime } from "@/lib/format-relative-time";

type PlanListItemProps = {
  plan: Plan;
  isSelected?: boolean;
  onSelect?: () => void;
};

export function PlanListItem({ plan, isSelected = false, onSelect }: PlanListItemProps) {
  const progress =
    plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : null;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full px-4 py-3.5 text-left transition-colors",
          isSelected ? "bg-accent" : "hover:bg-muted/50",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-sm font-medium leading-snug">{plan.title}</p>

          <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <AgentIcon
              agent={plan.tool}
              className="size-3 shrink-0"
              aria-label={AGENTS_BY_ID[plan.tool].label}
            />
            <span className="truncate">{plan.project}</span>
            <span aria-hidden className="text-muted-foreground/50">
              ·
            </span>
            <span className="shrink-0">{formatRelativeTime(plan.lastModified)}</span>
          </p>

          {progress !== null ? (
            <div className="flex items-center gap-2">
              <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/70 transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                {plan.completedTasks}/{plan.totalTasks}
              </span>
            </div>
          ) : null}
        </div>
      </button>
    </li>
  );
}
