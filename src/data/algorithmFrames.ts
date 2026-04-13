// ─────────────────────────────────────────────────────────────────────────────
// Algorithm Animation Frames
//
// Each problem has a list of "frames" representing one atomic operation
// (compare, swap, push, pop, pointer move, etc.).
// The AlgorithmPlayer component renders these as physical element animations.
// ─────────────────────────────────────────────────────────────────────────────

export type ElementStatus =
  | 'default'
  | 'active'       // being touched/visited right now
  | 'comparing'    // being compared with another
  | 'swapping'     // physically moving
  | 'selected'     // in the result set / decided
  | 'eliminated'   // removed / skipped
  | 'pivot'        // pivot element
  | 'result'       // final answer element
  | 'highlight'    // secondary highlight
  | 'match';       // hash-match found

// ── Array frame ───────────────────────────────────────────────────────────────
export interface ArrayElement {
  /** Stable identity across frames — used to track cross-frame movement */
  id: number;
  value: string | number;
  status: ElementStatus;
}

export interface ArrayPointer {
  /** Points at the element with this id */
  elementId: number;
  label: string;
  color: string;
  position?: 'above' | 'below';
}

export interface ArrayFrame {
  type: 'array';
  elements: ArrayElement[];
  pointers?: ArrayPointer[];
  operation: string;
  /** Optional note displayed below */
  note?: string;
}

// ── Stack frame ───────────────────────────────────────────────────────────────
export interface StackItem {
  id: number;
  value: string | number;
  status: ElementStatus;
}

export interface StackFrame {
  type: 'stack';
  items: StackItem[];           // index 0 = bottom
  operation: string;
  note?: string;
  /** The current character / element being processed */
  current?: string | number;
  currentStatus?: ElementStatus;
}

// ── Two-row frame (array + stack, or array + result) ─────────────────────────
export interface TwoRowFrame {
  type: 'two-row';
  topLabel: string;
  topElements: ArrayElement[];
  bottomLabel: string;
  bottomElements: ArrayElement[];
  topPointers?: ArrayPointer[];
  operation: string;
  note?: string;
}

// ── Hash-map frame ────────────────────────────────────────────────────────────
export interface HashEntry {
  id: number;
  key: string;
  value: string | number;
  status: ElementStatus;
}

export interface HashMapFrame {
  type: 'hashmap';
  /** The input array being scanned */
  array: ArrayElement[];
  arrayPointer?: number;        // index of current element in array
  map: HashEntry[];
  operation: string;
  note?: string;
}

// ── Pointer-list frame (linked list) ─────────────────────────────────────────
export interface ListNode {
  id: number;
  value: string | number;
  status: ElementStatus;
}

export interface ListPointerAnim {
  nodeId: number;
  label: string;
  color: string;
  emoji?: string;
}

export interface PointerListFrame {
  type: 'pointer-list';
  nodes: ListNode[];
  pointers: ListPointerAnim[];
  operation: string;
  note?: string;
}

// ── Union ─────────────────────────────────────────────────────────────────────
export type AlgorithmFrame =
  | ArrayFrame
  | StackFrame
  | TwoRowFrame
  | HashMapFrame
  | PointerListFrame;

