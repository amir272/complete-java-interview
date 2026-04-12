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
import { StackCell } from './types';

interface StackVisualizerProps {
  cells: StackCell[];          // index 0 = bottom
  action?: 'push' | 'pop' | 'idle';
  actionValue?: string | number;
  caption?: string;
  prevCells?: StackCell[];
}

export function StackVisualizer({ cells, action, actionValue, caption, prevCells }: StackVisualizerProps) {
  const isNewTop = (i: number) =>
    prevCells !== undefined && i === cells.length - 1 && cells.length > (prevCells?.length ?? 0);

  return (
    <View style={styles.container}>
      {/* Action badge */}
      {action && action !== 'idle' && (
        <ActionBadge action={action} value={actionValue} />
      )}

      {/* Stack frame */}
      <View style={styles.stackFrame}>
        {/* Render from top to bottom visually (reverse order) */}
        {[...cells].reverse().map((cell, revIdx) => {
          const realIdx = cells.length - 1 - revIdx;
          const isTop = realIdx === cells.length - 1;
          const isNew = isNewTop(realIdx);
          return (
            <StackBlock
              key={realIdx}
              cell={cell}
              isTop={isTop}
              isNew={isNew}
              revIdx={revIdx}
            />
          );
        })}

        {cells.length === 0 && (
          <View style={styles.emptySlot}>
            <Text style={styles.emptyText}>empty</Text>
          </View>
        )}

        {/* Bottom label */}
        <View style={styles.bottomLabel}>
          <Text style={styles.bottomLabelText}>bottom</Text>
        </View>
      </View>

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function StackBlock({ cell, isTop, isNew }: { cell: StackCell; isTop: boolean; isNew: boolean; revIdx: number }) {
  const translateY = useSharedValue(isNew ? -40 : 0);
  const opacity = useSharedValue(isNew ? 0 : 1);

  useEffect(() => {
    if (isNew) {
      translateY.value = withSpring(0, { damping: 14, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isNew]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getColors = () => {
    if (cell.status === 'active') return { bg: '#6C63FF33', border: '#6C63FF', text: '#A89FFF' };
    if (cell.status === 'comparing') return { bg: '#FF8C0033', border: '#FF8C00', text: '#FFB347' };
    if (cell.status === 'selected') return { bg: '#43E97B33', border: '#43E97B', text: '#43E97B' };
    return { bg: colors.surface, border: isTop ? colors.primary + '88' : colors.border, text: colors.text };
  };

  const c = getColors();

  return (
    <Animated.View style={[styles.block, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      <Text style={[styles.blockValue, { color: c.text }]}>{cell.value}</Text>
      {cell.annotation && <Text style={styles.annotation}>{cell.annotation}</Text>}
      {isTop && <Text style={styles.topTag}>← top</Text>}
    </Animated.View>
  );
}

function ActionBadge({ action, value }: { action: 'push' | 'pop'; value?: string | number }) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1, { damping: 8 }),
      withSpring(1, { damping: 14 })
    );
  }, [action, value]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.actionBadge, { backgroundColor: action === 'push' ? '#43E97B22' : '#FF658422', borderColor: action === 'push' ? '#43E97B' : '#FF6584' }, style]}>
      <Text style={[styles.actionText, { color: action === 'push' ? '#43E97B' : '#FF6584' }]}>
        {action === 'push' ? `push(${value})` : `pop() → ${value}`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  stackFrame: { alignItems: 'stretch', width: 160, gap: 3 },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
  },
  blockValue: { ...typography.body, fontWeight: '700' },
  annotation: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', flex: 1, textAlign: 'right', fontSize: 10 },
  topTag: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  emptySlot: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.sm,
    padding: 12,
    alignItems: 'center',
  },
  emptyText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  bottomLabel: {
    borderTopWidth: 2,
    borderTopColor: colors.textMuted,
    paddingTop: 4,
    alignItems: 'center',
  },
  bottomLabelText: { ...typography.caption, color: colors.textMuted },
  actionBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  actionText: { ...typography.bodySmall, fontWeight: '700', fontFamily: 'monospace' },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
