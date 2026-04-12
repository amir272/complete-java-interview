import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allDSACategories } from '../data/allDSACategories';
import { DSACategory } from '../data/dsaProblems';

export function DSACategoriesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <HeaderSection />
        {allDSACategories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            index={i}
            onPress={() => navigation.navigate('ProblemList', { categoryId: cat.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function HeaderSection() {
  const opacity = useSharedValue(0);
  const y = useSharedValue(-15);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    y.value = withSpring(0, { damping: 18 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View style={[styles.header, style]}>
      <Text style={styles.headerTitle}>DSA Patterns</Text>
      <Text style={styles.headerSub}>Master these 7 categories for backend interviews</Text>
    </Animated.View>
  );
}

function CategoryCard({ category, index, onPress }: { category: DSACategory; index: number; onPress: () => void }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);
  const scale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 350 });
      translateX.value = withSpring(0, { damping: 20 });
    }, index * 80);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
        {/* Color strip */}
        <View style={[styles.colorStrip, { backgroundColor: category.color }]} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={[styles.iconBg, { backgroundColor: category.color + '22' }]}>
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.title}>{category.title}</Text>
              <View style={styles.countBadge}>
                <Text style={[styles.countText, { color: category.color }]}>
                  {category.problems.length} problems
                </Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: category.color }]}>→</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>{category.description}</Text>

          {/* Problem pills */}
          <View style={styles.pillsRow}>
            {category.problems.slice(0, 3).map(p => (
              <View key={p.id} style={[styles.pill, { borderColor: category.color + '44' }]}>
                <Text style={styles.pillNum}>#{p.id}</Text>
              </View>
            ))}
            {category.problems.length > 3 && (
              <View style={[styles.pill, { borderColor: category.color + '44' }]}>
                <Text style={styles.pillNum}>+{category.problems.length - 3}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: { paddingVertical: spacing.md },
  headerTitle: { ...typography.h2, color: colors.text },
  headerSub: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginVertical: 6,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  pressable: { flexDirection: 'row', flex: 1 },
  colorStrip: { width: 4 },
  content: { flex: 1, padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: 10 },
  iconBg: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 22 },
  textGroup: { flex: 1 },
  title: { ...typography.h4, color: colors.text },
  countBadge: { marginTop: 2 },
  countText: { ...typography.caption, fontWeight: '600' },
  arrow: { fontSize: 18 },
  description: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.sm },
  pillsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  pillNum: { ...typography.caption, color: colors.textSecondary },
});
