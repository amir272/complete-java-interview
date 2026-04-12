import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, typography } from '../../theme';
import { ListNode } from './types';

interface LinkedListVisualizerProps {
  nodes: ListNode[];
  caption?: string;
  highlightKey?: string | number;
  prevNodes?: ListNode[];
}

export function LinkedListVisualizer({ nodes, caption, highlightKey, prevNodes }: LinkedListVisualizerProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {/* HEAD sentinel */}
        <SentinelNode label="HEAD" />
        <Arrow />

        {nodes.map((node, i) => {
          const changed = prevNodes
            ? prevNodes.findIndex(n => n.key === node.key) !== i
            : false;
          return (
            <React.Fragment key={String(node.key)}>
              <NodeView
                node={node}
                isHighlighted={node.key === highlightKey}
                isNew={!prevNodes?.some(n => n.key === node.key)}
              />
              {i < nodes.length - 1 && <Arrow />}
            </React.Fragment>
          );
        })}

        {nodes.length > 0 && <Arrow />}
        {/* TAIL sentinel */}
        <SentinelNode label="TAIL" />
      </ScrollView>

      {/* MRU / LRU labels */}
      {nodes.length > 0 && (
        <View style={styles.labelsRow}>
          <Text style={styles.mruLabel}>← MRU (most recent)</Text>
          <Text style={styles.lruLabel}>(least recent) LRU →</Text>
        </View>
      )}

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function NodeView({ node, isHighlighted, isNew }: { node: ListNode; isHighlighted: boolean; isNew: boolean }) {
  const scale = useSharedValue(isNew ? 0 : 1);
  const opacity = useSharedValue(isNew ? 0 : 1);

  useEffect(() => {
    if (isNew) {
      scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      opacity.value = withTiming(1, { duration: 250 });
    } else if (isHighlighted) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(1, { damping: 14 })
      );
    }
  }, [isNew, isHighlighted]);

  const bg = isHighlighted ? '#6C63FF33' : node.status === 'active' ? '#43E97B22' : colors.surface;
  const border = isHighlighted ? '#6C63FF' : node.status === 'active' ? '#43E97B' : colors.border;

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: bg,
    borderColor: border,
  }));

  return (
    <Animated.View style={[styles.node, style]}>
      <Text style={styles.nodeKey}>{node.key}</Text>
      <View style={styles.divider} />
      <Text style={styles.nodeValue}>{node.value}</Text>
    </Animated.View>
  );
}

function SentinelNode({ label }: { label: string }) {
  return (
    <View style={styles.sentinel}>
      <Text style={styles.sentinelText}>{label}</Text>
    </View>
  );
}

function Arrow() {
  return (
    <View style={styles.arrowContainer}>
      <View style={styles.arrowLine} />
      <Text style={styles.arrowHead}>▶</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, gap: 0 },
  node: {
    borderWidth: 1.5,
    borderRadius: borderRadius.sm,
    padding: 6,
    alignItems: 'center',
    minWidth: 50,
  },
  nodeKey: { ...typography.caption, color: colors.primary, fontWeight: '700', fontSize: 11 },
  divider: { height: 1, width: '80%', backgroundColor: colors.border, marginVertical: 3 },
  nodeValue: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  sentinel: {
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: borderRadius.sm - 2,
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: '#ffffff08',
  },
  sentinelText: { ...typography.caption, color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  arrowContainer: { flexDirection: 'row', alignItems: 'center' },
  arrowLine: { width: 12, height: 1, backgroundColor: colors.textMuted },
  arrowHead: { fontSize: 10, color: colors.textMuted, marginLeft: -2 },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  mruLabel: { ...typography.caption, color: colors.success, fontSize: 10 },
  lruLabel: { ...typography.caption, color: colors.error, fontSize: 10 },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
});
