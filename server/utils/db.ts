import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDB() {
  return drizzle({ connection: { url: process.env.DB_FILE_NAME! }, schema });
}

export function takeFirst<T extends any[]>(values: T): T[number] {
  if (values.length !== 1) return undefined;

  return values[0];
}

export function takeFirstOrThrow<T extends any[]>(values: T): T[number] {
  if (values.length !== 1)
    throw new Error("Found non unique or inexistent value");
  return values[0]!;
}

export type UserGoogle = typeof tables.userGoogle.$inferSelect;
