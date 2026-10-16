import roleFascist1 from "@/assets/cards/role-fascist-1.png";
import roleFascist2 from "@/assets/cards/role-fascist-2.png";
import roleFascist3 from "@/assets/cards/role-fascist-3.png";
import roleHitler from "@/assets/cards/role-hitler.png";
import roleLiberal1 from "@/assets/cards/role-liberal-1.png";
import roleLiberal2 from "@/assets/cards/role-liberal-2.png";
import roleLiberal3 from "@/assets/cards/role-liberal-3.png";
import roleLiberal4 from "@/assets/cards/role-liberal-4.png";
import roleLiberal5 from "@/assets/cards/role-liberal-5.png";
import roleLiberal6 from "@/assets/cards/role-liberal-6.png";
import type { PlayerRole } from "@secret-hitler/shared";
import type { StaticImageData } from "next/image";

const liberalCards = [
  roleLiberal1,
  roleLiberal2,
  roleLiberal3,
  roleLiberal4,
  roleLiberal5,
  roleLiberal6,
];

const fascistCards = [roleFascist1, roleFascist2, roleFascist3];

export function getRoleCard(
  role: PlayerRole,
  playerIndex: number,
): StaticImageData {
  if (role === "hitler") {
    return roleHitler;
  }

  if (role === "fascist") {
    return fascistCards[playerIndex % fascistCards.length] ?? roleFascist1;
  }

  return liberalCards[playerIndex % liberalCards.length] ?? roleLiberal1;
}
