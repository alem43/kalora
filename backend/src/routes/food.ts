import {Hono} from "hono";
import {db} from "../db/index.js";
import {foodLogs} from "../db/schema.js";
import {eq} from "drizzle-orm";
import {authMiddleware} from "../middleware/requireAuth.js";
import {createFoodLogSchema} from "../utils/food-validation.js";
import {AppError} from "../middleware/errorHandler.js";

const food = new Hono();

food.use("/", authMiddleware);

food.get("/", async (c) => {
  const userId = c.get("userId");

  const logs = await db
    .select()
    .from(foodLogs)
    .where(eq(foodLogs.userId, userId))
    .all();

  return c.json(logs);
});

food.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const data = createFoodLogSchema.parse(body);

  const result = await db
    .insert(foodLogs)
    .values({
      userId,
      foodName: data.foodName,
      quantity: data.quantity,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      date: data.date,
    })
    .returning();

  return c.json(result[0], 201);
});

food.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    throw new AppError(400, "Invalid food ID", "INVALID_ID");
  }

  const log = await db
    .select()
    .from(foodLogs)
    .where(eq(foodLogs.id, id))
    .get();

  if (!log || log.userId !== userId) {
    throw new AppError(404, "Food log not found", "NOT_FOUND");
  }

  await db.delete(foodLogs).where(eq(foodLogs.id, id));

  return c.json({message: "Deleted"});
});

export default food;
