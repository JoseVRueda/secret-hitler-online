import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge(props: BadgeProps) {
  const { children, className } = props;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-highlight px-3 py-1",
        "font-body text-sm font-bold tracking-[0.2em] text-ink uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
