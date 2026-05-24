import { randomInt } from "node:crypto";

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let code = "";

  for (let i = 0; i < 4; i++) {
    code += chars.charAt(randomInt(0, chars.length));
  }

  return code;
}
