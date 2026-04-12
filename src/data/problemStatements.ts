export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemStatement {
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  followUp?: string;
  functionSignature?: string;
}

export const problemStatements: Record<number, ProblemStatement> = {

  // ─────────────────────────────────────────────────────────────────────────
  215: {
    description:
      'Given an integer array `nums` and an integer `k`, return the kth largest element in the array.\n\nNote that it is the kth largest element in sorted order, not the kth distinct element.\n\nCan you solve it without sorting?',
    constraints: [
      '1 ≤ k ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'The 2nd largest element is 5.',
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
        explanation: 'Sorted desc: [6,5,5,4,3,3,2,2,1]. 4th element is 4.',
      },
    ],
    followUp: 'Can you solve it in O(n) average time using QuickSelect?',
    functionSignature: 'public int findKthLargest(int[] nums, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  347: {
    description:
      'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.',
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      'k is in the range [1, the number of unique elements in the array]',
      'It is guaranteed that the answer is unique',
    ],
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 appears 3 times, 2 appears 2 times. These are the top-2.',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
      },
    ],
    followUp: 'Your algorithm\'s time complexity must be better than O(n log n), where n is the array\'s size.',
    functionSignature: 'public int[] topKFrequent(int[] nums, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  692: {
    description:
      'Given an array of strings `words` and an integer `k`, return the `k` most frequent strings.\n\nReturn the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.',
    constraints: [
      '1 ≤ words.length ≤ 500',
      '1 ≤ words[i].length ≤ 10',
      'words[i] consists of lowercase English letters',
      'k is in the range [1, the number of unique words[i]]',
    ],
    examples: [
      {
        input: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
        output: '["i","love"]',
        explanation: '"i" and "love" are the two most frequent words. Note that "i" comes before "love" due to a lower alphabetical order.',
      },
      {
        input: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4',
        output: '["the","is","sunny","day"]',
        explanation: '"the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively.',
      },
    ],
    functionSignature: 'public List<String> topKFrequent(String[] words, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  703: {
    description:
      'Design a class to find the `kth` largest element in a stream. Note that it is the `kth` largest element in sorted order, not the `kth` distinct element.\n\nImplement `KthLargest` class:\n• `KthLargest(int k, int[] nums)` — Initializes the object with the integer `k` and the stream of integers `nums`.\n• `int add(int val)` — Appends the integer `val` to the stream and returns the element representing the kth largest element in the stream.',
    constraints: [
      '1 ≤ k ≤ 10⁴',
      '0 ≤ nums.length ≤ 10⁴',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      '-10⁴ ≤ val ≤ 10⁴',
      'At most 10⁴ calls will be made to add',
      'It is guaranteed that there will be at least k elements in the array when you search for the kth element',
    ],
    examples: [
      {
        input: 'KthLargest kthLargest = new KthLargest(3, [4,5,8,2]);\nkthLargest.add(3); // return 4\nkthLargest.add(5); // return 5\nkthLargest.add(10); // return 5\nkthLargest.add(9); // return 8\nkthLargest.add(4); // return 8',
        output: '[4, 5, 5, 8, 8]',
        explanation: 'After each add, the stream is re-evaluated and the 3rd largest is returned.',
      },
    ],
    functionSignature: 'class KthLargest {\n  KthLargest(int k, int[] nums)\n  int add(int val)\n}',
  },

  // ─────────────────────────────────────────────────────────────────────────
  295: {
    description:
      'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\n• For example, for arr = [2,3,4], the median is 3.\n• For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.\n\nImplement the `MedianFinder` class:\n• `MedianFinder()` — initializes the MedianFinder object.\n• `void addNum(int num)` — adds the integer `num` from the data stream to the data structure.\n• `double findMedian()` — returns the median of all elements so far. Answers within 10⁻⁵ of the actual answer will be accepted.',
    constraints: [
      '-10⁵ ≤ num ≤ 10⁵',
      'There will be at least one element in the data structure before calling findMedian',
      'At most 5 × 10⁴ calls will be made to addNum and findMedian',
    ],
    examples: [
      {
        input: 'MedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(1);\nmedianFinder.addNum(2);\nmedianFinder.findMedian(); // return 1.5\nmedianFinder.addNum(3);\nmedianFinder.findMedian(); // return 2.0',
        output: '[null, null, null, 1.5, null, 2.0]',
        explanation: 'After [1,2]: median = (1+2)/2 = 1.5. After [1,2,3]: median = 2.',
      },
    ],
    followUp: 'If all integer numbers from the stream are in the range [0, 100], how would you optimize it?\nIf 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize it?',
    functionSignature: 'class MedianFinder {\n  void addNum(int num)\n  double findMedian()\n}',
  },

  // ─────────────────────────────────────────────────────────────────────────
  621: {
    description:
      'Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.\n\nHowever, there is a non-negative integer `n` that represents the cooldown interval between two same tasks (the same letter in the array), that is that there must be at least n units of time between any two same tasks.\n\nReturn the least number of units of times that the CPU will take to finish all the given tasks.',
    constraints: [
      '1 ≤ tasks.length ≤ 10⁴',
      'tasks[i] is upper-case English letter',
      '0 ≤ n ≤ 100',
    ],
    examples: [
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        output: '8',
        explanation: 'A → B → idle → A → B → idle → A → B\nThere is at least 2 units of time between any two same tasks.',
      },
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 0',
        output: '6',
        explanation: 'On this case any permutation of size 6 would work since n = 0.',
      },
      {
        input: 'tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2',
        output: '16',
        explanation: 'One possible solution is: A → B → C → A → D → E → A → F → G → A → idle → idle → A → idle → idle → A',
      },
    ],
    functionSignature: 'public int leastInterval(char[] tasks, int n)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  373: {
    description:
      'You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`.\n\nDefine a pair `(u, v)` which consists of one element from the first array and one element from the second array.\n\nReturn the `k` pairs `(u1,v1), (u2,v2), ..., (uk,vk)` with the smallest sums.',
    constraints: [
      '1 ≤ nums1.length, nums2.length ≤ 10⁵',
      '-10⁹ ≤ nums1[i], nums2[i] ≤ 10⁹',
      'nums1 and nums2 both are sorted in non-decreasing order',
      '1 ≤ k ≤ 10⁴',
      'k ≤ nums1.length × nums2.length',
    ],
    examples: [
      {
        input: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3',
        output: '[[1,2],[1,4],[1,6]]',
        explanation: 'The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]',
      },
      {
        input: 'nums1 = [1,1,2], nums2 = [1,2,3], k = 2',
        output: '[[1,1],[1,1]]',
      },
    ],
    functionSignature: 'public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  239: {
    description:
      'You are given an array of integers `nums` and there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window — the maximum value in each window.',
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      '1 ≤ k ≤ nums.length',
    ],
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Window [1,3,-1] → max 3\nWindow [3,-1,-3] → max 3\nWindow [-1,-3,5] → max 5\nWindow [-3,5,3] → max 5\nWindow [5,3,6] → max 6\nWindow [3,6,7] → max 7',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
      },
    ],
    followUp: 'Could you solve it in linear time?',
    functionSignature: 'public int[] maxSlidingWindow(int[] nums, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  20: {
    description:
      'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only \'()[]{}\' ',
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: '\'(\' must be closed by \')\', not \']\'. Invalid order.',
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: 'Brackets are interleaved incorrectly.',
      },
      {
        input: 's = "{[]}"',
        output: 'true',
      },
    ],
    functionSignature: 'public boolean isValid(String s)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  155: {
    description:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n• `MinStack()` — initializes the stack object.\n• `void push(int val)` — pushes the element `val` onto the stack.\n• `void pop()` — removes the element on the top of the stack.\n• `int top()` — gets the top element of the stack.\n• `int getMin()` — retrieves the minimum element in the stack.',
    constraints: [
      '-2³¹ ≤ val ≤ 2³¹ - 1',
      'Methods pop, top and getMin operations will always be called on non-empty stacks',
      'At most 3 × 10⁴ calls will be made to push, pop, top, and getMin',
    ],
    examples: [
      {
        input: 'MinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top(); // return 0\nminStack.getMin(); // return -2',
        output: '[null, null, null, null, -3, null, 0, -2]',
        explanation: 'Each operation executes in O(1). Maintain a parallel "min stack" tracking minimums.',
      },
    ],
    followUp: 'You must implement each function to run in O(1) time.',
    functionSignature: 'class MinStack {\n  void push(int val)\n  void pop()\n  int top()\n  int getMin()\n}',
  },

  // ─────────────────────────────────────────────────────────────────────────
  150: {
    description:
      'You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation (RPN).\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n• The valid operators are \'+\', \'-\', \'*\', and \'/\'.\n• Each operand may be an integer or another expression.\n• The division between two integers always truncates toward zero.\n• There will not be any division by zero.\n• The input represents a valid arithmetic expression in a reverse polish notation.\n• The answer and all the intermediate calculations can be represented in a 32-bit integer.',
    constraints: [
      '1 ≤ tokens.length ≤ 10⁴',
      'tokens[i] is either an operator (+, -, *, /) or an integer in range [-200, 200]',
    ],
    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: '9',
        explanation: '((2 + 1) * 3) = 9',
      },
      {
        input: 'tokens = ["4","13","5","/","+"]',
        output: '6',
        explanation: '(4 + (13 / 5)) = 6',
      },
      {
        input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',
        output: '22',
        explanation: '((10 * (6 / ((9 + 3) * -11))) + 17) + 5\n= ((10 * (6 / (12 * -11))) + 17) + 5\n= 22',
      },
    ],
    functionSignature: 'public int evalRPN(String[] tokens)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  394: {
    description:
      'Given an encoded string, return its decoded string.\n\nThe encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.\n\nYou may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that all the digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.',
    constraints: [
      '1 ≤ s.length ≤ 30',
      's consists of lowercase English letters, digits, and square brackets \'[]\' ',
      's is guaranteed to be a valid input',
      'All the integers in s are in the range [1, 300]',
    ],
    examples: [
      {
        input: 's = "3[a]2[bc]"',
        output: '"aaabcbc"',
      },
      {
        input: 's = "3[a2[c]]"',
        output: '"accaccacc"',
        explanation: 'Inner 2[c] = "cc". Then 3["a"+"cc"] = "accaccacc".',
      },
      {
        input: 's = "2[abc]3[cd]ef"',
        output: '"abcabccdcdcdef"',
      },
    ],
    functionSignature: 'public String decodeString(String s)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  739: {
    description:
      'Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature.\n\nIf there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    constraints: [
      '1 ≤ temperatures.length ≤ 10⁵',
      '30 ≤ temperatures[i] ≤ 100',
    ],
    examples: [
      {
        input: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]',
        explanation: 'Day 0 (73°): next warmer is day 1 (74°), wait 1 day.\nDay 2 (75°): next warmer is day 6 (76°), wait 4 days.\nDay 6 and 7: no warmer day found, answer is 0.',
      },
      {
        input: 'temperatures = [30,40,50,60]',
        output: '[1,1,1,0]',
      },
      {
        input: 'temperatures = [30,60,90]',
        output: '[1,1,0]',
      },
    ],
    functionSignature: 'public int[] dailyTemperatures(int[] temperatures)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  84: {
    description:
      'Given an array of integers `heights` representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    constraints: [
      '1 ≤ heights.length ≤ 10⁵',
      '0 ≤ heights[i] ≤ 10⁴',
    ],
    examples: [
      {
        input: 'heights = [2,1,5,6,2,3]',
        output: '10',
        explanation: 'The largest rectangle spans bars at index 2 and 3 (heights 5 and 6), with width 2 and height 5. Area = 10.',
      },
      {
        input: 'heights = [2,4]',
        output: '4',
        explanation: 'The largest rectangle is bar at index 1 (height 4), width 1. Area = 4.',
      },
    ],
    functionSignature: 'public int largestRectangleArea(int[] heights)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  1: {
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists',
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9.',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    followUp: 'Can you come up with an algorithm that is less than O(n²) time complexity?',
    functionSignature: 'public int[] twoSum(int[] nums, int target)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  242: {
    description:
      'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    constraints: [
      '1 ≤ s.length, t.length ≤ 5 × 10⁴',
      's and t consist of lowercase English letters',
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
      },
    ],
    followUp: 'What if the inputs contain Unicode characters? How would you adapt your solution?',
    functionSignature: 'public boolean isAnagram(String s, String t)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  49: {
    description:
      'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    constraints: [
      '1 ≤ strs.length ≤ 10⁴',
      '0 ≤ strs[i].length ≤ 100',
      'strs[i] consists of lowercase English letters',
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Words that are anagrams of each other are grouped together. "eat", "tea", "ate" all sort to "aet".',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
      },
    ],
    functionSignature: 'public List<List<String>> groupAnagrams(String[] strs)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  128: {
    description:
      'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.',
    constraints: [
      '0 ≤ nums.length ≤ 10⁵',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
    ],
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive sequence is [1,2,3,4], length = 4.',
      },
      {
        input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        output: '9',
        explanation: 'The sequence [0,1,2,3,4,5,6,7,8] has length 9.',
      },
    ],
    functionSignature: 'public int longestConsecutive(int[] nums)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  560: {
    description:
      'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: [
      '1 ≤ nums.length ≤ 2 × 10⁴',
      '-1000 ≤ nums[i] ≤ 1000',
      '-10⁷ ≤ k ≤ 10⁷',
    ],
    examples: [
      {
        input: 'nums = [1,1,1], k = 2',
        output: '2',
        explanation: 'Subarrays [1,1] starting at index 0 and index 1 both sum to 2.',
      },
      {
        input: 'nums = [1,2,3], k = 3',
        output: '2',
        explanation: '[1,2] and [3] both sum to 3.',
      },
    ],
    functionSignature: 'public int subarraySum(int[] nums, int k)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  933: {
    description:
      'You have a `RecentCounter` class which counts the number of recent requests within a certain time frame.\n\nImplement the `RecentCounter` class:\n• `RecentCounter()` — Initializes the counter with zero recent requests.\n• `int ping(int t)` — Adds a new request at time `t`, where `t` represents some time in milliseconds, and returns the number of requests that has happened in the past 3000 milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range `[t - 3000, t]`.\n\nIt is guaranteed that every call to `ping` uses a strictly larger value of `t` than the previous call.',
    constraints: [
      '1 ≤ t ≤ 10⁹',
      'Each test case will call ping with strictly increasing values of t',
      'At most 10⁴ calls will be made to ping',
    ],
    examples: [
      {
        input: 'RecentCounter recentCounter = new RecentCounter();\nrecentCounter.ping(1);   // requests = [1],          range is [-2999,1],  return 1\nrecentCounter.ping(100); // requests = [1,100],       range is [-2900,100], return 2\nrecentCounter.ping(3001);// requests = [1,100,3001],  range is [1,3001],   return 3\nrecentCounter.ping(3002);// requests = [1,100,3001,3002], range [2,3002],  return 3',
        output: '[null, 1, 2, 3, 3]',
        explanation: 'At t=3002: only 100, 3001, 3002 fall in [2, 3002]. 1 is evicted.',
      },
    ],
    functionSignature: 'class RecentCounter {\n  RecentCounter()\n  int ping(int t)\n}',
  },

  // ─────────────────────────────────────────────────────────────────────────
  994: {
    description:
      'You are given an `m x n` grid where each cell can have one of three values:\n• `0` representing an empty cell\n• `1` representing a fresh orange\n• `2` representing a rotten orange\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 10',
      'grid[i][j] is 0, 1, or 2',
    ],
    examples: [
      {
        input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
        output: '4',
        explanation: 'Rot spreads outward from (0,0) for 4 minutes until all reachable oranges are rotten.',
      },
      {
        input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]',
        output: '-1',
        explanation: 'The orange in the bottom-left corner (row 2, column 0) is never rotten. It is isolated.',
      },
      {
        input: 'grid = [[0,2]]',
        output: '0',
        explanation: 'There are no fresh oranges at the beginning, so there\'s nothing to wait for.',
      },
    ],
    functionSignature: 'public int orangesRotting(int[][] grid)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  200: {
    description:
      'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 300',
      'grid[i][j] is \'0\' or \'1\'',
    ],
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: 'There are 3 separate islands (connected groups of 1s).',
      },
    ],
    functionSignature: 'public int numIslands(char[][] grid)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  56: {
    description:
      'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 ≤ intervals.length ≤ 10⁴',
      'intervals[i].length == 2',
      '0 ≤ starti ≤ endi ≤ 10⁴',
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    functionSignature: 'public int[][] merge(int[][] intervals)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  57: {
    description:
      'You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [starti, endi]` represent the start and the end of the ith interval and `intervals` is sorted in ascending order by `starti`. You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval.\n\nInsert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order by `starti` and `intervals` still does not have any overlapping intervals (merge if necessary).\n\nReturn `intervals` after the insertion.',
    constraints: [
      '0 ≤ intervals.length ≤ 10⁴',
      'intervals[i].length == 2',
      '0 ≤ starti ≤ endi ≤ 10⁵',
      'intervals is sorted by starti in ascending order',
      'newInterval.length == 2',
      '0 ≤ start ≤ end ≤ 10⁵',
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
        output: '[[1,5],[6,9]]',
        explanation: 'newInterval [2,5] overlaps [1,3], merge to [1,5].',
      },
      {
        input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]',
        output: '[[1,2],[3,10],[12,16]]',
        explanation: 'New interval [4,8] overlaps with [3,5],[6,7],[8,10]. Merge to [3,10].',
      },
    ],
    functionSignature: 'public int[][] insert(int[][] intervals, int[] newInterval)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  435: {
    description:
      'Given an array of intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    constraints: [
      '1 ≤ intervals.length ≤ 10⁵',
      'intervals[i].length == 2',
      '-5 × 10⁴ ≤ starti < endi ≤ 5 × 10⁴',
    ],
    examples: [
      {
        input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
        output: '1',
        explanation: '[1,3] can be removed and the rest of the intervals are non-overlapping.',
      },
      {
        input: 'intervals = [[1,2],[1,2],[1,2]]',
        output: '2',
        explanation: 'You need to remove two [1,2] to make the rest non-overlapping.',
      },
      {
        input: 'intervals = [[1,2],[2,3]]',
        output: '0',
        explanation: 'You don\'t need to remove any of the intervals since they are already non-overlapping.',
      },
    ],
    functionSignature: 'public int eraseOverlapIntervals(int[][] intervals)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  33: {
    description:
      'There is an integer array `nums` sorted in ascending order (with distinct values), which is possibly rotated at an unknown pivot index `k` (1 ≤ k < nums.length).\n\nFor example, `[0,1,2,4,5,6,7]` might be rotated at pivot index 3 and become `[4,5,6,7,0,1,2]`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    constraints: [
      '1 ≤ nums.length ≤ 5000',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      'All values of nums are unique',
      'nums is an ascending array that is possibly rotated',
      '-10⁴ ≤ target ≤ 10⁴',
    ],
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: 'Array rotated at index 4. Target 0 is at index 4.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: '3 is not in the array.',
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1',
      },
    ],
    functionSignature: 'public int search(int[] nums, int target)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  153: {
    description:
      'Suppose an array of length n sorted in ascending order is rotated between 1 and n times.\n\nFor example, the array `nums = [0,1,2,4,5,6,7]` might become:\n• `[4,5,6,7,0,1,2]` if it was rotated 4 times.\n• `[0,1,2,4,5,6,7]` if it was rotated 7 times (full rotation = original).\n\nGiven the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.',
    constraints: [
      'n == nums.length',
      '1 ≤ n ≤ 5000',
      '-5000 ≤ nums[i] ≤ 5000',
      'All the integers of nums are unique',
      'nums is sorted and rotated between 1 and n times',
    ],
    examples: [
      {
        input: 'nums = [3,4,5,1,2]',
        output: '1',
        explanation: 'The original array was [1,2,3,4,5] rotated 3 times.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2]',
        output: '0',
      },
      {
        input: 'nums = [11,13,15,17]',
        output: '11',
        explanation: 'Array was rotated 4 times (same as original). Minimum is nums[0].',
      },
    ],
    functionSignature: 'public int findMin(int[] nums)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  875: {
    description:
      'Koko loves to eat bananas. There are `n` piles of bananas, the ith pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.',
    constraints: [
      '1 ≤ piles.length ≤ 10⁴',
      'piles.length ≤ h ≤ 10⁹',
      '1 ≤ piles[i] ≤ 10⁹',
    ],
    examples: [
      {
        input: 'piles = [3,6,7,11], h = 8',
        output: '4',
        explanation: 'At speed 4: ⌈3/4⌉+⌈6/4⌉+⌈7/4⌉+⌈11/4⌉ = 1+2+2+3 = 8 hours ≤ h=8.',
      },
      {
        input: 'piles = [30,11,23,4,20], h = 5',
        output: '30',
        explanation: 'Must eat at speed 30 (one pile per hour at most).',
      },
      {
        input: 'piles = [30,11,23,4,20], h = 6',
        output: '23',
      },
    ],
    functionSignature: 'public int minEatingSpeed(int[] piles, int h)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  74: {
    description:
      'You are given an `m x n` integer matrix `matrix` with the following two properties:\n• Each row is sorted in non-decreasing order.\n• The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in the matrix or `false` otherwise.\n\nYou must write a solution in O(log(m * n)) time complexity.',
    constraints: [
      'm == matrix.length',
      'n == matrix[0].length',
      '1 ≤ m, n ≤ 100',
      '-10⁴ ≤ matrix[i][j] ≤ 10⁴',
      '-10⁴ ≤ target ≤ 10⁴',
    ],
    examples: [
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
        output: 'true',
      },
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13',
        output: 'false',
      },
    ],
    functionSignature: 'public boolean searchMatrix(int[][] matrix, int target)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  146: {
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n• `LRUCache(int capacity)` — Initialize the LRU cache with positive size capacity.\n• `int get(int key)` — Return the value of the key if the key exists, otherwise return -1.\n• `void put(int key, int value)` — Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions get and put must each run in O(1) average time complexity.',
    constraints: [
      '1 ≤ capacity ≤ 3000',
      '0 ≤ key ≤ 10⁴',
      '0 ≤ value ≤ 10⁵',
      'At most 2 × 10⁵ calls will be made to get and put',
    ],
    examples: [
      {
        input: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
        explanation: 'After get(1), key 1 becomes most recently used. put(3) evicts key 2 (LRU). put(4) evicts key 1 (LRU after get(2) failed).',
      },
    ],
    functionSignature: 'class LRUCache {\n  LRUCache(int capacity)\n  int get(int key)\n  void put(int key, int value)\n}',
  },

  // ─── Linked List Extra ───────────────────────────────────────────────────
  141: {
    description:
      'Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail\'s next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.',
    constraints: [
      'The number of the nodes in the list is in the range [0, 10⁴]',
      '-10⁵ ≤ Node.val ≤ 10⁵',
      'pos is -1 or a valid index in the linked list',
    ],
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).' },
      { input: 'head = [1,2], pos = 0', output: 'true', explanation: 'Tail connects back to the first node.' },
      { input: 'head = [1], pos = -1', output: 'false', explanation: 'No cycle.' },
    ],
    followUp: 'Can you solve it using O(1) (i.e. constant) memory?',
    functionSignature: 'public boolean hasCycle(ListNode head)',
  },

  142: {
    description:
      'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail\'s next pointer is connected to (0-indexed). It is -1 if there is no cycle.\n\nDo not modify the linked list.',
    constraints: [
      'The number of the nodes in the list is in the range [0, 10⁴]',
      '-10⁵ ≤ Node.val ≤ 10⁵',
      'pos is -1 or a valid index in the linked-list',
    ],
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'tail connects to node index 1', explanation: 'The linked list has a cycle, tail connects to the second node.' },
      { input: 'head = [1,2], pos = 0', output: 'tail connects to node index 0' },
      { input: 'head = [1], pos = -1', output: 'no cycle' },
    ],
    followUp: 'Can you solve it using O(1) space? (Floyd\'s Cycle Detection — Phase 2)',
    functionSignature: 'public ListNode detectCycle(ListNode head)',
  },

  206: {
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000]',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    followUp: 'A linked list can be reversed either iteratively or recursively. Could you implement both?',
    functionSignature: 'public ListNode reverseList(ListNode head)',
  },

  21: {
    description:
      'You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    constraints: [
      'The number of nodes in both lists is in the range [0, 50]',
      '-100 ≤ Node.val ≤ 100',
      'Both list1 and list2 are sorted in non-decreasing order',
    ],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    functionSignature: 'public ListNode mergeTwoLists(ListNode list1, ListNode list2)',
  },

  876: {
    description:
      'Given the head of a singly linked list, return the middle node of the linked list.\n\nIf there are two middle nodes, return the second middle node.',
    constraints: [
      'The number of nodes in the list is in the range [1, 100]',
      '1 ≤ Node.val ≤ 100',
    ],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: 'Node 3 (value = 3)', explanation: 'The middle node of the list is node 3.' },
      { input: 'head = [1,2,3,4,5,6]', output: 'Node 4 (value = 4)', explanation: 'Since the list has two middle nodes, 3 and 4, we return the second one.' },
    ],
    functionSignature: 'public ListNode middleNode(ListNode head)',
  },

  19: {
    description:
      'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    constraints: [
      'The number of nodes in the list is sz',
      '1 ≤ sz ≤ 30',
      '0 ≤ Node.val ≤ 100',
      '1 ≤ n ≤ sz',
    ],
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'Remove the 2nd node from end (node value 4).' },
      { input: 'head = [1], n = 1', output: '[]' },
      { input: 'head = [1,2], n = 1', output: '[1]' },
    ],
    followUp: 'Could you do this in one pass?',
    functionSignature: 'public ListNode removeNthFromEnd(ListNode head, int n)',
  },

  234: {
    description:
      'Given the head of a singly linked list, return true if it is a palindrome or false otherwise.',
    constraints: [
      'The number of nodes in the list is in the range [1, 10⁵]',
      '0 ≤ Node.val ≤ 9',
    ],
    examples: [
      { input: 'head = [1,2,2,1]', output: 'true' },
      { input: 'head = [1,2]', output: 'false' },
    ],
    followUp: 'Could you do it in O(n) time and O(1) space?',
    functionSignature: 'public boolean isPalindrome(ListNode head)',
  },

  2: {
    description:
      'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100]',
      '0 ≤ Node.val ≤ 9',
      'It is guaranteed that the list represents a number that does not have leading zeros',
    ],
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' },
      { input: 'l1 = [0], l2 = [0]', output: '[0]' },
      { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]', explanation: '9999999 + 9999 = 10009998.' },
    ],
    functionSignature: 'public ListNode addTwoNumbers(ListNode l1, ListNode l2)',
  },

  160: {
    description:
      'Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.\n\nNote that the linked lists must retain their original structure after the function returns.',
    constraints: [
      'The number of nodes of listA is in the m',
      'The number of nodes of listB is in the n',
      '1 ≤ m, n ≤ 3 × 10⁴',
      '1 ≤ Node.val ≤ 10⁵',
      '0 ≤ skipA < m',
      '0 ≤ skipB < n',
      'intersectVal is 0 if there is no intersected node',
      'intersectVal == listA[skipA] == listB[skipB] if there is an intersected node',
    ],
    examples: [
      { input: 'listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3', output: 'Node at value 8', explanation: 'Both lists share tail [8,4,5].' },
      { input: 'listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2', output: 'No intersection, return null.' },
    ],
    followUp: 'Could you write a solution that runs in O(m+n) time and use only O(1) memory?',
    functionSignature: 'public ListNode getIntersectionNode(ListNode headA, ListNode headB)',
  },

  92: {
    description:
      'Given the head of a singly linked list and two integers left and right where left ≤ right, reverse the nodes of the list from position left to position right, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is n',
      '1 ≤ n ≤ 500',
      '-500 ≤ Node.val ≤ 500',
      '1 ≤ left ≤ right ≤ n',
    ],
    examples: [
      { input: 'head = [1,2,3,4,5], left = 2, right = 4', output: '[1,4,3,2,5]', explanation: 'Sublist [2,3,4] reversed to [4,3,2].' },
      { input: 'head = [5], left = 1, right = 1', output: '[5]' },
    ],
    followUp: 'Could you do it in one pass?',
    functionSignature: 'public ListNode reverseBetween(ListNode head, int left, int right)',
  },

  23: {
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
    constraints: [
      'k == lists.length',
      '0 ≤ k ≤ 10⁴',
      '0 ≤ lists[i].length ≤ 500',
      '-10⁴ ≤ lists[i][j] ≤ 10⁴',
      'lists[i] is sorted in ascending order',
      'The sum of lists[i].length will not exceed 10⁴',
    ],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All three lists merged in sorted order.' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' },
    ],
    functionSignature: 'public ListNode mergeKLists(ListNode[] lists)',
  },

  // ─── Heaps Extra ─────────────────────────────────────────────────────────
  973: {
    description:
      'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).\n\nThe distance between two points on the X-Y plane is the Euclidean distance (i.e., √(x₁ - x₂)² + (y₁ - y₂)²).\n\nYou may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).',
    constraints: [
      '1 ≤ k ≤ points.length ≤ 10⁴',
      '-10⁴ ≤ xi, yi ≤ 10⁴',
    ],
    examples: [
      { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]', explanation: 'The distance of (1,3) is √10. The distance of (-2,2) is √8. Since √8 < √10, (-2,2) is closer.' },
      { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]', explanation: 'The distances are √18, √26, √20. Two closest are (3,3) and (-2,4).' },
    ],
    functionSignature: 'public int[][] kClosest(int[][] points, int k)',
  },

  1046: {
    description:
      'You are given an array of integers stones where stones[i] is the weight of the ith stone.\n\nWe are playing a game with the stones. On each turn, we choose the two heaviest stones and smash them together. Suppose the heaviest two stones have weights x and y with x ≤ y. The result of this smash is:\n• If x == y, both stones are destroyed.\n• If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.\n\nAt the end of the game, there is at most one stone left.\n\nReturn the weight of the last remaining stone. If there are no stones left, return 0.',
    constraints: [
      '1 ≤ stones.length ≤ 30',
      '1 ≤ stones[i] ≤ 1000',
    ],
    examples: [
      { input: 'stones = [2,7,4,1,8,1]', output: '1', explanation: '8,7→1 back. 4,2→2 back. 2,1→1 back. 1,1→destroyed. Return 1.' },
      { input: 'stones = [1]', output: '1' },
    ],
    functionSignature: 'public int lastStoneWeight(int[] stones)',
  },

  // ─── Stacks Extra ─────────────────────────────────────────────────────────
  42: {
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 × 10⁴',
      '0 ≤ height[i] ≤ 10⁵',
    ],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water (the blue sections in the diagram).' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    functionSignature: 'public int trap(int[] height)',
  },

  503: {
    description:
      'Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.\n\nThe next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn\'t exist, return -1 for this number.',
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
    ],
    examples: [
      { input: 'nums = [1,2,1]', output: '[2,-1,2]', explanation: 'The first 1\'s next greater number is 2; the 2 cannot find the next greater number; the second 1\'s next greater number needs to search circularly, which is also 2.' },
      { input: 'nums = [1,2,3,4,3]', output: '[2,3,4,-1,4]' },
    ],
    functionSignature: 'public int[] nextGreaterElements(int[] nums)',
  },

  // ─── Binary Search Extra ─────────────────────────────────────────────────
  162: {
    description:
      'A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.\n\nYou must write an algorithm that runs in O(log n) time.',
    constraints: [
      '1 ≤ nums.length ≤ 1000',
      '-2³¹ ≤ nums[i] ≤ 2³¹ - 1',
      'nums[i] != nums[i + 1] for all valid i',
    ],
    examples: [
      { input: 'nums = [1,2,3,1]', output: '2', explanation: 'nums[2] = 3 is a peak element and your function should return the index number 2.' },
      { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: 'Your function can return either index 1 (nums[1]=2) or index 5 (nums[5]=6).' },
    ],
    functionSignature: 'public int findPeakElement(int[] nums)',
  },
};
