import React, { useCallback, useMemo } from 'react';
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
import { isRawDirty } from '../core/dirty';
import { useNavigation } from '@react-navigation/native';
import { PRICE_MAX_LIMIT, PRICE_MIN_LIMIT } from '../domain/limits';

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
      style={[styles.card, dirty ? styles.cardDirty : styles.cardClean]}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.category}</Text>
      <Text>kg: {item.kg ?? '-'}</Text>
      <Text>price: {item.price}</Text>
      <Text>status: {String(item.status)}</Text>
    </Pressable>
  );
});

export default function ListScreen() {
  const { data, counts, ui, actions, isCleanMode } = useListView();
  const nav = useNavigation<any>();

  const keyExtractor = useCallback((it: any) => it.id, []);
  const renderItem = useCallback(
    ({ item }: any) => {
      const dirty = isCleanMode ? false : isRawDirty(item as any);
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

  const ListHeaderMemo = useMemo(
    () => <ListHeader ui={ui} actions={actions} />,
    [ui, actions],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>List</Text>
      <Text style={styles.meta}>
        Total: {counts.totalCount} • Result: {counts.resultCount} • Mode:{' '}
        {isCleanMode ? 'Clean' : 'Raw'}
      </Text>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderMemo}
        ListEmptyComponent={<Text style={styles.muted}>No results</Text>}
        renderItem={renderItem}
        initialNumToRender={20}
        windowSize={10}
        maxToRenderPerBatch={20}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: 88,
          offset: 88 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  inline: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
  },
  meta: { marginBottom: 8, color: '#57606a' },
  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8 },
  cardDirty: { borderColor: '#d14343', backgroundColor: '#fde8e8' },
  cardClean: { borderColor: '#d0d7de', backgroundColor: '#fff' },
  title: { fontWeight: '700', marginBottom: 4 },
  errorContainer: {
    backgroundColor: '#fde8e8',
    borderColor: '#d14343',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  hint: { color: '#57606a', marginTop: 4 },
  muted: { color: '#57606a' },
});
