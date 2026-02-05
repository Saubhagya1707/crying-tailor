import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-contrast)] hover:opacity-95 focus:ring-[var(--focus-ring)]",
  secondary:
    "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border)] focus:ring-[var(--focus-ring)]",
  outline:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] focus:ring-[var(--focus-ring)]",
  ghost:
    "text-[var(--text-primary)] hover:bg-[var(--surface-muted)] focus:ring-[var(--focus-ring)]",
} as const;

export type ButtonVariant = keyof typeof variants;

export function getButtonClassNames(
  variant: ButtonVariant = "primary",
  className?: string
): string {
  return cn(base, variants[variant], className);
}
