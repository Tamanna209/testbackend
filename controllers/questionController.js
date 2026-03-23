// backend/controllers/questionController.js
import AptitudeQuestion from "../models/aptitudeQuestions.model.js";

const addQuestion = async (req, res) => {
  try {
    const { title, description, testCases, tags, difficulty } = req.body;
    await AptitudeQuestion.create({ title, description, testCases, tags, difficulty });
    res.json({ message: "Question added" });
  } catch (err) {
    res.status(500).json({ message: "Add question error", error: err.message });
  }
};

const getQuestions = async (req, res) => {
  const questions = await AptitudeQuestion.find();
  res.json(questions);
};

const seedQuestions = async (req, res) => {
  await AptitudeQuestion.deleteMany({});

  const problems = [
    {
      title: "Reverse a String",
      description: `Write a function reverseString(str) that takes a string and returns it reversed.

Example:
  Input:  "hello"
  Output: "olleh"

  Input:  "JavaScript"
  Output: "tpircSavaJ"`,
      difficulty: "easy",
      tags: ["string", "basics"],
    },
    {
      title: "FizzBuzz",
      description: `Write a function fizzBuzz(n) that returns an array of strings from 1 to n where:
- Multiples of 3 → "Fizz"
- Multiples of 5 → "Buzz"
- Multiples of both → "FizzBuzz"
- Otherwise → the number as a string

Example:
  Input:  15
  Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]`,
      difficulty: "easy",
      tags: ["loops", "basics"],
    },
    {
      title: "Find Duplicates in Array",
      description: `Write a function findDuplicates(arr) that takes an array of integers and returns an array of all duplicate values (values that appear more than once). Return each duplicate only once, in any order.

Example:
  Input:  [1, 2, 3, 2, 4, 3, 5]
  Output: [2, 3]

  Input:  [1, 1, 1, 2]
  Output: [1]`,
      difficulty: "easy",
      tags: ["array", "hashmap"],
    },
    {
      title: "Flatten Nested Array",
      description: `Write a function flattenArray(arr) that takes a deeply nested array and returns a single flat array.

Example:
  Input:  [1, [2, [3, [4]], 5]]
  Output: [1, 2, 3, 4, 5]

  Input:  [[1, 2], [3, [4, 5]]]
  Output: [1, 2, 3, 4, 5]

Note: Do not use Array.prototype.flat().`,
      difficulty: "easy",
      tags: ["array", "recursion"],
    },
    {
      title: "Count Word Frequency",
      description: `Write a function wordFrequency(sentence) that takes a string sentence and returns an object where each key is a word and its value is how many times it appears. Ignore case (treat "Hello" and "hello" as the same word).

Example:
  Input:  "the cat sat on the mat the cat"
  Output: { the: 3, cat: 2, sat: 1, on: 1, mat: 1 }`,
      difficulty: "easy",
      tags: ["string", "hashmap"],
    },
    {
      title: "Two Sum",
      description: `Write a function twoSum(nums, target) that takes an array of integers and a target integer. Return the indices of the two numbers that add up to the target. You may assume exactly one solution exists and you cannot use the same element twice.

Example:
  Input:  nums = [2, 7, 11, 15], target = 9
  Output: [0, 1]   // because nums[0] + nums[1] = 2 + 7 = 9

  Input:  nums = [3, 2, 4], target = 6
  Output: [1, 2]`,
      difficulty: "medium",
      tags: ["array", "hashmap"],
    },
    {
      title: "Validate Balanced Brackets",
      description: `Write a function isBalanced(str) that takes a string containing only the characters '(', ')', '{', '}', '[', ']' and returns true if the brackets are balanced and properly nested, false otherwise.

Example:
  Input:  "()[]{}"   → true
  Input:  "([{}])"   → true
  Input:  "(]"       → false
  Input:  "([)]"     → false
  Input:  "{"        → false`,
      difficulty: "medium",
      tags: ["stack", "string"],
    },
    {
      title: "Deep Clone an Object",
      description: `Write a function deepClone(obj) that creates and returns a deep copy of a plain JavaScript object or array. Changing the cloned object must NOT affect the original.

Example:
  const original = { a: 1, b: { c: 2 } };
  const clone = deepClone(original);
  clone.b.c = 99;
  console.log(original.b.c); // still 2

Note: Do not use JSON.parse/JSON.stringify or structuredClone.`,
      difficulty: "medium",
      tags: ["object", "recursion"],
    },
    {
      title: "Promise Sequential Executor",
      description: `Write a function runSequential(tasks) where tasks is an array of functions that each return a Promise. Execute them one after another (not in parallel) and return a Promise that resolves to an array of all results in order.

Example:
  const tasks = [
    () => Promise.resolve(1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
  ];
  runSequential(tasks).then(console.log); // [1, 2, 3]

Note: Do not use Promise.all — tasks must run one at a time.`,
      difficulty: "medium",
      tags: ["async", "promise"],
    },
    {
      title: "Debounce Function",
      description: `Implement a debounce(fn, delay) function. It should return a new function that, when called repeatedly, only executes fn after it has NOT been called for delay milliseconds.

Example:
  const log = debounce((msg) => console.log(msg), 300);
  log("a");  // called at 0ms
  log("b");  // called at 100ms
  log("c");  // called at 200ms
  // Only "c" is logged — at 500ms (200 + 300)

This is used in search bars, resize handlers, etc.`,
      difficulty: "medium",
      tags: ["closure", "timing", "frontend"],
    },
    {
      title: "Throttle Function",
      description: `Implement a throttle(fn, limit) function. It should return a new function that, no matter how often it is called, only executes fn at most once every limit milliseconds.

Example:
  const log = throttle(() => console.log("fired"), 1000);
  log(); // fires immediately
  log(); // ignored (within 1000ms)
  log(); // ignored
  // after 1000ms:
  log(); // fires again

Used in scroll listeners, button spam prevention, etc.`,
      difficulty: "medium",
      tags: ["closure", "timing", "frontend"],
    },
    {
      title: "LRU Cache",
      description: `Implement an LRUCache class with a fixed capacity:
- get(key)       → return value if key exists, else -1. Mark as recently used.
- put(key, value) → insert or update. If at capacity, evict the least recently used item first.

Example:
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.get(1);    // returns 1
  cache.put(3, 3); // evicts key 2
  cache.get(2);    // returns -1 (evicted)
  cache.get(3);    // returns 3`,
      difficulty: "hard",
      tags: ["data-structure", "hashmap", "linked-list"],
    },
    {
      title: "Event Emitter",
      description: `Implement an EventEmitter class with these methods:
- on(event, listener)   → register a listener for an event
- off(event, listener)  → remove a specific listener
- emit(event, ...args)  → call all listeners for the event with the given args
- once(event, listener) → listener fires only the first time the event is emitted, then auto-removes

Example:
  const emitter = new EventEmitter();
  emitter.on("data", (x) => console.log(x));
  emitter.emit("data", 42);  // logs 42
  emitter.emit("data", 43);  // logs 43

This is the core of Node.js's EventEmitter.`,
      difficulty: "medium",
      tags: ["class", "design-pattern", "nodejs"],
    },
    {
      title: "Middleware Pipeline (Express-style)",
      description: `Implement a compose(middlewares) function that takes an array of middleware functions and returns a single function. Each middleware has the signature (req, res, next) and must call next() to pass control to the next middleware.

Example:
  const m1 = (req, res, next) => { req.a = 1; next(); };
  const m2 = (req, res, next) => { req.b = 2; next(); };
  const m3 = (req, res, next) => { res.result = req.a + req.b; };

  const run = compose([m1, m2, m3]);
  const req = {}, res = {};
  run(req, res);
  console.log(res.result); // 3

This is exactly how Express.js processes requests internally.`,
      difficulty: "hard",
      tags: ["nodejs", "express", "design-pattern"],
    },
    {
      title: "Async Rate Limiter",
      description: `Write a function createRateLimiter(maxCalls, windowMs) that returns a function limiter(fn). Calling limiter(fn) should execute fn only if fewer than maxCalls have been made in the last windowMs milliseconds. If the limit is exceeded, throw an error with the message "Rate limit exceeded".

Example:
  const limiter = createRateLimiter(3, 1000);
  await limiter(() => fetch("/api/data"));  // ok
  await limiter(() => fetch("/api/data"));  // ok
  await limiter(() => fetch("/api/data"));  // ok
  await limiter(() => fetch("/api/data"));  // throws "Rate limit exceeded"

This is the logic behind API rate limiting in Express backends.`,
      difficulty: "hard",
      tags: ["async", "nodejs", "api"],
    },
    {
      title: "JWT Payload Decoder",
      description: `Write a function decodeJWT(token) that takes a JWT string (three Base64URL-encoded parts separated by dots) and returns the decoded payload as a JavaScript object. Do NOT verify the signature — only decode.

Example:
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.signature";
  decodeJWT(token);
  // { userId: "123", role: "admin" }

Hint: The payload is the second segment. Base64URL differs from Base64 — handle the padding yourself.`,
      difficulty: "medium",
      tags: ["auth", "string", "nodejs"],
    },
    {
      title: "MongoDB Aggregation Simulator",
      description: `Implement a function aggregate(data, pipeline) that mimics a basic MongoDB aggregation pipeline on a plain JS array. Support these stages:
- { $match: { field: value } }   → filter documents
- { $group: { _id: "$field", total: { $sum: "$field2" } } }  → group and sum
- { $sort: { field: 1 or -1 } }  → sort ascending (1) or descending (-1)

Example:
  const orders = [
    { product: "A", amount: 10 },
    { product: "B", amount: 20 },
    { product: "A", amount: 30 },
  ];
  aggregate(orders, [
    { $match: { product: "A" } },
    { $group: { _id: "$product", total: { $sum: "$amount" } } },
  ]);
  // [{ _id: "A", total: 40 }]`,
      difficulty: "hard",
      tags: ["mongodb", "array", "data-processing"],
    },
    {
      title: "React useState Implementation",
      description: `Implement a simplified version of React's useState hook called myUseState(initialValue). It should return a [value, setter] pair. Calling the setter with a new value should update the stored value, and calling the getter after that should return the new value. Multiple calls to myUseState must track their own independent state (use the concept of a call index / slot).

Example:
  const [count, setCount] = myUseState(0);
  console.log(count());   // 0
  setCount(5);
  console.log(count());   // 5

  const [name, setName] = myUseState("Alice");
  console.log(name());    // "Alice"

Note: count and name must be independent of each other.`,
      difficulty: "hard",
      tags: ["react", "closure", "hooks"],
    },
    {
      title: "Currying Function",
      description: `Write a function curry(fn) that converts any function with multiple arguments into a curried version. The curried function should keep returning functions until all required arguments have been provided, then execute and return the result.

Example:
  function add(a, b, c) { return a + b + c; }
  const curriedAdd = curry(add);

  curriedAdd(1)(2)(3);   // 6
  curriedAdd(1, 2)(3);   // 6
  curriedAdd(1)(2, 3);   // 6
  curriedAdd(1, 2, 3);   // 6

Hint: Use fn.length to know how many arguments are expected.`,
      difficulty: "medium",
      tags: ["functional", "closure"],
    },
    {
      title: "Build a Simple Observable",
      description: `Implement an Observable class similar to RxJS. It should support:
- new Observable(subscribeFn)  → create an observable
- subscribe({ next, error, complete })  → start listening
- The subscribeFn receives an observer and can call observer.next(value), observer.error(err), or observer.complete()

Example:
  const obs = new Observable((observer) => {
    observer.next(1);
    observer.next(2);
    observer.complete();
  });

  obs.subscribe({
    next:     (v) => console.log("value:", v),
    error:    (e) => console.log("error:", e),
    complete: ()  => console.log("done"),
  });
  // value: 1
  // value: 2
  // done`,
      difficulty: "hard",
      tags: ["design-pattern", "async", "frontend"],
    },
  ];

  await AptitudeQuestion.insertMany(problems);
  res.json({ message: "Seeded successfully", count: problems.length });
};
export { addQuestion, getQuestions, seedQuestions };
