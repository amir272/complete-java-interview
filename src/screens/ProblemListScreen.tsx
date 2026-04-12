import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allDSACategories } from '../data/allDSACategories';
import { DSACategory, Problem } from '../data/dsaProblems';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { PatternBadge } from '../components/PatternBadge';

export function ProblemListScreen({ route, navigation }: any) {
  const { categoryId } = route.params;
  const category = allDSACategories.find(c => c.id === categoryId)!;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Category header */}
        <CategoryHeader category={category} />

        {category.problems.map((problem, i) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            index={i}
            color={category.color}
            onPress={() => navigation.navigate('ProblemDetail', { categoryId, problemId: problem.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryHeader({ category }: { category: DSACategory }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.catHeader, { borderColor: category.color + '44' }, style]}>
      <View style={[styles.catIconBg, { backgroundColor: category.color + '22' }]}>
        <Text style={styles.catIcon}>{category.icon}</Text>
      </View>
      <Text style={[styles.catTitle, { color: category.color }]}>{category.title}</Text>
      <Text style={styles.catDesc}>{category.description}</Text>
      <View style={styles.catMeta}>
        <Text style={styles.catMetaText}>{category.problems.length} problems</Text>
      </View>
    </Animated.View>
  );
}

function ProblemCard({ problem, index, color, onPress }: {
  problem: Problem; index: number; color: string; onPress: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 20 });
    }, index * 100);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
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
  catIconBg: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  catIcon: { fontSize: 32 },
  catTitle: { ...typography.h2, textAlign: 'center', marginBottom: spacing.xs },
  catDesc: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  catMeta: { marginTop: spacing.sm },
  catMetaText: { ...typography.caption, color: colors.textMuted },
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
});
