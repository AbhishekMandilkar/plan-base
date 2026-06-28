import { AGENTS_BY_ID } from "@planview/shared/agents";
import type { Plan } from "@planview/shared/plan";
import { Button } from "@planview/ui/components/button";
import { ScrollArea } from "@planview/ui/components/scroll-area";
import { Skeleton } from "@planview/ui/components/skeleton";
import { ExternalLink, FolderOpen } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";

import { PlanMarkdown } from "@/components/plan-markdown";
import { usePlanContent } from "@/hooks/use-plan-content";
import { AgentIcon } from "@/lib/agents";
import { openFile, revealInFinder } from "@/lib/desktop";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { usePlansStore } from "@/stores/plans-store";

type PlanDetailPanelProps = {
  plan: Plan | null;
};

function DetailSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export const PlanDetailPanel = memo(function PlanDetailPanel({ plan }: PlanDetailPanelProps) {
  const lastScannedAt = usePlansStore((state) => state.lastScannedAt);
  const { content, isLoading, error, reload } = usePlanContent(plan, lastScannedAt);

  if (!plan) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-center text-sm text-muted-foreground">
          Select a plan to view its contents.
        </p>
      </div>
    );
  }

  const handleOpenInEditor = async () => {
    try {
      await openFile(plan.filePath);
    } catch (openError: unknown) {
      toast.error(openError instanceof Error ? openError.message : "Could not open this plan.");
    }
  };

  const handleRevealInFinder = async () => {
    try {
      await revealInFinder(plan.filePath);
    } catch (revealError: unknown) {
      toast.error(
        revealError instanceof Error ? revealError.message : "Could not reveal this plan.",
      );
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold leading-snug">{plan.title}</h2>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <AgentIcon
            agent={plan.tool}
            className="size-3 shrink-0"
            aria-label={AGENTS_BY_ID[plan.tool].label}
          />
          <span className="truncate">{plan.project}</span>
          <span aria-hidden className="text-muted-foreground/50">
            ·
          </span>
          <span className="shrink-0">{formatRelativeTime(plan.lastModified)}</span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? <DetailSkeleton /> : null}
        {!isLoading && error ? (
          <div className="space-y-3 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button type="button" variant="outline" size="sm" onClick={reload}>
              Retry
            </Button>
          </div>
        ) : null}
        {!isLoading && !error && content ? (
          <div className="p-4">
            <PlanMarkdown markdown={content.body} />
          </div>
        ) : null}
      </ScrollArea>

      <div className="shrink-0 space-y-2 border-t border-border p-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleOpenInEditor}
        >
          <ExternalLink className="size-3.5" />
          Open in editor
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleRevealInFinder}
        >
          <FolderOpen className="size-3.5" />
          Show in Finder
        </Button>
      </div>
    </div>
  );
});
