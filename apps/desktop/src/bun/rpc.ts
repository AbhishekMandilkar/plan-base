import type { PlanviewRPCSchema } from "@planview/shared/rpc";
import { BrowserView, Utils } from "electrobun/bun";
import { homedir } from "node:os";

import { readConfig, writeConfig } from "./config";

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
    },
  },
});
