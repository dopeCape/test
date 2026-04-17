import crypto from "crypto";

const COOKIE_NAME = "lf_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "SESSION_SECRET env var must be set (min 16 chars). Set it in .env.local.",
    );
  }
  return s;
}

function getPasswordHash(): string {
  const h = process.env.APP_PASSWORD_HASH;
  if (!h) {
    throw new Error(
      "APP_PASSWORD_HASH env var must be set. Run `npm run hash <password>` to generate one.",
    );
  }
  return h;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = getPasswordHash();
  const actual = hashPassword(password);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(actual, "hex"),
  );
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const payload = `${Date.now()}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (expected.length !== sig.length) return false;
  const match = crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(sig, "hex"),
  );
  if (!match) return false;
  const ts = Number(payload);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < SESSION_TTL_MS;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
export const AUTH_COOKIE_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
