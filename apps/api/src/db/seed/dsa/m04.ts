import type { SeedModule } from "../types.ts";

export const m04: SeedModule = {
  title: "Stacks & Queues",
  description:
    "Use last-in-first-out and first-in-first-out structures to process nested, ordered, and streaming data.",
  lessons: [
    {
      title: "Stack Basics and Valid Parentheses",
      durationMin: 7,
      content:
        "A stack is a last-in-first-out container with O(1) push, pop, and peek. It naturally models anything nested or reversible: function calls, undo history, expression evaluation, and matching delimiters. Most languages implement it with a dynamic array, so there is no need for a special class in interviews.\n\nValid Parentheses is the standard warm-up. Scan the string; push every opening bracket. On a closing bracket, if the stack is empty return false, otherwise pop and check that the popped opener matches the closer. At the end the string is valid only if the stack is empty. A map from closer to opener keeps the matching logic to one line.\n\nTrace '([)]'. Push ( then [. The ) arrives and the top is [, which does not match, so return false. For '{[]}', every closer matches the top and the stack ends empty, so it is valid.\n\nThe run time is O(n) with O(n) worst-case space when the whole string is openers. Pitfall: forgetting the final empty-stack check means '((' is accepted as valid. A second pitfall is popping without checking for emptiness on input like ')', which throws in most languages. Interviewers often start with this problem and then extend it to evaluating reverse Polish notation or simplifying file paths.",
      problems: [
        {
          title: "Validity Check",
          prompt: "Which of the following strings is a valid bracket sequence?",
          type: "mcq",
          difficulty: "easy",
          options: ["([)]", "(()", "{[()]}", "]["],
          answer: "{[()]}",
          explanation:
            "Every closer matches the most recently opened bracket and the stack is empty at the end.",
        },
        {
          title: "Stack Height",
          prompt:
            "After processing the first three characters of '(({)}', how many elements are on the stack?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "3", "0"],
          answer: "3",
          explanation:
            "All three characters are openers, so each is pushed and nothing is popped.",
        },
        {
          title: "Missing Final Check",
          prompt:
            "An implementation returns true whenever the scan finishes without a mismatch but never checks whether the stack is empty. Which input is wrongly accepted?",
          type: "mcq",
          difficulty: "medium",
          options: ["((", "))", "()", "(]"],
          answer: "((",
          explanation:
            "Two openers are pushed and never matched, so the stack is non-empty and the string is invalid.",
        },
        {
          title: "Empty Stack Pop",
          prompt:
            "What should happen when a closing bracket arrives and the stack is empty?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Return false immediately",
            "Push the closing bracket",
            "Ignore it and continue",
            "Return true",
          ],
          answer: "Return false immediately",
          explanation:
            "There is no opener to match, so the sequence cannot be valid.",
        },
        {
          title: "Reverse Polish",
          prompt:
            "Evaluate the reverse Polish expression tokens [2, 1, +, 3, *] using a stack. What is the result?",
          type: "mcq",
          difficulty: "medium",
          options: ["5", "6", "9", "7"],
          answer: "9",
          explanation:
            "2 + 1 = 3 is pushed, then 3 * 3 = 9.",
        },
        {
          title: "Worst Case Space",
          prompt:
            "What is the worst-case space used by the valid parentheses algorithm on a string of length n?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "A string consisting entirely of openers pushes every character.",
        },
      ],
    },
    {
      title: "Monotonic Stack for Next Greater Element",
      durationMin: 10,
      content:
        "A monotonic stack keeps its elements in sorted order, usually storing indices. It answers 'for each element, what is the nearest element to the right (or left) that is greater (or smaller)' in O(n) total time instead of O(n^2).\n\nFor next greater element, scan left to right. While the stack is non-empty and the current value is greater than the value at the index on top, pop that index and record the current value as its answer. Then push the current index. Elements remaining on the stack at the end have no greater element to the right. Each index is pushed once and popped at most once, which proves the linear bound.\n\nTrace [2, 1, 3]. Push 0. The value 1 is not greater than 2, push 1. The value 3 is greater than 1, pop index 1 and set its answer to 3; it is also greater than 2, pop index 0 and set its answer to 3. Push 2. Results are [3, 3, -1].\n\nThis template solves Daily Temperatures, Largest Rectangle in Histogram, and Trapping Rain Water. Pitfall: be deliberate about strict versus non-strict comparisons. Using greater-or-equal versus strictly-greater changes how duplicates are handled and is the difference between a correct and wrong answer on inputs like [2, 2, 3].",
      problems: [
        {
          title: "Daily Temperatures",
          prompt:
            "For temperatures [73, 74, 75, 71, 69, 72, 76], how many days must you wait after day 3 (value 71) for a warmer temperature?",
          type: "mcq",
          difficulty: "medium",
          options: ["1", "2", "3", "4"],
          answer: "2",
          explanation:
            "After 71 at index 3 come 69 and 72; the first warmer value 72 is at index 5, two days later.",
        },
        {
          title: "Structure Choice",
          prompt:
            "Which data structure gives an O(n) solution to the next greater element problem?",
          type: "mcq",
          difficulty: "easy",
          options: ["Monotonic stack", "Min-heap", "Hash map", "Queue"],
          answer: "Monotonic stack",
          explanation:
            "A monotonic stack pops each index at most once, keeping the total work linear.",
        },
        {
          title: "Next Greater Output",
          prompt:
            "What is the next greater element array for [4, 5, 2, 10, 8] using -1 when none exists?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "[5, 10, 10, -1, -1]",
            "[5, 10, 10, 8, -1]",
            "[5, 2, 10, 8, -1]",
            "[10, 10, 10, -1, -1]",
          ],
          answer: "[5, 10, 10, -1, -1]",
          explanation:
            "4 sees 5, 5 and 2 see 10, and 10 and 8 have nothing larger to their right.",
        },
        {
          title: "Why Linear",
          prompt:
            "Why is the monotonic stack algorithm O(n) despite the inner while loop?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Each index is pushed once and popped at most once",
            "The inner loop runs at most twice",
            "The array is sorted",
            "The stack never exceeds size 2",
          ],
          answer: "Each index is pushed once and popped at most once",
          explanation:
            "Total pops cannot exceed total pushes, which is n.",
        },
        {
          title: "Stack Order",
          prompt:
            "In next greater element, the values referenced by the stack from bottom to top are kept in which order?",
          type: "mcq",
          difficulty: "medium",
          options: ["Decreasing", "Increasing", "Insertion order", "Random"],
          answer: "Decreasing",
          explanation:
            "Any value larger than the top pops it, so what remains is strictly decreasing from bottom to top.",
        },
        {
          title: "Largest Rectangle",
          prompt:
            "For the histogram heights [2, 1, 5, 6, 2, 3], what is the largest rectangle area?",
          type: "mcq",
          difficulty: "hard",
          options: ["10", "12", "6", "8"],
          answer: "10",
          explanation:
            "Bars 5 and 6 together give width 2 at height 5 for area 10, which beats height 2 across width 6 for 12 only if all bars were at least 2, which bar 1 prevents.",
        },
      ],
    },
    {
      title: "Min Stack and Auxiliary Stacks",
      durationMin: 8,
      content:
        "Min Stack asks for a stack that supports push, pop, top, and getMin all in O(1). A single stack cannot answer getMin quickly after a pop, because the previous minimum may have been the element just removed. The fix is an auxiliary stack that stores the minimum at each depth.\n\nOn push of x, push x on the main stack and push min(x, minStack.top) on the min stack, or push only when x is less than or equal to the current minimum if you want to save space. On pop, pop the main stack and pop the min stack in lockstep, or only when the popped value equals the min stack top in the space-saving variant. getMin is simply the min stack top.\n\nTrace push 3, push 5, push 2, push 2, pop, getMin. The min stack after the pushes holds 3, 3, 2, 2 in the lockstep variant. After one pop it holds 3, 3, 2, so getMin returns 2. Using less-than instead of less-than-or-equal in the space-saving variant would break this case by storing only one 2.\n\nInterview tip: the two-stack idea generalizes. Implementing a queue with two stacks works by pushing into an input stack and popping from an output stack, refilling the output stack only when it is empty. Each element moves at most twice, so the amortized cost per operation is O(1).",
      problems: [
        {
          title: "Min Stack Trace",
          prompt:
            "Operations: push 7, push 4, push 9, pop, push 2, pop, getMin. What does getMin return?",
          type: "mcq",
          difficulty: "easy",
          options: ["2", "4", "7", "9"],
          answer: "4",
          explanation:
            "After the two pops the stack holds 7 and 4, so the minimum is 4.",
        },
        {
          title: "Queue From Stacks",
          prompt:
            "A queue is implemented with an input stack and an output stack, refilling the output only when empty. What is the amortized time complexity of a dequeue operation?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: "O(1)",
          explanation:
            "Each element is moved from input to output exactly once over its lifetime, so the cost spreads out to constant per operation.",
        },
        {
          title: "Why Auxiliary Stack",
          prompt:
            "Why can a single variable holding the current minimum not support O(1) getMin after pops?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "After popping the minimum there is no way to recover the previous minimum without scanning",
            "Variables cannot store negative numbers",
            "The stack would overflow",
            "Push would become O(n)",
          ],
          answer: "After popping the minimum there is no way to recover the previous minimum without scanning",
          explanation:
            "The history of minimums must be stored, which is exactly what the auxiliary stack does.",
        },
        {
          title: "Space Saving Bug",
          prompt:
            "In the space-saving variant, pushing onto the min stack only when x is strictly less than the current minimum causes which bug?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Popping one of two equal minimums removes the min stack entry too early",
            "getMin becomes O(n)",
            "Push fails on negative numbers",
            "The main stack loses elements",
          ],
          answer: "Popping one of two equal minimums removes the min stack entry too early",
          explanation:
            "With duplicates of the minimum, both must be recorded so that removing one leaves the other as the minimum.",
        },
        {
          title: "Lockstep Contents",
          prompt:
            "Using the lockstep variant, after push 3, push 5, push 2, push 2 what does the min stack hold from bottom to top?",
          type: "mcq",
          difficulty: "easy",
          options: ["3, 3, 2, 2", "3, 5, 2, 2", "3, 2", "2, 2, 3, 3"],
          answer: "3, 3, 2, 2",
          explanation:
            "Each push records the minimum of the new value and the previous minimum.",
        },
        {
          title: "Queue Refill Rule",
          prompt:
            "In the two-stack queue, when should elements be moved from the input stack to the output stack?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Only when the output stack is empty and a dequeue or peek is requested",
            "After every enqueue",
            "After every dequeue",
            "Never, the input stack is dequeued directly",
          ],
          answer: "Only when the output stack is empty and a dequeue or peek is requested",
          explanation:
            "Moving only on demand keeps order correct and guarantees each element is transferred once.",
        },
      ],
    },
    {
      title: "Queue and Deque Operations",
      durationMin: 7,
      content:
        "A queue is first-in-first-out with O(1) enqueue at the back and dequeue at the front. It is the backbone of breadth-first search, task scheduling, and buffering. Removing from the front of a plain dynamic array is O(n) because elements shift, so use a linked list, a circular buffer, or your language's deque type rather than an array with removal at index 0.\n\nA circular queue of capacity k uses a fixed array with head and tail indices that wrap around using modulo. Enqueue writes at tail and sets tail = (tail + 1) mod k; dequeue reads at head and advances it the same way. Track the count or leave one slot empty to distinguish full from empty, since head equal to tail is ambiguous otherwise.\n\nA deque, or double-ended queue, allows O(1) insertion and removal at both ends. It can act as a stack, a queue, or both, and is the key to the sliding window maximum problem.\n\nInterview tip: when the problem says 'process in the order received' or 'level by level' think queue; when it says 'most recent first' think stack. Pitfall: in Python, list.pop(0) is O(n). Reach for collections.deque, and in JavaScript avoid Array.shift in hot loops for the same reason.",
      problems: [
        {
          title: "Circular Queue Trace",
          prompt:
            "A circular queue has capacity 3. Operations: enqueue 1, enqueue 2, enqueue 3, dequeue, enqueue 4, dequeue. What is at the front now?",
          type: "mcq",
          difficulty: "medium",
          options: ["1", "2", "3", "4"],
          answer: "3",
          explanation:
            "The queue held 1, 2, 3; removing 1 and adding 4 gives 2, 3, 4; removing 2 leaves 3 at the front.",
        },
        {
          title: "Front Removal Cost",
          prompt:
            "Using a plain dynamic array as a queue and removing from index 0 costs how much per dequeue?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "Every remaining element shifts one position left after the removal.",
        },
        {
          title: "Full Versus Empty",
          prompt:
            "In a circular buffer, why is head equal to tail ambiguous?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "It happens both when the buffer is empty and when it is completely full",
            "It only happens on overflow",
            "Modulo arithmetic is undefined at that point",
            "It means the buffer has exactly one element",
          ],
          answer: "It happens both when the buffer is empty and when it is completely full",
          explanation:
            "Tracking a count or leaving one slot unused resolves the ambiguity.",
        },
        {
          title: "Tail Update",
          prompt:
            "In a circular queue of capacity k, after writing at tail, which update is correct?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "tail = (tail + 1) mod k",
            "tail = tail + 1",
            "tail = (tail - 1) mod k",
            "tail = head",
          ],
          answer: "tail = (tail + 1) mod k",
          explanation:
            "The modulo wraps the index back to 0 when it reaches the end of the array.",
        },
        {
          title: "Structure For BFS",
          prompt:
            "Which structure processes graph vertices in the order they were discovered, as breadth-first search requires?",
          type: "mcq",
          difficulty: "easy",
          options: ["Queue", "Stack", "Heap", "Hash set"],
          answer: "Queue",
          explanation:
            "First-in-first-out ordering is exactly what makes BFS explore level by level.",
        },
        {
          title: "Deque Capability",
          prompt:
            "Which operation set does a deque support in O(1)?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Insert and remove at both ends",
            "Insert and remove at the front only",
            "Random access by index and sorting",
            "Find the minimum element",
          ],
          answer: "Insert and remove at both ends",
          explanation:
            "A double-ended queue generalizes both the stack and the queue.",
        },
      ],
    },
    {
      title: "Sliding Window Maximum with a Deque",
      durationMin: 10,
      content:
        "Sliding window maximum asks for the largest value in every window of size k. A naive scan is O(n * k) and a heap gives O(n log k), but a monotonic deque achieves O(n). The deque stores indices whose values are in decreasing order from front to back, so the front is always the index of the current window's maximum.\n\nFor each new index i: first pop from the back while the value at the back is less than or equal to arr[i], because those elements can never be the maximum while arr[i] is in the window. Then push i. Next, if the front index is i - k or older, pop it from the front because it has slid out. Finally, once i is at least k - 1, record arr[front] as the answer for this window.\n\nTrace [1, 3, -1, -3, 5, 3, 6, 7] with k = 3. The deque fronts produce 3, 3, 5, 5, 6, 7, which are the maximums of each window. Every index enters and leaves the deque at most once, giving the linear bound.\n\nPitfall: store indices, not values, or you cannot tell when the front has expired. Interview tip: if asked for the minimum instead, keep the deque increasing. The same structure solves shortest subarray with sum at least k over prefix sums with negatives.",
      problems: [
        {
          title: "Deque Window Trace",
          prompt:
            "For nums = [4, 2, 12, 3, 8] and k = 2, what is the output of sliding window maximum?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "[4, 12, 12, 8]",
            "[4, 12, 3, 8]",
            "[2, 2, 3, 3]",
            "[4, 12, 12, 3]",
          ],
          answer: "[4, 12, 12, 8]",
          explanation:
            "The windows are [4,2], [2,12], [12,3], [3,8] with maximums 4, 12, 12, 8.",
        },
        {
          title: "Deque Order",
          prompt:
            "In the O(n) sliding window maximum, in what order are the values referenced by the deque kept from front to back?",
          type: "mcq",
          difficulty: "medium",
          options: ["Increasing", "Decreasing", "Insertion order", "Random"],
          answer: "Decreasing",
          explanation:
            "Keeping values decreasing guarantees the front is the maximum and smaller trailing values are popped when a larger one arrives.",
        },
        {
          title: "Why Indices",
          prompt:
            "Why must the deque store indices rather than values?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "To detect when the front element has slid out of the window",
            "Because values may be negative",
            "Because indices are smaller in memory",
            "To allow binary search in the deque",
          ],
          answer: "To detect when the front element has slid out of the window",
          explanation:
            "Only the index tells you whether the maximum candidate is still within the last k positions.",
        },
        {
          title: "Heap Alternative",
          prompt:
            "Using a max-heap with lazy deletion for sliding window maximum gives which time complexity?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n log k)", "O(n)", "O(n * k)", "O(k log n)"],
          answer: "O(n log k)",
          explanation:
            "Each element is pushed once and popped at most once from a heap bounded by roughly k live entries.",
        },
        {
          title: "Classic Trace",
          prompt:
            "For [1, 3, -1, -3, 5, 3, 6, 7] and k = 3, what is the third window maximum?",
          type: "mcq",
          difficulty: "easy",
          options: ["3", "5", "-1", "6"],
          answer: "5",
          explanation:
            "The third window is [-1, -3, 5] and its maximum is 5.",
        },
        {
          title: "Minimum Variant",
          prompt:
            "To compute the sliding window minimum instead, how should the deque be maintained?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Keep referenced values increasing from front to back",
            "Keep referenced values decreasing from front to back",
            "Reverse the array first",
            "Use a stack instead",
          ],
          answer: "Keep referenced values increasing from front to back",
          explanation:
            "Mirroring the comparison makes the front the smallest element in the window.",
        },
      ],
    },
  ],
};
