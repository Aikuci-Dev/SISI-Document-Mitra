import { drizzle } from 'drizzle-orm/libsql/web';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { sql, type SQL } from 'drizzle-orm';
import * as schema from '../database/schema';

export { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

export function useDB() {
  return drizzle({
    connection: {
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN!,
    },
    schema,
  });
}

export function columnLower(column: AnySQLiteColumn): SQL {
  return sql`lower(${column})`;
}

export function takeFirst<T extends unknown[]>(values: T): T[number] {
  if (values.length !== 1) return undefined;

  return values[0];
}

export function takeFirstOrThrow<T extends unknown[]>(values: T): T[number] {
  if (values.length !== 1)
    throw new Error('Found non unique or inexistent value');
  return values[0]!;
}

export type UserGoogle = typeof tables.userGoogle.$inferSelect;
