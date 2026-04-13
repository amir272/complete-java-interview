export interface Concept {
  id: string;
  title: string;
  icon: string;
  tagline: string;          // one-line "elevator pitch"
  explanation: string;      // full prose explanation
  complexity?: {
    time: string;
    space: string;
    note?: string;
  };
  keyPoints: string[];      // bullet list of must-know facts
  whenToUse: string;        // trigger signals to spot this in an interview
  codeTemplate?: string;    // Java code skeleton / template
}

// ─── Heaps / Priority Queue ───────────────────────────────────────────────────
const heapConcepts: Concept[] = [
  {
    id: 'binary-heap',
    title: 'Binary Heap',
    icon: '🏔️',
    tagline: 'A complete binary tree where every parent is ≤ its children (min-heap).',
    explanation:
      'A binary heap is a complete binary tree stored compactly in an array. ' +
      'In a min-heap the root is always the smallest element; in a max-heap it is the largest. ' +
      'The array representation uses 1-based indexing: parent of node i is at i/2, left child at 2i, right child at 2i+1 (0-based: parent at (i-1)/2, children at 2i+1 and 2i+2). ' +
      'Insertion adds the element at the end, then "sifts up" by swapping with the parent until the heap property is restored. ' +
      'Extraction removes the root, places the last element there, then "sifts down". ' +
      'Building a heap from an unsorted array is O(n) — not O(n log n) — because most sift-down operations touch only a few levels.',
    complexity: { time: 'Insert O(log n) · Extract O(log n) · Peek O(1) · Build O(n)', space: 'O(n)' },
    keyPoints: [
      'Always a COMPLETE binary tree (filled left to right).',
      'Parent ≤ children (min-heap) or parent ≥ children (max-heap).',
      'Root = global minimum (min-heap) or maximum (max-heap).',
      'Stored as an array — no node objects or pointers needed.',
      'Heapify from last non-leaf downward = O(n) build.',
    ],
    whenToUse:
      'Keywords: "kth largest/smallest", "top K", "stream", "median", "schedule by priority". Any time you need repeated access to the extreme (min or max) element.',
    codeTemplate:
`// Java — min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Custom object heap (sorted by first element)
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

minHeap.offer(val);     // insert   O(log n)
minHeap.poll();         // extract  O(log n)
minHeap.peek();         // view min O(1)
minHeap.size();`,
  },
  {
    id: 'top-k-pattern',
    title: 'Top-K Pattern (Fixed-Size Heap)',
    icon: '🥇',
    tagline: 'Keep a min-heap of exactly K elements to find the K largest.',
    explanation:
      'To find the K largest elements from a stream of n numbers without sorting everything, maintain a min-heap of size exactly K. ' +
      'For every incoming element: if the heap has fewer than K items, push it in. ' +
      'Otherwise, compare with heap.peek() (the smallest in the top-K so far). ' +
      'If the new element is larger, pop the smallest and push the new element. ' +
      'After processing all n elements the heap holds exactly the K largest, and heap.peek() is the Kth largest. ' +
      'This beats sorting (O(n log n)) when K is much smaller than n.',
    complexity: { time: 'O(n log k)', space: 'O(k)', note: 'Far better than O(n log n) sort when k << n' },
    keyPoints: [
      'Use a MIN-heap to track K LARGEST (counterintuitive but correct).',
      'Keep heap size exactly K — poll when size exceeds K.',
      'heap.peek() after full traversal = Kth largest.',
      'Works for streaming data — processes one element at a time.',
      'Flip to MAX-heap + K smallest for the symmetric problem.',
    ],
    whenToUse:
      '"Top K frequent", "K largest in stream", "K closest points". Any problem asking for a fixed-size extreme set.',
    codeTemplate:
`public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // evict the smallest
        }
    }
    return minHeap.peek(); // Kth largest
}`,
  },
  {
    id: 'two-heaps-median',
    title: 'Two-Heaps: Running Median',
    icon: '⚖️',
    tagline: 'Split the data stream into two halves; median lives at their boundary.',
    explanation:
      'To find the running median from a data stream, maintain two heaps: ' +
      'a max-heap for the lower half (so its root = maximum of lower half) and a min-heap for the upper half (root = minimum of upper half). ' +
      'After each insertion, rebalance so their sizes differ by at most 1. ' +
      'If the stream has an odd number of elements, the larger heap holds the extra element and its root IS the median. ' +
      'If even, the median is the average of both roots. ' +
      'Each insertion + rebalance takes O(log n) and median query is O(1).',
    complexity: { time: 'Insert O(log n) · Median O(1)', space: 'O(n)' },
    keyPoints: [
      'Lower half → max-heap. Upper half → min-heap.',
      'Invariant: maxHeap.size() == minHeap.size() OR maxHeap.size() == minHeap.size() + 1.',
      'Always ensure maxHeap.peek() ≤ minHeap.peek() (cross-check after insert).',
      'Median = maxHeap.peek() if odd total, else average of both peaks.',
    ],
    whenToUse:
      '"Find median from data stream", "sliding window median". Whenever you need a running median over a dynamic dataset.',
    codeTemplate:
`PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
PriorityQueue<Integer> hi = new PriorityQueue<>(); // min-heap

void addNum(int num) {
    lo.offer(num);
    hi.offer(lo.poll());          // balance: ensure lo.max <= hi.min
    if (lo.size() < hi.size())
        lo.offer(hi.poll());      // keep lo size >= hi size
}

double findMedian() {
    return lo.size() > hi.size()
        ? lo.peek()
        : (lo.peek() + hi.peek()) / 2.0;
}`,
  },
];

