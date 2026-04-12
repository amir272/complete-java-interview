import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme';
import { QA } from '../data/javaTopics';

interface AccordionQAProps {
  qa: QA;
  index: number;
  accentColor: string;
}

export function AccordionQA({ qa, index, accentColor }: AccordionQAProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const arrowRotation = useSharedValue(0);
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Entrance animation
  const entranceOpacity = useSharedValue(0);
  const entranceY = useSharedValue(20);
  React.useEffect(() => {
    const t = setTimeout(() => {
      entranceOpacity.value = withTiming(1, { duration: 350 });
      entranceY.value = withSpring(0, { damping: 20 });
    }, index * 60);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    arrowRotation.value = withSpring(next ? 180 : 0, { damping: 15 });
    if (next && height > 0) {
      animatedHeight.value = withSpring(height, { damping: 20 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      animatedHeight.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
      opacity.value = withTiming(0, { duration: 150 });
    }
  };

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: opacity.value,
    overflow: 'hidden',
  }));

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceY.value }],
  }));

  return (
    <Animated.View style={[styles.container, entranceStyle]}>
      <Pressable onPress={toggle} style={[styles.header, { borderLeftColor: accentColor }]}>
        <Text style={styles.question} numberOfLines={open ? undefined : 2}>{qa.question}</Text>
        <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
      </Pressable>

      <Animated.View style={bodyStyle}>
        <View
          style={styles.body}
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && h !== height) {
              setHeight(h);
              if (open) animatedHeight.value = h;
            }
          }}
        >
          <Text style={styles.answer}>{qa.answer}</Text>

          {qa.codeExample && (
            <View style={styles.codeBox}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.code}>{qa.codeExample}</Text>
              </ScrollView>
            </View>
          )}

          {qa.tags && qa.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {qa.tags.map(tag => (
                <View key={tag} style={[styles.tag, { borderColor: accentColor + '55' }]}>
                  <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginVertical: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderLeftWidth: 3,
    gap: 8,
  },
  question: { ...typography.body, color: colors.text, flex: 1, fontWeight: '500' },
  arrow: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    position: 'absolute',
    width: '100%',
  },
  answer: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.sm },
  codeBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  code: { ...typography.code, color: '#E6EDF3' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  tagText: { ...typography.caption, fontWeight: '600' },
});
