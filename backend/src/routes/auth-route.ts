import {Hono} from "hono";
import {setCookie, deleteCookie} from "hono/cookie";
import bcrypt from "bcryptjs";
import {db} from "../db";
import {users, sessions} from "../db/schema";
import {eq} from "drizzle-orm";

const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  try {
    const {email, userName, password} = await c.req.json();

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existingUser) {
      return c.json({error: "Email already exists"}, 400);
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      id: userId,
      email,
      userName,
      passwordHash,
      createdAt: Date.now(),
    });

    // Auto-login after registration
    const sessionToken = crypto.randomUUID();
    await db.insert(sessions).values({
      token: sessionToken,
      userId,
      createdAt: Date.now(),
    });

    setCookie(c, "session", sessionToken, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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

    if (!user) {
      return c.json({error: "Invalid credentials"}, 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return c.json({error: "Invalid credentials"}, 401);
    }

    const sessionToken = crypto.randomUUID();
    await db.insert(sessions).values({
      token: sessionToken,
      userId: user.id,
      createdAt: Date.now(),
    });

    setCookie(c, "session", sessionToken, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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
