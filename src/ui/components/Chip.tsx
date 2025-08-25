import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default React.memo(function Chip({
  label,
  selected,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.sel : styles.un, style]}
    >
      <Text style={selected ? styles.selText : styles.unText}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.lg,
    marginRight: theme.space.sm,
    marginBottom: theme.space.sm,
    borderWidth: 1,
  },
  sel: {
    backgroundColor: theme.color.chipSel,
    borderColor: theme.color.chipSel,
  },
  un: { backgroundColor: theme.color.chipBg, borderColor: theme.color.border },
  selText: { color: '#fff' },
  unText: { color: theme.color.text },
});
