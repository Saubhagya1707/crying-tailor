import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Card
      padding="lg"
      className={cn("text-center", className)}
      {...props}
    >
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </p>
        {description && (
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </Card>
  );
}
