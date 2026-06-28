import { describe, expect, test } from "bun:test";

import type { Plan } from "@planview/shared/plan";

import {
  filterPlans,
  isSamePlanFilter,
  parsePlanFilterFromSearch,
  RECENT_WINDOW_MS,
} from "./plan-filter";

const NOW = 1_700_000_000_000;

function makePlan(overrides: Partial<Plan> = {}): Plan {
  return {
    id: "plan-1",
    title: "Example",
    tool: "cursor",
    project: "planview",
    filePath: "/tmp/example.plan.md",
    lastModified: NOW,
    totalTasks: 2,
    completedTasks: 1,
    preview: "",
    ...overrides,
  };
}

describe("parsePlanFilterFromSearch", () => {
  test("returns all when search is empty", () => {
    expect(parsePlanFilterFromSearch({})).toEqual({ type: "all" });
  });

  test("prioritizes project over agent and view", () => {
    expect(
      parsePlanFilterFromSearch({
        project: "planview",
        agent: "cursor",
        view: "recent",
      }),
    ).toEqual({ type: "project", project: "planview" });
  });

  test("prioritizes agent over view", () => {
    expect(parsePlanFilterFromSearch({ agent: "claude", view: "recent" })).toEqual({
      type: "agent",
      agent: "claude",
    });
  });

  test("parses view filter", () => {
    expect(parsePlanFilterFromSearch({ view: "recent" })).toEqual({
      type: "view",
      view: "recent",
    });
  });
});

describe("filterPlans", () => {
  const plans = [
    makePlan({ id: "recent-open", lastModified: NOW - RECENT_WINDOW_MS + 1_000 }),
    makePlan({
      id: "old-open",
      lastModified: NOW - RECENT_WINDOW_MS - 1_000,
      project: "other",
    }),
    makePlan({
      id: "completed",
      totalTasks: 2,
      completedTasks: 2,
      tool: "claude",
      project: "other",
    }),
    makePlan({ id: "cursor-plan", tool: "cursor", project: "planview" }),
  ];

  test("returns all plans for all filter", () => {
    expect(filterPlans(plans, { type: "all" }, NOW)).toHaveLength(4);
  });

  test("filters recent plans", () => {
    const filtered = filterPlans(plans, { type: "view", view: "recent" }, NOW);
    expect(filtered.map((plan) => plan.id)).toEqual(["recent-open", "completed", "cursor-plan"]);
  });

  test("filters by agent", () => {
    const filtered = filterPlans(plans, { type: "agent", agent: "claude" }, NOW);
    expect(filtered.map((plan) => plan.id)).toEqual(["completed"]);
  });

  test("filters by project", () => {
    const filtered = filterPlans(plans, { type: "project", project: "planview" }, NOW);
    expect(filtered.map((plan) => plan.id)).toEqual(["recent-open", "cursor-plan"]);
  });
});

describe("isSamePlanFilter", () => {
  test("matches equivalent filters", () => {
    expect(isSamePlanFilter({ type: "all" }, { type: "all" })).toBe(true);
    expect(
      isSamePlanFilter({ type: "agent", agent: "cursor" }, { type: "agent", agent: "cursor" }),
    ).toBe(true);
    expect(
      isSamePlanFilter({ type: "project", project: "foo" }, { type: "project", project: "foo" }),
    ).toBe(true);
  });

  test("rejects different filters", () => {
    expect(isSamePlanFilter({ type: "all" }, { type: "view", view: "recent" })).toBe(false);
    expect(
      isSamePlanFilter({ type: "agent", agent: "cursor" }, { type: "agent", agent: "claude" }),
    ).toBe(false);
  });
});