// ─── Stacks / Monotonic Stack ─────────────────────────────────────────────────
const stackConcepts: Concept[] = [
  {
    id: 'stack-lifo',
    title: 'Stack (LIFO)',
    icon: '📚',
    tagline: 'Last-In First-Out — the fundamental tool for nested structures and DFS.',
    explanation:
      'A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle: ' +
      'the last element pushed is the first to be popped. ' +
      'It models function call frames, undo operations, browser history, and any situation where you need to remember and reverse a sequence. ' +
      'In Java, prefer Deque (ArrayDeque) over the legacy Stack class — ArrayDeque has no synchronization overhead and is roughly 2x faster. ' +
      'Common patterns: balanced parentheses (push open, pop on close), DFS iteration (use explicit stack instead of recursion), ' +
      'expression evaluation (operator + operand stacks), and backtracking.',
    complexity: { time: 'Push/Pop/Peek O(1)', space: 'O(n)' },
    keyPoints: [
      'Push (addLast) and pop (removeLast) are both O(1).',
      'Use ArrayDeque in Java — never the legacy Stack class.',
      'Models recursion: any recursive algorithm can be rewritten with an explicit stack.',
      'Balanced brackets: push opening brackets, pop and match on closing brackets.',
      'Min-stack: pair each element with the running minimum at that point.',
    ],
    whenToUse:
      '"Valid parentheses", "decode string", "simplify path", "evaluate expression", iterative DFS, undo/redo, anything with matched pairs or nested depth.',
    codeTemplate:
`Deque<Integer> stack = new ArrayDeque<>();
stack.push(val);       // push (addFirst)
stack.pop();           // pop  (removeFirst) — throws if empty
stack.peek();          // top  (peekFirst)   — throws if empty
stack.isEmpty();

// Safe version:
int top = stack.isEmpty() ? -1 : stack.peek();`,
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    icon: '📉',
    tagline: 'A stack that stays monotonically ordered — pops give you the "next greater/smaller" element.',
    explanation:
      'A monotonic stack is a stack where elements are kept in strictly increasing or decreasing order. ' +
      'When you push a new element, first pop all elements that violate the desired order. ' +
      'The key insight: at the moment you pop an element X because a new element Y arrived, Y is the NEXT GREATER (or smaller) element for X. ' +
      'A monotone INCREASING stack (bottom→top is increasing) finds the "next smaller" element for each popped value. ' +
      'A monotone DECREASING stack finds the "next greater" element for each popped value. ' +
      'For histograms: maintain an increasing stack of bar indices. When a shorter bar arrives, pop taller bars and calculate rectangles using the popped bar as height.',
    complexity: { time: 'O(n) — each element pushed/popped exactly once', space: 'O(n)' },
    keyPoints: [
      'Monotone DECREASING stack → pops reveal the NEXT GREATER element.',
      'Monotone INCREASING stack → pops reveal the NEXT SMALLER element.',
      'Each element enters and leaves the stack exactly once → total O(n).',
      'For histograms: push indices, not values — you need to calculate widths.',
      'Often push a sentinel (e.g., -1 or 0) to handle edge cases.',
    ],
    whenToUse:
      '"Next greater element", "daily temperatures", "largest rectangle in histogram", "stock span", "remove K digits", "132 pattern". Any problem asking about the nearest element that is larger or smaller.',
    codeTemplate:
`// Next Greater Element (monotone decreasing stack)
int[] result = new int[nums.length];
Arrays.fill(result, -1);
Deque<Integer> stack = new ArrayDeque<>(); // stores indices

for (int i = 0; i < nums.length; i++) {
    // Pop while current element is greater than stack top
    while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
        int idx = stack.pop();
        result[idx] = nums[i]; // nums[i] is next greater for idx
    }
    stack.push(i);
}`,
  },
];

