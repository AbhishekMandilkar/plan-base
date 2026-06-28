import { AGENT_IDS } from "@planview/shared/agents";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import Loader from "@/components/loader";
import { Onboarding } from "@/components/onboarding";
import { PlanList } from "@/components/plan-list";
import { useAppConfig } from "@/hooks/use-app-config";
import { usePlanFilter } from "@/hooks/use-plan-filter";
import { usePlansStore } from "@/stores/plans-store";

const homeSearchSchema = z.object({
  view: z.enum(["recent", "completed"]).optional(),
  agent: z.enum(AGENT_IDS).optional(),
  project: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: homeSearchSchema,
  component: HomeComponent,
});

function HomeComponent() {
  const { isLoading, needsOnboarding } = useAppConfig();
  const { filteredPlans, label, hasActiveFilter } = usePlanFilter();
  const isScanning = usePlansStore((state) => state.isScanning);
  const selectedPlanId = usePlansStore((state) => state.selectedPlanId);
  const setSelectedPlanId = usePlansStore((state) => state.setSelectedPlanId);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (needsOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="h-full min-h-0">
      <PlanList
        plans={filteredPlans}
        isScanning={isScanning}
        selectedPlanId={selectedPlanId}
        onSelectPlan={(plan) => setSelectedPlanId(plan.id)}
        filterLabel={label}
        hasActiveFilter={hasActiveFilter}
      />
    </div>
  );
}
