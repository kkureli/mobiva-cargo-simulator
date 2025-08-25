import { Category, RawCargo, Status, WeightBucket } from '../../models/types';
import { STATUSES } from '../../models/constants';
import { uuidv4, randomAlnum, pick } from '../shared/random';
const NULL_STATUS_RATIO = 0.05;
const NULL_KG_RATIO = 0.1;

export type GenParams = {
  categories: Category[];
  weightBuckets: WeightBucket[];
  statuses: Status[];
  priceMin: number;
  priceMax: number;
  count: number;
};

function kgFromBucket(bucket: WeightBucket): number {
  const [minStr, maxStr] = bucket.split('-');
  const min = Number(minStr);
  const max = Number(maxStr);
  return min + Math.random() * (max - min);
}

function pickRandomIndexes(total: number, count: number): Set<number> {
  const result = new Set<number>();

  if (count <= 0) return result;

  if (count >= total) {
    for (let i = 0; i < total; i++) result.add(i);
    return result;
  }

  while (result.size < count) {
    const randomIndex = (Math.random() * total) | 0;
    result.add(randomIndex);
  }

  return result;
}

export function createCargoDataset(params: GenParams) {
  const { categories, weightBuckets, statuses, priceMin, priceMax, count } =
    params;

  if (!categories.length) throw new Error('Kategori listesi boş olamaz.');
  if (!weightBuckets.length) throw new Error('Weight bucket seçilmedi.');
  if (
    !Number.isFinite(priceMin) ||
    !Number.isFinite(priceMax) ||
    priceMin >= priceMax
  )
    throw new Error('Geçersiz fiyat aralığı.');
  if (!Number.isFinite(count) || count < 1 || count > 10000)
    throw new Error('Adet 1 ile 10000 arasında olmalı.');
  if (count > 10000) {
    throw new Error(
      'OUT_OF_MEMORY: Bellek yetersiz, 10000 satırdan fazla üretilemez',
    );
  }

  const rows: RawCargo[] = new Array(count);

  const targetNullStatusCount = Math.floor(count * NULL_STATUS_RATIO);
  const targetNullKgCount = Math.floor(count * NULL_KG_RATIO);

  let targetNegativeCount = 0;
  if (priceMin < 0) {
    const negSpan = Math.min(0, priceMax) - priceMin;
    const totalSpan = priceMax - priceMin;
    const ratio =
      totalSpan > 0 ? Math.max(0, Math.min(1, negSpan / totalSpan)) : 0;
    targetNegativeCount = Math.floor(count * ratio);
  }

  const nullStatusIndexes = pickRandomIndexes(count, targetNullStatusCount);
  const nullKgIndexes = pickRandomIndexes(count, targetNullKgCount);
  const negativePriceIndexes = pickRandomIndexes(count, targetNegativeCount);

  const startedAt = Date.now();
  const statusPool: Status[] = statuses.length ? statuses : [...STATUSES];

  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    const name = randomAlnum(8, 16);
    const category = pick(categories);

    let price: number;
    if (negativePriceIndexes.has(i)) {
      const maxNeg = Math.min(priceMax, 0);
      price = priceMin + Math.random() * (maxNeg - priceMin);
    } else {
      const minNonNeg = Math.max(priceMin, 0);
      price = minNonNeg + Math.random() * (priceMax - minNonNeg);
    }

    let kg: number | null;
    if (nullKgIndexes.has(i)) {
      kg = null;
    } else {
      kg = kgFromBucket(pick(weightBuckets));
    }

    let status: Status | null;
    if (nullStatusIndexes.has(i)) {
      status = null;
    } else {
      status = pick(statusPool);
    }

    rows[i] = {
      id,
      name,
      category,
      price,
      status,
      kg,
      createdAt: Date.now(),
    };
  }

  const endedAt = Date.now();

  return {
    rows,
    stats: {
      generatedCount: count,
      nullStatusCount: targetNullStatusCount,
      nullKgCount: targetNullKgCount,
      negativePriceCount: targetNegativeCount,
      generationStartAt: startedAt,
      generationEndAt: endedAt,
      generationDurationMs: endedAt - startedAt,
    },
  };
}
