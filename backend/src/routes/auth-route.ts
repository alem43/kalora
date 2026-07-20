import {Hono} from "hono";
import {setCookie, deleteCookie, getCookie} from "hono/cookie";
import bcrypt from "bcryptjs";
import {db} from "../db/index.js";
import {users, sessions} from "../db/schema.js";
import {eq} from "drizzle-orm";
import {createSession, hashPassword} from "../utils/auth-helpers.js";
import {registerSchema, loginSchema} from "../utils/auth-validation.js";
import {authMiddleware} from "../middleware/requireAuth.js";
import {AppError} from "../middleware/errorHandler.js";
import {OAuth2Client} from "google-auth-library";
import {onboardingSchema} from "../utils/auth-validation.js";
import {calculateCalorieGoal} from "../utils/calorie-calculator.js";

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
  const calorieGoal = calculateCalorieGoal({
    gender: data.gender,
    age: data.age,
    height: data.height,
    weight: data.weight,
    activityLevel: data.activityLevel,
    goal: data.goal,
  });

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
    calorieGoal,
    onboardingCompleted: true,
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

  deleteCookie(c, "session", {path: "/", sameSite: "None", secure: true});
  return c.json({message: "Logged out"});
});

authRoute.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      userName: users.userName,
      calorieGoal: users.calorieGoal,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  return c.json(user);
});

authRoute.post("/google", async (c) => {
  const {credential} = await c.req.json();

  if (!credential) {
    throw new AppError(400, "No credential provided", "NO_CREDENTIAL");
  }

  const client = new OAuth2Client(process.env.VITE_CLIENT_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new AppError(401, "Invalid Google token", "INVALID_TOKEN");
  }

  if (!payload?.email) {
    throw new AppError(400, "No email in token", "NO_EMAIL");
  }

  let user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .get();

  if (!user) {
    const userId = crypto.randomUUID();
    const calorieGoal = calculateCalorieGoal({
      gender: "other",
      age: 25,
      height: 170,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain",
    });

    const newUser = {
      id: userId,
      email: payload.email,
      userName: payload.email.split("@")[0],
      passwordHash: "",
      gender: "other",
      age: 25,
      height: 170,
      weight: 70,
      goalWeight: null,
      activityLevel: "moderate",
      goal: "maintain",
      calorieGoal,
      onboardingCompleted: false,
      createdAt: Date.now(),
    };

    await db.insert(users).values(newUser);
    user = newUser;
  }

  await createSession(c, user.id);

  return c.json({
    id: user.id,
    email: user.email,
    userName: user.userName,
    needsOnboarding: !user.onboardingCompleted,
  });
});

authRoute.patch("/onboarding", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const data = onboardingSchema.parse(body);

  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  const calorieGoal = calculateCalorieGoal({
    gender: data.gender,
    age: data.age,
    height: data.height,
    weight: data.weight,
    activityLevel: data.activityLevel,
    goal: data.goal,
  });

  await db
    .update(users)
    .set({
      gender: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goalWeight: data.goalWeight || null,
      activityLevel: data.activityLevel,
      goal: data.goal,
      calorieGoal,
      onboardingCompleted: true,
    })
    .where(eq(users.id, userId));

  return c.json({id: user.id, email: user.email, userName: user.userName});
});

export default authRoute;
