import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
  withSequence, withDelay, withRepeat, Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../theme';
import { patternSkillSteps, patternSignals } from '../data/patternSkill';

type Mode = 'overview' | 'stepMode' | 'signals';

export function PatternSkillScreen() {
  const [mode, setMode] = useState<Mode>('overview');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withSpring(0, { damping: 18 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setCurrentStep(0);
    setSelectedOption(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.timer}>⏱️ 2:00</Text>
          <Text style={styles.headerTitle}>Pattern Identifier</Text>
          <Text style={styles.headerSub}>Identify the right DSA pattern in under 2 minutes</Text>
        </Animated.View>

        {/* Mode tabs */}
        <View style={styles.modeTabs}>
          <ModeTab label="📖 Overview" active={mode === 'overview'} onPress={() => switchMode('overview')} />
          <ModeTab label="🎯 Step Mode" active={mode === 'stepMode'} onPress={() => switchMode('stepMode')} />
          <ModeTab label="🔑 Signals" active={mode === 'signals'} onPress={() => switchMode('signals')} />
        </View>

        {mode === 'overview' && <OverviewMode onStart={() => switchMode('stepMode')} />}
        {mode === 'stepMode' && (
          <StepMode
            currentStep={currentStep}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
            onNext={() => {
              setSelectedOption(null);
              setCurrentStep(s => Math.min(s + 1, patternSkillSteps.length - 1));
            }}
            onPrev={() => {
              setSelectedOption(null);
              setCurrentStep(s => Math.max(s - 1, 0));
            }}
          />
        )}
        {mode === 'signals' && <SignalsMode />}
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const bg = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    bg.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: bg.value === 1 ? colors.primary + '22' : 'transparent',
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
    >
      <Animated.View style={[styles.modeTab, active && styles.modeTabActive, style]}>
        <Text style={[styles.modeTabText, active && { color: colors.primary }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function OverviewMode({ onStart }: { onStart: () => void }) {
  const steps = [
    { icon: '1️⃣', text: 'What are you given? (Array/Tree/Graph)' },
    { icon: '2️⃣', text: 'What are you asked? (Find/Count/Optimize)' },
    { icon: '3️⃣', text: 'What constraint is screaming? (n ≤ ?)' },
    { icon: '4️⃣', text: 'Look for unnatural words (contiguous, kth, median)' },
    { icon: '5️⃣', text: 'Lock the pattern before coding' },
  ];

  return (
    <View>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>The 5-Step Framework</Text>
        <Text style={styles.overviewSub}>Apply these 5 questions to any LeetCode problem</Text>
        {steps.map((s, i) => (
          <OverviewStep key={i} step={s} index={i} />
        ))}
      </View>

      <PulseButton onPress={onStart} label="🎯 Practice Step by Step" color={colors.primary} />
    </View>
  );
}

function OverviewStep({ step, index }: { step: { icon: string; text: string }; index: number }) {
  const opacity = useSharedValue(0);
  const x = useSharedValue(-20);
  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      x.value = withSpring(0, { damping: 18 });
    }, 200 + index * 100);
    return () => clearTimeout(t);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateX: x.value }] }));

  return (
    <Animated.View style={[styles.overviewStep, style]}>
      <Text style={styles.overviewStepIcon}>{step.icon}</Text>
      <Text style={styles.overviewStepText}>{step.text}</Text>
    </Animated.View>
  );
}

