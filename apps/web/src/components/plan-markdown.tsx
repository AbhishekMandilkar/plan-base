import { Checkbox } from "@planview/ui/components/checkbox";
import { cn } from "@planview/ui/lib/utils";
import { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { MermaidDiagram } from "@/components/mermaid-diagram";

type PlanMarkdownProps = {
  markdown: string;
  className?: string;
};

export const PlanMarkdown = memo(function PlanMarkdown({ markdown, className }: PlanMarkdownProps) {
  const components = useMemo<Components>(
    () => ({
      h1: ({ children }) => (
        <h1 className="text-base font-semibold tracking-tight">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      ),
      h3: ({ children }) => <h3 className="text-sm font-medium">{children}</h3>,
      p: ({ children }) => <p className="text-sm leading-relaxed text-foreground">{children}</p>,
      ul: ({ children, className: listClassName }) => (
        <ul className={cn("list-disc space-y-1 pl-4 text-sm", listClassName)}>{children}</ul>
      ),
      ol: ({ children }) => <ol className="list-decimal space-y-1 pl-4 text-sm">{children}</ol>,
      li: ({ children, className: itemClassName }) => (
        <li className={cn("leading-relaxed", itemClassName)}>{children}</li>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-border pl-3 text-sm text-muted-foreground">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="border-border" />,
      a: ({ children }) => (
        <span className="text-muted-foreground underline decoration-border underline-offset-2">
          {children}
        </span>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-border bg-muted/50 px-2 py-1 text-left font-medium">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-border px-2 py-1 align-top">{children}</td>
      ),
      code: ({ className, children }) => {
        const text = String(children).replace(/\n$/, "");
        const match = /language-(\w+)/.exec(className ?? "");
        const language = match?.[1];

        if (language === "mermaid") {
          return <MermaidDiagram code={text} />;
        }

        const isBlock = className?.includes("language-");
        if (isBlock) {
          return (
            <code className="block overflow-x-auto font-mono text-[11px] leading-relaxed">
              {text}
            </code>
          );
        }

        return (
          <code className="rounded-none bg-muted px-1 py-0.5 font-mono text-[11px]">{text}</code>
        );
      },
      pre: ({ children }) => (
        <pre className="overflow-x-auto rounded-none border border-border bg-muted/40 p-3">
          {children}
        </pre>
      ),
      input: ({ checked, disabled, type, ...props }) => {
        if (type !== "checkbox") {
          return <input checked={checked} disabled={disabled} type={type} {...props} />;
        }

        return (
          <Checkbox
            checked={Boolean(checked)}
            disabled
            className="pointer-events-none mr-2 align-middle"
            aria-hidden
          />
        );
      },
    }),
    [],
  );

  return (
    <div className={cn("plan-markdown space-y-3", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
});
