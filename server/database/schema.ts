import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import type { WorkDocument } from '~~/types/schema/document';

export const userGoogle = sqliteTable('user_google', {
  id: integer().primaryKey({ autoIncrement: true }),
  googleId: integer('google_id').notNull(),
  email: text().notNull().unique(),
  name: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const documentBapp = sqliteTable('document_bapp', {
  id: text().unique(),
  original: text({ mode: 'json' }).$type<WorkDocument>().notNull(),
  value: text({ mode: 'json' }).$type<WorkDocument>().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
