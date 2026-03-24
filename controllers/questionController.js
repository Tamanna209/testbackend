// backend/controllers/questionController.js
import AptitudeQuestion from "../models/aptitudeQuestions.model.js";

const addQuestion = async (req, res) => {
  try {
    const { title, description, testCases, tags, difficulty } = req.body;
    await AptitudeQuestion.create({
      title,
      description,
      testCases,
      tags,
      difficulty,
    });
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
    // ADD THESE INTO THE problems array alongside existing questions

    {
      title: "Build a Pagination Helper",
      description: `Write a function paginate(array, pageSize, pageNumber) that takes an array of items and returns the correct slice for that page. Page numbers start at 1.

Example:
  Input:  ([1,2,3,4,5,6,7,8,9,10], 3, 2)
  Output: [4, 5, 6]

  Input:  ([1,2,3,4,5], 2, 3)
  Output: [5]

  Input:  ([1,2,3], 3, 1)
  Output: [1, 2, 3]`,
      difficulty: "easy",
      tags: ["array", "logic", "backend"],
    },
    {
      title: "Group Array of Objects by Key",
      description: `Write a function groupBy(arr, key) that groups an array of objects by a given key and returns an object where each key maps to an array of matching items.

Example:
  const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob",   role: "user"  },
    { name: "Carol", role: "admin" },
  ];
  groupBy(users, "role");
  // {
  //   admin: [{ name: "Alice", role: "admin" }, { name: "Carol", role: "admin" }],
  //   user:  [{ name: "Bob", role: "user" }]
  // }`,
      difficulty: "easy",
      tags: ["array", "object", "logic"],
    },
    {
      title: "Mongoose-style Query Filter",
      description: `Write a function filterDocuments(docs, query) that filters an array of plain JS objects using a MongoDB-style query object. Support these operators: $eq, $gt, $lt, $gte, $lte, $ne.

Example:
  const docs = [
    { name: "Alice", age: 25 },
    { name: "Bob",   age: 17 },
    { name: "Carol", age: 30 },
  ];
  filterDocuments(docs, { age: { $gte: 18, $lt: 30 } });
  // [{ name: "Alice", age: 25 }]

  filterDocuments(docs, { name: { $ne: "Bob" } });
  // [{ name: "Alice", age: 25 }, { name: "Carol", age: 30 }]`,
      difficulty: "medium",
      tags: ["mongodb", "object", "logic"],
    },
    {
      title: "JWT Token Expiry Checker",
      description: `Write a function isTokenExpired(token) that decodes a JWT (without verifying signature) and returns true if the token is expired, false otherwise. The payload contains an exp field which is a Unix timestamp in seconds.

Example:
  // token with exp = past timestamp
  isTokenExpired("eyJ...pastToken...") // true

  // token with exp = future timestamp
  isTokenExpired("eyJ...futureToken...") // false

Hint: Compare exp * 1000 against Date.now(). Handle malformed tokens gracefully — return true if the token cannot be decoded.`,
      difficulty: "medium",
      tags: ["auth", "jwt", "nodejs"],
    },
    {
      title: "Flatten Object to Dot Notation",
      description: `Write a function flattenObject(obj) that takes a deeply nested object and returns a flat object where nested keys are represented using dot notation.

Example:
  Input:
  {
    user: {
      name: "Alice",
      address: {
        city: "Delhi",
        pin: 110001
      }
    },
    active: true
  }

  Output:
  {
    "user.name": "Alice",
    "user.address.city": "Delhi",
    "user.address.pin": 110001,
    "active": true
  }`,
      difficulty: "medium",
      tags: ["object", "recursion", "logic"],
    },
    {
      title: "Express Route Matcher",
      description: `Write a function matchRoute(pattern, path) that checks whether a URL path matches a given Express-style route pattern. Support :param wildcards only (no regex, no *).

Example:
  matchRoute("/user/:id",          "/user/42")         // true
  matchRoute("/user/:id/post/:pid", "/user/1/post/99") // true
  matchRoute("/user/:id",          "/user/42/extra")   // false
  matchRoute("/about",             "/about")           // true
  matchRoute("/about",             "/contact")         // false`,
      difficulty: "medium",
      tags: ["nodejs", "express", "string", "logic"],
    },
    {
      title: "Build a Simple In-Memory Cache with TTL",
      description: `Implement a class TTLCache with the following methods:
- set(key, value, ttlMs) → store value with a time-to-live in milliseconds
- get(key)               → return value if it exists and has not expired, else return null
- delete(key)            → manually remove a key

Example:
  const cache = new TTLCache();
  cache.set("token", "abc123", 500); // expires in 500ms
  cache.get("token");  // "abc123"

  // after 500ms:
  cache.get("token");  // null

Note: Do not use setTimeout for expiry — check expiry lazily inside get().`,
      difficulty: "medium",
      tags: ["data-structure", "nodejs", "backend"],
    },
    {
      title: "Retry Failed Async Function",
      description: `Write a function withRetry(fn, retries, delayMs) that calls an async function fn. If it throws, retry up to retries more times, waiting delayMs milliseconds between each attempt. If all attempts fail, throw the last error.

Example:
  let attempts = 0;
  const unstable = async () => {
    attempts++;
    if (attempts < 3) throw new Error("fail");
    return "success";
  };

  const result = await withRetry(unstable, 3, 100);
  console.log(result);   // "success"
  console.log(attempts); // 3

This pattern is used heavily in API clients and DB connection logic.`,
      difficulty: "medium",
      tags: ["async", "nodejs", "backend", "error-handling"],
    },
    {
      title: "Detect Circular Reference in Object",
      description: `Write a function hasCircularReference(obj) that returns true if the object contains a circular reference, false otherwise.

Example:
  const a = { name: "Alice" };
  hasCircularReference(a); // false

  const b = { name: "Bob" };
  b.self = b;
  hasCircularReference(b); // true

  const c = { x: { y: {} } };
  c.x.y.z = c.x;
  hasCircularReference(c); // true

Hint: Use a WeakSet to track visited objects during traversal.`,
      difficulty: "medium",
      tags: ["object", "recursion", "logic"],
    },
    {
      title: "Role-Based Access Control (RBAC) Checker",
      description: `Write a function canAccess(userRole, resource, action, policy) that checks if a given role is allowed to perform an action on a resource, based on a policy object.

Example:
  const policy = {
    admin:  { users: ["read", "write", "delete"], posts: ["read", "write", "delete"] },
    editor: { posts: ["read", "write"] },
    viewer: { posts: ["read"] },
  };

  canAccess("admin",  "users", "delete", policy); // true
  canAccess("editor", "posts", "write",  policy); // true
  canAccess("viewer", "posts", "write",  policy); // false
  canAccess("viewer", "users", "read",   policy); // false

This is the core logic behind middleware like express-rbac.`,
      difficulty: "medium",
      tags: ["auth", "backend", "logic", "nodejs"],
    },
    {
      title: "Build a Simple React Form Validator",
      description: `Write a function validate(formData, rules) where rules is an object that maps field names to an array of validator functions. Each validator returns an error string if invalid, or null if valid. Return an object with field names mapped to their first error (or null if valid).

Example:
  const rules = {
    email: [
      v => (!v ? "Email is required" : null),
      v => (!v.includes("@") ? "Invalid email" : null),
    ],
    password: [
      v => (!v ? "Password is required" : null),
      v => (v.length < 6 ? "Min 6 characters" : null),
    ],
  };

  validate({ email: "bad", password: "123" }, rules);
  // { email: "Invalid email", password: "Min 6 characters" }

  validate({ email: "a@b.com", password: "secure1" }, rules);
  // { email: null, password: null }`,
      difficulty: "medium",
      tags: ["react", "frontend", "logic", "validation"],
    },
    {
      title: "Implement a Task Queue with Concurrency Limit",
      description: `Write a function createTaskQueue(concurrency) that returns an object with an add(fn) method. Tasks added via add() are async functions. At most concurrency tasks should run simultaneously. Remaining tasks should wait and auto-start as slots free up.

Example:
  const queue = createTaskQueue(2);

  const task = (id, ms) => () =>
    new Promise(res => setTimeout(() => { console.log("done", id); res(); }, ms));

  queue.add(task(1, 300)); // starts immediately
  queue.add(task(2, 300)); // starts immediately
  queue.add(task(3, 300)); // waits — slot taken
  // Once task 1 or 2 finishes, task 3 starts automatically

This is the core of tools like p-limit and worker pool managers.`,
      difficulty: "hard",
      tags: ["async", "nodejs", "concurrency", "backend"],
    },
  ];

  await AptitudeQuestion.insertMany(problems);
  res.json({ message: "Seeded successfully", count: problems.length });
};
export { addQuestion, getQuestions, seedQuestions };
