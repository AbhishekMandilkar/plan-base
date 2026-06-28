import { memo, useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  code: string;
};

export const MermaidDiagram = memo(function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) {
      return;
    }

    void (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
        });

        const { svg } = await mermaid.render(`mermaid-${diagramId}`, code);
        if (!cancelled) {
          container.innerHTML = svg;
          setError(null);
        }
      } catch (renderError: unknown) {
        if (!cancelled) {
          container.innerHTML = "";
          setError(
            renderError instanceof Error ? renderError.message : "Could not render diagram.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, diagramId]);

  if (error) {
    return (
      <div className="rounded-none border border-border bg-muted/40 p-3">
        <p className="mb-2 text-xs text-destructive">{error}</p>
        <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-none border border-border bg-background p-2">
      <div ref={containerRef} className="min-w-max [&_svg]:max-w-none" />
    </div>
  );
});
