import type {Context, Next} from "hono";
import {z} from "zod";

export class AppError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof AppError) {
      return c.json(
        {
          error: error.message,
          code: error.code,
        },
        error.status,
      );
    }

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        400,
      );
    }

    return c.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500,
    );
  }
}
