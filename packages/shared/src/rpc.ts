import type { AppConfig } from "./config";

export type PlanviewRPCSchema = {
  bun: {
    requests: {
      getConfig: { params: void; response: AppConfig };
      setConfig: { params: AppConfig; response: void };
      pickDirectory: { params: void; response: string | null };
    };
    messages: Record<string, never>;
  };
  webview: {
    requests: Record<string, never>;
    messages: Record<string, never>;
  };
};
