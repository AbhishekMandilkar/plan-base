import type { PlanContent } from "@planview/shared/plan-content";
import type { Plan } from "@planview/shared/plan";
import { useCallback, useEffect, useRef, useState } from "react";

import { readPlanContent } from "@/lib/desktop";

type CacheEntry = {
  content: PlanContent;
  lastModified: number;
};

const contentCache = new Map<string, CacheEntry>();

function getCacheKey(filePath: string, lastModified: number): string {
  return `${filePath}\0${lastModified}`;
}

export function invalidatePlanContentCache(filePath?: string): void {
  if (!filePath) {
    contentCache.clear();
    return;
  }

  for (const key of contentCache.keys()) {
    if (key.startsWith(`${filePath}\0`)) {
      contentCache.delete(key);
    }
  }
}

type UsePlanContentResult = {
  content: PlanContent | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

export function usePlanContent(plan: Plan | null, refreshKey: number | null): UsePlanContentResult {
  const [content, setContent] = useState<PlanContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const requestIdRef = useRef(0);

  const reload = useCallback(() => {
    if (plan) {
      invalidatePlanContentCache(plan.filePath);
    }
    setReloadToken((value) => value + 1);
  }, [plan]);

  useEffect(() => {
    if (!plan) {
      setContent(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey = getCacheKey(plan.filePath, plan.lastModified);
    const cached = contentCache.get(cacheKey);
    if (cached) {
      setContent(cached.content);
      setIsLoading(false);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    void readPlanContent(plan.filePath).then((loaded) => {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!loaded) {
        setContent(null);
        setIsLoading(false);
        setError("Could not load this plan.");
        return;
      }

      contentCache.set(cacheKey, {
        content: loaded,
        lastModified: plan.lastModified,
      });
      setContent(loaded);
      setIsLoading(false);
      setError(null);
    });

    return () => {
      requestIdRef.current += 1;
    };
  }, [plan, plan?.filePath, plan?.lastModified, reloadToken, refreshKey]);

  return { content, isLoading, error, reload };
}
