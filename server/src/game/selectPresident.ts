export function getPresidentSocketId(
  playerSocketIds: string[],
  presidentIndex: number,
): string | null {
  if (playerSocketIds.length === 0) {
    return null;
  }

  const index = presidentIndex % playerSocketIds.length;

  return playerSocketIds[index] ?? null;
}
