export interface PatternSignal {
  keyword: string;
  pattern: string;
  color: string;
}

export interface ConstraintHint {
  constraint: string;
  complexity: string;
  patterns: string[];
}

export const patternSkillSteps = [
  {
    id: 1,
    title: 'What are you given?',
    subtitle: 'Input type kills 50% of options',
    options: [
      { label: 'Array / String', patterns: ['Sliding Window', 'Two Pointers', 'Hashing', 'Binary Search'] },
      { label: 'Tree / Graph', patterns: ['DFS', 'BFS', 'DP on Trees'] },
      { label: 'Linked List', patterns: ['Two Pointers', 'Fast/Slow Pointers', 'Reverse'] },
      { label: 'Numbers', patterns: ['Math', 'Bit Manipulation', 'Binary Search on Answer'] },
    ],
  },
  {
    id: 2,
    title: 'What are you asked to do?',
    subtitle: 'The verb narrows the pattern family',
    options: [
      { label: 'Find / Search', patterns: ['Binary Search', 'BFS', 'DFS', 'Two Pointers'] },
      { label: 'Count / Ways', patterns: ['DP', 'Combinatorics', 'Hashing'] },
      { label: 'Optimize / Min-Max', patterns: ['Greedy', 'Heap', 'Binary Search on Answer', 'DP'] },
      { label: 'Generate / All', patterns: ['Backtracking', 'DFS', 'DP'] },
    ],
  },
  {
    id: 3,
    title: 'What constraint is screaming?',
    subtitle: 'n value tells you the required time complexity',
    options: [
      { label: 'n ≤ 20', patterns: ['Brute Force', 'Backtracking', 'Bitmask DP'] },
      { label: 'n ≤ 1,000', patterns: ['O(n²) DP', 'Sorting + Linear'] },
      { label: 'n ≤ 100,000', patterns: ['O(n log n)', 'Heap', 'Segment Tree', 'Binary Search'] },
      { label: 'n ≤ 10,000,000', patterns: ['O(n) only', 'Hashing', 'Two Pointers'] },
    ],
  },
  {
    id: 4,
    title: 'Look for unnatural words',
    subtitle: 'Problem keywords map directly to patterns',
    options: [
      { label: '"contiguous" / "subarray"', patterns: ['Sliding Window', 'Prefix Sum'] },
      { label: '"shortest" / "minimum steps"', patterns: ['BFS'] },
      { label: '"kth" / "median"', patterns: ['Heap', 'Binary Search'] },
      { label: '"all ways" / "all paths"', patterns: ['DP', 'Backtracking'] },
    ],
  },
  {
    id: 5,
    title: 'Lock the pattern before coding',
    subtitle: 'If debating 3+ approaches, re-read the problem',
    options: [
      { label: 'Still unsure?', patterns: ['Re-read: what\'s the UNIQUE constraint?'] },
      { label: 'Multiple queries?', patterns: ['Preprocessing', 'Segment Tree', 'Sparse Table'] },
      { label: 'Sorted input?', patterns: ['Binary Search', 'Two Pointers'] },
      { label: 'Intervals?', patterns: ['Sort by Start/End', 'Merge', 'Heap for active'] },
    ],
  },
];

export const patternSignals: PatternSignal[] = [
  { keyword: 'contiguous', pattern: 'Sliding Window', color: '#FF6B6B' },
  { keyword: 'subarray sum', pattern: 'Prefix Sum + HashMap', color: '#4ECDC4' },
  { keyword: 'shortest path', pattern: 'BFS (unweighted)', color: '#96CEB4' },
  { keyword: 'kth largest', pattern: 'Min-Heap size K', color: '#FF8C00' },
  { keyword: 'median', pattern: 'Two Heaps', color: '#DDA0DD' },
  { keyword: 'anagram / permutation', pattern: 'Sliding Window + HashMap', color: '#45B7D1' },
  { keyword: 'all possible ways', pattern: 'Backtracking / DP', color: '#FFEAA7' },
  { keyword: 'intervals', pattern: 'Sort + Merge / Heap', color: '#F0E68C' },
  { keyword: 'next greater element', pattern: 'Monotonic Stack', color: '#A8D8EA' },
  { keyword: 'duplicates allowed?', pattern: 'HashSet for seen tracking', color: '#FFB347' },
  { keyword: 'matrix / grid', pattern: 'BFS / DFS', color: '#B5EAD7' },
  { keyword: 'target sum', pattern: 'Two Sum variant / DP', color: '#C7CEEA' },
];
