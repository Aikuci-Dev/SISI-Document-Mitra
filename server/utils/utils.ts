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
