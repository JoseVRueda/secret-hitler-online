import { cn } from "@/lib/cn";

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Panel(props: PanelProps) {
  const { children, title, className } = props;

  return (
    <section
      className={cn("overflow-hidden rounded-md bg-panel shadow-lg", className)}
    >
      {title && (
        <h2 className="bg-fascist px-6 py-3 font-display text-2xl tracking-wide text-white">
          {title}
        </h2>
      )}
      <div className="px-6 py-6 text-muted">{children}</div>
    </section>
  );
}
