import { Card } from "@/components/ui/Card";

type AuthCardProps = {
  children: React.ReactNode;
};

/**
 * Centered full-screen auth layout with a single card (e.g. login/signup).
 */
export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card padding="lg" shadow className="w-full max-w-sm">
        {children}
      </Card>
    </div>
  );
}
