// backend/models/users.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /@(service\.com|gmail\.com|outlook\.com|yahoo\.com)$/i,
        "Email domain must be one of service.com, gmail.com, outlook.com, yahoo.com",
      ],
    },

    // phone — made optional, unique index removed to avoid dummy value conflicts
    phone: {
      type: String,
      required: false,
      default: "0000000000",
      // unique: true   ← REMOVED — all users would have "0000000000" causing duplicate key errors
      // match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]  ← REMOVED
    },

    // college — made optional
    college: {
      type: String,
      required: false,
      default: "N/A",
    },

    // technology — already optional, added default for consistency
    technology: {
      type: String,
      required: false,
      default: "N/A",
    },

    // flags — untouched
    hasAttemptedTest: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

// // backend/models/User.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String },
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//       lowercase: true,
//       trim: true,
//       match: [
//         /@(service\.com|gmail\.com|outlook\.com|yahoo\.com)$/i,
//         "Email domain must be one of service.com, gmail.com, outlook.com, yahoo.com",
//       ],
//     },
//     phone: {
//       type: String,
//       unique: true,
//       required: true,
//       match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
//     },
//     college: { type: String, required: true },
//     technology: { type: String },

//     // flags
//     hasAttemptedTest: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     blockedReason: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);
