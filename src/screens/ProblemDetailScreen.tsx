import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allDSACategories } from '../data/allDSACategories';
import { problemVisualizers } from '../data/visualizerData';
import { problemStatements, ProblemStatement, ProblemExample } from '../data/problemStatements';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PatternBadge } from '../components/PatternBadge';
import { StepGuide } from '../components/StepGuide';
import { CodeBlock } from '../components/CodeBlock';

type Tab = 'problem' | 'steps' | 'intuition' | 'code' | 'example';

const TABS: { id: Tab; label: string }[] = [
  { id: 'problem',   label: '📄 Problem' },
  { id: 'steps',     label: '📋 Steps' },
  { id: 'intuition', label: '🧠 Intuition' },
  { id: 'code',      label: '💻 Code' },
  { id: 'example',   label: '🔍 Example' },
];

export function ProblemDetailScreen({ route }: any) {
  const { categoryId, problemId } = route.params;
  const category = allDSACategories.find(c => c.id === categoryId)!;
  const problem = category.problems.find(p => p.id === problemId)!;
  const statement = problemStatements[problem.id];
  const [activeTab, setActiveTab] = useState<Tab>('problem');

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    headerY.value = withSpring(0, { damping: 18 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Problem header */}
        <Animated.View style={[styles.header, { borderLeftColor: category.color, borderLeftWidth: 4 }, headerStyle]}>
          <View style={styles.headerTopRow}>
            <View style={[styles.numBadge, { backgroundColor: category.color + '22' }]}>
              <Text style={[styles.numText, { color: category.color }]}>#{problem.id}</Text>
            </View>
            <DifficultyBadge difficulty={problem.difficulty} />
            <View style={styles.headerSpacer} />
            <Text style={styles.categoryLabel}>{category.icon} {category.title}</Text>
          </View>

          <Text style={styles.title}>{problem.title}</Text>

          <View style={styles.patternRow}>
            <PatternBadge label={problem.pattern} color={category.color} />
          </View>

          <View style={styles.complexityRow}>
            <ComplexityCard label="Time" value={problem.timeComplexity} color={category.color} />
            <ComplexityCard label="Space" value={problem.spaceComplexity} color={category.color} />
          </View>
        </Animated.View>

        {/* Scrollable tab bar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} color={category.color} />

        {/* Tab content */}
        <TabContent
          activeTab={activeTab}
          problem={problem}
          statement={statement}
          color={category.color}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ComplexityCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.complexityCard, { borderColor: color + '33' }]}>
      <Text style={styles.complexityLabel}>{label}</Text>
      <Text style={[styles.complexityValue, { color }]}>{value}</Text>
    </View>
  );
}

function TabBar({ activeTab, onTabChange, color }: { activeTab: Tab; onTabChange: (t: Tab) => void; color: string }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBar}
      style={styles.tabBarWrapper}
    >
      {TABS.map(tab => (
        <TabButton
          key={tab.id}
          tab={tab}
          active={activeTab === tab.id}
          color={color}
          onPress={() => onTabChange(tab.id)}
        />
      ))}
    </ScrollView>
  );
}

function TabButton({ tab, active, color, onPress }: { tab: { id: Tab; label: string }; active: boolean; color: string; onPress: () => void }) {
  const underlineScaleX = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    underlineScaleX.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: underlineScaleX.value }],
    opacity: underlineScaleX.value,
  }));

  const scale = useSharedValue(1);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.94, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      style={[styles.tabBtn, active && { backgroundColor: color + '15' }]}
    >
      <Text style={[styles.tabLabel, { color: active ? color : colors.textMuted }]}>
        {tab.label}
      </Text>
      <Animated.View style={[styles.tabUnderline, { backgroundColor: color }, underlineStyle]} />
    </Pressable>
  );
}

