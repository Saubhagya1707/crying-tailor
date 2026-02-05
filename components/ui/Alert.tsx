import { cn } from "@/lib/utils";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant: "error" | "success" | "info";
};

const variantClasses = {
  error: "border border-red-200 bg-red-50 text-red-700",
  success: "border border-green-200 bg-green-50 text-green-700",
  info: "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
};

export function Alert({
  variant,
  children,
  className,
  ...props
}: AlertProps) {
  const role = variant === "error" ? "alert" : "status";
  return (
    <div
      role={role}
      className={cn(
        "rounded-lg p-3 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
