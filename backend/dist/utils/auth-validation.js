import { z } from "zod";
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    userName: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(200),
    gender: z.enum(["male", "female", "other"]),
    age: z.number().int().min(13, "Must be at least 13").max(120),
    height: z.number().int().min(100, "Height must be at least 100cm").max(250),
    weight: z.number().min(30, "Weight must be at least 30kg").max(300),
    goalWeight: z.number().min(30).max(300).optional(),
    activityLevel: z.enum([
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
    ]),
    goal: z.enum(["lose_weight", "maintain", "gain_weight", "build_muscle"]),
});
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});
export const onboardingSchema = z.object({
    gender: z.enum(["male", "female", "other"]),
    age: z.number().min(13).max(120),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300),
    goalWeight: z.number().min(30).max(300).optional(),
    activityLevel: z.enum([
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
    ]),
    goal: z.enum(["lose_weight", "maintain", "gain_weight", "build_muscle"]),
});
