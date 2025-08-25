import { create } from 'zustand';
import { DatasetStore } from './types';
import { generateRaw } from '../utils/gen';
import { clean as runClean } from '../utils/clean';
import { CATEGORIES, WEIGHT_BUCKETS, STATUSES } from '../models/constants';
import { CLEAN_TIMEOUT_MS } from '../models/limits';
import { CargoFilters } from '../models/types';

const initialFilters: CargoFilters = {
  categories: [],
  weightBuckets: [],
  priceMin: undefined,
  priceMax: undefined,
  nameQuery: '',
};

export const useDatasetStore = create<DatasetStore>((set, get) => ({
  raw: [],
  clean: null,
  genStats: null,
  cleanStats: null,
  filters: initialFilters,
  isGenerating: false,
  isCleaning: false,
  error: null,

  generate: params => {
    try {
      set({ isGenerating: true, error: null });
      const res = generateRaw({
        categories: params.categories.length
          ? params.categories
          : (CATEGORIES as any),
        weightBuckets: params.weightBuckets.length
          ? params.weightBuckets
          : WEIGHT_BUCKETS,
        statuses: params.statuses.length ? params.statuses : (STATUSES as any),
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        count: params.count,
      });
      set({
        raw: res.rows,
        genStats: {
          generatedCount: res.stats.generatedCount,
          nullStatusCount: res.stats.nullStatusCount,
          nullKgCount: res.stats.nullKgCount,
          negativePriceCount: res.stats.negativePriceCount,
          generationStartAt: res.stats.generationStartAt,
          generationEndAt: res.stats.generationEndAt,
          generationDurationMs: res.stats.generationDurationMs,
        },
        clean: null,
        cleanStats: null,
        isGenerating: false,
      });
    } catch (e: any) {
      set({ error: String(e?.message || e), isGenerating: false });
    }
  },

  runClean: () => {
    try {
      set({ isCleaning: true, error: null });
      const { raw } = get();
      const res = runClean(raw, { timeoutMs: CLEAN_TIMEOUT_MS });
      set({
        clean: res.rows,
        cleanStats: {
          removedCount: res.removedCount,
          remainingCount: res.remainingCount,
          cleanDurationMs: res.cleanDurationMs,
        },
        isCleaning: false,
      });
    } catch (e: any) {
      set({ error: String(e?.message || e), isCleaning: false });
    }
  },

  reset: () => {
    set({
      raw: [],
      clean: null,
      genStats: null,
      cleanStats: null,
      filters: { ...initialFilters },
      isGenerating: false,
      isCleaning: false,
      error: null,
    });
  },

  setFilters: f => {
    const next = { ...get().filters, ...f };
    set({ filters: next });
  },

  clearError: () => set({ error: null }),
}));