// ─── Hashing / Maps ───────────────────────────────────────────────────────────
const hashingConcepts: Concept[] = [
  {
    id: 'hashmap-internals',
    title: 'HashMap Internals',
    icon: '🗂️',
    tagline: 'A hash function maps keys to array buckets — O(1) average lookup, O(n) worst case.',
    explanation:
      'A HashMap stores key-value pairs in an array of buckets. ' +
      'The hash function converts a key to a bucket index via key.hashCode() % capacity. ' +
      'Collisions (two keys mapping to the same bucket) are resolved with chaining: ' +
      'each bucket is a linked list of entries. Java 8+ converts a bucket to a balanced BST (red-black tree) when it grows beyond 8 entries, reducing worst-case lookup from O(n) to O(log n). ' +
      'The default load factor is 0.75 — when 75% of buckets are occupied the map resizes (doubles capacity and rehashes all entries, costing O(n)). ' +
      'Resize is amortized O(1) per insertion. ' +
      'HashMap is NOT ordered. LinkedHashMap preserves insertion order. TreeMap keeps keys sorted (O(log n) operations).',
    complexity: { time: 'Get/Put/Remove O(1) avg · O(log n) worst (Java 8+)', space: 'O(n)' },
    keyPoints: [
      'hashCode() + equals() contract: equal objects MUST have equal hash codes.',
      'Load factor 0.75: resize (rehash) when table is 75% full.',
      'Java 8+: buckets become red-black trees at size 8 — prevents O(n) hash collision attacks.',
      'HashMap: unordered. LinkedHashMap: insertion order. TreeMap: sorted by key.',
      'Use computeIfAbsent / getOrDefault for clean frequency-counting code.',
    ],
    whenToUse:
      'Any O(1) lookup requirement: two-sum, duplicate detection, caching, grouping, frequency counting, inverse index.',
    codeTemplate:
`Map<Integer, Integer> freq = new HashMap<>();
// Frequency count
for (int x : arr)
    freq.merge(x, 1, Integer::sum); // or:
    freq.put(x, freq.getOrDefault(x, 0) + 1);

// Lookup with default
int count = freq.getOrDefault(key, 0);

// Group by key
Map<String, List<String>> groups = new HashMap<>();
groups.computeIfAbsent(key, k -> new ArrayList<>()).add(value);`,
  },
  {
    id: 'two-sum-pattern',
    title: 'Two-Sum / Complement Pattern',
    icon: '🎯',
    tagline: 'Store what you\'ve seen; check if the complement exists — O(n) with a HashMap.',
    explanation:
      'The core idea: for every element x, you need (target - x). ' +
      'Instead of using two nested loops (O(n²)), store each element in a HashSet or HashMap as you iterate. ' +
      'For each new element, check if its complement is already in the map. ' +
      'This works because if a + b = target, one of them is always processed before the other. ' +
      'The pattern generalises: "subarray sum equals K" uses a prefix-sum variant, "4-sum" chains two-sum, ' +
      'and "valid anagram" uses a frequency map where all counts must reach zero.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    keyPoints: [
      'Single pass: check map first, then insert (avoids using same element twice).',
      'Store index in the map if you need to return positions, not just existence.',
      'For K-sum: fix k-2 elements with nested loops, apply two-sum on the remainder.',
      'Sorted array variant: two pointers instead of hashmap — O(1) space.',
    ],
    whenToUse:
      '"Two sum", "pair with target", "subarray with target sum", "valid anagram", "four sum". Any "find pair" problem.',
    codeTemplate:
`public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement))
            return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
  },
  {
    id: 'prefix-sum-hashmap',
    title: 'Prefix Sum + HashMap',
    icon: '➕',
    tagline: 'prefix[j] - prefix[i] = subarray sum → look up prefix[j]-k in a map to find start of subarray.',
    explanation:
      'The prefix sum at index i is the total sum of elements from index 0 to i-1. ' +
      'The sum of any subarray arr[i..j] equals prefix[j+1] - prefix[i]. ' +
      'To count subarrays summing to k: as you build the running prefix sum, ' +
      'ask "how many times have I seen (currentSum - k) before?" — each occurrence marks a valid start index. ' +
      'Store {prefixSum → count} in a HashMap. Initialise with {0: 1} (empty prefix before index 0). ' +
      'This turns an O(n²) brute-force scan into O(n) with O(n) space.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    keyPoints: [
      'Prefix[i] = arr[0] + arr[1] + ... + arr[i-1]. Prefix[0] = 0.',
      'sum(i,j) = prefix[j+1] - prefix[i].',
      'Initialise map with {0: 1} to handle subarrays starting at index 0.',
      'Works with negative numbers (unlike sliding window).',
      'Variant: prefix XOR for "subarray XOR equals k".',
    ],
    whenToUse:
      '"Subarray sum equals K", "number of subarrays with given sum/product/XOR", "longest subarray with sum 0". Whenever the problem asks about a contiguous subarray and involves a sum condition.',
    codeTemplate:
`public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1); // empty prefix
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        // How many prefixes end at (sum - k)?
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}`,
  },
];

// ─── Queues / Deques / BFS ────────────────────────────────────────────────────
const queueConcepts: Concept[] = [
  {
    id: 'bfs',
    title: 'BFS — Breadth-First Search',
    icon: '🌊',
    tagline: 'Explore level by level using a queue — guarantees shortest path in unweighted graphs.',
    explanation:
      'BFS visits all nodes at distance 1 from the source, then all at distance 2, and so on. ' +
      'It uses a Queue (FIFO): start by enqueuing the source and marking it visited. ' +
      'While the queue is not empty: dequeue a node, process it, enqueue all unvisited neighbours, mark them visited immediately (not when they are dequeued — this prevents duplicates). ' +
      'Because nodes are processed in order of their distance from the source, the FIRST time BFS reaches a node is via the shortest path. ' +
      'This is why BFS is the go-to algorithm for "minimum number of steps" problems. ' +
      'BFS explores O(V + E) total edges and nodes.',
    complexity: { time: 'O(V + E)', space: 'O(V) — queue holds at most one full level' },
    keyPoints: [
      'ALWAYS marks visited when ENQUEUING — not when dequeuing — to avoid duplicates.',
      'Guarantees shortest path in UNWEIGHTED graphs (or grids with unit cost).',
      'For weighted shortest path → use Dijkstra (not BFS).',
      'Level-by-level: to track depth, snapshot queue size at the start of each level.',
      'BFS tree has no back edges; cross edges only go to same or next level.',
    ],
    whenToUse:
      '"Minimum steps", "shortest path in unweighted graph/grid", "level-order traversal", "number of islands", "rotting oranges". Any time you want the fewest hops between two nodes.',
    codeTemplate:
`// BFS on a grid
int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
Queue<int[]> queue = new LinkedList<>();
boolean[][] visited = new boolean[m][n];

