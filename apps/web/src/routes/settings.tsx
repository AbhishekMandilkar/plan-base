import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import Loader from "@/components/loader";
import { ProjectRootsEditor } from "@/components/project-roots-editor";
import { useAppConfig } from "@/hooks/use-app-config";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const { isLoading, needsOnboarding, projectRoots, addRoot, removeRoot, isPickerPending, error } =
    useAppConfig();

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-muted-foreground">Finish onboarding before changing settings.</p>
      </div>
    );
  }

  const handleAddRoot = async () => {
    const added = await addRoot();
    if (added) {
      toast.success("Folder added.");
    }
  };

  const handleRemoveRoot = async (path: string) => {
    try {
      await removeRoot(path);
      toast.success("Folder removed.");
    } catch (removeError: unknown) {
      toast.error(
        removeError instanceof Error ? removeError.message : "Could not remove that folder.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <p className="text-sm text-muted-foreground">
        Add or remove the directories Planbase scans for agent plan files.
      </p>

      <ProjectRootsEditor
        roots={projectRoots}
        onAdd={handleAddRoot}
        onRemove={handleRemoveRoot}
        isPickerPending={isPickerPending}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
