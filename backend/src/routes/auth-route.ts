import {Hono} from "hono";
import {setCookie, deleteCookie, getCookie} from "hono/cookie";
import bcrypt from "bcryptjs";
import {db} from "../db";
import {users, sessions} from "../db/schema";
import {eq} from "drizzle-orm";
import {createSession, hashPassword} from "../utils/auth-helpers.js";
import {registerSchema, loginSchema} from "../utils/auth-validation.js";
import {AppError} from "../middleware/errorHandler.js";

const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  const body = await c.req.json();
  const data = registerSchema.parse(body);

  const existingEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .get();

  if (existingEmail) {
    throw new AppError(400, "Email already exists", "EMAIL_EXISTS");
  }

  const existingUsername = await db
    .select()
    .from(users)
    .where(eq(users.userName, data.userName))
    .get();

  if (existingUsername) {
    throw new AppError(400, "Username already taken", "USERNAME_TAKEN");
  }

  const userId = crypto.randomUUID();
  const newUser = {
    id: userId,
    email: data.email,
    userName: data.userName,
    passwordHash: await hashPassword(data.password),
    gender: data.gender,
    age: data.age,
    height: data.height,
    weight: data.weight,
    goalWeight: data.goalWeight || null,
    activityLevel: data.activityLevel,
    goal: data.goal,
    createdAt: Date.now(),
  };

  await db.insert(users).values(newUser);
  await createSession(c, userId);

  return c.json({
    id: userId,
    email: data.email,
    userName: data.userName,
    createdAt: newUser.createdAt,
  });
});

authRoute.post("/login", async (c) => {
  const body = await c.req.json();
  const data = loginSchema.parse(body);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .get();

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  await createSession(c, user.id);

  return c.json({
    id: user.id,
    email: user.email,
    userName: user.userName,
    createdAt: user.createdAt,
  });
});

authRoute.post("/logout", async (c) => {
  const sessionToken = getCookie(c, "session");

  if (sessionToken) {
    await db.delete(sessions).where(eq(sessions.token, sessionToken));
  }

  deleteCookie(c, "session");
  return c.json({message: "Logged out"});
});

export default authRoute;
