const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let conversationHistory = []; // Store past messages (limited)

async function analyzeQuery(query) {
    try {
        if (!query || typeof query !== "string") {
            throw new Error("Invalid query. Please provide a valid text input.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        conversationHistory.push({ role: "user", parts: [{ text: query }] });

        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        const requestPayload = { contents: conversationHistory };

        console.log(" Sending request to Gemini AI:", JSON.stringify(requestPayload, null, 2));

        const result = await model.generateContent(requestPayload);

        if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0) {
            throw new Error("Unexpected empty response from Gemini AI.");
        }

        const responseText = result.response.candidates[0].content.parts[0].text || "I couldn't process that request.";

        console.log("Gemini AI Response:", responseText);

       
        conversationHistory.push({ role: "model", parts: [{ text: responseText }] });

        return responseText;
    } catch (error) {
        console.error(" Gemini AI Error:", error.message);
        return "Sorry, I encountered an issue while processing your request.";
    }
}

module.exports = { analyzeQuery };
