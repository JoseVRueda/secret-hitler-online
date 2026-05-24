import { resolve } from "node:path";

try {
  process.loadEnvFile(resolve(process.cwd(), ".env"));
} catch {
  // .env is optional (e.g. production with real env vars)
}

function parsePort(value: string | undefined, fallback: number): number {
  const raw = value ?? String(fallback);
  const port = Number(raw);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`SERVER_PORT must be a valid port (1-65535), got "${raw}"`);
  }

  return port;
}

function parseUrl(
  value: string | undefined,
  name: string,
  fallback?: string,
): string {
  const raw = value ?? fallback;

  if (!raw) {
    throw new Error(`${name} is required`);
  }

  try {
    new URL(raw);
    return raw;
  } catch {
    throw new Error(`${name} must be a valid URL, got "${raw}"`);
  }
}

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  serverPort: parsePort(process.env.SERVER_PORT, 3001),
  clientUrl: parseUrl(
    process.env.CLIENT_URL,
    "CLIENT_URL",
    isProduction ? undefined : "http://localhost:3000",
  ),
};
