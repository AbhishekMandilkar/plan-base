import { Button } from "@planview/ui/components/button";
import { ArrowRight } from "lucide-react";

import { GITHUB_RELEASES_URL } from "@/lib/routes";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"
      />
    </svg>
  );
}

const features = [
  {
    title: "Indexed",
    body: "Watches Cursor, Claude Code, and project folders.",
  },
  {
    title: "Searchable",
    body: "Full-text search. Filter by agent or project.",
  },
  {
    title: "Private",
    body: "Everything stays on your Mac. No cloud.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50 text-zinc-900">
      <header className="flex shrink-0 items-center justify-between px-6 py-4 md:px-10 lg:px-14">
        <span className="motion-safe:animate-fade-up text-sm font-medium tracking-tight">
          Planbase
        </span>
        <a
          href="https://github.com/AbhishekMandilkar/planview"
          className="motion-safe:animate-fade-up text-zinc-400 transition-colors duration-200 hover:text-zinc-900 [animation-delay:60ms]"
        >
          <GithubIcon className="size-5" />
        </a>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col justify-center px-6 md:px-10 lg:px-14">
        <p className="motion-safe:animate-fade-up mb-4 text-sm text-zinc-500 [animation-delay:80ms] md:mb-5">
          Your AI plans are scattered everywhere.
        </p>

        <h1 className="motion-safe:animate-fade-up text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight [animation-delay:140ms]">
          Find any plan from two weeks ago{" "}
          <span className="text-zinc-400">in two seconds.</span>
        </h1>

        <p className="motion-safe:animate-fade-up mt-4 max-w-md text-sm leading-relaxed text-zinc-500 [animation-delay:200ms] md:mt-5 md:text-base">
          Planbase indexes every AI agent plan on your Mac. Search by project,
          filter by tool, open in your editor.
        </p>

        <div className="motion-safe:animate-fade-up mt-6 [animation-delay:260ms] md:mt-7">
          <Button
            size="lg"
            className="group h-11 gap-2 px-5 text-sm active:scale-[0.97] active:duration-60"
            style={{
              transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            render={<a href={GITHUB_RELEASES_URL} />}
          >
            Download for macOS
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
          </Button>
          <p className="mt-2.5 text-xs text-zinc-400 md:text-sm">
            Free, 4MB, local-only
          </p>

          <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-6 md:mt-10 md:gap-5 md:pt-7">
            {features.map(({ title, body }, i) => (
              <div
                key={title}
                className="motion-safe:animate-fade-up"
                style={{ animationDelay: `${320 + i * 60}ms` }}
              >
                <p className="text-sm font-medium text-zinc-900">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="shrink-0 px-6 py-4 md:px-10 md:py-5 lg:px-14">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="motion-safe:animate-fade-up text-xs leading-relaxed text-zinc-400 [animation-delay:500ms]">
            Built by a developer who got tired of running{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[10px] text-zinc-600 md:text-xs">
              cd ~/.cursor/plans && ls
            </code>{" "}
            every day.
          </p>
        </div>
      </footer>
    </div>
  );
}
