import type { AppConfig } from "@planview/shared/config";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { getConfig, pickDirectory, setConfig } from "@/lib/desktop";

type AppConfigContextValue = {
  config: AppConfig | null;
  projectRoots: string[];
  isLoading: boolean;
  error: string | null;
  needsOnboarding: boolean;
  isPickerPending: boolean;
  updateConfig: (next: AppConfig) => Promise<AppConfig>;
  addRoot: () => Promise<string | null>;
  removeRoot: (path: string) => Promise<AppConfig | null>;
  completeOnboarding: () => Promise<AppConfig | null>;
};

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPickerPending, startPickerTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    getConfig()
      .then((loaded) => {
        if (!cancelled) {
          setConfigState(loaded);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load settings.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const needsOnboarding = config ? !config.onboardingComplete : false;
  const projectRoots = useMemo(() => config?.projectRoots ?? [], [config?.projectRoots]);

  const updateConfig = useCallback(async (next: AppConfig) => {
    const saved = await setConfig(next);
    setConfigState(saved);
    setError(null);
    return saved;
  }, []);

  const addRoot = useCallback(async () => {
    return new Promise<string | null>((resolve) => {
      startPickerTransition(() => {
        void (async () => {
          try {
            const pickedPath = await pickDirectory();
            if (!pickedPath || !config) {
              resolve(null);
              return;
            }

            if (config.projectRoots.includes(pickedPath)) {
              resolve(null);
              return;
            }

            await updateConfig({
              ...config,
              projectRoots: [...config.projectRoots, pickedPath],
            });
            resolve(pickedPath);
          } catch (pickError: unknown) {
            setError(pickError instanceof Error ? pickError.message : "Failed to add folder.");
            resolve(null);
          }
        })();
      });
    });
  }, [config, updateConfig, startPickerTransition]);

  const removeRoot = useCallback(
    async (path: string) => {
      if (!config) {
        return null;
      }

      return updateConfig({
        ...config,
        projectRoots: config.projectRoots.filter((root) => root !== path),
      });
    },
    [config, updateConfig],
  );

  const completeOnboarding = useCallback(async () => {
    if (!config || config.projectRoots.length === 0) {
      return null;
    }

    return updateConfig({
      ...config,
      onboardingComplete: true,
    });
  }, [config, updateConfig]);

  const value = useMemo(
    () => ({
      config,
      projectRoots,
      isLoading,
      error,
      needsOnboarding,
      isPickerPending,
      updateConfig,
      addRoot,
      removeRoot,
      completeOnboarding,
    }),
    [
      config,
      projectRoots,
      isLoading,
      error,
      needsOnboarding,
      isPickerPending,
      updateConfig,
      addRoot,
      removeRoot,
      completeOnboarding,
    ],
  );

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

export function useAppConfig(): AppConfigContextValue {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error("useAppConfig must be used within AppConfigProvider.");
  }
  return context;
}
