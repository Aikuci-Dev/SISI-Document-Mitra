import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const userGoogle = sqliteTable('user_google', {
  id: integer().primaryKey({ autoIncrement: true }),
  googleId: integer('google_id').notNull(),
  email: text().notNull().unique(),
  name: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});
