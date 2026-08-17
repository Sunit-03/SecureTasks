// Minimal parser for the "15m" / "7d" style strings already used in
// ACCESS_TOKEN_EXPIRY / REFRESH_TOKEN_EXPIRY — just enough to compute a
// concrete expiry Date for the RefreshToken table alongside the JWT's own
// `exp` claim (jsonwebtoken parses these same strings for signing).
const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function parseDurationMs(input: string): number {
  const match = /^(\d+)\s*(s|m|h|d)$/.exec(input.trim());
  if (!match) {
    throw new Error(`Unsupported duration format: "${input}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit as string]!;
}
