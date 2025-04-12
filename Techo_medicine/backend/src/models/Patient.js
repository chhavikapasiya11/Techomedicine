const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  medicalHistory: [{ type: String }],
  contactNumber: { type: String, required: true },
  presentHealthStatus: {
    type: [String],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", PatientSchema);

