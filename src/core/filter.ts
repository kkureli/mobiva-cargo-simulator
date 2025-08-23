import { Category, RawCargo } from '../domain/types';

export type CargoFilters = {
  categories: Category[];
  weightBuckets: string[];
  priceMin?: number;
  priceMax?: number;
  nameQuery?: string;
};

function isInBucket(kg: number, bucket: string): boolean {
  const [minStr, maxStr] = bucket.split('-');
  const min = Number(minStr);
  const max = Number(maxStr);
  return kg >= min && kg < max;
}

export function filterCargoList<
  T extends Pick<RawCargo, 'category' | 'price' | 'name' | 'kg'>,
>(cargoList: T[], filters: CargoFilters): T[] {
  const filtered: T[] = [];
  const selectedCategories = filters.categories.length
    ? new Set(filters.categories)
    : null;
  const hasWeightFilter = filters.weightBuckets.length > 0;
  const nameQuery = filters.nameQuery || '';

  for (let i = 0; i < cargoList.length; i++) {
    const cargo = cargoList[i];

    if (
      selectedCategories &&
      !selectedCategories.has(cargo.category as Category)
    )
      continue;

    if (hasWeightFilter) {
      if (cargo.kg == null) continue;
      let match = false;
      for (let j = 0; j < filters.weightBuckets.length; j++) {
        if (isInBucket(cargo.kg as number, filters.weightBuckets[j])) {
          match = true;
          break;
        }
      }
      if (!match) continue;
    }

    if (typeof filters.priceMin === 'number' && cargo.price < filters.priceMin)
      continue;
    if (typeof filters.priceMax === 'number' && cargo.price > filters.priceMax)
      continue;

    if (nameQuery && !cargo.name.includes(nameQuery)) continue;

    filtered.push(cargo);
  }

  return filtered;
}