export interface AlgorithmAnimation {
  problemId: number;
  title: string;
  description: string;
  frames: AlgorithmFrame[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Problem Animations
// ─────────────────────────────────────────────────────────────────────────────

// ── 215. Kth Largest Element ──────────────────────────────────────────────────
// Use min-heap of size k=2. Animate elements entering/leaving heap array.
const kthLargest: AlgorithmAnimation = {
  problemId: 215,
  title: 'Kth Largest Element',
  description: 'Min-heap of size k=2 on [3,2,1,5,6,4]',
  frames: [
    {
      type: 'array',
      elements: [
        { id: 0, value: 3, status: 'default' },
        { id: 1, value: 2, status: 'default' },
        { id: 2, value: 1, status: 'default' },
        { id: 3, value: 5, status: 'default' },
        { id: 4, value: 6, status: 'default' },
        { id: 5, value: 4, status: 'default' },
      ],
      operation: 'Input array — find 2nd largest (k=2)',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 3, status: 'active' },
        { id: 1, value: 2, status: 'default' },
        { id: 2, value: 1, status: 'default' },
        { id: 3, value: 5, status: 'default' },
        { id: 4, value: 6, status: 'default' },
        { id: 5, value: 4, status: 'default' },
      ],
      pointers: [{ elementId: 0, label: 'i', color: '#6C63FF' }],
      operation: 'PUSH 3 → heap=[3]  (size < k)',
      note: 'Heap has room, always push when size < k',
    },
    {
      type: 'array',
      elements: [
        { id: 1, value: 2, status: 'active' },
        { id: 0, value: 3, status: 'selected' },
        { id: 2, value: 1, status: 'default' },
        { id: 3, value: 5, status: 'default' },
        { id: 4, value: 6, status: 'default' },
        { id: 5, value: 4, status: 'default' },
      ],
      pointers: [{ elementId: 2, label: 'i', color: '#6C63FF' }],
      operation: 'PUSH 2 → heap=[2,3]  (size < k)',
      note: '2 bubbles to root — min-heap keeps smallest on top',
    },
    {
      type: 'array',
      elements: [
        { id: 1, value: 2, status: 'selected' },
        { id: 0, value: 3, status: 'selected' },
        { id: 2, value: 1, status: 'active' },
        { id: 3, value: 5, status: 'default' },
        { id: 4, value: 6, status: 'default' },
        { id: 5, value: 4, status: 'default' },
      ],
      pointers: [{ elementId: 2, label: 'i', color: '#6C63FF' }],
      operation: 'SKIP 1 — 1 ≤ heap.min(2)',
      note: '1 is not bigger than our smallest; no point keeping it',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 3, status: 'selected' },
        { id: 3, value: 5, status: 'active' },
        { id: 2, value: 1, status: 'eliminated' },
        { id: 1, value: 2, status: 'eliminated' },
        { id: 4, value: 6, status: 'default' },
        { id: 5, value: 4, status: 'default' },
      ],
      pointers: [{ elementId: 3, label: 'i', color: '#6C63FF' }],
      operation: 'POP 2, PUSH 5 → heap=[3,5]',
      note: '5 > heap.min(2): evict 2, insert 5. Swap animates!',
    },
    {
      type: 'array',
      elements: [
        { id: 3, value: 5, status: 'selected' },
        { id: 4, value: 6, status: 'active' },
        { id: 2, value: 1, status: 'eliminated' },
        { id: 1, value: 2, status: 'eliminated' },
        { id: 0, value: 3, status: 'eliminated' },
        { id: 5, value: 4, status: 'default' },
      ],
      pointers: [{ elementId: 4, label: 'i', color: '#6C63FF' }],
      operation: 'POP 3, PUSH 6 → heap=[5,6]',
      note: '6 > heap.min(3): evict 3, insert 6',
    },
    {
      type: 'array',
      elements: [
        { id: 3, value: 5, status: 'selected' },
        { id: 4, value: 6, status: 'selected' },
        { id: 2, value: 1, status: 'eliminated' },
        { id: 1, value: 2, status: 'eliminated' },
        { id: 0, value: 3, status: 'eliminated' },
        { id: 5, value: 4, status: 'active' },
      ],
      pointers: [{ elementId: 5, label: 'i', color: '#6C63FF' }],
      operation: 'SKIP 4 — 4 ≤ heap.min(5)',
      note: '4 is not bigger than our floor; skip it',
    },
    {
      type: 'array',
      elements: [
        { id: 3, value: 5, status: 'result' },
        { id: 4, value: 6, status: 'selected' },
        { id: 2, value: 1, status: 'eliminated' },
        { id: 1, value: 2, status: 'eliminated' },
        { id: 0, value: 3, status: 'eliminated' },
        { id: 5, value: 4, status: 'eliminated' },
      ],
      pointers: [{ elementId: 3, label: 'ans', color: '#43E97B' }],
      operation: 'ANSWER = heap.top() = 5  ✓',
      note: 'The top of the min-heap is the kth largest element',
    },
  ],
};

