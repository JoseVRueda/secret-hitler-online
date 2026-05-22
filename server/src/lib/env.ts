import { resolve } from "node:path";

try {
  process.loadEnvFile(resolve(process.cwd(), ".env"));
} catch {
  // .env is optional (e.g. production with real env vars)
}

export const env = {
  serverPort: Number(process.env.SERVER_PORT ?? 3001),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
};
