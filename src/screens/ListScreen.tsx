import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import Chip from '../ui/components/Chip';
import { useListView } from '../hooks/useListView';
import { isRawDirty } from '../utils/dirty';
import { useNavigation } from '@react-navigation/native';
import { PRICE_MAX_LIMIT, PRICE_MIN_LIMIT } from '../models/limits';
import type { RawCargo, CleanCargo } from '../models/types';
import { useRenderTimer } from '../hooks/useRenderTimer';
import theme from '../ui/theme';
import StatusBadge from '../ui/components/StatusBadge';

type ListItemData = RawCargo | CleanCargo;

function ListHeader({ ui, actions }: any) {
  return (
    <View>
      {ui.formErrors.length > 0 && (
        <View style={styles.errorContainer}>
          {ui.formErrors.map((e: string, i: number) => (
            <Text key={i} style={{ color: '#b42318' }}>
              {'\u2022'} {e}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.label}>Categories</Text>
      <View style={styles.row}>
        {ui.categories.map((c: string) => (
          <Chip
            key={c}
            label={c}
            selected={ui.selectedCategories.includes(c)}
            onPress={() => actions.toggleCategory(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>Weight Buckets</Text>
      <View style={styles.row}>
        {ui.buckets.map((b: string) => (
          <Chip
            key={b}
            label={b}
            selected={ui.selectedBuckets.includes(b)}
            onPress={() => actions.toggleBucket(b)}
          />
        ))}
      </View>

      <Text style={styles.label}>Price</Text>
      <View style={styles.inline}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="min"
          value={ui.priceMin}
          onChangeText={ui.setPriceMin}
        />
        <Text style={{ marginHorizontal: 6 }}>/</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="max"
          value={ui.priceMax}
          onChangeText={ui.setPriceMax}
        />
      </View>
      <Text style={styles.hint}>
        Aralık: {PRICE_MIN_LIMIT} .. {PRICE_MAX_LIMIT}
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, { minWidth: 160 }]}
        placeholder="name (case-sensitive)"
        value={ui.nameQuery}
        onChangeText={ui.setNameQuery}
      />

      <View style={styles.inline}>
        <Button title="Apply" onPress={actions.applyFilters} />
        <View style={{ width: 12 }} />
        <Button title="Clear" onPress={actions.clearFilters} />
      </View>
    </View>
  );
}

const MemoListItem = React.memo(function ListItem({
  item,
  onPress,
  dirty,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        dirty ? styles.cardDirty : styles.cardClean,
        theme.shadow.ios,
        theme.shadow.android,
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        {item.status ? <StatusBadge value={String(item.status)} /> : null}
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.sub}>{item.category}</Text>
        <Text style={styles.sub}>kg: {item.kg ?? '-'}</Text>
      </View>
      <Text style={styles.price}>₺ {item.price}</Text>
    </Pressable>
  );
});

export default function ListScreen() {
  const { data, counts, ui, actions, isCleanMode } = useListView();
  const nav = useNavigation<any>();
  const { renderMs, onContentSized } = useRenderTimer(data.length);

  const keyExtractor = useCallback((it: ListItemData) => it.id, []);
  const renderItem = useCallback(
    ({ item }: { item: ListItemData }) => {
      const dirty = isCleanMode ? false : isRawDirty(item as RawCargo);
      return (
        <MemoListItem
          item={item}
          dirty={dirty}
          onPress={() => nav.navigate('Detail', { id: item.id })}
        />
      );
    },
    [isCleanMode, nav],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        Total: {counts.totalCount} • Result: {counts.resultCount} • Mode:{' '}
        {isCleanMode ? 'Clean' : 'Raw'}
      </Text>
      {renderMs != null ? (
        <Text style={styles.meta}>List render: {renderMs} ms</Text>
      ) : null}
      <FlatList
        onContentSizeChange={onContentSized}
        data={data}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<ListHeader ui={ui} actions={actions} />}
        ListEmptyComponent={<Text style={styles.muted}>No results</Text>}
        renderItem={renderItem}
        initialNumToRender={20}
        windowSize={10}
        maxToRenderPerBatch={20}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: theme.space.lg, backgroundColor: theme.color.bg },
  h1: {
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.sm,
    color: theme.color.text,
  },
  label: {
    marginTop: theme.space.md,
    marginBottom: theme.space.xs,
    fontWeight: '600',
    color: theme.color.text,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.space.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.sm,
    minWidth: 100,
    color: theme.color.text,
    backgroundColor: theme.color.card,
  },
  meta: { marginBottom: theme.space.sm, color: theme.color.sub },
  card: {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.space.md,
    marginTop: theme.space.sm,
  },
  cardDirty: {
    borderColor: theme.color.dirtyBorder,
    backgroundColor: theme.color.dirtyBg,
  },
  cardClean: {
    borderColor: theme.color.border,
    backgroundColor: theme.color.card,
  },
  title: {
    fontWeight: '700',
    marginBottom: theme.space.xs,
    color: theme.color.text,
    flex: 1,
  },
  sub: { color: theme.color.sub, fontSize: theme.font.sm },
  price: {
    color: theme.color.text,
    marginTop: theme.space.xs,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  errorContainer: {
    backgroundColor: theme.color.dirtyBg,
    borderColor: theme.color.dirtyBorder,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.space.sm,
    marginBottom: theme.space.sm,
  },
  hint: { color: theme.color.sub, marginTop: theme.space.xs },
  muted: { color: theme.color.sub },
});
