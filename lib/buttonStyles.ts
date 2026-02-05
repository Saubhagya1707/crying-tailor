import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500",
  secondary: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus:ring-zinc-400",
  outline:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-400",
  ghost: "text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-400",
} as const;

export type ButtonVariant = keyof typeof variants;

export function getButtonClassNames(
  variant: ButtonVariant = "primary",
  className?: string
): string {
  return cn(base, variants[variant], className);
}
