const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true //  Faster lookup for patient appointments
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true //  Faster lookup for doctor appointments
    },
    meetingLink: { type: String, required: false },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date(); //  Prevents past dates
        },
        message: "Appointment date must be in the future."
      }
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
      trim: true
    }
  },
  
  { timestamps: true } 
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
