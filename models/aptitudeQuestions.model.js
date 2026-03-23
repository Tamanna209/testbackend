// // backend/models/AptitudeQuestion.js
// import mongoose from "mongoose";

// const QSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   answerIndex: { type: Number, required: true },
//   tags: [String]
// }, { timestamps: true });

// export default mongoose.model("AptitudeQuestion", QSchema);


// backend/models/CodingQuestion.js
import mongoose from "mongoose";

const AptitudeQuestionSchema = new mongoose.Schema({
  title:       { type: String, required: true },        // e.g. "Reverse a string"
  description: { type: String, required: true },        // full problem statement
  testCases:   [{ input: String, expectedOutput: String }],  // optional, for future auto-eval
  tags:        [String],
  difficulty:  { type: String, enum: ["easy","medium","hard"], default: "medium" }
}, { timestamps: true });

export default mongoose.model("AptitudeQuestion", AptitudeQuestionSchema);