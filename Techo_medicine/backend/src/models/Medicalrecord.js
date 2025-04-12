const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    diagnosis: { type: String, required: true },
    prescription: [{ type: String }], 
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
