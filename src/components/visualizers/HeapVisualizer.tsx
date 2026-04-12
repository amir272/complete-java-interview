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
import { CellStatus, HeapCell } from './types';

const STATUS_COLOR: Record<CellStatus, { bg: string; text: string; border: string }> = {
  default:    { bg: '#1F2B47',    text: '#A0AEC0', border: '#2D3748' },
  active:     { bg: '#6C63FF33', text: '#A89FFF', border: '#6C63FF' },
  comparing:  { bg: '#FF8C0033', text: '#FFB347', border: '#FF8C00' },
  selected:   { bg: '#43E97B33', text: '#43E97B', border: '#43E97B' },
  eliminated: { bg: '#1a1a1a',   text: '#444',    border: '#333'    },
  result:     { bg: '#FF658433', text: '#FF6584', border: '#FF6584' },
  highlight:  { bg: '#45B7D133', text: '#45B7D1', border: '#45B7D1' },
  rotten:     { bg: '#FF6B6B33', text: '#FF6B6B', border: '#FF6B6B' },
  fresh:      { bg: '#96CEB433', text: '#96CEB4', border: '#96CEB4' },
  visited:    { bg: '#FFEAA733', text: '#FFEAA7', border: '#FFEAA7' },
  empty:      { bg: '#0f0f1a',   text: '#333',    border: '#222'    },
};

interface HeapVisualizerProps {
  heapType: 'min' | 'max';
  cells: HeapCell[];
  caption?: string;
  prevCells?: HeapCell[];
}

// Build levels from heap array (max 15 nodes = 4 levels)
function buildLevels(cells: HeapCell[]): HeapCell[][] {
  const levels: HeapCell[][] = [];
  let idx = 0;
  let levelSize = 1;
  while (idx < cells.length && levels.length < 4) {
    levels.push(cells.slice(idx, idx + levelSize));
    idx += levelSize;
    levelSize *= 2;
  }
  return levels;
}

export function HeapVisualizer({ heapType, cells, caption, prevCells }: HeapVisualizerProps) {
  const levels = buildLevels(cells);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.typeLabel}>{heapType === 'min' ? '↑ Min-Heap' : '↓ Max-Heap'}</Text>
        <Text style={styles.sizeLabel}>size: {cells.length}</Text>
      </View>

      {/* Tree view */}
      {levels.map((level, li) => (
        <View key={li} style={styles.level}>
          {level.map((cell, ci) => {
            const globalIdx = (1 << li) - 1 + ci;
            const changed = prevCells
              ? prevCells[globalIdx]?.status !== cell.status || prevCells[globalIdx]?.value !== cell.value
              : false;
            return (
              <HeapNode
                key={ci}
                cell={cell}
                index={globalIdx}
                changed={changed}
                parentX={li > 0 ? Math.floor((ci) / 2) : -1}
              />
            );
          })}
        </View>
      ))}

      {/* Array representation */}
      <View style={styles.arrayRow}>
        {cells.map((cell, i) => {
          const c = STATUS_COLOR[cell.status];
          return (
            <View key={i} style={[styles.arrayCell, { borderColor: c.border, backgroundColor: c.bg }]}>
              <Text style={[styles.arrayCellText, { color: c.text }]}>{cell.value}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.arrayLabel}>heap array</Text>

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function HeapNode({ cell, index, changed }: { cell: HeapCell; index: number; changed: boolean; parentX: number }) {
  const c = STATUS_COLOR[cell.status];
  const scale = useSharedValue(1);

  useEffect(() => {
    if (changed) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 7, stiffness: 300 }),
        withSpring(1, { damping: 14 })
      );
    }
  }, [cell.status, cell.value]);

  const nodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.node, nodeStyle]}>
      <Text style={[styles.nodeValue, { color: c.text }]}>{cell.value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, alignItems: 'center' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  typeLabel: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  sizeLabel: { ...typography.caption, color: colors.textMuted },
  level: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 6 },
  node: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeValue: { ...typography.bodySmall, fontWeight: '700' },
  arrayRow: { flexDirection: 'row', gap: 3, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  arrayCell: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm - 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrayCellText: { fontSize: 12, fontWeight: '600' },
  arrayLabel: { ...typography.caption, color: colors.textMuted, marginTop: 3 },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
