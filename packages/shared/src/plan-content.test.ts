import { describe, expect, test } from "bun:test";

import { parsePlanContent } from "./plan-content";

describe("parsePlanContent", () => {
  test("strips YAML frontmatter and returns body", () => {
    const raw = `---
title: Example
---

# Hello

- [ ] task one`;

    const parsed = parsePlanContent("/tmp/plan.md", raw);

    expect(parsed.body).toBe("# Hello\n\n- [ ] task one");
    expect(parsed.frontmatter).toEqual({ title: "Example" });
    expect(parsed.raw).toBe(raw);
    expect(parsed.filePath).toBe("/tmp/plan.md");
  });

  test("passes through markdown without frontmatter", () => {
    const raw = "# Title only\n\nBody text.";

    const parsed = parsePlanContent("/tmp/plain.md", raw);

    expect(parsed.body).toBe(raw);
    expect(parsed.frontmatter).toEqual({});
  });
});
