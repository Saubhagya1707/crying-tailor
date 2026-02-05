export type AppNavPath = "dashboard" | "create" | "history" | "settings";

type AppHeaderProps = {
  activePath?: AppNavPath;
};

export function AppHeader({ activePath }: AppHeaderProps) {
  const activeLabel = activePath
    ? {
        dashboard: "Dashboard",
        create: "Create",
        history: "History",
        settings: "Settings",
      }[activePath]
    : "Overview";

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-14 items-center justify-between px-6">
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {activeLabel}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            ResumeTailor workspace
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1">
              Enterprise
            </span>
            <span>v1</span>
          </div>
          <form action="/api/auth/signout" method="POST" className="md:hidden">
            <button
              type="submit"
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
