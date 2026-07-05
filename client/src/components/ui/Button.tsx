interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  color?: "primary" | "secondary";
  variant?: "contained" | "outlined";
  disabled?: boolean;
}

const colorVariantClasses: Record<
  NonNullable<ButtonProps["color"]>,
  Record<NonNullable<ButtonProps["variant"]>, string>
> = {
  primary: {
    contained:
      "border-ink bg-parchment text-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-parchment-dark",
    outlined:
      "border-parchment bg-transparent text-parchment shadow-[3px_3px_0_0_var(--color-parchment)] hover:bg-parchment/10",
  },
  secondary: {
    contained:
      "border-ink bg-blood text-parchment shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-blood-bright",
    outlined:
      "border-blood-bright bg-transparent text-blood-bright shadow-[3px_3px_0_0_var(--color-blood-bright)] hover:bg-blood/10",
  },
};

export default function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    className,
    color = "primary",
    variant = "contained",
    disabled = false,
  } = props;

  const classes = [
    "inline-flex items-center justify-center gap-2 border-2 px-5 py-2.5",
    "font-stamp text-sm uppercase tracking-[0.15em]",
    "transition-all duration-150 ease-out",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    "disabled:pointer-events-none disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none",
    colorVariantClasses[color][variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
