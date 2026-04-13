/**
 * AlgorithmPlayer
 *
 * Shows physical element animations — elements actually MOVE on screen
 * (swap positions, pointers slide, stack items push/pop).
 * NOT a step-explanation page — purely visual algorithmic motion.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  AlgorithmAnimation,
  AlgorithmFrame,
  ArrayElement,
  ArrayFrame,
  ArrayPointer,
  ElementStatus,
  HashEntry,
  HashMapFrame,
  ListNode,
  ListPointerAnim,
  PointerListFrame,
  StackFrame,
  StackItem,
  TwoRowFrame,
} from '../data/algorithmFrames';
import { borderRadius, colors, spacing, typography } from '../theme';

// ─── Layout constants ─────────────────────────────────────────────────────────
const CELL_W   = 52;
const CELL_H   = 52;
const CELL_GAP = 6;
const CELL_STEP = CELL_W + CELL_GAP;

// Node sizing for linked list
const NODE_W   = 56;
const NODE_H   = 48;
const NODE_GAP = 14;
const NODE_STEP = NODE_W + NODE_GAP;

const AUTO_PLAY_MS = 1200;

// ─── Status → color palette ──────────────────────────────────────────────────
const STATUS_COLORS: Record<ElementStatus, { bg: string; border: string; text: string }> = {
  default:   { bg: colors.surface,   border: colors.border,  text: colors.textSecondary },
  active:    { bg: '#6C63FF22',      border: '#6C63FF',      text: '#A89FFF' },
  comparing: { bg: '#FF8C0022',      border: '#FF8C00',      text: '#FFB347' },
  swapping:  { bg: '#FF6B6B22',      border: '#FF6B6B',      text: '#FF8E8E' },
  selected:  { bg: '#43E97B22',      border: '#43E97B',      text: '#43E97B' },
  eliminated:{ bg: '#1C1C2E',        border: '#2D2D40',      text: '#444466' },
  pivot:     { bg: '#FF658422',      border: '#FF6584',      text: '#FF8DA0' },
  result:    { bg: '#43E97B33',      border: '#43E97B',      text: '#6EFFA8' },
  highlight: { bg: '#45B7D122',      border: '#45B7D1',      text: '#6DCFE3' },
  match:     { bg: '#FFD70022',      border: '#FFD700',      text: '#FFE566' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface AlgorithmPlayerProps {
  animation: AlgorithmAnimation;
  accentColor: string;
}

export function AlgorithmPlayer({ animation, accentColor }: AlgorithmPlayerProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef  = useRef(frameIdx);
  useEffect(() => { idxRef.current = frameIdx; }, [frameIdx]);

  // progress bar
  const progressWidth = useSharedValue(0);
  useEffect(() => {
    const pct = animation.frames.length > 1
      ? (frameIdx / (animation.frames.length - 1)) * 100
      : 100;
    progressWidth.value = withTiming(pct, { duration: 400, easing: Easing.out(Easing.cubic) });
  }, [frameIdx, animation.frames.length]);

  // operation label fade
  const opOpacity = useSharedValue(1);

  const goTo = (idx: number) => {
    opOpacity.value = withTiming(0, { duration: 100 }, () => {
      opOpacity.value = withTiming(1, { duration: 200 });
    });
    setFrameIdx(idx);
  };

  // Auto-play
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        const next = idxRef.current + 1;
        if (next >= animation.frames.length) {
          setPlaying(false);
        } else {
          goTo(next);
        }
      }, AUTO_PLAY_MS);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [playing, animation.frames.length]);

  // Reset when animation changes
  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [animation.problemId]);

  const handlePlayPause = () => {
    if (frameIdx === animation.frames.length - 1) {
      setFrameIdx(0);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const opStyle = useAnimatedStyle(() => ({
    opacity: opOpacity.value,
  }));

  const frame     = animation.frames[frameIdx];
  const prevFrame = frameIdx > 0 ? animation.frames[frameIdx - 1] : undefined;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: accentColor }]}>▶ Algorithm Visualizer</Text>
        <Text style={styles.subtitle}>{animation.description}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { backgroundColor: accentColor }, progressStyle]} />
      </View>

      {/* Step dots */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dotsRow}
      >
        {animation.frames.map((_, i) => (
          <Pressable key={i} onPress={() => { setPlaying(false); goTo(i); }}>
            <View style={[
              styles.dot,
              { backgroundColor: i < frameIdx ? accentColor : i === frameIdx ? accentColor : colors.border },
              i === frameIdx && styles.dotActive,
            ]}>
              <Text style={[styles.dotNum, { color: i <= frameIdx ? '#000' : colors.textMuted }]}>
                {i + 1}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Operation label */}
      <Animated.View style={[styles.opBadge, { borderColor: accentColor + '55' }, opStyle]}>
        <Text style={[styles.opText, { color: accentColor }]}>{frame.operation}</Text>
        {frame.note && (
          <Text style={styles.noteText}>{frame.note}</Text>
        )}
      </Animated.View>

      {/* Frame visualizer */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.vizScroll}
      >
        <FrameView frame={frame} prevFrame={prevFrame} frameIdx={frameIdx} accentColor={accentColor} />
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.ctrlBtn, frameIdx === 0 && styles.ctrlBtnDisabled]}
          onPress={() => { setPlaying(false); goTo(Math.max(0, frameIdx - 1)); }}
          disabled={frameIdx === 0}
        >
          <Text style={styles.ctrlText}>◀ Back</Text>
        </Pressable>

        <Pressable
          style={[styles.playBtn, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}
          onPress={handlePlayPause}
        >
          <Text style={[styles.playText, { color: accentColor }]}>
            {playing ? '⏸ Pause' : frameIdx === animation.frames.length - 1 ? '↺ Restart' : '▶ Play'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.ctrlBtn, { backgroundColor: accentColor + '22' }, frameIdx === animation.frames.length - 1 && styles.ctrlBtnDisabled]}
          onPress={() => { goTo(Math.min(animation.frames.length - 1, frameIdx + 1)); }}
          disabled={frameIdx === animation.frames.length - 1}
        >
          <Text style={[styles.ctrlText, { color: accentColor }]}>
            {frameIdx === animation.frames.length - 1 ? 'Done ✓' : 'Next ▶'}
          </Text>
        </Pressable>
      </View>

      {/* Frame counter */}
      <Text style={styles.counter}>
        {frameIdx + 1} / {animation.frames.length}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Frame dispatcher
