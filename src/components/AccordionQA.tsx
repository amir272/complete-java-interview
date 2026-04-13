import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme';
import { QA } from '../data/javaTopics';
import { FormattedAnswer } from './FormattedAnswer';

interface AccordionQAProps {
  qa: QA;
  index: number;
  accentColor: string;
}

export function AccordionQA({ qa, index, accentColor }: AccordionQAProps) {
  const [open, setOpen] = useState(false);
  const arrowRotation = useSharedValue(0);

  // Subtle staggered fade-in on mount (no movement)
  const entranceOpacity = useSharedValue(0);
  React.useEffect(() => {
    const t = setTimeout(() => {
      entranceOpacity.value = withTiming(1, { duration: 300 });
    }, index * 50);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    arrowRotation.value = withSpring(next ? 180 : 0, { damping: 15 });
  };

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, open && styles.containerOpen, entranceStyle]}>
      {/* Question row */}
      <Pressable
        onPress={toggle}
        style={[styles.header, { borderLeftColor: accentColor }]}
      >
        {/* Q number badge */}
        <View style={[styles.qNumBadge, { backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.qNum, { color: accentColor }]}>Q{index + 1}</Text>
        </View>

        <Text style={styles.question} numberOfLines={open ? undefined : 3}>
          {qa.question}
        </Text>

        <Animated.Text style={[styles.arrow, arrowStyle]}>▼</Animated.Text>
      </Pressable>

      {/* Answer body */}
      {open && (
        <View style={styles.body}>
          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: accentColor + '33' }]} />

          {/* Answer label */}
          <Text style={[styles.answerLabel, { color: accentColor + 'AA' }]}>ANSWER</Text>

          {/* Formatted answer text */}
          <FormattedAnswer text={qa.answer} accentColor={accentColor} />

          {/* Code example */}
          {qa.codeExample && (
            <View style={styles.codeBox}>
              <View style={[styles.codeHeader, { borderBottomColor: '#30363D' }]}>
                <View style={styles.trafficLights}>
                  <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
                  <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                  <View style={[styles.dot, { backgroundColor: '#28CA41' }]} />
                </View>
                <Text style={styles.codeLabel}>Java</Text>
              </View>
              {/*
               * nestedScrollEnabled — Android: prevents the outer vertical ScrollView
               *   from stealing horizontal swipe gestures inside the code block.
               * showsHorizontalScrollIndicator — visible so users know content scrolls.
               * indicatorStyle="white" — readable against the dark (#0D1117) background.
               * contentContainerStyle paddingBottom — keeps the scroll bar inside the
               *   visible area even when the parent has overflow:hidden.
               */}
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator
                indicatorStyle="white"
                contentContainerStyle={styles.codeContent}
              >
                <Text style={styles.code}>{qa.codeExample}</Text>
              </ScrollView>
            </View>
          )}

          {/* Tags */}
          {qa.tags && qa.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {qa.tags.map(tag => (
                <View key={tag} style={[styles.tag, { borderColor: accentColor + '44' }]}>
                  <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerOpen: {
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderLeftWidth: 3,
    gap: 10,
  },
  qNumBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    flexShrink: 0,
    marginTop: 1,
  },
  qNum: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  question: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
    fontSize: 15,
  },
  arrow: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 5,
    flexShrink: 0,
  },

  // Answer body
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    marginBottom: spacing.sm,
  },
  answerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },

  // Code block — book-style dark panel
  codeBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    backgroundColor: '#161B22',
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  codeLabel: {
    fontSize: 11,
    color: '#8B949E',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // contentContainerStyle for the horizontal code ScrollView
  codeContent: {
    padding: 12,
    paddingBottom: 18, // extra room so the scroll indicator bar isn't clipped by overflow:hidden
  },
  code: {
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 22,
    color: '#E6EDF3',
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
