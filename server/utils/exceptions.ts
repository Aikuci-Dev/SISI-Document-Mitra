import { LibsqlError } from '@libsql/client';

export function catchFirst<T extends unknown[]>(values: T): T[number] {
  try {
    return takeFirstOrThrow(values);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message == 'Found non unique or inexistent value')
        throw createError({ statusCode: 404 });
    }
  }
}

export function catchInsertUnique(error: unknown) {
  if (error instanceof LibsqlError) {
    if (error.message.startsWith('SQLITE_CONSTRAINT'))
      throw createError({
        statusCode: 409,
        statusMessage: `Conflict with an existing user. >> Please use other email OR contact support if the issue persists.`,
      });

    console.error(error);
  }

  throw createError('Something went wrong. >> Please contact support.');
}
