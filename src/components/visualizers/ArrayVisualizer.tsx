import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, typography } from '../../theme';
import { ArrayCell, CellStatus } from './types';

const STATUS_COLOR: Record<CellStatus, { bg: string; text: string; border: string }> = {
  default:    { bg: colors.surface,      text: colors.textSecondary, border: colors.border },
  active:     { bg: '#6C63FF33',         text: '#A89FFF',            border: '#6C63FF' },
  comparing:  { bg: '#FF8C0033',         text: '#FFB347',            border: '#FF8C00' },
  selected:   { bg: '#43E97B33',         text: '#43E97B',            border: '#43E97B' },
  eliminated: { bg: '#33333388',         text: '#555',               border: '#444' },
  result:     { bg: '#FF658433',         text: '#FF6584',            border: '#FF6584' },
  highlight:  { bg: '#45B7D133',         text: '#45B7D1',            border: '#45B7D1' },
  rotten:     { bg: '#FF6B6B33',         text: '#FF6B6B',            border: '#FF6B6B' },
  fresh:      { bg: '#96CEB433',         text: '#96CEB4',            border: '#96CEB4' },
  visited:    { bg: '#FFEAA733',         text: '#FFEAA7',            border: '#FFEAA7' },
  empty:      { bg: '#ffffff08',         text: '#444',               border: '#333' },
};

interface ArrayVisualizerProps {
  cells: ArrayCell[];
  caption?: string;
  prevCells?: ArrayCell[];
}

export function ArrayVisualizer({ cells, caption, prevCells }: ArrayVisualizerProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {cells.map((cell, i) => (
          <ArrayCellView
            key={i}
            cell={cell}
            index={i}
            changed={prevCells ? prevCells[i]?.status !== cell.status || prevCells[i]?.value !== cell.value : false}
          />
        ))}
      </ScrollView>
      {caption && <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6, textAlign: 'center' }}>{caption}</Text>}
    </View>
  );
}

function ArrayCellView({ cell, index, changed }: { cell: ArrayCell; index: number; changed: boolean }) {
  const c = STATUS_COLOR[cell.status];
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (changed) {
      scale.value = withSequence(
        withSpring(1.18, { damping: 8, stiffness: 280 }),
        withSpring(1, { damping: 14 })
      );
      bgOpacity.value = withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(400, withTiming(0, { duration: 300 }))
      );
    }
  }, [cell.status, cell.value]);

  const cellStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value * 0.35,
  }));

  return (
    <View style={styles.cellWrapper}>
      {/* Index label */}
      <Text style={styles.indexLabel}>{index}</Text>

      <Animated.View style={[styles.cell, cellStyle]}>
        {/* Flash overlay */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.flash, flashStyle]} />
        <Text style={[styles.cellValue, { color: c.text }]} numberOfLines={1}>{cell.value}</Text>
      </Animated.View>

      {/* Pointer label */}
      {cell.label ? (
        <View style={[styles.pointerArrow, { borderTopColor: c.border }]}>
          <Text style={[styles.pointerLabel, { color: c.border }]}>{cell.label}</Text>
        </View>
      ) : (
        <View style={styles.pointerPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 4, gap: 4 },
  cellWrapper: { alignItems: 'center' },
  indexLabel: { ...typography.caption, color: colors.textMuted, fontSize: 10, marginBottom: 2 },
  cell: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flash: { backgroundColor: '#ffffff', borderRadius: borderRadius.sm },
  cellValue: { ...typography.bodySmall, fontWeight: '700', fontSize: 13 },
  pointerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: 3,
  },
  pointerLabel: { ...typography.caption, fontWeight: '700', fontSize: 11, marginTop: 14, position: 'absolute', left: -12, width: 24, textAlign: 'center' },
  pointerPlaceholder: { height: 22 },
});