// ─────────────────────────────────────────────────────────────────────────────

function FrameView({ frame, prevFrame, frameIdx, accentColor }: {
  frame: AlgorithmFrame;
  prevFrame?: AlgorithmFrame;
  frameIdx: number;
  accentColor: string;
}) {
  if (frame.type === 'array') {
    return (
      <ArrayFrameView
        frame={frame}
        prevFrame={prevFrame?.type === 'array' ? prevFrame : undefined}
        frameIdx={frameIdx}
        accentColor={accentColor}
      />
    );
  }
  if (frame.type === 'stack') {
    return <StackFrameView frame={frame} prevFrame={prevFrame?.type === 'stack' ? prevFrame : undefined} accentColor={accentColor} />;
  }
  if (frame.type === 'two-row') {
    return (
      <TwoRowFrameView
        frame={frame}
        prevFrame={prevFrame?.type === 'two-row' ? prevFrame : undefined}
        frameIdx={frameIdx}
        accentColor={accentColor}
      />
    );
  }
  if (frame.type === 'hashmap') {
    return (
      <HashMapFrameView
        frame={frame}
        prevFrame={prevFrame?.type === 'hashmap' ? prevFrame : undefined}
        frameIdx={frameIdx}
        accentColor={accentColor}
      />
    );
  }
  if (frame.type === 'pointer-list') {
    return (
      <PointerListFrameView
        frame={frame}
        prevFrame={prevFrame?.type === 'pointer-list' ? prevFrame : undefined}
        accentColor={accentColor}
      />
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Array frame — elements physically move on swap
// ─────────────────────────────────────────────────────────────────────────────

function ArrayFrameView({
  frame, prevFrame, frameIdx, accentColor,
}: {
  frame: ArrayFrame;
  prevFrame?: ArrayFrame;
  frameIdx: number;
  accentColor: string;
}) {
  // Build index map: for each element ID, what index is it at in this frame?
  const idToIdx = new Map<number, number>();
  frame.elements.forEach((el, i) => idToIdx.set(el.id, i));

  // For prev frame: what index was this element at?
  const prevIdToIdx = new Map<number, number>();
  if (prevFrame) {
    prevFrame.elements.forEach((el, i) => prevIdToIdx.set(el.id, i));
  }

  // Build pointer lookup: pointerMap[elementId] = pointer label
  const ptrByElementId = new Map<number, ArrayPointer>();
  frame.pointers?.forEach(p => ptrByElementId.set(p.elementId, p));

  const totalW = frame.elements.length * CELL_STEP - CELL_GAP + 4;

  return (
    <View style={{ width: totalW, minWidth: 120 }}>
      {/* Cells row */}
      <View style={[styles.arrayRow, { height: CELL_H }]}>
        {frame.elements.map((el) => {
          const toIdx   = idToIdx.get(el.id) ?? 0;
          const fromIdx = prevIdToIdx.has(el.id) ? prevIdToIdx.get(el.id)! : toIdx;
          return (
            <AnimatedCell
              key={el.id}
              value={el.value}
              status={el.status}
              targetX={toIdx * CELL_STEP}
              fromX={fromIdx * CELL_STEP}
              frameIdx={frameIdx}
            />
          );
        })}
      </View>

      {/* Index row */}
      <View style={styles.indexRow}>
        {frame.elements.map((_, i) => (
          <View key={i} style={{ width: CELL_W, alignItems: 'center', marginRight: CELL_GAP }}>
            <Text style={styles.indexLabel}>{i}</Text>
          </View>
        ))}
      </View>

      {/* Pointer row */}
      {frame.pointers && frame.pointers.length > 0 && (
        <View style={[styles.pointerTrack, { width: totalW }]}>
          {frame.pointers.map(ptr => {
            const toIdx = idToIdx.get(ptr.elementId) ?? 0;
            const prevPtr = prevFrame?.pointers?.find(p => p.label === ptr.label);
            const fromIdx = prevPtr
              ? (prevIdToIdx.get(prevPtr.elementId) ?? toIdx)
              : toIdx;
            return (
              <SlidingLabel
                key={ptr.label}
                label={ptr.label}
                color={ptr.color}
                fromX={fromIdx * CELL_STEP + CELL_W / 2 - 16}
                toX={toIdx * CELL_STEP + CELL_W / 2 - 16}
                frameIdx={frameIdx}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single animated cell
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedCell({
  value, status, targetX, fromX, frameIdx,
}: {
  value: string | number;
  status: ElementStatus;
  targetX: number;
  fromX: number;
  frameIdx: number;
}) {
  const c = STATUS_COLORS[status];
  const x = useSharedValue(fromX);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Spring to new position
    x.value = withSpring(targetX, { damping: 14, stiffness: 180, mass: 0.8 });

    // Pulse on active/comparing/swapping
    if (status === 'active' || status === 'comparing' || status === 'swapping') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1.0,  { damping: 14 }),
      );
    } else if (status === 'result') {
      scale.value = withSequence(
        withSpring(1.2, { damping: 6 }),
        withSpring(1.0, { damping: 16 }),
      );
    } else {
      scale.value = withSpring(1, { damping: 14 });
    }
  }, [targetX, status, frameIdx]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    transform: [{ translateX: x.value }, { scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.cell, style]}>
      <Text style={[styles.cellText, { color: c.text }]} numberOfLines={1}>
        {value}
      </Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sliding pointer label (above or below a cell)
// ─────────────────────────────────────────────────────────────────────────────

function SlidingLabel({
  label, color, fromX, toX, frameIdx,
}: {
  label: string; color: string; fromX: number; toX: number; frameIdx: number;
}) {
  const x = useSharedValue(fromX);

  useEffect(() => {
    x.value = withSpring(toX, { damping: 16, stiffness: 200, mass: 0.7 });
  }, [toX, frameIdx]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.pointerLabel, style]}>
      <Text style={[styles.pointerCaret, { color }]}>▲</Text>
      <Text style={[styles.pointerText, { color }]}>{label}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stack frame — items appear/disappear with spring
// ─────────────────────────────────────────────────────────────────────────────

function StackFrameView({ frame, prevFrame, accentColor }: {
  frame: StackFrame;
  prevFrame?: StackFrame;
  accentColor: string;
}) {
  // Determine which items are new (were not in prev frame)
  const prevIds = new Set(prevFrame?.items.map(i => i.id) ?? []);

  return (
    <View style={styles.stackContainer}>
      {/* Current element being processed */}
      {frame.current !== undefined && (
        <View style={styles.currentRow}>
          <Text style={styles.currentLabel}>Processing: </Text>
          <CurrentChar value={frame.current} status={frame.currentStatus ?? 'active'} />
        </View>
      )}

      {/* Stack (displayed top-first for visual clarity) */}
      <View style={styles.stackBox}>
        <Text style={styles.stackBoxLabel}>STACK</Text>
        {frame.items.length === 0 && (
          <Text style={styles.emptyStack}>( empty )</Text>
        )}
        {[...frame.items].reverse().map((item) => (
          <StackItemView
            key={item.id}
            item={item}
            isNew={!prevIds.has(item.id)}
            accentColor={accentColor}
          />
        ))}
      </View>
    </View>
  );
}

function CurrentChar({ value, status }: { value: string | number; status: ElementStatus }) {
  const c = STATUS_COLORS[status];
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 260 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [value]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.cell, style]}>
      <Text style={[styles.cellText, { color: c.text }]}>{value}</Text>
    </Animated.View>
  );
}

function StackItemView({ item, isNew, accentColor }: {
  item: StackItem;
  isNew: boolean;
  accentColor: string;
}) {
  const c = STATUS_COLORS[item.status];
  const translateY = useSharedValue(isNew ? -20 : 0);
  const opacity    = useSharedValue(isNew ? 0  : 1);
  const scale      = useSharedValue(isNew ? 0.8 : 1);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    opacity.value    = withTiming(1, { duration: 250 });
    scale.value      = withSpring(1, { damping: 12 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.stackItem, style]}>
      <Text style={[styles.stackItemText, { color: c.text }]}>{item.value}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Two-row frame (array + result row, or array + stack indices)
// ─────────────────────────────────────────────────────────────────────────────

function TwoRowFrameView({ frame, prevFrame, frameIdx, accentColor }: {
  frame: TwoRowFrame;
  prevFrame?: TwoRowFrame;
  frameIdx: number;
  accentColor: string;
}) {
  const topIdToIdx  = new Map<number, number>();
  frame.topElements.forEach((el, i) => topIdToIdx.set(el.id, i));
  const prevTopIdToIdx = new Map<number, number>();
  prevFrame?.topElements.forEach((el, i) => prevTopIdToIdx.set(el.id, i));

  const botIdToIdx  = new Map<number, number>();
  frame.bottomElements.forEach((el, i) => botIdToIdx.set(el.id, i));
  const prevBotIdToIdx = new Map<number, number>();
  prevFrame?.bottomElements.forEach((el, i) => prevBotIdToIdx.set(el.id, i));

  const topW = frame.topElements.length * CELL_STEP - CELL_GAP + 4;
  const botW = frame.bottomElements.length * CELL_STEP - CELL_GAP + 4;
  const totalW = Math.max(topW, botW, 120);

  return (
    <View style={{ width: totalW }}>
      {/* Top row */}
      <Text style={styles.rowLabel}>{frame.topLabel}</Text>
      <View style={[styles.arrayRow, { height: CELL_H, width: topW }]}>
        {frame.topElements.map((el) => {
          const toIdx   = topIdToIdx.get(el.id) ?? 0;
          const fromIdx = prevTopIdToIdx.has(el.id) ? prevTopIdToIdx.get(el.id)! : toIdx;
          return (
            <AnimatedCell
              key={el.id}
              value={el.value}
              status={el.status}
              targetX={toIdx * CELL_STEP}
              fromX={fromIdx * CELL_STEP}
              frameIdx={frameIdx}
            />
          );
        })}
      </View>
      {frame.topPointers && frame.topPointers.length > 0 && (
        <View style={[styles.pointerTrack, { width: topW }]}>
          {frame.topPointers.map(ptr => {
            const toIdx = topIdToIdx.get(ptr.elementId) ?? 0;
            const prevPtr = prevFrame?.topPointers?.find(p => p.label === ptr.label);
            const fromIdx = prevPtr
              ? (prevTopIdToIdx.get(prevPtr.elementId) ?? toIdx)
              : toIdx;
            return (
              <SlidingLabel
                key={ptr.label}
                label={ptr.label}
                color={ptr.color}
                fromX={fromIdx * CELL_STEP + CELL_W / 2 - 16}
                toX={toIdx * CELL_STEP + CELL_W / 2 - 16}
                frameIdx={frameIdx}
              />
            );
          })}
        </View>
      )}

      <View style={styles.rowDivider} />

      {/* Bottom row */}
      <Text style={styles.rowLabel}>{frame.bottomLabel}</Text>
      <View style={[styles.arrayRow, { height: CELL_H, width: botW }]}>
        {frame.bottomElements.map((el) => {
          const toIdx   = botIdToIdx.get(el.id) ?? 0;
          const fromIdx = prevBotIdToIdx.has(el.id) ? prevBotIdToIdx.get(el.id)! : toIdx;
          return (
            <AnimatedCell
              key={el.id}
              value={el.value}
              status={el.status}
              targetX={toIdx * CELL_STEP}
              fromX={fromIdx * CELL_STEP}
              frameIdx={frameIdx}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hash-map frame
// ─────────────────────────────────────────────────────────────────────────────

function HashMapFrameView({ frame, prevFrame, frameIdx, accentColor }: {
  frame: HashMapFrame;
  prevFrame?: HashMapFrame;
  frameIdx: number;
  accentColor: string;
}) {
  const arrIdToIdx = new Map<number, number>();
  frame.array.forEach((el, i) => arrIdToIdx.set(el.id, i));
  const prevArrIdToIdx = new Map<number, number>();
  prevFrame?.array.forEach((el, i) => prevArrIdToIdx.set(el.id, i));

  const prevMapIds = new Set(prevFrame?.map.map(e => e.id) ?? []);
  const totalW = Math.max(frame.array.length * CELL_STEP - CELL_GAP + 4, 200);

  return (
    <View style={{ width: totalW }}>
      {/* Array row */}
      <Text style={styles.rowLabel}>array</Text>
      <View style={[styles.arrayRow, { height: CELL_H }]}>
        {frame.array.map((el) => {
          const toIdx   = arrIdToIdx.get(el.id) ?? 0;
          const fromIdx = prevArrIdToIdx.has(el.id) ? prevArrIdToIdx.get(el.id)! : toIdx;
          return (
            <AnimatedCell
              key={el.id}
              value={el.value}
              status={el.status}
              targetX={toIdx * CELL_STEP}
              fromX={fromIdx * CELL_STEP}
              frameIdx={frameIdx}
            />
          );
        })}
      </View>
      {/* Array pointer */}
      {frame.arrayPointer !== undefined && (
        <View style={[styles.pointerTrack, { width: totalW }]}>
          <SlidingLabel
            label="i"
            color={accentColor}
            fromX={(prevFrame?.arrayPointer ?? frame.arrayPointer) * CELL_STEP + CELL_W / 2 - 16}
            toX={frame.arrayPointer * CELL_STEP + CELL_W / 2 - 16}
            frameIdx={frameIdx}
          />
        </View>
      )}

      <View style={styles.rowDivider} />

      {/* HashMap entries */}
      <Text style={styles.rowLabel}>hashmap</Text>
      <View style={styles.hashGrid}>
        {frame.map.length === 0 && (
          <Text style={styles.emptyStack}>{ '{ }' }</Text>
        )}
        {frame.map.map((entry) => (
          <HashEntryView
            key={entry.id}
            entry={entry}
            isNew={!prevMapIds.has(entry.id)}
          />
        ))}
      </View>
    </View>
  );
}

function HashEntryView({ entry, isNew }: { entry: HashEntry; isNew: boolean }) {
  const c = STATUS_COLORS[entry.status];
  const scale   = useSharedValue(isNew ? 0.6 : 1);
  const opacity = useSharedValue(isNew ? 0 : 1);

  useEffect(() => {
    scale.value   = withSpring(1, { damping: 10, stiffness: 260 });
    opacity.value = withTiming(1, { duration: 220 });
  }, []);

  useEffect(() => {
    if (!isNew && (entry.status === 'active' || entry.status === 'match' || entry.status === 'result')) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1,   { damping: 14 }),
      );
    }
  }, [entry.status]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.hashEntry, style]}>
      <Text style={[styles.hashKey, { color: c.text }]}>{entry.key}</Text>
      <Text style={styles.hashArrow}>→</Text>
      <Text style={[styles.hashVal, { color: c.text }]}>{entry.value}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pointer-list frame — linked list with sliding pointers
// ─────────────────────────────────────────────────────────────────────────────

function PointerListFrameView({ frame, prevFrame, accentColor }: {
  frame: PointerListFrame;
  prevFrame?: PointerListFrame;
  accentColor: string;
}) {
  const nodeIdToIdx = new Map<number, number>();
  frame.nodes.forEach((n, i) => nodeIdToIdx.set(n.id, i));

  const prevNodeIdToIdx = new Map<number, number>();
  prevFrame?.nodes.forEach((n, i) => prevNodeIdToIdx.set(n.id, i));

  const totalW = frame.nodes.length * NODE_STEP - NODE_GAP + 4;

  return (
    <View style={{ width: totalW }}>
      {/* Nodes row */}
      <View style={[styles.linkedRow, { width: totalW }]}>
        {frame.nodes.map((node, ni) => {
          const toIdx   = nodeIdToIdx.get(node.id) ?? ni;
          const fromIdx = prevNodeIdToIdx.has(node.id) ? prevNodeIdToIdx.get(node.id)! : toIdx;
          return (
            <React.Fragment key={node.id}>
              <AnimatedNode
                node={node}
                targetX={toIdx * NODE_STEP}
                fromX={fromIdx * NODE_STEP}
              />
              {ni < frame.nodes.length - 1 && (
                <View style={[styles.nodeArrow, { left: (ni + 1) * NODE_STEP - NODE_GAP }]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Pointer track */}
      <View style={[styles.listPointerTrack, { width: totalW }]}>
        {frame.pointers.map((ptr) => {
          const toIdx = nodeIdToIdx.get(ptr.nodeId) ?? 0;
          const prevPtr = prevFrame?.pointers.find(p => p.label === ptr.label);
          const fromIdx = prevPtr
            ? (prevNodeIdToIdx.get(prevPtr.nodeId) ?? toIdx)
            : toIdx;
          return (
            <SlidingListPointer
              key={ptr.label}
              pointer={ptr}
              fromX={fromIdx * NODE_STEP + NODE_W / 2 - 20}
              toX={toIdx * NODE_STEP + NODE_W / 2 - 20}
            />
          );
        })}
      </View>
    </View>
  );
}

function AnimatedNode({ node, targetX, fromX }: {
  node: ListNode;
  targetX: number;
  fromX: number;
}) {
  const c = STATUS_COLORS[node.status];
  const x = useSharedValue(fromX);
  const scale = useSharedValue(1);

  useEffect(() => {
    x.value = withSpring(targetX, { damping: 14, stiffness: 180 });
    if (node.status === 'active' || node.status === 'result') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(1.0,  { damping: 14 }),
      );
    } else {
      scale.value = withSpring(1, { damping: 14 });
    }
  }, [targetX, node.status]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    transform: [{ translateX: x.value }, { scale: scale.value }],
    backgroundColor: c.bg,
    borderColor: c.border,
  }));

  return (
    <Animated.View style={[styles.listNode, style]}>
      <Text style={[styles.nodeValue, { color: c.text }]}>{node.value}</Text>
    </Animated.View>
  );
}

function SlidingListPointer({ pointer, fromX, toX }: {
  pointer: ListPointerAnim;
  fromX: number;
  toX: number;
}) {
  const x = useSharedValue(fromX);

  useEffect(() => {
    x.value = withSpring(toX, { damping: 16, stiffness: 200, mass: 0.8 });
  }, [toX]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.listPointer, style]}>
      <Text style={[styles.listPointerCaret, { color: pointer.color }]}>▲</Text>
      <Text style={[styles.listPointerLabel, { color: pointer.color }]}>
        {pointer.emoji ?? ''}{pointer.label}
      </Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  header: { marginBottom: spacing.sm },
  title: { ...typography.h4, fontWeight: '800', letterSpacing: 0.3 },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 2 },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: { transform: [{ scale: 1.2 }] },
  dotNum: { fontSize: 11, fontWeight: '700' },

  opBadge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  opText: { ...typography.bodySmall, fontWeight: '700', lineHeight: 20 },
  noteText: { ...typography.caption, color: colors.textMuted, marginTop: 4, lineHeight: 18 },

  vizScroll: { paddingBottom: spacing.sm, minHeight: 120 },

  // ── Array layout ────────────────────────────────────────────────────────
  arrayRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    width: CELL_W,
    height: CELL_H,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: { ...typography.bodySmall, fontWeight: '700', fontSize: 13 },

  indexRow: {
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 2,
  },
  indexLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  pointerTrack: { height: 34, position: 'relative', overflow: 'visible' },
  pointerLabel: { position: 'absolute', alignItems: 'center', width: 32 },
  pointerCaret: { fontSize: 12, lineHeight: 14 },
  pointerText: { fontSize: 9, fontWeight: '800', lineHeight: 12, letterSpacing: 0.3 },

  rowLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  // ── Stack layout ────────────────────────────────────────────────────────
  stackContainer: { alignItems: 'flex-start', minWidth: 160 },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 8,
  },
  currentLabel: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  stackBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    alignItems: 'center',
    gap: 6,
  },
  stackBoxLabel: { ...typography.caption, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 },
  emptyStack: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', padding: 8 },
  stackItem: {
    width: 80,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackItemText: { ...typography.bodySmall, fontWeight: '700', fontSize: 15 },

  // ── HashMap layout ──────────────────────────────────────────────────────
  hashGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  hashEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    gap: 4,
  },
  hashKey: { ...typography.code, fontSize: 12, fontWeight: '700' },
  hashArrow: { color: colors.textMuted, fontSize: 11 },
  hashVal: { ...typography.code, fontSize: 11, color: colors.textSecondary },

  // ── Linked list layout ──────────────────────────────────────────────────
  linkedRow: {
    position: 'relative',
    height: NODE_H,
  },
  listNode: {
    width: NODE_W,
    height: NODE_H,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeArrow: {
    position: 'absolute',
    top: NODE_H / 2 - 1,
    width: NODE_GAP,
    height: 2,
    backgroundColor: colors.textMuted,
  },
  nodeValue: { ...typography.bodySmall, fontWeight: '700', fontSize: 14 },

  listPointerTrack: { height: 36, position: 'relative', overflow: 'visible', marginTop: 2 },
  listPointer: { position: 'absolute', width: 40, alignItems: 'center' },
  listPointerCaret: { fontSize: 13, lineHeight: 15 },
  listPointerLabel: { fontSize: 9, fontWeight: '800', lineHeight: 12, letterSpacing: 0.3 },

  // ── Controls ────────────────────────────────────────────────────────────
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 8,
  },
  ctrlBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  ctrlBtnDisabled: { opacity: 0.3 },
  ctrlText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  playBtn: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  playText: { ...typography.bodySmall, fontWeight: '800' },
  counter: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
});
