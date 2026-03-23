// // backend/controllers/admin.controller.js
// import Test from "../models/test.model.js";
// import User from "../models/users.model.js";
// import AptitudeQuestion from "../models/aptitudeQuestions.model.js";
// import ADMIN_KEY from "./adminKey.js";
// const ADMIN_PASSKEY = ADMIN_KEY;
// // console.log("key",ADMIN_PASSKEY);

// // Verify admin passkey
// const verifyAdminPasskey = async (req, res) => {
//   try {
//     const { passkey } = req.body;

//     if (!passkey) {
//       return res.status(400).json({ message: "Passkey required" });
//     }

//     if (passkey !== ADMIN_PASSKEY) {
//       return res.status(401).json({ message: "Invalid passkey" });
//     }

//     // Generate a token for admin session (simple JWT-like token)
//     const adminToken = Buffer.from(`admin:${Date.now()}`).toString("base64");

//     res.json({
//       message: "Admin authenticated",
//       adminToken,
//       expiresIn: 3600, // 1 hour
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Auth error", error: err.message });
//   }
// };

// // Get all test results (admin only)
// const getAllResults = async (req, res) => {
//   try {
//     const adminToken = req.headers.authorization?.split(" ")[1];

//     if (!adminToken) {
//       return res.status(401).json({ message: "Admin token required" });
//     }

//     // Verify token (simple check)
//     try {
//       const decoded = Buffer.from(adminToken, "base64").toString();
//       if (!decoded.startsWith("admin:")) {
//         return res.status(401).json({ message: "Invalid admin token" });
//       }
//     } catch (e) {
//       return res.status(401).json({ message: "Invalid token format" });
//     }

//     // Get all tests with user info, grouped by user (latest test per user)
//     const results = await Test.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//       {
//         $group: {
//           _id: "$userId",
//           latestTest: { $first: "$$ROOT" },
//         },
//       },
//       {
//         $replaceRoot: { newRoot: "$latestTest" },
//       },
//       {
//         $project: {
//           _id: 1,
//           studentName: "$user.name",
//           email: "$user.email",
//           phone: "$user.phone",
//           college: "$user.college",
//           technology: "$user.technology",
//           score: 1,
//           totalQuestions: 1,
//           answers: 1,
//           isCheating: 1,
//           cheatingReason: 1,
//           startedAt: 1,
//           endedAt: 1,
//           createdAt: 1,
//           isBlocked: "$user.isBlocked",
//         },
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//     ]);

//     // Format results with correct/wrong/unanswered counts
//     const formattedResults = await Promise.all(
//       results.map(async (result) => {
//         let correct = 0;
//         let wrong = 0;
//         let unanswered = result.totalQuestions - result.answers.length;

//         for (const ans of result.answers) {
//           const question = await AptitudeQuestion.findById(ans.questionId);
//           if (question && ans.selectedIndex === question.answerIndex) {
//             correct++;
//           } else {
//             wrong++;
//           }
//         }

//         return {
//           _id: result._id,
//           studentName: result.studentName || "N/A",
//           email: result.email,
//           phone: result.phone,
//           college: result.college || "N/A",
//           score: `${result.score}/${result.totalQuestions}`,
//           percentage:
//             result.totalQuestions > 0
//               ? Math.round((result.score / result.totalQuestions) * 100)
//               : 0,
//           correct,
//           wrong,
//           unanswered,
//           isCheating: result.isBlocked ? true : result.isCheating,
//           cheatingReason: result.isBlocked
//             ? "User is blocked"
//             : result.cheatingReason || "",
//           submittedAt: result.endedAt || result.createdAt,
//         };
//       })
//     );

//     res.json({
//       message: "Results fetched",
//       total: formattedResults.length,
//       results: formattedResults,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching results", error: err.message });
//   }
// };

// export { verifyAdminPasskey, getAllResults };


import Test from "../models/test.model.js";
import User from "../models/users.model.js";
import CodingQuestion from "../models/aptitudeQuestions.model.js";
import ADMIN_KEY from "./adminKey.js";

const ADMIN_PASSKEY = ADMIN_KEY;

const verifyAdminPasskey = async (req, res) => {
  try {
    const { passkey } = req.body;
    if (!passkey) return res.status(400).json({ message: "Passkey required" });
    if (passkey !== ADMIN_PASSKEY)
      return res.status(401).json({ message: "Invalid passkey" });

    const adminToken = Buffer.from(`admin:${Date.now()}`).toString("base64");
    res.json({ message: "Admin authenticated", adminToken, expiresIn: 3600 });
  } catch (err) {
    res.status(500).json({ message: "Auth error", error: err.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const adminToken = req.headers.authorization?.split(" ")[1];
    if (!adminToken)
      return res.status(401).json({ message: "Admin token required" });

    try {
      const decoded = Buffer.from(adminToken, "base64").toString();
      if (!decoded.startsWith("admin:"))
        return res.status(401).json({ message: "Invalid admin token" });
    } catch {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Get latest test per user with user info
    const results = await Test.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          latestTest: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestTest" } },
      {
        $project: {
          _id: 1,
          userId: 1,
          studentName: "$user.name",
          email: "$user.email",
          phone: "$user.phone",
          college: "$user.college",
          technology: "$user.technology",
          score: 1,
          totalQuestions: 1,
          answers: 1,
          isCheating: 1,
          cheatingReason: 1,
          startedAt: 1,
          endedAt: 1,
          createdAt: 1,
          isBlocked: "$user.isBlocked",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // For each result, enrich answers with question title
    const formattedResults = await Promise.all(
      results.map(async (result) => {
        const attempted = result.answers?.length || 0;
        const unanswered = result.totalQuestions - attempted;

        // Enrich each answer with the question title and description
        const enrichedAnswers = await Promise.all(
          (result.answers || []).map(async (ans) => {
            let questionTitle = "Unknown Question";
            let questionDescription = "";
            try {
              const q = await CodingQuestion.findById(ans.questionId).select(
                "title description"
              );
              if (q) {
                questionTitle = q.title;
                questionDescription = q.description;
              }
            } catch {}
            return {
              questionId:          ans.questionId,
              questionTitle,
              questionDescription,
              codeSubmitted:       ans.codeSubmitted || "",
              language:            ans.language || "javascript",
              attemptedAt:         ans.attemptedAt,
            };
          })
        );

        return {
          _id:            result._id,
          studentName:    result.studentName || "N/A",
          email:          result.email,
          phone:          result.phone,
          college:        result.college || "N/A",
          technology:     result.technology || "N/A",
          score:          `${result.score}/${result.totalQuestions}`,
          attempted,
          unanswered,
          percentage:
            result.totalQuestions > 0
              ? Math.round((attempted / result.totalQuestions) * 100)
              : 0,
          isCheating:     result.isBlocked ? true : result.isCheating,
          cheatingReason: result.isBlocked
            ? "User is blocked"
            : result.cheatingReason || "",
          submittedAt:    result.endedAt || result.createdAt,
          answers:        enrichedAnswers,
        };
      })
    );

    res.json({
      message: "Results fetched",
      total: formattedResults.length,
      results: formattedResults,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching results", error: err.message });
  }
};

export { verifyAdminPasskey, getAllResults };