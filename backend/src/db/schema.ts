import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

export const foodLogs = sqliteTable("food_logs", {
  id: integer("id").primaryKey({autoIncrement: true}),
  foodName: text("food_name").notNull(),
  calories: integer("calories").notNull(),
  date: text("date").notNull(),
});