queue.offer(new int[]{startRow, startCol});
visited[startRow][startCol] = true;
int steps = 0;

while (!queue.isEmpty()) {
    int size = queue.size(); // snapshot current level
    for (int i = 0; i < size; i++) {
        int[] curr = queue.poll();
        if (isTarget(curr)) return steps;
        for (int[] d : dirs) {
            int r = curr[0] + d[0], c = curr[1] + d[1];
            if (r >= 0 && r < m && c >= 0 && c < n && !visited[r][c]) {
                visited[r][c] = true;
                queue.offer(new int[]{r, c});
            }
        }
    }
    steps++;
}`,
  },
  {
    id: 'dfs',
    title: 'DFS — Depth-First Search',
    icon: '🌳',
    tagline: 'Go as deep as possible before backtracking — the foundation of recursion, trees, and backtracking.',
    explanation:
      'DFS explores one branch fully before moving to siblings. ' +
      'The recursive version is elegant: call DFS on each unvisited neighbour. ' +
      'The iterative version replaces the call stack with an explicit stack. ' +
      'Key difference from BFS: DFS does NOT guarantee shortest path, but it uses less memory on wide graphs (O(depth) vs O(width)). ' +
      'In trees, DFS gives us pre-order, in-order, and post-order traversals. ' +
      'For graphs, DFS is used for: finding connected components, cycle detection (back edges), topological sorting (reverse post-order), and Strongly Connected Components (Tarjan / Kosaraju).',
    complexity: { time: 'O(V + E)', space: 'O(V) — recursion stack or explicit stack' },
    keyPoints: [
      'Does NOT guarantee shortest path (use BFS for that).',
      'Back edge in directed DFS = cycle.',
      'Topological sort: nodes are ordered by reverse finishing time in DFS.',
      'For trees: pre-order = root first, in-order = left-root-right, post-order = children first.',
      'Iterative DFS: push RIGHT child first so LEFT child is processed first (for trees).',
    ],
    whenToUse:
      '"All paths from source to target", "number of connected components", "cycle detection", "topological sort", tree traversals, "islands" (either BFS or DFS works), flood fill, backtracking.',
    codeTemplate:
`// Recursive DFS on a graph
void dfs(int node, boolean[] visited, List<List<Integer>> graph) {
    visited[node] = true;
    process(node);
    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor])
            dfs(neighbor, visited, graph);
    }
}

