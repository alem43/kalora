import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {cors} from "hono/cors";
import {z} from "zod";
import foodRoute from "./routes/food.js";
import authRoute from "./routes/auth-route.js";
import {authMiddleware} from "./middleware/requireAuth.js";
import {AppError} from "./middleware/errorHandler.js"; // ← ADD THIS LINE

const app = new Hono();

const API_PORT = parseInt(process.env.API_PORT || "8787", 10);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  "*",
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.get("/", (c) => c.text("Hello Hono!"));
app.get("/health", (c) => c.text("ok"));

app.route("/food", foodRoute);
app.route("/auth", authRoute);

app.use("/protected", authMiddleware);
app.get("/protected", (c) => {
  const user = c.get("user");
  return c.text(`ok protected: ${user.email}`);
});

// Global error handler – now with the correct import
app.onError((err, c) => {
  console.error("Error:", err);

  let status = 500;
  let body: any = {error: "Internal server error", code: "INTERNAL_ERROR"};

  if (err instanceof AppError) {
    status = err.status;
    body = {error: err.message, code: err.code};
  } else if (err instanceof z.ZodError) {
    status = 400;
    body = {
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    };
  }

  // Explicitly construct a Response with CORS headers
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": FRONTEND_URL,
      "Access-Control-Allow-Credentials": "true",
    },
  });
});

serve(
  {
    fetch: app.fetch,
    port: API_PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export default app;
