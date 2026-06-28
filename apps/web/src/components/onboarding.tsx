import { Button } from "@planview/ui/components/button";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ProjectRootsEditor } from "@/components/project-roots-editor";
import { useAppConfig } from "@/hooks/use-app-config";

export function Onboarding() {
  const navigate = useNavigate();
  const { projectRoots, addRoot, removeRoot, completeOnboarding, isPickerPending, error } =
    useAppConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      toast.success("Project folders saved.");
      await navigate({ to: "/" });
    } catch (submitError: unknown) {
      toast.error(
        submitError instanceof Error ? submitError.message : "Could not save your settings.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-8">
        <div className="space-y-3 pt-2">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Setup</p>
          <h1 className="text-3xl font-semibold tracking-tight">Find your agent plans</h1>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground">
            Planview collects markdown plans from Cursor and Claude Code. Point it at the folders
            where you keep projects so it knows where to look.
          </p>
        </div>

        <ProjectRootsEditor
          roots={projectRoots}
          onAdd={handleAddRoot}
          onRemove={handleRemoveRoot}
          isPickerPending={isPickerPending}
          emptyMessage="Add at least one folder — for example ~/Projects or ~/work."
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={projectRoots.length === 0 || isSubmitting || isPickerPending}
          onClick={handleContinue}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
