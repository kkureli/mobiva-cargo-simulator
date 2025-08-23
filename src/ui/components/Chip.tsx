import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

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
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  sel: { backgroundColor: '#1f6feb', borderColor: '#1f6feb' },
  un: { backgroundColor: '#fff', borderColor: '#d0d7de' },
  selText: { color: '#fff' },
  unText: { color: '#24292f' },
});
