import type { AppConfig } from "@planview/shared/config";
import { parsePlanFile } from "@planview/shared/plan-parse";
import type { Plan } from "@planview/shared/plan";
import {
  getGlobalScanTargets,
  getProjectScanRoots,
  isPlanFilePath,
  isWithinScanDepth,
  matchesClaudePlanPath,
  matchesCursorPlanPath,
  shouldSkipDirectory,
} from "@planview/shared/scan-targets";
import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

async function directoryExists(path: string): Promise<boolean> {
  try {
    const info = await stat(path);
    return info.isDirectory();
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(directory, entry.name);
      if (entry.isFile() && isPlanFilePath(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Failed to read directory ${directory}:`, error);
  }

  return files;
}

async function walkProjectRoot(root: string): Promise<string[]> {
  const resolvedRoot = resolve(root);
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    if (!isWithinScanDepth(resolvedRoot, currentDir)) {
      return;
    }

    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      console.warn(`Failed to walk directory ${currentDir}:`, error);
      return;
    }

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      const normalized = fullPath.replaceAll("\\", "/");

      if (entry.isDirectory()) {
        if (shouldSkipDirectory(entry.name)) {
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile() || !isPlanFilePath(entry.name)) {
        continue;
      }

      if (matchesCursorPlanPath(normalized) || matchesClaudePlanPath(normalized)) {
        files.push(fullPath);
      }
    }
  }

  if (await directoryExists(resolvedRoot)) {
    await walk(resolvedRoot);
  }

  return files;
}

async function collectScanTargets(config: AppConfig): Promise<string[]> {
  const homeDir = homedir();
  const paths = new Set<string>();

  for (const target of getGlobalScanTargets(homeDir)) {
    if (await directoryExists(target.directory)) {
      const files = await collectMarkdownFiles(target.directory);
      for (const file of files) {
        paths.add(resolve(file));
      }
    }
  }

  for (const target of getProjectScanRoots(config.projectRoots)) {
    const files = await walkProjectRoot(target.root);
    for (const file of files) {
      paths.add(resolve(file));
    }
  }

  return [...paths];
}

async function readPlanFile(filePath: string, homeDir: string): Promise<Plan | null> {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return null;
    }

    const content = await readFile(filePath, "utf8");
    return parsePlanFile(filePath, content, fileStat.mtimeMs, homeDir);
  } catch (error) {
    console.warn(`Failed to read plan file ${filePath}:`, error);
    return null;
  }
}

export async function scanPlans(config: AppConfig): Promise<Plan[]> {
  const homeDir = homedir();
  const filePaths = await collectScanTargets(config);
  const plans: Plan[] = [];

  for (const filePath of filePaths) {
    const plan = await readPlanFile(filePath, homeDir);
    if (plan) {
      plans.push(plan);
    }
  }

  plans.sort((left, right) => right.lastModified - left.lastModified);
  return plans;
}
