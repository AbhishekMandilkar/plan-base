import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import { useAppConfig } from "@/hooks/use-app-config";

export default function Header() {
  const { isLoading, needsOnboarding } = useAppConfig();
  const showNav = !isLoading && !needsOnboarding;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {showNav ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/settings">Settings</Link>
            </>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">Planview</span>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
