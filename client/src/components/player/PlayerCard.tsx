"use client";

import playerBaseUnselectable from "@/assets/player/player-base-unselectable.png";
import playerBase from "@/assets/player/player-base.png";
import iconBusy from "@/assets/player/player-icon-busy.png";
import iconFascist from "@/assets/player/player-icon-fascist.png";
import iconHitler from "@/assets/player/player-icon-hitler.png";
import iconJa from "@/assets/player/player-icon-ja.png";
import iconLiberal from "@/assets/player/player-icon-liberal.png";
import iconNein from "@/assets/player/player-icon-nein.png";
import { cn } from "@/lib/cn";
import { getPortrait } from "@/lib/portraits";
import type { PlayerRole, PublicPlayer } from "@secret-hitler/shared";
import Image, { type StaticImageData } from "next/image";

export type PlayerMarker = "ja" | "nein" | "busy";

const identityIcons: Record<PlayerRole, StaticImageData> = {
  liberal: iconLiberal,
  fascist: iconFascist,
  hitler: iconHitler,
};

const identityLabels: Record<PlayerRole, string> = {
  liberal: "Liberal",
  fascist: "Fascista",
  hitler: "Hitler",
};

const markerIcons: Record<PlayerMarker, StaticImageData> = {
  ja: iconJa,
  nein: iconNein,
  busy: iconBusy,
};

interface PlayerCardProps {
  player: PublicPlayer;
  role?: PlayerRole;
  marker?: PlayerMarker;
  isPresident?: boolean;
  isChancellor?: boolean;
  dead?: boolean;
  selectable?: boolean;
  unavailable?: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function PlayerCard(props: PlayerCardProps) {
  const {
    player,
    role,
    marker,
    isPresident = false,
    isChancellor = false,
    dead = false,
    selectable = false,
    unavailable = false,
    onSelect,
    className,
  } = props;

  const dimmed = dead || unavailable;
  const office = isPresident ? "Presidente" : isChancellor ? "Canciller" : null;
  const content = (
    <>
      {office && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-cream px-2 py-0.5 font-display text-[0.7rem] tracking-wide whitespace-nowrap text-ink shadow">
          {office}
        </span>
      )}
      <div className="relative">
        <Image
          src={dimmed ? playerBaseUnselectable : playerBase}
          alt=""
          className={cn("h-auto w-full", dimmed && "brightness-[0.45]")}
        />
        <Image
          src={getPortrait(player.avatar)}
          alt=""
          unoptimized
          className={cn(
            "pointer-events-none absolute h-auto",
            dimmed && "brightness-[0.45]",
          )}
          style={{ width: "82%", left: "9%", top: "6.3%" }}
        />
        {role && (
          <Image
            src={identityIcons[role]}
            alt={identityLabels[role]}
            className="pointer-events-none absolute h-auto"
            style={{ top: "75%", left: "8%", width: "28%" }}
          />
        )}
        {marker && (
          <Image
            src={markerIcons[marker]}
            alt={
              marker === "busy"
                ? "Aún no vota"
                : marker === "ja"
                  ? "Ja"
                  : "Nein"
            }
            className="pointer-events-none absolute h-auto"
            style={
              marker === "busy"
                ? {
                    top: "43%",
                    left: "50%",
                    width: "37.5%",
                    transform: "translateX(-50%)",
                  }
                : { top: "43%", left: "14%", width: "73%" }
            }
          />
        )}
        <p
          className={cn(
            "absolute flex items-center justify-center overflow-hidden px-1 text-center font-body font-bold text-ink",
            dead && "line-through opacity-70",
          )}
          style={{
            top: "64%",
            left: "10%",
            width: "80%",
            height: "16%",
            fontSize: "clamp(0.55rem, 1.5vw, 0.8rem)",
          }}
        >
          <span className="truncate">{player.nickname}</span>
        </p>
      </div>
      {player.isHost && (
        <span className="mt-1 block text-center font-body text-[0.6rem] font-bold tracking-[0.14em] text-highlight uppercase">
          Host
        </span>
      )}
      {dead && <span className="sr-only">Eliminado</span>}
    </>
  );

  const classes = cn(
    "relative w-[clamp(4.75rem,11vw,8.5rem)] rounded-[12%] p-1 text-left",
    selectable && "cursor-pointer hover:bg-highlight",
    className,
  );

  if (onSelect && selectable) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onSelect}
        aria-label={`Elegir a ${player.nickname}`}
      >
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
