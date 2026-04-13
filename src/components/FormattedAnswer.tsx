import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment =
  | { type: 'definition'; term: string; body: string }
  | { type: 'bullet'; text: string }
  | { type: 'numbered'; num: number; text: string }
  | { type: 'paragraph'; text: string };

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Splits a line that contains multiple "term: explanation." patterns into
 * individual definition segments.
 * e.g. "final: keyword. finally: block. finalize(): deprecated."
 * → [{term:'final',body:'keyword'}, {term:'finally',body:'block'}, ...]
 */
function splitDefinitions(text: string): Segment[] {
  // Split on ". " that is followed by a term pattern (word(s) then colon)
  const parts = text.split(/\.\s+(?=[A-Za-z@][A-Za-z0-9().\s_@-]{0,35}:\s)/);
  return parts
    .map((part): Segment => {
      const m = part.match(/^([A-Za-z@][A-Za-z0-9().\s_@-]{0,35}):\s(.+)/s);
      if (m) {
        return { type: 'definition', term: m[1].trim(), body: m[2].trim() };
      }
      return { type: 'paragraph', text: part.trim() };
    })
    .filter(s => (s.type === 'paragraph' ? s.text.length > 0 : true));
}

/**
 * Parses a raw answer string into structured segments for rich rendering.
 * Handles:
 *  - Existing newlines (already structured text)
 *  - Definition lists: "term: body. term2: body2."
 *  - Bullet lists: "- item" or "• item"
 *  - Numbered lists: "1. item" or "1) item"
 *  - Plain paragraphs
 */
function parseAnswer(raw: string): Segment[] {
  const result: Segment[] = [];
  const lines = raw.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Bullet point — starts with -, •, or *
    if (/^[-•*]\s+/.test(trimmed)) {
      result.push({ type: 'bullet', text: trimmed.replace(/^[-•*]\s+/, '') });
      continue;
    }

    // Numbered list — "1. " or "1) "
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numMatch) {
      result.push({ type: 'numbered', num: parseInt(numMatch[1], 10), text: numMatch[2] });
      continue;
    }

    // Detect if this line contains MULTIPLE definition patterns
    // i.e. at least 2 occurrences of "word(s): " (either at start or after ". ")
    const termHits = [...trimmed.matchAll(/(?:^|\.\s+)([A-Za-z@][A-Za-z0-9().\s_@-]{0,35}):\s/g)];
    if (termHits.length >= 2) {
      result.push(...splitDefinitions(trimmed));
      continue;
    }

    // Single definition at line start
    const singleDef = trimmed.match(/^([A-Za-z@][A-Za-z0-9().\s_@-]{0,35}):\s(.+)/s);
    if (singleDef) {
      result.push({ type: 'definition', term: singleDef[1].trim(), body: singleDef[2].trim() });
      continue;
    }

    // Plain paragraph
    result.push({ type: 'paragraph', text: trimmed });
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FormattedAnswerProps {
  text: string;
  accentColor: string;
}

export function FormattedAnswer({ text, accentColor }: FormattedAnswerProps) {
  const segments = useMemo(() => parseAnswer(text), [text]);

  return (
    <View style={styles.container}>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'definition':
            return (
              <View key={i} style={styles.definitionItem}>
                <Text style={styles.definitionLine}>
                  <Text style={[styles.definitionTerm, { color: accentColor }]}>
                    {seg.term}
                  </Text>
                  <Text style={styles.definitionColon}>{':'}</Text>
                  <Text style={styles.definitionBody}>{' '}{seg.body}</Text>
                </Text>
              </View>
            );

          case 'bullet':
            return (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
                <Text style={styles.bulletText}>{seg.text}</Text>
              </View>
            );

          case 'numbered':
            return (
              <View key={i} style={styles.numberedRow}>
                <Text style={[styles.numberedNum, { color: accentColor }]}>{seg.num}.</Text>
                <Text style={styles.numberedText}>{seg.text}</Text>
              </View>
            );

          case 'paragraph':
          default:
            return (
              <Text key={i} style={styles.paragraph}>
                {seg.text}
              </Text>
            );
        }
      })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  // Definition items
  definitionItem: {
    paddingLeft: spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.08)',
  },
  definitionLine: {
    lineHeight: 26,
    flexShrink: 1,
  },
  definitionTerm: {
    ...typography.body,
    fontWeight: '700',
    fontSize: 14,
  },
  definitionColon: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
  },
  definitionBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    fontSize: 14,
  },

  // Bullet items
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingLeft: spacing.xs,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 10,
    flexShrink: 0,
  },
  bulletText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    flex: 1,
  },

  // Numbered items
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingLeft: spacing.xs,
  },
  numberedNum: {
    ...typography.body,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 26,
    minWidth: 20,
    flexShrink: 0,
  },
  numberedText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
    flex: 1,
  },

  // Plain paragraph
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
  },
});
