import { RawCargo, Category, Status } from '../domain/types';
import { STATUSES } from '../domain/constants';
import { uuidv4, randomAlnum, pick } from './random';

export type GenParams = {
  categories: Category[];
  weightBuckets: string[];
  statuses: Status[];
  priceMin: number;
  priceMax: number;
  count: number;
};

function randomFromBucket(bucket: string): number {
  const [minS, maxS] = bucket.split('-');
  const min = Number(minS);
  const max = Number(maxS);
  return min + Math.random() * (max - min);
}

function pickUniqueIndices(n: number, k: number): Set<number> {
  const chosen = new Set<number>();
  if (k <= 0) return chosen;
  if (k >= n) {
    for (let i = 0; i < n; i++) chosen.add(i);
    return chosen;
  }
  while (chosen.size < k) chosen.add((Math.random() * n) | 0);
  return chosen;
}

export function generateRaw(params: GenParams) {
  const { categories, weightBuckets, statuses, priceMin, priceMax, count } =
    params;

  if (!categories.length) throw new Error('categories boş');
  if (!weightBuckets.length) throw new Error('weightBuckets boş');
  if (
    !Number.isFinite(priceMin) ||
    !Number.isFinite(priceMax) ||
    priceMin >= priceMax
  )
    throw new Error('price aralığı geçersiz');
  if (!Number.isFinite(count) || count < 1 || count > 10000)
    throw new Error('count 1..10000 olmalı');
  if (count > 10000) {
    throw new Error('OUT_OF_MEMORY: too many rows requested');
  }
  const rows: RawCargo[] = new Array(count);

  const nullStatusTarget = Math.floor(count * 0.05);
  const nullKgTarget = Math.floor(count * 0.1);

  let negTarget = 0;
  if (priceMin < 0) {
    const negSpan = Math.min(0, priceMax) - priceMin;
    const totalSpan = priceMax - priceMin;
    const ratio =
      totalSpan > 0 ? Math.max(0, Math.min(1, negSpan / totalSpan)) : 0;
    negTarget = Math.floor(count * ratio);
  }

  const nullStatusIdx = pickUniqueIndices(count, nullStatusTarget);
  const nullKgIdx = pickUniqueIndices(count, nullKgTarget);
  const negPriceIdx = pickUniqueIndices(count, negTarget);

  const tStart = Date.now();
  const pool = statuses.length ? statuses : (STATUSES as unknown as Status[]);

  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    const name = randomAlnum(8, 16);
    const category = pick(categories);

    let price: number;
    if (negPriceIdx.has(i)) {
      const negMax = Math.min(priceMax, 0);
      price = priceMin + Math.random() * (negMax - priceMin);
    } else {
      const nonNegMin = Math.max(priceMin, 0);
      price = nonNegMin + Math.random() * (priceMax - nonNegMin);
    }

    let kg: number | null;
    if (nullKgIdx.has(i)) {
      kg = null;
    } else {
      kg = randomFromBucket(pick(weightBuckets));
    }

    let status: Status | null;
    if (nullStatusIdx.has(i)) {
      status = null;
    } else {
      status = pick(pool);
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

  const tEnd = Date.now();

  return {
    rows,
    stats: {
      generatedCount: count,
      nullStatusCount: nullStatusTarget,
      nullKgCount: nullKgTarget,
      negativePriceCount: negTarget,
      generationStartAt: tStart,
      generationEndAt: tEnd,
      generationDurationMs: tEnd - tStart,
    },
  };
}
