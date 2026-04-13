import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allDSACategories } from '../data/allDSACategories';
import { DSACategory, Problem } from '../data/dsaProblems';
import { dsaConcepts } from '../data/dsaConcepts';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PatternBadge } from '../components/PatternBadge';
import { ConceptCard } from '../components/ConceptCard';

type SectionTab = 'concepts' | 'problems';

export function ProblemListScreen({ route, navigation }: any) {
  const { categoryId } = route.params;
  const category = allDSACategories.find(c => c.id === categoryId)!;
  const concepts = dsaConcepts[categoryId] ?? [];
  const [activeSection, setActiveSection] = useState<SectionTab>('concepts');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Category header */}
        <CategoryHeader category={category} />

        {/* Section toggle — Concepts | Problems */}
        <SectionToggle
          active={activeSection}
          onSwitch={setActiveSection}
          color={category.color}
          conceptCount={concepts.length}
          problemCount={category.problems.length}
        />

        {/* Concepts section */}
        {activeSection === 'concepts' && (
          <View>
            {concepts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No concepts defined for this category yet.</Text>
              </View>
            ) : (
              concepts.map((concept, i) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  index={i}
                  accentColor={category.color}
                />
              ))
            )}
          </View>
        )}

        {/* Problems section */}
        {activeSection === 'problems' && (
          <View>
            {category.problems.map((problem, i) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                index={i}
                color={category.color}
                onPress={() => navigation.navigate('ProblemDetail', { categoryId, problemId: problem.id })}
              />
            ))}
          </View>
        )}

        <View style={styles.endSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Category Header ──────────────────────────────────────────────────────────
function CategoryHeader({ category }: { category: DSACategory }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.catHeader, { borderColor: category.color + '44' }, style]}>
      <View style={[styles.catIconBg, { backgroundColor: category.color + '22' }]}>
        <Text style={styles.catIcon}>{category.icon}</Text>
      </View>
      <Text style={[styles.catTitle, { color: category.color }]}>{category.title}</Text>
      <View style={[styles.titleUnderline, { backgroundColor: category.color + '55' }]} />
      <Text style={styles.catDesc}>{category.description}</Text>
    </Animated.View>
  );
}

// ─── Section Toggle ───────────────────────────────────────────────────────────
function SectionToggle({
  active, onSwitch, color, conceptCount, problemCount,
}: {
  active: SectionTab;
  onSwitch: (s: SectionTab) => void;
  color: string;
  conceptCount: number;
  problemCount: number;
}) {
  return (
    <View style={[styles.toggleRow, { borderColor: color + '33' }]}>
      <ToggleButton
        label="📐 Concepts"
        count={conceptCount}
        active={active === 'concepts'}
        color={color}
        onPress={() => onSwitch('concepts')}
      />
      <View style={[styles.toggleDivider, { backgroundColor: color + '33' }]} />
      <ToggleButton
        label="💡 Problems"
        count={problemCount}
        active={active === 'problems'}
        color={color}
        onPress={() => onSwitch('problems')}
      />
    </View>
  );
}

function ToggleButton({
  label, count, active, color, onPress,
}: {
  label: string; count: number; active: boolean; color: string; onPress: () => void;
}) {
  const underline = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    underline.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: underline.value }],
    opacity: underline.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggleBtn, active && { backgroundColor: color + '12' }]}
    >
      <Text style={[styles.toggleLabel, { color: active ? color : colors.textMuted }]}>
        {label}
      </Text>
      <View style={[styles.toggleCountBadge, { backgroundColor: color + (active ? '33' : '15') }]}>
        <Text style={[styles.toggleCount, { color: active ? color : colors.textMuted }]}>
          {count}
        </Text>
      </View>
      <Animated.View style={[styles.toggleUnderline, { backgroundColor: color }, underlineStyle]} />
    </Pressable>
  );
}

// ─── Problem Card ─────────────────────────────────────────────────────────────
function ProblemCard({ problem, index, color, onPress }: {
  problem: Problem; index: number; color: string; onPress: () => void;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
    }, index * 70);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, { borderLeftColor: color }, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        style={styles.pressable}
      >
        <View style={styles.row}>
          <View style={[styles.numBadge, { backgroundColor: color + '22' }]}>
            <Text style={[styles.numText, { color }]}>#{problem.id}</Text>
          </View>
          <View style={styles.problemInfo}>
            <Text style={styles.problemTitle}>{problem.title}</Text>
            <View style={styles.badges}>
              <DifficultyBadge difficulty={problem.difficulty} />
              <PatternBadge label={problem.pattern} color={color} delay={index * 50} />
            </View>
          </View>
          <Text style={[styles.arrow, { color }]}>→</Text>
        </View>

        <View style={styles.complexityRow}>
          <ComplexityPill label="Time" value={problem.timeComplexity} color={color} />
          <ComplexityPill label="Space" value={problem.spaceComplexity} color={color} />
        </View>

        <Text style={styles.summary} numberOfLines={2}>{problem.summary}</Text>
      </Pressable>
    </Animated.View>
  );
}

function ComplexityPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.complexityPill}>
      <Text style={styles.complexityLabel}>{label}: </Text>
      <Text style={[styles.complexityValue, { color }]}>{value}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  catHeader: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
  },
  catIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  catIcon: { fontSize: 34 },
  catTitle: { ...typography.h2, textAlign: 'center', marginBottom: 6 },
  titleUnderline: {
    width: 40,
    height: 2,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  catDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },

  // Section toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  toggleLabel: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  toggleCountBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  toggleCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  toggleUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 2,
    borderRadius: 1,
  },
  toggleDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 8,
  },

  // Problem card
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginVertical: 6,
    borderLeftWidth: 3,
    overflow: 'hidden',
  },
  pressable: { padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: 10 },
  numBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm },
  numText: { ...typography.caption, fontWeight: '700' },
  problemInfo: { flex: 1 },
  problemTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  arrow: { fontSize: 16 },
  complexityRow: { flexDirection: 'row', gap: 16, marginBottom: spacing.xs },
  complexityPill: { flexDirection: 'row', alignItems: 'center' },
  complexityLabel: { ...typography.caption, color: colors.textMuted },
  complexityValue: { ...typography.caption, fontWeight: '700' },
  summary: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 18 },

  emptyState: { padding: spacing.lg, alignItems: 'center' },
  emptyText: { ...typography.bodySmall, color: colors.textMuted },
  endSpacer: { height: spacing.xl },
});
