import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, typography } from '../../theme';
import { HeapCell } from './types';

interface TwoHeapsVisualizerProps {
  lo: HeapCell[];    // max-heap: lower half, index 0 = root (largest)
  hi: HeapCell[];    // min-heap: upper half, index 0 = root (smallest)
  median?: string;
  caption?: string;
  prevLo?: HeapCell[];
  prevHi?: HeapCell[];
}

export function TwoHeapsVisualizer({ lo, hi, median, caption, prevLo, prevHi }: TwoHeapsVisualizerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heapsRow}>
        {/* Max-heap (lower half) */}
        <View style={styles.heapSection}>
          <Text style={styles.heapLabel}>↓ max-heap (lo)</Text>
          <Text style={styles.heapSub}>lower half</Text>
          <HeapColumn cells={lo} color="#FF6584" prevCells={prevLo} />
        </View>

        {/* Median */}
        <View style={styles.medianSection}>
          {median !== undefined && (
            <>
              <Text style={styles.medianLabel}>median</Text>
              <View style={styles.medianBadge}>
                <Text style={styles.medianValue}>{median}</Text>
              </View>
            </>
          )}
        </View>

        {/* Min-heap (upper half) */}
        <View style={styles.heapSection}>
          <Text style={styles.heapLabel}>↑ min-heap (hi)</Text>
          <Text style={styles.heapSub}>upper half</Text>
          <HeapColumn cells={hi} color="#45B7D1" prevCells={prevHi} />
        </View>
      </View>

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function HeapColumn({ cells, color, prevCells }: { cells: HeapCell[]; color: string; prevCells?: HeapCell[] }) {
  return (
    <View style={styles.column}>
      {cells.map((cell, i) => {
        const changed = prevCells ? prevCells[i]?.value !== cell.value || prevCells[i]?.status !== cell.status : false;
        return <HeapPill key={i} cell={cell} color={color} index={i} isRoot={i === 0} changed={changed} />;
      })}
      {cells.length === 0 && <Text style={styles.emptyText}>empty</Text>}
    </View>
  );
}

function HeapPill({ cell, color, index, isRoot, changed }: { cell: HeapCell; color: string; index: number; isRoot: boolean; changed: boolean }) {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(isRoot ? 1 : 0.4);

  useEffect(() => {
    if (changed) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 7 }),
        withSpring(1, { damping: 14 })
      );
    }
  }, [cell.value, cell.status]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: color + (isRoot ? 'ff' : '66'),
    backgroundColor: color + (isRoot ? '33' : '14'),
  }));

  return (
    <Animated.View style={[styles.pill, style]}>
      {isRoot && <Text style={[styles.rootLabel, { color }]}>root</Text>}
      <Text style={[styles.pillValue, { color: isRoot ? color : colors.textSecondary }]}>{cell.value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  heapsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  heapSection: { flex: 1, alignItems: 'center' },
  heapLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700', textAlign: 'center' },
  heapSub: { ...typography.caption, color: colors.textMuted, fontSize: 10, marginBottom: 6 },
  column: { alignItems: 'center', gap: 5 },
  pill: {
    width: 56,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  pillValue: { ...typography.body, fontWeight: '700' },
  rootLabel: { ...typography.caption, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  medianSection: { width: 70, alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
  medianLabel: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  medianBadge: {
    backgroundColor: '#43E97B22',
    borderColor: '#43E97B',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  medianValue: { ...typography.h4, color: '#43E97B', fontWeight: '700' },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
