import { createFileRoute } from "@tanstack/react-router";

import Loader from "@/components/loader";
import { Onboarding } from "@/components/onboarding";
import { ProjectRootsDisplay } from "@/components/project-roots-display";
import { useAppConfig } from "@/hooks/use-app-config";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { isLoading, needsOnboarding, projectRoots } = useAppConfig();

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (needsOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Planview</p>
        <h1 className="text-2xl font-semibold tracking-tight">Your workspace is ready</h1>
        <p className="text-sm text-muted-foreground">
          Project roots are saved. The plan scanner arrives in the next phase.
        </p>
      </div>
      <ProjectRootsDisplay roots={projectRoots} />
    </div>
  );
}
