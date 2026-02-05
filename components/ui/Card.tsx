import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, padding = "md", shadow = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--surface)]",
        paddingClasses[padding],
        shadow && "shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
