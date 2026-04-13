import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Step } from '../data/dsaProblems';
import { VisualizerData } from './visualizers/types';
import { Visualizer } from './visualizers/Visualizer';

interface StepGuideProps {
  steps: Step[];
  accentColor: string;
  /** One VisualizerData per step (can be null for steps without visuals) */
  visualizers?: (VisualizerData | null)[];
}

const AUTO_PLAY_MS = 2000; // ms per step during auto-play

export function StepGuide({ steps, accentColor, visualizers }: StepGuideProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // Keep a ref so the interval closure always sees the latest activeStep
  const stepRef = useRef(activeStep);
  useEffect(() => { stepRef.current = activeStep; }, [activeStep]);

  useEffect(() => {
    progressWidth.value = withTiming(
      steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 100,
      { duration: 500, easing: Easing.out(Easing.cubic) }
    );
  }, [activeStep, steps.length]);

  // Auto-play tick
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        const next = stepRef.current + 1;
        if (next >= steps.length) {
          setPlaying(false);
        } else {
          goToStep(next);
          setCompletedSteps(prev => new Set([...prev, stepRef.current]));
        }
      }, AUTO_PLAY_MS);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [playing, steps.length]);

  const goToStep = (idx: number) => {
    const direction = idx > stepRef.current ? 1 : -1;
    contentOpacity.value = withTiming(0, { duration: 150 }, () => {
      contentTranslateX.value = direction * 30;
    });
    setTimeout(() => {
      setActiveStep(idx);
      contentTranslateX.value = direction * -30;
      contentOpacity.value = withTiming(1, { duration: 200 });
      contentTranslateX.value = withSpring(0, { damping: 20 });
    }, 160);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, activeStep]));
      goToStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setPlaying(false);
      goToStep(activeStep - 1);
    }
  };

  const handlePlayPause = () => {
    if (activeStep === steps.length - 1) {
      // restart from beginning
      setCompletedSteps(new Set());
      goToStep(0);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const step = steps[activeStep];
  const currentVisual = visualizers?.[activeStep] ?? null;
  const prevVisual = activeStep > 0 ? (visualizers?.[activeStep - 1] ?? null) : null;

  return (
    <View style={styles.container}>
      {/* Step dot indicators */}
      <View style={styles.stepsRow}>
        {steps.map((_, idx) => (
          <StepDot
            key={idx}
            index={idx}
            active={idx === activeStep}
            completed={completedSteps.has(idx)}
            color={accentColor}
            onPress={() => goToStep(idx)}
          />
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { backgroundColor: accentColor }, progressStyle]} />
      </View>

      {/* Step content + visualizer */}
      <Animated.View style={[contentStyle]}>
        {/* ── Visualizer ── */}
        {currentVisual && (
          <Visualizer data={currentVisual} prevData={prevVisual ?? undefined} />
        )}

        {/* ── Step text ── */}
        <View style={[styles.stepHeader, { borderLeftColor: accentColor }]}>
          <Text style={styles.stepNumber}>Step {activeStep + 1} of {steps.length}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
        </View>

        <Text style={styles.explanation}>{step.explanation}</Text>

        {step.hint && (
          <View style={styles.hintBox}>
            <Text style={styles.hintLabel}>💡 Hint</Text>
            <Text style={styles.hintText}>{step.hint}</Text>
          </View>
        )}

        {step.code && (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Code</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.codeText}>{step.code}</Text>
            </ScrollView>
          </View>
        )}
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <Pressable
          style={[styles.navBtn, activeStep === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={activeStep === 0}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </Pressable>

        {/* Play / Pause button */}
        <Pressable
          style={[styles.playBtn, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}
          onPress={handlePlayPause}
        >
          <Text style={[styles.playBtnText, { color: accentColor }]}>
            {playing ? '⏸ Pause' : activeStep === steps.length - 1 ? '↺ Replay' : '▶ Play'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navBtn, { backgroundColor: accentColor + '33' }, activeStep === steps.length - 1 && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          <Text style={[styles.navBtnText, { color: accentColor }]}>
            {activeStep === steps.length - 1 ? 'Done ✓' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function StepDot({ index, active, completed, color, onPress }: {
  index: number; active: boolean; completed: boolean; color: string; onPress: () => void;
}) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSequence(
      withSpring(active ? 1.3 : 1, { damping: 10 }),
      withSpring(active ? 1.2 : 1, { damping: 15 })
    );
  }, [active]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: active || completed ? 1 : 0.4,
    backgroundColor: completed ? color : active ? color : colors.border,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.dot, dotStyle]}>
        {completed ? (
          <Text style={styles.dotCheck}>✓</Text>
        ) : (
          <Text style={styles.dotNum}>{index + 1}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotNum: { color: colors.text, fontSize: 13, fontWeight: '600' },
  dotCheck: { color: '#000', fontSize: 13, fontWeight: '700' },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 2 },
  stepHeader: {
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  stepNumber: { ...typography.caption, color: colors.textMuted, marginBottom: 2 },
  stepTitle: { ...typography.h4, color: colors.text },
  explanation: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  hintBox: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  hintLabel: { ...typography.caption, color: colors.warning, marginBottom: 2 },
  hintText: { ...typography.bodySmall, color: colors.textSecondary },
  codeBox: {
    backgroundColor: '#0D1117',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  codeLabel: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  codeText: { ...typography.code, color: '#E6EDF3' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  navBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  stepCounter: { ...typography.caption, color: colors.textMuted },
  playBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  playBtnText: { ...typography.bodySmall, fontWeight: '700' },
});
