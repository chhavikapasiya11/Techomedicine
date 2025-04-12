const express = require("express");
const { analyzeQuery } = require("../services/GeminiService");

const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        console.log("Received query:", query);
        const response = await analyzeQuery(query);
        console.log("Gemini AI Response:", response);
        res.json({ response });
    } catch (error) {
        console.error("Error processing query:", error);
        res.status(500).json({ error: "Failed to process request. Please try again later." });
    }
});

module.exports = router;
