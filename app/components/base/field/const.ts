export const highlightClasses: Record<number, string> = {
  0: '',
  1: 'bg-yellow-500 text-white',
};

export function highlightLevel<T>(original: T, value: T) {
  if (original === value) return highlightClasses[0];
  return highlightClasses[1];
}