// ── 20. Valid Parentheses ─────────────────────────────────────────────────────
const validParentheses: AlgorithmAnimation = {
  problemId: 20,
  title: 'Valid Parentheses',
  description: 'Stack push/pop on "({[]})"',
  frames: [
    {
      type: 'stack',
      items: [],
      current: '(',
      currentStatus: 'active',
      operation: 'READ "(" — opening bracket → PUSH',
    },
    {
      type: 'stack',
      items: [{ id: 0, value: '(', status: 'default' }],
      current: '{',
      currentStatus: 'active',
      operation: 'READ "{" — opening bracket → PUSH',
    },
    {
      type: 'stack',
      items: [
        { id: 0, value: '(', status: 'default' },
        { id: 1, value: '{', status: 'default' },
      ],
      current: '[',
      currentStatus: 'active',
      operation: 'READ "[" — opening bracket → PUSH',
    },
    {
      type: 'stack',
      items: [
        { id: 0, value: '(', status: 'default' },
        { id: 1, value: '{', status: 'default' },
        { id: 2, value: '[', status: 'default' },
      ],
      current: ']',
      currentStatus: 'comparing',
      operation: 'READ "]" — check TOP = "[" → MATCH ✓ POP',
      note: '] closes [',
    },
    {
      type: 'stack',
      items: [
        { id: 0, value: '(', status: 'default' },
        { id: 1, value: '{', status: 'default' },
      ],
      current: '}',
      currentStatus: 'comparing',
      operation: 'READ "}" — check TOP = "{" → MATCH ✓ POP',
      note: '} closes {',
    },
    {
      type: 'stack',
      items: [
        { id: 0, value: '(', status: 'default' },
      ],
      current: ')',
      currentStatus: 'comparing',
      operation: 'READ ")" — check TOP = "(" → MATCH ✓ POP',
      note: ') closes (',
    },
    {
      type: 'stack',
      items: [],
      operation: 'Stack EMPTY → return true ✓',
      note: 'All brackets matched and closed',
    },
  ],
};

// ── 739. Daily Temperatures ──────────────────────────────────────────────────
// Array: [73,74,75,71,69,72,76,73]. Monotonic decreasing stack (stores indices).
const dailyTemperatures: AlgorithmAnimation = {
  problemId: 739,
  title: 'Daily Temperatures',
  description: 'Monotonic stack on [73,74,75,71,69,72,76,73]',
  frames: [
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'active' },
        { id: 1, value: 74, status: 'default' },
        { id: 2, value: 75, status: 'default' },
        { id: 3, value: 71, status: 'default' },
        { id: 4, value: 69, status: 'default' },
        { id: 5, value: 72, status: 'default' },
        { id: 6, value: 76, status: 'default' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 0, label: 'i=0', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [{ id: 0, value: 0, status: 'default' }],
      operation: 'PUSH index 0 (temp=73) — stack is empty',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'selected' },
        { id: 1, value: 74, status: 'active' },
        { id: 2, value: 75, status: 'default' },
        { id: 3, value: 71, status: 'default' },
        { id: 4, value: 69, status: 'default' },
        { id: 5, value: 72, status: 'default' },
        { id: 6, value: 76, status: 'default' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 1, label: 'i=1', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [{ id: 1, value: 1, status: 'active' }],
      operation: '74 > 73: POP 0, ans[0]=1. PUSH 1.',
      note: 'day 0 waits 1 day for warmer temp',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'eliminated' },
        { id: 1, value: 74, status: 'selected' },
        { id: 2, value: 75, status: 'active' },
        { id: 3, value: 71, status: 'default' },
        { id: 4, value: 69, status: 'default' },
        { id: 5, value: 72, status: 'default' },
        { id: 6, value: 76, status: 'default' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 2, label: 'i=2', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [{ id: 2, value: 2, status: 'active' }],
      operation: '75 > 74: POP 1, ans[1]=1. PUSH 2.',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'eliminated' },
        { id: 1, value: 74, status: 'eliminated' },
        { id: 2, value: 75, status: 'selected' },
        { id: 3, value: 71, status: 'active' },
        { id: 4, value: 69, status: 'active' },
        { id: 5, value: 72, status: 'default' },
        { id: 6, value: 76, status: 'default' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 4, label: 'i=3,4', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [
        { id: 2, value: 2, status: 'default' },
        { id: 3, value: 3, status: 'default' },
        { id: 4, value: 4, status: 'default' },
      ],
      operation: '71 < 75, 69 < 71 — PUSH both (no warmer day yet)',
      note: 'Colder days stack up waiting',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'eliminated' },
        { id: 1, value: 74, status: 'eliminated' },
        { id: 2, value: 75, status: 'selected' },
        { id: 3, value: 71, status: 'comparing' },
        { id: 4, value: 69, status: 'comparing' },
        { id: 5, value: 72, status: 'active' },
        { id: 6, value: 76, status: 'default' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 5, label: 'i=5', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [
        { id: 2, value: 2, status: 'default' },
        { id: 5, value: 5, status: 'active' },
      ],
      operation: '72 > 69 POP→ans[4]=1. 72 > 71 POP→ans[3]=2. PUSH 5.',
      note: '72 resolves both waiting days at once!',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'eliminated' },
        { id: 1, value: 74, status: 'eliminated' },
        { id: 2, value: 75, status: 'comparing' },
        { id: 3, value: 71, status: 'eliminated' },
        { id: 4, value: 69, status: 'eliminated' },
        { id: 5, value: 72, status: 'comparing' },
        { id: 6, value: 76, status: 'active' },
        { id: 7, value: 73, status: 'default' },
      ],
      topPointers: [{ elementId: 6, label: 'i=6', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [
        { id: 6, value: 6, status: 'active' },
      ],
      operation: '76 > 72 POP→ans[5]=1. 76 > 75 POP→ans[2]=4. PUSH 6.',
    },
    {
      type: 'two-row',
      topLabel: 'temps',
      topElements: [
        { id: 0, value: 73, status: 'eliminated' },
        { id: 1, value: 74, status: 'eliminated' },
        { id: 2, value: 75, status: 'eliminated' },
        { id: 3, value: 71, status: 'eliminated' },
        { id: 4, value: 69, status: 'eliminated' },
        { id: 5, value: 72, status: 'eliminated' },
        { id: 6, value: 76, status: 'selected' },
        { id: 7, value: 73, status: 'active' },
      ],
      topPointers: [{ elementId: 7, label: 'i=7', color: '#6C63FF' }],
      bottomLabel: 'stack (indices)',
      bottomElements: [
        { id: 6, value: 6, status: 'default' },
        { id: 7, value: 7, status: 'active' },
      ],
      operation: '73 < 76 — PUSH 7. End of array.',
    },
    {
      type: 'two-row',
      topLabel: 'result',
      topElements: [
        { id: 0, value: 1, status: 'result' },
        { id: 1, value: 1, status: 'result' },
        { id: 2, value: 4, status: 'result' },
        { id: 3, value: 2, status: 'result' },
        { id: 4, value: 1, status: 'result' },
        { id: 5, value: 1, status: 'result' },
        { id: 6, value: 0, status: 'result' },
        { id: 7, value: 0, status: 'result' },
      ],
      bottomLabel: 'stack (remaining → 0)',
      bottomElements: [
        { id: 6, value: 6, status: 'eliminated' },
        { id: 7, value: 7, status: 'eliminated' },
      ],
      operation: 'Remaining stack gets ans=0. Done!',
    },
  ],
};

