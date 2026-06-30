import { Button } from "@planview/ui/components/button";
import { Download } from "lucide-react";

import { GITHUB_RELEASES_URL } from "@/lib/routes";

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-foreground">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-sm font-semibold tracking-tight">Planbase</span>
        <a
          href="https://github.com/AbhishekMandilkar/planview"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          GitHub
        </a>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cursor and Claude Code scatter your plans across{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">~/.cursor/plans/</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">~/.claude/</code>, and
            every project folder.
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find that plan from two weeks ago in 2 seconds
          </h1>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Planbase indexes every AI agent plan on your Mac. Search by project, filter by tool,
            open in your editor with one click.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              className="h-11 gap-2 px-5 text-sm"
              render={<a href={GITHUB_RELEASES_URL} />}
            >
              <Download className="size-4" />
              Download for macOS
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Free. 4MB. Your files never leave your Mac.
            </p>
          </div>

          <div className="pt-4">
            <AppPreviewMock />
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Built by a dev who got tired of{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
            cd ~/.cursor/plans && ls
          </code>
        </p>
      </footer>
    </div>
  );
}

function AppPreviewMock() {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-border bg-background shadow-lg">
      <div className="flex h-7 items-center gap-1.5 border-b border-border bg-muted/50 px-3">
        <div className="size-2.5 rounded-full bg-[#ff5f57]" />
        <div className="size-2.5 rounded-full bg-[#febc2e]" />
        <div className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-muted-foreground">Planbase</span>
      </div>

      <div className="flex h-56 text-left text-[10px]">
        <div className="w-32 shrink-0 border-r border-border bg-muted/30 p-2">
          <p className="mb-2 text-[9px] font-medium text-muted-foreground">Plans</p>
          <div className="space-y-1">
            <div className="rounded bg-muted px-1.5 py-1 text-foreground">All</div>
            <div className="px-1.5 py-1 text-muted-foreground">Recent</div>
          </div>
          <p className="mb-2 mt-4 text-[9px] font-medium text-muted-foreground">Agents</p>
          <div className="space-y-1">
            <div className="px-1.5 py-1 text-muted-foreground">Cursor</div>
            <div className="px-1.5 py-1 text-muted-foreground">Claude Code</div>
          </div>
        </div>

        <div className="flex-1 border-r border-border p-2">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-5 flex-1 rounded border border-border bg-background px-2 text-[9px] leading-5 text-muted-foreground">
              Search plans...
            </div>
          </div>
          <div className="space-y-1.5">
            <PlanRowMock title="Refactor auth module" project="api-server" tool="cursor" active />
            <PlanRowMock title="Add dark mode support" project="dashboard" tool="claude" />
            <PlanRowMock title="Database migration plan" project="backend" tool="cursor" />
            <PlanRowMock title="Component library setup" project="ui-kit" tool="claude" />
          </div>
        </div>

        <div className="w-40 shrink-0 p-2">
          <p className="text-[9px] font-medium">Refactor auth module</p>
          <p className="mt-0.5 text-[8px] text-muted-foreground">api-server / Cursor</p>
          <div className="mt-3 space-y-1 text-[8px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-sm border border-foreground bg-foreground" />
              <span className="line-through">Extract token refresh</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-sm border border-foreground bg-foreground" />
              <span className="line-through">Add session middleware</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-sm border border-border" />
              <span>Update error handling</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-sm border border-border" />
              <span>Write tests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanRowMock({
  title,
  project,
  tool,
  active,
}: {
  title: string;
  project: string;
  tool: "cursor" | "claude";
  active?: boolean;
}) {
  return (
    <div
      className={`rounded px-1.5 py-1.5 ${active ? "bg-muted" : "hover:bg-muted/50"}`}
    >
      <p className="truncate font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-[8px] text-muted-foreground">
        {project} / {tool === "cursor" ? "Cursor" : "Claude Code"}
      </p>
    </div>
  );
}
