import Link from "next/link";
import { APP_NAME, CONTENT_WIDTH_NARROW, CONTENT_WIDTH_WIDE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AppHeader, type AppNavPath } from "./AppHeader";

type AppLayoutProps = {
  children: React.ReactNode;
  activePath?: AppNavPath;
  maxWidth?: "narrow" | "wide";
  className?: string;
};

const maxWidthClasses = {
  narrow: CONTENT_WIDTH_NARROW,
  wide: CONTENT_WIDTH_WIDE,
};

const NAV_ITEMS: { href: string; label: string; path: AppNavPath }[] = [
  { href: "/dashboard", label: "Dashboard", path: "dashboard" },
  { href: "/create", label: "Create", path: "create" },
  { href: "/history", label: "History", path: "history" },
  { href: "/settings", label: "Settings", path: "settings" },
];

export function AppLayout({
  children,
  activePath,
  maxWidth = "narrow",
  className,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-foreground focus:px-3 focus:py-2 focus:text-background focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
        <div className="flex h-14 items-center border-b border-[var(--border)] px-6">
          <Link href="/dashboard" className="text-sm font-semibold text-[var(--text-primary)]">
            {APP_NAME}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {NAV_ITEMS.map(({ href, label, path }) => {
            const isActive = activePath === path;
            return (
              <Link
                key={path}
                href={href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[var(--surface-muted)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border)] p-4">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col md:pl-64">
        <AppHeader activePath={activePath} />
        <main
          id="main-content"
          className={cn(
            "mx-auto w-full px-6 py-8",
            maxWidthClasses[maxWidth],
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
