import { sqliteTable, integer, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { DOCUMENTS_TYPE } from '~~/types/document';
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

export const documentMitra = sqliteTable('document_mitra', {
  id: text().notNull(),
  type: text().$type<DOCUMENTS_TYPE>().notNull(),
  value: text({ mode: 'json' }).$type<WorkDocument>().notNull(),
  isValidated: integer('is_validated', { mode: 'boolean' }).default(false),
  isApproved: integer('is_approved', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  validatedAt: integer('validated_at', { mode: 'timestamp' }),
  signedAt: integer('signed_at', { mode: 'timestamp' }),
}, (table) => {
  return {
    typeAndId: uniqueIndex('type_and_id').on(table.type, table.id),
  };
});
