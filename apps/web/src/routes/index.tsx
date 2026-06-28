import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@planview/ui/components/empty";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutList } from "lucide-react";

import Loader from "@/components/loader";
import { Onboarding } from "@/components/onboarding";
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
    <Empty className="h-full border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutList />
        </EmptyMedia>
        <EmptyTitle>No plans found yet</EmptyTitle>
        <EmptyDescription>
          Scanning {projectRoots.length} project folder{projectRoots.length === 1 ? "" : "s"}. Plan
          cards will appear here once the scanner is wired up.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
