import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import type { WorkDocument, WorkDocumentKeys } from '~~/shared/types/schema/document';

export const userGoogle = sqliteTable('user_google', {
  id: integer().primaryKey({ autoIncrement: true }),
  googleId: integer('google_id').notNull(),
  email: text().notNull().unique(),
  name: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const documentMitra = sqliteTable('document_mitra', {
  id: text().unique().notNull(),
  original: text({ mode: 'json' }).$type<WorkDocument>().notNull(),
  value: text({ mode: 'json' }).$type<WorkDocument>().notNull(),
  isValidated: integer('is_validated', { mode: 'boolean' }).default(false),
  isApproved: integer('is_approved', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  revisedAt: integer('revised_at', { mode: 'timestamp' }),
  validatedAt: integer('validated_at', { mode: 'timestamp' }),
  signedAt: integer('signed_at', { mode: 'timestamp' }),
});

export const mapping = sqliteTable('mapping', {
  id: integer().primaryKey({ autoIncrement: true }),
  type: text().notNull(),
  value: text({ mode: 'json' }).$type<Partial<Record<WorkDocumentKeys, string | null>>>().notNull(),
  map: text({ mode: 'json' }).$type<Record<string, WorkDocumentKeys | null>>().notNull(),
  other: text({ mode: 'json' }).$type<Record<string, Record<string, string>>>(),
});
