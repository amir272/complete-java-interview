import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, typography } from '../../theme';
import { IntervalBar } from './types';

interface IntervalVisualizerProps {
  intervals: IntervalBar[];
  domain: [number, number];
  caption?: string;
}

const BAR_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  default:   { bg: '#45B7D133', border: '#45B7D1', text: '#45B7D1' },
  active:    { bg: '#6C63FF55', border: '#6C63FF', text: '#A89FFF' },
  selected:  { bg: '#43E97B33', border: '#43E97B', text: '#43E97B' },
  comparing: { bg: '#FF8C0033', border: '#FF8C00', text: '#FFB347' },
  result:    { bg: '#FF658433', border: '#FF6584', text: '#FF6584' },
  highlight: { bg: '#96CEB433', border: '#96CEB4', text: '#96CEB4' },
  eliminated:{ bg: '#33333366', border: '#444',    text: '#555'    },
  empty:     { bg: 'transparent', border: '#333',  text: '#555'    },
  visited:   { bg: '#FFEAA733', border: '#FFEAA7', text: '#FFEAA7' },
  fresh:     { bg: '#96CEB433', border: '#96CEB4', text: '#96CEB4' },
  rotten:    { bg: '#FF6B6B33', border: '#FF6B6B', text: '#FF6B6B' },
};

const RULER_WIDTH = 280;

export function IntervalVisualizer({ intervals, domain, caption }: IntervalVisualizerProps) {
  const [min, max] = domain;
  const range = max - min || 1;

  const toPct = (v: number) => ((v - min) / range) * 100;

  // Ruler ticks
  const ticks = [];
  for (let i = min; i <= max; i++) ticks.push(i);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {/* Intervals */}
        {intervals.map((bar, i) => (
          <IntervalBarView key={i} bar={bar} index={i} toPct={toPct} />
        ))}

        {/* Ruler */}
        <View style={styles.ruler}>
          {ticks.map(t => (
            <View key={t} style={[styles.tick, { left: `${toPct(t)}%` as any }]}>
              <View style={styles.tickLine} />
              <Text style={styles.tickLabel}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

function IntervalBarView({ bar, index, toPct }: { bar: IntervalBar; index: number; toPct: (v: number) => number }) {
  const c = BAR_COLORS[bar.status] ?? BAR_COLORS.default;
  const left = toPct(bar.start);
  const width = toPct(bar.end) - left;

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-10);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(0, { damping: 18 });
    }, index * 80);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.barRow, style]}>
      {/* Full-width track */}
      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            {
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: c.bg,
              borderColor: c.border,
            },
          ]}
        >
          <Text style={[styles.barLabel, { color: c.text }]} numberOfLines={1}>
            {bar.label ?? `[${bar.start},${bar.end}]`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  chart: { paddingBottom: 30 },
  barRow: { height: 32, marginBottom: 6, position: 'relative' },
  track: { flex: 1, height: 28, position: 'relative' },
  bar: {
    position: 'absolute',
    top: 0,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 6,
    minWidth: 24,
  },
  barLabel: { ...typography.caption, fontWeight: '700', fontSize: 10 },
  ruler: { height: 24, position: 'relative', marginTop: 4 },
  tick: { position: 'absolute', alignItems: 'center' },
  tickLine: { width: 1, height: 6, backgroundColor: colors.textMuted },
  tickLabel: { ...typography.caption, color: colors.textMuted, fontSize: 9, marginTop: 1 },
  caption: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
});
