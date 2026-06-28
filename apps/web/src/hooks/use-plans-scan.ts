import { useEffect, useRef } from "react";

import { useAppConfig } from "@/hooks/use-app-config";
import { usePlansStore } from "@/stores/plans-store";

const FOCUS_RESCAN_DEBOUNCE_MS = 2_000;

export function usePlansScan(enabled: boolean): void {
  const { projectRoots } = useAppConfig();
  const scan = usePlansStore((state) => state.scan);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootsKey = projectRoots.join("\0");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void scan();
  }, [enabled, rootsKey, scan]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const scheduleScan = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        void scan();
      }, FOCUS_RESCAN_DEBOUNCE_MS);
    };

    window.addEventListener("focus", scheduleScan);

    return () => {
      window.removeEventListener("focus", scheduleScan);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, scan]);
}
