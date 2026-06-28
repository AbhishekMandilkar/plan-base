import matter from "gray-matter";

export type PlanContent = {
  filePath: string;
  raw: string;
  body: string;
  frontmatter: Record<string, unknown>;
};

export function parsePlanContent(filePath: string, raw: string): PlanContent {
  const { content, data } = matter(raw);

  return {
    filePath,
    raw,
    body: content.trim(),
    frontmatter: (data ?? {}) as Record<string, unknown>,
  };
}
