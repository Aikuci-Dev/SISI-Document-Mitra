import { drizzle } from 'drizzle-orm/libsql';

import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import * as schema from '../database/schema';

export { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

export function useDB() {
  return drizzle({ connection: { url: process.env.DB_FILE_NAME! }, schema });
}

export function aliasedColumn(column: SQLiteColumn | string, alias: string) {
  return sql<string>`${column}`.as(alias);
}

export function takeFirstOrThrow<T extends unknown[]>(values: T): T[number] {
  if (values.length !== 1)
    throw new Error('Found non unique or inexistent value');
  return values[0]!;
}

export type UserGoogle = typeof tables.userGoogle.$inferSelect;
