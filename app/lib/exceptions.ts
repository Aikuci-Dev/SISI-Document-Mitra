export function catchFetchError(error: unknown) {
  if (error instanceof Error) {
    if (error.name !== 'FetchError') console.error(error);
  }
  else console.error('unexpected error', error);
}