function StepMode({ currentStep, selectedOption, onSelectOption, onNext, onPrev }: {
  currentStep: number;
  selectedOption: number | null;
  onSelectOption: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const step = patternSkillSteps[currentStep];
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withTiming(0, { duration: 100 }, () => {
      contentY.value = 15;
      contentOpacity.value = withTiming(1, { duration: 300 });
      contentY.value = withSpring(0, { damping: 18 });
    });
  }, [currentStep]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const progress = (currentStep + 1) / patternSkillSteps.length;
  const progressAnim = useSharedValue(0);
  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 400, easing: Easing.out(Easing.cubic) });
  }, [progress]);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View>
      {/* Progress */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
      <Text style={styles.progressLabel}>Step {currentStep + 1} of {patternSkillSteps.length}</Text>

      <Animated.View style={contentStyle}>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
        </View>

        {/* Options */}
        {step.options.map((opt, i) => (
          <OptionCard
            key={i}
            option={opt}
            index={i}
            selected={selectedOption === i}
            onPress={() => onSelectOption(i)}
          />
        ))}
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <Pressable
          style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
          onPress={onPrev}
          disabled={currentStep === 0}
        >
          <Text style={styles.navBtnText}>← Back</Text>
        </Pressable>
        <Pressable
          style={[styles.navBtn, styles.navBtnPrimary]}
          onPress={onNext}
          disabled={currentStep === patternSkillSteps.length - 1}
        >
          <Text style={styles.navBtnPrimaryText}>
            {currentStep === patternSkillSteps.length - 1 ? '✓ Done' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function OptionCard({ option, index, selected, onPress }: {
  option: { label: string; patterns: string[] };
  index: number;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const selScale = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSpring(1, { damping: 15 });
    }, index * 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (selected) {
      selScale.value = withSequence(
        withSpring(0.97, { damping: 10 }),
        withSpring(1.02, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
    }
  }, [selected]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * selScale.value }],
    borderColor: selected ? colors.primary : colors.border,
    backgroundColor: selected ? colors.primary + '18' : colors.card,
  }));

  return (
    <Animated.View style={[styles.optionCard, cardStyle]}>
      <Pressable onPress={onPress} style={styles.optionPressable}>
        <View style={styles.optionTop}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.patternsRow}>
          {option.patterns.map((p, pi) => (
            <View key={pi} style={[styles.patternPill, selected && styles.patternPillSelected]}>
              <Text style={[styles.patternPillText, selected && { color: colors.primary }]}>{p}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function SignalsMode() {
  return (
    <View>
      <View style={styles.signalsHeader}>
        <Text style={styles.signalsTitle}>🔑 Keyword Signals</Text>
        <Text style={styles.signalsSub}>Spot these words → know the pattern immediately</Text>
      </View>
      {patternSignals.map((signal, i) => (
        <SignalCard key={i} signal={signal} index={i} />
      ))}
    </View>
  );
}

function SignalCard({ signal, index }: { signal: typeof patternSignals[0]; index: number }) {
  const opacity = useSharedValue(0);
  const x = useSharedValue(30);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      x.value = withSpring(0, { damping: 18 });
    }, index * 60);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.signalCard, { borderLeftColor: signal.color }, style]}>
      <View style={styles.signalLeft}>
        <Text style={styles.signalKeyword}>"{signal.keyword}"</Text>
      </View>
      <Text style={styles.signalArrow}>→</Text>
      <View style={[styles.signalPattern, { backgroundColor: signal.color + '22', borderColor: signal.color + '44' }]}>
        <Text style={[styles.signalPatternText, { color: signal.color }]}>{signal.pattern}</Text>
      </View>
    </Animated.View>
  );
}

function PulseButton({ onPress, label, color }: { onPress: () => void; label: string; color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withDelay(1500, withSpring(1.03, { damping: 8 })),
        withSpring(1, { damping: 12 })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1.03, { damping: 15 }); }}
        style={[styles.pulseBtn, { backgroundColor: color }]}
      >
        <Text style={styles.pulseBtnText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', paddingVertical: spacing.lg },
  timer: { fontSize: 36, marginBottom: spacing.xs },
  headerTitle: { ...typography.h2, color: colors.text, textAlign: 'center' },
  headerSub: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  modeTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeTabActive: { borderColor: colors.primary + '66' },
  modeTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  overviewCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  overviewTitle: { ...typography.h3, color: colors.text, marginBottom: 4 },
  overviewSub: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },
  overviewStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: spacing.xs + 2,
  },
  overviewStepIcon: { fontSize: 20 },
  overviewStepText: { ...typography.body, color: colors.textSecondary, flex: 1 },
  pulseBtn: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pulseBtnText: { ...typography.h4, color: '#fff', fontWeight: '700' },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  progressLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  stepTitle: { ...typography.h3, color: colors.text },
  stepSubtitle: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4 },
  optionCard: {
    borderRadius: borderRadius.md,
    marginVertical: 5,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  optionPressable: { padding: spacing.sm + 2 },
  optionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  optionLabel: { ...typography.body, color: colors.text, fontWeight: '500', flex: 1 },
  checkmark: { ...typography.h4, color: colors.primary },
  patternsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  patternPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  patternPillSelected: { backgroundColor: colors.primary + '22' },
  patternPillText: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, gap: 12 },
  navBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnPrimary: { backgroundColor: colors.primary },
  navBtnText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  navBtnPrimaryText: { ...typography.body, color: '#fff', fontWeight: '700' },
  signalsHeader: { marginBottom: spacing.md },
  signalsTitle: { ...typography.h3, color: colors.text },
  signalsSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4 },
  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    marginVertical: 4,
    borderLeftWidth: 3,
    gap: 10,
    flexWrap: 'wrap',
  },
  signalLeft: { flex: 1, minWidth: 100 },
  signalKeyword: { ...typography.body, color: colors.text, fontWeight: '600', fontStyle: 'italic' },
  signalArrow: { ...typography.h4, color: colors.textMuted },
  signalPattern: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  signalPatternText: { ...typography.bodySmall, fontWeight: '700' },
});
