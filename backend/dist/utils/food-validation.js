import { z } from "zod";
const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const createFoodLogSchema = z.object({
    foodName: z.string().min(1).max(200),
    quantity: z.number().positive().max(10000),
    calories: z.number().nonnegative().max(10000),
    protein: z.number().nonnegative().max(1000),
    carbs: z.number().nonnegative().max(1000),
    fat: z.number().nonnegative().max(1000),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
    loggedAt: z.string().optional(),
});
