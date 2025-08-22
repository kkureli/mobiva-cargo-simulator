import { useMemo, useState } from 'react';
import { useDatasetStore } from '../state/store';

export function useCreateForm() {
  const generate = useDatasetStore(s => s.generate);
  const clean = useDatasetStore(s => s.clean);
  const reset = useDatasetStore(s => s.reset);
  const genStats = useDatasetStore(s => s.genStats);
  const cleanStats = useDatasetStore(s => s.cleanStats);
  const busy = useDatasetStore(s => s.isGenerating || s.isCleaning);
  const error = useDatasetStore(s => s.error);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>('-100');
  const [priceMax, setPriceMax] = useState<string>('1000');
  const [count, setCount] = useState<string>('1000');

  const canCreate = useMemo(() => {
    const min = Number(priceMin);
    const max = Number(priceMax);
    const c = Number(count);
    return (
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      min < max &&
      Number.isFinite(c) &&
      c >= 1 &&
      c <= 10000
    );
  }, [priceMin, priceMax, count]);

  const toggleIn = (
    val: string,
    list: string[],
    setter: (s: string[]) => void,
  ) => {
    if (list.includes(val)) setter(list.filter(x => x !== val));
    else setter([...list, val]);
  };

  const toggleCategory = (v: string) =>
    toggleIn(v, selectedCategories, setSelectedCategories);
  const toggleBucket = (v: string) =>
    toggleIn(v, selectedBuckets, setSelectedBuckets);
  const toggleStatus = (v: string) =>
    toggleIn(v, selectedStatuses, setSelectedStatuses);

  const onCreate = () => {
    if (!canCreate || busy) return;
    generate({
      categories: selectedCategories,
      weightBuckets: selectedBuckets,
      statuses: selectedStatuses,
      priceMin: Number(priceMin),
      priceMax: Number(priceMax),
      count: Number(count),
    });
  };

  const onClean = () => {
    if (busy) return;
    clean();
  };

  const onReset = () => {
    if (busy) return;
    reset();
    setSelectedCategories([]);
    setSelectedBuckets([]);
    setSelectedStatuses([]);
    setPriceMin('-100');
    setPriceMax('1000');
    setCount('1000');
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
      error,
      genStats,
      cleanStats,
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
    },
  };
}