// ── 1. Two Sum ────────────────────────────────────────────────────────────────
const twoSum: AlgorithmAnimation = {
  problemId: 1,
  title: 'Two Sum',
  description: 'HashMap scan on [2,7,11,15] target=9',
  frames: [
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 2, status: 'active' },
        { id: 1, value: 7, status: 'default' },
        { id: 2, value: 11, status: 'default' },
        { id: 3, value: 15, status: 'default' },
      ],
      arrayPointer: 0,
      map: [],
      operation: 'i=0, val=2. Need 9-2=7. Is 7 in map? NO',
      note: 'Map is empty — store {2:0}',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 2, status: 'selected' },
        { id: 1, value: 7, status: 'active' },
        { id: 2, value: 11, status: 'default' },
        { id: 3, value: 15, status: 'default' },
      ],
      arrayPointer: 1,
      map: [
        { id: 0, key: '2', value: 'idx 0', status: 'default' },
      ],
      operation: 'i=1, val=7. Need 9-7=2. Is 2 in map? YES ✓',
      note: 'Found! map[2]=0. Answer is [0, 1]',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 2, status: 'result' },
        { id: 1, value: 7, status: 'result' },
        { id: 2, value: 11, status: 'eliminated' },
        { id: 3, value: 15, status: 'eliminated' },
      ],
      arrayPointer: 1,
      map: [
        { id: 0, key: '2', value: 'idx 0', status: 'result' },
      ],
      operation: 'ANSWER = [0, 1]  ✓  (2 + 7 = 9)',
    },
  ],
};

