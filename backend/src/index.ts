import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {cors} from "hono/cors";
import foodRoute from "./routes/food.js";
import authRoute from "./routes/auth-route.js";
import {authMiddleware} from "./middleware/requireAuth.js";
import {errorHandler} from "./middleware/errorHandler.js";

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

app.use("*", errorHandler);

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/health", (c) => c.text("ok"));

app.route("/food", foodRoute);

app.route("/auth", authRoute);

app.use("/protected", authMiddleware);

app.get("/protected", (c) => {
  const user = c.get("user");
  return c.text(`ok protected: ${user.email}`);
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
