import type { GameContext } from "@/types/game.js";
import { assign, createMachine } from "xstate";

export const createGameMachine = (roomCode: string) =>
  createMachine({
    id: "secret-hitler-game",

    context: {
      roomCode,
      round: 1,
      presidentId: null,
      chancellorId: null,
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
          ROLES_ASSIGNED: "presidentSelection",
        },
      },

      presidentSelection: {
        on: {
          PRESIDENT_SELECTED: {
            target: "chancellorSelection",
            actions: assign({
              presidentId: ({ event }) => event.presidentId,
            }),
          },
        },
      },

      chancellorSelection: {
        on: {
          CHANCELLOR_SELECTED: {
            target: "voting",
            actions: assign({
              chancellorId: ({ event }) => event.chancellorId,
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
              presidentId: null,
              chancellorId: null,
            }),
          },
        },
      },

      legislativeSession: {
        on: {
          POLICY_ENACTED: "executiveAction",
          GAME_FINISHED: "gameOver",
        },
      },

      executiveAction: {
        on: {
          ACTION_COMPLETED: {
            target: "presidentSelection",
            actions: assign({
              round: ({ context }) => context.round + 1,
              presidentId: null,
              chancellorId: null,
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
