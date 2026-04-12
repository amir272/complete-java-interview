import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { allJavaTopics } from '../data/allJavaTopics';
import { JavaTopic } from '../data/javaTopics';

export function JavaTopicsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <HeaderSection />
        <View style={styles.grid}>
          {allJavaTopics.map((topic, i) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={i}
              onPress={() => navigation.navigate('JavaQA', { topicId: topic.id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HeaderSection() {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <Animated.View style={[styles.header, style]}>
      <Text style={styles.headerTitle}>Java Interview Topics</Text>
      <Text style={styles.headerSub}>6 YOE · Production-Ready Backend Engineer</Text>
    </Animated.View>
  );
}

function TopicCard({ topic, index, onPress }: { topic: JavaTopic; index: number; onPress: () => void }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 14, stiffness: 180 });
    }, index * 60);
    return () => clearTimeout(t);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pressScale.value }],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { pressScale.value = withSpring(0.96, { damping: 15 }); }}
        onPressOut={() => { pressScale.value = withSpring(1, { damping: 15 }); }}
        style={styles.pressable}
      >
        <View style={[styles.iconBg, { backgroundColor: topic.color + '22' }]}>
          <Text style={styles.icon}>{topic.icon}</Text>
        </View>
        <Text style={[styles.topicTitle, { color: topic.color }]}>{topic.title}</Text>
        <Text style={styles.questionCount}>{topic.questions.length} Q&amp;A</Text>
        <View style={[styles.bottomBar, { backgroundColor: topic.color }]} />
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    width: '47%',
    overflow: 'hidden',
  },
  pressable: { padding: spacing.md, alignItems: 'center' },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 26 },
  topicTitle: { ...typography.bodySmall, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  questionCount: { ...typography.caption, color: colors.textMuted },
  bottomBar: { height: 3, width: '60%', borderRadius: 2, marginTop: spacing.sm },
});
