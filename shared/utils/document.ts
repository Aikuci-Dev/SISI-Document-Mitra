export type DataItem<T> = {
  key: number | string;
  value: T;
};
type RecommendationItem<T> = {
  value: T;
  weight: number;
};
type RecommendationMap<T> = Map<T, RecommendationItem<T>>;

export function buildRecommendationList<T>(items: DataItem<T>[], searchKey: number | string): RecommendationMap<T> {
  const weights = new Map<T, RecommendationItem<T>>();

  // Calculate weights based on the matching criteria and accumulate them
  items.forEach(({ key, value }) => {
    const weight = (key === searchKey) ? 10 : 1;
    const currentItem = weights.get(value) || { value, weight: 0 };
    currentItem.weight += weight;
    weights.set(value, currentItem);
  });

  // Convert accumulated data into a sorted array of tuples
  const sortedEntries = Array.from(weights.values())
    .sort((a, b) => b.weight !== a.weight ? b.weight - a.weight : String(b.value).localeCompare(String(a.value)))
    .map(item => [item.value, item] as [T, RecommendationItem<T>]); // Create tuples for the Map

  return new Map(sortedEntries);
}
