import type { Plan } from "@planview/shared/plan";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@planview/ui/components/empty";
import { ScrollArea } from "@planview/ui/components/scroll-area";
import { Skeleton } from "@planview/ui/components/skeleton";
import { LayoutList } from "lucide-react";

import { PlanListItem } from "@/components/plan-list-item";

type PlanListProps = {
  plans: Plan[];
  isScanning: boolean;
  selectedPlanId?: string | null;
  onSelectPlan?: (plan: Plan) => void;
  filterLabel?: string;
  hasActiveFilter?: boolean;
};

function PlanListSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className="px-4 py-3.5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PlanList({
  plans,
  isScanning,
  selectedPlanId,
  onSelectPlan,
  filterLabel,
  hasActiveFilter = false,
}: PlanListProps) {
  if (isScanning && plans.length === 0 && !hasActiveFilter) {
    return <PlanListSkeleton />;
  }

  if (!isScanning && plans.length === 0 && !hasActiveFilter) {
    return (
      <Empty className="h-full border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutList />
          </EmptyMedia>
          <EmptyTitle>No plans found</EmptyTitle>
          <EmptyDescription>
            Plans from global Cursor and Claude directories, plus your configured project folders,
            will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (plans.length === 0 && hasActiveFilter) {
    return (
      <Empty className="h-full border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutList />
          </EmptyMedia>
          <EmptyTitle>No {filterLabel?.toLowerCase() ?? "matching"} plans</EmptyTitle>
          <EmptyDescription>
            Nothing matches this filter. Try All plans to see everything.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full min-h-0">
      <ul className="divide-y divide-border">
        {plans.map((plan) => (
          <PlanListItem
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={onSelectPlan ? () => onSelectPlan(plan) : undefined}
          />
        ))}
      </ul>
    </ScrollArea>
  );
}
