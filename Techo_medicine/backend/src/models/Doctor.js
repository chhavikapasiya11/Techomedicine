const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    availableSlots: [{ type: Date }], 
    bio: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
