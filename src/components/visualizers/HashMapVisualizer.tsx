import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, typography } from '../../theme';
import { HashEntry } from './types';

interface HashMapVisualizerProps {
  entries: HashEntry[];
  caption?: string;
  prevEntries?: HashEntry[];
}

export function HashMapVisualizer({ entries, caption, prevEntries }: HashMapVisualizerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HashMap</Text>
      <View style={styles.mapBox}>
        {entries.length === 0 && (
          <Text style={styles.emptyText}>empty</Text>
        )}
        {entries.map((entry, i) => {
          const prevEntry = prevEntries?.find(e => e.key === entry.key);
          const isNew = !prevEntries?.some(e => e.key === entry.key);
          const changed = prevEntry ? prevEntry.value !== entry.value || prevEntry.status !== entry.status : isNew;
          return <EntryRow key={String(entry.key)} entry={entry} index={i} isNew={isNew} changed={changed} />;
        })}
      </View>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function EntryRow({ entry, index, isNew, changed }: { entry: HashEntry; index: number; isNew: boolean; changed: boolean }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const highlightOpacity = useSharedValue(0);

  useEffect(() => {
    if (isNew) {
      opacity.value = withDelay(index * 50, withTiming(1, { duration: 250 }));
      translateX.value = withDelay(index * 50, withSpring(0, { damping: 18 }));
    } else {
      opacity.value = 1;
      translateX.value = 0;
    }
    if (changed && !isNew) {
      highlightOpacity.value = withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(500, withTiming(0, { duration: 300 }))
      );
    }
  }, [entry.value, entry.status]);

  const getColor = () => {
    if (entry.status === 'active')    return { bg: '#6C63FF33', border: '#6C63FF', key: '#A89FFF', val: '#E6EDF3' };
    if (entry.status === 'selected')  return { bg: '#43E97B22', border: '#43E97B', key: '#43E97B', val: '#E6EDF3' };
    if (entry.status === 'comparing') return { bg: '#FF8C0022', border: '#FF8C00', key: '#FFB347', val: '#E6EDF3' };
    if (entry.status === 'result')    return { bg: '#FF658422', border: '#FF6584', key: '#FF6584', val: '#E6EDF3' };
    return { bg: colors.surface, border: colors.border, key: colors.primary, val: colors.textSecondary };
  };

  const c = getColor();

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: highlightOpacity.value * 0.25,
  }));

  return (
    <Animated.View style={[styles.row, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.flash, flashStyle]} />
      <Text style={[styles.keyText, { color: c.key }]}>{entry.key}</Text>
      <Text style={styles.arrow}>→</Text>
      <Text style={[styles.valText, { color: c.val }]}>{entry.value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { ...typography.caption, color: colors.textMuted, fontWeight: '700', marginBottom: 6 },
  mapBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
    gap: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 0.5,
    borderColor: 'transparent',
    gap: 12,
    overflow: 'hidden',
  },
  flash: { backgroundColor: '#ffffff' },
  keyText: { ...typography.code, fontSize: 13, fontWeight: '700', width: 80 },
  arrow: { ...typography.code, color: colors.textMuted, fontSize: 13 },
  valText: { ...typography.code, fontSize: 13, flex: 1 },
  emptyText: { ...typography.caption, color: colors.textMuted, padding: 12, textAlign: 'center', fontStyle: 'italic' },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
});
