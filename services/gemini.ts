import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function explainQuestion(questionText: string, options: string[], answer: string, context: string): Promise<string> {
  try {
    const prompt = `
      You are an expert tutor in Chinese Securities Law (证券法) and financial regulations.
      Please explain the following question in detail.
      
      Question: ${questionText}
      Options:
      ${options.join('\n')}
      
      Correct Answer: ${answer}
      Additional Context/Knowledge Point: ${context}
      
      Please provide:
      1. A clear analysis of why the correct answer is correct.
      2. Briefly explain why the other options are incorrect (if applicable).
      3. Elaborate on the relevant legal provisions or concepts.
      
      Keep the tone professional yet easy to understand for a student preparing for the qualification exam. 
      Respond in Chinese.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I could not generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating explanation. Please check your network or API key configuration.";
  }
}
