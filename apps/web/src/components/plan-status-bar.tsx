import { Button } from "@planview/ui/components/button";
import { RefreshCw } from "lucide-react";

import { formatRelativeTime } from "@/lib/format-relative-time";
import { usePlansStore } from "@/stores/plans-store";

export function PlanStatusBar() {
  const plans = usePlansStore((state) => state.plans);
  const isScanning = usePlansStore((state) => state.isScanning);
  const error = usePlansStore((state) => state.error);
  const lastScannedAt = usePlansStore((state) => state.lastScannedAt);
  const scan = usePlansStore((state) => state.scan);

  const statusText = isScanning
    ? "Scanning for plan files…"
    : lastScannedAt
      ? `${plans.length} plan${plans.length === 1 ? "" : "s"} · Last scanned ${formatRelativeTime(lastScannedAt)}`
      : "Waiting for first scan…";

  return (
    <footer className="electrobun-webkit-app-region-no-drag flex h-7 shrink-0 items-center justify-end gap-3 border-t border-border px-3 text-xs text-muted-foreground">
      {error ? <span className="truncate text-destructive">{error}</span> : null}
      <span className="truncate">{statusText}</span>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="h-6 shrink-0 px-2 text-xs text-muted-foreground hover:text-foreground"
        disabled={isScanning}
        onClick={() => {
          void scan();
        }}
      >
        <RefreshCw className={isScanning ? "animate-spin" : undefined} />
        Rescan
      </Button>
    </footer>
  );
}
