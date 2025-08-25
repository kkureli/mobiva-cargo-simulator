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
import { CATEGORIES, WEIGHT_BUCKETS, STATUSES } from '../models/constants';
import { useCreateForm } from '../hooks/useCreateForm';
import theme from '../ui/theme';

export default function CreateScreen() {
  const { state, actions, limits } = useCreateForm();

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {state.error ? (
        <View style={styles.errorBox}>
          <Text style={styles.err}>{state.error}</Text>
          <View style={{ height: 8 }} />
          <Button title="Dismiss" onPress={actions.clearStoreError} />
        </View>
      ) : null}

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
          placeholder={`${limits.PRICE_MIN_LIMIT}`}
        />
        <Text style={{ marginHorizontal: 8 }}>/</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={state.priceMax}
          onChangeText={actions.setPriceMax}
          placeholder={`${limits.PRICE_MAX_LIMIT}`}
        />
      </View>
      <Text style={styles.hint}>
        Aralık: {limits.PRICE_MIN_LIMIT} .. {limits.PRICE_MAX_LIMIT}
      </Text>

      <Text style={styles.label}>Count</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={state.count}
        onChangeText={actions.setCount}
        placeholder={`${limits.COUNT_MIN_LIMIT}-${limits.COUNT_MAX_LIMIT}`}
      />
      <Text style={styles.hint}>
        Geçerli: {limits.COUNT_MIN_LIMIT} .. {limits.COUNT_MAX_LIMIT} (tam sayı)
      </Text>

      {state.formErrors.length > 0 && (
        <View style={styles.errorBox}>
          {state.formErrors.map((e, i) => (
            <Text key={i} style={styles.err}>
              {'\u2022'} {e}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.inline}>
        <View style={styles.buttons}>
          <Button
            title="🚀 Create"
            onPress={actions.onCreate}
            disabled={state.busy}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="🧹 Clean"
            onPress={actions.onClean}
            disabled={state.busy}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="🔄 Reset"
            onPress={actions.onReset}
            disabled={state.busy}
          />
        </View>
      </View>

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
  wrap: { padding: theme.space.lg, backgroundColor: theme.color.bg },
  h1: {
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.md,
    color: theme.color.text,
  },
  h2: {
    fontSize: theme.font.h2,
    fontWeight: '600',
    marginTop: theme.space.lg,
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
  inline: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.sm,
    minWidth: 120,
    color: theme.color.text,
    backgroundColor: theme.color.card,
  },
  buttons: { marginTop: theme.space.md },
  box: {
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    backgroundColor: theme.color.card,
  },
  hint: { color: theme.color.sub, marginTop: theme.space.xs },
  errorBox: {
    backgroundColor: theme.color.dirtyBg,
    borderColor: theme.color.dirtyBorder,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.space.sm,
    marginTop: theme.space.md,
  },
  err: { color: theme.color.danger },
  muted: { color: theme.color.sub },
});
