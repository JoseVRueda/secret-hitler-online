"use client";

import { cn } from "@/lib/cn";
import { getPortrait } from "@/lib/portraits";
import { selectAvatar } from "@/services/roomService";
import { AVATAR_COUNT, type PublicRoom } from "@secret-hitler/shared";
import Image from "next/image";

interface AvatarPickerProps {
  room: PublicRoom;
  currentAvatar?: number;
}

export default function AvatarPicker(props: AvatarPickerProps) {
  const { room, currentAvatar } = props;
  const used = new Set(room.players.map((player) => player.avatar));

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
      {Array.from({ length: AVATAR_COUNT }, (_, index) => index + 1).map(
        (avatar) => {
          const mine = avatar === currentAvatar;
          const taken = used.has(avatar) && !mine;

          return (
            <button
              key={avatar}
              type="button"
              disabled={taken}
              aria-pressed={mine}
              aria-label={
                taken ? `Retrato ${avatar} ocupado` : `Elegir retrato ${avatar}`
              }
              onClick={() => selectAvatar(room.code, avatar)}
              className={cn(
                "overflow-hidden rounded-md border-2 transition",
                mine && "border-highlight",
                !mine && !taken && "border-transparent hover:border-highlight",
                taken && "cursor-not-allowed border-transparent opacity-35",
              )}
            >
              <Image
                src={getPortrait(avatar)}
                alt=""
                unoptimized
                className="h-auto w-full"
              />
            </button>
          );
        },
      )}
    </div>
  );
}
