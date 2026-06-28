import { z } from "zod";

import { AGENT_IDS } from "./agents";

export const GLOBAL_PROJECT_NAME = "Global";

export const planSchema = z.object({
  id: z.string(),
  title: z.string(),
  tool: z.enum(AGENT_IDS),
  project: z.string(),
  filePath: z.string(),
  lastModified: z.number(),
  totalTasks: z.number(),
  completedTasks: z.number(),
  preview: z.string(),
});

export type Plan = z.infer<typeof planSchema>;
