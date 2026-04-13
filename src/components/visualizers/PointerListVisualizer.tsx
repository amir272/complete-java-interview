import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, spacing, typography } from '../../theme';
import { CellStatus, ListPointer, PointerListNode, PointerListVisualizerData } from './types';

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W  = 58;  // node box width
const ARROW_W = 16;  // arrow connector width
const NODE_STEP = NODE_W + ARROW_W; // 74px per slot

// ─── Cell colours ─────────────────────────────────────────────────────────────
const STATUS: Record<CellStatus, { bg: string; border: string; text: string }> = {
  default:    { bg: colors.surface,   border: colors.border,  text: colors.textSecondary },
  active:     { bg: '#6C63FF22',      border: '#6C63FF',      text: '#A89FFF' },
  comparing:  { bg: '#FF8C0022',      border: '#FF8C00',      text: '#FFB347' },
  selected:   { bg: '#43E97B22',      border: '#43E97B',      text: '#43E97B' },
  eliminated: { bg: '#1a1a1a',        border: '#333',         text: '#555' },
  result:     { bg: '#FF658422',      border: '#FF6584',      text: '#FF6584' },
  highlight:  { bg: '#45B7D122',      border: '#45B7D1',      text: '#45B7D1' },
  rotten:     { bg: '#FF6B6B22',      border: '#FF6B6B',      text: '#FF6B6B' },
  fresh:      { bg: '#FFEAA722',      border: '#FFEAA7',      text: '#FFEAA7' },
  visited:    { bg: '#43E97B22',      border: '#43E97B',      text: '#43E97B' },
  empty:      { bg: '#ffffff08',      border: '#2D3748',      text: '#444'    },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PointerListVisualizerProps extends Omit<PointerListVisualizerData, 'type'> {
  prevRows?: PointerListVisualizerData['rows'];
}

export function PointerListVisualizer({ rows, caption, prevRows }: PointerListVisualizerProps) {
  return (
    <View style={styles.container}>
      {rows.map((row, ri) => {
        const prevRow = prevRows?.[ri];
        return (
          <View key={ri} style={styles.rowWrapper}>
            {row.label && (
              <Text style={styles.rowLabel}>{row.label}</Text>
            )}
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Relative container so pointer arrows can be positioned absolutely */}
              <View style={{ width: row.nodes.length * NODE_STEP - ARROW_W + 4 }}>
                {/* ── Node + arrow row ── */}
                <View style={styles.nodesRow}>
                  {row.nodes.map((node, ni) => {
                    const prev = prevRow?.nodes.find(n => n.id === node.id);
                    const changed = prev ? prev.status !== node.status || prev.value !== node.value : false;
                    return (
                      <React.Fragment key={node.id}>
                        <NodeBox node={node} changed={changed} />
                        {ni < row.nodes.length - 1 && (
                          <NodeArrow />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>

                {/* ── Animated pointer track ── */}
                {row.pointers && row.pointers.length > 0 && (
                  <View style={styles.pointerTrack}>
                    {row.pointers.map(ptr => {
                      const nodeIdx = row.nodes.findIndex(n => n.id === ptr.nodeId);
                      const prevPtr = prevRow?.pointers?.find(p => p.label === ptr.label);
                      const prevIdx = prevPtr
                        ? row.nodes.findIndex(n => n.id === prevPtr.nodeId)
                        : nodeIdx;
                      return (
                        <SlidingPointer
                          key={ptr.label}
                          pointer={ptr}
                          fromIndex={prevIdx < 0 ? nodeIdx : prevIdx}
                          toIndex={nodeIdx < 0 ? 0 : nodeIdx}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        );
      })}
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

// ─── Node box ─────────────────────────────────────────────────────────────────

function NodeBox({ node, changed }: { node: PointerListNode; changed: boolean }) {
  const c = STATUS[node.status];
  const scale = useSharedValue(1);

  useEffect(() => {
    if (changed) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 7, stiffness: 280 }),
        withSpring(1,   { damping: 14 })
      );
    }
  }, [node.status, node.value]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.node, style]}>
      <Text style={[styles.nodeValue, { color: c.text }]} numberOfLines={1}>
        {node.value}
      </Text>
    </Animated.View>
  );
}

// ─── Static connector arrow ───────────────────────────────────────────────────

function NodeArrow() {
  return (
    <View style={styles.connectorRow}>
      <View style={styles.connectorLine} />
      <Text style={styles.connectorHead}>▶</Text>
    </View>
  );
}

// ─── Sliding pointer arrow ────────────────────────────────────────────────────

function SlidingPointer({
  pointer,
  fromIndex,
  toIndex,
}: {
  pointer: ListPointer;
  fromIndex: number;
  toIndex: number;
}) {
  // Centre of node i  = i * NODE_STEP + NODE_W/2
  // Pointer width is ~40px, so offset by 20 to centre it
  const centreOf = (i: number) => i * NODE_STEP + NODE_W / 2 - 20;

  const translateX = useSharedValue(centreOf(fromIndex));

  useEffect(() => {
    translateX.value = withSpring(centreOf(toIndex), {
      damping: 16,
      stiffness: 200,
      mass: 0.8,
    });
  }, [toIndex]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.pointer, animStyle]}>
      {/* Upward caret */}
      <Text style={[styles.pointerCaret, { color: pointer.color }]}>▲</Text>
      {/* Label */}
      <Text style={[styles.pointerLabel, { color: pointer.color }]}>
        {pointer.emoji ?? ''}{pointer.label}
      </Text>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { marginVertical: 8 },

  rowWrapper: { marginBottom: 6 },
  rowLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  scrollContent: { paddingBottom: 4 },

  nodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NODE_W,
  },

  node: {
    width: NODE_W,
    height: NODE_W,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    fontSize: 14,
  },

  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ARROW_W,
  },
  connectorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.textMuted,
  },
  connectorHead: {
    fontSize: 9,
    color: colors.textMuted,
    marginLeft: -2,
  },

  // Pointer track — sits below the nodes row, same width
  pointerTrack: {
    height: 38,           // space for caret + label
    position: 'relative',
    marginTop: 2,
  },
  pointer: {
    position: 'absolute',
    alignItems: 'center',
    width: 40,
  },
  pointerCaret: {
    fontSize: 14,
    lineHeight: 16,
  },
  pointerLabel: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
    letterSpacing: 0.3,
  },

  caption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
});
