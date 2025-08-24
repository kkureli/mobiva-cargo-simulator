import { Category, Status, WeightBucket } from '../models/constants';
import { RawCargo, CleanCargo, CargoFilters } from '../models/types';

export type GenerationStats = {
  generatedCount: number;
  nullStatusCount: number;
  nullKgCount: number;
  negativePriceCount: number;
  generationStartAt: number;
  generationEndAt: number;
  generationDurationMs: number;
};

export type CleanStats = {
  removedCount: number;
  remainingCount: number;
  cleanDurationMs: number;
};

export type DatasetState = {
  raw: RawCargo[];
  clean: CleanCargo[] | null;
  genStats: GenerationStats | null;
  cleanStats: CleanStats | null;
  filters: CargoFilters;
  isGenerating: boolean;
  isCleaning: boolean;
  error: string | null;
};

export type DatasetActions = {
  generate: (params: {
    categories: Category[];
    weightBuckets: WeightBucket[];
    statuses: Status[];
    priceMin: number;
    priceMax: number;
    count: number;
  }) => void;
  runClean: () => void;
  reset: () => void;
  setFilters: (f: Partial<CargoFilters>) => void;
  clearError: () => void;
};

export type DatasetStore = DatasetState & DatasetActions;