// ── 876. Middle of Linked List ─────────────────────────────────────────────────
const middleLinkedList: AlgorithmAnimation = {
  problemId: 876,
  title: 'Middle of Linked List',
  description: 'Fast & slow pointer on 1→2→3→4→5',
  frames: [
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'active' },
        { id: 2, value: 2, status: 'default' },
        { id: 3, value: 3, status: 'default' },
        { id: 4, value: 4, status: 'default' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 1, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 1, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'Both pointers start at HEAD (node 1)',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 2, status: 'active' },
        { id: 3, value: 3, status: 'active' },
        { id: 4, value: 4, status: 'default' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 2, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'SLOW +1 step → node 2.  FAST +2 steps → node 3',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'eliminated' },
        { id: 2, value: 2, status: 'selected' },
        { id: 3, value: 3, status: 'active' },
        { id: 4, value: 4, status: 'active' },
        { id: 5, value: 5, status: 'active' },
      ],
      pointers: [
        { nodeId: 3, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 5, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'SLOW +1 → node 3.  FAST +2 → node 5',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'eliminated' },
        { id: 2, value: 2, status: 'eliminated' },
        { id: 3, value: 3, status: 'result' },
        { id: 4, value: 4, status: 'eliminated' },
        { id: 5, value: 5, status: 'eliminated' },
      ],
      pointers: [
        { nodeId: 3, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 5, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'FAST reached end. SLOW = MIDDLE = node 3 ✓',
      note: 'When fast can\'t move 2 steps, slow is at middle',
    },
  ],
};

// ── 206. Reverse Linked List ──────────────────────────────────────────────────
const reverseLinkedList: AlgorithmAnimation = {
  problemId: 206,
  title: 'Reverse Linked List',
  description: 'Three-pointer reversal on 1→2→3→4→5',
  frames: [
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'active' },
        { id: 2, value: 2, status: 'default' },
        { id: 3, value: 3, status: 'default' },
        { id: 4, value: 4, status: 'default' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 1, label: 'CURR', color: '#6C63FF', emoji: '📍' },
      ],
      operation: 'PREV=null, CURR=head(1). Start reversal.',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 2, status: 'active' },
        { id: 3, value: 3, status: 'default' },
        { id: 4, value: 4, status: 'default' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 1, label: 'PREV', color: '#43E97B', emoji: '◀' },
        { nodeId: 2, label: 'CURR', color: '#6C63FF', emoji: '📍' },
      ],
      operation: 'node1.next = PREV(null). PREV=1, CURR=2',
      note: '1 now points backward (to null)',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 2, status: 'selected' },
        { id: 3, value: 3, status: 'active' },
        { id: 4, value: 4, status: 'default' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 2, label: 'PREV', color: '#43E97B', emoji: '◀' },
        { nodeId: 3, label: 'CURR', color: '#6C63FF', emoji: '📍' },
      ],
      operation: 'node2.next = 1. PREV=2, CURR=3',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 2, status: 'selected' },
        { id: 3, value: 3, status: 'selected' },
        { id: 4, value: 4, status: 'active' },
        { id: 5, value: 5, status: 'default' },
      ],
      pointers: [
        { nodeId: 3, label: 'PREV', color: '#43E97B', emoji: '◀' },
        { nodeId: 4, label: 'CURR', color: '#6C63FF', emoji: '📍' },
      ],
      operation: 'node3.next = 2. PREV=3, CURR=4',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 2, status: 'selected' },
        { id: 3, value: 3, status: 'selected' },
        { id: 4, value: 4, status: 'selected' },
        { id: 5, value: 5, status: 'active' },
      ],
      pointers: [
        { nodeId: 4, label: 'PREV', color: '#43E97B', emoji: '◀' },
        { nodeId: 5, label: 'CURR', color: '#6C63FF', emoji: '📍' },
      ],
      operation: 'node4.next = 3. PREV=4, CURR=5',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 5, value: 5, status: 'result' },
        { id: 4, value: 4, status: 'result' },
        { id: 3, value: 3, status: 'result' },
        { id: 2, value: 2, status: 'result' },
        { id: 1, value: 1, status: 'result' },
      ],
      pointers: [
        { nodeId: 5, label: 'HEAD', color: '#43E97B', emoji: '✓' },
      ],
      operation: 'CURR=null → stop. PREV is new head. 5→4→3→2→1 ✓',
    },
  ],
};

