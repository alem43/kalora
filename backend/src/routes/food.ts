import {Hono} from "hono";
import {db} from "../db/index.js";
import {foodLogs} from "../db/schema.js";
import {eq} from "drizzle-orm";
import {authMiddleware} from "../middleware/requireAuth.js";

const food = new Hono();

food.use("/", authMiddleware);

food.get("/", async (c) => {
  try {
    const userId = c.get("userId");

    const logs = await db
      .select()
      .from(foodLogs)
      .where(eq(foodLogs.userId, userId))
      .all();

    return c.json(logs);
  } catch (error) {
    console.error("Get food logs error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

food.post("/", async (c) => {
  try {
    const userId = c.get("userId");
    const {foodName, quantity, calories, protein, carbs, fat, date} =
      await c.req.json();

    const result = await db
      .insert(foodLogs)
      .values({
        userId,
        foodName,
        quantity,
        calories,
        protein,
        carbs,
        fat,
        date,
      })
      .returning();

    return c.json(result[0], 201);
  } catch (error) {
    console.error("Create food log error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

food.delete("/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = parseInt(c.req.param("id"));

    const log = await db
      .select()
      .from(foodLogs)
      .where(eq(foodLogs.id, id))
      .get();

    if (!log || log.userId !== userId) {
      return c.json({error: "Not found"}, 404);
    }

    await db.delete(foodLogs).where(eq(foodLogs.id, id));

    return c.json({message: "Deleted"});
  } catch (error) {
    console.error("Delete food log error:", error);
    return c.json({error: "Internal server error"}, 500);
  }
});

export default food;
