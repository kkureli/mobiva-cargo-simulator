import React from 'react';
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
import { useCreateForm } from '../hooks/useCreateForm';

export default function CreateScreen() {
  const { state, actions } = useCreateForm();

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Create Data</Text>

      <Text style={styles.label}>Categories (multi)</Text>
      <View style={styles.row}>
        {CATEGORIES.map(c => (
          <Chip
            key={c}
            label={c}
            selected={state.selectedCategories.includes(c)}
            onPress={() => actions.toggleCategory(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>Weight Buckets (multi)</Text>
      <View style={styles.row}>
        {WEIGHT_BUCKETS.map(b => (
          <Chip
            key={b}
            label={b}
            selected={state.selectedBuckets.includes(b)}
            onPress={() => actions.toggleBucket(b)}
          />
        ))}
      </View>

      <Text style={styles.label}>Statuses (multi, optional)</Text>
      <View style={styles.row}>
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={s}
            selected={state.selectedStatuses.includes(s)}
            onPress={() => actions.toggleStatus(s)}
          />
        ))}
      </View>

      <Text style={styles.label}>Price Min / Max</Text>
      <View style={styles.inline}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={state.priceMin}
          onChangeText={actions.setPriceMin}
        />
        <Text style={{ marginHorizontal: 8 }}>/</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={state.priceMax}
          onChangeText={actions.setPriceMax}
        />
      </View>

      <Text style={styles.label}>Count</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={state.count}
        onChangeText={actions.setCount}
      />

      <View style={styles.buttons}>
        <Button
          title="🚀 Create"
          disabled={!state.canCreate || state.busy}
          onPress={actions.onCreate}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="🧹 Clean"
          disabled={state.busy}
          onPress={actions.onClean}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="🔄 Reset"
          disabled={state.busy}
          onPress={actions.onReset}
        />
      </View>

      {state.error ? (
        <Text style={styles.err}>Error: {state.error}</Text>
      ) : null}

      <Text style={styles.h2}>Generation Stats</Text>
      {state.genStats ? (
        <View style={styles.box}>
          <Text>generatedCount: {state.genStats.generatedCount}</Text>
          <Text>nullStatusCount: {state.genStats.nullStatusCount}</Text>
          <Text>nullKgCount: {state.genStats.nullKgCount}</Text>
          <Text>negativePriceCount: {state.genStats.negativePriceCount}</Text>
          <Text>
            start:{' '}
            {new Date(state.genStats.generationStartAt).toLocaleTimeString()}
          </Text>
          <Text>
            end: {new Date(state.genStats.generationEndAt).toLocaleTimeString()}
          </Text>
          <Text>durationMs: {state.genStats.generationDurationMs}</Text>
        </View>
      ) : (
        <Text style={styles.muted}>No data yet</Text>
      )}

      <Text style={styles.h2}>Clean Stats</Text>
      {state.cleanStats ? (
        <View style={styles.box}>
          <Text>removedCount: {state.cleanStats.removedCount}</Text>
          <Text>remainingCount: {state.cleanStats.remainingCount}</Text>
          <Text>cleanDurationMs: {state.cleanStats.cleanDurationMs}</Text>
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
