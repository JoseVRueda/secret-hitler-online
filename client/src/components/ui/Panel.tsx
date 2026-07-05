interface PanelProps {
  children: React.ReactNode;
  title?: string;
  stamp?: React.ReactNode;
  className?: string;
}

export default function Panel(props: PanelProps) {
  const { children, title, stamp, className } = props;

  const classes = [
    "paper deco-frame relative bg-parchment text-ink shadow-xl",
    "rounded-sm px-6 py-6 sm:px-8 sm:py-8",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {stamp && <div className="absolute -top-4 -right-4 z-10">{stamp}</div>}
      {title && (
        <h2 className="font-poster text-2xl uppercase tracking-wide text-ink border-b-2 border-ink/70 pb-3 mb-5">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
