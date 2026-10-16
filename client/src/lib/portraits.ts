import portrait1 from "@/assets/portraits/player-portrait-1.svg";
import portrait2 from "@/assets/portraits/player-portrait-2.svg";
import portrait3 from "@/assets/portraits/player-portrait-3.svg";
import portrait4 from "@/assets/portraits/player-portrait-4.svg";
import portrait5 from "@/assets/portraits/player-portrait-5.svg";
import portrait6 from "@/assets/portraits/player-portrait-6.svg";
import portrait7 from "@/assets/portraits/player-portrait-7.svg";
import portrait8 from "@/assets/portraits/player-portrait-8.svg";
import portrait9 from "@/assets/portraits/player-portrait-9.svg";
import portrait10 from "@/assets/portraits/player-portrait-10.svg";
import portrait11 from "@/assets/portraits/player-portrait-11.svg";
import portrait12 from "@/assets/portraits/player-portrait-12.svg";
import portrait13 from "@/assets/portraits/player-portrait-13.svg";
import portrait14 from "@/assets/portraits/player-portrait-14.svg";
import portrait15 from "@/assets/portraits/player-portrait-15.svg";
import portrait16 from "@/assets/portraits/player-portrait-16.svg";
import portrait17 from "@/assets/portraits/player-portrait-17.svg";
import portrait18 from "@/assets/portraits/player-portrait-18.svg";
import portrait19 from "@/assets/portraits/player-portrait-19.svg";
import portrait20 from "@/assets/portraits/player-portrait-20.svg";
import portraitDefault from "@/assets/portraits/player-portrait-default.svg";
import type { StaticImageData } from "next/image";

const portraits: Record<number, StaticImageData> = {
  1: portrait1,
  2: portrait2,
  3: portrait3,
  4: portrait4,
  5: portrait5,
  6: portrait6,
  7: portrait7,
  8: portrait8,
  9: portrait9,
  10: portrait10,
  11: portrait11,
  12: portrait12,
  13: portrait13,
  14: portrait14,
  15: portrait15,
  16: portrait16,
  17: portrait17,
  18: portrait18,
  19: portrait19,
  20: portrait20,
};

export function getPortrait(avatar: number): StaticImageData {
  return portraits[avatar] ?? portraitDefault;
}
