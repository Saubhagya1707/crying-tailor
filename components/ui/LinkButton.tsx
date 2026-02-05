import Link from "next/link";
import { getButtonClassNames, type ButtonVariant } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export function LinkButton({
  className,
  variant = "primary",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(getButtonClassNames(variant, className))}
      {...props}
    >
      {children}
    </Link>
  );
}
