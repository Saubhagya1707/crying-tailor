import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(function Input({ className, error, ...props }, ref) {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-ring)] disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={props.id ? `${props.id}-error` : undefined} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
