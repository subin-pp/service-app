const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  place: { type: String },
  district: { type: String },
  age: { type: Number },
  experience: { type: Number },
  serviceType: { type: String }, // Example: Plumber, Electrician
  profilePic: { type: String, default: "" },
  resume: { type: String, default: "" },
  totalWorkTaken: { type: Number, default: 0 },
  loginHours: { type: Number, default: 0 },
  dailyLogin: { type: Boolean, default: false },
  availability: { type: Boolean, default:false },
  role: { type: String, default: "worker" }, // Add role field
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false } // New field added here
});

const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;