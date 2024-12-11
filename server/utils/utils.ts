// Utility function to transform strings to snake_case
export function snakeCase(string: string): string {
  return string.replace(/\W+/g, ' ') // Replace non-alphanumeric characters with space
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

// Function to override values in a object structure
export function overrideValues(obj: Record<string, unknown>, mapped_key: string, value: unknown): void {
  const keys = mapped_key.split('.');
  keys.reduce((acc, curr, index) => {
    if (index === keys.length - 1)
      acc[curr] = value;
    else acc = acc[curr] as Record<string, unknown>; // Cast to allow dynamic indexing in nested objects
    return acc;
  }, obj);
}

// Function to check if data is not undefined
export function isNotUndefined<T>(data: T | undefined): data is T {
  return typeof data !== 'undefined';
}

// Helper function to check if a key exists on an object
function isKeyExistOnObject(data: unknown, key: string | number): boolean {
  return typeof data === 'object' && data !== null && key in data;
}

// Function to retrieve a value from the data object using a dot-separated key path
export function getValueByKey(data: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.');
  let result: unknown = data;

  for (const part of keys) {
    const arrayMatch = part.match(/\[(\d+)\]$/);
    const baseKey = arrayMatch ? part.replace(/\[\d+\]$/, '') : part;

    if (arrayMatch) {
      const index = parseInt(arrayMatch[1], 10);
      result = isKeyExistOnObject(result, baseKey)
        ? (result as Record<string, unknown>)[baseKey]
        : undefined;

      if (Array.isArray(result)) result = result[index];
      else return undefined;
    }
    else
      result = isKeyExistOnObject(result, part)
        ? (result as Record<string, unknown>)[part]
        : undefined;

    // If the result becomes undefined, return early
    if (result === undefined) return undefined;
  }

  return result;
}