// ── 84. Largest Rectangle in Histogram ───────────────────────────────────────
const largestRectangle: AlgorithmAnimation = {
  problemId: 84,
  title: 'Largest Rectangle in Histogram',
  description: 'Monotonic stack on [2,1,5,6,2,3]',
  frames: [
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'active' },
        { id: 1, value: 1, status: 'default' },
        { id: 2, value: 5, status: 'default' },
        { id: 3, value: 6, status: 'default' },
        { id: 4, value: 2, status: 'default' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 0, label: 'i=0', color: '#6C63FF' }],
      operation: 'heights=[2,1,5,6,2,3]. Stack=[] → PUSH 0. Stack=[0]',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'comparing' },
        { id: 1, value: 1, status: 'active' },
        { id: 2, value: 5, status: 'default' },
        { id: 3, value: 6, status: 'default' },
        { id: 4, value: 2, status: 'default' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 1, label: 'i=1', color: '#6C63FF' }],
      operation: 'h[1]=1 < h[0]=2: POP 0 → area=2×1=2. PUSH 1. Stack=[1]',
      note: 'Popping because current bar is shorter — bar 0 can\'t extend right',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'eliminated' },
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 5, status: 'active' },
        { id: 3, value: 6, status: 'default' },
        { id: 4, value: 2, status: 'default' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 2, label: 'i=2', color: '#6C63FF' }],
      operation: 'h[2]=5 > h[1]=1 → PUSH 2. Stack=[1,2]',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'eliminated' },
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 5, status: 'selected' },
        { id: 3, value: 6, status: 'active' },
        { id: 4, value: 2, status: 'default' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 3, label: 'i=3', color: '#6C63FF' }],
      operation: 'h[3]=6 > h[2]=5 → PUSH 3. Stack=[1,2,3]',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'eliminated' },
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 5, status: 'comparing' },
        { id: 3, value: 6, status: 'comparing' },
        { id: 4, value: 2, status: 'active' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 4, label: 'i=4', color: '#6C63FF' }],
      operation: 'h[4]=2: POP 3→area=6×1=6. POP 2→area=5×2=10 ⬆MAX! Stack=[1,4]',
      note: '5×2 = bars 2 and 3 both have height ≥ 5',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'eliminated' },
        { id: 1, value: 1, status: 'selected' },
        { id: 2, value: 5, status: 'result' },
        { id: 3, value: 6, status: 'result' },
        { id: 4, value: 2, status: 'active' },
        { id: 5, value: 3, status: 'default' },
      ],
      pointers: [{ elementId: 4, label: 'i=4', color: '#6C63FF' }],
      operation: 'Max area so far = 10. Continue…',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: 2, status: 'eliminated' },
        { id: 1, value: 1, status: 'result' },
        { id: 2, value: 5, status: 'result' },
        { id: 3, value: 6, status: 'result' },
        { id: 4, value: 2, status: 'result' },
        { id: 5, value: 3, status: 'result' },
      ],
      operation: 'ANSWER = 10 ✓',
      note: 'Bars at index 2 & 3 with height 5 form the largest rectangle',
    },
  ],
};

