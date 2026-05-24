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
  clientUrl: parseUrl(
    process.env.NEXT_PUBLIC_CLIENT_URL,
    "NEXT_PUBLIC_CLIENT_URL",
    isProduction ? undefined : "http://localhost:3000",
  ),
  serverUrl: parseUrl(
    process.env.NEXT_PUBLIC_SERVER_URL,
    "NEXT_PUBLIC_SERVER_URL",
    isProduction ? undefined : "http://localhost:3001",
  ),
};
