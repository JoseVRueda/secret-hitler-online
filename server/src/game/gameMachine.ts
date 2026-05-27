import type { GameContext } from "@secret-hitler/shared";
import { assign, createMachine } from "xstate";
import { getPresidentSocketId } from "./selectPresident.js";

function appendRoleAcknowledgement(
  rolesAcknowledgedBy: string[],
  socketId: string,
): string[] {
  if (rolesAcknowledgedBy.includes(socketId)) {
    return rolesAcknowledgedBy;
  }

  return [...rolesAcknowledgedBy, socketId];
}

function allRolesAcknowledged(context: GameContext, socketId: string): boolean {
  const nextAcknowledgements = appendRoleAcknowledgement(
    context.rolesAcknowledgedBy,
    socketId,
  );

  return nextAcknowledgements.length === context.playerSocketIds.length;
}

export const createGameMachine = (roomCode: string) =>
  createMachine({
    id: "secret-hitler-game",

    context: {
      roomCode,
      round: 1,
      presidentSocketId: null as string | null,
      chancellorSocketId: null as string | null,
      presidentIndex: 0,
      playerSocketIds: [] as string[],
      rolesAcknowledgedBy: [] as string[],
    } satisfies GameContext,

    initial: "lobby",

    states: {
      lobby: {
        on: {
          START_GAME: {
            target: "roleAssignment",
            actions: assign({
              round: 1,
              presidentSocketId: null,
              chancellorSocketId: null,
              presidentIndex: 0,
              playerSocketIds: ({ event }) => event.playerSocketIds as string[],
              rolesAcknowledgedBy: [] as string[],
            }),
          },
        },
      },

      roleAssignment: {
        on: {
          ROLE_ACKNOWLEDGED: [
            {
              guard: ({ context, event }) =>
                allRolesAcknowledged(context, event.socketId as string),
              target: "chancellorSelection",
              actions: assign({
                rolesAcknowledgedBy: ({ context, event }) =>
                  appendRoleAcknowledgement(
                    context.rolesAcknowledgedBy,
                    event.socketId as string,
                  ),
                presidentSocketId: ({ context }) =>
                  getPresidentSocketId(
                    context.playerSocketIds,
                    context.presidentIndex,
                  ),
              }),
            },
            {
              actions: assign({
                rolesAcknowledgedBy: ({ context, event }) =>
                  appendRoleAcknowledgement(
                    context.rolesAcknowledgedBy,
                    event.socketId as string,
                  ),
              }),
            },
          ],
        },
      },

      chancellorSelection: {
        on: {
          CHANCELLOR_SELECTED: {
            target: "voting",
            actions: assign({
              chancellorSocketId: ({ event }) => event.chancellorSocketId,
            }),
          },
        },
      },

      voting: {
        on: {
          VOTE_PASSED: "legislativeSession",
          VOTE_FAILED: {
            target: "chancellorSelection",
            actions: assign({
              round: ({ context }) => context.round + 1,
              presidentSocketId: null,
              chancellorSocketId: null,
              presidentIndex: ({ context }) => context.presidentIndex + 1,
            }),
          },
        },
      },

      legislativeSession: {
        on: {
          ACTION_COMPLETED: {
            target: "chancellorSelection",
            actions: assign({
              round: ({ context }) => context.round + 1,
              presidentIndex: ({ context }) => context.presidentIndex + 1,
              presidentSocketId: null,
              chancellorSocketId: null,
            }),
          },
          GAME_FINISHED: "gameOver",
        },
      },

      gameOver: {
        type: "final",
      },
    },
  });
