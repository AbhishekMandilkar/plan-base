import { Badge } from "@planview/ui/components/badge";
import { Button } from "@planview/ui/components/button";
import { ScrollArea } from "@planview/ui/components/scroll-area";
import { FolderOpen, Plus, X } from "lucide-react";

type ProjectRootsEditorProps = {
  roots: string[];
  onAdd: () => void;
  onRemove: (path: string) => void;
  isPickerPending?: boolean;
  emptyMessage?: string;
};

export function ProjectRootsEditor({
  roots,
  onAdd,
  onRemove,
  isPickerPending = false,
  emptyMessage = "No project folders yet. Add one to scan for plan files.",
}: ProjectRootsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Project folders</p>
          <p className="text-xs text-muted-foreground">
            Planview scans these directories for Cursor and Claude Code plans.
          </p>
        </div>
        <Badge variant="secondary">{roots.length}</Badge>
      </div>

      <ScrollArea className="h-48 rounded-md border border-border/80 bg-muted/20">
        {roots.length === 0 ? (
          <div className="flex h-48 items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <ul className="divide-y divide-border/70 p-2">
            {roots.map((root) => (
              <li
                key={root}
                className="group flex items-start gap-2 rounded-sm px-2 py-2.5 hover:bg-muted/40"
              >
                <FolderOpen className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs leading-5">{root}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${root}`}
                  onClick={() => onRemove(root)}
                >
                  <X className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      <Button type="button" variant="outline" disabled={isPickerPending} onClick={onAdd}>
        <Plus className="size-4" />
        {isPickerPending ? "Opening picker..." : "Add folder"}
      </Button>
    </div>
  );
}
