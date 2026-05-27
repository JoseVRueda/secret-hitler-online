import type { GameContext } from "@secret-hitler/shared";
import { assign, createMachine } from "xstate";

export const createGameMachine = (roomCode: string) =>
  createMachine({
    id: "secret-hitler-game",

    context: {
      roomCode,
      round: 1,
      presidentSocketId: null,
      chancellorSocketId: null,
      presidentIndex: 0,
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
              rolesAcknowledgedBy: [] as string[],
            }),
          },
        },
      },

      roleAssignment: {
        on: {
          ROLE_ACKNOWLEDGED: {
            actions: assign({
              rolesAcknowledgedBy: ({ context, event }) => {
                const socketId = event.socketId as string;

                if (context.rolesAcknowledgedBy.includes(socketId)) {
                  return context.rolesAcknowledgedBy;
                }

                return [...context.rolesAcknowledgedBy, socketId];
              },
            }),
          },
          PRESIDENT_SELECTED: {
            target: "chancellorSelection",
            actions: assign({
              presidentSocketId: ({ event }) => event.presidentSocketId,
            }),
          },
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
