import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Chip from '../ui/components/Chip';
import { CATEGORIES, WEIGHT_BUCKETS, STATUSES } from '../domain/constants';
import { useDatasetStore } from '../state/store';

export default function CreateScreen() {
  const generate = useDatasetStore(s => s.generate);
  const clean = useDatasetStore(s => s.clean);
  const reset = useDatasetStore(s => s.reset);
  const genStats = useDatasetStore(s => s.genStats);
  const cleanStats = useDatasetStore(s => s.cleanStats);
  const busy = useDatasetStore(s => s.isGenerating || s.isCleaning);
  const error = useDatasetStore(s => s.error);

  const [selCats, setSelCats] = useState<string[]>([]);
  const [selBuckets, setSelBuckets] = useState<string[]>([]);
  const [selStatuses, setSelStatuses] = useState<string[]>([]);
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

  const onToggle = (
    val: string,
    list: string[],
    setter: (s: string[]) => void,
  ) => {
    if (list.includes(val)) setter(list.filter(x => x !== val));
    else setter([...list, val]);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Create Data</Text>

      <Text style={styles.label}>Categories (multi)</Text>
      <View style={styles.row}>
        {CATEGORIES.map(c => (
          <Chip
            key={c}
            label={c}
            selected={selCats.includes(c)}
            onPress={() => onToggle(c, selCats, setSelCats)}
          />
        ))}
      </View>

      <Text style={styles.label}>Weight Buckets (multi)</Text>
      <View style={styles.row}>
        {WEIGHT_BUCKETS.map(b => (
          <Chip
            key={b}
            label={b}
            selected={selBuckets.includes(b)}
            onPress={() => onToggle(b, selBuckets, setSelBuckets)}
          />
        ))}
      </View>

      <Text style={styles.label}>Statuses (multi, optional)</Text>
      <View style={styles.row}>
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={s}
            selected={selStatuses.includes(s)}
            onPress={() => onToggle(s, selStatuses, setSelStatuses)}
          />
        ))}
      </View>

      <Text style={styles.label}>Price Min / Max</Text>
      <View style={styles.inline}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={priceMin}
          onChangeText={setPriceMin}
        />
        <Text style={{ marginHorizontal: 8 }}>/</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={priceMax}
          onChangeText={setPriceMax}
        />
      </View>

      <Text style={styles.label}>Count</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={count}
        onChangeText={setCount}
      />

      <View style={styles.buttons}>
        <Button
          title="🚀 Create"
          disabled={!canCreate || busy}
          onPress={() => {
            generate({
              categories: selCats,
              weightBuckets: selBuckets,
              statuses: selStatuses,
              priceMin: Number(priceMin),
              priceMax: Number(priceMax),
              count: Number(count),
            });
          }}
        />
      </View>

      <View style={styles.buttons}>
        <Button title="🧹 Clean" disabled={busy} onPress={() => clean()} />
      </View>

      <View style={styles.buttons}>
        <Button title="🔄 Reset" disabled={busy} onPress={() => reset()} />
      </View>

      {error ? <Text style={styles.err}>Error: {error}</Text> : null}

      <Text style={styles.h2}>Generation Stats</Text>
      {genStats ? (
        <View style={styles.box}>
          <Text>generatedCount: {genStats.generatedCount}</Text>
          <Text>nullStatusCount: {genStats.nullStatusCount}</Text>
          <Text>nullKgCount: {genStats.nullKgCount}</Text>
          <Text>negativePriceCount: {genStats.negativePriceCount}</Text>
          <Text>
            start: {new Date(genStats.generationStartAt).toLocaleTimeString()}
          </Text>
          <Text>
            end: {new Date(genStats.generationEndAt).toLocaleTimeString()}
          </Text>
          <Text>durationMs: {genStats.generationDurationMs}</Text>
        </View>
      ) : (
        <Text style={styles.muted}>No data yet</Text>
      )}

      <Text style={styles.h2}>Clean Stats</Text>
      {cleanStats ? (
        <View style={styles.box}>
          <Text>removedCount: {cleanStats.removedCount}</Text>
          <Text>remainingCount: {cleanStats.remainingCount}</Text>
          <Text>cleanDurationMs: {cleanStats.cleanDurationMs}</Text>
        </View>
      ) : (
        <Text style={styles.muted}>No clean run</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  inline: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
  },
  buttons: { marginTop: 12 },
  box: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f6f8fa',
  },
  err: { color: '#d14343', marginTop: 8 },
  muted: { color: '#57606a' },
});
