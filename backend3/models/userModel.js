const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }, // Add `phoneNumber`
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    role: { type: String, default: "user" },
    isBlocked: { type: Boolean, default: false } // New field added here

  });

const User = mongoose.model("User", userSchema);

module.exports = User; // ✅ Fixed incorrect syntax
