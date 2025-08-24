import type { Status, Category, WeightBucket } from './constants';

export interface CargoFilters {
  categories: Category[];
  weightBuckets: WeightBucket[];
  priceMin?: number;
  priceMax?: number;
  nameQuery: string;
}

export interface RawCargo {
  id: string;
  name: string; // 8-16 alphanumeric
  category: Category;
  price: number; // negatif olabilir
  status: Status | null; // %5 null
  kg: number | null; // %10 null
  createdAt: number; // epoch ms
}

export interface CleanCargo {
  id: string;
  name: string;
  category: Category;
  price: number; // >= 0
  status: Status;
  kg: number;
  createdAt: number;
}
