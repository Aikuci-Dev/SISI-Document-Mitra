import { LibsqlError } from '@libsql/client';

export function catchFirst<T extends unknown[]>(values: T, errorMessage?: string): T[number] {
  try {
    return takeFirstOrThrow(values);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message == 'Found non unique or inexistent value')
        throw createError({ statusCode: 404, statusMessage: errorMessage });

      console.error(error);
    }
    console.error('unexpected error', error);
  }
}

export function catchInsertUnique(error: unknown, errorMessage?: string) {
  if (error instanceof LibsqlError) {
    if (error.message.startsWith('SQLITE_CONSTRAINT'))
      throw createError({
        statusCode: 409,
        statusMessage: errorMessage || `Conflict with an existing user. >> Please use other email OR contact support if the issue persists.`,
      });

    console.error(error);
  }

  throw createError('Something went wrong. >> Please contact support.');
}
