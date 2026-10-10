import type { SeedModule } from "../types.ts";

export const m03: SeedModule = {
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
            "Computing the maximum sum of every window of size k over n elements using the running-sum technique takes how long?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n * k)", "O(n log k)", "O(k)"],
          answer: "O(n)",
          explanation:
            "Each slide adds one element and removes one, so the total work is linear in n regardless of k.",
        },
        {
          title: "Slide Update",
          prompt:
            "When sliding a window of size k one position to the right at index i, which update keeps the running sum correct?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "sum = sum + arr[i] - arr[i - k]",
            "sum = sum + arr[i] - arr[i - 1]",
            "sum = sum + arr[i]",
            "sum = sum - arr[i] + arr[i - k]",
          ],
          answer: "sum = sum + arr[i] - arr[i - k]",
          explanation:
            "The entering element is arr[i] and the leaving element is the one k positions back.",
        },
        {
          title: "Number of Windows",
          prompt:
            "An array of n elements has how many windows of size k, assuming k is at most n?",
          type: "mcq",
          difficulty: "easy",
          options: ["n - k + 1", "n - k", "n / k", "k"],
          answer: "n - k + 1",
          explanation:
            "Windows start at indices 0 through n - k inclusive.",
        },
        {
          title: "Naive Cost",
          prompt:
            "Recomputing each window sum from scratch costs how much in total?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(n)", "O(n * k)", "O(n^2 * k)", "O(k)"],
          answer: "O(n * k)",
          explanation:
            "About n windows each require summing k elements.",
        },
        {
          title: "Average Trace",
          prompt:
            "For [1, 12, -5, -6, 50, 3] and k = 4, what is the maximum average of any window of length 4?",
          type: "mcq",
          difficulty: "medium",
          options: ["12.75", "10.5", "0.5", "16.5"],
          answer: "12.75",
          explanation:
            "The window [12, -5, -6, 50] sums to 51, and 51 / 4 = 12.75, which beats the other two windows.",
        },
        {
          title: "Permutation in String",
          prompt:
            "To check whether any window of s has the same character counts as pattern p, which state is maintained as the window slides?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "A count map for the window plus a tally of how many characters currently match the pattern counts",
            "A sorted copy of the window",
            "A stack of characters",
            "A prefix sum of character codes",
          ],
          answer: "A count map for the window plus a tally of how many characters currently match the pattern counts",
          explanation:
            "Updating only the entering and leaving characters and the match tally keeps each slide O(1).",
        },
        {
          title: "Edge Case",
          prompt:
            "A fixed-window function is called with k greater than n. What should a robust implementation do?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Handle it explicitly by returning early or clamping, because no full window exists",
            "Return the sum of the whole array",
            "Throw an index error",
            "Return 0 silently",
          ],
          answer: "Handle it explicitly by returning early or clamping, because no full window exists",
          explanation:
            "Indexing arr[i - k] would go out of bounds, so the case must be dealt with before the loop.",
        },
        {
          title: "Windows Equal to n",
          prompt:
            "When k equals n, how many times does the slide loop run after the first window is built?",
          type: "mcq",
          difficulty: "easy",
          options: ["0", "1", "n", "n - 1"],
          answer: "0",
          explanation:
            "There is exactly one window, so no sliding occurs.",
        },
        {
          title: "Distinct Count Per Window",
          prompt:
            "Counting the number of distinct elements in every window of size k requires which addition to the running-sum template?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "A frequency map, incrementing the distinct count when a count goes from 0 to 1 and decrementing when it drops to 0",
            "A sorted array rebuilt each slide",
            "A prefix sum of the array",
            "A binary search tree keyed by index",
          ],
          answer: "A frequency map, incrementing the distinct count when a count goes from 0 to 1 and decrementing when it drops to 0",
          explanation:
            "Tracking transitions between zero and non-zero counts keeps the distinct count correct in O(1) per slide.",
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
        {
          title: "Amortized Bound",
          prompt:
            "Why is the variable window algorithm O(n) even though it contains a while loop inside a for loop?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Each index enters the window once and leaves once, so left and right each move at most n times total",
            "The inner loop runs at most log n times",
            "The inner loop runs only when the array is sorted",
            "The outer loop runs only n / 2 times",
          ],
          answer: "Each index enters the window once and leaves once, so left and right each move at most n times total",
          explanation:
            "Total pointer movement is bounded by 2n regardless of how the moves are distributed across iterations.",
        },
        {
          title: "Canonical Trace",
          prompt:
            "For [2, 3, 1, 2, 4, 3] and target 7, what is the minimal subarray length with sum at least 7?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "3", "4"],
          answer: "2",
          explanation:
            "The subarray [4, 3] sums to 7 and is the shortest that reaches the target.",
        },
        {
          title: "Shrink Condition",
          prompt:
            "In minimum size subarray sum, when should the left pointer advance?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "While the window sum is at least the target",
            "While the window sum is less than the target",
            "Once per right step unconditionally",
            "Only when right reaches the end",
          ],
          answer: "While the window sum is at least the target",
          explanation:
            "Once the window is valid, you record its length and try to make it shorter by removing from the left.",
        },
        {
          title: "No Valid Window",
          prompt:
            "For [1, 1, 1] and target 10, what does the minimum size subarray sum algorithm return?",
          type: "mcq",
          difficulty: "easy",
          options: ["0", "3", "1", "10"],
          answer: "0",
          explanation:
            "No window ever reaches the target, so the conventional answer indicating no solution is 0.",
        },
        {
          title: "Longest With At Most K Distinct",
          prompt:
            "Longest substring with at most k distinct characters uses a variable window. When should the window shrink?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "While the number of distinct characters in the window exceeds k",
            "While the window length exceeds k",
            "Whenever a repeated character is seen",
            "Never, the window only grows",
          ],
          answer: "While the number of distinct characters in the window exceeds k",
          explanation:
            "The constraint is on distinct count, so shrink from the left until the window is valid again, then record its length.",
        },
        {
          title: "Fruit Into Baskets",
          prompt:
            "For the array [1, 2, 1, 2, 3] with at most 2 distinct values allowed, what is the longest valid contiguous window?",
          type: "mcq",
          difficulty: "medium",
          options: ["3", "4", "5", "2"],
          answer: "4",
          explanation:
            "The window [1, 2, 1, 2] has two distinct values and length 4; adding 3 would introduce a third.",
        },
        {
          title: "Record Timing",
          prompt:
            "For a 'shortest window satisfying the condition' problem, when should the candidate length be recorded?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Inside the shrink loop, while the window is still valid, before removing the left element",
            "After the shrink loop, when the window is invalid",
            "Only at the end of the array",
            "Before expanding right",
          ],
          answer: "Inside the shrink loop, while the window is still valid, before removing the left element",
          explanation:
            "The shortest valid windows are found as you shrink, so each valid state must be measured before it becomes invalid.",
        },
        {
          title: "Longest Versus Shortest",
          prompt:
            "For a 'longest window satisfying the condition' problem, where is the best length recorded?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "After the shrink loop restores validity, measuring right - left + 1",
            "Inside the shrink loop before each removal",
            "Only when left equals right",
            "Before adding the right element",
          ],
          answer: "After the shrink loop restores validity, measuring right - left + 1",
          explanation:
            "For longest problems you shrink only until valid and then record, which is the mirror image of the shortest-window pattern.",
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
        {
          title: "Classic Example",
          prompt:
            "What is the answer for 'abcabcbb'?",
          type: "mcq",
          difficulty: "easy",
          options: ["2", "3", "4", "8"],
          answer: "3",
          explanation:
            "'abc' is the longest run without a repeat; every longer window contains a duplicate.",
        },
        {
          title: "Repeated Character Only",
          prompt:
            "What is the answer for 'bbbbb'?",
          type: "mcq",
          difficulty: "easy",
          options: ["0", "1", "5", "2"],
          answer: "1",
          explanation:
            "Any window of two or more characters contains a repeat, so the best is a single character.",
        },
        {
          title: "Space Complexity",
          prompt:
            "What is the space complexity of the last-index map approach for a string over an alphabet of size A?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(min(n, A))", "O(n^2)", "O(1) always", "O(n * A)"],
          answer: "O(min(n, A))",
          explanation:
            "The map holds at most one entry per distinct character, bounded by both the string length and the alphabet size.",
        },
        {
          title: "Jump Rule",
          prompt:
            "Character c at index right was last seen at index j. Under what condition does left jump to j + 1?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "When j is greater than or equal to left",
            "Always, regardless of j",
            "When j is less than left",
            "When j equals right - 1",
          ],
          answer: "When j is greater than or equal to left",
          explanation:
            "Only an occurrence inside the current window is a real repeat; earlier occurrences were already excluded.",
        },
        {
          title: "pwwkew",
          prompt:
            "For 'pwwkew', which substring achieves the maximum length without repeats?",
          type: "mcq",
          difficulty: "easy",
          options: ["pwke", "wke", "pww", "kew"],
          answer: "wke",
          explanation:
            "'wke' has length 3 with no repeats; 'pwke' is not a substring because the characters are not contiguous in that order.",
        },
        {
          title: "Set Based Variant",
          prompt:
            "The variant that stores window characters in a set and increments left one step at a time has what time complexity?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(n^2)", "O(n log n)", "O(A)"],
          answer: "O(n)",
          explanation:
            "Even without the jump, left advances at most n times in total, so the work is still linear.",
        },
        {
          title: "Window Update Order",
          prompt:
            "In the last-index approach, what is the correct order of operations when processing index right?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Possibly move left using the stored index, update best, then store right as the new last index",
            "Store right as the last index, then move left, then update best",
            "Update best, then store right, then move left",
            "The order does not matter",
          ],
          answer: "Possibly move left using the stored index, update best, then store right as the new last index",
          explanation:
            "Storing before checking would make the character appear to repeat at its own position.",
        },
        {
          title: "Variation With Two Repeats",
          prompt:
            "Longest substring where each character may appear at most twice requires which change to the invariant?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Maintain counts and shrink from the left while any count exceeds 2",
            "Store the last index only and jump as before",
            "Use a set and reject any repeat",
            "Sort the window",
          ],
          answer: "Maintain counts and shrink from the left while any count exceeds 2",
          explanation:
            "A last-index map cannot express a count limit above one, so a frequency map with a shrink loop is needed.",
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
          title: "Query Cost",
          prompt:
            "With prefix sums precomputed, what is the time complexity of answering a single range sum query?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(r - l)"],
          answer: "O(1)",
          explanation:
            "A query is one subtraction of two precomputed values.",
        },
        {
          title: "Range Formula",
          prompt:
            "Using prefix[i] as the sum of the first i elements, which expression gives the sum of arr[l..r] inclusive?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "prefix[r + 1] - prefix[l]",
            "prefix[r] - prefix[l]",
            "prefix[r] - prefix[l - 1]",
            "prefix[r + 1] - prefix[l + 1]",
          ],
          answer: "prefix[r + 1] - prefix[l]",
          explanation:
            "prefix[r + 1] covers indices 0 to r and subtracting prefix[l] removes indices 0 to l - 1.",
        },
        {
          title: "Build the Array",
          prompt:
            "What is the prefix sum array with a leading zero for arr = [3, 1, 4, 1, 5]?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "[0, 3, 4, 8, 9, 14]",
            "[3, 4, 8, 9, 14]",
            "[0, 3, 1, 4, 1, 5]",
            "[3, 4, 8, 9, 14, 0]",
          ],
          answer: "[0, 3, 4, 8, 9, 14]",
          explanation:
            "Each entry adds the next element to the running total, starting from 0.",
        },
        {
          title: "Many Queries",
          prompt:
            "An array of n elements receives Q range sum queries. What is the total cost with prefix sums?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n + Q)", "O(n * Q)", "O(Q log n)", "O(n^2)"],
          answer: "O(n + Q)",
          explanation:
            "Building the prefix array is O(n) and each query is O(1).",
        },
        {
          title: "Leading Zero Purpose",
          prompt:
            "What is the purpose of starting the prefix array with an extra 0 entry?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "It lets ranges starting at index 0 use the same subtraction formula without a special case",
            "It makes the array sorted",
            "It halves the memory usage",
            "It allows negative indices",
          ],
          answer: "It lets ranges starting at index 0 use the same subtraction formula without a special case",
          explanation:
            "prefix[0] = 0 means subtracting it for l = 0 is a harmless no-op.",
        },
        {
          title: "2D Rectangle",
          prompt:
            "With a 2D prefix table P where P[i][j] is the sum of the rectangle from (0,0) to (i-1,j-1), the sum of the rectangle with top-left (r1,c1) and bottom-right (r2,c2) inclusive is which expression?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]",
            "P[r2][c2] - P[r1][c1]",
            "P[r2+1][c2+1] - P[r1][c1]",
            "P[r2+1][c2+1] + P[r1][c2+1] + P[r2+1][c1] - P[r1][c1]",
          ],
          answer: "P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]",
          explanation:
            "Inclusion-exclusion subtracts the strip above and the strip to the left, then adds back the corner that was subtracted twice.",
        },
        {
          title: "Difference Array",
          prompt:
            "To add 5 to every element in the range [2, 4] in O(1) using a difference array diff, which updates are made?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "diff[2] += 5 and diff[5] -= 5",
            "diff[2] += 5 and diff[4] -= 5",
            "diff[2] += 5 only",
            "diff[0] += 5 and diff[4] -= 5",
          ],
          answer: "diff[2] += 5 and diff[5] -= 5",
          explanation:
            "The prefix sum of diff then yields +5 from index 2 through index 4 and cancels at index 5.",
        },
        {
          title: "Prefix XOR",
          prompt:
            "For XOR range queries, the XOR of arr[l..r] equals which expression with prefix XOR array px where px[0] = 0?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "px[r + 1] XOR px[l]",
            "px[r + 1] - px[l]",
            "px[r] XOR px[l]",
            "px[r + 1] AND px[l]",
          ],
          answer: "px[r + 1] XOR px[l]",
          explanation:
            "XOR is its own inverse, so XORing the prefix up to l cancels those elements out of the prefix up to r.",
        },
        {
          title: "Pivot Index",
          prompt:
            "The pivot index is where the sum of elements to the left equals the sum to the right. For [1, 7, 3, 6, 5, 6], what is the pivot index?",
          type: "mcq",
          difficulty: "medium",
          options: ["2", "3", "4", "No pivot"],
          answer: "3",
          explanation:
            "Left of index 3 the sum is 1 + 7 + 3 = 11 and right of it the sum is 5 + 6 = 11.",
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
        {
          title: "Lookup Key",
          prompt:
            "With running sum s and target k, which key is looked up in the map at each step?",
          type: "mcq",
          difficulty: "easy",
          options: ["s - k", "k - s", "s + k", "k"],
          answer: "s - k",
          explanation:
            "An earlier prefix of s - k means the elements after it sum to exactly k.",
        },
        {
          title: "Negative Numbers",
          prompt:
            "How many subarrays of [1, -1, 0] sum to 0?",
          type: "mcq",
          difficulty: "medium",
          options: ["1", "2", "3", "4"],
          answer: "3",
          explanation:
            "[1, -1], [0], and [1, -1, 0] all sum to zero.",
        },
        {
          title: "Order of Operations",
          prompt:
            "What goes wrong if the map count for the current prefix is incremented before looking up sum - k?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "With k = 0 every position counts an empty subarray, inflating the answer",
            "The answer is always zero",
            "The algorithm becomes O(n^2)",
            "Negative numbers are ignored",
          ],
          answer: "With k = 0 every position counts an empty subarray, inflating the answer",
          explanation:
            "Inserting first lets the current prefix match itself, which corresponds to a zero-length subarray.",
        },
        {
          title: "Complexity",
          prompt:
            "What are the time and space complexities of the prefix sum plus hash map count?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(n) time, O(n) space",
            "O(n^2) time, O(1) space",
            "O(n log n) time, O(n) space",
            "O(n) time, O(1) space",
          ],
          answer: "O(n) time, O(n) space",
          explanation:
            "One pass with O(1) map operations, and the map may hold up to n distinct prefix values.",
        },
        {
          title: "Divisible by K",
          prompt:
            "To count subarrays whose sum is divisible by k, what is stored as the map key?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The running sum modulo k, normalized to be non-negative",
            "The running sum itself",
            "The running sum divided by k",
            "The index",
          ],
          answer: "The running sum modulo k, normalized to be non-negative",
          explanation:
            "Two prefixes with the same remainder differ by a multiple of k, and negative remainders must be shifted into the range 0 to k - 1.",
        },
        {
          title: "Trace With Map",
          prompt:
            "Running the algorithm on [3, 4, 7, 2, -3, 1, 4, 2] with k = 7, how many subarrays sum to 7?",
          type: "mcq",
          difficulty: "hard",
          options: ["2", "3", "4", "5"],
          answer: "4",
          explanation:
            "The qualifying subarrays are [3, 4], [7], [7, 2, -3, 1], and [1, 4, 2].",
        },
        {
          title: "Why Not Sliding Window",
          prompt:
            "Why can the prefix sum map count subarrays with sum k when the array has negatives, where a sliding window cannot?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "It checks all earlier prefixes directly rather than relying on the sum growing monotonically",
            "It sorts the array first",
            "It only considers positive elements",
            "It uses two pointers in both directions",
          ],
          answer: "It checks all earlier prefixes directly rather than relying on the sum growing monotonically",
          explanation:
            "The map stores every prefix value seen, so no monotonicity assumption is needed to find matches.",
        },
        {
          title: "Longest Instead of Count",
          prompt:
            "To find the length of the longest subarray with sum k, what should the map store for each prefix value?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "The first index where that prefix value occurred",
            "The last index where that prefix value occurred",
            "The count of occurrences",
            "The maximum element seen so far",
          ],
          answer: "The first index where that prefix value occurred",
          explanation:
            "The earliest occurrence of prefix sum - k gives the longest span ending at the current index, so only the first index should be kept.",
        },
      ],
    },
  ],
};
