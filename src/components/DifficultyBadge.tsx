import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography, borderRadius } from '../theme';
import { Difficulty } from '../data/dsaProblems';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: colors.success,
  Medium: colors.warning,
  Hard: colors.error,
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const color = DIFFICULTY_COLORS[difficulty];
  return (
    <Text style={[styles.badge, { color, backgroundColor: color + '22', borderColor: color + '44' }]}>
      {difficulty}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    ...typography.caption,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
