import { createActor } from "xstate";
import { createGameMachine } from "./gameMachine.js";

const gameActors = new Map<string, ReturnType<typeof createActor>>();

export function createGame(roomCode: string) {
  const machine = createGameMachine(roomCode);
  const actor = createActor(machine).start();

  gameActors.set(roomCode, actor);

  return actor;
}

export function getGame(roomCode: string) {
  return gameActors.get(roomCode);
}
