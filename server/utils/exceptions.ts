export function catchFirstOrThrow<T extends unknown[]>(values: T): T[number] {
  try {
    return takeFirstOrThrow(values);
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message == 'Found non unique or inexistent value')
        throw createError({
          statusCode: 404,
        });
    }
  }
}
