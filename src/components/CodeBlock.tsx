import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme';

interface CodeBlockProps {
  code: string;
  label?: string;
  language?: string;
}

export function CodeBlock({ code, label = 'Solution', language = 'java' }: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const arrowRotation = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    arrowRotation.value = withSpring(next ? 90 : 0, { damping: 15 });
    contentOpacity.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.langBadge}>
            <Text style={styles.langText}>{language.toUpperCase()}</Text>
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.headerRight}>
          <Animated.Text style={[styles.arrow, arrowStyle]}>▶</Animated.Text>
        </View>
      </Pressable>

      {expanded && (
        <Animated.View style={[styles.codeContainer, contentStyle]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scroll}>
            <Text style={styles.code}>{code}</Text>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#161B22',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langBadge: {
    backgroundColor: '#388BFD22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#388BFD44',
  },
  langText: { fontSize: 11, color: '#388BFD', fontWeight: '700' },
  label: { ...typography.bodySmall, color: '#8B949E', fontWeight: '500' },
  arrow: { fontSize: 12, color: '#8B949E' },
  codeContainer: { padding: spacing.md },
  scroll: { maxHeight: 320 },
  code: {
    ...typography.code,
    color: '#E6EDF3',
    lineHeight: 22,
  },
});
