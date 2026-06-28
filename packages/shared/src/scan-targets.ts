import { join } from "node:path";

export const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "out",
  "coverage",
  ".cache",
]);

export const MAX_SCAN_DEPTH = 3;

export type GlobalScanTarget = {
  kind: "global";
  directory: string;
  tool: "cursor" | "claude";
};

export type ProjectScanRoot = {
  kind: "project-root";
  root: string;
};

export type ScanTarget = GlobalScanTarget | ProjectScanRoot;

export function getGlobalScanTargets(homeDir: string): GlobalScanTarget[] {
  return [
    { kind: "global", directory: join(homeDir, ".cursor", "plans"), tool: "cursor" },
    { kind: "global", directory: join(homeDir, ".claude"), tool: "claude" },
    { kind: "global", directory: join(homeDir, ".claude", "plans"), tool: "claude" },
  ];
}

export function getProjectScanRoots(projectRoots: string[]): ProjectScanRoot[] {
  return projectRoots.map((root) => ({
    kind: "project-root" as const,
    root,
  }));
}

export function shouldSkipDirectory(name: string): boolean {
  return SKIP_DIR_NAMES.has(name);
}

export function isWithinScanDepth(root: string, currentDir: string): boolean {
  const normalizedRoot = root.replaceAll("\\", "/").replace(/\/$/, "");
  const normalizedCurrent = currentDir.replaceAll("\\", "/").replace(/\/$/, "");

  if (!normalizedCurrent.startsWith(normalizedRoot)) {
    return false;
  }

  const relative = normalizedCurrent.slice(normalizedRoot.length).replace(/^\//, "");
  if (!relative) {
    return true;
  }

  const depth = relative.split("/").filter(Boolean).length;
  return depth <= MAX_SCAN_DEPTH;
}

export function isPlanFilePath(filePath: string): boolean {
  return filePath.endsWith(".md");
}

export function matchesCursorPlanPath(normalizedPath: string): boolean {
  return normalizedPath.includes("/.cursor/plans/") && normalizedPath.endsWith(".md");
}

export function matchesClaudePlanPath(normalizedPath: string): boolean {
  if (!normalizedPath.endsWith(".md")) {
    return false;
  }

  const claudeIndex = normalizedPath.lastIndexOf("/.claude/");
  if (claudeIndex === -1) {
    return false;
  }

  const afterClaude = normalizedPath.slice(claudeIndex + "/.claude/".length);
  return !afterClaude.includes("/");
}
