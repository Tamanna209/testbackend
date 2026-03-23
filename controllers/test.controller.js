import Test from "../models/test.model.js";
import User from "../models/users.model.js";
import CodingQuestion from "../models/aptitudeQuestions.model.js";

const startTest = async (req, res) => {
  try {
    const userId = req.userId;

    // ── GATE 1: Check if user is blocked ──────────────────────────────────
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked due to suspicious activity.",
        reason: user.blockedReason,
      });
    }

    // ── GATE 2: Check if user already attempted ───────────────────────────
    if (user.hasAttemptedTest) {
      return res.status(403).json({
        message: "You have already attempted this test. Multiple attempts are not allowed.",
      });
    }

    // ── All clear: fetch questions and create test ────────────────────────
    const questions = await CodingQuestion.find()
      .limit(10)
      .select("-testCases"); // hide test cases from student

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found. Please contact admin." });
    }

    const test = await Test.create({
      userId,
      answers: [],
      totalQuestions: questions.length,
      startedAt: new Date(),
    });

    // Mark attempted AFTER test is successfully created
    await User.findByIdAndUpdate(userId, { hasAttemptedTest: true });

    res.json({
      message: "Test started",
      testId: test._id,
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: "startTest error", error: err.message });
  }
};

const submitTest = async (req, res) => {
  try {
    const { answers, wasCheating, cheatingReason } = req.body;
    const userId = req.userId;

    const test = await Test.findOne({
      userId,
      endedAt: { $exists: false },
    }).sort({ createdAt: -1 });

    if (!test) {
      return res.status(404).json({ message: "No active test found for this user" });
    }

    const attemptedCount = answers.filter(
      (a) => a.codeSubmitted?.trim().length > 0
    ).length;

    await Test.findByIdAndUpdate(test._id, {
      answers,
      score: attemptedCount,
      endedAt: new Date(),
      isCheating: wasCheating || false,
      cheatingReason: cheatingReason || "",
    });

    res.json({
      message: "Test submitted",
      attempted: attemptedCount,
      isCheating: wasCheating || false,
    });
  } catch (err) {
    res.status(500).json({ message: "submit error", error: err.message });
  }
};

const status = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("hasAttemptedTest isBlocked blockedReason");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      hasAttempted: !!user.hasAttemptedTest,
      isBlocked:    !!user.isBlocked,
      blockedReason: user.blockedReason || "",
    });
  } catch (err) {
    res.status(500).json({ message: "status error", error: err.message });
  }
};

export { startTest, submitTest, status };