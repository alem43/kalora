import {Hono} from "hono";
import {setCookie, deleteCookie} from "hono/cookie";
import bcrypt from "bcryptjs";
import {db} from "../db";
import {users, sessions} from "../db/schema";
import {eq} from "drizzle-orm";
import {createSession, hashPassword} from "../utils/auth-helpers.js";

const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  try {
    const {email, userName, password} = await c.req.json();

    if (await db.select().from(users).where(eq(users.email, email)).get()) {
      return c.json({error: "Email already exists"}, 400);
    }

    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email,
      userName,
      passwordHash: await hashPassword(password),
      createdAt: Date.now(),
    });

    await createSession(c, userId);
    return c.json({message: "Registered and logged in", userId});
  } catch (error) {
    console.error("Register error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

authRoute.post("/login", async (c) => {
  try {
    const {email, password} = await c.req.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return c.json({error: "Invalid credentials"}, 401);
    }

    await createSession(c, user.id);
    return c.text("Logged in!");
  } catch (error) {
    console.error("Login error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

authRoute.post("/logout", async (c) => {
  deleteCookie(c, "session");
  return c.json({message: "Logged out"});
});

export default authRoute;
