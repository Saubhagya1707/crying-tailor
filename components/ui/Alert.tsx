import { cn } from "@/lib/utils";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant: "error" | "success" | "info";
};

const variantClasses = {
  error: "bg-red-50 text-red-700",
  success: "bg-green-50 text-green-700",
  info: "bg-zinc-100 text-zinc-800",
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
