import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Chip from '../ui/components/Chip';
import { useListView } from '../hooks/useListView';
import { isRawDirty } from '../core/dirty';
import { useNavigation } from '@react-navigation/native';

export default function ListScreen() {
  const { data, counts, ui, actions, isCleanMode } = useListView();
  const nav = useNavigation<any>();

  return (
    <ScrollView style={styles.wrap}>
      <Text style={styles.h1}>List</Text>

      <Text style={styles.label}>Categories</Text>
      <View style={styles.row}>
        {ui.categories.map(c => (
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
        {ui.buckets.map(b => (
          <Chip
            key={b}
            label={b}
            selected={ui.selectedBuckets.includes(b)}
            onPress={() => actions.toggleBucket(b)}
          />
        ))}
      </View>

      <Text style={styles.label}>Price / Name</Text>
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
        <Text style={{ marginHorizontal: 6 }} />
        <TextInput
          style={[styles.input, { minWidth: 160 }]}
          placeholder="name (case-sensitive)"
          value={ui.nameQuery}
          onChangeText={ui.setNameQuery}
        />
      </View>
      <View style={styles.inline}>
        <Button title="Apply" onPress={actions.applyPrice} />
        <View style={{ width: 12 }} />
        <Button title="Clear" onPress={actions.clearFilters} />
      </View>

      <Text style={styles.meta}>
        Total: {counts.totalCount} • Result: {counts.resultCount} • Mode:{' '}
        {isCleanMode ? 'Clean' : 'Raw'}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const dirty = isCleanMode ? false : isRawDirty(item as any);
          return (
            <Pressable
              onPress={() => nav.navigate('Detail', { id: item.id })}
              style={[styles.card, dirty ? styles.cardDirty : styles.cardClean]}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.category}</Text>
              <Text>kg: {item.kg ?? '-'}</Text>
              <Text>price: {item.price}</Text>
              <Text>status: {String(item.status)}</Text>
            </Pressable>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
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
  meta: { marginTop: 8, marginBottom: 8, color: '#57606a' },
  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8 },
  cardDirty: { borderColor: '#d14343', backgroundColor: '#fde8e8' },
  cardClean: { borderColor: '#d0d7de', backgroundColor: '#fff' },
  title: { fontWeight: '700', marginBottom: 4 },
});
