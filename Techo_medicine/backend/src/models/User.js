const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true }, // 🔹 Replaced 'name' with 'username'
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
