import {z} from "zod";

const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const createFoodLogSchema = z.object({
  foodName: z.string().min(1, "Food name is required").max(200),
  quantity: z.number().positive("Quantity must be greater than 0").max(10000),
  calories: z.number().nonnegative("Calories must be non-negative").max(10000),
  protein: z.number().nonnegative("Protein must be non-negative").max(1000),
  carbs: z.number().nonnegative("Carbs must be non-negative").max(1000),
  fat: z.number().nonnegative("Fat must be non-negative").max(1000),
  date: z
    .string()
    .refine(
      (val) => VALID_DATE_REGEX.test(val),
      "Date must be in YYYY-MM-DD format",
    ),
});

export type CreateFoodLogInput = z.infer<typeof createFoodLogSchema>;
