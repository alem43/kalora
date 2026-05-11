import {Hono} from "hono";
import {setCookie, deleteCookie, getCookie} from "hono/cookie";
import bcrypt from "bcryptjs";
import {db} from "../db";
import {users, sessions} from "../db/schema";
import {eq} from "drizzle-orm";
import {createSession, hashPassword} from "../utils/auth-helpers.js";

const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  try {
    const {email, userName, password} = await c.req.json();

    if (!email || !userName || !password) {
      return c.json({error: "Missing required fields"}, 400);
    }
    if (userName.length < 3 || userName.length > 20) {
      return c.json({error: "Username must be 3-20 characters"}, 400);
    }
    if (password.length < 8) {
      return c.json({error: "Password must be at least 8 characters"}, 400);
    }

    if (await db.select().from(users).where(eq(users.email, email)).get()) {
      return c.json({error: "Email already exists"}, 400);
    }

    if (
      await db.select().from(users).where(eq(users.userName, userName)).get()
    ) {
      return c.json({error: "Username already taken"}, 400);
    }

    const userId = crypto.randomUUID();
    const newUser = {
      id: userId,
      email,
      userName,
      passwordHash: await hashPassword(password),
      createdAt: Date.now(),
    };

    await db.insert(users).values(newUser);
    await createSession(c, userId);

    return c.json({
      id: userId,
      email,
      userName,
      createdAt: newUser.createdAt,
    });
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

    return c.json({
      id: user.id,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

authRoute.post("/logout", async (c) => {
  try {
    const sessionToken = getCookie(c, "session");

    if (sessionToken) {
      await db.delete(sessions).where(eq(sessions.token, sessionToken));
    }

    deleteCookie(c, "session");
    return c.json({message: "Logged out"});
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

export default authRoute;
