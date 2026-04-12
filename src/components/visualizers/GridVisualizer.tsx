import React, { useEffect, useRef } from 'react';
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
import { GridCell } from './types';

const CELL_EMOJI: Record<GridCell, string> = {
  rotten:    '🟠',
  fresh:     '🟡',
  visited:   '✅',
  active:    '🔵',
  empty:     '⬜',
  wall:      '⬛',
  default:   '⬜',
  comparing: '🔶',
  selected:  '🟢',
  eliminated:'⬛',
  result:    '🔴',
  highlight: '🟣',
};

const CELL_STYLE: Record<GridCell, { bg: string; border: string; text: string }> = {
  rotten:    { bg: '#FF6B6B33', border: '#FF6B6B', text: '#FF6B6B' },
  fresh:     { bg: '#FFEAA733', border: '#FFEAA7', text: '#FFEAA7' },
  visited:   { bg: '#43E97B22', border: '#43E97B', text: '#43E97B' },
  active:    { bg: '#6C63FF33', border: '#6C63FF', text: '#A89FFF' },
  empty:     { bg: '#ffffff08', border: '#2D3748', text: '#444' },
  wall:      { bg: '#1a1a1a',   border: '#333',    text: '#333' },
  default:   { bg: colors.surface, border: colors.border, text: colors.textSecondary },
  comparing: { bg: '#FF8C0033', border: '#FF8C00', text: '#FFB347' },
  selected:  { bg: '#43E97B33', border: '#43E97B', text: '#43E97B' },
  eliminated:{ bg: '#1a1a1a',   border: '#333',    text: '#444' },
  result:    { bg: '#FF658433', border: '#FF6584', text: '#FF6584' },
  highlight: { bg: '#DDA0DD33', border: '#DDA0DD', text: '#DDA0DD' },
};

interface GridVisualizerProps {
  grid: GridCell[][];
  caption?: string;
  queue?: string[];
  prevGrid?: GridCell[][];
}

export function GridVisualizer({ grid, caption, queue, prevGrid }: GridVisualizerProps) {
  return (
    <View style={styles.container}>
      {grid.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => {
            const changed = prevGrid ? prevGrid[ri]?.[ci] !== cell : false;
            return (
              <GridCellView key={ci} cell={cell} row={ri} col={ci} changed={changed} />
            );
          })}
        </View>
      ))}

      {/* Queue display */}
      {queue && queue.length > 0 && (
        <View style={styles.queueBox}>
          <Text style={styles.queueLabel}>Queue: </Text>
          <Text style={styles.queueContent}>[{queue.join(', ')}]</Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {(['rotten', 'fresh', 'visited', 'empty'] as GridCell[]).map(s => (
          <View key={s} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CELL_STYLE[s].bg, borderColor: CELL_STYLE[s].border }]} />
            <Text style={styles.legendText}>{s}</Text>
          </View>
        ))}
      </View>

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function GridCellView({ cell, row, col, changed }: { cell: GridCell; row: number; col: number; changed: boolean }) {
  const c = CELL_STYLE[cell];
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(1);

  useEffect(() => {
    if (changed) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 7, stiffness: 300 }),
        withSpring(1, { damping: 14 })
      );
      borderWidth.value = withSequence(
        withTiming(2.5, { duration: 100 }),
        withDelay(400, withTiming(1, { duration: 300 }))
      );
    }
  }, [cell]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
    borderWidth: borderWidth.value,
  }));

  return (
    <Animated.View style={[styles.cell, style]}>
      <Text style={styles.cellEmoji}>{CELL_EMOJI[cell]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  row: { flexDirection: 'row', gap: 3, marginBottom: 3 },
  cell: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm - 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellEmoji: { fontSize: 18 },
  queueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  queueLabel: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  queueContent: { ...typography.code, color: colors.primary, fontSize: 12 },
  legend: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 },
  legendText: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
