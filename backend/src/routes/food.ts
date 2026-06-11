import {Hono} from "hono";
import {db} from "../db/index.js";
import {foodLogs} from "../db/schema.js";
import {eq, and, gte} from "drizzle-orm";
import {authMiddleware} from "../middleware/requireAuth.js";
import {createFoodLogSchema} from "../utils/food-validation.js";
import {AppError} from "../middleware/errorHandler.js";

function detectMealType(date: Date) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "breakfast";
  if (h >= 11 && h < 15) return "lunch";
  if (h >= 17 && h < 22) return "dinner";
  return "snack";
}

const food = new Hono();

food.use("*", authMiddleware);

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

  const loggedAt = data.loggedAt ? new Date(data.loggedAt) : new Date();

  if (isNaN(loggedAt.getTime())) {
    throw new AppError(400, "Invalid loggedAt date", "INVALID_DATE");
  }

  const mealType = data.mealType || detectMealType(loggedAt);

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
      mealType,
      loggedAt,
    })
    .returning();

  return c.json(result[0], 201);
});

food.get("/insights", async (c) => {
  const userId = c.get("userId");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await db
    .select()
    .from(foodLogs)
    .where(
      and(eq(foodLogs.userId, userId), gte(foodLogs.loggedAt, thirtyDaysAgo)),
    )
    .all();

  type Pattern = {
    id: string;
    detected: boolean;
    message: string;
    detail: string;
  };

  if (logs.length === 0) {
    return c.json({
      patterns: [] as Pattern[],
      dataRange: {days: 30, totalLogs: 0},
    });
  }

  let totalCalories = 0;
  let lateCalories = 0;

  const breakfastProteinByDay: Record<string, number> = {};
  const weekdayCaloriesByDay: Record<string, number> = {};
  const weekendCaloriesByDay: Record<string, number> = {};

  for (const log of logs) {
    const date = new Date(log.loggedAt);
    const hour = date.getHours();
    const dayKey = date.toDateString();
    const dow = date.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dow === 0 || dow === 6;

    totalCalories += log.calories;
    if (hour >= 20) lateCalories += log.calories;

    if (log.mealType === "breakfast") {
      breakfastProteinByDay[dayKey] =
        (breakfastProteinByDay[dayKey] || 0) + log.protein;
    }

    if (isWeekend) {
      weekendCaloriesByDay[dayKey] =
        (weekendCaloriesByDay[dayKey] || 0) + log.calories;
    } else {
      weekdayCaloriesByDay[dayKey] =
        (weekdayCaloriesByDay[dayKey] || 0) + log.calories;
    }
  }

  const lateCaloriePct =
    totalCalories > 0 ? Math.round((lateCalories / totalCalories) * 100) : 0;

  const breakfastDayKeys = Object.keys(breakfastProteinByDay);
  const avgBreakfastProtein =
    breakfastDayKeys.length > 0
      ? Math.round(
          Object.values(breakfastProteinByDay).reduce((a, b) => a + b, 0) /
            breakfastDayKeys.length,
        )
      : 0;

  const weekdayDayKeys = Object.keys(weekdayCaloriesByDay);
  const weekendDayKeys = Object.keys(weekendCaloriesByDay);
  const avgWeekdayCalories =
    weekdayDayKeys.length > 0
      ? Math.round(
          Object.values(weekdayCaloriesByDay).reduce((a, b) => a + b, 0) /
            weekdayDayKeys.length,
        )
      : 0;
  const avgWeekendCalories =
    weekendDayKeys.length > 0
      ? Math.round(
          Object.values(weekendCaloriesByDay).reduce((a, b) => a + b, 0) /
            weekendDayKeys.length,
        )
      : 0;
  const hasWeekComparison =
    weekdayDayKeys.length >= 3 && weekendDayKeys.length >= 2;

  const patterns: Pattern[] = [
    {
      id: "late_calories",
      detected: lateCaloriePct >= 40,
      message: "You eat most of your calories after 8 PM.",
      detail: `${lateCaloriePct}% of your calories come from meals logged after 8 PM`,
    },
    {
      id: "low_breakfast_protein",
      detected: breakfastDayKeys.length >= 3 && avgBreakfastProtein < 20,
      message: "Your protein intake is consistently low at breakfast.",
      detail:
        breakfastDayKeys.length >= 3
          ? `Average ${avgBreakfastProtein}g of protein per breakfast`
          : "Not enough breakfast logs to detect a pattern",
    },
    {
      id: "weekend_calories",
      detected:
        hasWeekComparison && avgWeekendCalories > avgWeekdayCalories * 1.2,
      message: "You consume significantly more calories on weekends.",
      detail: hasWeekComparison
        ? `Weekdays avg ${avgWeekdayCalories} cal · Weekends avg ${avgWeekendCalories} cal`
        : "Not enough data to compare weekday vs weekend eating",
    },
  ];

  return c.json({
    patterns,
    dataRange: {days: 30, totalLogs: logs.length},
  });
});

food.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    throw new AppError(400, "Invalid food ID", "INVALID_ID");
  }

  const log = await db.select().from(foodLogs).where(eq(foodLogs.id, id)).get();

  if (!log || log.userId !== userId) {
    throw new AppError(404, "Food log not found", "NOT_FOUND");
  }

  await db.delete(foodLogs).where(eq(foodLogs.id, id));

  return c.json({message: "Deleted"});
});

export default food;
