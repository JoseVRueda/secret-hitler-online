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
    } satisfies GameContext,

    initial: "lobby",

    states: {
      lobby: {
        on: {
          START_GAME: "roleAssignment",
        },
      },

      roleAssignment: {
        on: {
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
            target: "presidentSelection",
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
