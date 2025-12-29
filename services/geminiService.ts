import { GoogleGenAI } from "@google/genai";
import { QuestionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAICoachingTip = async (results: QuestionResult[]): Promise<string> => {
  try {
    // Filter purely for analysis
    const mistakes = results.filter(r => !r.isCorrect);
    const correct = results.filter(r => r.isCorrect);
    const averageTime = results.reduce((acc, curr) => acc + curr.timeTaken, 0) / results.length;

    const analysisData = {
      totalQuestions: results.length,
      score: correct.length,
      mistakes: mistakes.map(m => `${m.question.factorA}x${m.question.factorB} (User: ${m.userAnswer ?? 'Timeout'})`),
      averageTimePerQuestion: averageTime.toFixed(2),
    };

    const prompt = `
      You are a friendly and encouraging math tutor.
      Analyze the following multiplication practice session data:
      ${JSON.stringify(analysisData, null, 2)}

      Provide a brief, specific coaching tip (max 2-3 sentences).
      If they did perfectly, congratulate them on their speed and accuracy.
      If they made mistakes, identify if there is a pattern (e.g., struggling with 7s or 8s) and offer a specific mnemonic or tip.
      Keep the tone light and motivating.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep practicing! You're getting better every day.";
  } catch (error) {
    console.error("Error getting AI tip:", error);
    return "Great job practicing! Consistency is key to mastering these tables.";
  }
};

export const getTableTip = async (tableNumber: number): Promise<string> => {
  try {
    const prompt = `
      I am a student learning the multiplication table of ${tableNumber}.
      Tell me a cool trick, pattern, or mnemonic specifically to help memorize the multiples of ${tableNumber}.
      Keep it short, fun, and easy to understand. Max 3 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || `Practice makes perfect! The table of ${tableNumber} is useful to know by heart.`;
  } catch (error) {
    console.error("Error getting table tip:", error);
    return `Let's focus on mastering the table of ${tableNumber}. You can do this!`;
  }
};