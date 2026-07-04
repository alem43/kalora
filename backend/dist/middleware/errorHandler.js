import { z } from "zod";
export class AppError extends Error {
    status;
    message;
    code;
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.message = message;
        this.code = code;
        this.name = "AppError";
    }
}
export async function errorHandler(c, next) {
    try {
        await next();
    }
    catch (error) {
        console.error("Error:", error);
        if (error instanceof AppError) {
            return c.json({
                error: error.message,
                code: error.code,
            }, {
                status: error.status,
            });
        }
        if (error instanceof z.ZodError) {
            return c.json({
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            }, {
                status: 400,
            });
        }
        return c.json({
            error: "Internal server error",
            code: "INTERNAL_ERROR",
        }, {
            status: 500,
        });
    }
}
