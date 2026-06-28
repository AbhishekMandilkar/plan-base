import type { Plan } from "@planview/shared/plan";
import { create } from "zustand";

import { scanPlans } from "@/lib/desktop";

type PlansState = {
  plans: Plan[];
  isScanning: boolean;
  error: string | null;
  lastScannedAt: number | null;
  selectedPlanId: string | null;
  scan: () => Promise<void>;
  setSelectedPlanId: (id: string | null) => void;
  reset: () => void;
};

const initialState = {
  plans: [] as Plan[],
  isScanning: false,
  error: null as string | null,
  lastScannedAt: null as number | null,
  selectedPlanId: null as string | null,
};

export const usePlansStore = create<PlansState>((set, get) => ({
  ...initialState,
  scan: async () => {
    if (get().isScanning) {
      return;
    }

    set({ isScanning: true, error: null });

    try {
      const plans = await scanPlans();
      const selectedPlanId = get().selectedPlanId;
      const selectedStillExists =
        selectedPlanId !== null && plans.some((plan) => plan.id === selectedPlanId);

      set({
        plans,
        isScanning: false,
        lastScannedAt: Date.now(),
        selectedPlanId: selectedStillExists ? selectedPlanId : null,
      });
    } catch (scanError: unknown) {
      set({
        isScanning: false,
        error: scanError instanceof Error ? scanError.message : "Failed to scan plans.",
      });
    }
  },
  setSelectedPlanId: (id) => {
    set({ selectedPlanId: id });
  },
  reset: () => {
    set(initialState);
  },
}));