// ── 128. Longest Consecutive Sequence ────────────────────────────────────────
const longestConsecutive: AlgorithmAnimation = {
  problemId: 128,
  title: 'Longest Consecutive Sequence',
  description: 'HashSet scan on [100,4,200,1,3,2]',
  frames: [
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 100, status: 'default' },
        { id: 1, value: 4, status: 'default' },
        { id: 2, value: 200, status: 'default' },
        { id: 3, value: 1, status: 'default' },
        { id: 4, value: 3, status: 'default' },
        { id: 5, value: 2, status: 'default' },
      ],
      map: [
        { id: 0, key: '100', value: '✓', status: 'default' },
        { id: 1, key: '4',   value: '✓', status: 'default' },
        { id: 2, key: '200', value: '✓', status: 'default' },
        { id: 3, key: '1',   value: '✓', status: 'default' },
        { id: 4, key: '3',   value: '✓', status: 'default' },
        { id: 5, key: '2',   value: '✓', status: 'default' },
      ],
      operation: 'Build HashSet with all values first',
      note: 'O(1) lookup lets us check if num-1 exists quickly',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 100, status: 'active' },
        { id: 1, value: 4, status: 'default' },
        { id: 2, value: 200, status: 'default' },
        { id: 3, value: 1, status: 'default' },
        { id: 4, value: 3, status: 'default' },
        { id: 5, value: 2, status: 'default' },
      ],
      arrayPointer: 0,
      map: [
        { id: 0, key: '100', value: '✓', status: 'active' },
        { id: 1, key: '4',   value: '✓', status: 'default' },
        { id: 2, key: '200', value: '✓', status: 'default' },
        { id: 3, key: '1',   value: '✓', status: 'default' },
        { id: 4, key: '3',   value: '✓', status: 'default' },
        { id: 5, key: '2',   value: '✓', status: 'default' },
      ],
      operation: 'Check 100: is 99 in set? NO → 100 starts a sequence',
      note: 'Count forward: 100,101? No → streak=1',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 100, status: 'eliminated' },
        { id: 1, value: 4, status: 'default' },
        { id: 2, value: 200, status: 'default' },
        { id: 3, value: 1, status: 'active' },
        { id: 4, value: 3, status: 'default' },
        { id: 5, value: 2, status: 'default' },
      ],
      arrayPointer: 3,
      map: [
        { id: 0, key: '100', value: '✓', status: 'eliminated' },
        { id: 1, key: '4',   value: '✓', status: 'default' },
        { id: 2, key: '200', value: '✓', status: 'default' },
        { id: 3, key: '1',   value: '✓', status: 'active' },
        { id: 4, key: '3',   value: '✓', status: 'default' },
        { id: 5, key: '2',   value: '✓', status: 'default' },
      ],
      operation: 'Check 1: is 0 in set? NO → 1 starts a sequence',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 100, status: 'eliminated' },
        { id: 1, value: 4, status: 'default' },
        { id: 2, value: 200, status: 'default' },
        { id: 3, value: 1, status: 'comparing' },
        { id: 4, value: 3, status: 'comparing' },
        { id: 5, value: 2, status: 'comparing' },
      ],
      arrayPointer: 3,
      map: [
        { id: 0, key: '100', value: '✓', status: 'eliminated' },
        { id: 1, key: '4',   value: '✓', status: 'comparing' },
        { id: 2, key: '200', value: '✓', status: 'default' },
        { id: 3, key: '1',   value: '✓', status: 'comparing' },
        { id: 4, key: '3',   value: '✓', status: 'comparing' },
        { id: 5, key: '2',   value: '✓', status: 'comparing' },
      ],
      operation: '1→2→3→4 all in set! streak = 4',
      note: '5 not in set → sequence stops',
    },
    {
      type: 'hashmap',
      array: [
        { id: 0, value: 100, status: 'eliminated' },
        { id: 1, value: 4, status: 'result' },
        { id: 2, value: 200, status: 'eliminated' },
        { id: 3, value: 1, status: 'result' },
        { id: 4, value: 3, status: 'result' },
        { id: 5, value: 2, status: 'result' },
      ],
      map: [
        { id: 0, key: '100', value: '✓', status: 'eliminated' },
        { id: 1, key: '4',   value: '✓', status: 'result' },
        { id: 2, key: '200', value: '✓', status: 'eliminated' },
        { id: 3, key: '1',   value: '✓', status: 'result' },
        { id: 4, key: '3',   value: '✓', status: 'result' },
        { id: 5, key: '2',   value: '✓', status: 'result' },
      ],
      operation: 'ANSWER = 4 ✓  (1, 2, 3, 4)',
    },
  ],
};

