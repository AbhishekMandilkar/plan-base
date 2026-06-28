import type { PlanviewRPCSchema } from "@planview/shared/rpc";
import { BrowserView, Utils } from "electrobun/bun";
import { homedir } from "node:os";

import { readConfig, writeConfig } from "./config";
import { readPlanContent, scanPlans } from "./scanner";

export const planviewRpc = BrowserView.defineRPC<PlanviewRPCSchema>({
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      getConfig: async () => readConfig(),
      setConfig: async (config) => {
        await writeConfig(config);
      },
      pickDirectory: async () => {
        const chosenPaths = await Utils.openFileDialog({
          startingFolder: homedir(),
          canChooseFiles: false,
          canChooseDirectory: true,
          allowsMultipleSelection: false,
        });

        const [firstPath] = chosenPaths.filter(Boolean);
        return firstPath ?? null;
      },
      scanPlans: async () => {
        const config = await readConfig();
        return scanPlans(config);
      },
      readPlanContent: async ({ filePath }) => {
        const content = await readPlanContent(filePath);
        if (!content) {
          throw new Error(`Could not read plan at ${filePath}`);
        }
        return content;
      },
      openFile: async ({ filePath }) => {
        const opened = Utils.openPath(filePath);
        if (!opened) {
          throw new Error(`Could not open ${filePath}`);
        }
      },
      revealInFinder: async ({ filePath }) => {
        Utils.showItemInFolder(filePath);
      },
    },
  },
});
