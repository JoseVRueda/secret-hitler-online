import Badge from "../ui/Badge";

interface RoomHeaderProps {
  code: string;
  subtitle?: string;
  round?: number;
}

export default function RoomHeader(props: RoomHeaderProps) {
  const { code, subtitle, round } = props;

  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl leading-none text-fascist sm:text-5xl">
          Secret Hitler
        </h1>
        <span className="mt-2 block h-1 w-24 bg-liberal" />
        {subtitle && (
          <p className="mt-3 font-body text-xs font-bold tracking-[0.22em] text-muted uppercase">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {round != null && (
          <span className="font-body text-sm font-bold tracking-[0.16em] text-muted uppercase">
            Ronda {round}
          </span>
        )}
        <Badge>{code}</Badge>
      </div>
    </header>
  );
}
