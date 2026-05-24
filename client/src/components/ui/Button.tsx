interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  color?: "primary" | "secondary";
  variant?: "contained" | "outlined";
}

const colorVariantClasses: Record<
  NonNullable<ButtonProps["color"]>,
  Record<NonNullable<ButtonProps["variant"]>, string>
> = {
  primary: {
    contained: "bg-blue-600 text-white p-2 hover:bg-blue-700",
    outlined:
      "border border-blue-600 bg-transparent text-blue-600 p-2 hover:bg-blue-600/15",
  },
  secondary: {
    contained: "bg-red-700 text-white p-2 hover:bg-red-800",
    outlined:
      "border border-red-700 bg-transparent text-red-700 p-2 hover:bg-red-700/15",
  },
};

export default function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    className,
    color = "primary",
    variant = "contained",
  } = props;

  const classes = ["rounded", colorVariantClasses[color][variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
