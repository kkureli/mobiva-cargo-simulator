import { CATEGORIES, STATUSES, WEIGHT_BUCKETS } from './constants';

export type WeightBucket = (typeof WEIGHT_BUCKETS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

export interface CargoFilters {
  categories: Category[];
  weightBuckets: WeightBucket[];
  priceMin?: number;
  priceMax?: number;
  nameQuery: string;
}

export interface RawCargo {
  id: string;
  name: string;
  category: Category;
  price: number;
  status: Status | null;
  kg: number | null;
  createdAt: number;
  imageUrl?: string;
}

export interface CleanCargo {
  id: string;
  name: string;
  category: Category;
  price: number;
  status: Status;
  kg: number;
  createdAt: number;
  imageUrl?: string;
}
