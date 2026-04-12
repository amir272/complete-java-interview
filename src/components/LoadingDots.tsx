import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme';

interface LoadingDotsProps {
  color?: string;
  size?: number;
}

export function LoadingDots({ color = colors.primary, size = 10 }: LoadingDotsProps) {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => <Dot key={i} color={color} size={size} delay={i * 150} />)}
    </View>
  );
}

function Dot({ color, size, delay }: { color: string; size: number; delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-size * 1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  dot: {},
});
