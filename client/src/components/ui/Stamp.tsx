interface StampProps {
  children: React.ReactNode;
  color?: "ink" | "blood" | "liberal" | "fascist" | "gold";
  className?: string;
}

const colorClasses: Record<NonNullable<StampProps["color"]>, string> = {
  ink: "text-ink",
  blood: "text-blood-bright",
  liberal: "text-liberal",
  fascist: "text-fascist",
  gold: "text-gold",
};

export default function Stamp(props: StampProps) {
  const { children, color = "blood", className } = props;

  const classes = [
    "stamp font-stamp text-xs sm:text-sm",
    colorClasses[color],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
