import type { SeedModule } from "../types.ts";

export const m05: SeedModule = {
  title: "Linked Lists",
  description:
    "Manipulate pointer-based sequences confidently, from basic traversal to cycle detection and merging.",
  lessons: [
    {
      title: "Singly Linked List Traversal",
      durationMin: 7,
      content:
        "A singly linked list is a chain of nodes where each node holds a value and a pointer to the next node. Unlike arrays, nodes are scattered in memory, so there is no O(1) index access; reaching the k-th node costs O(k). In exchange, inserting or deleting a node is O(1) once you hold a pointer to the node before it.\n\nTraversal follows a fixed shape: cur = head; while cur is not null, process cur, then cur = cur.next. Counting nodes, searching for a value, and finding the tail all use this loop. Insertion at the head is O(1): newNode.next = head, head = newNode. Insertion at the tail is O(n) unless you maintain a tail pointer.\n\nDeleting a node requires access to its predecessor so you can set prev.next = cur.next. If you are only given the node to delete and it is not the tail, the trick is to copy the next node's value into it and delete the next node instead.\n\nInterview tip: draw the boxes and arrows before coding. Pitfall: the two bugs that account for most linked list failures are losing the reference to the rest of the list by overwriting next too early, and failing to handle an empty list or single-node list. Always test with zero, one, and two nodes.",
      problems: [
        {
          title: "Access Cost",
          prompt:
            "What is the time complexity of accessing the element at position k in a singly linked list of n nodes, given only the head pointer?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log k)", "O(k)", "O(n log n)"],
          answer: "O(k)",
          explanation:
            "You must follow k next pointers from the head because nodes are not stored contiguously.",
        },
        {
          title: "Head Insertion",
          prompt:
            "What is the time complexity of inserting a new node at the head of a singly linked list?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(1)",
          explanation:
            "Only two pointer assignments are needed regardless of list length.",
        },
        {
          title: "Delete Without Predecessor",
          prompt:
            "You are given only a pointer to a non-tail node to delete. Which trick works?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Copy the next node's value into this node and unlink the next node",
            "Set the node's value to null",
            "Walk backward to find the predecessor",
            "It is impossible without the head",
          ],
          answer: "Copy the next node's value into this node and unlink the next node",
          explanation:
            "Overwriting the node with its successor's data and skipping the successor has the same visible effect.",
        },
        {
          title: "Tail Insert",
          prompt:
            "Without a stored tail pointer, appending to the end of a list with n nodes costs how much?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "You must traverse the whole list to reach the last node.",
        },
        {
          title: "Array Versus List",
          prompt:
            "Which operation is faster on a linked list than on a dynamic array?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Inserting at the front",
            "Accessing the middle element",
            "Binary searching sorted data",
            "Reading the last element by index",
          ],
          answer: "Inserting at the front",
          explanation:
            "A list inserts at the head in O(1) while an array must shift all n elements.",
        },
        {
          title: "Traversal Bug",
          prompt:
            "Which mistake causes the rest of a list to be lost during an insertion?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Overwriting cur.next before saving the old next pointer",
            "Checking for null before dereferencing",
            "Using a dummy head node",
            "Keeping a tail pointer",
          ],
          answer: "Overwriting cur.next before saving the old next pointer",
          explanation:
            "Once the only reference to the remainder is overwritten, the nodes become unreachable.",
        },
      ],
    },
    {
      title: "Reversing a Linked List",
      durationMin: 8,
      content:
        "Reversing a singly linked list in place is the most asked linked list question. Keep three pointers: prev starting at null, cur starting at head, and a temporary next. In each step save next = cur.next, point cur.next = prev, then advance prev = cur and cur = next. When cur becomes null, prev is the new head. It is O(n) time and O(1) space.\n\nTrace 1 -> 2 -> 3. Step one: next is 2, node 1 now points to null, prev is 1, cur is 2. Step two: next is 3, node 2 points to 1, prev is 2, cur is 3. Step three: next is null, node 3 points to 2, prev is 3, cur is null. Return prev, giving 3 -> 2 -> 1.\n\nThe recursive version reverses the rest of the list first, then sets head.next.next = head and head.next = null. It is elegant but uses O(n) stack space, which is worth mentioning.\n\nThe iterative reversal is a building block for reversing a sublist between positions m and n, reversing in groups of k, checking whether a list is a palindrome by reversing the second half, and adding two numbers stored most-significant-digit first. Pitfall: forgetting to save next before overwriting cur.next loses the remainder of the list immediately.",
      problems: [
        {
          title: "Pointer State Mid-Reversal",
          prompt:
            "Reversing 1 -> 2 -> 3 -> 4 iteratively, after exactly two loop iterations, which node does prev point to?",
          type: "mcq",
          difficulty: "medium",
          options: ["1", "2", "3", "4"],
          answer: "2",
          explanation:
            "After the first iteration prev is node 1, and after the second iteration prev is node 2 with node 2 pointing back to node 1.",
        },
        {
          title: "Recursive Reversal Space",
          prompt:
            "What is the space complexity of the recursive linked list reversal for a list of n nodes, counting the call stack?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "The recursion goes n levels deep before unwinding, so n stack frames are live at once.",
        },
        {
          title: "Return Value",
          prompt:
            "When the iterative reversal loop ends because cur is null, which pointer is the new head?",
          type: "mcq",
          difficulty: "easy",
          options: ["prev", "cur", "next", "head"],
          answer: "prev",
          explanation:
            "prev always trails cur by one node, so it ends on the last original node, which is the new head.",
        },
        {
          title: "Step Order",
          prompt:
            "Which sequence of assignments is correct for one iteration of iterative reversal?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "next = cur.next; cur.next = prev; prev = cur; cur = next",
            "cur.next = prev; next = cur.next; prev = cur; cur = next",
            "prev = cur; cur = cur.next; cur.next = prev",
            "next = cur.next; prev = cur; cur.next = prev; cur = next",
          ],
          answer: "next = cur.next; cur.next = prev; prev = cur; cur = next",
          explanation:
            "Saving next first prevents losing the remainder, and the pointer flip must happen before prev advances.",
        },
        {
          title: "Palindrome List",
          prompt:
            "Checking whether a linked list is a palindrome in O(1) extra space uses which combination?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Find the middle with fast and slow pointers, reverse the second half, compare both halves",
            "Copy to an array and use two pointers",
            "Push all values onto a stack and pop while traversing",
            "Sort the list and compare neighbors",
          ],
          answer: "Find the middle with fast and slow pointers, reverse the second half, compare both halves",
          explanation:
            "Reversing in place avoids the O(n) memory that the array or stack approaches require.",
        },
        {
          title: "Recursive Step",
          prompt:
            "In recursive reversal, after reversing the rest of the list starting at head.next, which two assignments complete the step?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "head.next.next = head; head.next = null",
            "head.next = head.next.next; head = null",
            "head.next.next = null; head.next = head",
            "head.next = head; head.next.next = null",
          ],
          answer: "head.next.next = head; head.next = null",
          explanation:
            "The old successor now becomes the tail of the reversed remainder, so it must point back at head, and head becomes the new tail pointing to null.",
        },
      ],
    },
    {
      title: "Cycle Detection with Floyd's Algorithm",
      durationMin: 9,
      content:
        "A linked list has a cycle if following next pointers eventually revisits a node. The hash set approach stores visited nodes and returns true on a repeat, using O(n) space. Floyd's tortoise and hare algorithm does it in O(1) space: slow moves one step, fast moves two. If there is a cycle, fast laps slow and they meet. If fast or fast.next becomes null, there is no cycle.\n\nWhy must they meet? Once both are inside the cycle, the gap between them shrinks by exactly one each step because fast gains one node per iteration, so the gap reaches zero within one cycle length.\n\nTo find where the cycle starts, after the meeting point reset one pointer to head and move both one step at a time. They meet at the entry node. The proof relies on the fact that the distance from head to the entry equals the distance from the meeting point forward to the entry, modulo the cycle length.\n\nThe algorithm runs in O(n) time. Pitfall: initialize slow and fast both to head, and check fast and fast.next for null at every step. Interview tip: this same algorithm applies to arrays interpreted as index pointers, such as Find the Duplicate Number and Happy Number, where the implicit sequence of states eventually cycles.",
      problems: [
        {
          title: "Meeting Guarantee",
          prompt:
            "Why do the slow and fast pointers always meet if a cycle exists?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The fast pointer skips the cycle entry node",
            "The gap between them inside the cycle shrinks by one each step",
            "The slow pointer stops at the cycle entry",
            "Both pointers move at the same speed inside the cycle",
          ],
          answer: "The gap between them inside the cycle shrinks by one each step",
          explanation:
            "Fast gains exactly one node on slow per iteration, so the distance reaches zero within at most one cycle length.",
        },
        {
          title: "Algorithm Name",
          prompt:
            "What is the common name of the O(1) space cycle detection algorithm that uses a slow and a fast pointer?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Floyd's tortoise and hare",
            "Dijkstra's algorithm",
            "Kadane's algorithm",
            "Kahn's algorithm",
          ],
          answer: "Floyd's tortoise and hare",
          explanation:
            "Floyd's cycle detection algorithm is the standard O(1) space technique.",
        },
        {
          title: "No Cycle Signal",
          prompt:
            "Which condition proves the list has no cycle during Floyd's algorithm?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "fast or fast.next becomes null",
            "slow equals fast",
            "slow becomes null before fast",
            "The loop runs more than n times",
          ],
          answer: "fast or fast.next becomes null",
          explanation:
            "Reaching the end of the list is only possible when there is no cycle.",
        },
        {
          title: "Cycle Entry",
          prompt:
            "After slow and fast meet, how is the cycle's starting node found?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Reset one pointer to head and advance both one step at a time until they meet",
            "Advance fast alone until it returns to the meeting point",
            "Reverse the list",
            "Count nodes with a hash set",
          ],
          answer: "Reset one pointer to head and advance both one step at a time until they meet",
          explanation:
            "The distances from head and from the meeting point to the entry are congruent modulo the cycle length.",
        },
        {
          title: "Hash Set Tradeoff",
          prompt:
            "Compared with Floyd's algorithm, the visited hash set approach to cycle detection has which drawback?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n) extra space", "O(n^2) time", "It cannot find the entry", "It modifies the list"],
          answer: "O(n) extra space",
          explanation:
            "Storing every visited node costs linear memory, while Floyd uses two pointers.",
        },
        {
          title: "Cycle Length",
          prompt:
            "Once slow and fast meet inside a cycle, how can the cycle length be measured?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Keep one pointer fixed and advance the other one step at a time, counting steps until they meet again",
            "Count the total nodes in the list",
            "Advance fast two steps until it hits null",
            "It cannot be measured without extra memory",
          ],
          answer: "Keep one pointer fixed and advance the other one step at a time, counting steps until they meet again",
          explanation:
            "A full lap around the cycle from the meeting point returns to it, and the step count is the cycle length.",
        },
      ],
    },
    {
      title: "Merging Two Sorted Lists",
      durationMin: 8,
      content:
        "Merging two sorted linked lists into one sorted list is the merge step of merge sort expressed with pointers. Create a dummy node and a tail pointer at it. While both lists are non-empty, compare their heads, attach the smaller one to tail, advance that list, and advance tail. When one list runs out, attach the remainder of the other in one assignment. Return dummy.next.\n\nThe algorithm visits each node once, so it is O(n + m) time with O(1) extra space because it reuses the existing nodes rather than creating new ones.\n\nTrace 1 -> 4 and 2 -> 3. Compare 1 and 2, attach 1. Compare 4 and 2, attach 2. Compare 4 and 3, attach 3. The second list is empty, so attach the remaining 4. The result is 1 -> 2 -> 3 -> 4.\n\nMerging generalizes to sorting a linked list in O(n log n) with merge sort, which is preferred over quicksort for lists because it needs no random access. Pitfall: forgetting to attach the leftover tail is the most common bug and silently drops nodes. Interview tip: when the comparison is a tie, attaching from the first list keeps the merge stable, which matters if nodes carry extra data.",
      problems: [
        {
          title: "Merge Complexity",
          prompt:
            "Merging two sorted linked lists of lengths n and m by relinking nodes takes how much time and extra space?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(n + m) time, O(1) space",
            "O(n + m) time, O(n + m) space",
            "O(n * m) time, O(1) space",
            "O((n + m) log(n + m)) time, O(1) space",
          ],
          answer: "O(n + m) time, O(1) space",
          explanation:
            "Each node is examined once and no new nodes are allocated beyond the dummy head.",
        },
        {
          title: "List Sort Choice",
          prompt:
            "Which sorting algorithm is the natural O(n log n) choice for a singly linked list because it needs no random access?",
          type: "mcq",
          difficulty: "medium",
          options: ["Merge sort", "Quicksort", "Heap sort", "Binary insertion sort"],
          answer: "Merge sort",
          explanation:
            "Merge sort only needs sequential traversal and splitting, which linked lists support efficiently.",
        },
        {
          title: "Leftover Tail",
          prompt:
            "After the main loop ends because one list is exhausted, what must be done?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Attach the remaining nodes of the other list to tail.next",
            "Return dummy immediately",
            "Reverse the merged list",
            "Discard the remaining nodes",
          ],
          answer: "Attach the remaining nodes of the other list to tail.next",
          explanation:
            "The remainder is already sorted, so a single pointer assignment completes the merge.",
        },
        {
          title: "Merge Trace",
          prompt:
            "Merge 1 -> 3 -> 5 with 2 -> 2 -> 6. What is the fourth node's value in the result?",
          type: "mcq",
          difficulty: "easy",
          options: ["2", "3", "5", "6"],
          answer: "3",
          explanation:
            "The merged order is 1, 2, 2, 3, 5, 6 and the fourth value is 3.",
        },
        {
          title: "Stability",
          prompt:
            "When both heads have equal values, attaching from the first list first provides which property?",
          type: "mcq",
          difficulty: "medium",
          options: ["Stability", "Lower time complexity", "Lower space", "Cycle safety"],
          answer: "Stability",
          explanation:
            "Preserving the relative order of equal elements from the inputs is the definition of a stable merge.",
        },
        {
          title: "Splitting For Merge Sort",
          prompt:
            "To split a linked list in half for merge sort without knowing its length, which technique is used?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Fast and slow pointers to find the middle, then cut the link",
            "Binary search on node values",
            "Copy to an array and split",
            "Reverse the list and take alternating nodes",
          ],
          answer: "Fast and slow pointers to find the middle, then cut the link",
          explanation:
            "The slow pointer lands at the midpoint in one pass and setting its next to null separates the halves.",
        },
      ],
    },
    {
      title: "Dummy Nodes and Removing the Nth From End",
      durationMin: 8,
      content:
        "A dummy node is a placeholder placed before the real head so that the head is no longer a special case. When you might delete the first node, insert before it, or build a new list from scratch, start with dummy.next = head and return dummy.next at the end. This removes a whole class of null-pointer bugs.\n\nRemove Nth Node From End shows the pattern together with a two-pointer gap. Place fast and slow both at the dummy. Advance fast n + 1 steps. Then move both one step at a time until fast is null. At that moment slow is just before the node to delete, so set slow.next = slow.next.next. The whole thing is one pass, O(L) time and O(1) space, where L is the list length.\n\nTrace 1 -> 2 -> 3 -> 4 -> 5 with n = 2. Fast advances three steps to node 3. Moving both until fast is null takes three more steps, leaving slow at node 3. Removing slow.next deletes node 4, giving 1 -> 2 -> 3 -> 5.\n\nPitfall: advancing fast only n steps and starting slow at head instead of dummy fails when the node to delete is the head itself, for example a single-node list with n = 1. Interview tip: whenever you write if head is null or if cur is head, ask whether a dummy would erase that branch.",
      problems: [
        {
          title: "Remove From End Trace",
          prompt:
            "Remove the 3rd node from the end of 10 -> 20 -> 30 -> 40. What is the resulting list?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "10 -> 30 -> 40",
            "10 -> 20 -> 40",
            "20 -> 30 -> 40",
            "10 -> 20 -> 30",
          ],
          answer: "10 -> 30 -> 40",
          explanation:
            "The third node from the end is 20, so it is unlinked and the rest of the list is preserved.",
        },
        {
          title: "Why a Dummy",
          prompt:
            "What is the primary benefit of starting a linked list operation with a dummy node?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "It reduces time complexity from O(n) to O(log n)",
            "It removes the need to special-case the head node",
            "It allows O(1) access to the tail",
            "It prevents cycles from forming",
          ],
          answer: "It removes the need to special-case the head node",
          explanation:
            "With a dummy, deleting or inserting at the head is handled by the same code path as any other position.",
        },
        {
          title: "Gap Size",
          prompt:
            "Starting both pointers at the dummy, how many steps should fast advance before the pointers move together, so that slow ends just before the nth node from the end?",
          type: "mcq",
          difficulty: "medium",
          options: ["n + 1", "n", "n - 1", "2n"],
          answer: "n + 1",
          explanation:
            "A gap of n + 1 leaves slow at the predecessor of the target when fast runs off the end.",
        },
        {
          title: "Head Removal Case",
          prompt:
            "For the single-node list 7 with n = 1, what does the dummy-based removal return?",
          type: "mcq",
          difficulty: "easy",
          options: ["An empty list", "7", "A list with a null node", "An error"],
          answer: "An empty list",
          explanation:
            "slow stays at the dummy and slow.next becomes null, so dummy.next is null.",
        },
        {
          title: "Complexity",
          prompt:
            "What are the time and space complexities of the one-pass remove nth from end?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(L) time, O(1) space",
            "O(L^2) time, O(1) space",
            "O(L) time, O(L) space",
            "O(n) time, O(n) space",
          ],
          answer: "O(L) time, O(1) space",
          explanation:
            "Each pointer traverses the list at most once and only two pointers are kept.",
        },
        {
          title: "Two Pass Alternative",
          prompt:
            "The two-pass approach first counts the list length L. Which node must be unlinked in the second pass?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The node at position L - n counting from 0",
            "The node at position n counting from 0",
            "The node at position L - n + 1 counting from 0",
            "The node at position L counting from 0",
          ],
          answer: "The node at position L - n counting from 0",
          explanation:
            "The nth from the end is the (L - n)th from the front when indexing from zero, so you stop at its predecessor and skip it.",
        },
      ],
    },
  ],
};
