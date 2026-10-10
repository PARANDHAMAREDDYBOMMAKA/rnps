import type { SeedModule } from "../types.ts";

export const m02: SeedModule = {
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
            "In [2, 2, 1, 1, 1, 2, 2], which element appears more than n/2 times?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "Both 1 and 2", "None"],
          answer: "2",
          explanation:
            "The value 2 appears four times out of seven, which exceeds half the array.",
        },
        {
          title: "Average Lookup",
          prompt:
            "What is the average-case time complexity of a lookup in a well-implemented hash map?",
          type: "mcq",
          difficulty: "easy",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: "O(1)",
          explanation:
            "Hashing the key gives the bucket directly, and a good hash function keeps buckets short.",
        },
        {
          title: "Worst Case Lookup",
          prompt:
            "If every key hashes to the same bucket in a chained hash map with n entries, what is the lookup cost?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(n)",
          explanation:
            "All entries sit in one chain, so a lookup degenerates into a linear scan of that chain.",
        },
        {
          title: "Fixed Alphabet",
          prompt:
            "When counting lowercase English letters, which structure is the simplest and fastest replacement for a hash map?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "An array of 26 integers",
            "A balanced BST",
            "A linked list of pairs",
            "A sorted array of characters",
          ],
          answer: "An array of 26 integers",
          explanation:
            "Index by character code minus the code of 'a' for constant-time counting with no hashing overhead.",
        },
        {
          title: "First Unique Character",
          prompt:
            "After building a frequency map for the string 'leetcode', how do you find the index of the first character that appears exactly once?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Iterate the map and return the first key with count 1",
            "Iterate the original string in order and return the first index whose count is 1",
            "Sort the map by count and take the smallest",
            "Return the key with the smallest hash",
          ],
          answer: "Iterate the original string in order and return the first index whose count is 1",
          explanation:
            "Map iteration order is not guaranteed to match the string order, so you must scan the string itself; the answer for 'leetcode' is index 0.",
        },
        {
          title: "Anagram Trace",
          prompt:
            "Are 'listen' and 'silent' anagrams, and what is the state of the count array after processing both with increment then decrement?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Yes, every count is zero",
            "No, the count for 'l' is 1",
            "Yes, every count is one",
            "No, the strings have different lengths",
          ],
          answer: "Yes, every count is zero",
          explanation:
            "Both contain exactly the same letters with the same multiplicity, so each increment is cancelled by a decrement.",
        },
        {
          title: "Group Anagrams Key",
          prompt:
            "To group anagrams together in a hash map, which key works for each word?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The word's sorted characters",
            "The word's length",
            "The word's first character",
            "The word's hash code",
          ],
          answer: "The word's sorted characters",
          explanation:
            "All anagrams produce the same sorted string, while length or first character would group unrelated words together.",
        },
        {
          title: "Load Factor",
          prompt:
            "Why does a hash map resize and rehash when its load factor exceeds a threshold?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "To keep average chain length constant and lookups O(1)",
            "To sort the keys",
            "To free memory",
            "To prevent integer overflow of the hash",
          ],
          answer: "To keep average chain length constant and lookups O(1)",
          explanation:
            "As entries per bucket grow, lookups slow down, so doubling the bucket count keeps the expected chain length bounded.",
        },
        {
          title: "Boyer-Moore Alternative",
          prompt:
            "The majority element problem can be solved without a hash map in O(1) space by which technique?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Boyer-Moore voting with a candidate and a counter",
            "Binary search on the sorted array",
            "Kadane's algorithm",
            "Two pointers from both ends",
          ],
          answer: "Boyer-Moore voting with a candidate and a counter",
          explanation:
            "Pairing off differing elements cancels them, and a true majority survives as the final candidate.",
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
        {
          title: "Map Contents",
          prompt:
            "In the hash map Two Sum, what is stored as the key and the value?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Key is the number, value is its index",
            "Key is the index, value is the number",
            "Key is the complement, value is the target",
            "Key is the number, value is its count",
          ],
          answer: "Key is the number, value is its index",
          explanation:
            "Lookups are by value to find the complement, and the stored index is what the answer needs.",
        },
        {
          title: "Complexity Comparison",
          prompt:
            "Which pair of complexities describes the brute force and hash map Two Sum solutions respectively?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "O(n^2) and O(n)",
            "O(n) and O(1)",
            "O(n log n) and O(n)",
            "O(n^2) and O(n log n)",
          ],
          answer: "O(n^2) and O(n)",
          explanation:
            "The nested loop checks every pair while the hash map version does a single pass with O(1) lookups.",
        },
        {
          title: "Complement Formula",
          prompt:
            "For target t and current element x, which value do you look up in the map?",
          type: "mcq",
          difficulty: "easy",
          options: ["t - x", "x - t", "t + x", "t / x"],
          answer: "t - x",
          explanation:
            "The partner y must satisfy x + y = t, so y = t - x.",
        },
        {
          title: "Duplicate Values",
          prompt:
            "nums = [3, 3] with target 6. What does the correct check-then-insert hash map solution return?",
          type: "mcq",
          difficulty: "medium",
          options: ["[0, 1]", "[0, 0]", "[1, 1]", "No answer"],
          answer: "[0, 1]",
          explanation:
            "At index 1 the complement 3 is already stored from index 0, so the two distinct indices are returned.",
        },
        {
          title: "Sorted Input Choice",
          prompt:
            "The input array is already sorted and only the values of the pair are needed. Which approach has the best space complexity?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Two pointers from both ends with O(1) space",
            "Hash map with O(n) space",
            "Brute force with O(n) space",
            "Sorting again then hashing",
          ],
          answer: "Two pointers from both ends with O(1) space",
          explanation:
            "Sortedness lets two converging pointers find the pair in O(n) time without any auxiliary structure.",
        },
        {
          title: "Pairs With Difference",
          prompt:
            "To count pairs (a, b) with a - b = k in an array of distinct integers using one pass, which lookup is made for each element x?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Check whether x - k and x + k are in the set",
            "Check whether x * k is in the set",
            "Check whether k is in the set",
            "Check whether x is already in the set",
          ],
          answer: "Check whether x - k and x + k are in the set",
          explanation:
            "Both partners x - k and x + k would form a pair with difference k, and the set gives O(1) membership.",
        },
        {
          title: "Return Value Ordering",
          prompt:
            "In check-then-insert Two Sum, when a match is found, which index is guaranteed to be smaller?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "The index retrieved from the map",
            "The current index",
            "They are always equal",
            "It is random",
          ],
          answer: "The index retrieved from the map",
          explanation:
            "Only earlier elements have been inserted, so the stored complement always comes from a previous position.",
        },
        {
          title: "Sorted Index Preservation",
          prompt:
            "A problem requires returning original indices, and you want to use the two-pointer method on a sorted copy. What extra work is required?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Sort pairs of (value, originalIndex) so indices travel with the values",
            "Nothing, sorting preserves indices",
            "Run binary search to recover indices afterward",
            "Use a linked list instead of an array",
          ],
          answer: "Sort pairs of (value, originalIndex) so indices travel with the values",
          explanation:
            "Sorting reorders elements, so the original positions must be carried alongside the values, costing O(n log n) overall.",
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
            "For the array [100, 4, 200, 1, 3, 2], what is the length of the longest run of consecutive integers?",
          type: "mcq",
          difficulty: "medium",
          options: ["2", "3", "4", "6"],
          answer: "4",
          explanation:
            "The values 1, 2, 3, 4 form a consecutive sequence of length 4.",
        },
        {
          title: "Set Versus Map",
          prompt:
            "When should you choose a hash set over a hash map?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "When you only need membership, not associated values or counts",
            "When you need to preserve insertion order",
            "When keys are integers",
            "When you need sorted iteration",
          ],
          answer: "When you only need membership, not associated values or counts",
          explanation:
            "A set is a map without values and is the simpler fit for pure presence checks.",
        },
        {
          title: "Duplicate Tradeoff",
          prompt:
            "Compared with sorting then scanning neighbors, the hash set duplicate check trades which resource for which?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Uses O(n) extra space to achieve O(n) time",
            "Uses O(1) extra space to achieve O(n log n) time",
            "Uses O(n) extra space to achieve O(log n) time",
            "Uses O(n^2) time to save space",
          ],
          answer: "Uses O(n) extra space to achieve O(n) time",
          explanation:
            "The set costs linear memory but removes the sorting step.",
        },
        {
          title: "Why Linear",
          prompt:
            "In the longest consecutive sequence algorithm, why is the total time O(n) despite the inner while loop?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Only sequence starts (numbers with no x - 1 present) trigger the inner loop, so each number is counted once",
            "The inner loop runs at most log n times",
            "The array is sorted first",
            "The set has constant size",
          ],
          answer: "Only sequence starts (numbers with no x - 1 present) trigger the inner loop, so each number is counted once",
          explanation:
            "Every element belongs to exactly one run and is walked over exactly once from that run's start.",
        },
        {
          title: "Intersection",
          prompt:
            "Find the intersection of [1, 2, 2, 1] and [2, 2] as a set of unique values using hash sets. What is the result?",
          type: "mcq",
          difficulty: "easy",
          options: ["[2]", "[2, 2]", "[1, 2]", "[]"],
          answer: "[2]",
          explanation:
            "Only 2 appears in both arrays, and sets return each common value once.",
        },
        {
          title: "Sequence Start Test",
          prompt:
            "In longest consecutive sequence, which condition identifies that x is the start of a run?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "x - 1 is not in the set",
            "x + 1 is not in the set",
            "x is the minimum of the array",
            "x is even",
          ],
          answer: "x - 1 is not in the set",
          explanation:
            "If x - 1 existed, x would be in the middle of a run that was already counted from a smaller start.",
        },
        {
          title: "Order Guarantee",
          prompt:
            "You iterate a generic hash set after inserting 5, 1, 3. Which statement is safe to rely on?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "No particular order is guaranteed in general",
            "Elements come out as 5, 1, 3",
            "Elements come out as 1, 3, 5",
            "Elements come out in reverse insertion order",
          ],
          answer: "No particular order is guaranteed in general",
          explanation:
            "Some languages preserve insertion order and others do not, so portable solutions must not depend on it.",
        },
        {
          title: "Contains Nearby Duplicate",
          prompt:
            "To check whether any two equal values are within k indices of each other in one pass, which structure works best?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "A sliding window hash set of the last k elements",
            "A stack of the last k elements",
            "A sorted array",
            "A min-heap of size k",
          ],
          answer: "A sliding window hash set of the last k elements",
          explanation:
            "Remove the element that falls out of the window and check membership of the new one, all in O(1) per step.",
        },
        {
          title: "Missing Number Alternative",
          prompt:
            "Finding the one missing number from 0 to n in an array of n distinct values can be done with a hash set in O(n) space. Which alternative uses O(1) space?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "XOR all indices and values, or subtract the array sum from n(n + 1) / 2",
            "Sort the array in place and binary search",
            "Use a second hash set",
            "Reverse the array",
          ],
          answer: "XOR all indices and values, or subtract the array sum from n(n + 1) / 2",
          explanation:
            "Both arithmetic tricks cancel out every present number and leave the missing one without extra memory.",
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
            "Three sum sorts the array and then, for each fixed element, runs a two-pointer pass over the remainder. What is the overall time complexity?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(n)", "O(n log n)", "O(n^2)", "O(n^3)"],
          answer: "O(n^2)",
          explanation:
            "Sorting costs O(n log n) and the n two-pointer passes each cost O(n), so O(n^2) dominates.",
        },
        {
          title: "Why Discarding Is Safe",
          prompt:
            "When arr[left] + arr[right] is greater than the target in a sorted array, why can right be safely decremented?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "arr[right] paired with any element to the right of left is even larger, so right cannot be in any valid pair",
            "arr[right] is the largest element overall",
            "Because left has already been checked against everything",
            "Because the array has no duplicates",
          ],
          answer: "arr[right] paired with any element to the right of left is even larger, so right cannot be in any valid pair",
          explanation:
            "All remaining candidates for right's partner are at least arr[left], so every pair involving right overshoots.",
        },
        {
          title: "Container With Most Water",
          prompt:
            "In the container with most water problem, which pointer should move after computing the current area?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The pointer at the shorter wall",
            "The pointer at the taller wall",
            "Always the left pointer",
            "Both pointers",
          ],
          answer: "The pointer at the shorter wall",
          explanation:
            "The shorter wall limits the height, so moving the taller one can only shrink the width without ever raising the height.",
        },
        {
          title: "Squares of Sorted Array",
          prompt:
            "Squaring each element of [-4, -1, 0, 3, 10] and producing sorted output in O(n) with two pointers, which value is written first into the output filled from the back?",
          type: "mcq",
          difficulty: "easy",
          options: ["100", "16", "0", "9"],
          answer: "100",
          explanation:
            "The larger absolute value at either end is 10, so 100 goes in the last slot first.",
        },
        {
          title: "Two Sum Sorted Trace",
          prompt:
            "On the sorted array [2, 7, 11, 15] with target 18, which indices does the two-pointer method return?",
          type: "mcq",
          difficulty: "easy",
          options: ["[1, 2]", "[0, 3]", "[0, 2]", "[2, 3]"],
          answer: "[1, 2]",
          explanation:
            "2 + 15 = 17 is too small so left moves; 7 + 15 = 22 is too large so right moves; 7 + 11 = 18 matches.",
        },
        {
          title: "Duplicate Triplets",
          prompt:
            "In three sum on [-1, -1, 0, 1, 1, 2], what step prevents the triplet [-1, 0, 1] from being reported twice?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Skipping a fixed element equal to the previous fixed element, and skipping repeated values after moving left or right",
            "Using a hash set of all triplets",
            "Only considering even indices",
            "Reversing the array first",
          ],
          answer: "Skipping a fixed element equal to the previous fixed element, and skipping repeated values after moving left or right",
          explanation:
            "Skipping duplicates at every pointer level avoids re-generating identical triplets without extra memory.",
        },
        {
          title: "Termination",
          prompt:
            "The two-pointer loop on a sorted array terminates when which condition becomes false?",
          type: "mcq",
          difficulty: "easy",
          options: ["left < right", "left == right", "left > right", "right < n"],
          answer: "left < right",
          explanation:
            "A valid pair needs two distinct indices, so the loop continues only while left is strictly less than right.",
        },
        {
          title: "Unsorted Input",
          prompt:
            "Applying the converging two-pointer Two Sum directly to an unsorted array leads to what?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Incorrect results because the move direction logic relies on ordering",
            "Correct results but slower",
            "Correct results with more memory",
            "An infinite loop",
          ],
          answer: "Incorrect results because the move direction logic relies on ordering",
          explanation:
            "Without sortedness, moving a pointer no longer guarantees the sum changes in the intended direction.",
        },
        {
          title: "Trapping Rain Water",
          prompt:
            "The two-pointer trapping rain water solution moves the side with the smaller current maximum. Why is water at that side determined without knowing the other side's future walls?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Because the other side already has a wall at least as tall, so the smaller maximum is the binding limit",
            "Because the array is sorted",
            "Because water only accumulates on the left",
            "Because both maxima are always equal",
          ],
          answer: "Because the other side already has a wall at least as tall, so the smaller maximum is the binding limit",
          explanation:
            "Water level at a position is min(leftMax, rightMax), and when leftMax is smaller we know rightMax is at least that, so the level is fixed.",
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
            "An array of n + 1 integers in the range 1 to n contains one repeated value. Using the fast and slow pointer cycle method, how much extra space is needed?",
          type: "mcq",
          difficulty: "medium",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          answer: "O(1)",
          explanation:
            "Only two pointer variables are needed, and the input array is never modified or copied.",
        },
        {
          title: "Why a Cycle Exists",
          prompt:
            "Why does treating values as next-indices in an array of n + 1 numbers from 1 to n guarantee a cycle?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "By the pigeonhole principle at least two indices point to the same slot",
            "Because the array is sorted",
            "Because index 0 is never a target",
            "Because the values are all distinct",
          ],
          answer: "By the pigeonhole principle at least two indices point to the same slot",
          explanation:
            "More positions than possible values forces a repeated value, and the repeated value is where two paths converge.",
        },
        {
          title: "Finding the Entry",
          prompt:
            "After fast and slow meet inside the cycle, what step finds the cycle entry (the duplicate value)?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Reset one pointer to the start and move both one step at a time until they meet",
            "Move fast two steps until it hits null",
            "Sort the array",
            "Reverse the direction of slow",
          ],
          answer: "Reset one pointer to the start and move both one step at a time until they meet",
          explanation:
            "The distance from the start to the entry equals the distance from the meeting point to the entry modulo the cycle length.",
        },
        {
          title: "Duplicate Trace",
          prompt:
            "Using the cycle method on nums = [1, 3, 4, 2, 2], what duplicate is found?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "3", "4"],
          answer: "2",
          explanation:
            "Following index to value gives 0 -> 1 -> 3 -> 2 -> 4 -> 2, so the cycle enters at 2, which is the repeated number.",
        },
        {
          title: "Even Length Middle",
          prompt:
            "On a linked list 1 -> 2 -> 3 -> 4 with slow and fast starting at the head and the loop while fast and fast.next exist, where does slow end?",
          type: "mcq",
          difficulty: "easy",
          options: ["1", "2", "3", "4"],
          answer: "3",
          explanation:
            "Fast moves to 3 then cannot move two more, and slow has advanced twice to node 3, the second middle.",
        },
        {
          title: "Null Safety",
          prompt:
            "Which condition must be checked before advancing fast = fast.next.next?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "fast is not null and fast.next is not null",
            "slow is not null",
            "fast.next.next is not null",
            "slow.next is not null",
          ],
          answer: "fast is not null and fast.next is not null",
          explanation:
            "Both the current node and its successor must exist to take two steps safely.",
        },
        {
          title: "Happy Number",
          prompt:
            "The happy number problem repeatedly replaces n with the sum of squares of its digits. Why does fast and slow pointer detection apply?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The sequence of values either reaches 1 or enters a cycle, so cycle detection decides the answer",
            "Because the digits are sorted",
            "Because the sequence is always increasing",
            "Because n is always even",
          ],
          answer: "The sequence of values either reaches 1 or enters a cycle, so cycle detection decides the answer",
          explanation:
            "Values stay bounded, so a non-happy number must repeat, and the pointers detect that without a set.",
        },
        {
          title: "Speed Ratio",
          prompt:
            "If fast moved three steps per iteration instead of two, would cycle detection still work?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Yes, they still meet, but the gap closes by two per step so the meeting point changes",
            "No, they can never meet",
            "Only if the cycle length is even",
            "Only on arrays, not linked lists",
          ],
          answer: "Yes, they still meet, but the gap closes by two per step so the meeting point changes",
          explanation:
            "Any speed difference eventually closes the gap modulo the cycle length, though the standard entry-finding proof assumes a ratio of two.",
        },
        {
          title: "Modifying Input",
          prompt:
            "Besides the cycle method, which O(n) time approach to find the duplicate modifies the array instead of using extra space?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Negate the value at index nums[i] and detect an already negative slot",
            "Sort the array with merge sort",
            "Push each value onto a stack",
            "Compute prefix sums",
          ],
          answer: "Negate the value at index nums[i] and detect an already negative slot",
          explanation:
            "Marking visited indices by sign uses the array itself as a visited set, which is acceptable only when mutation is allowed.",
        },
      ],
    },
  ],
};
