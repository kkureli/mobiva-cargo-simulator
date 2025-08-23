import { useMemo, useState } from 'react';
import { useDatasetStore } from '../state/store';
import { filterCargoList } from '../core/filter';
import { CATEGORIES, WEIGHT_BUCKETS } from '../domain/constants';

export function useListView() {
  const raw = useDatasetStore(s => s.raw);
  const clean = useDatasetStore(s => s.clean);
  const filters = useDatasetStore(s => s.filters);
  const setFilters = useDatasetStore(s => s.setFilters);

  const [nameQuery, setNameQuery] = useState(filters.nameQuery || '');
  const [priceMin, setPriceMin] = useState(
    typeof filters.priceMin === 'number' ? String(filters.priceMin) : '',
  );
  const [priceMax, setPriceMax] = useState(
    typeof filters.priceMax === 'number' ? String(filters.priceMax) : '',
  );

  const base = clean ?? raw;

  const visible = useMemo(() => {
    return filterCargoList(base as any, {
      categories: filters.categories,
      weightBuckets: filters.weightBuckets,
      priceMin: priceMin === '' ? undefined : Number(priceMin),
      priceMax: priceMax === '' ? undefined : Number(priceMax),
      nameQuery,
    });
  }, [
    base,
    filters.categories,
    filters.weightBuckets,
    priceMin,
    priceMax,
    nameQuery,
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

  const toggleCategory = (v: string) => {
    toggleIn(v, filters.categories, v2 => setFilters({ categories: v2 }));
  };

  const toggleBucket = (v: string) => {
    toggleIn(v, filters.weightBuckets, v2 => setFilters({ weightBuckets: v2 }));
  };

  const applyPrice = () => {
    const min = priceMin === '' ? undefined : Number(priceMin);
    const max = priceMax === '' ? undefined : Number(priceMax);
    setFilters({ priceMin: min, priceMax: max, nameQuery });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      weightBuckets: [],
      priceMin: undefined,
      priceMax: undefined,
      nameQuery: '',
    });
    setNameQuery('');
    setPriceMin('');
    setPriceMax('');
  };

  return {
    data: visible,
    counts: { totalCount, resultCount },
    ui: {
      categories: CATEGORIES,
      buckets: WEIGHT_BUCKETS,
      selectedCategories: filters.categories,
      selectedBuckets: filters.weightBuckets,
      nameQuery,
      setNameQuery,
      priceMin,
      priceMax,
      setPriceMin,
      setPriceMax,
    },
    actions: { toggleCategory, toggleBucket, applyPrice, clearFilters },
    isCleanMode: !!clean,
  };
}
