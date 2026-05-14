import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";

export const foodLogs = sqliteTable(
  "food_logs",
  {
    id: integer("id").primaryKey({autoIncrement: true}),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    foodName: text("food_name").notNull(),
    calories: integer("calories").notNull(),
    quantity: integer("quantity").notNull(),
    protein: integer("protein").notNull(),
    carbs: integer("carbs").notNull(),
    fat: integer("fat").notNull(),
    date: text("date").notNull(),
  },
  (table) => ({
    userIdIdx: index("food_logs_user_id_idx").on(table.userId),
  }),
);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  userName: text("user_name").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  goalWeight: integer("goal_weight"),
  activityLevel: text("activity_level").notNull(),
  goal: text("goal").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    token: text("token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: integer("created_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);
