const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");

router.post("/match-doctor", async (req, res) => {
  try {
    const { presentHealthStatus } = req.body;

    if (!presentHealthStatus || !Array.isArray(presentHealthStatus)) {
      return res.status(400).json({ message: "Invalid health status data" });
    }

    const symptomToSpecialization = {
        "fever": "General Physician",
        "cold": "General Physician",
        "cough": "Pulmonologist",
        "chest pain": "Cardiologist",
        "skin rash": "Dermatologist",
        "diabetes": "Endocrinologist",
        "asthma": "Pulmonologist",
        "anxiety": "Psychiatrist",
        "depression": "Psychiatrist",
        "back pain": "Orthopedic",
        "neck pain": "Orthopedic",
        "headache": "Neurologist",
        "migraine": "Neurologist",
        "vision problems": "Ophthalmologist",
        "eye pain": "Ophthalmologist",
        "hearing loss": "ENT Specialist",
        "ear pain": "ENT Specialist",
        "sore throat": "ENT Specialist",
        "stomach pain": "Gastroenterologist",
        "vomiting": "Gastroenterologist",
        "constipation": "Gastroenterologist",
        "diarrhea": "Gastroenterologist",
        "urinary infection": "Urologist",
        "kidney pain": "Nephrologist",
        "joint pain": "Rheumatologist",
        "menstrual cramps": "Gynecologist",
        "pregnancy": "Gynecologist",
        "acne": "Dermatologist",
        "high blood pressure": "Cardiologist",
        "thyroid issues": "Endocrinologist",
        "seizures": "Neurologist",
        "toothache":"Dentist"
      };
      

    const matchedSpecializations = presentHealthStatus
      .map(symptom => symptomToSpecialization[symptom.toLowerCase()])
      .filter(Boolean);

    if (matchedSpecializations.length === 0) {
      return res.status(404).json({ message: "No specialization matched" });
    }

    const doctors = await Doctor.find({
      specialization: { $in: matchedSpecializations }
    })
    .populate("userId", "username") // This will populate the username from User model
    .select("specialization experience userId");
    

    console.log("Matched Doctors:", doctors);

    res.json({ matches: doctors });
  } catch (err) {
    console.error("Matching error:", err);
    res.status(500).json({ message: "Error matching doctors" });
  }
});

module.exports = router;
