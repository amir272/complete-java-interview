import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Concept } from '../data/dsaConcepts';

interface ConceptCardProps {
  concept: Concept;
  index: number;
  accentColor: string;
}

export function ConceptCard({ concept, index, accentColor }: ConceptCardProps) {
  const [open, setOpen] = useState(false);
  const arrowRotation = useSharedValue(0);
  const entranceOpacity = useSharedValue(0);

  React.useEffect(() => {
    const t = setTimeout(() => {
      entranceOpacity.value = withTiming(1, { duration: 300 });
    }, index * 60);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    arrowRotation.value = withSpring(next ? 180 : 0, { damping: 15 });
  };

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));
  const entranceStyle = useAnimatedStyle(() => ({ opacity: entranceOpacity.value }));

  return (
    <Animated.View style={[styles.container, { borderColor: accentColor + '33' }, entranceStyle]}>
      {/* Header row — always visible */}
      <Pressable
        onPress={toggle}
        style={[styles.header, { borderLeftColor: accentColor }]}
      >
        <Text style={styles.headerIcon}>{concept.icon}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: accentColor }]}>{concept.title}</Text>
          <Text style={styles.tagline} numberOfLines={open ? undefined : 2}>
            {concept.tagline}
          </Text>
        </View>
        <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
      </Pressable>

      {/* Expanded body */}
      {open && (
        <View style={styles.body}>
          <View style={[styles.divider, { backgroundColor: accentColor + '33' }]} />

          {/* Full explanation */}
          <SectionLabel label="EXPLANATION" color={accentColor} />
          <Text style={styles.explanationText}>{concept.explanation}</Text>

          {/* Complexity */}
          {concept.complexity && (
            <>
              <SectionLabel label="COMPLEXITY" color={accentColor} />
              <View style={styles.complexityRow}>
                <ComplexityChip label="Time" value={concept.complexity.time} color={accentColor} />
                <ComplexityChip label="Space" value={concept.complexity.space} color={accentColor} />
              </View>
              {concept.complexity.note && (
                <Text style={styles.complexityNote}>{concept.complexity.note}</Text>
              )}
            </>
          )}

          {/* Key Points */}
          <SectionLabel label="KEY POINTS" color={accentColor} />
          {concept.keyPoints.map((point, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}

          {/* When to Use */}
          <SectionLabel label="WHEN TO USE" color={accentColor} />
          <View style={[styles.whenToUseBox, { borderColor: accentColor + '44', backgroundColor: accentColor + '0C' }]}>
            <Text style={styles.whenToUseText}>{concept.whenToUse}</Text>
          </View>

          {/* Code Template */}
          {concept.codeTemplate && (
            <>
              <SectionLabel label="CODE TEMPLATE" color={accentColor} />
              <View style={styles.codeBox}>
                {/* Mac-style header */}
                <View style={styles.codeHeader}>
                  <View style={styles.trafficLights}>
                    <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
                    <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                    <View style={[styles.dot, { backgroundColor: '#28CA41' }]} />
                  </View>
                  <Text style={styles.codeLabel}>Java</Text>
                </View>
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator
                  indicatorStyle="white"
                  contentContainerStyle={styles.codeContent}
                >
                  <Text style={styles.code}>{concept.codeTemplate}</Text>
                </ScrollView>
              </View>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.sectionLabel, { color: color + 'CC' }]}>{label}</Text>
  );
}

function ComplexityChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.complexityChip, { borderColor: color + '44', backgroundColor: color + '0C' }]}>
      <Text style={[styles.complexityChipLabel, { color: color + 'AA' }]}>{label}</Text>
      <Text style={[styles.complexityChipValue, { color }]}>{value}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginVertical: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderLeftWidth: 3,
    gap: 10,
  },
  headerIcon: {
    fontSize: 22,
    lineHeight: 28,
    flexShrink: 0,
  },
  headerText: { flex: 1 },
  title: {
    ...typography.h4,
    fontWeight: '700',
    marginBottom: 3,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  arrow: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    flexShrink: 0,
  },

  // Body
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  divider: {
    height: 1,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  explanationText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
  },

  // Complexity
  complexityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  complexityChip: {
    flex: 1,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  complexityChipLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  complexityChipValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    lineHeight: 18,
  },
  complexityNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Key points bullets
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 6,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  bulletText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    flex: 1,
  },

  // When to use
  whenToUseBox: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  whenToUseText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Code block
  codeBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
    backgroundColor: '#161B22',
  },
  trafficLights: { flexDirection: 'row', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  codeLabel: {
    fontSize: 11,
    color: '#8B949E',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  codeContent: {
    padding: 12,
    paddingBottom: 18,
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 20,
    color: '#E6EDF3',
  },
});
