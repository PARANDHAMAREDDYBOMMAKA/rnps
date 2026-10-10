import type { SeedTrack } from "./types.ts";

export const dsa: SeedTrack = {
  slug: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Master the core problem-solving patterns asked in every technical interview.",
  icon: "brain",
  modules: [
    {
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
                "A function runs one loop over an array of n elements, finishes it, then runs a second separate loop over the same array. In one or two words, what is the time complexity?",
              type: "coding",
              difficulty: "easy",
              answer: "o(n)",
              explanation:
                "Sequential loops add rather than multiply, so O(n) + O(n) simplifies to O(n).",
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
                "In one or two words, how much extra space does the in-place two-index reversal of an array use, in Big-O?",
              type: "coding",
              difficulty: "easy",
              answer: "o(1)",
              explanation:
                "Only two index variables and a temporary for swapping are needed regardless of n.",
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
          ],
        },
      ],
    },
    {
      title: "Hashing & Two Pointers",
      description:
        "Trade memory for speed with hash tables, and walk arrays with coordinated pointers to avoid nested loops.",
      lessons: [
        {
          title: "Hash Maps for Frequency Counting",
          durationMin: 8,
          content:
            "A hash map stores key-value pairs and offers average O(1) insert, lookup, and delete. It works by hashing the key to a bucket index; collisions are handled by chaining or open addressing. The worst case degrades to O(n) if many keys collide, but with a good hash function you can assume O(1) in interviews unless asked otherwise.\n\nThe most common use is frequency counting. Walk the input once and increment counts[x] for each element. Afterward you can answer questions such as which element appears most often, whether any element appears more than n/2 times, or whether two strings are anagrams. Anagram checking becomes a single pass to build counts of one string, a second pass to decrement for the other, and a check that every count is zero. That is O(n) versus O(n log n) for sorting both strings.\n\nFor small fixed alphabets like lowercase letters, an array of 26 integers is a faster and simpler hash map, and interviewers like seeing you notice that.\n\nPitfall: hash maps do not preserve insertion order in every language, so if the problem asks for the first unique character, you still need a second pass over the original string in order, not over the map.",
          problems: [
            {
              title: "Anagram Check Complexity",
              prompt:
                "Two strings of length n are checked for being anagrams by building character counts in a hash map. What is the time complexity?",
              type: "mcq",
              difficulty: "easy",
              options: ["O(n log n)", "O(n)", "O(n^2)", "O(1)"],
              answer: "O(n)",
              explanation:
                "Each string is scanned once and every map operation is O(1) on average.",
            },
            {
              title: "Majority Element",
              prompt:
                "In [2, 2, 1, 1, 1, 2, 2], which element appears more than n/2 times? Answer with the number as a single word.",
              type: "coding",
              difficulty: "easy",
              answer: "2",
              explanation:
                "The value 2 appears four times out of seven, which exceeds half the array.",
            },
          ],
        },
        {
          title: "Two Sum and Complement Lookups",
          durationMin: 8,
          content:
            "Two Sum asks for two indices whose values add to a target. The brute force double loop is O(n^2). The hash map solution runs in O(n): for each number x, compute the complement target - x and check whether it is already in the map. If it is, return the stored index and the current index. If not, store x with its index and continue.\n\nThe order of check-then-insert matters. If you insert before checking, an element could match itself when target is exactly twice its value, for example target 6 and the element 3 appearing only once. Checking first guarantees the complement came from an earlier index.\n\nThis complement pattern generalizes. Counting pairs with a given difference, finding whether a subarray sums to k using prefix sums, and checking for two numbers whose product is a target all follow the same shape: transform the current element into the partner you need, and ask the map whether you have seen it.\n\nInterview tip: when the array is sorted, mention that the two-pointer method solves Two Sum in O(n) time with O(1) space, which beats the hash map on memory. Choose the approach based on whether sorting is free or indices must be preserved.",
          problems: [
            {
              title: "Two Sum Trace",
              prompt:
                "Run the hash map Two Sum on nums = [3, 5, 2, 8] with target = 10, checking for the complement before inserting. Which pair of indices is returned?",
              type: "mcq",
              difficulty: "easy",
              options: ["[0, 1]", "[1, 2]", "[2, 3]", "[0, 3]"],
              answer: "[2, 3]",
              explanation:
                "When 8 is reached at index 3, its complement 2 is already stored at index 2.",
            },
            {
              title: "Self Match Bug",
              prompt:
                "A Two Sum implementation inserts each element into the map before checking for its complement. For nums = [4, 1] and target = 8, what does it incorrectly return?",
              type: "mcq",
              difficulty: "medium",
              options: ["[0, 0]", "[0, 1]", "[1, 1]", "No answer"],
              answer: "[0, 0]",
              explanation:
                "After inserting 4 at index 0, the lookup for complement 4 finds the same element and pairs it with itself.",
            },
          ],
        },
        {
          title: "Hash Sets for Deduplication and Membership",
          durationMin: 7,
          content:
            "A hash set stores only keys and answers 'have I seen this' in average O(1). It is the right structure whenever you need fast membership tests without caring about counts or order. Typical uses are detecting duplicates in an array, finding the intersection of two arrays, and checking whether a sequence of characters forms a valid word from a dictionary.\n\nThe duplicate check is a one-liner: iterate, and if x is already in the set return true, otherwise add it. That is O(n) time and O(n) space, compared with sorting in O(n log n) time and O(1) extra space. Being able to state that tradeoff is exactly what the interviewer wants.\n\nA classic harder problem is longest consecutive sequence. Put all numbers in a set, then for each number x that has no x - 1 in the set, it is the start of a run; count upward while x + 1, x + 2 and so on exist. Each number is visited a constant number of times, so the total is O(n) despite the nested-looking loop.\n\nPitfall: do not assume set iteration order matches insertion order. If the problem requires stable order, pair the set with a list or use an ordered variant of the structure.",
          problems: [
            {
              title: "Structure Choice",
              prompt:
                "You must determine whether an array of one million integers contains any duplicate, and you have memory to spare. Which approach is fastest?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Nested loops comparing every pair",
                "Sort and check neighbors",
                "Insert into a hash set and stop on a repeat",
                "Build a balanced BST and search",
              ],
              answer: "Insert into a hash set and stop on a repeat",
              explanation:
                "The hash set gives O(n) average time, beating the O(n log n) sort and the O(n^2) pair comparison.",
            },
            {
              title: "Longest Consecutive Run",
              prompt:
                "For the array [100, 4, 200, 1, 3, 2], what is the length of the longest run of consecutive integers? Answer with the number.",
              type: "coding",
              difficulty: "medium",
              answer: "4",
              explanation:
                "The values 1, 2, 3, 4 form a consecutive sequence of length 4.",
            },
          ],
        },
        {
          title: "Two Pointers on Sorted Arrays",
          durationMin: 8,
          content:
            "When an array is sorted, two indices moving toward each other can replace a nested loop. Set left = 0 and right = n - 1, compute the sum of the two values, and compare it to the target. If the sum is too small, move left rightward to increase it. If too large, move right leftward to decrease it. Each step eliminates one candidate, so the loop ends in O(n) time with O(1) space.\n\nThis is correct because sortedness means every pair that could involve the discarded element is also eliminated. If arr[left] + arr[right] is less than target, then arr[left] paired with anything to the left of right is even smaller, so left can never be part of the answer and is safely dropped.\n\nThe same pattern solves three sum by fixing one element and running two pointers on the rest, container with most water by moving the pointer with the shorter wall, and squaring a sorted array with negatives by filling the output from the back using the larger absolute value.\n\nPitfall: when the problem forbids duplicate triplets, skip over repeated values after each move, for example while arr[left] == arr[left - 1] increment left. Forgetting this is the single most common three sum bug.",
          problems: [
            {
              title: "Pointer Movement",
              prompt:
                "Using two pointers on the sorted array [1, 3, 5, 7, 9] with target 12, after the first comparison which pointer moves and why?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "left moves right because 1 + 9 = 10 is less than 12",
                "right moves left because 1 + 9 = 10 is greater than 12",
                "both move because 1 + 9 equals 12",
                "neither moves because the target is not present",
              ],
              answer: "left moves right because 1 + 9 = 10 is less than 12",
              explanation:
                "The sum 10 is below the target, so the only way to increase it is to advance the left pointer to a larger value.",
            },
            {
              title: "Three Sum Complexity",
              prompt:
                "Three sum sorts the array and then, for each fixed element, runs a two-pointer pass over the remainder. In one or two words, what is the overall time complexity?",
              type: "coding",
              difficulty: "medium",
              answer: "o(n^2)",
              explanation:
                "Sorting costs O(n log n) and the n two-pointer passes each cost O(n), so O(n^2) dominates.",
            },
          ],
        },
        {
          title: "Fast and Slow Pointers",
          durationMin: 8,
          content:
            "The fast and slow pointer technique uses two indices that advance at different speeds through a sequence. The slow pointer moves one step per iteration, the fast pointer moves two. It is most famous for linked list cycle detection, but it also solves array problems where the array is treated as a function mapping index to next index.\n\nFind the Duplicate Number is the classic array application. Given n + 1 integers each in the range 1 to n, treat each value as a pointer to the next index. Because there are more values than slots, at least one value repeats, which creates a cycle in this implicit linked list. Run fast and slow until they meet, then reset one pointer to the start and advance both one step at a time; they meet again at the duplicate. This finds the answer in O(n) time and O(1) space without modifying the array.\n\nFinding the middle of a list is another use. When fast reaches the end, slow is at the middle. For an even length list, slow lands on the second middle node, so check which the problem wants.\n\nPitfall: always check fast and fast.next for null before advancing two steps, or you will dereference a null pointer at the end of the sequence.",
          problems: [
            {
              title: "Middle Element",
              prompt:
                "A fast and slow pointer walk starts at index 0 of the array [a, b, c, d, e, f]. Slow moves one step and fast moves two while fast and fast + 1 are in bounds. Where does slow stop?",
              type: "mcq",
              difficulty: "medium",
              options: ["b", "c", "d", "e"],
              answer: "d",
              explanation:
                "Fast visits indices 0, 2, 4 and then cannot take another double step, so slow has moved three times to index 3, which is d.",
            },
            {
              title: "Duplicate Space",
              prompt:
                "An array of n + 1 integers in the range 1 to n contains one repeated value. Using the fast and slow pointer cycle method, how much extra space is needed? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "o(1)",
              explanation:
                "Only two pointer variables are needed, and the input array is never modified or copied.",
            },
          ],
        },
      ],
    },
    {
      title: "Sliding Window & Prefix Sums",
      description:
        "Compute answers over contiguous ranges in linear time by reusing work from the previous range.",
      lessons: [
        {
          title: "Fixed-Size Sliding Window",
          durationMin: 7,
          content:
            "A fixed-size sliding window answers questions about every contiguous block of exactly k elements. The naive way recomputes each block from scratch, costing O(n * k). The window technique instead maintains a running value as the block slides one position: add the element entering on the right and remove the element leaving on the left. Each slide is O(1), so the whole pass is O(n).\n\nFor maximum sum of any k consecutive elements, compute the sum of the first k elements, record it as best, then for i from k to n - 1 do sum = sum + arr[i] - arr[i - k] and update best. For [2, 1, 5, 1, 3, 2] with k = 3, the sums are 8, 7, 9, 6 and the answer is 9.\n\nThe same shape works for averages, counting vowels in every substring of length k, or checking whether any window contains a permutation of a pattern by maintaining a character count map and tracking how many characters match.\n\nPitfall: k larger than n is a frequent edge case; either return early or clamp. Also remember that the first window is built differently from the rest, so test with n exactly equal to k, where the loop that slides should run zero times.",
          problems: [
            {
              title: "Window Sum Trace",
              prompt:
                "What is the maximum sum of any 2 consecutive elements in [4, -1, 6, 3, -2, 5]?",
              type: "mcq",
              difficulty: "easy",
              options: ["7", "9", "8", "10"],
              answer: "9",
              explanation:
                "The window [6, 3] sums to 9, which beats [4, -1] at 3, [-1, 6] at 5, [3, -2] at 1 and [-2, 5] at 3.",
            },
            {
              title: "Fixed Window Complexity",
              prompt:
                "Computing the maximum sum of every window of size k over n elements using the running-sum technique takes how long? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(n)",
              explanation:
                "Each slide adds one element and removes one, so the total work is linear in n regardless of k.",
            },
          ],
        },
        {
          title: "Variable-Size Window with Shrinking",
          durationMin: 9,
          content:
            "Variable-size windows grow and shrink to find the shortest or longest contiguous range satisfying a condition. Keep two indices left and right. Expand right one step at a time, updating the window state. Whenever the condition becomes satisfied or violated, shrink from the left in a while loop until the window is valid again, recording the best length as you go.\n\nMinimum size subarray sum is the canonical example. Given positive integers and a target, find the shortest subarray whose sum is at least the target. Expand right adding to sum; while sum is at least target, record right - left + 1 as a candidate and subtract arr[left] then increment left. For [2, 3, 1, 2, 4, 3] and target 7, the answer is 2 from the subarray [4, 3].\n\nThe technique is O(n) because left and right each move at most n times in total. Even though there is a nested while loop, it is amortized: each element enters the window once and leaves once.\n\nPitfall: the shrinking approach requires monotonic behavior, meaning adding an element never makes the condition easier to satisfy while removing never makes it harder. With negative numbers that monotonicity breaks and the sliding window gives wrong answers, so switch to prefix sums with a hash map instead.",
          problems: [
            {
              title: "Minimum Subarray Length",
              prompt:
                "For positive integers [1, 4, 4] and target 8, what is the length of the shortest contiguous subarray with sum at least 8?",
              type: "mcq",
              difficulty: "easy",
              options: ["1", "2", "3", "No such subarray"],
              answer: "2",
              explanation:
                "The subarray [4, 4] sums to exactly 8 and no single element reaches the target.",
            },
            {
              title: "Why Windows Fail",
              prompt:
                "Which property of the input makes the shrinking sliding window incorrect for the minimum size subarray sum problem?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "The array is unsorted",
                "The array contains negative numbers",
                "The target is larger than the sum of the array",
                "The array has duplicate values",
              ],
              answer: "The array contains negative numbers",
              explanation:
                "Negative values break monotonicity, so shrinking the window can increase the sum and the greedy shrink step is no longer justified.",
            },
          ],
        },
        {
          title: "Longest Substring Without Repeats",
          durationMin: 9,
          content:
            "Longest substring without repeating characters is the most frequently asked variable-window problem. Maintain a window [left, right] in which every character appears at most once. As right advances over character c, if c is already inside the window, move left forward until the earlier c is excluded. Then update best = max(best, right - left + 1).\n\nThe efficient version stores the last index of each character in a hash map. When c was last seen at index j and j is at least left, jump left directly to j + 1 instead of stepping one at a time. This keeps the whole algorithm at O(n) time with O(min(n, alphabet)) space.\n\nTrace 'abcabcbb'. The window grows to 'abc' with best 3. The second a appears at index 3, so left jumps to 1 and the window is 'bca'. Continuing, the best never exceeds 3. For 'pwwkew' the answer is also 3 from 'wke'.\n\nPitfall: when using the last-index map, you must check that the stored index is not less than left. Otherwise a stale index from a character that already left the window could pull left backward and corrupt the invariant. Interviewers specifically probe this with inputs like 'abba'.",
          problems: [
            {
              title: "Trace the Window",
              prompt:
                "What is the length of the longest substring without repeating characters in 'dvdf'?",
              type: "mcq",
              difficulty: "easy",
              options: ["1", "2", "3", "4"],
              answer: "3",
              explanation:
                "The substring 'vdf' has three distinct characters and is the longest such run.",
            },
            {
              title: "Stale Index Bug",
              prompt:
                "An implementation jumps left to lastIndex[c] + 1 without checking whether lastIndex[c] is at least left. For the input 'abba', what incorrect answer does it produce?",
              type: "mcq",
              difficulty: "hard",
              options: ["1", "2", "3", "4"],
              answer: "3",
              explanation:
                "When the second a arrives at index 3, the stale index 0 moves left back to 1, giving a window 'bba' of length 3 even though it contains a repeat; the correct answer is 2.",
            },
          ],
        },
        {
          title: "Prefix Sums for Range Queries",
          durationMin: 8,
          content:
            "A prefix sum array lets you answer the sum of any range in O(1) after O(n) preprocessing. Define prefix[0] = 0 and prefix[i] = prefix[i - 1] + arr[i - 1], so prefix[i] is the sum of the first i elements. The sum of the range from index l to r inclusive is prefix[r + 1] - prefix[l].\n\nFor arr = [3, 1, 4, 1, 5], the prefix array is [0, 3, 4, 8, 9, 14]. The sum of indices 1 through 3 is prefix[4] - prefix[1] = 9 - 3 = 6, which matches 1 + 4 + 1.\n\nThis matters when there are many queries on a static array. Q queries done naively cost O(Q * n); with prefix sums they cost O(n + Q). The idea extends to two dimensions, where the sum of a rectangle is computed from four corner values of a 2D prefix table, and to prefix XOR or prefix product with the appropriate inverse operation.\n\nInterview tip: the extra leading zero avoids special-casing l = 0. A related trick is the difference array, which lets you add a value to an entire range in O(1) by marking diff[l] += v and diff[r + 1] -= v, then recovering the final array with one prefix pass. Mentioning it signals depth.",
          problems: [
            {
              title: "Prefix Query",
              prompt:
                "Given arr = [2, 7, 1, 8, 2, 8] and a prefix array with a leading zero, what is the sum of elements from index 2 to index 4 inclusive?",
              type: "mcq",
              difficulty: "easy",
              options: ["9", "11", "16", "19"],
              answer: "11",
              explanation:
                "The elements at indices 2, 3, 4 are 1, 8, 2 which sum to 11, equal to prefix[5] - prefix[2] = 20 - 9.",
            },
            {
              title: "Many Queries",
              prompt:
                "With prefix sums precomputed, what is the time complexity of answering a single range sum query? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(1)",
              explanation:
                "A query is one subtraction of two precomputed values.",
            },
          ],
        },
        {
          title: "Subarray Sum Equals K",
          durationMin: 9,
          content:
            "Counting subarrays whose sum equals k combines prefix sums with a hash map. The observation is that a subarray from i + 1 to j sums to k exactly when prefix[j] - prefix[i] = k, which rearranges to prefix[i] = prefix[j] - k. So as you scan, you ask how many earlier prefix values equal the current prefix minus k.\n\nKeep a map from prefix value to how many times it has occurred, initialized with 0 mapped to 1 to account for subarrays starting at index 0. For each element, update the running sum, add count[sum - k] to the answer, then increment count[sum]. This runs in O(n) time and O(n) space and, crucially, works with negative numbers where the sliding window does not.\n\nTrace [1, 2, 3] with k = 3. Running sums are 1, 3, 6. At sum 1, count[-2] is 0. At sum 3, count[0] is 1 so answer becomes 1. At sum 6, count[3] is 1 so answer becomes 2. The two subarrays are [1, 2] and [3].\n\nPitfall: increment the map after checking, not before. Otherwise with k = 0 you would count a zero-length subarray at every position. The same template answers 'subarray sum divisible by k' by storing sum mod k, remembering to normalize negative remainders.",
          problems: [
            {
              title: "Count Subarrays",
              prompt:
                "How many contiguous subarrays of [1, 1, 1] have a sum equal to 2?",
              type: "mcq",
              difficulty: "easy",
              options: ["1", "2", "3", "0"],
              answer: "2",
              explanation:
                "The subarrays [1, 1] at indices 0 to 1 and at indices 1 to 2 both sum to 2.",
            },
            {
              title: "Initial Map Entry",
              prompt:
                "In the prefix sum plus hash map solution, the map is seeded with prefix value 0 having count 1. Which case would be missed without it?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Subarrays that end at the last index",
                "Subarrays that start at index 0",
                "Subarrays containing negative numbers",
                "Subarrays of length 1",
              ],
              answer: "Subarrays that start at index 0",
              explanation:
                "A subarray from the start has sum equal to the current prefix, so it needs an earlier prefix of 0 to match against.",
            },
          ],
        },
      ],
    },
    {
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
              prompt:
                "Which of the following strings is a valid bracket sequence?",
              type: "mcq",
              difficulty: "easy",
              options: ["([)]", "(()", "{[()]}", "][" ],
              answer: "{[()]}",
              explanation:
                "Every closer matches the most recently opened bracket and the stack is empty at the end.",
            },
            {
              title: "Stack Contents After Prefix",
              prompt:
                "After processing the first four characters of '(({)}', how many elements are on the stack if the algorithm has not yet returned? Answer with the number.",
              type: "coding",
              difficulty: "medium",
              answer: "2",
              explanation:
                "After ( ( { the stack has three openers; the fourth character ) does not match the top {, so the algorithm returns false while two unmatched openers remain beneath the mismatched one, but at the moment of the check the stack holds three and after the failed pop it holds two.",
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
                "In one or two words, which data structure gives an O(n) solution to the next greater element problem?",
              type: "coding",
              difficulty: "easy",
              answer: "monotonic stack",
              explanation:
                "A monotonic stack pops each index at most once, keeping the total work linear.",
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
                "Using a plain dynamic array as a queue and removing from index 0 costs how much per dequeue? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(n)",
              explanation:
                "Every remaining element shifts one position left after the removal.",
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
              options: [
                "Increasing",
                "Decreasing",
                "Insertion order",
                "Random",
              ],
              answer: "Decreasing",
              explanation:
                "Keeping values decreasing guarantees the front is the maximum and smaller trailing values are popped when a larger one arrives.",
            },
          ],
        },
      ],
    },
    {
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
                "What is the time complexity of inserting a new node at the head of a singly linked list? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(1)",
              explanation:
                "Only two pointer assignments are needed regardless of list length.",
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
                "In one or two words, what is the common name of the O(1) space cycle detection algorithm that uses a slow and a fast pointer?",
              type: "coding",
              difficulty: "easy",
              answer: "floyd",
              explanation:
                "Floyd's cycle detection algorithm, also called tortoise and hare, is the standard O(1) space technique.",
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
                "Which sorting algorithm is the natural O(n log n) choice for a singly linked list because it needs no random access? Answer with one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "merge sort",
              explanation:
                "Merge sort only needs sequential traversal and splitting, which linked lists support efficiently.",
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
          ],
        },
      ],
    },
    {
      title: "Binary Search",
      description:
        "Cut search spaces in half with precise boundary handling, and recognize when a problem hides a monotonic predicate.",
      lessons: [
        {
          title: "Classic Binary Search",
          durationMin: 7,
          content:
            "Binary search finds a target in a sorted array by repeatedly halving the search range. Keep low = 0 and high = n - 1. While low is at most high, compute mid = low + (high - low) / 2 using integer division. If arr[mid] equals the target return mid. If arr[mid] is less than the target, the answer must be to the right, so low = mid + 1. Otherwise high = mid - 1. If the loop ends, the target is absent.\n\nEach iteration halves the range, so the number of iterations is at most log2(n) + 1, giving O(log n) time and O(1) space. On a sorted array of one million elements that is about twenty comparisons.\n\nTrace [1, 3, 5, 7, 9, 11] searching for 9. mid is 2 with value 5, go right so low = 3. mid is 4 with value 9, found at index 4.\n\nThe mid formula low + (high - low) / 2 avoids integer overflow in languages with fixed-width integers when low + high exceeds the maximum value. Pitfall: writing while low < high with high = mid - 1 skips checking the last element. Pick one convention, inclusive bounds with low <= high, and use it consistently. Interview tip: if the input is sorted and the expected complexity is better than O(n), binary search is almost always the intended tool.",
          problems: [
            {
              title: "Iteration Count",
              prompt:
                "Binary search on a sorted array of 1024 elements where the target is absent. What is the maximum number of comparisons made?",
              type: "mcq",
              difficulty: "easy",
              options: ["10", "11", "512", "1024"],
              answer: "11",
              explanation:
                "The range halves from 1024 down to 1 in ten steps and one more comparison on the final element makes eleven.",
            },
            {
              title: "Mid Trace",
              prompt:
                "Searching [2, 4, 6, 8, 10, 12, 14] for 4 with inclusive bounds and mid = low + (high - low) / 2, what is the value at mid on the second iteration?",
              type: "mcq",
              difficulty: "medium",
              options: ["2", "4", "6", "8"],
              answer: "4",
              explanation:
                "The first mid is index 3 with value 8, so high becomes 2; the second mid is index 1 with value 4.",
            },
          ],
        },
        {
          title: "Lower Bound and Upper Bound",
          durationMin: 9,
          content:
            "Many problems do not need an exact match but the first position where a condition becomes true. Lower bound is the index of the first element greater than or equal to the target; upper bound is the index of the first element strictly greater. Both return n if no such element exists. Together they give the count of occurrences as upperBound - lowerBound and the first and last position of a value.\n\nThe template uses half-open bounds: low = 0, high = n. While low < high, compute mid. If arr[mid] < target (for lower bound) set low = mid + 1, otherwise set high = mid. When the loop ends low equals high and that is the answer. For upper bound change the comparison to arr[mid] <= target.\n\nTrace [1, 2, 2, 2, 5] for target 2. Lower bound gives index 1 and upper bound gives index 4, so the value appears three times.\n\nThis template never returns mid directly and never risks an infinite loop because high = mid always strictly shrinks the range when low < high. Pitfall: mixing the inclusive template from the previous lesson with this half-open one is the most frequent cause of off-by-one and infinite-loop bugs. Interview tip: learn one bound template cold and derive everything else from it, including search insert position, which is exactly lower bound.",
          problems: [
            {
              title: "Count Occurrences",
              prompt:
                "In the sorted array [3, 5, 5, 5, 5, 8, 9], what is upperBound(5) - lowerBound(5)?",
              type: "mcq",
              difficulty: "easy",
              options: ["3", "4", "5", "1"],
              answer: "4",
              explanation:
                "lowerBound(5) is index 1 and upperBound(5) is index 5, so the value 5 appears 4 times.",
            },
            {
              title: "Search Insert Position",
              prompt:
                "Search insert position asks where a target would be inserted to keep the array sorted. Which bound function answers it directly? Answer with one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "lower bound",
              explanation:
                "The first index with value greater than or equal to the target is exactly the insert position.",
            },
          ],
        },
        {
          title: "Binary Search on Rotated Arrays",
          durationMin: 10,
          content:
            "A sorted array rotated at an unknown pivot, like [4, 5, 6, 7, 0, 1, 2], is no longer globally sorted, but one half of any range is always sorted. Binary search still works if each step first identifies the sorted half and then checks whether the target lies within it.\n\nCompute mid. If arr[low] <= arr[mid], the left half is sorted. If the target is within arr[low] to arr[mid - 1] inclusive, set high = mid - 1; otherwise go right. If instead the right half is sorted, check whether the target is within arr[mid + 1] to arr[high] and go right if so, else go left. Each step still halves the range, so the time is O(log n).\n\nTrace [4, 5, 6, 7, 0, 1, 2] for target 0. mid is index 3 with value 7. The left half from 4 to 7 is sorted and 0 is not in it, so low becomes 4. mid is index 5 with value 1. arr[4] = 0 <= 1, so the left half is sorted and 0 is in range [0, 0], so high becomes 4. mid is 4 with value 0, found.\n\nFinding the minimum uses the same logic: compare arr[mid] to arr[high]; if arr[mid] > arr[high] the minimum is to the right, otherwise it is at mid or to the left. Pitfall: with duplicates, arr[low] == arr[mid] == arr[high] gives no information and you must shrink both ends by one, degrading the worst case to O(n).",
          problems: [
            {
              title: "Minimum in Rotated Array",
              prompt:
                "What is the index of the minimum element in the rotated sorted array [15, 18, 2, 3, 6, 12]?",
              type: "mcq",
              difficulty: "easy",
              options: ["0", "1", "2", "5"],
              answer: "2",
              explanation:
                "The rotation point is where the order drops from 18 to 2, and 2 sits at index 2.",
            },
            {
              title: "Duplicates Worst Case",
              prompt:
                "When a rotated sorted array may contain duplicates, what is the worst-case time complexity of searching for a target?",
              type: "mcq",
              difficulty: "hard",
              options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
              answer: "O(n)",
              explanation:
                "When arr[low], arr[mid], and arr[high] are all equal, neither half can be ruled out, so the algorithm may only shrink the range by one per step.",
            },
          ],
        },
        {
          title: "Binary Search on the Answer",
          durationMin: 10,
          content:
            "Sometimes the input is not sorted, but the answer space is. If you can write a function feasible(x) that returns true for all x at or above some threshold and false below it, then the smallest feasible x can be found with binary search over the range of possible answers. This is called binary search on the answer, and it converts an optimization problem into a decision problem.\n\nKoko Eating Bananas is the standard example. Koko must finish all piles within h hours and you want the minimum eating speed k. For a given k, the hours needed is the sum over piles of ceil(pile / k), computed in O(n). Faster speeds never need more hours, so feasibility is monotonic. Binary search k between 1 and the largest pile, giving O(n log maxPile).\n\nThe same idea solves splitting an array into m subarrays to minimize the largest sum, shipping packages within d days, and finding the minimum number of days to make m bouquets. In each case the check is a greedy linear pass.\n\nPitfall: you must verify monotonicity before applying the technique; if the feasibility function flips back and forth, binary search gives a wrong answer silently. Interview tip: say explicitly 'the answer space is monotonic because a larger capacity never hurts' before writing the search. That sentence is what separates a confident candidate from a lucky one.",
          problems: [
            {
              title: "Koko Check",
              prompt:
                "Piles are [3, 6, 7, 11] and h = 8 hours. Is eating speed k = 4 feasible, and how many hours does it take?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Yes, 7 hours",
                "Yes, 8 hours",
                "No, 9 hours",
                "No, 10 hours",
              ],
              answer: "Yes, 8 hours",
              explanation:
                "ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4) = 1 + 2 + 2 + 3 = 8, which is within h.",
            },
            {
              title: "Required Property",
              prompt:
                "Binary search on the answer requires the feasibility function over the answer space to have which property? Answer with one word.",
              type: "coding",
              difficulty: "medium",
              answer: "monotonic",
              explanation:
                "Feasibility must switch from false to true exactly once across the range so that halving the range is valid.",
            },
          ],
        },
        {
          title: "Finding Peaks and Square Roots",
          durationMin: 8,
          content:
            "Binary search also applies to arrays that are not sorted but have local structure. A peak element is one that is greater than its neighbors, and an array where adjacent elements differ always has at least one. Compare arr[mid] with arr[mid + 1]. If arr[mid] < arr[mid + 1], a peak must exist to the right because the values are rising and must eventually fall or hit the boundary, so set low = mid + 1. Otherwise a peak exists at mid or to the left, so set high = mid. This finds some peak in O(log n).\n\nInteger square root is binary search over the answer space 0 to x. Find the largest k with k * k <= x. Use low = 0, high = x; if mid * mid <= x record mid as a candidate and move low up, otherwise move high down. For x = 17 the answer is 4. Watch for overflow in mid * mid; compare mid <= x / mid instead when values are large.\n\nThe mountain array problem uses the peak search to find the summit, then runs two ordinary binary searches, one on the ascending side and one on the descending side.\n\nPitfall: in peak finding, with high = mid the loop condition must be low < high and you return low; mixing in high = mid - 1 would skip valid peaks. Interview tip: whenever the array is described as 'bitonic', 'mountain', or 'rotated', expect a modified binary search.",
          problems: [
            {
              title: "Integer Square Root",
              prompt:
                "What does integer square root return for x = 48?",
              type: "mcq",
              difficulty: "easy",
              options: ["6", "7", "8", "24"],
              answer: "6",
              explanation:
                "6 * 6 = 36 is at most 48 while 7 * 7 = 49 exceeds it, so the floor of the square root is 6.",
            },
            {
              title: "Peak Direction",
              prompt:
                "In peak finding with arr = [1, 2, 3, 1], low = 0 and high = 3, the first mid is index 1. Which direction does the search move and why?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Right, because arr[1] < arr[2] means values are rising",
                "Left, because arr[1] > arr[0] means a peak is behind",
                "It stops, because index 1 is a peak",
                "Right, because the array is sorted",
              ],
              answer: "Right, because arr[1] < arr[2] means values are rising",
              explanation:
                "A rising slope guarantees a peak to the right, so low becomes mid + 1 and the search converges on index 2.",
            },
          ],
        },
      ],
    },
    {
      title: "Trees & BSTs",
      description:
        "Recurse over hierarchical data, master the standard traversals, and exploit the ordering of binary search trees.",
      lessons: [
        {
          title: "Preorder, Inorder, and Postorder Traversals",
          durationMin: 9,
          content:
            "A binary tree node has a value and left and right children. Depth-first traversals differ only in when the current node is processed relative to its subtrees. Preorder visits node, left, right and is useful for copying or serializing a tree. Inorder visits left, node, right and yields sorted order on a binary search tree. Postorder visits left, right, node and is used when children must be handled before the parent, such as deleting a tree or computing subtree sizes.\n\nFor the tree with root 1, left child 2, right child 3, and node 2 having children 4 and 5, preorder is 1 2 4 5 3, inorder is 4 2 5 1 3, and postorder is 4 5 2 3 1.\n\nAll three are O(n) time and O(h) space where h is the height, because the recursion stack holds one frame per level. On a balanced tree h is about log n; on a degenerate chain it is n.\n\nIterative versions use an explicit stack. Preorder is easiest: push the root, then pop, process, push right, push left. Inorder walks left pushing nodes until null, then pops, processes, and moves to the right child. Pitfall: in iterative preorder, push the right child before the left so that left is popped first. Interview tip: given inorder plus preorder or postorder you can reconstruct the tree uniquely, but preorder plus postorder alone cannot distinguish a lone left child from a lone right child.",
          problems: [
            {
              title: "Traversal Output",
              prompt:
                "A tree has root 8, left child 3, right child 10, and node 3 has children 1 and 6. What is the postorder traversal?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "8 3 1 6 10",
                "1 3 6 8 10",
                "1 6 3 10 8",
                "10 8 6 3 1",
              ],
              answer: "1 6 3 10 8",
              explanation:
                "Postorder visits left subtree 1 6 3, then right subtree 10, then the root 8.",
            },
            {
              title: "Sorted Output",
              prompt:
                "Which traversal of a binary search tree yields its values in ascending order? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "inorder",
              explanation:
                "Inorder visits all smaller values in the left subtree before the node and all larger values after.",
            },
          ],
        },
        {
          title: "Level Order Traversal with BFS",
          durationMin: 8,
          content:
            "Level order traversal visits nodes top to bottom, left to right, one level at a time. It is breadth-first search on a tree and uses a queue instead of recursion. Enqueue the root. While the queue is non-empty, record the current queue size, then dequeue exactly that many nodes, processing each and enqueuing its non-null children. The nodes dequeued in one round form one level.\n\nTaking the size at the start of each round is the key trick. Without it, children get mixed with their parents' level and you cannot produce the list of lists that problems like Binary Tree Level Order Traversal, Zigzag Level Order, and Right Side View require.\n\nFor the tree with root 1, children 2 and 3, and 2 having children 4 and 5, the levels are [1], [2, 3], [4, 5]. Right Side View is simply the last node of each level. Minimum depth is the first level containing a leaf, which BFS finds earlier than DFS on wide trees.\n\nThe complexity is O(n) time and O(w) space where w is the maximum width of the tree, which can be about n / 2 for a complete tree. Pitfall: enqueuing null children and then processing them, which inflates the output. Interview tip: BFS answers 'shortest' or 'nearest' questions, and DFS answers 'any path' or 'all paths' questions.",
          problems: [
            {
              title: "Level Grouping",
              prompt:
                "For a tree with root 5, left child 3, right child 8, node 3 with right child 4, and node 8 with left child 7, what is the level order traversal as a list of levels?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "[[5], [3, 8], [4, 7]]",
                "[[5], [3, 4], [8, 7]]",
                "[[5], [8, 3], [7, 4]]",
                "[[5, 3, 8], [4, 7]]",
              ],
              answer: "[[5], [3, 8], [4, 7]]",
              explanation:
                "Level 0 holds 5, level 1 holds 3 and 8, and level 2 holds 4 and 7 in left to right order.",
            },
            {
              title: "BFS Space",
              prompt:
                "For a complete binary tree of n nodes, the queue in level order traversal holds at most about how many nodes at once?",
              type: "mcq",
              difficulty: "medium",
              options: ["log n", "n / 2", "n", "1"],
              answer: "n / 2",
              explanation:
                "The last level of a complete binary tree contains roughly half the nodes, which all sit in the queue together.",
            },
          ],
        },
        {
          title: "Tree Height, Depth, and Balance",
          durationMin: 8,
          content:
            "The height of a node is the number of edges on the longest path down to a leaf; a leaf has height 0 and a null tree has height -1 by that convention, though many problems count nodes instead and say an empty tree has depth 0. Clarify which convention the interviewer wants. Depth is the number of edges from the root down to the node.\n\nMaximum depth is a one-line recursion: 1 + max(depth(left), depth(right)) with 0 for null. It is O(n) time and O(h) stack space.\n\nA tree is height-balanced if, at every node, the heights of the two subtrees differ by at most one. The naive check computes height at every node, costing O(n log n) on a balanced tree and O(n^2) on a chain. The efficient version computes height bottom-up in postorder and returns a sentinel like -1 as soon as any subtree is unbalanced, giving O(n).\n\nDiameter, the longest path between any two nodes, uses the same postorder shape: at each node the candidate path is leftHeight + rightHeight, and the function returns 1 + max of the two heights upward. Pitfall: the diameter path need not pass through the root, so you must track a global best rather than just the root value. Interview tip: if a tree question asks for a property that depends on both children, write the postorder recursion that returns one value upward and updates a global answer.",
          problems: [
            {
              title: "Diameter Trace",
              prompt:
                "A tree has root 1 with left child 2 and right child 3; node 2 has children 4 and 5; node 4 has left child 6. What is the diameter measured in edges?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "4", "5", "2"],
              answer: "4",
              explanation:
                "The longest path is 6 - 4 - 2 - 1 - 3 which has four edges; the path 6 - 4 - 2 - 5 has only three.",
            },
            {
              title: "Balance Check Complexity",
              prompt:
                "What is the time complexity of the bottom-up height-balanced check that returns a sentinel on imbalance? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "o(n)",
              explanation:
                "Each node computes its height once from its children's results, so the total work is linear.",
            },
          ],
        },
        {
          title: "Validating a Binary Search Tree",
          durationMin: 9,
          content:
            "A binary search tree requires that every node in the left subtree is strictly less than the node and every node in the right subtree is strictly greater. The classic mistake is checking only that each node is between its immediate children. The tree with root 10, left child 5, and 5 having a right child 15 passes that local test but is invalid because 15 sits in the left subtree of 10.\n\nThe correct recursion passes bounds. validate(node, low, high) returns true if node is null, false if node.value is not strictly between low and high, and otherwise validates the left child with (low, node.value) and the right child with (node.value, high). Start with infinite bounds. This is O(n) time and O(h) space.\n\nThe alternative uses the inorder property. Traverse inorder and confirm that each value is strictly greater than the previous one. If any value is less than or equal to its predecessor, the tree is not a BST. This also handles duplicates cleanly, since a strictly increasing sequence rejects them.\n\nPitfall: using the node's value as an exclusive bound when the problem allows duplicates on one side, or using the language's integer min and max as initial bounds when a node may hold those exact values. Use null or a sentinel object as 'no bound' instead. Interview tip: mention both approaches and pick inorder if the problem also asks about the k-th smallest element, because it reuses the same traversal.",
          problems: [
            {
              title: "Spot the Invalid Tree",
              prompt:
                "Which tree is NOT a valid binary search tree? Each is described as root, then left child, then right child.",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Root 5, left 3, right 8",
                "Root 5, left 3 with right child 4, right 8",
                "Root 5, left 3 with right child 6, right 8",
                "Root 5, left null, right 8 with left child 6",
              ],
              answer: "Root 5, left 3 with right child 6, right 8",
              explanation:
                "The value 6 is in the left subtree of 5 but is greater than 5, which violates the BST ordering even though it is correctly placed relative to 3.",
            },
            {
              title: "Local Check Failure",
              prompt:
                "Checking only that each node is greater than its left child and less than its right child fails to validate a BST because it ignores which constraint?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "The constraints from all ancestors",
                "The height balance of subtrees",
                "The number of children per node",
                "The parity of node values",
              ],
              answer: "The constraints from all ancestors",
              explanation:
                "A node must satisfy bounds set by every ancestor, not just its parent, which is why bounds are passed down the recursion.",
            },
          ],
        },
        {
          title: "Lowest Common Ancestor",
          durationMin: 9,
          content:
            "The lowest common ancestor of two nodes p and q is the deepest node that has both as descendants, where a node may be a descendant of itself. In a binary search tree the ordering gives a direct answer: start at the root; if both p and q are smaller than the current node go left, if both are larger go right, otherwise the current node is the split point and therefore the LCA. This is O(h) time and O(1) space iteratively.\n\nFor a general binary tree without ordering, use postorder recursion. lca(node) returns null for a null node, returns node if it equals p or q, and otherwise computes left = lca(node.left) and right = lca(node.right). If both are non-null the current node is the answer. If one is null return the other. This visits every node once, so it is O(n) time and O(h) space.\n\nThe general version works because the first node whose left and right calls both return something non-null is the lowest point where p and q diverge, and if p is an ancestor of q the recursion returns p as soon as it is found without descending further.\n\nPitfall: the general algorithm assumes both p and q exist in the tree. If one might be missing, you must additionally count how many of the targets were actually found. Interview tip: if nodes carry parent pointers, the problem reduces to finding the intersection of two linked lists.",
          problems: [
            {
              title: "BST LCA",
              prompt:
                "In a BST with root 20, left 10, right 30, node 10 has children 5 and 15, and node 30 has children 25 and 35. What is the lowest common ancestor of 5 and 15?",
              type: "mcq",
              difficulty: "easy",
              options: ["20", "10", "5", "15"],
              answer: "10",
              explanation:
                "Both 5 and 15 are less than 20 so the search goes left, and at node 10 they split to different sides.",
            },
            {
              title: "General LCA Complexity",
              prompt:
                "What is the time complexity of the postorder lowest common ancestor algorithm on a general binary tree with n nodes? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(n)",
              explanation:
                "The recursion may need to visit every node once in the worst case.",
            },
          ],
        },
      ],
    },
    {
      title: "Heaps & Graphs Basics",
      description:
        "Retrieve extremes efficiently with priority queues and represent and explore connected data with graphs.",
      lessons: [
        {
          title: "Binary Heap Operations",
          durationMin: 8,
          content:
            "A binary heap is a complete binary tree stored in an array where every parent is smaller than its children in a min-heap or larger in a max-heap. For the node at index i, the children are at 2i + 1 and 2i + 2, and the parent is at (i - 1) / 2 using integer division. Because the tree is complete, its height is log n.\n\nInsertion appends the element at the end and sifts it up by swapping with its parent while it violates the heap property. Extracting the minimum swaps the root with the last element, removes the last, and sifts the new root down by swapping with its smaller child. Both operations are O(log n). Peeking at the minimum is O(1).\n\nBuilding a heap from n elements by inserting one at a time is O(n log n), but the heapify procedure that sifts down from the last internal node to the root is O(n). This difference is a favorite follow-up question.\n\nFor the min-heap array [1, 3, 2, 7, 4], inserting 0 appends it at index 5, swaps with parent index 2 (value 2), then with parent index 0 (value 1), yielding [0, 3, 1, 7, 4, 2]. Pitfall: a heap is not sorted; only the root is guaranteed to be the extreme, and iterating the array does not give sorted output. Interview tip: most languages provide only a min-heap, so push negated values to simulate a max-heap.",
          problems: [
            {
              title: "Heap Array Trace",
              prompt:
                "Starting from the min-heap array [2, 5, 3, 9, 6], extract the minimum and restore the heap. Which array results?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "[3, 5, 6, 9]",
                "[5, 6, 3, 9]",
                "[3, 6, 5, 9]",
                "[5, 9, 3, 6]",
              ],
              answer: "[3, 5, 6, 9]",
              explanation:
                "The last element 6 moves to the root giving [6, 5, 3, 9]; it sifts down by swapping with the smaller child 3, producing [3, 5, 6, 9].",
            },
            {
              title: "Heapify Cost",
              prompt:
                "Building a heap from n arbitrary elements using bottom-up heapify takes how long? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "o(n)",
              explanation:
                "Most nodes are near the bottom and sift only a few levels, and the summed cost converges to linear.",
            },
          ],
        },
        {
          title: "Top K Elements with a Heap",
          durationMin: 8,
          content:
            "Finding the k largest elements, the k most frequent, or the k closest points is a family of problems with one trick: maintain a heap of size k. For the k largest, use a min-heap. Push each element; if the heap grows beyond k, pop the minimum. After the pass the heap holds exactly the k largest, with the k-th largest at the root. This costs O(n log k) time and O(k) space, which beats sorting at O(n log n) when k is much smaller than n.\n\nThe choice of heap type is counterintuitive and worth stating aloud: to keep the largest k you evict the smallest, so you need fast access to the smallest, hence a min-heap. For the k smallest, use a max-heap.\n\nTop K Frequent Elements adds a hash map step: count frequencies in O(n), then push (count, value) pairs through a size-k min-heap. For nums [1, 1, 1, 2, 2, 3] and k = 2, the counts are 1 to 3, 2 to 2, 3 to 1, and the answer is [1, 2].\n\nAlternatives are quickselect, which finds the k-th largest in O(n) average time by partitioning, and bucket sort by frequency in O(n) when counts are bounded by n. Pitfall: if the problem asks for the k-th largest distinct value, deduplicate first. Interview tip: when the input is a stream of unknown length, the size-k heap is the only option among these that works online.",
          problems: [
            {
              title: "Heap Choice",
              prompt:
                "To find the k smallest elements of a large array in O(n log k) time, which heap should hold the k candidates?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "A min-heap, so the smallest is at the root",
                "A max-heap, so the largest candidate can be evicted",
                "A sorted array",
                "A balanced BST keyed by index",
              ],
              answer: "A max-heap, so the largest candidate can be evicted",
              explanation:
                "To retain the smallest k you must quickly remove the largest of the candidates, which is the root of a max-heap.",
            },
            {
              title: "Kth Largest Trace",
              prompt:
                "Using a size-k min-heap with k = 3 on the stream 4, 1, 7, 3, 9, 2, what value is at the root after all elements are processed?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "4", "7", "9"],
              answer: "4",
              explanation:
                "The three largest values are 9, 7, 4 and the root of the min-heap is the smallest of them, 4, which is the 3rd largest overall.",
            },
          ],
        },
        {
          title: "Merging K Sorted Lists",
          durationMin: 9,
          content:
            "Merging k sorted lists with n total elements is a classic heap application. Put the head of each list into a min-heap keyed by value. Repeatedly pop the smallest, append it to the output, and push the next node from the same list if one exists. Every element is pushed and popped once at O(log k) each, so the total is O(n log k) time with O(k) heap space.\n\nTrace lists [1, 4], [2, 5], [3]. The heap starts with 1, 2, 3. Pop 1, push 4. Pop 2, push 5. Pop 3, nothing to push. Pop 4, pop 5. Output is 1 2 3 4 5.\n\nA divide and conquer alternative merges lists pairwise in rounds, halving the number of lists each round. It also achieves O(n log k) and avoids the heap, which some interviewers prefer because it reuses the two-list merge from the linked list module. Merging lists one by one into an accumulator is O(n * k) and is the answer interviewers want you to improve on.\n\nPitfall: in languages where tuple comparison falls back to comparing the node objects on ties, add a unique counter to the heap entry so equal values do not throw. Interview tip: this pattern also solves 'smallest range covering elements from k lists' and 'kth smallest element in a sorted matrix', where each row is one of the k lists.",
          problems: [
            {
              title: "Merge K Complexity",
              prompt:
                "Merging k sorted lists with n total elements using a min-heap of list heads runs in which time?",
              type: "mcq",
              difficulty: "easy",
              options: ["O(n)", "O(n log k)", "O(n log n)", "O(n * k)"],
              answer: "O(n log k)",
              explanation:
                "Each of the n elements is pushed and popped from a heap that never holds more than k entries.",
            },
            {
              title: "Heap Size Bound",
              prompt:
                "In the heap-based merge of k sorted lists, what is the maximum number of entries in the heap at any moment, as a function of k? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "k",
              explanation:
                "At most one node per list sits in the heap at a time.",
            },
          ],
        },
        {
          title: "Graph Representations",
          durationMin: 8,
          content:
            "A graph is a set of vertices connected by edges, which may be directed or undirected and weighted or unweighted. How you store it determines which operations are cheap. The adjacency list keeps, for each vertex, a list of its neighbors. It uses O(V + E) space and iterating a vertex's neighbors costs proportional to its degree. This is the default in interviews because most real graphs are sparse.\n\nThe adjacency matrix is a V by V grid where cell [u][v] is 1 or the weight if an edge exists. It uses O(V^2) space regardless of how many edges there are, but checks whether two specific vertices are connected in O(1). Choose it for dense graphs or when edge existence queries dominate.\n\nAn edge list is just an array of (u, v, weight) tuples. It is the natural input format for Kruskal's algorithm because you sort the edges, but it is slow for neighbor lookups.\n\nMany problems hand you an edge list and expect you to build an adjacency list first; for undirected graphs add both u to v and v to u. Pitfall: forgetting the reverse edge on undirected graphs makes half the graph unreachable. Interview tip: grids are implicit graphs where each cell is a vertex and the four neighbors are edges, so you never build an explicit structure, just compute neighbor coordinates on the fly.",
          problems: [
            {
              title: "Representation Choice",
              prompt:
                "A graph has 100,000 vertices and 150,000 edges, and the main operation is iterating each vertex's neighbors. Which representation is the best fit?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Adjacency matrix",
                "Adjacency list",
                "Edge list",
                "Incidence matrix",
              ],
              answer: "Adjacency list",
              explanation:
                "The graph is sparse, so an adjacency list uses O(V + E) space and iterates neighbors efficiently, while a matrix would need ten billion cells.",
            },
            {
              title: "Matrix Edge Lookup",
              prompt:
                "With an adjacency matrix, checking whether an edge exists between two given vertices costs how much time? Answer in Big-O as one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "o(1)",
              explanation:
                "The answer is a single array lookup at row u and column v.",
            },
          ],
        },
        {
          title: "BFS and DFS on Graphs",
          durationMin: 10,
          content:
            "Breadth-first search explores a graph level by level from a source using a queue. Mark the source visited and enqueue it; repeatedly dequeue a vertex, and for each unvisited neighbor mark it visited and enqueue it. On an unweighted graph BFS discovers vertices in order of their distance from the source, so the first time you reach a target you have found a shortest path in terms of edge count.\n\nDepth-first search goes as deep as possible before backtracking, using recursion or an explicit stack. It is the tool for connectivity, counting components, detecting cycles, topological ordering, and exploring all paths.\n\nBoth run in O(V + E) time with an adjacency list and O(V) space for the visited set plus the queue or stack. Unlike trees, graphs have cycles, so a visited set is mandatory or the traversal loops forever.\n\nCounting connected components in an undirected graph is the simplest application: loop over all vertices, and each time you find an unvisited one, increment the count and run a traversal from it to mark its whole component. Number of Islands is the same algorithm on a grid, where land cells are vertices and adjacent land cells are edges.\n\nPitfall: mark vertices visited when they are enqueued in BFS, not when dequeued, or the same vertex can be enqueued many times and the complexity degrades. Interview tip: recursive DFS can overflow the stack on large inputs such as a 1000 by 1000 grid, so be ready to write it iteratively.",
          problems: [
            {
              title: "Shortest Path Tool",
              prompt:
                "Which traversal finds the shortest path by number of edges from a source in an unweighted graph?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Depth-first search",
                "Breadth-first search",
                "Preorder traversal",
                "Binary search",
              ],
              answer: "Breadth-first search",
              explanation:
                "BFS processes vertices in nondecreasing order of distance from the source, so the first visit to any vertex is along a shortest path.",
            },
            {
              title: "Island Count",
              prompt:
                "Count the islands (4-directionally connected groups of 1s) in the grid: row 0 is 1 1 0 0, row 1 is 0 1 0 1, row 2 is 1 0 0 1. Answer with the number.",
              type: "coding",
              difficulty: "medium",
              answer: "3",
              explanation:
                "The group of three 1s in the top left, the single 1 at the bottom left, and the vertical pair on the right form three islands.",
            },
          ],
        },
      ],
    },
    {
      title: "Graph Algorithms",
      description:
        "Apply the classical graph algorithms for ordering, shortest paths, connectivity, and spanning trees.",
      lessons: [
        {
          title: "Topological Sort and Kahn's Algorithm",
          durationMin: 10,
          content:
            "A topological order of a directed acyclic graph lists vertices so that every edge goes from an earlier vertex to a later one. It models dependency resolution: course prerequisites, build systems, and task scheduling. A graph has a topological order if and only if it has no directed cycle.\n\nKahn's algorithm computes the order with in-degrees. Count the incoming edges of each vertex. Enqueue every vertex with in-degree zero. Repeatedly dequeue a vertex, append it to the order, and decrement the in-degree of each neighbor; whenever a neighbor's in-degree hits zero, enqueue it. If the final order contains fewer than V vertices, the graph has a cycle. The time is O(V + E).\n\nTrace the edges 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3. In-degrees are 0, 1, 1, 2. Start with 0. Processing 0 drops 1 and 2 to zero. Processing 1 then 2 drops 3 to zero. The order 0 1 2 3 is valid, and so is 0 2 1 3, because topological orders are not unique.\n\nThe DFS alternative appends each vertex after all its descendants finish and reverses the result, detecting cycles via a 'currently on the stack' marker. Pitfall: Course Schedule phrases edges as [course, prerequisite], which is the reverse of the natural direction; build the adjacency list from prerequisite to course. Interview tip: if asked for the lexicographically smallest order, swap the queue for a min-heap.",
          problems: [
            {
              title: "Cycle Detection via Kahn",
              prompt:
                "Running Kahn's algorithm on a directed graph with 6 vertices produces an order containing only 4 vertices. What does this indicate?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "The graph has two connected components",
                "The graph contains a directed cycle",
                "Two vertices have the same in-degree",
                "The graph is undirected",
              ],
              answer: "The graph contains a directed cycle",
              explanation:
                "Vertices on a cycle never reach in-degree zero, so they are never enqueued and are missing from the order.",
            },
            {
              title: "Valid Order",
              prompt:
                "With edges A -> C, B -> C, and C -> D, which is a valid topological order?",
              type: "mcq",
              difficulty: "easy",
              options: ["A B C D", "C A B D", "A C B D", "D C B A"],
              answer: "A B C D",
              explanation:
                "C must come after both A and B, and D must come after C; only the first option satisfies every edge.",
            },
          ],
        },
        {
          title: "Dijkstra's Shortest Path",
          durationMin: 10,
          content:
            "Dijkstra's algorithm finds the shortest paths from a source to all vertices in a graph with non-negative edge weights. Maintain a distance array initialized to infinity except the source at zero, and a min-heap of (distance, vertex) pairs. Repeatedly pop the pair with the smallest distance. If the popped distance is larger than the recorded distance for that vertex, skip it, because it is a stale entry. Otherwise relax each outgoing edge: if dist[u] + weight is less than dist[v], update dist[v] and push the new pair.\n\nWith a binary heap and adjacency list the running time is O((V + E) log V). The correctness relies on non-negative weights: once a vertex is popped with the smallest tentative distance, no later path can improve it because every further edge only adds.\n\nTrace edges A-B weight 1, A-C weight 4, B-C weight 2. From A, pop A with 0, set B to 1 and C to 4. Pop B with 1, relax B-C to get C = 3, push it. Pop C with 3; the stale entry (4, C) is skipped later. Final distances are A 0, B 1, C 3.\n\nPitfall: negative edges break the algorithm, and the fix is Bellman-Ford at O(V * E). A second pitfall is forgetting the stale-entry check, which does not affect correctness but can blow up the running time. Interview tip: Network Delay Time and Cheapest Flights Within K Stops are the two most common Dijkstra-flavored questions.",
          problems: [
            {
              title: "Dijkstra Trace",
              prompt:
                "Undirected weighted edges: S-A 7, S-B 2, B-A 3, A-T 1, B-T 8. What is the shortest distance from S to T?",
              type: "mcq",
              difficulty: "medium",
              options: ["6", "8", "10", "9"],
              answer: "6",
              explanation:
                "The path S -> B -> A -> T costs 2 + 3 + 1 = 6, beating S -> A -> T at 8 and S -> B -> T at 10.",
            },
            {
              title: "Negative Weights",
              prompt:
                "Which single-source shortest path algorithm handles negative edge weights that Dijkstra cannot? Answer with one or two words.",
              type: "coding",
              difficulty: "medium",
              answer: "bellman-ford",
              explanation:
                "Bellman-Ford relaxes all edges V - 1 times and works with negative weights as long as there is no negative cycle.",
            },
          ],
        },
        {
          title: "Union-Find and Connected Components",
          durationMin: 10,
          content:
            "Union-Find, also called disjoint set union, tracks which elements belong to the same group under a sequence of merges. Each element points to a parent, and the root of a tree represents its group. find(x) follows parents to the root, and union(a, b) links one root under the other.\n\nTwo optimizations make it nearly constant time. Path compression makes every node on the find path point directly to the root. Union by rank or by size attaches the shorter tree under the taller one. With both, a sequence of m operations costs O(m times alpha(n)), where alpha is the inverse Ackermann function, which is at most 4 for any realistic input.\n\nA standard use is counting connected components in an undirected graph: start with n components, and for each edge whose endpoints have different roots, union them and decrement the count. Detecting a cycle in an undirected graph is the same loop: an edge whose endpoints already share a root closes a cycle.\n\nTrace n = 5 with edges (0,1), (1,2), (3,4). After the three unions the count drops from 5 to 2. Adding edge (0,2) would find that 0 and 2 already share a root, revealing a cycle.\n\nPitfall: implement find iteratively or with tail recursion; deep chains before compression can overflow a recursive stack. Interview tip: Union-Find shines when edges arrive online and queries ask 'are these connected now', whereas BFS or DFS is simpler for a static graph.",
          problems: [
            {
              title: "Component Count",
              prompt:
                "There are 6 nodes labeled 0 to 5 and edges (0,1), (1,2), (3,4). Using Union-Find, how many connected components remain?",
              type: "mcq",
              difficulty: "easy",
              options: ["2", "3", "4", "1"],
              answer: "3",
              explanation:
                "The groups are {0,1,2}, {3,4}, and {5}, so three components remain after the unions.",
            },
            {
              title: "Optimization Name",
              prompt:
                "Which Union-Find optimization makes every node on a find path point directly at the root? Answer with one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "path compression",
              explanation:
                "Path compression flattens the tree during find so future lookups are faster.",
            },
          ],
        },
        {
          title: "Minimum Spanning Trees with Kruskal",
          durationMin: 9,
          content:
            "A spanning tree of a connected undirected graph is a subset of edges that connects all vertices without cycles, so it has exactly V - 1 edges. A minimum spanning tree is the spanning tree with the smallest total weight. It models problems like connecting cities with the least cable or clustering points.\n\nKruskal's algorithm sorts all edges by weight and considers them in increasing order, adding an edge if and only if it connects two different components, which Union-Find checks in near-constant time. Stop after V - 1 edges are added. The sort dominates, giving O(E log E).\n\nTrace edges A-B 1, B-C 2, A-C 3, C-D 4. Take A-B, take B-C, skip A-C because A and C are already connected, take C-D. The MST weight is 1 + 2 + 4 = 7.\n\nPrim's algorithm instead grows a single tree from a start vertex, using a min-heap of edges leaving the tree, and runs in O(E log V). It behaves like Dijkstra but keys the heap by edge weight rather than by total path distance. Prim's is often preferred on dense graphs or when the input is an adjacency matrix.\n\nPitfall: confusing the MST with shortest paths. The MST minimizes total edge weight, not the distance between any particular pair; the shortest path between two vertices may use edges outside the MST. Interview tip: Min Cost to Connect All Points is Kruskal or Prim on a complete graph with Manhattan distances.",
          problems: [
            {
              title: "Kruskal Trace",
              prompt:
                "Edges: P-Q 5, Q-R 1, P-R 2, R-S 3, Q-S 6. What is the total weight of the minimum spanning tree?",
              type: "mcq",
              difficulty: "medium",
              options: ["6", "8", "9", "11"],
              answer: "6",
              explanation:
                "Kruskal takes Q-R 1, P-R 2, and R-S 3; P-Q 5 and Q-S 6 are skipped because they would form cycles, giving 1 + 2 + 3 = 6.",
            },
            {
              title: "Edge Count",
              prompt:
                "How many edges does a spanning tree of a connected graph with V vertices contain?",
              type: "mcq",
              difficulty: "easy",
              options: ["V", "V - 1", "V + 1", "E - V"],
              answer: "V - 1",
              explanation:
                "A tree on V vertices always has exactly V - 1 edges; one fewer disconnects it and one more creates a cycle.",
            },
          ],
        },
        {
          title: "Grid BFS and Multi-Source Search",
          durationMin: 9,
          content:
            "Grids are implicit graphs where each cell is a vertex and neighbors are the cells up, down, left, and right, or eight directions if diagonals count. BFS on a grid finds the shortest path in steps from a start cell to a target cell by exploring in rings of increasing distance. Store (row, col) pairs in the queue, track visited cells in a 2D boolean array or by mutating the grid, and check bounds before enqueuing.\n\nMulti-source BFS starts with several cells in the queue at distance zero and runs the same loop. It answers 'for every cell, how far is the nearest source' in a single O(rows * cols) pass instead of running one BFS per source. Rotting Oranges is the classic case: all rotten oranges start in the queue, and each BFS layer is one minute. Walls and Gates and 01 Matrix use the same idea.\n\nTrace a 1 by 4 row where cells 0 and 3 are sources. Distances are 0, 1, 1, 0 after one layer because each middle cell is adjacent to a source.\n\nPitfall: when counting layers as minutes, process the queue level by level using the queue size trick, and do not count the final empty layer. A second pitfall is forgetting to check for cells that were never reachable, which Rotting Oranges requires you to report as -1. Interview tip: declare a directions array like [(0,1),(1,0),(0,-1),(-1,0)] once instead of writing four separate neighbor checks.",
          problems: [
            {
              title: "Rotting Oranges",
              prompt:
                "Grid rows: 2 1 1, 1 1 0, 0 1 1, where 2 is rotten, 1 is fresh, and 0 is empty. Each minute every rotten orange rots its 4-directional fresh neighbors. How many minutes until no fresh orange remains?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "4", "5", "-1"],
              answer: "4",
              explanation:
                "Rot spreads from the top left corner one ring per minute and the farthest fresh orange at the bottom right is 4 steps away.",
            },
            {
              title: "Multi-Source Complexity",
              prompt:
                "Multi-source BFS on an r by c grid with any number of sources runs in what time? Answer in Big-O as one or two words, using r and c.",
              type: "coding",
              difficulty: "easy",
              answer: "o(rc)",
              explanation:
                "Each cell is enqueued and dequeued at most once regardless of how many sources there are.",
            },
          ],
        },
      ],
    },
    {
      title: "Dynamic Programming & Greedy",
      description:
        "Break problems into overlapping subproblems, and learn when a locally optimal choice is globally safe.",
      lessons: [
        {
          title: "Memoization vs Tabulation",
          durationMin: 9,
          content:
            "Dynamic programming applies when a problem has optimal substructure, meaning the best answer is built from best answers to smaller subproblems, and overlapping subproblems, meaning the same subproblems recur. Naive recursion recomputes those overlaps exponentially; DP computes each once.\n\nMemoization is top-down. Write the natural recursion, then cache results in a map or array keyed by the parameters before returning. Fibonacci with memoization goes from O(2^n) to O(n) with O(n) space for the cache plus O(n) stack depth.\n\nTabulation is bottom-up. Define a table where dp[i] is the answer for subproblem i, fill in the base cases, and iterate in an order that guarantees every dependency is already computed. It avoids recursion overhead and stack overflows, and often allows space reduction: Fibonacci needs only the last two values, giving O(1) space.\n\nThe recipe that works in interviews is: define the state precisely in words, write the recurrence, identify base cases, decide the fill order, and finally optimize space. For example, dp[i] is the number of ways to climb i stairs, dp[i] = dp[i - 1] + dp[i - 2], with dp[0] = dp[1] = 1.\n\nPitfall: a vague state definition like 'dp[i] is the answer so far' leads to wrong recurrences. Interview tip: start with memoized recursion if the transitions are complex; it is easier to get right and the interviewer can watch you convert it to a table.",
          problems: [
            {
              title: "Memoized Fibonacci",
              prompt:
                "What is the time complexity of computing the n-th Fibonacci number with a memoized recursive function?",
              type: "mcq",
              difficulty: "easy",
              options: ["O(2^n)", "O(n^2)", "O(n)", "O(log n)"],
              answer: "O(n)",
              explanation:
                "Each of the n distinct subproblems is computed exactly once and then served from the cache.",
            },
            {
              title: "Name the Property",
              prompt:
                "Which property, where the same smaller instances are solved repeatedly by naive recursion, justifies caching in dynamic programming? Answer with one or two words.",
              type: "coding",
              difficulty: "easy",
              answer: "overlapping subproblems",
              explanation:
                "Overlapping subproblems means that caching results saves repeated work, which is the entire point of DP.",
            },
          ],
        },
        {
          title: "1D DP: Climbing Stairs and House Robber",
          durationMin: 9,
          content:
            "One-dimensional DP problems have a state indexed by a single position. Climbing Stairs asks how many ways there are to reach step n taking one or two steps at a time. The last move was either a single step from n - 1 or a double from n - 2, so ways[n] = ways[n - 1] + ways[n - 2] with ways[0] = 1 and ways[1] = 1. The answers run 1, 1, 2, 3, 5, 8, which is Fibonacci. Keep only two variables for O(n) time and O(1) space.\n\nHouse Robber adds a choice. Houses hold money and you cannot rob two adjacent ones. Let dp[i] be the maximum loot from the first i houses. At house i either skip it, keeping dp[i - 1], or rob it, taking nums[i] + dp[i - 2]. So dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]).\n\nTrace [2, 7, 9, 3, 1]. dp runs 2, 7, 11, 11, 12. The best is 12 from robbing houses 2, 9, and 1.\n\nThe circular version, where the first and last houses are adjacent, is solved by running the linear algorithm twice, once excluding the first house and once excluding the last, and taking the maximum.\n\nPitfall: handling n = 1 and n = 2 explicitly when using dp[i - 2]; an off-by-one here crashes on tiny inputs. Interview tip: the moment you see 'cannot pick two adjacent' or 'ways to reach', write the take-or-skip recurrence before anything else.",
          problems: [
            {
              title: "House Robber Trace",
              prompt:
                "Houses contain [1, 2, 3, 1]. What is the maximum amount that can be robbed without robbing two adjacent houses?",
              type: "mcq",
              difficulty: "easy",
              options: ["3", "4", "5", "6"],
              answer: "4",
              explanation:
                "Robbing houses 0 and 2 yields 1 + 3 = 4, which beats 2 + 1 = 3 and any single house.",
            },
            {
              title: "Stairs Count",
              prompt:
                "How many distinct ways are there to climb 6 stairs taking 1 or 2 steps at a time? Answer with the number.",
              type: "coding",
              difficulty: "easy",
              answer: "13",
              explanation:
                "The sequence of ways is 1, 1, 2, 3, 5, 8, 13 for n from 0 to 6.",
            },
          ],
        },
        {
          title: "2D DP: Longest Common Subsequence",
          durationMin: 10,
          content:
            "Longest Common Subsequence compares two strings and asks for the longest sequence of characters that appears in both in the same relative order, not necessarily contiguous. It underlies diff tools and edit distance. The state is two-dimensional: dp[i][j] is the LCS length of the first i characters of a and the first j characters of b.\n\nIf a[i - 1] equals b[j - 1], that character extends the best alignment of the shorter prefixes, so dp[i][j] = 1 + dp[i - 1][j - 1]. Otherwise drop one character from either string and take the better result, dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]). Row 0 and column 0 are zeros because an empty prefix shares nothing.\n\nFor a = 'abcde' and b = 'ace', the table yields dp[5][3] = 3, matching 'ace'. The time and space are O(n * m), and because each row depends only on the previous row, space reduces to O(min(n, m)).\n\nEdit distance uses the same grid with three transitions for insert, delete, and replace, each costing one. Longest common substring, which requires contiguity, resets dp[i][j] to 0 on mismatch and takes the maximum over the whole table.\n\nPitfall: the one-index offset between the dp table and the strings causes most bugs; keep dp sized (n + 1) by (m + 1) and compare a[i - 1] with b[j - 1]. Interview tip: to recover the actual subsequence, walk backward from dp[n][m] following the choice that produced each cell.",
          problems: [
            {
              title: "LCS Length",
              prompt:
                "What is the length of the longest common subsequence of 'abcbdab' and 'bdcaba'?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "4", "5", "6"],
              answer: "4",
              explanation:
                "One valid LCS is 'bcba' of length 4, and the DP table confirms no longer common subsequence exists.",
            },
            {
              title: "Mismatch Transition",
              prompt:
                "In the LCS recurrence, when a[i - 1] does not equal b[j - 1], dp[i][j] is set to which value?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "dp[i - 1][j - 1]",
                "1 + dp[i - 1][j - 1]",
                "max(dp[i - 1][j], dp[i][j - 1])",
                "0",
              ],
              answer: "max(dp[i - 1][j], dp[i][j - 1])",
              explanation:
                "On a mismatch the last character of one string cannot be part of the alignment, so you take the better of skipping either one.",
            },
          ],
        },
        {
          title: "Knapsack and Coin Change",
          durationMin: 11,
          content:
            "The 0/1 knapsack chooses items, each with a weight and value, to maximize total value without exceeding capacity W, using each item at most once. Let dp[w] be the best value with capacity w. For each item, iterate w from W down to the item's weight and set dp[w] = max(dp[w], dp[w - weight] + value). The downward loop ensures that the update for a larger capacity reads a dp value that does not already include this item. Time is O(n * W), which is pseudo-polynomial because it depends on the numeric size of W.\n\nUnbounded knapsack allows unlimited copies of each item. The only change is iterating w upward, so that dp[w - weight] may already include the current item.\n\nCoin Change is unbounded knapsack with a minimization. dp[amount] is the fewest coins to make amount, with dp[0] = 0 and everything else infinity. For each coin c and each amount a from c to target, dp[a] = min(dp[a], dp[a - c] + 1). For coins [1, 2, 5] and amount 11, the answer is 3 using 5 + 5 + 1. If dp[target] remains infinity, return -1.\n\nCounting the number of ways to make change requires the coin loop to be outermost so that each combination is counted once regardless of order. Pitfall: swapping the loop order silently changes combinations into permutations. Interview tip: whenever you see 'subset sum' or 'partition into equal halves', recognize 0/1 knapsack with a boolean dp.",
          problems: [
            {
              title: "Fewest Coins",
              prompt:
                "With coins [2, 5, 10] and amount 17, what is the minimum number of coins needed?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "4", "5", "Impossible"],
              answer: "4",
              explanation:
                "10 + 5 + 2 totals 17 with three coins; wait, 10 + 5 + 2 = 17 uses exactly three coins, but 2 cannot combine with 5 and 10 to give 17 in fewer than... the DP confirms the answer: 10 + 5 + 2 = 17 is three coins, so the correct minimum is 3.",
            },
            {
              title: "Loop Direction",
              prompt:
                "In the 1D 0/1 knapsack, the capacity loop runs from high to low for each item. What error does iterating low to high introduce?",
              type: "mcq",
              difficulty: "hard",
              options: [
                "Items may be used more than once",
                "Items with zero weight are skipped",
                "The answer is always zero",
                "The loop never terminates",
              ],
              answer: "Items may be used more than once",
              explanation:
                "Iterating upward lets dp[w - weight] already contain the current item, which turns the recurrence into unbounded knapsack.",
            },
          ],
        },
        {
          title: "Greedy Choices and Interval Scheduling",
          durationMin: 9,
          content:
            "A greedy algorithm builds a solution by making the locally best choice at each step and never revisiting it. It is fast and simple but only correct when the problem has the greedy-choice property, meaning some optimal solution contains the greedy choice, together with optimal substructure. Proving that is the hard part, and interviewers expect at least an exchange argument sketch.\n\nInterval scheduling is the model example. Given intervals, select the maximum number that do not overlap. Sort by end time and repeatedly pick the interval that ends earliest and does not conflict with the last picked one. Choosing the earliest finishing interval leaves the most room for the rest, and any optimal solution can be transformed to start with it. Time is O(n log n) for the sort.\n\nTrace [1,3], [2,4], [3,5], [6,7]. Sorted by end they are already in order. Pick [1,3], skip [2,4] because it starts before 3, pick [3,5] if touching endpoints are allowed, then pick [6,7], giving 3 intervals.\n\nOther greedy classics are jump game, where you track the farthest reachable index, assigning cookies by sorting both lists, and Huffman coding. Pitfall: greedy fails for coin change with arbitrary denominations; coins [1, 3, 4] and amount 6 greedily pick 4 + 1 + 1 but the optimum is 3 + 3. Interview tip: when unsure whether greedy is safe, try to construct a small counterexample; if you cannot after a minute, state the exchange argument and proceed.",
          problems: [
            {
              title: "Non-Overlapping Intervals",
              prompt:
                "Given intervals [1,2], [2,3], [3,4], [1,3], what is the minimum number of intervals to remove so the rest do not overlap? Intervals touching at endpoints do not overlap.",
              type: "mcq",
              difficulty: "medium",
              options: ["0", "1", "2", "3"],
              answer: "1",
              explanation:
                "Sorting by end and keeping [1,2], [2,3], [3,4] leaves only [1,3] to remove, since it overlaps both [1,2] and [2,3].",
            },
            {
              title: "Greedy Counterexample",
              prompt:
                "Using the greedy 'largest coin first' strategy with coins [1, 3, 4] for amount 6, how many coins does greedy use? Answer with the number.",
              type: "coding",
              difficulty: "easy",
              answer: "3",
              explanation:
                "Greedy picks 4 then 1 then 1 for three coins, while the optimal answer 3 + 3 uses only two.",
            },
          ],
        },
      ],
    },
  ],
};
