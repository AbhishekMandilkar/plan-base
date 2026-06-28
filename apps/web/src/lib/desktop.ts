import {
  defaultAppConfig,
  normalizeAppConfig,
  parseAppConfig,
  type AppConfig,
} from "@planview/shared/config";
import type { Plan } from "@planview/shared/plan";
import type { PlanviewRPCSchema } from "@planview/shared/rpc";
import { Electroview } from "electrobun/view";

const STORAGE_KEY = "planview-config";

type RpcInstance = ReturnType<typeof Electroview.defineRPC<PlanviewRPCSchema>>;

let rpc: RpcInstance | null = null;
let electroview: Electroview<RpcInstance> | null = null;

function hasElectrobunBridge(): boolean {
  return (
    typeof window !== "undefined" &&
    (Boolean(window.__electrobun) ||
      Boolean(window.__electrobunWebviewId) ||
      Boolean(window.__electrobunRpcSocketPort))
  );
}

function readWebFallbackConfig(): AppConfig {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultAppConfig;
  }

  try {
    return normalizeAppConfig(parseAppConfig(JSON.parse(raw) as unknown));
  } catch {
    return defaultAppConfig;
  }
}

function writeWebFallbackConfig(config: AppConfig): AppConfig {
  const normalized = normalizeAppConfig(config);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function initDesktopBridge(): void {
  if (!hasElectrobunBridge() || electroview) {
    return;
  }

  rpc = Electroview.defineRPC<PlanviewRPCSchema>({
    maxRequestTime: 30_000,
    handlers: {
      requests: {},
      messages: {},
    },
  });

  electroview = new Electroview({ rpc });
}

export function isDesktop(): boolean {
  return hasElectrobunBridge();
}

function getRpc(): RpcInstance {
  if (!rpc) {
    throw new Error("Desktop bridge is not initialized.");
  }
  return rpc;
}

export async function getConfig(): Promise<AppConfig> {
  if (isDesktop()) {
    return getRpc().request.getConfig();
  }
  return readWebFallbackConfig();
}

export async function setConfig(config: AppConfig): Promise<AppConfig> {
  if (isDesktop()) {
    await getRpc().request.setConfig(config);
    return normalizeAppConfig(config);
  }
  return writeWebFallbackConfig(config);
}

export async function pickDirectory(): Promise<string | null> {
  if (isDesktop()) {
    return getRpc().request.pickDirectory();
  }

  const path = window.prompt("Enter an absolute project root path:");
  if (!path?.trim()) {
    return null;
  }
  return path.trim();
}

export async function scanPlans(): Promise<Plan[]> {
  if (isDesktop()) {
    return getRpc().request.scanPlans();
  }
  return [];
}
