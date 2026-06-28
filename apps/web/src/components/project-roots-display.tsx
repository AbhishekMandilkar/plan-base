import { Badge } from "@planview/ui/components/badge";
import { ScrollArea } from "@planview/ui/components/scroll-area";
import { FolderOpen } from "lucide-react";

type ProjectRootsDisplayProps = {
  roots: string[];
};

export function ProjectRootsDisplay({ roots }: ProjectRootsDisplayProps) {
  return (
    <section className="rounded-lg border border-border/80 bg-card/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Saved project roots</h2>
          <p className="text-xs text-muted-foreground">
            These folders will be scanned when the filesystem indexer ships in Phase 3.
          </p>
        </div>
        <Badge variant="secondary">{roots.length}</Badge>
      </div>

      {roots.length === 0 ? (
        <p className="text-sm text-muted-foreground">No project folders configured.</p>
      ) : (
        <ScrollArea className="max-h-64 rounded-md border border-border/70">
          <ul className="divide-y divide-border/70">
            {roots.map((root) => (
              <li key={root} className="flex items-start gap-2 px-3 py-2.5">
                <FolderOpen className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <span className="min-w-0 flex-1 break-all font-mono text-xs leading-5">{root}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </section>
  );
}
