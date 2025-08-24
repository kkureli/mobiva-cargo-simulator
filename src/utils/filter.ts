import { Category, WeightBucket } from '../models/constants';
import { CargoFilters, RawCargo } from '../models/types';

function parseBucket(bucket: WeightBucket): [number, number] {
  const [minStr, maxStr] = bucket.split('-');
  return [Number(minStr), Number(maxStr)];
}

function isInBucketNum(kg: number, min: number, max: number): boolean {
  return kg >= min && kg < max;
}

export function filterCargoList<
  T extends Pick<RawCargo, 'category' | 'price' | 'name' | 'kg'>,
>(cargoList: T[], filters: CargoFilters): T[] {
  if (!Array.isArray(cargoList) || cargoList.length === 0) return [];

  const filtered: T[] = [];
  const selectedCategories = filters.categories.length
    ? new Set(filters.categories)
    : null;
  const hasWeightFilter = filters.weightBuckets.length > 0;
  const nameQuery = filters.nameQuery || '';

  const parsedBuckets: Array<[number, number]> = hasWeightFilter
    ? filters.weightBuckets.map(parseBucket)
    : [];

  const hasMin = typeof filters.priceMin === 'number';
  const hasMax = typeof filters.priceMax === 'number';
  const minPrice = hasMin ? (filters.priceMin as number) : undefined;
  const maxPrice = hasMax ? (filters.priceMax as number) : undefined;

  for (let i = 0; i < cargoList.length; i++) {
    const cargo = cargoList[i];

    if (
      selectedCategories &&
      !selectedCategories.has(cargo.category as Category)
    )
      continue;

    if (hasWeightFilter) {
      if (cargo.kg == null || !Number.isFinite(cargo.kg)) continue;
      let match = false;
      const kg = cargo.kg as number;
      for (let j = 0; j < parsedBuckets.length; j++) {
        const [mn, mx] = parsedBuckets[j];
        if (isInBucketNum(kg, mn, mx)) {
          match = true;
          break;
        }
      }
      if (!match) continue;
    }

    if (!Number.isFinite(cargo.price)) continue;
    if (hasMin && (cargo.price as number) < (minPrice as number)) continue;
    if (hasMax && (cargo.price as number) > (maxPrice as number)) continue;

    if (nameQuery && !cargo.name.includes(nameQuery)) continue;

    filtered.push(cargo);
  }

  return filtered;
}
