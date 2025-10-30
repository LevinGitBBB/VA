const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateExplanation(prompt, base64Image) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
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
      attempt++;

      if (err.status === 503 && attempt < maxRetries) {
        console.warn(`Gemini overloaded. Retrying attempt ${attempt}...`);
        await delay(1000 * attempt); 
      } else if (err.status === 503) {
        throw new Error("Gemini API is overloaded. Please try again later.");
      } else {
        throw err;
      }
    }
  }
}

module.exports = generateExplanation;
