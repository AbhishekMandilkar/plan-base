import { z } from "zod";

export const appConfigSchema = z.object({
  projectRoots: z.array(z.string()),
  onboardingComplete: z.boolean(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export const defaultAppConfig: AppConfig = {
  projectRoots: [],
  onboardingComplete: false,
};

export function normalizeAppConfig(config: AppConfig): AppConfig {
  const seen = new Set<string>();
  const projectRoots: string[] = [];

  for (const root of config.projectRoots) {
    const trimmed = root.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    projectRoots.push(trimmed);
  }

  return {
    projectRoots,
    onboardingComplete: config.onboardingComplete,
  };
}

export function parseAppConfig(raw: unknown): AppConfig {
  const result = appConfigSchema.safeParse(raw);
  if (!result.success) {
    return defaultAppConfig;
  }
  return normalizeAppConfig(result.data);
}
