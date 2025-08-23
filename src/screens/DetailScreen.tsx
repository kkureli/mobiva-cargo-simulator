import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDatasetStore } from '../state/store';
import { CATEGORIES, STATUSES } from '../domain/constants';

const catSet = new Set(CATEGORIES);
const statusSet = new Set(STATUSES);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function DetailScreen() {
  const route = useRoute<any>();
  const { id } = route.params as { id: string };

  const raw = useDatasetStore(s => s.raw);
  const clean = useDatasetStore(s => s.clean);

  const item = useMemo(() => {
    const base = clean ?? raw;
    return base.find(x => x.id === id);
  }, [id, raw, clean]);

  if (!item) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Not Found</Text>
      </View>
    );
  }

  const inCleanMode = !!clean;

  const idDirty = !inCleanMode && !uuidV4.test(item.id);
  const categoryDirty = !inCleanMode && !catSet.has(item.category);
  const priceDirty = !inCleanMode && item.price < 0;
  const statusDirty =
    !inCleanMode && (!item.status || !statusSet.has(item.status as any));
  const kgDirty = !inCleanMode && item.kg == null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Detail</Text>
      <View style={styles.box}>
        <Text style={[styles.row, idDirty && styles.dirty]}>id: {item.id}</Text>
        <Text style={styles.row}>name: {item.name}</Text>
        <Text style={[styles.row, categoryDirty && styles.dirty]}>
          category: {item.category}
        </Text>
        <Text style={[styles.row, priceDirty && styles.dirty]}>
          price: {item.price}
        </Text>
        <Text style={[styles.row, statusDirty && styles.dirty]}>
          status: {String(item.status)}
        </Text>
        <Text style={[styles.row, kgDirty && styles.dirty]}>
          kg: {String(item.kg)}
        </Text>
        <Text style={styles.row}>
          createdAt: {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      {!inCleanMode &&
      (idDirty || categoryDirty || priceDirty || statusDirty || kgDirty) ? (
        <Text style={styles.warn}>
          This record has dirty fields (highlighted).
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  box: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  row: { marginBottom: 6 },
  dirty: { color: '#b42318', fontWeight: '700' },
  warn: { color: '#b42318', marginTop: 8 },
});
