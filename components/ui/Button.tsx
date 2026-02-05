import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-foreground text-background hover:opacity-90 focus:ring-foreground",
        variant === "secondary" && "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus:ring-zinc-400",
        variant === "outline" &&
          "border border-zinc-300 bg-transparent hover:bg-zinc-50 focus:ring-zinc-400",
        variant === "ghost" && "hover:bg-zinc-100 focus:ring-zinc-400",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
