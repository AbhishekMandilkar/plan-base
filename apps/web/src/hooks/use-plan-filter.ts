import { useEffect, useMemo } from "react";
import { getRouteApi } from "@tanstack/react-router";

import {
  filterPlans,
  getPlanFilterLabel,
  parsePlanFilterFromSearch,
  type PlanFilter,
} from "@/lib/plan-filter";
import { usePlansStore } from "@/stores/plans-store";

const homeRouteApi = getRouteApi("/");

export function usePlanFilter() {
  const search = homeRouteApi.useSearch();
  const plans = usePlansStore((state) => state.plans);
  const setSelectedPlanId = usePlansStore((state) => state.setSelectedPlanId);

  const filter = useMemo(() => parsePlanFilterFromSearch(search), [search]);
  const filteredPlans = useMemo(() => filterPlans(plans, filter), [plans, filter]);
  const label = getPlanFilterLabel(filter);
  const hasActiveFilter = filter.type !== "all";

  useEffect(() => {
    setSelectedPlanId(null);
  }, [search, setSelectedPlanId]);

  return { filter, filteredPlans, label, hasActiveFilter };
}

export type { PlanFilter };
