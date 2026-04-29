import {Hono} from "hono";
import {db} from "../db";
import {foodLogs} from "../db/schema";

const foodRoute = new Hono();

foodRoute.post("/", async (c) => {
  const body = await c.req.json();

  await db.insert(foodLogs).values({
    foodName: body.foodName,
    calories: body.calories,
    date: new Date().toISOString(),
  });

  return c.json({success: true});
});

foodRoute.get("/", async (c) => {
  const logs = await db.select().from(foodLogs);
  return c.json(logs);
});

export default foodRoute;
