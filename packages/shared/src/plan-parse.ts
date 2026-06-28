import { basename } from "node:path";

import type { AgentId } from "./agents";
import type { Plan } from "./plan";
import { GLOBAL_PROJECT_NAME } from "./plan";

const H1_PATTERN = /^#\s+(.+)$/;

export function extractTitle(content: string, filePath: string): string {
  for (const line of content.split("\n")) {
    const match = line.match(H1_PATTERN);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  const filename = basename(filePath);
  return filename.endsWith(".md") ? filename.slice(0, -3) : filename;
}

export function countChecklistItems(content: string): {
  totalTasks: number;
  completedTasks: number;
} {
  const openPattern = /^- \[ \]/;
  const donePattern = /^- \[x\]/;
  let totalTasks = 0;
  let completedTasks = 0;

  for (const line of content.split("\n")) {
    if (openPattern.test(line)) {
      totalTasks += 1;
    } else if (donePattern.test(line)) {
      totalTasks += 1;
      completedTasks += 1;
    }
  }

  return { totalTasks, completedTasks };
}

export function extractPreview(content: string): string {
  const lines = content.split("\n");
  let startIndex = 0;

  for (let index = 0; index < lines.length; index += 1) {
    if (H1_PATTERN.test(lines[index] ?? "")) {
      startIndex = index + 1;
      break;
    }
  }

  const body = lines.slice(startIndex).join("\n").trim();
  if (body.length <= 200) {
    return body;
  }

  return `${body.slice(0, 200).trimEnd()}…`;
}

export function inferToolFromPath(filePath: string): AgentId {
  const normalized = filePath.replaceAll("\\", "/");
  if (normalized.includes("/.claude/")) {
    return "claude";
  }
  return "cursor";
}

export function inferProjectFromPath(filePath: string, homeDir: string): string {
  const normalized = filePath.replaceAll("\\", "/");
  const normalizedHome = homeDir.replaceAll("\\", "/").replace(/\/$/, "");

  const globalPatterns = [
    `${normalizedHome}/.cursor/plans/`,
    `${normalizedHome}/.claude/plans/`,
    `${normalizedHome}/.claude/`,
  ];

  for (const pattern of globalPatterns) {
    if (normalized.startsWith(pattern)) {
      return GLOBAL_PROJECT_NAME;
    }
  }

  const segments = normalized.split("/");
  const cursorIndex = segments.lastIndexOf(".cursor");
  const claudeIndex = segments.lastIndexOf(".claude");
  const agentIndex = Math.max(cursorIndex, claudeIndex);

  if (agentIndex > 0) {
    return segments[agentIndex - 1] ?? "Unknown";
  }

  return "Unknown";
}

export function parsePlanFile(
  filePath: string,
  content: string,
  lastModified: number,
  homeDir: string,
): Plan {
  const { totalTasks, completedTasks } = countChecklistItems(content);

  return {
    id: filePath,
    title: extractTitle(content, filePath),
    tool: inferToolFromPath(filePath),
    project: inferProjectFromPath(filePath, homeDir),
    filePath,
    lastModified,
    totalTasks,
    completedTasks,
    preview: extractPreview(content),
  };
}
