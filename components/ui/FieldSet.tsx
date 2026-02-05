import { cn } from "@/lib/utils";

type FieldSetProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Nested block for form entry rows (e.g. education/experience items).
 * Renders rounded border and subtle background.
 */
export function FieldSet({
  children,
  className,
  ...props
}: FieldSetProps) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
