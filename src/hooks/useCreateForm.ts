import { useMemo, useState } from 'react';
import { useDatasetStore } from '../state/store';
import {
  PRICE_MIN_LIMIT,
  PRICE_MAX_LIMIT,
  COUNT_MIN_LIMIT,
  COUNT_MAX_LIMIT,
} from '../models/limits';
import { parseNumStrict } from '../utils/number';
import { Category, Status, WeightBucket } from '../models/types';

export function useCreateForm() {
  const generate = useDatasetStore(s => s.generate);
  const runClean = useDatasetStore(s => s.runClean);
  const resetStore = useDatasetStore(s => s.reset);
  const genStats = useDatasetStore(s => s.genStats);
  const cleanStats = useDatasetStore(s => s.cleanStats);
  const busy = useDatasetStore(s => s.isGenerating || s.isCleaning);
  const storeError = useDatasetStore(s => s.error);
  const clearStoreError = useDatasetStore(s => s.clearError);

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedBuckets, setSelectedBuckets] = useState<WeightBucket[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [priceMin, setPriceMin] = useState<string>(String(PRICE_MIN_LIMIT));
  const [priceMax, setPriceMax] = useState<string>(String(PRICE_MAX_LIMIT));
  const [count, setCount] = useState<string>('1000');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const parsed = useMemo(() => {
    const min = parseNumStrict(priceMin);
    const max = parseNumStrict(priceMax);
    const cnt = parseNumStrict(count);
    return { min, max, cnt };
  }, [priceMin, priceMax, count]);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!Number.isFinite(parsed.min)) e.push('Price min number olmalı.');
    if (!Number.isFinite(parsed.max)) e.push('Price max number olmalı.');
    if (Number.isFinite(parsed.min) && parsed.min < PRICE_MIN_LIMIT)
      e.push(`Price min en az ${PRICE_MIN_LIMIT}.`);
    if (Number.isFinite(parsed.max) && parsed.max > PRICE_MAX_LIMIT)
      e.push(`Price max en fazla ${PRICE_MAX_LIMIT}.`);
    if (
      Number.isFinite(parsed.min) &&
      Number.isFinite(parsed.max) &&
      parsed.min >= parsed.max
    )
      e.push("Price min, max'ten küçük olmalı.");

    if (!Number.isFinite(parsed.cnt)) e.push('Count number olmalı.');
    if (Number.isFinite(parsed.cnt) && parsed.cnt % 1 !== 0)
      e.push('Count tam sayı olmalı.');
    if (Number.isFinite(parsed.cnt) && parsed.cnt < COUNT_MIN_LIMIT)
      e.push(`Count en az ${COUNT_MIN_LIMIT}.`);
    if (Number.isFinite(parsed.cnt) && parsed.cnt > COUNT_MAX_LIMIT)
      e.push(`Count en fazla ${COUNT_MAX_LIMIT}.`);
    return e;
  }, [parsed]);

  const canCreate = errors.length === 0 && !busy;

  const toggleIn = <T>(val: T, list: T[], setter: (s: T[]) => void) => {
    if (list.includes(val)) setter(list.filter(x => x !== val));
    else setter([...list, val]);
  };

  const toggleCategory = (v: Category) =>
    toggleIn(v, selectedCategories, setSelectedCategories);
  const toggleBucket = (v: WeightBucket) =>
    toggleIn(v, selectedBuckets, setSelectedBuckets);
  const toggleStatus = (v: Status) =>
    toggleIn(v, selectedStatuses, setSelectedStatuses);

  const onCreate = () => {
    setFormErrors(errors);
    if (errors.length > 0 || busy) return;
    generate({
      categories: selectedCategories,
      weightBuckets: selectedBuckets,
      statuses: selectedStatuses,
      priceMin: parsed.min,
      priceMax: parsed.max,
      count: parsed.cnt,
    });
  };

  const onClean = () => {
    if (busy) return;
    runClean();
  };

  const onReset = () => {
    if (busy) return;
    resetStore();
    clearStoreError();
    setSelectedCategories([]);
    setSelectedBuckets([]);
    setSelectedStatuses([]);
    setPriceMin(String(PRICE_MIN_LIMIT));
    setPriceMax(String(PRICE_MAX_LIMIT));
    setCount('1000');
    setFormErrors([]);
  };

  return {
    state: {
      selectedCategories,
      selectedBuckets,
      selectedStatuses,
      priceMin,
      priceMax,
      count,
      canCreate,
      busy,
      error: storeError,
      genStats,
      cleanStats,
      formErrors,
    },
    actions: {
      setPriceMin,
      setPriceMax,
      setCount,
      toggleCategory,
      toggleBucket,
      toggleStatus,
      onCreate,
      onClean,
      onReset,
      clearStoreError,
    },
    limits: {
      PRICE_MIN_LIMIT,
      PRICE_MAX_LIMIT,
      COUNT_MIN_LIMIT,
      COUNT_MAX_LIMIT,
    },
  };
}
