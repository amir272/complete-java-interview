export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Step {
  title: string;
  explanation: string;
  code?: string;
  hint?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  intuition: string;
  steps: Step[];
  code: string;
  example: {
    input: string;
    output: string;
    walkthrough: string;
  };
}

export interface DSACategory {
  id: string;
  title: string;
  color: string;
  icon: string;
  description: string;
  problems: Problem[];
}

export const dsaCategories: DSACategory[] = [
  {
    id: 'heaps',
    title: 'Heaps / Priority Queue',
    color: '#FF6B6B',
    icon: '🏔️',
    description: 'Top-K problems, streaming data, and schedulers. Maps to "top-K from huge file", rate limiting, and resource management.',
    problems: [
      {
        id: 215,
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        pattern: 'Min-Heap of size K',
        timeComplexity: 'O(n log k)',
        spaceComplexity: 'O(k)',
        summary: 'Find the kth largest element using a min-heap of size k.',
        intuition: 'Maintain a min-heap of size k. For each element, if it\'s larger than the smallest in the heap, replace it. The heap root is the answer.',
        steps: [
          {
            title: 'Build a min-heap of size K',
            explanation: 'Initialize a min-heap (priority queue) with the first k elements from the array.',
            code: 'PriorityQueue<Integer> heap = new PriorityQueue<>();\nfor (int i = 0; i < k; i++) heap.offer(nums[i]);',
            hint: 'Java\'s PriorityQueue is a min-heap by default.',
          },
          {
            title: 'Process remaining elements',
            explanation: 'For each remaining element, if it\'s greater than the heap top (smallest element), remove top and add new element.',
            code: 'for (int i = k; i < nums.length; i++) {\n  if (nums[i] > heap.peek()) {\n    heap.poll();\n    heap.offer(nums[i]);\n  }\n}',
            hint: 'The heap always holds the K largest seen so far.',
          },
          {
            title: 'Return the heap root',
            explanation: 'The root of the min-heap is the Kth largest element — smallest among the top K.',
            code: 'return heap.peek();',
          },
        ],
        code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // remove smallest
        }
    }
    return minHeap.peek(); // kth largest
}`,
        example: {
          input: 'nums = [3,2,1,5,6,4], k = 2',
          output: '5',
          walkthrough: 'Heap after processing: [5,6]. Root=5 is 2nd largest.',
        },
      },
      {
        id: 347,
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        pattern: 'Heap + HashMap',
        timeComplexity: 'O(n log k)',
        spaceComplexity: 'O(n)',
        summary: 'Return the k most frequent elements using frequency map + min-heap.',
        intuition: 'Count frequencies with a map, then use a min-heap of size k ordered by frequency. The heap keeps the k most frequent elements.',
        steps: [
          {
            title: 'Count frequencies',
            explanation: 'Build a HashMap mapping each number to its frequency.',
            code: 'Map<Integer, Integer> freq = new HashMap<>();\nfor (int n : nums) freq.merge(n, 1, Integer::sum);',
          },
          {
            title: 'Use min-heap ordered by frequency',
            explanation: 'Min-heap of size k, ordered by frequency ascending. This evicts the least frequent when size exceeds k.',
            code: 'PriorityQueue<Integer> heap = new PriorityQueue<>(\n  (a, b) -> freq.get(a) - freq.get(b)\n);\nfor (int num : freq.keySet()) {\n  heap.offer(num);\n  if (heap.size() > k) heap.poll();\n}',
          },
          {
            title: 'Collect results',
            explanation: 'Drain the heap to get the top-k frequent elements.',
            code: 'int[] result = new int[k];\nfor (int i = k-1; i >= 0; i--) result[i] = heap.poll();',
          },
        ],
        code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    PriorityQueue<Integer> heap = new PriorityQueue<>(
        (a, b) -> freq.get(a) - freq.get(b)
    );
    for (int num : freq.keySet()) {
        heap.offer(num);
        if (heap.size() > k) heap.poll();
    }

    int[] result = new int[k];
    for (int i = k - 1; i >= 0; i--) result[i] = heap.poll();
    return result;
}`,
        example: {
          input: 'nums = [1,1,1,2,2,3], k = 2',
          output: '[1, 2]',
          walkthrough: 'Freq: {1:3, 2:2, 3:1}. Heap keeps [2,1] by frequency.',
        },
      },
      {
        id: 295,
        title: 'Find Median from Data Stream',
        difficulty: 'Hard',
        pattern: 'Two Heaps (Max + Min)',
        timeComplexity: 'O(log n) per add, O(1) find',
        spaceComplexity: 'O(n)',
        summary: 'Maintain two heaps: max-heap for lower half, min-heap for upper half.',
        intuition: 'Keep the lower half in a max-heap and upper half in a min-heap. Balance them so sizes differ by at most 1. Median is the tops of these heaps.',
        steps: [
          {
            title: 'Two heap setup',
            explanation: 'lo is a max-heap for the lower half. hi is a min-heap for the upper half.',
            code: 'PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());\nPriorityQueue<Integer> hi = new PriorityQueue<>();',
          },
          {
            title: 'Add number and rebalance',
            explanation: 'Always add to lo first, then move lo\'s max to hi. If hi becomes larger, move hi\'s min back to lo.',
            code: 'lo.offer(num);\nhi.offer(lo.poll());\nif (hi.size() > lo.size()) lo.offer(hi.poll());',
          },
          {
            title: 'Find median',
            explanation: 'If sizes equal → average of tops. Otherwise lo has one extra → lo.peek().',
            code: 'if (lo.size() == hi.size())\n  return (lo.peek() + hi.peek()) / 2.0;\nreturn lo.peek();',
          },
        ],
        code: `class MedianFinder {
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> hi = new PriorityQueue<>();

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        if (lo.size() == hi.size())
            return (lo.peek() + hi.peek()) / 2.0;
        return lo.peek();
    }
}`,
        example: {
          input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()',
          output: '1.5, 2.0',
          walkthrough: 'lo=[1], hi=[2] → median=1.5. Add 3: lo=[2,1], hi=[3] → median=2.',
        },
      },
      {
        id: 621,
        title: 'Task Scheduler',
        difficulty: 'Medium',
        pattern: 'Heap + Greedy',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        summary: 'Schedule tasks with cooldown n, minimizing total time using greedy + max-heap.',
        intuition: 'Always execute the most frequent remaining task to minimize idle time. Use a max-heap to always pick the most frequent available task.',
        steps: [
          {
            title: 'Count task frequencies',
            explanation: 'Count how many times each task appears.',
            code: 'int[] count = new int[26];\nfor (char c : tasks) count[c - \'A\']++;',
          },
          {
            title: 'Build max-heap of frequencies',
            explanation: 'Put all non-zero counts in a max-heap.',
            code: 'PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nfor (int c : count) if (c > 0) maxHeap.offer(c);',
          },
          {
            title: 'Simulate with cooldown queue',
            explanation: 'Each cycle of (n+1) slots: pick most frequent tasks, decrement, re-add after cooldown.',
            code: 'while (!maxHeap.isEmpty()) {\n  List<Integer> temp = new ArrayList<>();\n  for (int i = 0; i <= n; i++) {\n    if (!maxHeap.isEmpty()) temp.add(maxHeap.poll() - 1);\n    else if (temp.isEmpty()) break;\n  }\n  for (int t : temp) if (t > 0) maxHeap.offer(t);\n  time += maxHeap.isEmpty() ? temp.size() : n + 1;\n}',
          },
        ],
        code: `public int leastInterval(char[] tasks, int n) {
    int[] count = new int[26];
    for (char c : tasks) count[c - 'A']++;
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int c : count) if (c > 0) maxHeap.offer(c);

    int time = 0;
    while (!maxHeap.isEmpty()) {
        List<Integer> temp = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            if (!maxHeap.isEmpty()) temp.add(maxHeap.poll() - 1);
        }
        for (int t : temp) if (t > 0) maxHeap.offer(t);
        time += maxHeap.isEmpty() ? temp.size() : n + 1;
    }
    return time;
}`,
        example: {
          input: 'tasks = ["A","A","A","B","B","B"], n = 2',
          output: '8',
          walkthrough: 'A→B→idle→A→B→idle→A→B = 8 slots.',
        },
      },
    ],
  },
  {
    id: 'stacks',
    title: 'Stacks / Monotonic Stack',
    color: '#4ECDC4',
    icon: '📚',
    description: 'Parsing, "next greater" problems, and histograms. Core for log parsing and expression evaluation.',
    problems: [
      {
        id: 20,
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        pattern: 'Stack',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        summary: 'Use a stack to match opening and closing brackets.',
        intuition: 'Push opening brackets. For closing brackets, check if top of stack matches. If not, invalid.',
        steps: [
          {
            title: 'Push opening brackets',
            explanation: 'For \'(\', \'[\', \'{\' — push onto stack.',
            code: 'if (c == \'(\' || c == \'[\' || c == \'{\') stack.push(c);',
          },
          {
            title: 'Match closing brackets',
            explanation: 'For closing brackets, the stack must not be empty and top must be the matching opener.',
            code: 'else {\n  if (stack.isEmpty()) return false;\n  char top = stack.pop();\n  if (c == \')\' && top != \'(\') return false;\n  if (c == \']\' && top != \'[\') return false;\n  if (c == \'}\' && top != \'{\') return false;\n}',
          },
          {
            title: 'Final check',
            explanation: 'Stack must be empty at the end — all brackets matched.',
            code: 'return stack.isEmpty();',
          },
        ],
        code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return stack.isEmpty();
}`,
        example: {
          input: 's = "()[]{}"',
          output: 'true',
          walkthrough: 'Each opener is pushed, each closer pops and matches → stack empty → true.',
        },
      },
      {
        id: 739,
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        pattern: 'Monotonic Stack (decreasing)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        summary: 'For each day, find how many days until a warmer temperature using a monotonic stack.',
        intuition: 'Maintain a stack of indices with decreasing temperatures. When a warmer day arrives, pop all colder days and record the wait.',
        steps: [
          {
            title: 'Maintain decreasing stack of indices',
            explanation: 'Stack stores indices. We keep temperatures decreasing from bottom to top.',
            code: 'Deque<Integer> stack = new ArrayDeque<>();\nint[] result = new int[temps.length];',
          },
          {
            title: 'Process each temperature',
            explanation: 'While stack is non-empty and current temp > stack top temp, pop and calculate days waited.',
            code: 'for (int i = 0; i < temps.length; i++) {\n  while (!stack.isEmpty() && temps[i] > temps[stack.peek()]) {\n    int idx = stack.pop();\n    result[idx] = i - idx;\n  }\n  stack.push(i);\n}',
          },
          {
            title: 'Return result',
            explanation: 'Remaining indices in stack never found a warmer day — already 0 in result.',
            code: 'return result;',
          },
        ],
        code: `public int[] dailyTemperatures(int[] temperatures) {
    int[] result = new int[temperatures.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < temperatures.length; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int idx = stack.pop();
            result[idx] = i - idx;
        }
        stack.push(i);
    }
    return result;
}`,
        example: {
          input: 'temperatures = [73,74,75,71,69,72,76,73]',
          output: '[1,1,4,2,1,1,0,0]',
          walkthrough: 'Day 0 (73): next warmer is day 1 (74), wait=1. Day 2 (75): next warmer is day 6 (76), wait=4.',
        },
      },
      {
        id: 84,
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        pattern: 'Monotonic Stack',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        summary: 'Find the largest rectangle area in a histogram using a monotonic stack.',
        intuition: 'For each bar, find the furthest left and right it can extend at its height. Use a monotonic increasing stack — when we find a shorter bar, compute area for all taller bars popped.',
        steps: [
          {
            title: 'Use increasing monotonic stack',
            explanation: 'Stack stores indices with increasing heights. Add sentinel 0 at end to flush stack.',
            code: 'int[] h = Arrays.copyOf(heights, heights.length + 1);\nDeque<Integer> stack = new ArrayDeque<>();\nstack.push(-1);',
          },
          {
            title: 'Process each bar',
            explanation: 'When current bar is shorter than stack top, pop and compute rectangle with popped height × (current index - stack top - 1).',
            code: 'for (int i = 0; i < h.length; i++) {\n  while (stack.peek() != -1 && h[stack.peek()] > h[i]) {\n    int height = h[stack.pop()];\n    int width = i - stack.peek() - 1;\n    maxArea = Math.max(maxArea, height * width);\n  }\n  stack.push(i);\n}',
          },
        ],
        code: `public int largestRectangleArea(int[] heights) {
    int maxArea = 0;
    int[] h = Arrays.copyOf(heights, heights.length + 1);
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(-1);
    for (int i = 0; i < h.length; i++) {
        while (stack.peek() != -1 && h[stack.peek()] > h[i]) {
            int height = h[stack.pop()];
            int width = i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}`,
        example: {
          input: 'heights = [2,1,5,6,2,3]',
          output: '10',
          walkthrough: 'Bars 5 and 6 (index 2,3) form a 2-wide rectangle of height 5 = area 10.',
        },
      },
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing / Maps',
    color: '#45B7D1',
    icon: '#️⃣',
    description: 'Counts, dedupe, and idempotency. Core pattern for O(1) lookups and grouping.',
    problems: [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        pattern: 'HashMap (complement lookup)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        summary: 'Find two indices that sum to target using a complement hashmap.',
        intuition: 'For each number, the complement is (target - num). If we\'ve seen the complement before, we found the pair.',
        steps: [
          {
            title: 'Initialize complement map',
            explanation: 'Map from number → index, for O(1) lookups.',
            code: 'Map<Integer, Integer> seen = new HashMap<>();',
          },
          {
            title: 'For each element, check complement',
            explanation: 'If (target - nums[i]) is in the map, return [map[complement], i].',
            code: 'for (int i = 0; i < nums.length; i++) {\n  int complement = target - nums[i];\n  if (seen.containsKey(complement))\n    return new int[]{seen.get(complement), i};\n  seen.put(nums[i], i);\n}',
          },
        ],
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement))
            return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
        example: {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0, 1]',
          walkthrough: 'At i=1: complement=2, seen has 2 at index 0 → return [0,1].',
        },
      },
      {
        id: 128,
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        pattern: 'HashSet',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        summary: 'Find the longest sequence of consecutive integers using a HashSet.',
        intuition: 'Only start counting from the beginning of a sequence (no num-1 in set). Expand rightward as long as consecutive nums exist.',
        steps: [
          {
            title: 'Put all numbers in a set',
            explanation: 'O(1) lookup to check if a number exists.',
            code: 'Set<Integer> set = new HashSet<>();\nfor (int n : nums) set.add(n);',
          },
          {
            title: 'Start streak only at sequence start',
            explanation: 'A number starts a streak only if (num-1) is NOT in the set.',
            code: 'for (int n : set) {\n  if (!set.contains(n - 1)) {\n    int curr = n, streak = 1;\n    while (set.contains(curr + 1)) { curr++; streak++; }\n    longest = Math.max(longest, streak);\n  }\n}',
          },
        ],
        code: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int longest = 0;
    for (int n : set) {
        if (!set.contains(n - 1)) {
            int curr = n, streak = 1;
            while (set.contains(curr + 1)) { curr++; streak++; }
            longest = Math.max(longest, streak);
        }
    }
    return longest;
}`,
        example: {
          input: 'nums = [100,4,200,1,3,2]',
          output: '4',
          walkthrough: 'Sequence 1,2,3,4 has length 4. Start at 1 (no 0 in set).',
        },
      },
    ],
  },
  {
    id: 'queues',
    title: 'Queues / BFS',
    color: '#96CEB4',
    icon: '🌊',
    description: 'Work queues, BFS traversals, and backpressure intuitions. Core for level-order and shortest-path problems.',
    problems: [
      {
        id: 994,
        title: 'Rotting Oranges',
        difficulty: 'Medium',
        pattern: 'BFS (multi-source)',
        timeComplexity: 'O(m×n)',
        spaceComplexity: 'O(m×n)',
        summary: 'BFS from all rotten oranges simultaneously to spread rot in minimum time.',
        intuition: 'Multi-source BFS: start with all rotten oranges in the queue. Each BFS level = 1 minute. Count fresh oranges left.',
        steps: [
          {
            title: 'Enqueue all rotten, count fresh',
            explanation: 'Add all rotten orange positions to the queue. Count total fresh oranges.',
            code: 'Queue<int[]> q = new LinkedList<>();\nfor (int r=0; r<grid.length; r++)\n  for (int c=0; c<grid[0].length; c++) {\n    if (grid[r][c]==2) q.offer(new int[]{r,c});\n    if (grid[r][c]==1) fresh++;\n  }',
          },
          {
            title: 'BFS level by level',
            explanation: 'Each level represents 1 minute. Spread rot to all 4 neighbors.',
            code: 'while (!q.isEmpty() && fresh > 0) {\n  minutes++;\n  int size = q.size();\n  for (int i=0; i<size; i++) {\n    int[] pos = q.poll();\n    for (int[] dir : dirs) {\n      int nr=pos[0]+dir[0], nc=pos[1]+dir[1];\n      if (nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length && grid[nr][nc]==1) {\n        grid[nr][nc]=2; fresh--; q.offer(new int[]{nr,nc});\n      }\n    }\n  }\n}',
          },
        ],
        code: `public int orangesRotting(int[][] grid) {
    int fresh = 0, minutes = 0;
    Queue<int[]> q = new LinkedList<>();
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == 2) q.offer(new int[]{r,c});
            if (grid[r][c] == 1) fresh++;
        }
    while (!q.isEmpty() && fresh > 0) {
        minutes++;
        for (int i = q.size(); i > 0; i--) {
            int[] p = q.poll();
            for (int[] d : dirs) {
                int nr = p[0]+d[0], nc = p[1]+d[1];
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2; fresh--; q.offer(new int[]{nr,nc});
                }
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`,
        example: {
          input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
          output: '4',
          walkthrough: 'Rot spreads from (0,0). Takes 4 minutes to reach (2,2).',
        },
      },
    ],
  },
  {
    id: 'intervals',
    title: 'Intervals',
    color: '#FFEAA7',
    icon: '📅',
    description: 'Schedulers, timelines, and merging events. Critical for calendar and booking systems.',
    problems: [
      {
        id: 56,
        title: 'Merge Intervals',
        difficulty: 'Medium',
        pattern: 'Sort + Linear Merge',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        summary: 'Sort intervals by start, then merge overlapping ones.',
        intuition: 'Sort by start time. For each interval, if it overlaps with the last merged interval (start ≤ last end), extend the end. Otherwise add new.',
        steps: [
          {
            title: 'Sort by start time',
            explanation: 'Sort so we process intervals left to right.',
            code: 'Arrays.sort(intervals, (a, b) -> a[0] - b[0]);',
          },
          {
            title: 'Merge overlapping intervals',
            explanation: 'If current start ≤ last merged end → overlap → extend end. Otherwise → add current.',
            code: 'List<int[]> merged = new ArrayList<>();\nfor (int[] iv : intervals) {\n  if (merged.isEmpty() || iv[0] > merged.get(merged.size()-1)[1])\n    merged.add(iv);\n  else\n    merged.get(merged.size()-1)[1] = Math.max(merged.get(merged.size()-1)[1], iv[1]);\n}',
          },
        ],
        code: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    for (int[] iv : intervals) {
        if (merged.isEmpty() || iv[0] > merged.get(merged.size()-1)[1])
            merged.add(iv);
        else
            merged.get(merged.size()-1)[1] = Math.max(merged.get(merged.size()-1)[1], iv[1]);
    }
    return merged.toArray(new int[0][]);
}`,
        example: {
          input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
          output: '[[1,6],[8,10],[15,18]]',
          walkthrough: '[1,3] and [2,6] overlap (2≤3) → merge to [1,6].',
        },
      },
      {
        id: 435,
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        pattern: 'Greedy (sort by end)',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        summary: 'Find minimum intervals to remove so no two overlap. Greedy: keep intervals with earliest end.',
        intuition: 'Sort by end time. Greedily keep intervals that end earliest. If an interval overlaps the last kept one, remove it (count++).',
        steps: [
          {
            title: 'Sort by end time',
            explanation: 'Greedily pick intervals that end earliest to leave room for more.',
            code: 'Arrays.sort(intervals, (a, b) -> a[1] - b[1]);',
          },
          {
            title: 'Greedily keep non-overlapping',
            explanation: 'Track the end of last kept interval. If current start < last end → overlap → remove (count++). Else keep.',
            code: 'int count = 0, end = Integer.MIN_VALUE;\nfor (int[] iv : intervals) {\n  if (iv[0] >= end) end = iv[1];\n  else count++;\n}',
          },
        ],
        code: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int count = 0, end = Integer.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) end = iv[1];
        else count++;
    }
    return count;
}`,
        example: {
          input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
          output: '1',
          walkthrough: 'Remove [1,3] → remaining [1,2],[2,3],[3,4] are non-overlapping.',
        },
      },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    color: '#DDA0DD',
    icon: '🔍',
    description: 'Performance + "find boundary" thinking. Also applies to "binary search on answer" pattern.',
    problems: [
      {
        id: 33,
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        pattern: 'Binary Search with rotation check',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        summary: 'Binary search on rotated array by identifying which half is sorted.',
        intuition: 'At any mid point, one of the two halves MUST be sorted. Determine which half is sorted, then decide which half target falls in.',
        steps: [
          {
            title: 'Identify sorted half',
            explanation: 'If nums[l] ≤ nums[mid], left half is sorted. Otherwise right half is sorted.',
            code: 'if (nums[l] <= nums[mid]) { /* left half sorted */ }\nelse { /* right half sorted */ }',
          },
          {
            title: 'Target in sorted half?',
            explanation: 'If target is within the sorted half\'s range, search there. Otherwise search the other half.',
            code: 'if (nums[l] <= nums[mid]) {\n  if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n  else l = mid + 1;\n} else {\n  if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n  else r = mid - 1;\n}',
          },
        ],
        code: `public int search(int[] nums, int target) {
    int l = 0, r = nums.length - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) return mid;
        if (nums[l] <= nums[mid]) {
            if (target >= nums[l] && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    return -1;
}`,
        example: {
          input: 'nums = [4,5,6,7,0,1,2], target = 0',
          output: '4',
          walkthrough: 'mid=7, right half [0,1,2] is sorted, target 0 is in it → search right.',
        },
      },
      {
        id: 875,
        title: 'Koko Eating Bananas',
        difficulty: 'Medium',
        pattern: 'Binary Search on Answer',
        timeComplexity: 'O(n log m)',
        spaceComplexity: 'O(1)',
        summary: 'Binary search on the eating speed k. Find minimum k such that all piles eaten in h hours.',
        intuition: 'The answer space is [1, max(piles)]. For each candidate speed k, check if Koko can finish in h hours. Binary search for minimum valid k.',
        steps: [
          {
            title: 'Define search space',
            explanation: 'Minimum speed = 1, maximum = max pile size.',
            code: 'int l = 1, r = Arrays.stream(piles).max().getAsInt();',
          },
          {
            title: 'Binary search on speed',
            explanation: 'For each mid speed, compute total hours needed. If ≤ h, try slower (r=mid). Else try faster (l=mid+1).',
            code: 'while (l < r) {\n  int mid = l + (r - l) / 2;\n  long hours = 0;\n  for (int p : piles) hours += (p + mid - 1) / mid;\n  if (hours <= h) r = mid;\n  else l = mid + 1;\n}',
          },
        ],
        code: `public int minEatingSpeed(int[] piles, int h) {
    int l = 1, r = Arrays.stream(piles).max().getAsInt();
    while (l < r) {
        int mid = l + (r - l) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) r = mid;
        else l = mid + 1;
    }
    return l;
}`,
        example: {
          input: 'piles = [3,6,7,11], h = 8',
          output: '4',
          walkthrough: 'At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4)=1+2+2+3=8 ≤ 8. Valid!',
        },
      },
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List / LRU',
    color: '#F0E68C',
    icon: '🔗',
    description: 'LRU Cache is the critical building block for backend interviews. Know this cold.',
    problems: [
      {
        id: 146,
        title: 'LRU Cache',
        difficulty: 'Medium',
        pattern: 'HashMap + Doubly Linked List',
        timeComplexity: 'O(1) get and put',
        spaceComplexity: 'O(capacity)',
        summary: 'Implement LRU Cache with O(1) get/put using HashMap + doubly linked list.',
        intuition: 'HashMap gives O(1) access. Doubly linked list maintains insertion/access order. Move accessed nodes to front. Evict from back.',
        steps: [
          {
            title: 'Doubly linked list node',
            explanation: 'Each node stores key-value. Sentinel head/tail simplify insertions/deletions.',
            code: 'class Node {\n  int key, val;\n  Node prev, next;\n  Node(int k, int v) { key=k; val=v; }\n}\nNode head = new Node(0,0), tail = new Node(0,0);\nhead.next = tail; tail.prev = head;',
          },
          {
            title: 'get: return value, move to front',
            explanation: 'If key exists: remove from current position, insert at front (most recently used).',
            code: 'public int get(int key) {\n  if (!map.containsKey(key)) return -1;\n  Node n = map.get(key);\n  remove(n); insertFront(n);\n  return n.val;\n}',
          },
          {
            title: 'put: insert/update, evict LRU if needed',
            explanation: 'If key exists, remove it. Insert at front. If over capacity, evict tail.prev (LRU).',
            code: 'public void put(int key, int value) {\n  if (map.containsKey(key)) remove(map.get(key));\n  Node n = new Node(key, value);\n  insertFront(n);\n  map.put(key, n);\n  if (map.size() > capacity) {\n    Node lru = tail.prev;\n    remove(lru); map.remove(lru.key);\n  }\n}',
          },
        ],
        code: `class LRUCache {
    private Map<Integer, Node> map = new HashMap<>();
    private Node head = new Node(0,0), tail = new Node(0,0);
    private int capacity;

    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key=k; val=v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }

    private void remove(Node n) {
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void insertFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        remove(n); insertFront(n);
        return n.val;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        Node n = new Node(key, value);
        insertFront(n); map.put(key, n);
        if (map.size() > capacity) {
            Node lru = tail.prev;
            remove(lru); map.remove(lru.key);
        }
    }
}`,
        example: {
          input: 'LRUCache(2): put(1,1), put(2,2), get(1), put(3,3), get(2)',
          output: 'get(1)=1, get(2)=-1',
          walkthrough: 'After put(3,3), key 2 is evicted (LRU). get(2) returns -1.',
        },
      },
    ],
  },
];
