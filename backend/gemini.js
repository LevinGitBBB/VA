// gemini-helper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

// Function to generate a response
async function generateExplanation(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = { generateExplanation };
