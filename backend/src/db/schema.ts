import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

export const foodLogs = sqliteTable("food_logs", {
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
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  userName: text("user_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at").notNull(),
});
