// Type Declarations
type InvertedObject<T extends object> = {
  [
  K in NonNullable<T[keyof T]> extends string | number | symbol
    ? NonNullable<T[keyof T]>
    : never
  ]: keyof T;
};

type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

// --- String Manipulation Functions ---

// Converts a string to snake_case.
export function snakeCase(string: string): string {
  return string.replace(/\W+/g, ' ') // Replace non-alphanumeric characters with space
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

// Retrieves a value from an object using a dot-separated key path.
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

// Overrides values in a nested object using a dot-separated key path.
export function overrideValues(obj: Record<string, unknown>, mapped_key: string, value: unknown): void {
  const keys = mapped_key.split('.');
  keys.reduce((acc, curr, index) => {
    if (index === keys.length - 1)
      acc[curr] = value;
    else acc = acc[curr] as Record<string, unknown>; // Cast to allow dynamic indexing in nested objects
    return acc;
  }, obj);
}

// --- Object Manipulation Functions ---

// Inverts key-value pairs in an object.
export function invertKeyValue<T extends object>(obj: T): InvertedObject<T> {
  const valuableObj = removeNullUndefined(obj);

  const inverted: Record<string, string> = {};
  for (const [originalKey, value] of Object.entries(valuableObj)) inverted[String(value)] = originalKey;

  return inverted as InvertedObject<T>;
}

// Removes null and undefined values from an object.
export function removeNullUndefined<T extends object>(obj: T): WithoutNullableKeys<T> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, typeof value === 'object' ? removeNullUndefined(value) : value]),
  ) as WithoutNullableKeys<T>;
}

// Checks if a value is not undefined.
export function isNotUndefined<T>(data: T | undefined): data is T {
  return typeof data !== 'undefined';
}

// --- Helper Functions ---

// Check if a key exists in an object.
function isKeyExistOnObject(data: unknown, key: string | number): boolean {
  return typeof data === 'object' && data !== null && key in data;
}
