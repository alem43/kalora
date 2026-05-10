import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {cors} from "hono/cors";
import foodRoute from "./routes/food.js";
import authRoute from "./routes/auth-route.js";
import {authMiddleware} from "./middleware/requireAuth.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/health", (c) => c.text("ok"));

app.route("/food", foodRoute);

app.route("/auth", authRoute);

serve(
  {
    fetch: app.fetch,
    port: 8787,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export default app;
