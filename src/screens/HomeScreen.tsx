import React, { useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
  withDelay, Easing, interpolate, withSequence,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';

const { width } = Dimensions.get('window');

const MAIN_TOPICS = [
  {
    id: 'dsa',
    title: 'DSA & LeetCode',
    subtitle: 'Heaps · Stacks · Hashing · BFS · Intervals · Binary Search · LRU',
    icon: '⚡',
    color: '#6C63FF',
    gradient: ['#6C63FF', '#8B85FF'],
    route: 'DSACategories',
  },
  {
    id: 'java',
    title: 'Java Interview',
    subtitle: 'Core Java · Spring · Microservices · AWS · System Design',
    icon: '☕',
    color: '#FF8C00',
    gradient: ['#FF8C00', '#FFB347'],
    route: 'JavaTopics',
  },
  {
    id: 'pattern',
    title: 'Pattern Identifier',
    subtitle: 'Identify the right DSA pattern in under 2 minutes',
    icon: '🎯',
    color: '#43E97B',
    gradient: ['#43E97B', '#38F9D7'],
    route: 'PatternSkill',
  },
];

const QUICK_STATS = [
  { label: 'DSA Problems', value: '25+', color: '#6C63FF' },
  { label: 'Java Topics', value: '200+', color: '#FF8C00' },
  { label: 'Categories', value: '20+', color: '#43E97B' },
  { label: 'Experience', value: '6 YOE', color: '#FF6584' },
];

export function HomeScreen({ navigation }: any) {
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerY.value = withSpring(0, { damping: 20 });
    pulseScale.value = withDelay(1000,
      withSequence(
        withSpring(1.05, { damping: 8 }),
        withSpring(1, { damping: 12 })
      )
    );
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Animated.View style={pulseStyle}>
            <Text style={styles.emoji}>🚀</Text>
          </Animated.View>
          <Text style={styles.title}>Java Interview</Text>
          <Text style={styles.subtitle}>Complete Backend Engineer Prep</Text>
          <Text style={styles.caption}>6 YOE · Production-Ready</Text>
        </Animated.View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {QUICK_STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </View>

        {/* Main topic cards */}
        <Text style={styles.sectionTitle}>Choose Your Topic</Text>
        {MAIN_TOPICS.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            index={i}
            onPress={() => navigation.navigate(topic.route)}
          />
        ))}

        {/* Tip card */}
        <TipCard index={MAIN_TOPICS.length} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ stat, index }: { stat: typeof QUICK_STATS[0]; index: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 300 });
    }, 400 + index * 80);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.statCard, style]}>
      <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );
}

function TopicCard({ topic, index, onPress }: { topic: typeof MAIN_TOPICS[0]; index: number; onPress: () => void }) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      translateY.value = withSpring(0, { damping: 20, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 400 });
    }, 700 + index * 120);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  return (
    <Animated.View style={[styles.topicCard, { borderLeftColor: topic.color, borderLeftWidth: 4 }, cardStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.topicPressable}>
        <View style={styles.topicLeft}>
          <View style={[styles.topicIconBg, { backgroundColor: topic.color + '22' }]}>
            <Text style={styles.topicIcon}>{topic.icon}</Text>
          </View>
          <View style={styles.topicText}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
          </View>
        </View>
        <Text style={[styles.topicArrow, { color: topic.color }]}>→</Text>
      </Pressable>
    </Animated.View>
  );
}

function TipCard({ index }: { index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, { damping: 18 });
    }, 800 + index * 120);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.tipCard, style]}>
      <Text style={styles.tipEmoji}>💡</Text>
      <View style={styles.tipText}>
        <Text style={styles.tipTitle}>Pro Tip</Text>
        <Text style={styles.tipBody}>
          Before writing any code, identify the pattern in under 2 minutes. Use the Pattern Identifier to train this skill.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.h3, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  caption: { ...typography.caption, color: colors.primary, marginTop: 6, letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statValue: { ...typography.h3, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  topicCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginVertical: 6,
    overflow: 'hidden',
  },
  topicPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  topicLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  topicIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  topicIcon: { fontSize: 24 },
  topicText: { flex: 1 },
  topicTitle: { ...typography.h4, color: colors.text },
  topicSubtitle: { ...typography.caption, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
  topicArrow: { fontSize: 20, fontWeight: '300' },
  tipCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    gap: 12,
  },
  tipEmoji: { fontSize: 28 },
  tipText: { flex: 1 },
  tipTitle: { ...typography.h4, color: colors.primary, marginBottom: 4 },
  tipBody: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
});
