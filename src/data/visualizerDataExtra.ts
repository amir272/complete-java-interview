import { VisualizerData } from '../components/visualizers/types';

/**
 * Visualizer step data for all DSA problems not covered in visualizerData.ts.
 * Merged in ProblemDetailScreen via allProblemVisualizers.
 */
export const problemVisualizersExtra: Record<number, (VisualizerData | null)[]> = {

  // ─── Heaps extra ────────────────────────────────────────────────────────────

  // 692: Top K Frequent Words  ["i","love","leetcode","i","love","coding"], k=2
  692: [
    {
      type: 'hashmap',
      entries: [
        { key: '"i"',        value: 'freq: 2', status: 'active' },
        { key: '"love"',     value: 'freq: 2', status: 'active' },
        { key: '"leetcode"', value: 'freq: 1', status: 'comparing' },
        { key: '"coding"',   value: 'freq: 1', status: 'comparing' },
      ],
      caption: 'Step 1: Count word frequencies with a HashMap.',
    },
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: '"love"', status: 'selected' },
        { value: '"i"',    status: 'active' },
      ],
      caption: 'Step 2: Min-heap of size k=2 ordered by (freq ASC, word DESC). "love" < "i" lexically — it sits at root.',
    },
    {
      type: 'array',
      cells: [
        { value: '"i"',    status: 'result', label: '#1' },
        { value: '"love"', status: 'result', label: '#2' },
      ],
      caption: 'Step 3: Poll heap into result list, reverse. Ties broken by lex order → ["i","love"]',
    },
  ],

  // 703: Kth Largest in Stream  k=3, stream=[4,5,8,2]
  703: [
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 4, status: 'selected' },
        { value: 5, status: 'active' },
        { value: 8, status: 'active' },
      ],
      caption: 'Step 1: Initialize min-heap with first k=3 elements: [4,5,8]. Root=4 = 3rd largest so far.',
    },
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 4, status: 'comparing' },
        { value: 5, status: 'active' },
        { value: 8, status: 'active' },
      ],
      caption: 'Step 2: add(3). 3 < heap.peek()=4 → discard 3. Heap unchanged. Return peek()=4.',
    },
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: 5, status: 'result' },
        { value: 9, status: 'active' },
        { value: 8, status: 'active' },
      ],
      caption: 'Step 3: add(9). 9 > 4 → poll(4), push(9). New heap=[5,9,8]. Return peek()=5 = 3rd largest.',
    },
  ],

  // 373: Find K Pairs with Smallest Sums  nums1=[1,7,11], nums2=[2,4,6], k=3
  373: [
    {
      type: 'hashmap',
      entries: [
        { key: '(1,2)', value: 'sum=3', status: 'active' },
        { key: '(1,4)', value: 'sum=5', status: 'selected' },
        { key: '(1,6)', value: 'sum=7', status: 'selected' },
      ],
      caption: 'Step 1: Seed min-heap with (nums1[0], nums2[j]) for all j. Smallest sums are in first row of the implicit matrix.',
    },
    {
      type: 'heap',
      heapType: 'min',
      cells: [
        { value: '(1,2)=3', status: 'active' },
        { value: '(1,4)=5', status: 'selected' },
        { value: '(1,6)=7', status: 'selected' },
      ],
      caption: 'Step 2: Heap ordered by pair sum. Pop (1,2)=3 → push (7,2)=9 (next in nums1). Result: [(1,2)].',
    },
    {
      type: 'array',
      cells: [
        { value: '[1,2]', status: 'result', label: 'sum=3' },
        { value: '[1,4]', status: 'result', label: 'sum=5' },
        { value: '[1,6]', status: 'result', label: 'sum=7' },
      ],
      caption: 'Step 3: k=3 pops → [[1,2],[1,4],[1,6]]. Each pop pushes the next candidate from that row.',
    },
  ],

  // 239: Sliding Window Maximum  [3,3,1,3,1,2,3,1], k=3
  239: [
    {
      type: 'array',
      cells: [
        { value: 3, status: 'active',   label: 'i=0' },
        { value: 3, status: 'active',   label: 'i=1' },
        { value: 1, status: 'active',   label: 'i=2 →' },
        { value: 3, status: 'default',  label: 'i=3' },
        { value: 1, status: 'default',  label: 'i=4' },
        { value: 2, status: 'default',  label: 'i=5' },
      ],
      caption: 'Step 1: First window [3,3,1]. Monotone-dec deque: push 3(i=0); push 3(i=1) pops i=0 (equal); push 1(i=2) stays. Deque=[1,2]. Max=nums[dq.front]=3.',
    },
    {
      type: 'array',
      cells: [
        { value: 3, status: 'eliminated', label: 'i=0' },
        { value: 3, status: 'selected',   label: 'i=1' },
        { value: 1, status: 'selected',   label: 'i=2' },
        { value: 3, status: 'comparing',  label: 'i=3 →' },
        { value: 1, status: 'default',    label: 'i=4' },
        { value: 2, status: 'default',    label: 'i=5' },
      ],
      caption: 'Step 2: i=3 (val=3). Remove from back while 3≥nums[back]: pop i=2(1), pop i=1(3). Push i=3. Remove front if outside window. Deque=[3]. Max=3.',
    },
    {
      type: 'array',
      cells: [
        { value: 3, status: 'result', label: 'w1' },
        { value: 3, status: 'result', label: 'w2' },
        { value: 3, status: 'result', label: 'w3' },
        { value: 3, status: 'result', label: 'w4' },
      ],
      caption: 'Step 3: Result = [3,3,3,3]. O(n) — each element enters/leaves deque at most once.',
    },
  ],

  // ─── Stacks extra ───────────────────────────────────────────────────────────

  // 155: Min Stack
  155: [
    {
      type: 'stack',
      cells: [
        { value: -3, status: 'active',   annotation: 'min:-3' },
        { value: 0,  status: 'default',  annotation: 'min: 0' },
        { value: 3,  status: 'default',  annotation: 'min: 3' },
      ],
      action: 'push',
      actionValue: -3,
      caption: 'Step 1: Each stack node pairs (value, current-min). Push -3: new min = min(-3, prev_min=0) = -3.',
    },
    {
      type: 'stack',
      cells: [
        { value: 0,  status: 'active',  annotation: 'min: 0' },
        { value: 3,  status: 'default', annotation: 'min: 3' },
      ],
      action: 'pop',
      actionValue: -3,
      caption: 'Step 2: pop() removes -3. getMin() is now the annotation of the new top = 0.',
    },
    {
      type: 'stack',
      cells: [
        { value: 0, status: 'result', annotation: 'min: 0 ★' },
        { value: 3, status: 'default', annotation: 'min: 3' },
      ],
      action: 'idle',
      caption: 'Step 3: getMin() → peek at top\'s stored min = 0. All ops are O(1).',
    },
  ],

  // 150: Evaluate Reverse Polish Notation  ["2","1","+","3","*"]
  150: [
    {
      type: 'stack',
      cells: [
        { value: 1, status: 'active' },
        { value: 2, status: 'default' },
      ],
      action: 'push',
      actionValue: 1,
      caption: 'Step 1: Push numbers. Token "2" → push 2. Token "1" → push 1. Stack: [2,1] (top=1).',
    },
    {
      type: 'stack',
      cells: [
        { value: 3, status: 'selected' },
      ],
      action: 'pop',
      actionValue: '1+2=3',
      caption: 'Step 2: Token "+". Pop b=1, pop a=2. Push a+b=3. Stack: [3].',
    },
    {
      type: 'stack',
      cells: [
        { value: 9, status: 'result' },
      ],
      action: 'pop',
      actionValue: '3×3=9',
      caption: 'Step 3: Push 3, then token "*". Pop b=3, pop a=3. Push 3*3=9. Stack: [9] → return 9.',
    },
  ],

  // 394: Decode String  "3[a2[c]]"
  394: [
    {
      type: 'stack',
      cells: [
        { value: '3', status: 'comparing', annotation: 'count' },
        { value: '""', status: 'default', annotation: 'str' },
      ],
      action: 'push',
      actionValue: '3,[',
      caption: 'Step 1: See "3[": push (current_str="", k=3) onto stack. Reset current_str="", k=0.',
    },
    {
      type: 'stack',
      cells: [
        { value: '2', status: 'comparing', annotation: 'count' },
        { value: '"a"', status: 'active', annotation: 'str' },
        { value: '3', status: 'default', annotation: 'count' },
        { value: '""', status: 'default', annotation: 'str' },
      ],
      action: 'push',
      actionValue: '2,[',
      caption: 'Step 2: Append "a". See "2[": push ("a",2). current_str="", k=0.',
    },
    {
      type: 'array',
      cells: [
        { value: 'a', status: 'result', label: '' },
        { value: 'c', status: 'result', label: '' },
        { value: 'c', status: 'result', label: 'x2' },
        { value: 'a', status: 'selected', label: '' },
        { value: 'c', status: 'selected', label: '' },
        { value: 'c', status: 'selected', label: 'x3' },
      ],
      caption: 'Step 3: "]": pop → "a"+"cc"×2 = "acc". Next "]": pop → ""+"acc"×3 = "accaccacc".',
    },
  ],

  // ─── Hashing extra ──────────────────────────────────────────────────────────

  // 242: Valid Anagram  s="anagram", t="nagaram"
  242: [
    {
      type: 'hashmap',
      entries: [
        { key: 'a', value: '3→0', status: 'active' },
        { key: 'n', value: '1→0', status: 'active' },
        { key: 'g', value: '1→0', status: 'active' },
        { key: 'r', value: '1→0', status: 'active' },
        { key: 'm', value: '1→0', status: 'active' },
      ],
      caption: 'Step 1: Build freq map from s. Decrement for each char in t. All zeroes → anagram.',
    },
    {
      type: 'array',
      cells: [
        { value: 'a',  status: 'selected',  label: 's[0]' },
        { value: 'n',  status: 'selected',  label: 's[1]' },
        { value: 'a',  status: 'selected',  label: 's[2]' },
        { value: 'g',  status: 'selected',  label: 's[3]' },
        { value: 'n',  status: 'comparing', label: 't[0]' },
        { value: 'a',  status: 'comparing', label: 't[1]' },
        { value: 'g',  status: 'comparing', label: 't[2]' },
      ],
      caption: 'Step 2: +1 for s chars, -1 for t chars. If any count ≠ 0 → not anagram.',
    },
    {
      type: 'hashmap',
      entries: [
        { key: 'a', value: '0 ✓', status: 'result' },
        { key: 'n', value: '0 ✓', status: 'result' },
        { key: 'g', value: '0 ✓', status: 'result' },
        { key: 'r', value: '0 ✓', status: 'result' },
        { key: 'm', value: '0 ✓', status: 'result' },
      ],
      caption: 'Step 3: All counts = 0 → true. Optimisation: int[26] instead of HashMap.',
    },
  ],

  // 49: Group Anagrams  ["eat","tea","tan","ate","nat","bat"]
  49: [
    {
      type: 'hashmap',
      entries: [
        { key: '"aet"', value: '[eat,tea,ate]', status: 'active' },
        { key: '"ant"', value: '[tan,nat]',     status: 'active' },
        { key: '"abt"', value: '[bat]',          status: 'selected' },
      ],
      caption: 'Step 1: Sort each word alphabetically as the key. "eat"→"aet", "tea"→"aet" → same bucket.',
    },
    {
      type: 'array',
      cells: [
        { value: '"aet"', status: 'active',   label: 'key' },
        { value: 'eat',   status: 'selected', label: '' },
        { value: 'tea',   status: 'selected', label: '' },
        { value: 'ate',   status: 'selected', label: '' },
      ],
      caption: 'Step 2: Group by sorted-string key. All 3 map to "aet". O(n·k·log k).',
    },
  ],

  // 560: Subarray Sum Equals K  [1,1,1], k=2
  560: [
    {
      type: 'hashmap',
      entries: [
        { key: 'prefix=0', value: 'count: 1', status: 'comparing' },
      ],
      caption: 'Step 1: Init map {0:1}. The "1" handles subarrays starting at index 0.',
    },
    {
      type: 'array',
      cells: [
        { value: 1, status: 'selected',  label: 'sum=1' },
        { value: 1, status: 'active',    label: 'sum=2' },
        { value: 1, status: 'comparing', label: 'sum=3' },
      ],
      caption: 'Step 2: i=1, sum=2. Need sum-k=2-2=0. map[0]=1 → count+=1. i=2, sum=3. Need 1 → map[1]=1 → count+=1.',
    },
    {
      type: 'hashmap',
      entries: [
        { key: 'prefix=0', value: 'count: 1', status: 'default' },
        { key: 'prefix=1', value: 'count: 1', status: 'result' },
        { key: 'prefix=2', value: 'count: 1', status: 'result' },
        { key: 'prefix=3', value: 'count: 1', status: 'active' },
      ],
      caption: 'Step 3: Total count = 2. Subarrays: [1,1] at i=0..1 and i=1..2. Works with negatives too.',
    },
  ],

  // ─── Queues / BFS extra ─────────────────────────────────────────────────────

  // 933: Number of Recent Calls
  933: [
    {
      type: 'stack',
      cells: [
        { value: 100, status: 'active' },
      ],
      action: 'push',
      actionValue: 100,
      caption: 'Step 1: ping(100). Queue=[100]. Window [100-3000,100]. Count=1.',
    },
    {
      type: 'stack',
      cells: [
        { value: 3001, status: 'active' },
        { value: 1000, status: 'selected' },
        { value: 100,  status: 'comparing' },
      ],
      action: 'push',
      actionValue: 3001,
      caption: 'Step 2: ping(3001). Queue=[100,1000,3001]. Window=[1,3001]. 100<1 → dequeue. Count=3.',
    },
    {
      type: 'stack',
      cells: [
        { value: 3002, status: 'result' },
        { value: 3001, status: 'active' },
        { value: 1000, status: 'active' },
      ],
      action: 'idle',
      caption: 'Step 3: Queue only holds calls in [t-3000, t]. Old calls are dequeued from front. O(1) amortized.',
    },
  ],

  // 200: Number of Islands  grid example
  200: [
    {
      type: 'grid',
      grid: [
        ['selected', 'selected', 'empty',    'empty',   'selected'],
        ['selected', 'selected', 'empty',    'empty',   'empty'  ],
        ['empty',    'empty',    'selected', 'empty',   'empty'  ],
        ['empty',    'empty',    'empty',    'selected','selected'],
      ],
      caption: 'Step 1: Grid has 4 islands (connected components of "1"). Scan for unvisited land cells.',
    },
    {
      type: 'grid',
      grid: [
        ['visited', 'visited', 'empty',   'empty',   'selected'],
        ['visited', 'visited', 'empty',   'empty',   'empty'   ],
        ['empty',   'empty',   'selected','empty',   'empty'   ],
        ['empty',   'empty',   'empty',   'selected','selected'],
      ],
      queue: ['(0,0)→flood-fill'],
      caption: 'Step 2: Find "1" at (0,0). BFS/DFS flood-fills entire island → mark all as visited. Count=1.',
    },
    {
      type: 'grid',
      grid: [
        ['visited', 'visited', 'empty',   'empty',   'visited'],
        ['visited', 'visited', 'empty',   'empty',   'empty'  ],
        ['empty',   'empty',   'visited', 'empty',   'empty'  ],
        ['empty',   'empty',   'empty',   'visited', 'visited'],
      ],
      queue: [],
      caption: 'Step 3: All islands flood-filled. 4 separate components → return 4.',
    },
  ],

  // ─── Intervals extra ────────────────────────────────────────────────────────

  // 57: Insert Interval  [[1,3],[6,9]], newInterval=[2,5]
  57: [
    {
      type: 'interval',
      intervals: [
        { start: 1, end: 3, status: 'selected', label: '[1,3]' },
        { start: 2, end: 5, status: 'comparing', label: '[2,5] new →' },
        { start: 6, end: 9, status: 'default',   label: '[6,9]' },
      ],
      domain: [0, 10],
      caption: 'Step 1: New interval [2,5] overlaps [1,3] (2≤3). Merge: [min(1,2), max(3,5)] = [1,5].',
    },
    {
      type: 'interval',
      intervals: [
        { start: 1, end: 5, status: 'result',   label: '[1,5] merged ★' },
        { start: 6, end: 9, status: 'selected', label: '[6,9]' },
      ],
      domain: [0, 10],
      caption: 'Step 2: [1,5] does NOT overlap [6,9] (5 < 6). Insert [6,9] as-is. Result: [[1,5],[6,9]].',
    },
  ],

  // ─── Binary Search extra ────────────────────────────────────────────────────

  // 153: Find Minimum in Rotated Sorted Array  [3,4,5,1,2]
  153: [
    {
      type: 'array',
      cells: [
        { value: 3, status: 'selected',  label: 'L=0' },
        { value: 4, status: 'default',   label: '' },
        { value: 5, status: 'active',    label: 'MID=2' },
        { value: 1, status: 'highlight', label: '' },
        { value: 2, status: 'selected',  label: 'R=4' },
      ],
      caption: 'Step 1: MID=2 (val=5). nums[MID]=5 > nums[R]=2 → pivot is in RIGHT half. L=MID+1=3.',
    },
    {
      type: 'array',
      cells: [
        { value: 3, status: 'eliminated', label: '' },
        { value: 4, status: 'eliminated', label: '' },
        { value: 5, status: 'eliminated', label: '' },
        { value: 1, status: 'active',     label: 'L=MID=3' },
        { value: 2, status: 'selected',   label: 'R=4' },
      ],
      caption: 'Step 2: L=3,R=4. MID=3 (val=1). nums[MID]=1 ≤ nums[R]=2 → min is in left half incl. MID. R=MID=3.',
    },
    {
      type: 'array',
      cells: [
        { value: 3, status: 'eliminated', label: '' },
        { value: 4, status: 'eliminated', label: '' },
        { value: 5, status: 'eliminated', label: '' },
        { value: 1, status: 'result',     label: 'L=R=3 ★' },
        { value: 2, status: 'eliminated', label: '' },
      ],
      caption: 'Step 3: L==R==3 → converged. nums[3]=1 is the minimum.',
    },
  ],

  // 74: Search a 2D Matrix  matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3
  74: [
    {
      type: 'array',
      cells: [
        { value: 1,  status: 'selected',  label: 'L=0' },
        { value: 3,  status: 'default',   label: '' },
        { value: 5,  status: 'default',   label: '' },
        { value: 7,  status: 'default',   label: '' },
        { value: 10, status: 'active',    label: 'MID=4' },
        { value: 11, status: 'default',   label: '' },
        { value: 16, status: 'default',   label: '' },
        { value: 20, status: 'default',   label: '' },
        { value: 23, status: 'default',   label: '' },
        { value: 30, status: 'default',   label: '' },
        { value: 34, status: 'default',   label: '' },
        { value: 60, status: 'selected',  label: 'R=11' },
      ],
      caption: 'Step 1: Treat m×n matrix as flat sorted array. n=4. MID=4 → row=4/4=1, col=4%4=0 → matrix[1][0]=10. target=3<10 → R=MID-1=3.',
    },
    {
      type: 'array',
      cells: [
        { value: 1,  status: 'selected',  label: 'L=0' },
        { value: 3,  status: 'active',    label: 'MID=1 ★' },
        { value: 5,  status: 'default',   label: '' },
        { value: 7,  status: 'selected',  label: 'R=3' },
        { value: 10, status: 'eliminated', label: '' },
        { value: 11, status: 'eliminated', label: '' },
        { value: 16, status: 'eliminated', label: '' },
        { value: 20, status: 'eliminated', label: '' },
        { value: 23, status: 'eliminated', label: '' },
        { value: 30, status: 'eliminated', label: '' },
        { value: 34, status: 'eliminated', label: '' },
        { value: 60, status: 'eliminated', label: '' },
      ],
      caption: 'Step 2: L=0,R=3. MID=1 → row=0,col=1 → matrix[0][1]=3. 3==target → return true ✓',
    },
  ],

  // ─── Linked List ────────────────────────────────────────────────────────────

  // 141: Linked List Cycle  3→2→0→-4→(back to 2)
  141: [
    {
      type: 'pointer-list',
      rows: [{
        label: 'List (linearized — cycle shown by ↩ at -4):',
        nodes: [
          { id: 0, value: '3',  status: 'default' },
          { id: 1, value: '2',  status: 'default' },
          { id: 2, value: '0',  status: 'default' },
          { id: 3, value: '-4', status: 'highlight' },
        ],
        pointers: [
          { nodeId: 0, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 0, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 1: Both pointers start at head (3). SLOW moves ×1, FAST moves ×2. -4 cycles back to 2.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 0, value: '3',  status: 'eliminated' },
          { id: 1, value: '2',  status: 'active' },
          { id: 2, value: '0',  status: 'comparing' },
          { id: 3, value: '-4', status: 'highlight' },
        ],
        pointers: [
          { nodeId: 1, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 2, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 2: SLOW→2, FAST→0. Iteration 1 done. FAST is ahead by 2× speed.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 0, value: '3',  status: 'eliminated' },
          { id: 1, value: '2',  status: 'eliminated' },
          { id: 2, value: '0',  status: 'eliminated' },
          { id: 3, value: '-4', status: 'result' },
        ],
        pointers: [
          { nodeId: 3, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 3: SLOW=-4, FAST=-4. SLOW==FAST → CYCLE DETECTED! Return true ✓',
    },
  ],

  // 876: Middle of Linked List  [1,2,3,4,5]
  876: [
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 1, value: 1, status: 'default' },
          { id: 2, value: 2, status: 'default' },
          { id: 3, value: 3, status: 'default' },
          { id: 4, value: 4, status: 'default' },
          { id: 5, value: 5, status: 'default' },
        ],
        pointers: [
          { nodeId: 1, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 1, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 1: Both start at head (1). SLOW ×1, FAST ×2.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 1, value: 1, status: 'eliminated' },
          { id: 2, value: 2, status: 'active' },
          { id: 3, value: 3, status: 'highlight' },
          { id: 4, value: 4, status: 'comparing' },
          { id: 5, value: 5, status: 'default' },
        ],
        pointers: [
          { nodeId: 2, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 2: Iter 1 → SLOW=2, FAST=3. Iter 2 → SLOW=3, FAST=5.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 1, value: 1, status: 'eliminated' },
          { id: 2, value: 2, status: 'eliminated' },
          { id: 3, value: 3, status: 'result' },
          { id: 4, value: 4, status: 'default' },
          { id: 5, value: 5, status: 'default' },
        ],
        pointers: [
          { nodeId: 3, label: 'SLOW ★', color: '#43E97B', emoji: '🐢' },
          { nodeId: 5, label: 'FAST',   color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 3: FAST.next=null → loop ends. SLOW=3 = middle node. Return slow.',
    },
  ],

  // 206: Reverse Linked List  [1,2,3,4,5]
  206: [
    {
      type: 'pointer-list',
      rows: [{
        label: 'Original:',
        nodes: [
          { id: 1, value: 1, status: 'active'   },
          { id: 2, value: 2, status: 'default'  },
          { id: 3, value: 3, status: 'default'  },
          { id: 4, value: 4, status: 'default'  },
          { id: 5, value: 5, status: 'default'  },
        ],
        pointers: [
          { nodeId: 1, label: 'CURR', color: '#6C63FF' },
        ],
      }],
      caption: 'Step 1: prev=null, curr=1. Save next=2, point 1.next→null (null=prev). Advance prev=1, curr=2.',
    },
    {
      type: 'pointer-list',
      rows: [{
        label: 'In progress (arrows reversed so far):',
        nodes: [
          { id: 1, value: 1, status: 'selected'  },
          { id: 2, value: 2, status: 'active'    },
          { id: 3, value: 3, status: 'comparing' },
          { id: 4, value: 4, status: 'default'   },
          { id: 5, value: 5, status: 'default'   },
        ],
        pointers: [
          { nodeId: 1, label: 'PREV', color: '#43E97B' },
          { nodeId: 2, label: 'CURR', color: '#6C63FF' },
          { nodeId: 3, label: 'NEXT', color: '#FF8C00' },
        ],
      }],
      caption: 'Step 2: prev=1, curr=2. Save next=3, point 2.next→1. Advance prev=2, curr=3.',
    },
    {
      type: 'pointer-list',
      rows: [{
        label: 'Reversed:',
        nodes: [
          { id: 5, value: 5, status: 'result' },
          { id: 4, value: 4, status: 'result' },
          { id: 3, value: 3, status: 'result' },
          { id: 2, value: 2, status: 'result' },
          { id: 1, value: 1, status: 'result' },
        ],
        pointers: [
          { nodeId: 5, label: 'HEAD★', color: '#FF6584' },
        ],
      }],
      caption: 'Step 3: curr=null → done. prev=5 is new head. Return prev.',
    },
  ],

  // 21: Merge Two Sorted Lists  l1=[1,2,4]  l2=[1,3,4]
  21: [
    {
      type: 'pointer-list',
      rows: [
        {
          label: 'L1:',
          nodes: [
            { id: 11, value: 1, status: 'active'   },
            { id: 12, value: 2, status: 'default'  },
            { id: 13, value: 4, status: 'default'  },
          ],
          pointers: [{ nodeId: 11, label: 'P1', color: '#6C63FF' }],
        },
        {
          label: 'L2:',
          nodes: [
            { id: 21, value: 1, status: 'comparing' },
            { id: 22, value: 3, status: 'default'   },
            { id: 23, value: 4, status: 'default'   },
          ],
          pointers: [{ nodeId: 21, label: 'P2', color: '#FF8C00' }],
        },
      ],
      caption: 'Step 1: Compare P1(1) vs P2(1). Equal → pick L1 (stable). Attach 1, advance P1.',
    },
    {
      type: 'pointer-list',
      rows: [
        {
          label: 'L1:',
          nodes: [
            { id: 11, value: 1, status: 'eliminated' },
            { id: 12, value: 2, status: 'active'     },
            { id: 13, value: 4, status: 'default'    },
          ],
          pointers: [{ nodeId: 12, label: 'P1', color: '#6C63FF' }],
        },
        {
          label: 'L2:',
          nodes: [
            { id: 21, value: 1, status: 'comparing' },
            { id: 22, value: 3, status: 'default'   },
            { id: 23, value: 4, status: 'default'   },
          ],
          pointers: [{ nodeId: 21, label: 'P2', color: '#FF8C00' }],
        },
      ],
      caption: 'Step 2: P1=2 vs P2=1. 1<2 → pick L2(1), advance P2.',
    },
    {
      type: 'pointer-list',
      rows: [{
        label: 'Result (dummy.next):',
        nodes: [
          { id: 11, value: 1, status: 'result' },
          { id: 21, value: 1, status: 'result' },
          { id: 12, value: 2, status: 'result' },
          { id: 22, value: 3, status: 'result' },
          { id: 13, value: 4, status: 'result' },
          { id: 23, value: 4, status: 'result' },
        ],
      }],
      caption: 'Step 3: Merged: 1→1→2→3→4→4. Dummy head technique eliminates null checks.',
    },
  ],

  // 19: Remove Nth From End  [1,2,3,4,5], n=2
  19: [
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 0, value: 'D', status: 'comparing'  },
          { id: 1, value: 1,   status: 'default'    },
          { id: 2, value: 2,   status: 'default'    },
          { id: 3, value: 3,   status: 'active'     },
          { id: 4, value: 4,   status: 'highlight'  },
          { id: 5, value: 5,   status: 'default'    },
        ],
        pointers: [
          { nodeId: 0, label: 'SLOW', color: '#43E97B' },
          { nodeId: 3, label: 'FAST', color: '#FF6584' },
        ],
      }],
      caption: 'Step 1: FAST advances n+1=3 steps from dummy (D). Gap of 3 ensures SLOW lands one before target.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 0, value: 'D', status: 'default'    },
          { id: 1, value: 1,   status: 'eliminated' },
          { id: 2, value: 2,   status: 'eliminated' },
          { id: 3, value: 3,   status: 'active'     },
          { id: 4, value: 4,   status: 'comparing'  },
          { id: 5, value: 5,   status: 'selected'   },
        ],
        pointers: [
          { nodeId: 3, label: 'SLOW', color: '#43E97B' },
          { nodeId: 5, label: 'FAST', color: '#FF6584' },
        ],
      }],
      caption: 'Step 2: Move both until FAST=null. SLOW=3 (one before 4th from end). Delete slow.next=4.',
    },
    {
      type: 'pointer-list',
      rows: [{
        label: 'Result:',
        nodes: [
          { id: 1, value: 1, status: 'result' },
          { id: 2, value: 2, status: 'result' },
          { id: 3, value: 3, status: 'result' },
          { id: 5, value: 5, status: 'result' },
        ],
      }],
      caption: 'Step 3: Node 4 removed. slow.next = slow.next.next. Return dummy.next.',
    },
  ],

  // 142: Linked List Cycle II (cycle entry)
  142: [
    {
      type: 'pointer-list',
      rows: [{
        label: 'Phase 1 — Detect meeting point:',
        nodes: [
          { id: 0, value: '3',  status: 'default'   },
          { id: 1, value: '2',  status: 'highlight' },
          { id: 2, value: '0',  status: 'default'   },
          { id: 3, value: '-4', status: 'active'    },
        ],
        pointers: [
          { nodeId: 3, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 1: SLOW and FAST meet at -4 (inside cycle). Phase 1 complete.',
    },
    {
      type: 'pointer-list',
      rows: [{
        label: 'Phase 2 — Find entry (reset SLOW to head):',
        nodes: [
          { id: 0, value: '3',  status: 'active'   },
          { id: 1, value: '2',  status: 'highlight' },
          { id: 2, value: '0',  status: 'default'   },
          { id: 3, value: '-4', status: 'comparing' },
        ],
        pointers: [
          { nodeId: 0, label: 'SLOW', color: '#43E97B', emoji: '🐢' },
          { nodeId: 3, label: 'FAST', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 2: Reset SLOW to head (3). Both now advance 1 step at a time.',
    },
    {
      type: 'pointer-list',
      rows: [{
        nodes: [
          { id: 0, value: '3',  status: 'eliminated' },
          { id: 1, value: '2',  status: 'result'     },
          { id: 2, value: '0',  status: 'default'    },
          { id: 3, value: '-4', status: 'default'    },
        ],
        pointers: [
          { nodeId: 1, label: 'SLOW★', color: '#43E97B', emoji: '🐢' },
          { nodeId: 1, label: 'FAST★', color: '#FF6584', emoji: '🐇' },
        ],
      }],
      caption: 'Step 3: SLOW=2, FAST=2 → they meet at the cycle entry node (2). Return slow.',
    },
  ],

};