function TabContent({ activeTab, problem, statement, color }: {
  activeTab: Tab;
  problem: any;
  statement: ProblemStatement | undefined;
  color: string;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 80 }, () => {
      translateX.value = 16;
      opacity.value = withTiming(1, { duration: 250 });
      translateX.value = withSpring(0, { damping: 20 });
    });
  }, [activeTab]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={style}>
      {activeTab === 'problem' && (
        <ProblemTab statement={statement} problem={problem} color={color} />
      )}
      {activeTab === 'steps' && (
        <StepGuide
          steps={problem.steps}
          accentColor={color}
          visualizers={problemVisualizers[problem.id] ?? undefined}
        />
      )}
      {activeTab === 'intuition' && (
        <IntuitionTab intuition={problem.intuition} color={color} />
      )}
      {activeTab === 'code' && (
        <CodeBlock code={problem.code} label={problem.title} />
      )}
      {activeTab === 'example' && (
        <ExampleTab example={problem.example} color={color} />
      )}
    </Animated.View>
  );
}

// ─── Problem Tab ─────────────────────────────────────────────────────────────
function ProblemTab({ statement, problem, color }: {
  statement: ProblemStatement | undefined;
  problem: any;
  color: string;
}) {
  if (!statement) {
    // Fallback: show summary if no full statement
    return (
      <View style={[styles.problemCard, { borderLeftColor: color }]}>
        <Text style={styles.sectionHeading}>Description</Text>
        <Text style={styles.descriptionText}>{problem.summary}</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Description */}
      <AnimatedSection delay={0}>
        <View style={[styles.problemCard, { borderLeftColor: color }]}>
          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.descriptionText}>{statement.description}</Text>
        </View>
      </AnimatedSection>

      {/* Function signature */}
      {statement.functionSignature && (
        <AnimatedSection delay={80}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Function Signature</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.signatureCode}>{statement.functionSignature}</Text>
            </ScrollView>
          </View>
        </AnimatedSection>
      )}

      {/* Examples */}
      <AnimatedSection delay={160}>
        <Text style={styles.sectionHeading2}>Examples</Text>
        {statement.examples.map((ex: ProblemExample, i: number) => (
          <ExampleBlock key={i} example={ex} index={i} color={color} />
        ))}
      </AnimatedSection>

      {/* Constraints */}
      <AnimatedSection delay={240}>
        <View style={styles.constraintsCard}>
          <Text style={styles.sectionHeading}>Constraints</Text>
          {statement.constraints.map((c: string, i: number) => (
            <ConstraintRow key={i} text={c} index={i} color={color} />
          ))}
        </View>
      </AnimatedSection>

      {/* Follow-up */}
      {statement.followUp && (
        <AnimatedSection delay={320}>
          <View style={[styles.followUpCard, { borderColor: color + '44' }]}>
            <Text style={styles.followUpLabel}>💡 Follow-up</Text>
            <Text style={styles.followUpText}>{statement.followUp}</Text>
          </View>
        </AnimatedSection>
      )}
    </View>
  );
}

function AnimatedSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  const opacity = useSharedValue(0);
  const y = useSharedValue(12);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      y.value = withSpring(0, { damping: 18 });
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

function ExampleBlock({ example, index, color }: { example: ProblemExample; index: number; color: string }) {
  return (
    <View style={[styles.exampleBlock, { borderColor: color + '33' }]}>
      <Text style={[styles.exampleTitle, { color }]}>Example {index + 1}</Text>

      <View style={styles.exampleRow}>
        <Text style={styles.exampleKey}>Input: </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.exampleVal}>{example.input}</Text>
        </ScrollView>
      </View>

      <View style={styles.exampleRow}>
        <Text style={styles.exampleKey}>Output: </Text>
        <Text style={[styles.exampleVal, { color: colors.success }]}>{example.output}</Text>
      </View>

      {example.explanation && (
        <View style={styles.exampleExplanationRow}>
          <Text style={styles.exampleKey}>Explanation: </Text>
          <Text style={styles.exampleExplanation}>{example.explanation}</Text>
        </View>
      )}
    </View>
  );
}

