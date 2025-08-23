export type Status =
  | 'PREPARING'
  | 'AT_BRANCH'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED';

export type Category =
  | 'electronics'
  | 'cleaning'
  | 'apparel'
  | 'food'
  | 'books'
  | 'cosmetics'
  | 'homeliving'
  | 'toys'
  | 'sports';

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