// Iterative DFS on a grid
void dfsGrid(int r, int c, int[][] grid) {
    Deque<int[]> stack = new ArrayDeque<>();
    stack.push(new int[]{r, c});
    grid[r][c] = 0; // mark visited in-place
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!stack.isEmpty()) {
        int[] cur = stack.pop();
        for (int[] d : dirs) {
            int nr = cur[0]+d[0], nc = cur[1]+d[1];
            if (nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length && grid[nr][nc]==1) {
                grid[nr][nc] = 0;
                stack.push(new int[]{nr, nc});
            }
        }
    }
}`,
  },
  {
    id: 'multi-source-bfs',
    title: 'Multi-Source BFS',
    icon: '💥',
    tagline: 'Seed the queue with ALL starting points at once — BFS fans out from every source simultaneously.',
    explanation:
      'Standard BFS starts from a single source. ' +
      'Multi-source BFS starts from multiple sources at the same time by adding ALL of them to the queue before the main loop begins — they are all treated as "level 0". ' +
      'BFS then naturally spreads outward from every source in parallel. ' +
      'This is equivalent to adding a virtual super-source connected to all real sources with zero-weight edges, then running standard BFS from the super-source. ' +
      'The algorithm finds the minimum distance from ANY of the sources to each cell, which is exactly what problems like "Rotting Oranges" (multiple rotten fruits spreading) and "01 Matrix" (nearest 0 to each cell) require.',
    complexity: { time: 'O(m × n) for grids', space: 'O(m × n)' },
    keyPoints: [
      'Add ALL source cells to the queue and mark them visited BEFORE starting the loop.',
      'The final BFS distance at any cell is the distance to the NEAREST source.',
      'Equivalent to a super-source with 0-weight edges to all real sources.',
      '"Rotting oranges", "01 Matrix", "walls and gates" are all multi-source BFS.',
    ],
    whenToUse:
      'Multiple initial states spreading simultaneously: "rotting oranges", "01 matrix distance", "walls and gates", "infection spread". Whenever you have multiple equal starting points.',
    codeTemplate:
`Queue<int[]> queue = new LinkedList<>();
// Seed ALL sources first
for (int r = 0; r < m; r++)
    for (int c = 0; c < n; c++)
        if (grid[r][c] == SOURCE) {
            queue.offer(new int[]{r, c});
            // mark visited here, not inside the loop
        }

