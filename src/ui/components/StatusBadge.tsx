import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

type Props = { value: string };

const map: Record<string, { bg: string; fg: string }> = {
  PREPARING: { bg: '#2d2a12', fg: '#d9a31a' },
  AT_BRANCH: { bg: '#102a43', fg: '#3a8ddd' },
  OUT_FOR_DELIVERY: { bg: '#122d13', fg: '#2da44e' },
  DELIVERED: { bg: '#0d2b1e', fg: '#34d399' },
  DELIVERY_FAILED: { bg: '#351417', fg: '#e35d6a' },
};

export default function StatusBadge({ value }: Props) {
  const c = map[value] || { bg: theme.color.card, fg: theme.color.text };
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: c.bg, borderColor: theme.color.border },
      ]}
    >
      <Text style={[styles.txt, { color: c.fg }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  txt: { fontSize: 12, fontWeight: '600' },
});
