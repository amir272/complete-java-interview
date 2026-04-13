export const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  accent: '#43E97B',

  // Book-style dark — warm, easy on the eyes
  background: '#13121A',   // deep warm near-black
  surface: '#1A192A',      // slightly lifted surface
  card: '#1E1D2B',         // card background — readable dark
  cardAlt: '#262535',      // alternate card for contrast

  // Warm book typography — like cream paper in dark mode
  text: '#EDE9E1',          // warm off-white, not harsh pure white
  textSecondary: '#ADA495', // warm mid-tone — readable secondary
  textMuted: '#6E6A60',     // warm muted — hints and labels

  success: '#43E97B',
  warning: '#F6AD55',
  error: '#FC8181',
  border: '#2C2B3A',        // subtle warm border

  // DSA topic colors (unchanged)
  heap: '#FF6B6B',
  stack: '#4ECDC4',
  hash: '#45B7D1',
  queue: '#96CEB4',
  interval: '#FFEAA7',
  binary: '#DDA0DD',
  linked: '#F0E68C',
  java: '#FF8C00',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  h4: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 26 }, // generous line-height like a book
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: '400' as const },
  code: { fontSize: 13, fontFamily: 'monospace' as const, lineHeight: 22 },
};
