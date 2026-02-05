import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(function Textarea({ className, error, ...props }, ref) {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-ring)] disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
