import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateSummary = async (text: string) => {
  return groq.chat.completions.create({
    messages: [{
      role: "user",
      content: `Summarize this news article in 3 engaging sentences: ${text}`
    }],
    model: "llama-3.3b-versatile"
  });
};