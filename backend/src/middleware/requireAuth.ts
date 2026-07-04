import type {Context, Next} from "hono";
import type {Variables} from "../types/hono.js";
import {getCookie} from "hono/cookie";
import {db} from "../db/index.js";
import {sessions} from "../db/schema.js";
import {eq} from "drizzle-orm";

const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export async function authMiddleware(
  c: Context<{Variables: Variables}>,
  next: Next,
) {
  const token = getCookie(c, "session");

  if (!token) {
    return c.json({error: "Unauthorized", code: "NO_SESSION"}, 401);
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .get();

  if (!session) {
    return c.json({error: "Unauthorized", code: "INVALID_SESSION"}, 401);
  }

  const now = Date.now();
  const sessionAge = now - session.createdAt;

  if (sessionAge > SESSION_EXPIRY_MS) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return c.json({error: "Session expired", code: "SESSION_EXPIRED"}, 401);
  }

  c.set("userId", session.userId);
  await next();
}
