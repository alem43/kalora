import type {Context, Next} from "hono";
import {getCookie} from "hono/cookie";
import {db} from "../db";
import {sessions} from "../db/schema";
import {eq} from "drizzle-orm";

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, "session");

  if (!token) {
    return c.json({error: "Unauthorized"}, 401);
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .get();

  if (!session) {
    return c.json({error: "Unauthorized"}, 401);
  }

  c.set("userId", session.userId);
  await next();
}
