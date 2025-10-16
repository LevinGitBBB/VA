const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);


async function generateExplanation(prompt, base64Image) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
    ];

    const result = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = generateExplanation;
