import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { CONTENT_WIDTH_WIDE } from "@/lib/constants";

export type AppNavPath = "dashboard" | "create" | "history" | "settings";

const NAV_ITEMS: { href: string; label: string; path: AppNavPath }[] = [
  { href: "/dashboard", label: "Dashboard", path: "dashboard" },
  { href: "/create", label: "Create", path: "create" },
  { href: "/history", label: "History", path: "history" },
  { href: "/settings", label: "Settings", path: "settings" },
];

type AppHeaderProps = {
  activePath?: AppNavPath;
};

export function AppHeader({ activePath }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div
        className={`mx-auto flex h-14 ${CONTENT_WIDTH_WIDE} items-center justify-between px-4`}
      >
        <Link href="/dashboard" className="font-semibold text-zinc-900">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          {NAV_ITEMS.map(({ href, label, path }) => (
            <Link
              key={path}
              href={href}
              className={`text-sm hover:text-zinc-900 ${
                activePath === path ? "font-medium text-zinc-900" : "text-zinc-600"
              }`}
            >
              {label}
            </Link>
          ))}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 rounded"
            >
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
