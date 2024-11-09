import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const userGoogle = sqliteTable("user_google", {
  id: int().primaryKey({ autoIncrement: true }),
  googleId: int("google_id").notNull(),
  email: text().notNull().unique(),
  googleName: text("google_name").notNull(),
  name: text(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
});
