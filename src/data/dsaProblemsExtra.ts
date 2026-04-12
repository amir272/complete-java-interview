/**
 * Additional interview problems per DSA category.
 * Merged with dsaProblems.ts via allDSACategories.ts.
 */
import { Problem } from './dsaProblems';

// ─────────────────────────────────────────────────────────────────────────────
// LINKED LIST  (classic fast/slow pointer, reverse, merge, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const linkedListExtra: Problem[] = [
  // ── 141: Linked List Cycle ───────────────────────────────────────────────
  {
    id: 141,
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    pattern: 'Fast & Slow Pointers (Floyd)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Detect whether a linked list has a cycle using two pointers at different speeds.',
    intuition: 'If there is a cycle, a fast pointer (2× speed) will eventually lap the slow pointer and they will meet. If there is no cycle, fast will reach null first.',
    steps: [
      {
        title: 'Initialize slow and fast at head',
        explanation: 'slow moves one node at a time. fast moves two nodes at a time.',
        code: 'ListNode slow = head, fast = head;',
      },
      {
        title: 'Advance until fast hits null or they meet',
        explanation: 'If fast or fast.next is null → no cycle. If slow == fast → cycle detected.',
        code: 'while (fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow == fast) return true;\n}\nreturn false;',
        hint: 'fast must check both fast != null AND fast.next != null before .next.next',
      },
    ],
    code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    example: {
      input: 'head = [3,2,0,-4], pos = 1 (tail connects to node at index 1)',
      output: 'true',
      walkthrough: 'slow: 3→2→0→-4→2(cycle), fast: 3→0→2→0→2. They meet at node 2.',
    },
  },

  // ── 142: Linked List Cycle II ────────────────────────────────────────────
  {
    id: 142,
    title: 'Linked List Cycle II',
    difficulty: 'Medium',
    pattern: 'Fast & Slow Pointers (Floyd Entry Point)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Find the node where the cycle begins using Floyd\'s algorithm.',
    intuition: 'After slow and fast meet inside the cycle, reset one pointer to head. Move both one step at a time — they will meet exactly at the cycle entry node. This is a mathematical property of Floyd\'s algorithm.',
    steps: [
      {
        title: 'Phase 1: Detect cycle (find meeting point)',
        explanation: 'Run slow (×1) and fast (×2) until they meet inside the cycle.',
        code: 'ListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow == fast) break;\n}\nif (fast == null || fast.next == null) return null;',
      },
      {
        title: 'Phase 2: Find cycle entry',
        explanation: 'Reset slow to head. Advance both slow and fast one step at a time. Where they meet = cycle start.',
        code: 'slow = head;\nwhile (slow != fast) {\n  slow = slow.next;\n  fast = fast.next;\n}\nreturn slow; // cycle entry node',
        hint: 'Mathematical proof: distance from head to entry == distance from meeting point to entry.',
      },
    ],
    code: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }
    return null;
}`,
    example: {
      input: 'head = [3,2,0,-4], pos = 1',
      output: 'node at index 1 (value = 2)',
      walkthrough: 'Phase 1: meet at -4. Phase 2: reset slow=3, move both: slow:3→2, fast:-4→2. Meet at 2 = cycle entry.',
    },
  },

  // ── 206: Reverse Linked List ─────────────────────────────────────────────
  {
    id: 206,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    pattern: 'Iterative / Recursive pointer manipulation',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) iterative, O(n) recursive',
    summary: 'Reverse a singly linked list by re-wiring each node\'s next pointer.',
    intuition: 'Walk the list with three pointers: prev (null), curr (head), next. At each step: save next, point curr.next backward to prev, advance prev and curr.',
    steps: [
      {
        title: 'Three-pointer setup',
        explanation: 'prev starts at null, curr at head. next is used to save the next node before we overwrite curr.next.',
        code: 'ListNode prev = null, curr = head;',
      },
      {
        title: 'Rewire each node backward',
        explanation: 'For each node: save next → point curr.next to prev → advance prev to curr → advance curr to saved next.',
        code: 'while (curr != null) {\n  ListNode next = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = next;\n}\nreturn prev;',
        hint: 'prev becomes the new head when curr reaches null.',
      },
    ],
    code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    example: {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      walkthrough: 'prev=null,curr=1→ curr.next=null,prev=1,curr=2 → ... → prev=5,curr=null. Return 5.',
    },
  },

  // ── 21: Merge Two Sorted Lists ───────────────────────────────────────────
  {
    id: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    pattern: 'Two Pointers + Dummy Node',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    summary: 'Merge two sorted linked lists into one sorted list using a dummy head node.',
    intuition: 'Use a dummy head to simplify edge cases. Compare the heads of both lists; attach the smaller one to the result. Advance that list\'s pointer. Append the remaining tail.',
    steps: [
      {
        title: 'Dummy node setup',
        explanation: 'A dummy node lets us avoid null checks at the start. curr tracks the tail of the merged list.',
        code: 'ListNode dummy = new ListNode(0), curr = dummy;',
      },
      {
        title: 'Compare and stitch',
        explanation: 'While both lists have nodes: compare list1.val vs list2.val, attach smaller to curr, advance that list.',
        code: 'while (list1 != null && list2 != null) {\n  if (list1.val <= list2.val) {\n    curr.next = list1; list1 = list1.next;\n  } else {\n    curr.next = list2; list2 = list2.next;\n  }\n  curr = curr.next;\n}\ncurr.next = (list1 != null) ? list1 : list2;\nreturn dummy.next;',
        hint: 'Append remaining tail directly — it\'s already sorted.',
      },
    ],
    code: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            curr.next = list1; list1 = list1.next;
        } else {
            curr.next = list2; list2 = list2.next;
        }
        curr = curr.next;
    }
    curr.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}`,
    example: {
      input: 'list1 = [1,2,4], list2 = [1,3,4]',
      output: '[1,1,2,3,4,4]',
      walkthrough: 'Compare 1≤1 → take l1(1), compare 2>1 → take l2(1), compare 2≤3 → take l1(2), ...',
    },
  },

  // ── 876: Middle of Linked List ───────────────────────────────────────────
  {
    id: 876,
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    pattern: 'Fast & Slow Pointers',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Find the middle node of a linked list using fast/slow pointers in one pass.',
    intuition: 'When fast reaches the end, slow is exactly at the middle. Fast moves 2× speed so when fast is done, slow has covered half the distance.',
    steps: [
      {
        title: 'Start both at head',
        explanation: 'slow and fast both begin at head.',
        code: 'ListNode slow = head, fast = head;',
      },
      {
        title: 'Move fast 2×, slow 1×',
        explanation: 'When fast reaches end (null or last node), slow is at middle. For even length, slow lands on second middle node.',
        code: 'while (fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n}\nreturn slow;',
      },
    ],
    code: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    example: {
      input: 'head = [1,2,3,4,5]',
      output: 'Node with value 3',
      walkthrough: 'After step 1: slow=2,fast=3. After step 2: slow=3,fast=5. fast.next=null → return slow(3).',
    },
  },

  // ── 19: Remove Nth Node From End ─────────────────────────────────────────
  {
    id: 19,
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    pattern: 'Two Pointers (Gap of N)',
    timeComplexity: 'O(L)',
    spaceComplexity: 'O(1)',
    summary: 'Remove the nth node from the end in one pass by maintaining a gap of n between two pointers.',
    intuition: 'Advance a fast pointer n steps ahead. Then move both slow and fast together. When fast reaches the end, slow is at the node just before the target. Delete slow.next.',
    steps: [
      {
        title: 'Advance fast pointer n steps',
        explanation: 'Start with a dummy head to handle edge case of removing the first node.',
        code: 'ListNode dummy = new ListNode(0);\ndummy.next = head;\nListNode fast = dummy, slow = dummy;\nfor (int i = 0; i <= n; i++) fast = fast.next;',
      },
      {
        title: 'Move together until fast is null',
        explanation: 'Gap of n+1 ensures slow is at the predecessor of the node to delete.',
        code: 'while (fast != null) {\n  slow = slow.next;\n  fast = fast.next;\n}\nslow.next = slow.next.next;\nreturn dummy.next;',
        hint: 'Using dummy.next as start means fast advances n+1 steps, placing slow one node before the target.',
      },
    ],
    code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
    example: {
      input: 'head = [1,2,3,4,5], n = 2',
      output: '[1,2,3,5]',
      walkthrough: 'fast advances 3 steps to node 4. Both advance: slow→3, fast→null. slow.next=5 skips 4.',
    },
  },

  // ── 234: Palindrome Linked List ──────────────────────────────────────────
  {
    id: 234,
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    pattern: 'Fast/Slow + Reverse Second Half',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Check if a linked list is a palindrome by finding the middle, reversing the second half, and comparing.',
    intuition: 'Find mid with fast/slow. Reverse the second half in-place. Compare first half with reversed second half node by node. Restore the list if needed.',
    steps: [
      {
        title: 'Find middle with fast/slow',
        explanation: 'slow stops at the middle node after the loop.',
        code: 'ListNode slow = head, fast = head;\nwhile (fast.next != null && fast.next.next != null) {\n  slow = slow.next; fast = fast.next.next;\n}',
      },
      {
        title: 'Reverse second half',
        explanation: 'Reverse from slow.next onward.',
        code: 'ListNode secondHalf = reverse(slow.next);',
      },
      {
        title: 'Compare both halves',
        explanation: 'Walk both pointers; if any values differ → not palindrome.',
        code: 'ListNode p1 = head, p2 = secondHalf;\nwhile (p2 != null) {\n  if (p1.val != p2.val) return false;\n  p1 = p1.next; p2 = p2.next;\n}\nreturn true;',
      },
    ],
    code: `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode second = reverse(slow.next);
    ListNode p1 = head, p2 = second;
    while (p2 != null) {
        if (p1.val != p2.val) return false;
        p1 = p1.next; p2 = p2.next;
    }
    return true;
}
private ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev; prev = curr; curr = next;
    }
    return prev;
}`,
    example: {
      input: 'head = [1,2,2,1]',
      output: 'true',
      walkthrough: 'Middle=node(2 at idx1). Reverse [2,1]→[1,2]. Compare [1,2] vs [1,2] → palindrome.',
    },
  },

  // ── 2: Add Two Numbers ───────────────────────────────────────────────────
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    pattern: 'Linked List Simulation + Carry',
    timeComplexity: 'O(max(m,n))',
    spaceComplexity: 'O(max(m,n))',
    summary: 'Add two numbers represented as reversed linked lists digit by digit, propagating carry.',
    intuition: 'Walk both lists simultaneously like grade-school addition: add digits + carry, the ones digit is the new node value, tens digit becomes the new carry. Continue until both lists are exhausted and carry is 0.',
    steps: [
      {
        title: 'Dummy head + carry variable',
        explanation: 'Dummy head simplifies list construction. carry tracks overflow from each column.',
        code: 'ListNode dummy = new ListNode(0), curr = dummy;\nint carry = 0;',
      },
      {
        title: 'Process each digit column',
        explanation: 'Sum = (l1.val or 0) + (l2.val or 0) + carry. New node = sum % 10. carry = sum / 10.',
        code: 'while (l1 != null || l2 != null || carry != 0) {\n  int sum = carry;\n  if (l1 != null) { sum += l1.val; l1 = l1.next; }\n  if (l2 != null) { sum += l2.val; l2 = l2.next; }\n  carry = sum / 10;\n  curr.next = new ListNode(sum % 10);\n  curr = curr.next;\n}\nreturn dummy.next;',
        hint: 'The loop condition includes carry != 0 to handle a final carry-out (e.g. 5+5=10).',
      },
    ],
    code: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        int sum = carry;
        if (l1 != null) { sum += l1.val; l1 = l1.next; }
        if (l2 != null) { sum += l2.val; l2 = l2.next; }
        carry = sum / 10;
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
    }
    return dummy.next;
}`,
    example: {
      input: 'l1 = [2,4,3], l2 = [5,6,4]',
      output: '[7,0,8]',
      walkthrough: '342 + 465 = 807. Node(7)→Node(0)→Node(8). Carry at column 1: 4+6=10 → digit 0, carry 1.',
    },
  },

  // ── 160: Intersection of Two Linked Lists ────────────────────────────────
  {
    id: 160,
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Easy',
    pattern: 'Two Pointers (Path Equalization)',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    summary: 'Find the intersection node by having each pointer traverse both lists — equalizing total path length.',
    intuition: 'Pointer A walks list A then list B. Pointer B walks list B then list A. Both will have walked (lenA + lenB) total steps when they meet. If there\'s an intersection, they reach it at the same time.',
    steps: [
      {
        title: 'Two pointers start at heads',
        explanation: 'pA starts at headA, pB starts at headB.',
        code: 'ListNode pA = headA, pB = headB;',
      },
      {
        title: 'Switch to other list on null',
        explanation: 'When pA reaches end, redirect to headB. When pB reaches end, redirect to headA. They meet at intersection or both become null (no intersection).',
        code: 'while (pA != pB) {\n  pA = (pA == null) ? headB : pA.next;\n  pB = (pB == null) ? headA : pB.next;\n}\nreturn pA; // null if no intersection',
      },
    ],
    code: `public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode pA = headA, pB = headB;
    while (pA != pB) {
        pA = (pA == null) ? headB : pA.next;
        pB = (pB == null) ? headA : pB.next;
    }
    return pA;
}`,
    example: {
      input: 'listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], intersectVal = 8',
      output: 'Node at value 8',
      walkthrough: 'pA walks A(5)+B(6)=11 steps. pB walks B(6)+A(5)=11 steps. Both arrive at node 8 simultaneously.',
    },
  },

  // ── 92: Reverse Linked List II ───────────────────────────────────────────
  {
    id: 92,
    title: 'Reverse Linked List II',
    difficulty: 'Medium',
    pattern: 'In-place Reversal with Anchors',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Reverse a sublist from position left to right in one pass using anchor nodes.',
    intuition: 'Walk to the node just before position left (the "prev" anchor). Then reverse the next (right - left + 1) nodes in place using the standard three-pointer reversal. Reconnect the reversed segment to the rest of the list.',
    steps: [
      {
        title: 'Navigate to left-1 position',
        explanation: 'Use dummy head. Walk prev to node just before position left.',
        code: 'ListNode dummy = new ListNode(0);\ndummy.next = head;\nListNode prev = dummy;\nfor (int i = 0; i < left - 1; i++) prev = prev.next;',
      },
      {
        title: 'Reverse (right - left + 1) nodes',
        explanation: 'curr = prev.next (start of segment). Repeatedly move curr.next to just after prev.',
        code: 'ListNode curr = prev.next;\nfor (int i = 0; i < right - left; i++) {\n  ListNode next = curr.next;\n  curr.next = next.next;\n  next.next = prev.next;\n  prev.next = next;\n}\nreturn dummy.next;',
        hint: 'This "insertion" trick moves the next node to the front of the reversed segment each iteration.',
      },
    ],
    code: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    for (int i = 0; i < left - 1; i++) prev = prev.next;
    ListNode curr = prev.next;
    for (int i = 0; i < right - left; i++) {
        ListNode next = curr.next;
        curr.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    return dummy.next;
}`,
    example: {
      input: 'head = [1,2,3,4,5], left = 2, right = 4',
      output: '[1,4,3,2,5]',
      walkthrough: 'prev=1. Reverse segment [2,3,4]: move 3→front→[3,2], move 4→front→[4,3,2]. Result: 1→4→3→2→5.',
    },
  },

  // ── 23: Merge K Sorted Lists ─────────────────────────────────────────────
  {
    id: 23,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    pattern: 'Min-Heap (K-way merge)',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    summary: 'Merge k sorted linked lists using a min-heap to always pick the smallest current head.',
    intuition: 'Push the head of each list into a min-heap. Pop the minimum → attach to result → push that node\'s next into the heap. Heap always has at most k elements, so each operation is O(log k).',
    steps: [
      {
        title: 'Seed min-heap with all list heads',
        explanation: 'Min-heap ordered by node value. Add the head of each non-null list.',
        code: 'PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);\nfor (ListNode list : lists)\n  if (list != null) heap.offer(list);',
      },
      {
        title: 'Pop min, push next, repeat',
        explanation: 'Each iteration: pop smallest → attach to result → push that node\'s next if non-null.',
        code: 'ListNode dummy = new ListNode(0), curr = dummy;\nwhile (!heap.isEmpty()) {\n  ListNode node = heap.poll();\n  curr.next = node;\n  curr = curr.next;\n  if (node.next != null) heap.offer(node.next);\n}\nreturn dummy.next;',
      },
    ],
    code: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap =
        new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode list : lists)
        if (list != null) heap.offer(list);
    ListNode dummy = new ListNode(0), curr = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        curr.next = node;
        curr = curr.next;
        if (node.next != null) heap.offer(node.next);
    }
    return dummy.next;
}`,
    example: {
      input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      output: '[1,1,2,3,4,4,5,6]',
      walkthrough: 'Heap starts: {1(L1),1(L2),2(L3)}. Pop 1(L1)→push 4. Pop 1(L2)→push 3. Pop 2(L3)→push 6...',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEAPS  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const heapsExtra: Problem[] = [
  // ── 973: K Closest Points to Origin ─────────────────────────────────────
  {
    id: 973,
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    pattern: 'Max-Heap size K',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    summary: 'Return the k closest points to origin (0,0) using a max-heap of size k.',
    intuition: 'Maintain a max-heap of size k ordered by Euclidean distance. When heap exceeds k, evict the farthest point. At the end, heap contains the k nearest points.',
    steps: [
      {
        title: 'Max-heap ordered by squared distance',
        explanation: 'Use squared distance (x²+y²) to avoid sqrt. Max-heap keeps the largest at the top for easy eviction.',
        code: 'PriorityQueue<int[]> heap = new PriorityQueue<>(\n  (a, b) -> (b[0]*b[0]+b[1]*b[1]) - (a[0]*a[0]+a[1]*a[1])\n);',
      },
      {
        title: 'Add each point, evict if size > k',
        explanation: 'Each add is O(log k). If size exceeds k, remove the farthest (heap top).',
        code: 'for (int[] p : points) {\n  heap.offer(p);\n  if (heap.size() > k) heap.poll();\n}\nreturn heap.toArray(new int[0][]);',
      },
    ],
    code: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> heap = new PriorityQueue<>(
        (a, b) -> (b[0]*b[0]+b[1]*b[1]) - (a[0]*a[0]+a[1]*a[1])
    );
    for (int[] p : points) {
        heap.offer(p);
        if (heap.size() > k) heap.poll();
    }
    return heap.toArray(new int[0][]);
}`,
    example: {
      input: 'points = [[1,3],[-2,2]], k = 1',
      output: '[[-2,2]]',
      walkthrough: 'dist²([1,3])=10, dist²([-2,2])=8. Heap keeps [-2,2] (closer to origin).',
    },
  },

  // ── 1046: Last Stone Weight ──────────────────────────────────────────────
  {
    id: 1046,
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    pattern: 'Max-Heap Simulation',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    summary: 'Simulate smashing stones: repeatedly pick two heaviest, smash them, put remainder back.',
    intuition: 'A max-heap gives O(log n) access to the two heaviest stones. After smashing, if they aren\'t equal, push the difference back. Continue until one or zero stones remain.',
    steps: [
      {
        title: 'Build max-heap',
        explanation: 'Java\'s PriorityQueue is min-heap; negate values to simulate max-heap.',
        code: 'PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());\nfor (int s : stones) heap.offer(s);',
      },
      {
        title: 'Smash top two until ≤1 stone',
        explanation: 'Pop two heaviest. If different, push their difference back.',
        code: 'while (heap.size() > 1) {\n  int y = heap.poll(), x = heap.poll();\n  if (x != y) heap.offer(y - x);\n}\nreturn heap.isEmpty() ? 0 : heap.peek();',
      },
    ],
    code: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int s : stones) heap.offer(s);
    while (heap.size() > 1) {
        int y = heap.poll(), x = heap.poll();
        if (x != y) heap.offer(y - x);
    }
    return heap.isEmpty() ? 0 : heap.peek();
}`,
    example: {
      input: 'stones = [2,7,4,1,8,1]',
      output: '1',
      walkthrough: '8,7→diff=1 back. 4,2→diff=2 back. 2,1→diff=1 back. 1,1→equal, both gone. 1 remains.',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STACKS  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const stacksExtra: Problem[] = [
  // ── 155: Min Stack ───────────────────────────────────────────────────────
  {
    id: 155,
    title: 'Min Stack',
    difficulty: 'Medium',
    pattern: 'Stack + Parallel Min-Tracking Stack',
    timeComplexity: 'O(1) all ops',
    spaceComplexity: 'O(n)',
    summary: 'Design a stack with O(1) getMin() using a second stack that tracks running minimums.',
    intuition: 'Maintain two stacks: the main stack and a minStack. When pushing, also push to minStack if the new value ≤ current min. When popping, if top of main == top of minStack, also pop minStack.',
    steps: [
      {
        title: 'Two stacks: main and minStack',
        explanation: 'minStack stores the current minimum at each point in time.',
        code: 'Deque<Integer> stack = new ArrayDeque<>();\nDeque<Integer> minStack = new ArrayDeque<>();',
      },
      {
        title: 'Push: track min in parallel',
        explanation: 'Push to main always. Push to minStack only if new val ≤ current min (or minStack empty).',
        code: 'public void push(int val) {\n  stack.push(val);\n  if (minStack.isEmpty() || val <= minStack.peek())\n    minStack.push(val);\n}',
      },
      {
        title: 'Pop: maintain minStack consistency',
        explanation: 'If the popped value equals minStack top, pop minStack too.',
        code: 'public void pop() {\n  if (stack.pop().equals(minStack.peek()))\n    minStack.pop();\n}\npublic int getMin() { return minStack.peek(); }',
      },
    ],
    code: `class MinStack {
    Deque<Integer> stack = new ArrayDeque<>();
    Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek())
            minStack.push(val);
    }
    public void pop() {
        if (stack.pop().equals(minStack.peek()))
            minStack.pop();
    }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    example: {
      input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
      output: 'getMin()=-3, top()=0, getMin()=-2',
      walkthrough: 'minStack after pushes: [-2, -3]. pop(-3) removes from minStack. top()=0, getMin()=-2.',
    },
  },

  // ── 150: Evaluate Reverse Polish Notation ────────────────────────────────
  {
    id: 150,
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    pattern: 'Stack (operand/operator)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Evaluate an RPN expression by pushing operands and applying operators to the top two stack elements.',
    intuition: 'Push numbers onto the stack. When you see an operator, pop two numbers, apply the operator, push the result. The final stack top is the answer.',
    steps: [
      {
        title: 'Number → push, operator → compute',
        explanation: 'If token is a number, push it. If it\'s an operator, pop b then a, compute a op b, push result.',
        code: 'Deque<Integer> stack = new ArrayDeque<>();\nfor (String token : tokens) {\n  if ("+-*/".contains(token)) {\n    int b = stack.pop(), a = stack.pop();\n    switch(token) {\n      case "+": stack.push(a+b); break;\n      case "-": stack.push(a-b); break;\n      case "*": stack.push(a*b); break;\n      case "/": stack.push(a/b); break;\n    }\n  } else {\n    stack.push(Integer.parseInt(token));\n  }\n}',
      },
    ],
    code: `public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String token : tokens) {
        if ("+-*/".contains(token)) {
            int b = stack.pop(), a = stack.pop();
            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
            }
        } else {
            stack.push(Integer.parseInt(token));
        }
    }
    return stack.pop();
}`,
    example: {
      input: 'tokens = ["2","1","+","3","*"]',
      output: '9',
      walkthrough: 'push 2, push 1, + → pop(1,2) push 3. push 3. * → pop(3,3) push 9. Return 9.',
    },
  },

  // ── 42: Trapping Rain Water ──────────────────────────────────────────────
  {
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    pattern: 'Monotonic Stack / Two Pointers',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) two-pointer / O(n) stack',
    summary: 'Calculate total trapped water using two-pointer technique tracking left/right max heights.',
    intuition: 'Water above position i is bounded by min(maxLeft[i], maxRight[i]) - height[i]. Two-pointer approach: whichever side has a smaller max, process that side (the smaller max is the bottleneck).',
    steps: [
      {
        title: 'Two pointers from both ends',
        explanation: 'l=0, r=n-1. Track leftMax and rightMax. Water at each position is min(leftMax,rightMax) - height.',
        code: 'int l=0, r=height.length-1, leftMax=0, rightMax=0, water=0;',
      },
      {
        title: 'Process smaller-max side',
        explanation: 'If leftMax ≤ rightMax: water += leftMax - height[l] (if positive); advance l. Else: process right side.',
        code: 'while (l < r) {\n  if (height[l] <= height[r]) {\n    leftMax = Math.max(leftMax, height[l]);\n    water += leftMax - height[l];\n    l++;\n  } else {\n    rightMax = Math.max(rightMax, height[r]);\n    water += rightMax - height[r];\n    r--;\n  }\n}\nreturn water;',
        hint: 'The key insight: if leftMax ≤ rightMax, water at l is guaranteed to be leftMax-height[l] because the right will hold it.',
      },
    ],
    code: `public int trap(int[] height) {
    int l = 0, r = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (l < r) {
        if (height[l] <= height[r]) {
            leftMax = Math.max(leftMax, height[l]);
            water += leftMax - height[l];
            l++;
        } else {
            rightMax = Math.max(rightMax, height[r]);
            water += rightMax - height[r];
            r--;
        }
    }
    return water;
}`,
    example: {
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
      output: '6',
      walkthrough: 'Trapped water at positions 2(1),4(1),5(2),6(1),9(1) = 6 total units.',
    },
  },

  // ── 503: Next Greater Element II ─────────────────────────────────────────
  {
    id: 503,
    title: 'Next Greater Element II',
    difficulty: 'Medium',
    pattern: 'Monotonic Stack (Circular)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Find next greater element in a circular array using a monotonic stack with 2× traversal.',
    intuition: 'Simulate circular behavior by iterating 0..2n-1 (use i % n for indices). Use a monotonic decreasing stack of indices. On the second pass, we can resolve elements that wrapped around.',
    steps: [
      {
        title: 'Initialize result as -1, traverse 2×',
        explanation: 'Default -1 (no greater element). Loop 2n times with i%n to simulate circularity.',
        code: 'int n = nums.length;\nint[] result = new int[n];\nArrays.fill(result, -1);\nDeque<Integer> stack = new ArrayDeque<>();',
      },
      {
        title: 'Monotonic stack, resolve on warmer',
        explanation: 'For each i: while stack not empty and nums[i%n] > nums[stack.top], set result[stack.pop()] = nums[i%n]. Push i%n (only in first pass or unresolved).',
        code: 'for (int i = 0; i < 2 * n; i++) {\n  while (!stack.isEmpty() && nums[i%n] > nums[stack.peek()])\n    result[stack.pop()] = nums[i % n];\n  if (i < n) stack.push(i);\n}\nreturn result;',
        hint: 'Only push indices during the first pass (i < n). Second pass only pops and resolves.',
      },
    ],
    code: `public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {
        while (!stack.isEmpty() && nums[i % n] > nums[stack.peek()])
            result[stack.pop()] = nums[i % n];
        if (i < n) stack.push(i);
    }
    return result;
}`,
    example: {
      input: 'nums = [1,2,1]',
      output: '[2,-1,2]',
      walkthrough: 'Index 0(val=1): next greater is 2. Index 1(val=2): no greater in full circle → -1. Index 2(val=1): wraps → finds 2.',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HASHING / MAPS  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const hashingExtra: Problem[] = [
  // ── 242: Valid Anagram ───────────────────────────────────────────────────
  {
    id: 242,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    pattern: 'Frequency Count Array / HashMap',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for lowercase letters',
    summary: 'Check if two strings are anagrams by comparing character frequency counts.',
    intuition: 'Two strings are anagrams if and only if they have the exact same character frequencies. Use a 26-element int array as a fast frequency map for lowercase letters.',
    steps: [
      {
        title: 'Early return if lengths differ',
        explanation: 'Anagrams must have the same length.',
        code: 'if (s.length() != t.length()) return false;',
      },
      {
        title: 'Count frequencies: increment for s, decrement for t',
        explanation: 'Same letter increments and decrements cancel out. Any non-zero count means mismatch.',
        code: 'int[] count = new int[26];\nfor (int i = 0; i < s.length(); i++) {\n  count[s.charAt(i) - \'a\']++;\n  count[t.charAt(i) - \'a\']--;\n}\nfor (int c : count) if (c != 0) return false;\nreturn true;',
      },
    ],
    code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}`,
    example: {
      input: 's = "anagram", t = "nagaram"',
      output: 'true',
      walkthrough: 'Both have: a×3, n×1, g×1, r×1, m×1. All counts cancel to 0 → anagram.',
    },
  },

  // ── 49: Group Anagrams ───────────────────────────────────────────────────
  {
    id: 49,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    pattern: 'HashMap (sorted key or frequency key)',
    timeComplexity: 'O(n × k log k)',
    spaceComplexity: 'O(n × k)',
    summary: 'Group strings that are anagrams of each other by using sorted characters as a HashMap key.',
    intuition: 'Anagrams produce the same string when sorted. Use the sorted string as a key in a HashMap; all anagrams group under the same key automatically.',
    steps: [
      {
        title: 'Sort each string → use as HashMap key',
        explanation: 'Sorting "eat" → "aet", "tea" → "aet", "ate" → "aet". They all map to the same group.',
        code: 'Map<String, List<String>> map = new HashMap<>();\nfor (String word : strs) {\n  char[] chars = word.toCharArray();\n  Arrays.sort(chars);\n  String key = new String(chars);\n  map.computeIfAbsent(key, k -> new ArrayList<>()).add(word);\n}',
      },
      {
        title: 'Return map values',
        explanation: 'Each entry in the map is one group of anagrams.',
        code: 'return new ArrayList<>(map.values());',
      },
    ],
    code: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String word : strs) {
        char[] chars = word.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
    }
    return new ArrayList<>(map.values());
}`,
    example: {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      walkthrough: '"eat","tea","ate" all sort to "aet" → same group. "tan","nat" → "ant". "bat" → "abt".',
    },
  },

  // ── 560: Subarray Sum Equals K ───────────────────────────────────────────
  {
    id: 560,
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    pattern: 'Prefix Sum + HashMap',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Count subarrays summing to k using prefix sums. A subarray [i+1..j] sums to k iff prefixSum[j] - prefixSum[i] = k.',
    intuition: 'Track prefix sums in a HashMap. For each position j, check how many previous prefix sums equal (currentSum - k). If prefixSum[j] - prefixSum[i] = k, the subarray (i,j] sums to k.',
    steps: [
      {
        title: 'Prefix sum + frequency map',
        explanation: 'Map stores {prefixSum → count of times seen}. Initialize {0: 1} to handle subarrays starting at index 0.',
        code: 'Map<Integer, Integer> map = new HashMap<>();\nmap.put(0, 1);\nint sum = 0, count = 0;',
      },
      {
        title: 'For each element: count valid subarrays, update map',
        explanation: 'sum += nums[i]. If (sum-k) is in map, those prefix sums form valid subarrays. Then record current sum.',
        code: 'for (int num : nums) {\n  sum += num;\n  count += map.getOrDefault(sum - k, 0);\n  map.merge(sum, 1, Integer::sum);\n}\nreturn count;',
        hint: 'The map.get(0)=1 handles the case where the whole prefix sums to k (prefix[i]-0=k).',
      },
    ],
    code: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        count += map.getOrDefault(sum - k, 0);
        map.merge(sum, 1, Integer::sum);
    }
    return count;
}`,
    example: {
      input: 'nums = [1,1,1], k = 2',
      output: '2',
      walkthrough: 'prefixSums=[1,2,3]. At sum=2: map has {0:1,1:1}. sum-k=0 → count+=1. At sum=3: sum-k=1 → count+=1. Total=2.',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUEUES / BFS  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const queuesExtra: Problem[] = [
  // ── 933: Number of Recent Calls ──────────────────────────────────────────
  {
    id: 933,
    title: 'Number of Recent Calls',
    difficulty: 'Easy',
    pattern: 'Queue (Sliding Time Window)',
    timeComplexity: 'O(1) amortized',
    spaceComplexity: 'O(n)',
    summary: 'Count calls in the last 3000ms by maintaining a queue of timestamps, evicting old ones.',
    intuition: 'Add each timestamp to a queue. Remove all timestamps from the front that are outside the [t-3000, t] window. The queue size is the answer — it models a sliding window rate limiter.',
    steps: [
      {
        title: 'Queue holds recent timestamps',
        explanation: 'All timestamps in the queue are within [t-3000, t].',
        code: 'Queue<Integer> q = new LinkedList<>();',
      },
      {
        title: 'Add new timestamp, evict stale ones',
        explanation: 'Add t to queue. Remove front entries where q.front < t-3000. Return queue size.',
        code: 'public int ping(int t) {\n  q.offer(t);\n  while (q.peek() < t - 3000) q.poll();\n  return q.size();\n}',
        hint: 'Because t is always strictly increasing, we only remove from the front — never the middle.',
      },
    ],
    code: `class RecentCounter {
    Queue<Integer> q = new LinkedList<>();
    public int ping(int t) {
        q.offer(t);
        while (q.peek() < t - 3000) q.poll();
        return q.size();
    }
}`,
    example: {
      input: 'ping(1), ping(100), ping(3001), ping(3002)',
      output: '[1, 2, 3, 3]',
      walkthrough: 'ping(3002): queue=[1,100,3001,3002]. Evict 1 (1 < 3002-3000=2). Queue=[100,3001,3002] → size 3.',
    },
  },

  // ── 200: Number of Islands ───────────────────────────────────────────────
  {
    id: 200,
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'BFS / DFS (flood fill)',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(min(m,n)) BFS queue',
    summary: 'Count connected components of \'1\'s in a grid using BFS flood-fill to mark each island.',
    intuition: 'Scan the grid. When a \'1\' is found, increment island count and BFS to mark the entire island as visited (set cells to \'0\'). Continue scanning.',
    steps: [
      {
        title: 'Scan for unvisited land cells',
        explanation: 'For each cell: if grid[r][c] == \'1\', it\'s a new island. Increment count. Flood-fill with BFS.',
        code: 'for (int r = 0; r < grid.length; r++)\n  for (int c = 0; c < grid[0].length; c++)\n    if (grid[r][c] == \'1\') { count++; bfs(grid, r, c); }',
      },
      {
        title: 'BFS flood-fill marks island as visited',
        explanation: 'Enqueue (r,c), mark \'0\'. Expand in 4 directions — enqueue any \'1\' neighbors.',
        code: 'void bfs(char[][] g, int r, int c) {\n  Queue<int[]> q = new LinkedList<>();\n  q.offer(new int[]{r,c}); g[r][c]=\'0\';\n  int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};\n  while (!q.isEmpty()) {\n    int[] p = q.poll();\n    for (int[] d : dirs) {\n      int nr=p[0]+d[0], nc=p[1]+d[1];\n      if (nr>=0&&nr<g.length&&nc>=0&&nc<g[0].length&&g[nr][nc]==\'1\') {\n        g[nr][nc]=\'0\'; q.offer(new int[]{nr,nc});\n      }\n    }\n  }\n}',
        hint: 'Marking \'1\'→\'0\' in-place avoids a visited set. Only do this if mutating input is acceptable.',
      },
    ],
    code: `public int numIslands(char[][] grid) {
    int count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                Queue<int[]> q = new LinkedList<>();
                q.offer(new int[]{r,c});
                grid[r][c] = '0';
                while (!q.isEmpty()) {
                    int[] p = q.poll();
                    for (int[] d : dirs) {
                        int nr=p[0]+d[0], nc=p[1]+d[1];
                        if (nr>=0&&nr<grid.length&&nc>=0&&nc<grid[0].length&&grid[nr][nc]=='1') {
                            grid[nr][nc]='0'; q.offer(new int[]{nr,nc});
                        }
                    }
                }
            }
        }
    }
    return count;
}`,
    example: {
      input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]',
      output: '2',
      walkthrough: 'BFS from (0,0) covers (0,1),(1,1) → island 1. BFS from (2,2) covers just (2,2) → island 2.',
    },
  },

  // ── 102: Binary Tree Level Order Traversal ───────────────────────────────
  {
    id: 102,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    pattern: 'BFS Level-by-Level',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Return nodes of a binary tree level by level using BFS, capturing each level\'s size before expansion.',
    intuition: 'BFS naturally visits nodes level by level. The key trick: before processing each level, record queue.size() — that\'s how many nodes are on this level. Process exactly that many, then start the next level.',
    steps: [
      {
        title: 'Seed queue with root',
        explanation: 'Add root to queue. Process until queue is empty.',
        code: 'Queue<TreeNode> q = new LinkedList<>();\nif (root != null) q.offer(root);',
      },
      {
        title: 'Per-level: capture size, drain, collect',
        explanation: 'At start of each iteration: levelSize = q.size(). Process exactly levelSize nodes. Their children become the next level.',
        code: 'while (!q.isEmpty()) {\n  int size = q.size();\n  List<Integer> level = new ArrayList<>();\n  for (int i = 0; i < size; i++) {\n    TreeNode node = q.poll();\n    level.add(node.val);\n    if (node.left != null) q.offer(node.left);\n    if (node.right != null) q.offer(node.right);\n  }\n  result.add(level);\n}',
        hint: 'The inner for-loop uses the captured size — not q.size() — because the queue grows as children are added.',
      },
    ],
    code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    Queue<TreeNode> q = new LinkedList<>();
    if (root != null) q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        result.add(level);
    }
    return result;
}`,
    example: {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '[[3],[9,20],[15,7]]',
      walkthrough: 'Level 1: [3]. Enqueue 9,20. Level 2: [9,20]. Enqueue 15,7. Level 3: [15,7].',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERVALS  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const intervalsExtra: Problem[] = [
  // ── 57: Insert Interval ──────────────────────────────────────────────────
  {
    id: 57,
    title: 'Insert Interval',
    difficulty: 'Medium',
    pattern: 'Linear Scan + Merge',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Insert a new interval into a sorted non-overlapping list, merging any overlaps.',
    intuition: 'Three phases: 1) Add all intervals strictly before the new one. 2) Merge all overlapping intervals with the new one. 3) Add all intervals strictly after. Overlap = newInterval.start ≤ interval.end.',
    steps: [
      {
        title: 'Phase 1: copy all non-overlapping intervals before',
        explanation: 'While current interval ends before newInterval starts → no overlap, just add it.',
        code: 'int i = 0;\nwhile (i < n && intervals[i][1] < newInterval[0])\n  result.add(intervals[i++]);',
      },
      {
        title: 'Phase 2: merge all overlapping',
        explanation: 'While current interval starts before newInterval ends → overlap. Expand newInterval to cover both.',
        code: 'while (i < n && intervals[i][0] <= newInterval[1]) {\n  newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n  newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n  i++;\n}\nresult.add(newInterval);',
      },
      {
        title: 'Phase 3: copy remaining',
        explanation: 'All remaining intervals start after newInterval ends — no overlap.',
        code: 'while (i < n) result.add(intervals[i++]);\nreturn result.toArray(new int[0][]);',
      },
    ],
    code: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;
    while (i < n && intervals[i][1] < newInterval[0])
        result.add(intervals[i++]);
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);
    while (i < n) result.add(intervals[i++]);
    return result.toArray(new int[0][]);
}`,
    example: {
      input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      output: '[[1,5],[6,9]]',
      walkthrough: 'Phase 1: none (1 doesn\'t end before 2). Phase 2: [1,3] overlaps [2,5] → merge to [1,5]. Phase 3: add [6,9].',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BINARY SEARCH  (additional problems)
// ─────────────────────────────────────────────────────────────────────────────
export const binarySearchExtra: Problem[] = [
  // ── 153: Find Minimum in Rotated Sorted Array ────────────────────────────
  {
    id: 153,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search (find rotation point)',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    summary: 'Find the minimum element in a rotated sorted array by binary searching for the inflection point.',
    intuition: 'The minimum is at the rotation point. If nums[mid] > nums[right], the minimum is in the right half. Otherwise, the minimum is in the left half (including mid). Converges when l == r.',
    steps: [
      {
        title: 'Binary search comparing mid to right',
        explanation: 'If nums[mid] > nums[r]: right half has the min → l = mid+1. Else: left half (or mid) has the min → r = mid.',
        code: 'int l = 0, r = nums.length - 1;\nwhile (l < r) {\n  int mid = l + (r - l) / 2;\n  if (nums[mid] > nums[r]) l = mid + 1;\n  else r = mid;\n}\nreturn nums[l];',
        hint: 'Compare to nums[r] (not nums[l]) — if the right boundary is larger than mid, rotation is on the left.',
      },
    ],
    code: `public int findMin(int[] nums) {
    int l = 0, r = nums.length - 1;
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] > nums[r]) l = mid + 1;
        else r = mid;
    }
    return nums[l];
}`,
    example: {
      input: 'nums = [3,4,5,1,2]',
      output: '1',
      walkthrough: 'l=0,r=4,mid=2: nums[2]=5>nums[4]=2 → l=3. l=3,r=4,mid=3: nums[3]=1≤nums[4]=2 → r=3. l==r=3. Return nums[3]=1.',
    },
  },

  // ── 74: Search a 2D Matrix ───────────────────────────────────────────────
  {
    id: 74,
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    pattern: 'Binary Search (flatten matrix)',
    timeComplexity: 'O(log(m × n))',
    spaceComplexity: 'O(1)',
    summary: 'Binary search the matrix by treating it as a flattened sorted array. Map 1D index back to 2D.',
    intuition: 'Treat the m×n matrix as a single sorted array of length m×n. For a 1D index mid: row = mid/n, col = mid%n. Binary search on this virtual array.',
    steps: [
      {
        title: 'Flatten: treat matrix as 1D array of size m×n',
        explanation: 'l=0, r=m*n-1. Each mid index maps to matrix[mid/n][mid%n].',
        code: 'int m=matrix.length, n=matrix[0].length;\nint l=0, r=m*n-1;',
      },
      {
        title: 'Standard binary search',
        explanation: 'Compare matrix[mid/n][mid%n] with target. Adjust l or r accordingly.',
        code: 'while (l <= r) {\n  int mid = l + (r - l) / 2;\n  int val = matrix[mid / n][mid % n];\n  if (val == target) return true;\n  else if (val < target) l = mid + 1;\n  else r = mid - 1;\n}\nreturn false;',
      },
    ],
    code: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int l = 0, r = m * n - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) l = mid + 1;
        else r = mid - 1;
    }
    return false;
}`,
    example: {
      input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
      output: 'true',
      walkthrough: 'm=3,n=4. mid=5 → matrix[1][1]=11>3 → r=4. mid=2 → matrix[0][2]=5>3 → r=1. mid=0 → 1<3 → l=1. mid=1 → matrix[0][1]=3 ✓',
    },
  },

  // ── 162: Find Peak Element ───────────────────────────────────────────────
  {
    id: 162,
    title: 'Find Peak Element',
    difficulty: 'Medium',
    pattern: 'Binary Search (convergence to peak)',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    summary: 'Find any peak element (greater than neighbors) in O(log n) using binary search.',
    intuition: 'If nums[mid] < nums[mid+1], a peak must exist in the right half (the curve is still rising). Otherwise, a peak exists in the left half (including mid). Binary search converges to a peak.',
    steps: [
      {
        title: 'Compare mid to mid+1',
        explanation: 'If nums[mid] < nums[mid+1]: ascending slope → peak is in right half (l=mid+1). Else: descending or flat → peak is in left half including mid (r=mid).',
        code: 'int l = 0, r = nums.length - 1;\nwhile (l < r) {\n  int mid = l + (r - l) / 2;\n  if (nums[mid] < nums[mid + 1]) l = mid + 1;\n  else r = mid;\n}\nreturn l;',
        hint: 'Boundaries are treated as -∞ so nums[0] and nums[n-1] can be peaks if larger than their single neighbor.',
      },
    ],
    code: `public int findPeakElement(int[] nums) {
    int l = 0, r = nums.length - 1;
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] < nums[mid + 1]) l = mid + 1;
        else r = mid;
    }
    return l;
}`,
    example: {
      input: 'nums = [1,2,1,3,5,6,4]',
      output: '5 (index)',
      walkthrough: 'mid=3(val=3)<nums[4]=5 → l=4. mid=5(val=6)>nums[6]=4 → r=5. l==r=5. Return 5.',
    },
  },
];