int time = 0;
while (!queue.isEmpty()) {
    int size = queue.size();
    for (int i = 0; i < size; i++) {
        int[] cur = queue.poll();
        for (int[] d : dirs) {
            int nr = cur[0]+d[0], nc = cur[1]+d[1];
            if (inBounds(nr,nc) && canVisit(grid,nr,nc)) {
                spread(grid, nr, nc);
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    time++;
}`,
  },
  {
    id: 'deque',
    title: 'Deque (Double-Ended Queue)',
    icon: '↔️',
    tagline: 'Add and remove from BOTH ends in O(1) — the key to sliding window maximum.',
    explanation:
      'A Deque (Double-Ended Queue) supports efficient O(1) insertion and removal at both the front and the back. ' +
      'In Java, ArrayDeque implements Deque and is the recommended general-purpose stack and queue. ' +
      'For the sliding window maximum problem, maintain a monotone decreasing deque of indices: ' +
      'when a new element arrives, remove all smaller elements from the BACK (they can never be the maximum); ' +
      'remove elements from the FRONT that have fallen outside the current window. ' +
      'The front of the deque always holds the index of the window maximum.',
    complexity: { time: 'addFirst/addLast/removeFirst/removeLast all O(1)', space: 'O(k) for window size k' },
    keyPoints: [
      'ArrayDeque is faster than LinkedList for most deque operations.',
      'Monotone deque maintains a decreasing sequence of elements (front = max).',
      'Remove from back when new element is ≥ back (they are dominated).',
      'Remove from front when index is outside the window boundary.',
      'Also used as both a stack (push/pop from one end) and queue (push back, pop front).',
    ],
    whenToUse:
      '"Sliding window maximum/minimum", any window extremum problem, BFS level tracking, implementing queue from stacks.',
    codeTemplate:
`// Sliding Window Maximum (monotone decreasing deque of indices)
int k = windowSize;
int[] result = new int[nums.length - k + 1];
Deque<Integer> dq = new ArrayDeque<>(); // stores indices

for (int i = 0; i < nums.length; i++) {
    // Remove front if it's outside the window
    if (!dq.isEmpty() && dq.peekFirst() < i - k + 1)
        dq.pollFirst();

    // Maintain decreasing order — remove smaller elements from back
    while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i])
        dq.pollLast();

    dq.offerLast(i);

    if (i >= k - 1)
        result[i - k + 1] = nums[dq.peekFirst()];
}`,
  },
];

// ─── Intervals ────────────────────────────────────────────────────────────────
const intervalConcepts: Concept[] = [
  {
    id: 'interval-sorting',
    title: 'Interval Sorting & Merge',
    icon: '📏',
    tagline: 'Sort by start time, then greedily merge overlapping intervals.',
    explanation:
      'The canonical interval problem is merging overlapping intervals. ' +
      'After sorting by start time, two consecutive intervals [a, b] and [c, d] overlap if and only if c ≤ b (the next start is before or at the current end). ' +
      'When they overlap, merge them into [a, max(b, d)]. ' +
      'Use max because one interval might be completely contained inside another. ' +
      'If they don\'t overlap (c > b), start a new result interval. ' +
      'This greedy approach works because once intervals are sorted by start, any overlap must involve consecutive intervals — there is no need to look further ahead.',
    complexity: { time: 'O(n log n) due to sort · merge pass O(n)', space: 'O(n) for output' },
    keyPoints: [
      'Sort by START time. If starts are equal, sort by END time.',
      'Overlap condition: next.start ≤ current.end.',
      'Merged end = Math.max(current.end, next.end) — handles containment.',
      'Insert interval (sorted insert): find where new interval fits, merge left and right neighbours.',
      'Non-overlapping count: sort by END time, greedily keep intervals that start after previous ends.',
    ],
    whenToUse:
      '"Merge intervals", "insert interval", "meeting rooms", "employee free time", "minimum number of non-overlapping intervals". Any problem with start/end pairs.',
    codeTemplate:
`// Merge Intervals
Arrays.sort(intervals, (a, b) -> a[0] - b[0]); // sort by start
List<int[]> result = new ArrayList<>();
result.add(intervals[0]);

for (int i = 1; i < intervals.length; i++) {
    int[] last = result.get(result.size() - 1);
    if (intervals[i][0] <= last[1]) {          // overlap
        last[1] = Math.max(last[1], intervals[i][1]);
    } else {
        result.add(intervals[i]);              // no overlap
    }
}`,
  },
  {
    id: 'sweep-line',
    title: 'Sweep Line / Event-Based Counting',
    icon: '🧹',
    tagline: 'Convert intervals to start/end events, sort them, sweep to find peak overlap.',
    explanation:
      'The sweep line technique converts the problem of reasoning about intervals into reasoning about discrete events. ' +
      'For each interval [start, end], create two events: (+1 at start) and (-1 at end). ' +
      'Sort all events by time (handle ties by putting end events before start events when minimising rooms, or start before end when maximising). ' +
      'Sweep through events, maintaining a running count. ' +
      'The maximum running count equals the maximum number of simultaneously active intervals — this is the minimum number of meeting rooms needed, the maximum simultaneous server connections, etc.',
    complexity: { time: 'O(n log n) for sorting', space: 'O(n)' },
    keyPoints: [
      'Two events per interval: +1 at start, -1 at end.',
      'Sort events by time. Tie-breaking matters: end before start = fewer simultaneous.',
      'Running sum = current active intervals. Track the maximum.',
      'Alternative: sort starts and ends separately, use two pointers.',
      'Works for: meeting rooms, maximum CPU load, number of concurrent users.',
    ],
    whenToUse:
      '"Minimum meeting rooms", "maximum CPU load", "car fleet", "maximum overlap of intervals", "number of planes in sky at same time".',
    codeTemplate:
`// Meeting Rooms II — min rooms needed
int[] starts = new int[n], ends = new int[n];
for (int i = 0; i < n; i++) {
    starts[i] = intervals[i][0];
    ends[i]   = intervals[i][1];
}
Arrays.sort(starts);
Arrays.sort(ends);

int rooms = 0, maxRooms = 0, e = 0;
for (int s = 0; s < n; s++) {
    if (starts[s] < ends[e]) {
        rooms++;                // new meeting starts before any ends
    } else {
        e++;                    // one meeting ended — reuse room
    }
    maxRooms = Math.max(maxRooms, rooms);
}
return maxRooms;`,
  },
];

// ─── Binary Search ────────────────────────────────────────────────────────────
const binarySearchConcepts: Concept[] = [
  {
    id: 'binary-search-classic',
    title: 'Classic Binary Search',
    icon: '🔍',
    tagline: 'Halve the search space each step — O(log n) on any sorted/monotonic structure.',
    explanation:
      'Binary search works on any SORTED array or any problem where the search space has a monotonic property: ' +
      'once a condition is true, it stays true for all subsequent values (or vice versa). ' +
      'The algorithm maintains two pointers, left and right, and computes mid = left + (right-left)/2. ' +
      'Using (right-left)/2 instead of (left+right)/2 avoids integer overflow. ' +
      'At each step, decide which half to discard by evaluating the condition at mid. ' +
      'The loop runs at most log₂(n) times. ' +
      'The three templates differ only in whether the answer is the left pointer, the right pointer, or mid itself.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    keyPoints: [
      'ALWAYS use mid = left + (right - left) / 2 to prevent overflow.',
      'Loop condition: left <= right (exact match) or left < right (boundary search).',
      'Sorted array is NOT the only use case — any monotonic decision works.',
      'Off-by-one errors are common: trace through a 2-element array to verify.',
      'Left boundary: when found, set right = mid - 1. Right boundary: set left = mid + 1.',
    ],
    whenToUse:
      '"Search sorted array", "find target", "count occurrences", "rotated sorted array", any O(log n) search requirement.',
    codeTemplate:
`// Template 1 — exact match
int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target)  left  = mid + 1;
        else                     right = mid - 1;
    }
    return -1; // not found
}

