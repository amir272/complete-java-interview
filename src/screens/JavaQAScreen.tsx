import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Topic header */}
        <Animated.View style={[styles.header, { borderColor: topic.color + '44' }, headerStyle]}>
          <View style={[styles.iconBg, { backgroundColor: topic.color + '22' }]}>
            <Text style={styles.icon}>{topic.icon}</Text>
          </View>
          <Text style={[styles.topicTitle, { color: topic.color }]}>{topic.title}</Text>
          <Text style={styles.description}>{topic.description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaBadge, { backgroundColor: topic.color + '22', borderColor: topic.color + '44' }]}>
              <Text style={[styles.metaText, { color: topic.color }]}>{topic.questions.length} questions</Text>
            </View>
          </View>
        </Animated.View>

        {/* Q&A List */}
        <Text style={styles.sectionTitle}>Questions &amp; Answers</Text>
        {topic.questions.map((qa, i) => (
          <AccordionQA key={i} qa={qa} index={i} accentColor={topic.color} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
  },
  iconBg: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  icon: { fontSize: 32 },
  topicTitle: { ...typography.h2, textAlign: 'center', marginBottom: spacing.xs },
  description: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  metaRow: { marginTop: spacing.sm },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  metaText: { ...typography.caption, fontWeight: '700' },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
});
