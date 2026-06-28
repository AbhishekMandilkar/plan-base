import { describe, expect, test } from "bun:test";

import { countChecklistItems, parsePlanFile } from "./plan-parse";
import { GLOBAL_PROJECT_NAME } from "./plan";

describe("plan-parse", () => {
  test("countChecklistItems counts open and done tasks", () => {
    expect(
      countChecklistItems("# Plan\n\n- [ ] one\n- [x] two\n- [ ] three"),
    ).toEqual({
      totalTasks: 3,
      completedTasks: 1,
    });
  });

  test("parsePlanFile builds a plan from markdown", () => {
    const plan = parsePlanFile(
      "/Users/abhishek/.cursor/plans/example.plan.md",
      "# Example plan\n\n- [ ] task",
      1_700_000_000_000,
      "/Users/abhishek",
    );

    expect(plan.title).toBe("Example plan");
    expect(plan.tool).toBe("cursor");
    expect(plan.project).toBe(GLOBAL_PROJECT_NAME);
    expect(plan.totalTasks).toBe(1);
    expect(plan.completedTasks).toBe(0);
  });
});
