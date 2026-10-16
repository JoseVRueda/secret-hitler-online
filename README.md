# Secret Hitler Online

Browser adaptation of [Secret Hitler](https://www.secrethitler.com/) for 5 to 10 players. Each person picks a nickname, joins a room with a code, and plays in real time: government elections, voting, the legislative session, and executive powers.

Rooms are kept in memory. Restarting the server drops any game in progress.

## About

A hidden-role game of governments, policies, and trust. Liberals try to pass five liberal policies or execute Hitler. Fascists try to pass six fascist policies or elect Hitler chancellor once three fascist policies are already on the board. Only you see your role, the cards in your hand, and the result of an investigation. Everyone else sees the public board.

## How to play

1. One player creates a room and shares the code.
2. Everyone else joins with that code and picks a portrait.
3. The host starts the game once there are 5 to 10 players.
4. Each player sees their role in private (liberal, fascist, or Hitler) and confirms they have read it.
5. Play follows the tabletop flow: the president nominates a chancellor, everyone votes *ja* or *nein*, and a passed government enacts a policy.
6. Depending on the table size and how many fascist policies have been enacted, the president may investigate loyalty, call a special election, peek at the next three policies, or execute a player. The veto unlocks after five fascist policies.

Win conditions:

- Liberals win with 5 liberal policies, or by executing Hitler.
- Fascists win with 6 fascist policies, or if Hitler is elected chancellor after at least 3 fascist policies are on the board.

## Structure

[pnpm](https://pnpm.io/) monorepo.

```
secret-hitler-online/
├── client/            # Next.js, Zustand, and Socket.IO (http://localhost:3000)
├── server/            # Express, Socket.IO, and XState (http://localhost:3001)
└── packages/shared/   # Shared types and socket events
```

The client only receives the public room and game state. Role, cards in hand, and investigation results arrive in a private view per player.

## Requirements

- Node.js 20 or later
- pnpm 9 or later

## Getting started

From the repository root:

```bash
pnpm install
cp client/.env.example client/.env.local
cp server/.env.example server/.env
pnpm dev
```

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:3001](http://localhost:3001)
- Server health: [http://localhost:3001/health](http://localhost:3001/health)

To try it locally, open several browser tabs or windows (or separate profiles) and join the same room.

## Environment variables

In development, if the env files are missing, the client and server fall back to the example values.

**Client** (`client/.env.local`):

| Variable | Description | Development |
| --- | --- | --- |
| `NEXT_PUBLIC_CLIENT_URL` | Public client URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SERVER_URL` | Socket.IO server URL | `http://localhost:3001` |

**Server** (`server/.env`):

| Variable | Description | Development |
| --- | --- | --- |
| `SERVER_PORT` | HTTP port | `3001` |
| `CLIENT_URL` | Origin allowed by CORS | `http://localhost:3000` |

In production these variables must be set. The server does not apply defaults when `NODE_ENV` is `production`.

## Scripts

From the root:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the client and server in parallel |
| `pnpm build` | Builds both packages |
| `pnpm start` | Starts the production builds |
| `pnpm lint` | Runs ESLint and typecheck where a lint script exists |
| `pnpm format` | Formats the repository with Prettier |

## Asset credits and license

Boards, cards, portraits, tokens, and victory screens come from Secret Hitler (Goat, Wolf & Cabbage) and the [secret-hitler.online](https://secret-hitler.online/) adaptation. They are licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): attribute the original work, do not use the assets commercially, and share derivatives of that material under the same license.

Details are in [`client/src/assets/CREDITS.md`](client/src/assets/CREDITS.md).