// ── 56. Merge Intervals ───────────────────────────────────────────────────────
const mergeIntervals: AlgorithmAnimation = {
  problemId: 56,
  title: 'Merge Intervals',
  description: 'Sort then merge [[1,3],[2,6],[8,10],[15,18]]',
  frames: [
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,3]', status: 'default' },
        { id: 1, value: '[2,6]', status: 'default' },
        { id: 2, value: '[8,10]', status: 'default' },
        { id: 3, value: '[15,18]', status: 'default' },
      ],
      operation: 'Input (already sorted by start). result=[]',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,3]', status: 'active' },
        { id: 1, value: '[2,6]', status: 'default' },
        { id: 2, value: '[8,10]', status: 'default' },
        { id: 3, value: '[15,18]', status: 'default' },
      ],
      pointers: [{ elementId: 0, label: 'curr', color: '#6C63FF' }],
      operation: 'Take [1,3] → result=[[1,3]]',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,3]', status: 'comparing' },
        { id: 1, value: '[2,6]', status: 'active' },
        { id: 2, value: '[8,10]', status: 'default' },
        { id: 3, value: '[15,18]', status: 'default' },
      ],
      pointers: [{ elementId: 1, label: 'curr', color: '#6C63FF' }],
      operation: '[2,6]: start=2 ≤ last.end=3 → OVERLAP! Merge to [1,6]',
      note: '2 ≤ 3 means they overlap — extend end to max(3,6)=6',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,6]', status: 'selected' },
        { id: 1, value: '[2,6]', status: 'eliminated' },
        { id: 2, value: '[8,10]', status: 'active' },
        { id: 3, value: '[15,18]', status: 'default' },
      ],
      pointers: [{ elementId: 2, label: 'curr', color: '#6C63FF' }],
      operation: '[8,10]: start=8 > last.end=6 → NO overlap. ADD to result',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,6]', status: 'selected' },
        { id: 1, value: '[2,6]', status: 'eliminated' },
        { id: 2, value: '[8,10]', status: 'selected' },
        { id: 3, value: '[15,18]', status: 'active' },
      ],
      pointers: [{ elementId: 3, label: 'curr', color: '#6C63FF' }],
      operation: '[15,18]: start=15 > last.end=10 → NO overlap. ADD.',
    },
    {
      type: 'array',
      elements: [
        { id: 0, value: '[1,6]', status: 'result' },
        { id: 2, value: '[8,10]', status: 'result' },
        { id: 3, value: '[15,18]', status: 'result' },
        { id: 1, value: '[2,6]', status: 'eliminated' },
      ],
      operation: 'ANSWER = [[1,6],[8,10],[15,18]] ✓',
    },
  ],
};

// ── 141. Linked List Cycle ────────────────────────────────────────────────────
const linkedListCycle: AlgorithmAnimation = {
  problemId: 141,
  title: 'Linked List Cycle',
  description: 'Fast & slow pointer detect cycle in 3→1→2→(→1)',
  frames: [
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 3, status: 'active' },
        { id: 2, value: 1, status: 'default' },
        { id: 3, value: 2, status: 'default' },
        { id: 4, value: '↩', status: 'highlight' },
      ],
      pointers: [
        { nodeId: 1, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 1, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'Both start at head. Node 4 (↩) loops back to node 2.',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 3, status: 'eliminated' },
        { id: 2, value: 1, status: 'active' },
        { id: 3, value: 2, status: 'active' },
        { id: 4, value: '↩', status: 'highlight' },
      ],
      pointers: [
        { nodeId: 2, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'SLOW +1 → node 2.  FAST +2 → node 3',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 3, status: 'eliminated' },
        { id: 2, value: 1, status: 'active' },
        { id: 3, value: 2, status: 'active' },
        { id: 4, value: '↩', status: 'comparing' },
      ],
      pointers: [
        { nodeId: 3, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 4, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'SLOW +1 → node 3. FAST +2 → node 4 (back edge)',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 3, status: 'eliminated' },
        { id: 2, value: 1, status: 'comparing' },
        { id: 3, value: 2, status: 'default' },
        { id: 4, value: '↩', status: 'eliminated' },
      ],
      pointers: [
        { nodeId: 2, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
        { nodeId: 2, label: 'FAST', color: '#FF6584', emoji: '🐇' },
      ],
      operation: 'SLOW → node 4→(loop)→ node 2. FAST → node 2. MEET! ✓',
      note: 'They meet inside the cycle → cycle detected!',
    },
    {
      type: 'pointer-list',
      nodes: [
        { id: 1, value: 3, status: 'eliminated' },
        { id: 2, value: 1, status: 'result' },
        { id: 3, value: 2, status: 'result' },
        { id: 4, value: '↩', status: 'result' },
      ],
      pointers: [
        { nodeId: 2, label: 'MEET', color: '#FF6584', emoji: '⚡' },
      ],
      operation: 'ANSWER: cycle exists → return true ✓',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const algorithmAnimations: Record<number, AlgorithmAnimation> = {
  1:   twoSum,
  20:  validParentheses,
  56:  mergeIntervals,
  84:  largestRectangle,
  128: longestConsecutive,
  141: linkedListCycle,
  206: reverseLinkedList,
  215: kthLargest,
  739: dailyTemperatures,
  876: middleLinkedList,
};
