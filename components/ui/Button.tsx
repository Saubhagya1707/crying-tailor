import { cn } from "@/lib/utils";
import { getButtonClassNames, type ButtonVariant } from "@/lib/buttonStyles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
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
      className={cn(getButtonClassNames(variant, className))}
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
