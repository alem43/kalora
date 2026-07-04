import { setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
const COOKIE_CONFIG = {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
};
export async function createSession(c, userId) {
    const sessionToken = crypto.randomUUID();
    await db.insert(sessions).values({
        token: sessionToken,
        userId,
        createdAt: Date.now(),
    });
    setCookie(c, "session", sessionToken, COOKIE_CONFIG);
    return sessionToken;
}
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