// Template 2 — left boundary (first occurrence)
int leftBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left  = mid + 1;
        else                    right = mid;
    }
    return left; // first index where nums[left] >= target
}`,
  },
  {
    id: 'binary-search-on-answer',
    title: 'Binary Search on Answer',
    icon: '🎚️',
    tagline: 'When "find minimum X satisfying condition" — binary search the value space, not the array.',
    explanation:
      'Many optimisation problems ask "find the minimum/maximum value X such that some condition holds". ' +
      'If feasible(X) is monotonic — once true for some X, it stays true for all larger X — then you can binary search on X directly. ' +
      'Define the value range [lo, hi] (often 1 to max element, or 1 to sum of array). ' +
      'For each candidate mid, call feasible(mid) to check if the condition can be satisfied with that value. ' +
      'If yes, try a smaller value (right = mid). If no, try larger (left = mid + 1). ' +
      'Examples: minimum eating speed (Koko), minimum days to make bouquets, minimum capacity to ship packages.',
    complexity: { time: 'O(n log(range))', space: 'O(1)', note: 'range = hi - lo; n per feasibility check' },
    keyPoints: [
      'Key insight: the condition (feasible) must be monotonic in the answer space.',
      'For minimum: when feasible(mid) is true, record answer and try smaller (right = mid).',
      'For maximum: when feasible(mid) is true, record answer and try larger (left = mid + 1).',
      'lo/hi bounds: lo = smallest possible answer, hi = largest possible (sum, max, etc.).',
      'feasible() usually scans the array once — O(n) per call.',
    ],
    whenToUse:
      '"Minimum speed/time/capacity", "Koko eating bananas", "split array largest sum", "ship packages within D days", "capacity to ship". Any "minimise the maximum" or "maximise the minimum" phrasing.',
    codeTemplate:
`// Koko Eating Bananas pattern
int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h))
            hi = mid;       // feasible — try lower speed
        else
            lo = mid + 1;   // not feasible — need higher speed
    }
    return lo;
}

boolean canFinish(int[] piles, int speed, int h) {
    int hours = 0;
    for (int p : piles)
        hours += (p + speed - 1) / speed; // ceil(p/speed)
    return hours <= h;
}`,
  },
  {
    id: 'rotated-array-search',
    title: 'Search in Rotated Sorted Array',
    icon: '🔄',
    tagline: 'After rotation one half is always sorted — use that to make the binary search decision.',
    explanation:
      'A rotated sorted array like [4, 5, 6, 7, 0, 1, 2] has a "pivot" where the rotation happened. ' +
      'The key observation: even after rotation, at least one half (left or right of mid) is ALWAYS in sorted order. ' +
      'At each step, check which half is sorted by comparing nums[left] with nums[mid]. ' +
      'If nums[left] ≤ nums[mid], the left half is sorted; check if target falls within [nums[left], nums[mid]). ' +
      'Otherwise the right half is sorted; check if target falls within (nums[mid], nums[right]]. ' +
      'Move your search to the half that could contain the target. ' +
      'This extends to finding the minimum (pivot point) in a rotated array.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    keyPoints: [
      'At least ONE half is always sorted after any rotation.',
      'Identify sorted half: if nums[left] <= nums[mid] → left sorted, else right sorted.',
      'Check if target is IN the sorted half. If yes, go there. Else, go other side.',
      'Finding minimum: the pivot is where nums[mid] < nums[mid-1]. Sorted half has its min at left.',
      'Duplicates version: if nums[left] == nums[mid], shrink left by 1 (cannot determine sorted half).',
    ],
    whenToUse:
      '"Search in rotated sorted array", "find minimum in rotated array", "find pivot index". Any binary search on a rotated structure.',
    codeTemplate:
`int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {     // LEFT half is sorted
            if (nums[left] <= target && target < nums[mid])
                right = mid - 1;          // target in left half
            else
                left = mid + 1;           // target in right half
        } else {                           // RIGHT half is sorted
            if (nums[mid] < target && target <= nums[right])
                left = mid + 1;           // target in right half
            else
                right = mid - 1;          // target in left half
        }
    }
    return -1;
}`,
  },
];

// ─── Linked List ──────────────────────────────────────────────────────────────
const linkedListConcepts: Concept[] = [
  {
    id: 'fast-slow-pointers',
    title: 'Fast & Slow Pointers (Floyd\'s Algorithm)',
    icon: '🐢🐇',
    tagline: 'Two pointers at different speeds — detects cycles, finds midpoints, and the Kth from end.',
    explanation:
      'Floyd\'s Tortoise and Hare algorithm uses two pointers moving at different speeds through a linked list: ' +
      'slow moves one node at a time, fast moves two nodes. ' +
      'Cycle detection: if a cycle exists, fast will eventually lap slow and they will meet. ' +
      'If fast reaches null, no cycle. ' +
      'Finding the cycle entry: after the meeting, reset one pointer to head and advance both one step at a time; they meet exactly at the cycle entry node. ' +
      'Finding the middle: when fast reaches the end, slow is at the middle (useful for palindrome check, merge sort on linked list). ' +
      'Kth from end: advance fast k steps first, then advance both; when fast reaches end, slow is at (n-k)th node.',
    complexity: { time: 'O(n)', space: 'O(1) — constant extra pointers' },
    keyPoints: [
      'Cycle detection: do { slow=slow.next; fast=fast.next.next; } while (slow != fast).',
      'No cycle if fast == null or fast.next == null before meeting.',
      'Middle node: when fast == null (even length) or fast.next == null (odd length), slow is at mid.',
      'Kth from end: advance fast by k, then advance both together.',
      'Cycle entry: after meeting, reset slow to head; advance both by 1 until they meet again.',
    ],
    whenToUse:
      '"Detect cycle in linked list", "find middle of linked list", "kth node from end", "happy number" (cycle in integer sequence), "reorder list".',
    codeTemplate:
`// Cycle detection
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

