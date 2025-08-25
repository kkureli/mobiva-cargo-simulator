import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDatasetStore } from '../state/store';
import { CATEGORIES, STATUSES } from '../models/constants';
import type { RawCargo, CleanCargo } from '../models/types';
import theme from '../ui/theme';

const catSet = new Set(CATEGORIES);
const statusSet = new Set(STATUSES);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DetailParams = { Detail: { id: string } };

export default function DetailScreen() {
  const route = useRoute<RouteProp<DetailParams, 'Detail'>>();
  const { id } = route.params;

  const raw = useDatasetStore(s => s.raw);
  const clean = useDatasetStore(s => s.clean);

  const base = clean ?? raw;
  const item = useMemo<RawCargo | CleanCargo | undefined>(
    () => base.find(x => x.id === id),
    [base, id],
  );

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
  const priceDirty =
    !inCleanMode && (!Number.isFinite(item.price) || item.price < 0);
  const statusDirty =
    !inCleanMode &&
    (typeof (item as RawCargo).status !== 'string' ||
      !statusSet.has((item as RawCargo).status as any));
  const kgDirty =
    !inCleanMode && !Number.isFinite((item as RawCargo).kg as number);

  return (
    <View style={styles.wrap}>
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
          status:{' '}
          {inCleanMode
            ? String((item as CleanCargo).status)
            : String((item as RawCargo).status)}
        </Text>
        <Text style={[styles.row, kgDirty && styles.dirty]}>
          kg:{' '}
          {inCleanMode
            ? String((item as CleanCargo).kg)
            : String((item as RawCargo).kg)}
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
  wrap: { flex: 1, padding: theme.space.lg, backgroundColor: theme.color.bg },
  h1: {
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.md,
    color: theme.color.text,
  },
  box: {
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    backgroundColor: theme.color.card,
  },
  row: { marginBottom: theme.space.xs, color: theme.color.text },
  dirty: { color: theme.color.danger, fontWeight: '700' },
  warn: { color: theme.color.danger, marginTop: theme.space.sm },
});
