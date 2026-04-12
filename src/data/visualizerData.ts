import { VisualizerData } from '../components/visualizers/types';

// Map: problemId → array of VisualizerData (one per step, null = no visual)
export const problemVisualizers: Record<number, (VisualizerData | null)[]> = {

  // ─────────────────────────────────────────────────────────────────────────
  // 215: Kth Largest — min-heap size k
  // nums=[3,2,1,5,6,4], k=2
  // ─────────────────────────────────────────────────────────────────────────
  215: [
    // Step 1: Build min-heap with first k elements
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 2, status: 'selected' },
        { value: 3, status: 'selected' },
      ],
      caption: 'Min-heap of size k=2: first two elements [3,2] → heap=[2,3]',
    },
    // Step 2: Process remaining → 1<2 skip; 5>2 replace; 6>3 replace; 4<5 skip
    {
      type: 'array',
      cells: [
        { value: 3, status: 'eliminated', label: 'done' },
        { value: 2, status: 'eliminated', label: 'done' },
        { value: 1, status: 'comparing', label: '1<2 skip' },
        { value: 5, status: 'active',    label: '5>2 ✓' },
        { value: 6, status: 'active',    label: '6>3 ✓' },
        { value: 4, status: 'comparing', label: '4<5 skip' },
      ],
      caption: 'Compare each element with heap top (smallest of top-k). Replace if larger.',
    },
    // Step 3: Result
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 5, status: 'result' },
        { value: 6, status: 'selected' },
      ],
      caption: 'Heap root = 5 = 2nd largest. peek() is the answer.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 347: Top K Frequent — freq map + min-heap
  // nums=[1,1,1,2,2,3], k=2
  // ─────────────────────────────────────────────────────────────────────────
  347: [
    // Step 1: Count frequencies
    {
      type: 'hashmap',
      entries: [
        { key: '1', value: 'freq: 3', status: 'active' },
        { key: '2', value: 'freq: 2', status: 'active' },
        { key: '3', value: 'freq: 1', status: 'comparing' },
      ],
      caption: 'freq map: {1→3, 2→2, 3→1}',
    },
    // Step 2: Min-heap ordered by frequency, evict when size > k
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 2, status: 'selected' },  // key=2, freq=2
        { value: 3, status: 'active' },    // key=1, freq=3
      ],
      caption: 'Min-heap by frequency (size k=2). Root=key 2 (lowest freq). Key 3 was evicted.',
    },
    // Step 3: Drain heap
    {
      type: 'array',
      cells: [
        { value: 2, status: 'result', label: 'result[1]' },
        { value: 1, status: 'result', label: 'result[0]' },
      ],
      caption: 'Pop from heap (ascending freq order), fill result backwards → [1, 2]',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 295: Find Median — Two Heaps
  // addNum(1), addNum(2), addNum(3)
  // ─────────────────────────────────────────────────────────────────────────
  295: [
    // Step 1: Setup
    {
      type: 'two-heaps',
      lo: [],
      hi: [],
      caption: 'lo = max-heap (lower half), hi = min-heap (upper half)',
    },
    // Step 2: Add numbers with rebalance
    {
      type: 'two-heaps',
      lo: [
        { value: 1, status: 'selected' },
        { value: 2, status: 'default' },
      ],
      hi: [
        { value: 3, status: 'default' },
      ],
      median: '2',
      caption: 'After addNum(1,2,3): lo=[2,1] hi=[3]. lo.size>hi.size → median=lo.peek()=2',
    },
    // Step 3: Find median
    {
      type: 'two-heaps',
      lo: [
        { value: 2, status: 'result' },
        { value: 1, status: 'default' },
      ],
      hi: [
        { value: 3, status: 'default' },
      ],
      median: '2.0',
      caption: 'lo.size(2) > hi.size(1) → median = lo.peek() = 2. Equal sizes → average of tops.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 621: Task Scheduler
  // tasks=[A,A,A,B,B,B], n=2
  // ─────────────────────────────────────────────────────────────────────────
  621: [
    // Step 1: Count frequencies
    {
      type: 'hashmap',
      entries: [
        { key: 'A', value: 'count: 3', status: 'active' },
        { key: 'B', value: 'count: 3', status: 'active' },
      ],
      caption: 'Count task frequencies: {A:3, B:3}',
    },
    // Step 2: Max-heap of frequencies
    {
      type: 'heap',
      heapType: 'max',
      cells: [
        { value: 3, status: 'active' },   // A=3
        { value: 3, status: 'selected' }, // B=3
      ],
      caption: 'Max-heap: always pick most frequent task first to minimize idle time.',
    },
    // Step 3: Simulate cycle: A→B→idle→A→B→idle→A→B
    {
      type: 'array',
      cells: [
        { value: 'A', status: 'selected',  label: 't=1' },
        { value: 'B', status: 'selected',  label: 't=2' },
        { value: '⏸', status: 'comparing', label: 't=3' },
        { value: 'A', status: 'selected',  label: 't=4' },
        { value: 'B', status: 'selected',  label: 't=5' },
        { value: '⏸', status: 'comparing', label: 't=6' },
        { value: 'A', status: 'selected',  label: 't=7' },
        { value: 'B', status: 'selected',  label: 't=8' },
      ],
      caption: 'Schedule: A→B→idle→A→B→idle→A→B = 8 total time units',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 20: Valid Parentheses  s="()[]{}"
  // ─────────────────────────────────────────────────────────────────────────
  20: [
    // Step 1: Push opening brackets
    {
      type: 'stack',
      cells: [{ value: '(', status: 'active' }],
      action: 'push',
      actionValue: '(',
      caption: 'Encounter ( → push. Stack: [(]',
    },
    // Step 2: Match closing brackets
    {
      type: 'stack',
      cells: [{ value: '[', status: 'selected' }],
      action: 'pop',
      actionValue: '(',
      caption: ') encountered. Pop top ( → match ✓. Then [ pushed for [. Stack: [[]',
    },
    // Step 3: Final empty stack
    {
      type: 'stack',
      cells: [],
      action: 'idle',
      caption: 'All brackets matched! Stack empty → return true ✓',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 739: Daily Temperatures  [73,74,75,71,69,72,76,73]
  // ─────────────────────────────────────────────────────────────────────────
  739: [
    // Step 1: Monotonic decreasing stack (stores indices)
    {
      type: 'stack',
      cells: [{ value: 'idx:0 (73)', status: 'default' }],
      action: 'push',
      actionValue: 'idx:0',
      caption: 'Push index 0 (temp=73). Stack holds indices with decreasing temperatures.',
    },
    // Step 2: Process warmer day
    {
      type: 'array',
      cells: [
        { value: 73, status: 'eliminated', label: 'i=0' },
        { value: 74, status: 'active',     label: 'i=1 →' },
        { value: 75, status: 'default',    label: 'i=2' },
        { value: 71, status: 'default',    label: 'i=3' },
        { value: 69, status: 'default',    label: 'i=4' },
        { value: 72, status: 'default',    label: 'i=5' },
        { value: 76, status: 'default',    label: 'i=6' },
        { value: 73, status: 'default',    label: 'i=7' },
      ],
      caption: 'i=1 (74 > 73): pop idx=0, result[0]=1-0=1. Then push idx=1.',
    },
    // Step 3: Final result
    {
      type: 'array',
      cells: [
        { value: 1, status: 'result',  label: 'i=0' },
        { value: 1, status: 'result',  label: 'i=1' },
        { value: 4, status: 'result',  label: 'i=2' },
        { value: 2, status: 'result',  label: 'i=3' },
        { value: 1, status: 'result',  label: 'i=4' },
        { value: 1, status: 'result',  label: 'i=5' },
        { value: 0, status: 'default', label: 'i=6' },
        { value: 0, status: 'default', label: 'i=7' },
      ],
      caption: 'Result: [1,1,4,2,1,1,0,0]. Stack indices that never popped → answer=0.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 84: Largest Rectangle in Histogram  [2,1,5,6,2,3]
  // ─────────────────────────────────────────────────────────────────────────
  84: [
    // Step 1: Increasing stack + sentinel
    {
      type: 'stack',
      cells: [{ value: '-1 (sentinel)', status: 'comparing' }],
      action: 'push',
      actionValue: '-1',
      caption: 'Start with sentinel -1 in stack. Helps compute width without boundary checks.',
    },
    // Step 2: Pop when shorter bar found
    {
      type: 'array',
      cells: [
        { value: 2, status: 'eliminated', label: 'i=0' },
        { value: 1, status: 'active',     label: 'i=1 ←' },
        { value: 5, status: 'comparing',  label: 'i=2' },
        { value: 6, status: 'comparing',  label: 'i=3' },
        { value: 2, status: 'default',    label: 'i=4' },
        { value: 3, status: 'default',    label: 'i=5' },
      ],
      caption: 'i=1 (h=1): pop idx=0 (h=2). width=1-(-1)-1=1. area=2×1=2. Then push i=1.',
    },
    // Step 3: Max area found at bars 5,6
    {
      type: 'array',
      cells: [
        { value: 2, status: 'eliminated', label: 'i=0' },
        { value: 1, status: 'eliminated', label: 'i=1' },
        { value: 5, status: 'result',     label: 'i=2 ★' },
        { value: 6, status: 'result',     label: 'i=3 ★' },
        { value: 2, status: 'comparing',  label: 'i=4' },
        { value: 3, status: 'default',    label: 'i=5' },
      ],
      caption: 'Max area = 10 (bars at i=2,3: height=5, width=2). Monotonic stack detects this.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 1: Two Sum  nums=[2,7,11,15], target=9
  // ─────────────────────────────────────────────────────────────────────────
  1: [
    // Step 1: Initialize map
    {
      type: 'hashmap',
      entries: [],
      caption: 'seen = {} (maps value → index for O(1) complement lookup)',
    },
    // Step 2: Iterate and check complement
    {
      type: 'array',
      cells: [
        { value: 2,  status: 'eliminated', label: 'seen' },
        { value: 7,  status: 'active',     label: '→ need 2' },
        { value: 11, status: 'default',    label: '' },
        { value: 15, status: 'default',    label: '' },
      ],
      caption: 'i=1: complement = 9-7 = 2. seen has 2 at index 0 → return [0,1]',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 128: Longest Consecutive Sequence  [100,4,200,1,3,2]
  // ─────────────────────────────────────────────────────────────────────────
  128: [
    // Step 1: HashSet
    {
      type: 'hashmap',
      entries: [
        { key: '100', value: '✓', status: 'default' },
        { key: '4',   value: '✓', status: 'default' },
        { key: '200', value: '✓', status: 'default' },
        { key: '1',   value: '✓', status: 'default' },
        { key: '3',   value: '✓', status: 'default' },
        { key: '2',   value: '✓', status: 'default' },
      ],
      caption: 'HashSet for O(1) lookup: {100,4,200,1,3,2}',
    },
    // Step 2: Start streaks only at sequence beginnings
    {
      type: 'array',
      cells: [
        { value: 1,   status: 'active',    label: 'start ✓' },
        { value: 2,   status: 'selected',  label: '+1' },
        { value: 3,   status: 'selected',  label: '+2' },
        { value: 4,   status: 'selected',  label: '+3' },
        { value: 100, status: 'highlight', label: 'start ✓' },
        { value: 200, status: 'highlight', label: 'start ✓' },
      ],
      caption: 'Start at 1 (0 not in set). Streak: 1→2→3→4 = length 4. 100 and 200 start alone.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 994: Rotting Oranges  [[2,1,1],[1,1,0],[0,1,1]]
  // ─────────────────────────────────────────────────────────────────────────
  994: [
    // Step 1: Initial state — enqueue rotten
    {
      type: 'grid',
      grid: [
        ['rotten', 'fresh', 'fresh'],
        ['fresh',  'fresh', 'empty'],
        ['empty',  'fresh', 'fresh'],
      ],
      queue: ['(0,0)'],
      caption: 'Initial: 1 rotten (🟠), 7 fresh (🟡), 1 empty (⬜). Enqueue all rotten.',
    },
    // Step 2: BFS minute 1
    {
      type: 'grid',
      grid: [
        ['rotten', 'rotten', 'fresh'],
        ['rotten', 'fresh',  'empty'],
        ['empty',  'fresh',  'fresh'],
      ],
      queue: ['(0,1)', '(1,0)'],
      caption: 'Minute 1: Rot spreads to (0,1) and (1,0). Queue: [(0,1),(1,0)]',
    },
    // Step 3: BFS complete (minute 4)
    {
      type: 'grid',
      grid: [
        ['rotten', 'rotten', 'rotten'],
        ['rotten', 'rotten', 'empty'],
        ['empty',  'rotten', 'rotten'],
      ],
      queue: [],
      caption: 'Minute 4: All reachable oranges rotted. fresh=0 → return 4.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 56: Merge Intervals  [[1,3],[2,6],[8,10],[15,18]]
  // ─────────────────────────────────────────────────────────────────────────
  56: [
    // Step 1: Sort by start
    {
      type: 'interval',
      intervals: [
        { start: 1,  end: 3,  status: 'default', label: '[1,3]' },
        { start: 2,  end: 6,  status: 'default', label: '[2,6]' },
        { start: 8,  end: 10, status: 'default', label: '[8,10]' },
        { start: 15, end: 18, status: 'default', label: '[15,18]' },
      ],
      domain: [0, 20],
      caption: 'After sorting by start time: [1,3],[2,6],[8,10],[15,18]',
    },
    // Step 2: Merge [1,3] and [2,6] → [1,6]
    {
      type: 'interval',
      intervals: [
        { start: 1,  end: 3,  status: 'comparing', label: '[1,3]' },
        { start: 2,  end: 6,  status: 'comparing', label: '[2,6] ←' },
      ],
      domain: [0, 10],
      caption: 'start=2 ≤ end=3 → overlap! Merge to [1, max(3,6)] = [1,6]',
    },
    // Step 3: Result
    {
      type: 'interval',
      intervals: [
        { start: 1,  end: 6,  status: 'result',  label: '[1,6] ★' },
        { start: 8,  end: 10, status: 'selected', label: '[8,10]' },
        { start: 15, end: 18, status: 'selected', label: '[15,18]' },
      ],
      domain: [0, 20],
      caption: 'Final merged intervals: [[1,6],[8,10],[15,18]]',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 435: Non-overlapping Intervals  [[1,2],[2,3],[3,4],[1,3]]
  // ─────────────────────────────────────────────────────────────────────────
  435: [
    // Step 1: Sort by end time
    {
      type: 'interval',
      intervals: [
        { start: 1, end: 2, status: 'selected', label: '[1,2]' },
        { start: 1, end: 3, status: 'comparing', label: '[1,3]' },
        { start: 2, end: 3, status: 'default',   label: '[2,3]' },
        { start: 3, end: 4, status: 'default',   label: '[3,4]' },
      ],
      domain: [0, 5],
      caption: 'Sorted by END time: [1,2],[1,3],[2,3],[3,4]',
    },
    // Step 2: Greedy keep
    {
      type: 'interval',
      intervals: [
        { start: 1, end: 2, status: 'result',     label: '[1,2] keep' },
        { start: 1, end: 3, status: 'eliminated', label: '[1,3] REMOVE' },
        { start: 2, end: 3, status: 'result',     label: '[2,3] keep' },
        { start: 3, end: 4, status: 'result',     label: '[3,4] keep' },
      ],
      domain: [0, 5],
      caption: '[1,3] starts at 1 which is < end=2 (last kept). Overlaps → remove it! count=1',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 33: Search in Rotated Sorted Array  [4,5,6,7,0,1,2], target=0
  // ─────────────────────────────────────────────────────────────────────────
  33: [
    // Step 1: Identify sorted half
    {
      type: 'array',
      cells: [
        { value: 4, status: 'selected',  label: 'L' },
        { value: 5, status: 'default',   label: '' },
        { value: 6, status: 'default',   label: '' },
        { value: 7, status: 'active',    label: 'MID' },
        { value: 0, status: 'highlight', label: '' },
        { value: 1, status: 'highlight', label: '' },
        { value: 2, status: 'selected',  label: 'R' },
      ],
      caption: 'L=0,R=6,MID=3. nums[L]=4 > nums[MID]=7? No → left half [4..7] is sorted.',
    },
    // Step 2: Target in sorted half?
    {
      type: 'array',
      cells: [
        { value: 4, status: 'eliminated', label: 'L' },
        { value: 5, status: 'eliminated', label: '' },
        { value: 6, status: 'eliminated', label: '' },
        { value: 7, status: 'eliminated', label: 'MID' },
        { value: 0, status: 'active',     label: 'target!' },
        { value: 1, status: 'selected',   label: 'new L' },
        { value: 2, status: 'selected',   label: 'R' },
      ],
      caption: 'target=0. Is 0 in left [4,7]? No. Search RIGHT half. L=MID+1=4.',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 875: Koko Eating Bananas  piles=[3,6,7,11], h=8
  // ─────────────────────────────────────────────────────────────────────────
  875: [
    // Step 1: Define search space [1, max(piles)=11]
    {
      type: 'array',
      cells: [
        { value: 1,  status: 'selected', label: 'L (min)' },
        { value: 6,  status: 'active',   label: 'MID=6' },
        { value: 11, status: 'selected', label: 'R (max)' },
      ],
      caption: 'Binary search on speed k ∈ [1, 11]. MID=6.',
    },
    // Step 2: Verify mid speed
    {
      type: 'array',
      cells: [
        { value: 3,  status: 'selected',  label: '⌈3/6⌉=1h' },
        { value: 6,  status: 'selected',  label: '⌈6/6⌉=1h' },
        { value: 7,  status: 'selected',  label: '⌈7/6⌉=2h' },
        { value: 11, status: 'selected',  label: '⌈11/6⌉=2h' },
      ],
      caption: 'Speed=6: total hours = 1+1+2+2 = 6 ≤ 8 ✓. Try slower → R=MID=6.',
    },
    // Step 3: Converge to answer k=4
    {
      type: 'array',
      cells: [
        { value: 3,  status: 'result',   label: '⌈3/4⌉=1h' },
        { value: 6,  status: 'result',   label: '⌈6/4⌉=2h' },
        { value: 7,  status: 'result',   label: '⌈7/4⌉=2h' },
        { value: 11, status: 'result',   label: '⌈11/4⌉=3h' },
      ],
      caption: 'Speed=4: 1+2+2+3=8 ≤ 8 ✓. Minimum valid speed = 4 ★',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 146: LRU Cache  put(1,1),put(2,2),get(1),put(3,3)
  // ─────────────────────────────────────────────────────────────────────────
  146: [
    // Step 1: Setup doubly linked list
    {
      type: 'linked-list',
      nodes: [],
      caption: 'Empty cache. HEAD ↔ TAIL sentinels. HashMap: {}',
    },
    // Step 2: put(1,1) and put(2,2)
    {
      type: 'linked-list',
      nodes: [
        { key: 2, value: 2, status: 'active' },   // most recent → head side
        { key: 1, value: 1, status: 'default' },  // older → tail side
      ],
      caption: 'put(1,1) then put(2,2). Most recent at HEAD side. Capacity=2.',
    },
    // Step 3: get(1) → move to front; put(3,3) → evict LRU (key 2)
    {
      type: 'linked-list',
      nodes: [
        { key: 3, value: 3, status: 'active' },   // newest
        { key: 1, value: 1, status: 'selected' }, // recently accessed
      ],
      highlightKey: 3,
      caption: 'get(1): move key 1 to front. put(3,3): evicts key 2 (LRU at tail). get(2)=-1.',
    },
  ],
};
