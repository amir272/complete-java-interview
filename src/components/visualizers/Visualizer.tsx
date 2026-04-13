import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, borderRadius } from '../../theme';
import { VisualizerData } from './types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { TwoHeapsVisualizer } from './TwoHeapsVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { IntervalVisualizer } from './IntervalVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { HashMapVisualizer } from './HashMapVisualizer';
import { PointerListVisualizer } from './PointerListVisualizer';

interface VisualizerProps {
  data: VisualizerData;
  prevData?: VisualizerData;
}

export function Visualizer({ data, prevData }: VisualizerProps) {
  return (
    <View style={styles.wrapper}>
      {data.type === 'array' && (
        <ArrayVisualizer
          cells={data.cells}
          caption={data.caption}
          prevCells={prevData?.type === 'array' ? prevData.cells : undefined}
        />
      )}

      {data.type === 'heap' && (
        <HeapVisualizer
          heapType={data.heapType}
          cells={data.cells}
          caption={data.caption}
          prevCells={prevData?.type === 'heap' ? prevData.cells : undefined}
        />
      )}

      {data.type === 'two-heaps' && (
        <TwoHeapsVisualizer
          lo={data.lo}
          hi={data.hi}
          median={data.median}
          caption={data.caption}
          prevLo={prevData?.type === 'two-heaps' ? prevData.lo : undefined}
          prevHi={prevData?.type === 'two-heaps' ? prevData.hi : undefined}
        />
      )}

      {data.type === 'stack' && (
        <StackVisualizer
          cells={data.cells}
          action={data.action}
          actionValue={data.actionValue}
          caption={data.caption}
          prevCells={prevData?.type === 'stack' ? prevData.cells : undefined}
        />
      )}

      {data.type === 'interval' && (
        <IntervalVisualizer
          intervals={data.intervals}
          domain={data.domain}
          caption={data.caption}
        />
      )}

      {data.type === 'grid' && (
        <GridVisualizer
          grid={data.grid}
          caption={data.caption}
          queue={data.queue}
          prevGrid={prevData?.type === 'grid' ? prevData.grid : undefined}
        />
      )}

      {data.type === 'linked-list' && (
        <LinkedListVisualizer
          nodes={data.nodes}
          caption={data.caption}
          highlightKey={data.highlightKey}
          prevNodes={prevData?.type === 'linked-list' ? prevData.nodes : undefined}
        />
      )}

      {data.type === 'hashmap' && (
        <HashMapVisualizer
          entries={data.entries}
          caption={data.caption}
          prevEntries={prevData?.type === 'hashmap' ? prevData.entries : undefined}
        />
      )}

      {data.type === 'pointer-list' && (
        <PointerListVisualizer
          rows={data.rows}
          caption={data.caption}
          prevRows={prevData?.type === 'pointer-list' ? prevData.rows : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