function ConstraintRow({ text, index, color }: { text: string; index: number; color: string }) {
  const opacity = useSharedValue(0);
  const x = useSharedValue(-10);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 250 });
      x.value = withSpring(0, { damping: 18 });
    }, index * 40);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.constraintRow, style]}>
      <View style={[styles.constraintBullet, { backgroundColor: color }]} />
      <Text style={styles.constraintText}>{text}</Text>
    </Animated.View>
  );
}

// ─── Intuition Tab ────────────────────────────────────────────────────────────
function IntuitionTab({ intuition, color }: { intuition: string; color: string }) {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.intuitionCard, { borderLeftColor: color }, style]}>
      <Text style={styles.intuitionIcon}>🧠</Text>
      <Text style={styles.intuitionTitle}>Core Intuition</Text>
      <Text style={styles.intuitionText}>{intuition}</Text>
    </Animated.View>
  );
}

// ─── Example Tab ─────────────────────────────────────────────────────────────
function ExampleTab({ example, color }: { example: any; color: string }) {
  return (
    <View style={styles.exampleTabContainer}>
      <ExampleTabRow label="Input" value={example.input} color={color} delay={0} />
      <ExampleTabRow label="Output" value={example.output} color={colors.success} delay={150} />
      <ExampleTabRow label="Walkthrough" value={example.walkthrough} color={colors.textSecondary} delay={300} />
    </View>
  );
}

function ExampleTabRow({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 18 });
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.exampleTabRow, { borderLeftColor: color }, style]}>
      <Text style={[styles.exampleTabLabel, { color }]}>{label}</Text>
      <Text style={styles.exampleTabValue}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  // Header
  header: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm, flexWrap: 'wrap' },
  numBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm },
  numText: { ...typography.caption, fontWeight: '700' },
  headerSpacer: { flex: 1 },
  categoryLabel: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  patternRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  complexityRow: { flexDirection: 'row', gap: 12 },
  complexityCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  complexityLabel: { ...typography.caption, color: colors.textMuted },
  complexityValue: { ...typography.bodySmall, fontWeight: '700', marginTop: 2 },

  // Tab bar
  tabBarWrapper: { marginBottom: spacing.sm },
  tabBar: { flexDirection: 'row', gap: 4, paddingHorizontal: 2 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tabLabel: { ...typography.caption, fontWeight: '700' },
  tabUnderline: { height: 2, width: '80%', borderRadius: 1, marginTop: 3 },

  // Problem tab
  problemCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 3,
    marginBottom: spacing.sm,
  },
  sectionHeading: { ...typography.caption, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  sectionHeading2: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  descriptionText: { ...typography.body, color: colors.text, lineHeight: 26 },

  signatureBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  signatureLabel: { ...typography.caption, color: '#8B949E', marginBottom: 6, fontWeight: '600' },
  signatureCode: { ...typography.code, color: '#79C0FF', fontSize: 13 },

  exampleBlock: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  exampleTitle: { ...typography.caption, fontWeight: '700', marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  exampleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  exampleExplanationRow: { marginTop: 4 },
  exampleKey: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600', minWidth: 80 },
  exampleVal: { ...typography.code, color: colors.text, fontSize: 13, flex: 1 },
  exampleExplanation: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, flex: 1, flexWrap: 'wrap' },

  constraintsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  constraintRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  constraintBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  constraintText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 20 },

  followUpCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    backgroundColor: colors.card,
  },
  followUpLabel: { ...typography.caption, color: colors.warning, fontWeight: '700', marginBottom: 6 },
  followUpText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  // Intuition tab
  intuitionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    marginVertical: spacing.sm,
  },
  intuitionIcon: { fontSize: 32, marginBottom: spacing.sm },
  intuitionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  intuitionText: { ...typography.body, color: colors.textSecondary, lineHeight: 26 },

  // Example tab
  exampleTabContainer: { marginVertical: spacing.sm, gap: 10 },
  exampleTabRow: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
  },
  exampleTabLabel: { ...typography.caption, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  exampleTabValue: { ...typography.body, color: colors.text },
});
