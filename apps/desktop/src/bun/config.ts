import {
  defaultAppConfig,
  normalizeAppConfig,
  parseAppConfig,
  type AppConfig,
} from "@planview/shared/config";
import { Utils } from "electrobun/bun";
import { mkdirSync } from "node:fs";
import { isAbsolute, join } from "node:path";

const SETTINGS_FILE = "settings.json";

function getSettingsPath(): string {
  mkdirSync(Utils.paths.userData, { recursive: true });
  return join(Utils.paths.userData, SETTINGS_FILE);
}

function validateRoots(roots: string[]): string[] {
  return roots.filter((root) => {
    if (!isAbsolute(root)) {
      console.warn(`Ignoring non-absolute project root: ${root}`);
      return false;
    }
    return true;
  });
}

export async function readConfig(): Promise<AppConfig> {
  const settingsPath = getSettingsPath();
  const file = Bun.file(settingsPath);

  if (!(await file.exists())) {
    return defaultAppConfig;
  }

  try {
    const raw = JSON.parse(await file.text()) as unknown;
    return normalizeAppConfig(parseAppConfig(raw));
  } catch (error) {
    console.warn("Failed to read settings.json, using defaults:", error);
    return defaultAppConfig;
  }
}

export async function writeConfig(config: AppConfig): Promise<AppConfig> {
  const normalized = normalizeAppConfig({
    ...config,
    projectRoots: validateRoots(config.projectRoots),
  });

  await Bun.write(getSettingsPath(), JSON.stringify(normalized, null, 2));
  return normalized;
}
