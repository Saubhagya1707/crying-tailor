import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function Section({
  title,
  description,
  action,
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <Card padding="md" className={cn("space-y-4", className)} {...props}>
      {(title != null || action != null) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title != null && (
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          )}
          {action != null && <div>{action}</div>}
        </div>
      )}
      {description != null && (
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      )}
      {children}
    </Card>
  );
}
