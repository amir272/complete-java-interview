import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allJavaTopics } from '../data/allJavaTopics';
import { AccordionQA } from '../components/AccordionQA';

export function JavaQAScreen({ route }: any) {
  const { topicId } = route.params;
  const topic = allJavaTopics.find(t => t.id === topicId)!;

  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Topic header — book chapter title style */}
        <Animated.View style={[styles.header, { borderColor: topic.color + '33' }, headerStyle]}>
          <View style={[styles.iconBg, { backgroundColor: topic.color + '1A' }]}>
            <Text style={styles.icon}>{topic.icon}</Text>
          </View>
          <Text style={[styles.topicTitle, { color: topic.color }]}>{topic.title}</Text>
          <View style={[styles.titleUnderline, { backgroundColor: topic.color + '55' }]} />
          <Text style={styles.description}>{topic.description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaBadge, { backgroundColor: topic.color + '18', borderColor: topic.color + '44' }]}>
              <Text style={[styles.metaText, { color: topic.color }]}>
                {topic.questions.length} questions
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Questions &amp; Answers</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* Q&A List */}
        {topic.questions.map((qa, i) => (
          <AccordionQA key={i} qa={qa} index={i} accentColor={topic.color} />
        ))}

        <View style={styles.endSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  // Chapter-style header
  header: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
  },
  iconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 34 },
  topicTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 40,
    height: 2,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  metaRow: { marginTop: spacing.sm },
  metaBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Section heading
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  endSpacer: { height: spacing.xl },
});
