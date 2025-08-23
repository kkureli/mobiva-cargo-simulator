import { useMemo, useState } from 'react';
import { useDatasetStore } from '../state/store';
import { filterCargoList } from '../core/filter';
import { CATEGORIES, WEIGHT_BUCKETS } from '../domain/constants';
import { PRICE_MIN_LIMIT, PRICE_MAX_LIMIT } from '../domain/limits';
import { InteractionManager } from 'react-native';

export function useListView() {
  const raw = useDatasetStore(s => s.raw);
  const clean = useDatasetStore(s => s.clean);
  const filters = useDatasetStore(s => s.filters);
  const setFilters = useDatasetStore(s => s.setFilters);

  const [localCategories, setLocalCategories] = useState<string[]>(
    filters.categories,
  );
  const [localBuckets, setLocalBuckets] = useState<string[]>(
    filters.weightBuckets,
  );
  const [nameQuery, setNameQuery] = useState(filters.nameQuery || '');
  const [priceMin, setPriceMin] = useState(
    typeof filters.priceMin === 'number' ? String(filters.priceMin) : '',
  );
  const [priceMax, setPriceMax] = useState(
    typeof filters.priceMax === 'number' ? String(filters.priceMax) : '',
  );
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const base = clean ?? raw;
  const visible = useMemo(() => {
    return filterCargoList(base as any, {
      categories: filters.categories,
      weightBuckets: filters.weightBuckets,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      nameQuery: filters.nameQuery,
    });
  }, [
    base,
    filters.categories,
    filters.weightBuckets,
    filters.priceMin,
    filters.priceMax,
    filters.nameQuery,
  ]);

  const totalCount = base.length;
  const resultCount = visible.length;

  const toggleIn = (
    val: string,
    list: string[],
    next: (v: string[]) => void,
  ) => {
    if (list.includes(val)) next(list.filter(x => x !== val));
    else next([...list, val]);
  };

  const toggleCategory = (v: string) =>
    toggleIn(v, localCategories, setLocalCategories);
  const toggleBucket = (v: string) =>
    toggleIn(v, localBuckets, setLocalBuckets);

  const validate = () => {
    const errs: string[] = [];
    const min = priceMin === '' ? undefined : Number(priceMin);
    const max = priceMax === '' ? undefined : Number(priceMax);

    if (priceMin !== '' && !Number.isFinite(min))
      errs.push('Min price sayı olmalı.');
    if (priceMax !== '' && !Number.isFinite(max))
      errs.push('Max price sayı olmalı.');
    if (Number.isFinite(min) && (min as number) < PRICE_MIN_LIMIT)
      errs.push(`Min price en az ${PRICE_MIN_LIMIT}.`);
    if (Number.isFinite(max) && (max as number) > PRICE_MAX_LIMIT)
      errs.push(`Max price en fazla ${PRICE_MAX_LIMIT}.`);
    if (
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      (min as number) >= (max as number)
    )
      errs.push("Min price, max price'tan küçük olmalı.");

    return { errs, min, max };
  };
  const applyFilters = () => {
    const { errs, min, max } = validate();
    setFormErrors(errs);
    if (errs.length > 0) return;

    InteractionManager.runAfterInteractions(() => {
      setFilters({
        categories: localCategories,
        weightBuckets: localBuckets,
        priceMin: typeof min === 'number' ? min : undefined,
        priceMax: typeof max === 'number' ? max : undefined,
        nameQuery,
      });
    });
  };

  const clearFilters = () => {
    setLocalCategories([]);
    setLocalBuckets([]);
    setNameQuery('');
    setPriceMin('');
    setPriceMax('');
    setFormErrors([]);
    setFilters({
      categories: [],
      weightBuckets: [],
      priceMin: undefined,
      priceMax: undefined,
      nameQuery: '',
    });
  };

  return {
    data: visible,
    counts: { totalCount, resultCount },
    ui: {
      categories: CATEGORIES,
      buckets: WEIGHT_BUCKETS,
      selectedCategories: localCategories,
      selectedBuckets: localBuckets,
      nameQuery,
      setNameQuery,
      priceMin,
      priceMax,
      setPriceMin,
      setPriceMax,
      formErrors,
    },
    actions: { toggleCategory, toggleBucket, applyFilters, clearFilters },
    isCleanMode: !!clean,
  };
}
