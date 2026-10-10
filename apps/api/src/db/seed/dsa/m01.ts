import type { SeedModule } from "../types.ts";

export const m01: SeedModule = {
  title: "Complexity & Arrays",
  description:
    "Learn to reason about running time and memory, then apply that lens to the most common array techniques.",
  lessons: [
    {
      title: "Big-O Notation Fundamentals",
      durationMin: 8,
      content:
        "Big-O notation describes how the running time or memory of an algorithm grows as the input size n grows. It ignores constant factors and lower-order terms, so 3n + 10 is O(n) and n squared plus n is O(n^2). What matters is the dominant term, because for large inputs it dwarfs everything else.\n\nThe common classes you must recognize on sight, from fastest to slowest, are O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n^2) quadratic, and O(2^n) exponential. Halving the problem each step gives a log, a single pass gives linear, a sort gives n log n, and nested passes over the same input give quadratic.\n\nInterviewers almost always ask for the time and space complexity of your solution, and they expect you to distinguish auxiliary space from the space taken by the input itself. An in-place reversal uses O(1) extra space even though the array is O(n).\n\nA common pitfall is treating two independent loops as nested. Two sequential loops over n elements are O(n) + O(n) = O(n), not O(n^2). Say the complexity out loud as you code so the interviewer sees your reasoning.",
      problems: [
        {
          title: "Dominant Term",
          prompt:
            "A function runs in exactly 5n^2 + 200n + 3 steps for an input of size n. What is its Big-O time complexity?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n^2)", "O(n log n)", "O(200n)"],
          answer: "O(n^2)",
          explanation:
            "Big-O keeps only the fastest-growing term and drops constants, so 5n^2 dominates and the result is O(n^2).",
        },
        {
          title: "Sequential Loops",
          prompt:
            "A function runs one loop over an array of n elements, finishes it, then runs a second separate loop over the same array. What is the time complexity?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(2n^2)", "O(n^2)", "O(n log n)"],
          answer: "O(n)",
          explanation:
            "Sequential loops add rather than multiply, so O(n) + O(n) simplifies to O(n).",
        },
        {
          title: "Ordering Growth Rates",
          prompt:
            "Which list orders complexity classes from fastest growing to slowest growing?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(2^n), O(n^2), O(n log n), O(n), O(log n), O(1)",
            "O(n^2), O(2^n), O(n), O(n log n), O(1), O(log n)",
            "O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n)",
            "O(n log n), O(n^2), O(2^n), O(n), O(log n), O(1)",
          ],
          answer: "O(2^n), O(n^2), O(n log n), O(n), O(log n), O(1)",
          explanation:
            "Exponential grows fastest, then quadratic, linearithmic, linear, logarithmic, and constant is slowest.",
        },
        {
          title: "Auxiliary Space",
          prompt:
            "An algorithm reverses an array of n integers in place using two index variables and one temporary. What is its auxiliary space complexity?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
          answer: "O(1)",
          explanation:
            "Auxiliary space counts only memory beyond the input, and a fixed number of variables is constant.",
        },
        {
          title: "Nested Loop Cost",
          prompt:
            "A loop runs n times, and inside it another loop runs n times. What is the total time complexity?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(2n)", "O(n^2)", "O(n log n)"],
          answer: "O(n^2)",
          explanation:
            "Nested loops multiply, so n iterations of n inner iterations is n^2 total steps.",
        },
        {
          title: "Constant Factor Trap",
          prompt:
            "Algorithm A takes 1000n steps and algorithm B takes n^2 steps. For which input sizes is A faster?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "For all n",
            "For n greater than 1000",
            "For n less than 1000",
            "Never, because Big-O ignores constants",
          ],
          answer: "For n greater than 1000",
          explanation:
            "1000n is less than n^2 exactly when n exceeds 1000, which illustrates why Big-O describes asymptotic behavior, not small inputs.",
        },
        {
          title: "Log Base",
          prompt:
            "Why does Big-O notation not distinguish between O(log2 n) and O(log10 n)?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Because logarithms of different bases differ by a constant factor",
            "Because both are always less than 10",
            "Because binary computers only use base 2",
            "Because log10 n is actually O(n)",
          ],
          answer: "Because logarithms of different bases differ by a constant factor",
          explanation:
            "The change of base formula shows log2 n = log10 n / log10 2, and constant factors are dropped in Big-O.",
        },
        {
          title: "Two Inputs",
          prompt:
            "A function iterates over an array of size n and inside each iteration scans a separate array of size m. What is the time complexity?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n + m)", "O(n * m)", "O(n^2)", "O(max(n, m))"],
          answer: "O(n * m)",
          explanation:
            "The inner scan of m runs once per outer iteration, giving n times m total work; the two sizes are independent so neither collapses into the other.",
        },
        {
          title: "Best Versus Worst",
          prompt:
            "Linear search returns as soon as it finds the target. Which statement about its complexity is correct?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Best case O(1), worst case O(n)",
            "Best case O(n), worst case O(n^2)",
            "Best case O(log n), worst case O(n)",
            "Best case O(1), worst case O(log n)",
          ],
          answer: "Best case O(1), worst case O(n)",
          explanation:
            "The target may be at index 0 or absent entirely, and interviewers normally care about the worst case unless told otherwise.",
        },
        {
          title: "Space of Recursion",
          prompt:
            "A recursive function that calls itself once on n - 1 with constant work per call uses how much stack space?",
          type: "mcq",
          difficulty: "hard",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "The recursion reaches depth n before unwinding, and every frame stays live until its callee returns.",
        },
      ],
    },
    {
      title: "Analyzing Loops and Recursion",
      durationMin: 9,
      content:
        "To find the complexity of iterative code, count how many times the innermost statement executes. A loop from 0 to n is O(n). A loop whose counter doubles each iteration, such as i = 1, 2, 4, 8 up to n, runs about log2(n) times and is O(log n). A nested pair where the inner loop runs from i to n executes roughly n^2 / 2 times, which is still O(n^2).\n\nFor recursion, write a recurrence. Binary search makes one recursive call on half the input plus constant work, T(n) = T(n/2) + O(1), which solves to O(log n). Merge sort makes two calls on halves plus linear merging, T(n) = 2T(n/2) + O(n), giving O(n log n). Naive Fibonacci makes two calls on nearly the same size, T(n) = T(n-1) + T(n-2), which is exponential, roughly O(2^n).\n\nRecursion also consumes stack space proportional to the maximum depth. A recursive sum over a linked list of n nodes uses O(n) stack even though it looks like it allocates nothing.\n\nPitfall: a loop that calls a helper does not have the complexity of the loop alone. If the helper is O(n) and the loop runs n times, the total is O(n^2). Always account for hidden work such as string concatenation or list slicing inside loops.",
      problems: [
        {
          title: "Doubling Counter",
          prompt:
            "Consider: i = 1; while i < n: i = i * 2. How many iterations does this loop perform as a function of n?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(log n)", "O(sqrt n)", "O(1)"],
          answer: "O(log n)",
          explanation:
            "The counter doubles each step, so it reaches n after about log2(n) iterations.",
        },
        {
          title: "Merge Sort Recurrence",
          prompt:
            "The recurrence T(n) = 2T(n/2) + O(n) describes merge sort. What is its solution?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"],
          answer: "O(n log n)",
          explanation:
            "There are log n levels of recursion and each level does O(n) total merging work, giving O(n log n).",
        },
        {
          title: "Triangular Loop",
          prompt:
            "for i in 0..n: for j in i..n: work(). How many times does work() run, in Big-O?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(n^3)"],
          answer: "O(n^2)",
          explanation:
            "The inner loop runs n, n - 1, n - 2, ... times which sums to about n^2 / 2, and the constant is dropped.",
        },
        {
          title: "Binary Search Recurrence",
          prompt:
            "Which recurrence describes binary search?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "T(n) = T(n/2) + O(1)",
            "T(n) = 2T(n/2) + O(1)",
            "T(n) = T(n - 1) + O(1)",
            "T(n) = 2T(n/2) + O(n)",
          ],
          answer: "T(n) = T(n/2) + O(1)",
          explanation:
            "Binary search makes one call on half the input and does constant work to pick the half, which solves to O(log n).",
        },
        {
          title: "Naive Fibonacci",
          prompt:
            "The naive recursive fib(n) = fib(n - 1) + fib(n - 2) has which time complexity?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n^2)", "O(2^n)", "O(n log n)"],
          answer: "O(2^n)",
          explanation:
            "Each call spawns two more of nearly the same size, so the call tree grows exponentially.",
        },
        {
          title: "Hidden Helper Cost",
          prompt:
            "A loop runs n times and on each iteration calls a helper that scans an array of size n. What is the total complexity?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(2n)"],
          answer: "O(n^2)",
          explanation:
            "The O(n) helper is invoked n times, and the costs multiply.",
        },
        {
          title: "String Building",
          prompt:
            "In a language with immutable strings, concatenating one character onto a result string inside a loop of n iterations costs how much overall?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
          answer: "O(n^2)",
          explanation:
            "Each concatenation copies the growing string, so the i-th step costs O(i) and the sum is quadratic; use a builder or list join instead.",
        },
        {
          title: "Halving Both Ways",
          prompt:
            "The recurrence T(n) = 2T(n/2) + O(1) solves to which complexity?",
          type: "mcq",
          difficulty: "hard",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "There are 2^k calls at depth k and log n levels, so the total number of calls is about 2n, each doing constant work.",
        },
        {
          title: "Stack Depth",
          prompt:
            "Recursive merge sort on n elements has a maximum recursion depth of which order?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: "O(log n)",
          explanation:
            "Each level halves the input, so only about log n frames are live on the stack at once even though total work is n log n.",
        },
        {
          title: "Sqrt Loop",
          prompt:
            "for i in 1..n: if i * i > n: break. What is the complexity of this loop?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(log n)", "O(sqrt n)", "O(n^2)"],
          answer: "O(sqrt n)",
          explanation:
            "The loop stops once i exceeds the square root of n, which is why trial division for primality runs in O(sqrt n).",
        },
      ],
    },
    {
      title: "Array Traversal and In-Place Updates",
      durationMin: 7,
      content:
        "An array stores elements contiguously in memory, which is why indexing by position is O(1): the address is base plus index times element size. Reading, writing, and iterating are cheap, but inserting or deleting in the middle costs O(n) because every element after that position must shift.\n\nMany interview problems ask you to modify an array in place, meaning without allocating a second array of the same size. The standard technique is a write pointer. Keep an index write that marks where the next kept element should go, scan with a read index, and copy arr[read] to arr[write] whenever the element should be kept. Removing all zeros or all duplicates from a sorted array both use this exact shape and run in O(n) time with O(1) extra space.\n\nThe order of operations matters. When elements are shifting left, scanning left to right is safe because you only overwrite positions you have already read. When shifting right, for example inserting spaces, scan from the end to avoid clobbering unread data.\n\nInterview tip: state the loop invariant plainly, such as 'everything before write is the final answer so far.' Off-by-one errors are the most common bug here, so trace a three-element example before declaring victory.",
      problems: [
        {
          title: "Middle Insertion Cost",
          prompt:
            "What is the worst-case time complexity of inserting an element at index 0 of a dynamic array holding n elements?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "All n existing elements must shift one position to the right to make room at the front.",
        },
        {
          title: "Write Pointer Trace",
          prompt:
            "Using the write-pointer technique to remove duplicates from the sorted array [1, 1, 2, 2, 3], what is the value of the write index after processing, which equals the new length?",
          type: "mcq",
          difficulty: "medium",
          options: ["2", "3", "4", "5"],
          answer: "3",
          explanation:
            "The unique elements 1, 2, 3 are written to indices 0, 1, 2, so the write index finishes at 3.",
        },
        {
          title: "Why Indexing Is Fast",
          prompt:
            "Why is accessing arr[i] in an array O(1)?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "The array caches the last accessed element",
            "The address is computed as base plus i times element size",
            "Arrays are stored as balanced trees",
            "The compiler unrolls all loops",
          ],
          answer: "The address is computed as base plus i times element size",
          explanation:
            "Contiguous storage means a single arithmetic step produces the exact memory location.",
        },
        {
          title: "Move Zeroes",
          prompt:
            "Applying the write-pointer method to move all zeros to the end of [0, 1, 0, 3, 12] while keeping the order of non-zeros, what is the result?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "[1, 3, 12, 0, 0]",
            "[0, 0, 1, 3, 12]",
            "[12, 3, 1, 0, 0]",
            "[1, 0, 3, 0, 12]",
          ],
          answer: "[1, 3, 12, 0, 0]",
          explanation:
            "Non-zero elements are written forward in order to indices 0, 1, 2 and the remaining slots are filled with zeros.",
        },
        {
          title: "Shift Direction",
          prompt:
            "You must expand an array in place by inserting an extra element after every existing element, with enough trailing capacity. From which end should you process to avoid overwriting unread data?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "From the start, left to right",
            "From the end, right to left",
            "From the middle outward",
            "Direction does not matter",
          ],
          answer: "From the end, right to left",
          explanation:
            "Elements move rightward, so writing from the back guarantees you never overwrite a position you have not yet read.",
        },
        {
          title: "Append Amortized",
          prompt:
            "A dynamic array doubles its capacity when full. What is the amortized cost of appending one element?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(1)",
          explanation:
            "Occasional O(n) copies happen only every time the size doubles, which averages out to constant per append.",
        },
        {
          title: "Loop Invariant",
          prompt:
            "In the write-pointer removal pattern, which statement is the loop invariant that stays true after each iteration?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "All elements after read have been processed",
            "All elements before write are the kept elements in order",
            "write is always greater than read",
            "The array is sorted",
          ],
          answer: "All elements before write are the kept elements in order",
          explanation:
            "Maintaining that prefix as the final answer so far is what makes the single pass correct.",
        },
        {
          title: "Deletion From End",
          prompt:
            "What is the cost of removing the last element of a dynamic array with n elements?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: "O(1)",
          explanation:
            "No elements need to shift; only the length counter changes.",
        },
        {
          title: "Remove Element Trace",
          prompt:
            "Remove all occurrences of 3 from [3, 2, 2, 3] in place with the write-pointer technique. What is the returned new length?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "3", "4"],
          answer: "2",
          explanation:
            "Only the two 2s are kept, so the write pointer ends at index 2.",
        },
        {
          title: "Space Classification",
          prompt:
            "A solution builds a brand new array of size n to hold its output and uses no other memory. Which description of its space is standard in interviews?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "O(1) auxiliary space because the output does not count",
            "O(n) auxiliary space",
            "O(n^2) auxiliary space",
            "O(log n) auxiliary space",
          ],
          answer: "O(n) auxiliary space",
          explanation:
            "Unless the problem explicitly excludes the output buffer, allocating a second n-sized array is linear extra space and distinguishes it from a true in-place solution.",
        },
      ],
    },
    {
      title: "Rotating and Reversing Arrays",
      durationMin: 8,
      content:
        "Reversing an array in place uses two indices, left = 0 and right = n - 1, that swap and move toward each other until they meet. It runs in O(n) time with O(1) extra space and is the building block for several other tricks.\n\nRotating an array right by k positions can be done naively by moving one element at a time k times, which is O(n * k), or by copying into a new array in O(n) time and O(n) space. The elegant in-place answer is the triple reversal: reverse the whole array, then reverse the first k elements, then reverse the remaining n - k. For [1,2,3,4,5] and k = 2, the full reversal gives [5,4,3,2,1], reversing the first two gives [4,5,3,2,1], and reversing the rest gives [4,5,1,2,3], which is the correct rotation.\n\nAlways reduce k modulo n first. If k equals n or a multiple of n the array is unchanged, and if k is larger than n you would otherwise reverse the wrong segment or index out of bounds.\n\nInterview tip: mention both the O(n) extra-space approach and the O(1) triple-reversal approach. Interviewers often ask for the first, then follow up with 'can you do it without extra memory.'",
      problems: [
        {
          title: "Triple Reversal Result",
          prompt:
            "Rotate [1, 2, 3, 4, 5, 6] to the right by k = 8 using the triple reversal method. What is the resulting array?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "[5, 6, 1, 2, 3, 4]",
            "[3, 4, 5, 6, 1, 2]",
            "[1, 2, 3, 4, 5, 6]",
            "[6, 1, 2, 3, 4, 5]",
          ],
          answer: "[5, 6, 1, 2, 3, 4]",
          explanation:
            "k mod n is 8 mod 6 = 2, and rotating right by 2 moves the last two elements to the front.",
        },
        {
          title: "Reversal Space",
          prompt:
            "How much extra space does the in-place two-index reversal of an array use?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(1)",
          explanation:
            "Only two index variables and a temporary for swapping are needed regardless of n.",
        },
        {
          title: "Swap Count",
          prompt:
            "Reversing an array of 7 elements with the two-pointer method performs how many swaps?",
          type: "mcq",
          difficulty: "easy",
          options: ["3", "4", "6", "7"],
          answer: "3",
          explanation:
            "Pointers meet after floor(7 / 2) = 3 swaps; the middle element stays in place.",
        },
        {
          title: "Intermediate State",
          prompt:
            "Rotating [1, 2, 3, 4, 5] right by 2 with triple reversal, what is the array after the first full reversal and the reversal of the first k elements, but before the final step?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "[4, 5, 3, 2, 1]",
            "[5, 4, 3, 2, 1]",
            "[4, 5, 1, 2, 3]",
            "[2, 1, 5, 4, 3]",
          ],
          answer: "[4, 5, 3, 2, 1]",
          explanation:
            "The full reversal gives [5, 4, 3, 2, 1] and reversing the first two gives [4, 5, 3, 2, 1].",
        },
        {
          title: "Rotation by Length",
          prompt:
            "What is the result of rotating an array of length n to the right by exactly n positions?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "The array is reversed",
            "The array is unchanged",
            "The first element moves to the end",
            "The behavior is undefined",
          ],
          answer: "The array is unchanged",
          explanation:
            "n mod n is 0, so every element ends up where it started.",
        },
        {
          title: "Naive Rotation Cost",
          prompt:
            "Rotating right by k by shifting every element one position k separate times costs how much?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(k)", "O(n * k)", "O(n + k)"],
          answer: "O(n * k)",
          explanation:
            "Each single-step rotation touches all n elements and it is repeated k times.",
        },
        {
          title: "Left Rotation",
          prompt:
            "Rotating an array of length n to the left by k is equivalent to rotating it to the right by which amount?",
          type: "mcq",
          difficulty: "medium",
          options: ["k", "n - k", "n + k", "k - n"],
          answer: "n - k",
          explanation:
            "Shifting left by k and right by n - k both move every element by a total of n positions, which is a full cycle.",
        },
        {
          title: "Reverse Words",
          prompt:
            "To reverse the order of words in 'the sky is blue' in place using only reversals, which sequence works?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Reverse the whole string, then reverse each word",
            "Reverse each word only",
            "Reverse the whole string only",
            "Sort the characters",
          ],
          answer: "Reverse the whole string, then reverse each word",
          explanation:
            "The full reversal puts words in the right order but spelled backward, and reversing each word fixes the spelling.",
        },
        {
          title: "Extra Space Approach",
          prompt:
            "Rotating right by k by copying each element i to position (i + k) mod n in a new array has which time and space?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(n) time, O(n) space",
            "O(n) time, O(1) space",
            "O(n * k) time, O(1) space",
            "O(k) time, O(k) space",
          ],
          answer: "O(n) time, O(n) space",
          explanation:
            "One pass fills the new array but a second array of size n is allocated.",
        },
        {
          title: "Negative k",
          prompt:
            "A rotation function receives k = -1 for an array of length 5 and the language's modulo can return negative values. What is the safe normalization of k before rotating right?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "k = ((k mod n) + n) mod n, giving 4",
            "k = abs(k), giving 1",
            "k = n - k, giving 6",
            "k = k mod n, giving -1",
          ],
          answer: "k = ((k mod n) + n) mod n, giving 4",
          explanation:
            "Adding n and taking the modulo again maps any negative remainder into the range 0 to n - 1, and rotating right by 4 equals rotating left by 1.",
        },
      ],
    },
    {
      title: "Kadane's Maximum Subarray",
      durationMin: 9,
      content:
        "The maximum subarray problem asks for the contiguous slice of an array with the largest sum. Brute force checks all O(n^2) slices. Kadane's algorithm solves it in a single O(n) pass using one key insight: the best subarray ending at index i is either the element itself or the element added to the best subarray ending at i - 1.\n\nMaintain two variables. current is the best sum ending at the current position, and best is the largest current seen so far. For each element x, set current = max(x, current + x) and best = max(best, current). Initialize both to the first element, not to zero, so that an all-negative array returns the largest single element rather than an incorrect zero.\n\nTrace [-2, 1, -3, 4, -1, 2, 1, -5, 4]. current becomes -2, 1, -2, 4, 3, 5, 6, 1, 5 and best climbs to 6, which corresponds to the slice [4, -1, 2, 1].\n\nThe same idea extends to problems like maximum product subarray, where you track both the maximum and minimum product because a negative number can flip them. Interview tip: if asked to return the indices as well, record the start whenever current resets to x and the end whenever best updates.",
      problems: [
        {
          title: "Kadane Trace",
          prompt:
            "Run Kadane's algorithm on [3, -4, 5, -1, 2]. What is the maximum subarray sum?",
          type: "mcq",
          difficulty: "medium",
          options: ["5", "6", "7", "8"],
          answer: "6",
          explanation:
            "The best contiguous slice is [5, -1, 2] with sum 6; starting from 3 would include -4 and lower the total.",
        },
        {
          title: "All Negative Input",
          prompt:
            "Kadane's algorithm initializes current and best to 0 instead of the first element and runs on [-3, -1, -2]. What does it incorrectly return?",
          type: "mcq",
          difficulty: "medium",
          options: ["-1", "-3", "0", "-6"],
          answer: "0",
          explanation:
            "With a zero start, best never updates above 0 because every current is negative, so the correct answer -1 is missed.",
        },
        {
          title: "Core Recurrence",
          prompt:
            "Which update correctly computes current, the best subarray sum ending at the current element x?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "current = max(x, current + x)",
            "current = current + x",
            "current = max(current, x)",
            "current = min(x, current + x)",
          ],
          answer: "current = max(x, current + x)",
          explanation:
            "Either extend the previous best ending here or start fresh at x, whichever is larger.",
        },
        {
          title: "Complexity",
          prompt:
            "What are the time and space complexities of Kadane's algorithm?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(n) time, O(1) space",
            "O(n^2) time, O(1) space",
            "O(n) time, O(n) space",
            "O(n log n) time, O(1) space",
          ],
          answer: "O(n) time, O(1) space",
          explanation:
            "A single pass with two running variables is all that is needed.",
        },
        {
          title: "Classic Example",
          prompt:
            "What is the maximum subarray sum of [-2, 1, -3, 4, -1, 2, 1, -5, 4]?",
          type: "mcq",
          difficulty: "easy",
          options: ["4", "6", "7", "10"],
          answer: "6",
          explanation:
            "The slice [4, -1, 2, 1] sums to 6, and adding -5 and 4 afterward does not improve it.",
        },
        {
          title: "Single Element",
          prompt:
            "What does Kadane's algorithm return for the array [-7]?",
          type: "mcq",
          difficulty: "easy",
          options: ["0", "-7", "7", "Undefined"],
          answer: "-7",
          explanation:
            "A subarray must be non-empty, so the only option is the single element itself.",
        },
        {
          title: "Reset Point",
          prompt:
            "When tracking the start index of the maximum subarray, at which moment should the candidate start be reset to the current index?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "When current + x is less than x",
            "When best is updated",
            "When x is negative",
            "At every iteration",
          ],
          answer: "When current + x is less than x",
          explanation:
            "That is the moment Kadane starts a new subarray at x because carrying the previous sum would only hurt.",
        },
        {
          title: "Brute Force Baseline",
          prompt:
            "Checking every contiguous subarray by iterating over all start and end pairs while maintaining a running sum takes how long?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(n^3)"],
          answer: "O(n^2)",
          explanation:
            "There are about n^2 / 2 start and end pairs and the running sum makes each O(1).",
        },
        {
          title: "Maximum Product Twist",
          prompt:
            "Why does maximum product subarray require tracking both a running maximum and a running minimum?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Because a negative number can turn the smallest product into the largest",
            "Because products overflow more often than sums",
            "Because zeros must be skipped",
            "Because the array may be unsorted",
          ],
          answer: "Because a negative number can turn the smallest product into the largest",
          explanation:
            "Multiplying a very negative running product by a negative element produces a large positive, so the minimum must be carried along.",
        },
        {
          title: "Circular Subarray",
          prompt:
            "For the maximum sum circular subarray problem, the answer is max(normalKadane, totalSum - minSubarraySum) except in which case?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "When all elements are negative, so totalSum - minSubarraySum would be 0 for an empty wrap",
            "When the array has even length",
            "When the array contains zeros",
            "When the maximum subarray is at index 0",
          ],
          answer: "When all elements are negative, so totalSum - minSubarraySum would be 0 for an empty wrap",
          explanation:
            "If every element is negative, the minimum subarray is the whole array and the wrap-around candidate corresponds to an empty subarray, so you must return the normal Kadane result.",
        },
      ],
    },
  ],
};
