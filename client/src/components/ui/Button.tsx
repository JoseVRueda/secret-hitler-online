import { cn } from "@/lib/cn";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  color?: "fascist" | "liberal";
  variant?: "contained" | "outlined";
  disabled?: boolean;
}

const colorVariantClasses: Record<
  NonNullable<ButtonProps["color"]>,
  Record<NonNullable<ButtonProps["variant"]>, string>
> = {
  fascist: {
    contained:
      "bg-fascist text-white shadow-[0_4px_0_0_var(--color-fascist-shadow)] hover:bg-fascist-hover",
    outlined:
      "border-2 border-fascist bg-transparent text-fascist shadow-none hover:bg-fascist/15",
  },
  liberal: {
    contained:
      "bg-liberal text-white shadow-[0_4px_0_0_var(--color-liberal-shadow)] hover:bg-liberal-hover",
    outlined:
      "border-2 border-liberal bg-transparent text-liberal shadow-none hover:bg-liberal/15",
  },
};

export default function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    className,
    color = "fascist",
    variant = "contained",
    disabled = false,
  } = props;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5",
        "font-body text-sm font-bold uppercase tracking-[0.14em]",
        "transition-all duration-150 ease-out",
        "active:translate-y-1 active:shadow-none",
        "disabled:pointer-events-none disabled:translate-y-0 disabled:border-transparent disabled:bg-disabled disabled:text-white/80 disabled:shadow-[0_4px_0_0_var(--color-disabled-shadow)]",
        colorVariantClasses[color][variant],
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