// Find middle (slow stops at middle when fast reaches end)
ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
  },
  {
    id: 'dummy-head',
    title: 'Dummy Head Node',
    icon: '🪝',
    tagline: 'A sentinel node before the real head eliminates all edge cases for insertion and deletion.',
    explanation:
      'Many linked list operations require special handling when the operation affects the head node: ' +
      'inserting before the head, deleting the head, or building a new list from scratch. ' +
      'A dummy (sentinel) node solves this by providing a stable node before the actual list. ' +
      'You always attach the result to dummy.next, so you never have to treat the head differently from other nodes. ' +
      'At the end, return dummy.next as the new head. ' +
      'The dummy node typically holds value 0 and is never returned to the caller.',
    complexity: { time: 'No change — O(n) list operations', space: 'O(1) extra (one node)' },
    keyPoints: [
      'Create: ListNode dummy = new ListNode(0); dummy.next = head;',
      'Always return dummy.next, not dummy.',
      'Use a curr pointer that starts at dummy, then curr = curr.next.',
      'Handles edge cases: empty list, single node, deleting head.',
      'Used in: merge two sorted lists, remove Nth from end, partition list.',
    ],
    whenToUse:
      '"Merge two sorted lists", "remove Nth node from end", "partition list", "reverse linked list in groups". Any list construction or deletion where the head might change.',
    codeTemplate:
`ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else                  { curr.next = l2; l2 = l2.next; }
        curr = curr.next;
    }
    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next; // head of merged list
}`,
  },
  {
    id: 'doubly-linked-list',
    title: 'Doubly Linked List & LRU Cache',
    icon: '🔗',
    tagline: 'With prev + next pointers, deletion of a known node is O(1) — the key to LRU Cache.',
    explanation:
      'A doubly linked list extends singly linked list by giving each node a prev pointer in addition to next. ' +
      'The crucial advantage: given a reference to a node, you can remove it in O(1) without traversing the list. ' +
      'In a singly linked list you need to find the previous node first (O(n)). ' +
      'LRU Cache combines a HashMap (key → node, O(1) lookup) with a doubly linked list (O(1) reordering). ' +
      'The list keeps elements ordered by recency: most recently used at head, least recently used at tail. ' +
      'On get: find node via map, move it to head. ' +
      'On put: if key exists, update and move to head. If new, add to head. If over capacity, remove tail and evict from map.',
    complexity: { time: 'LRU get/put O(1)', space: 'O(capacity)' },
    keyPoints: [
      'Each node: int key, int val, Node prev, Node next.',
      'Use dummy head and tail nodes to avoid null checks in insert/remove.',
      'addToHead: attach new node right after dummy head.',
      'removeNode: use node.prev and node.next to unlink in O(1).',
      'removeTail: tail.prev is the LRU node — remove it and evict from map.',
    ],
    whenToUse:
      '"LRU Cache", "LFU Cache" (similar), any "eviction policy" design question, "all O(1) get and put operations".',
    codeTemplate:
`class LRUCache {
    Map<Integer, Node> map = new HashMap<>();
    Node head = new Node(0, 0), tail = new Node(0, 0);
    int capacity;

    LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head; // dummy sentinels
    }

    int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        remove(n); addToHead(n);
        return n.val;
    }

    void put(int key, int val) {
        if (map.containsKey(key)) remove(map.get(key));
        Node n = new Node(key, val);
        addToHead(n); map.put(key, n);
        if (map.size() > capacity) {
            map.remove(tail.prev.key);
            remove(tail.prev);
        }
    }

    void remove(Node n)    { n.prev.next = n.next; n.next.prev = n.prev; }
    void addToHead(Node n) { n.next = head.next; n.prev = head;
                             head.next.prev = n; head.next = n; }
}`,
  },
];

// ─── Exported concept map ─────────────────────────────────────────────────────
export const dsaConcepts: Record<string, Concept[]> = {
  heaps:          heapConcepts,
  stacks:         stackConcepts,
  hashing:        hashingConcepts,
  queues:         queueConcepts,
  intervals:      intervalConcepts,
  'binary-search': binarySearchConcepts,
  'linked-list':  linkedListConcepts,
};
