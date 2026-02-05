import { CONTENT_WIDTH_NARROW, CONTENT_WIDTH_WIDE } from "@/lib/constants";
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

export function AppLayout({
  children,
  activePath,
  maxWidth = "narrow",
  className,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-foreground focus:px-3 focus:py-2 focus:text-background focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <AppHeader activePath={activePath} />
      <main
        id="main-content"
        className={cn(
          "mx-auto px-4 py-8",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
