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

export interface ArticleAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; 
  credibility: 'high' | 'medium' | 'low';
  credibilityScore: number; 
  bias: 'left' | 'center' | 'right';
  biasScore: number;
  reasoning: {
    sentiment: string;
    credibility: string;
    bias: string;
  };
}

export const analyzeArticle = async (title: string, content: string, source: string): Promise<ArticleAnalysis> => {
  const prompt = `Analyze this news article for sentiment, credibility, and political bias. Provide a detailed analysis.

Title: ${title}
Source: ${source}
Content: ${content.slice(0, 1000)}...

Please analyze and respond with ONLY a valid JSON object in this exact format:
{
  "sentiment": "positive|negative|neutral",
  "sentimentScore": number between -1 and 1,
  "credibility": "high|medium|low",
  "credibilityScore": number between 0 and 1,
  "bias": "left|center|right",
  "biasScore": number between -1 (left) and 1 (right),
  "reasoning": {
    "sentiment": "Brief explanation of sentiment analysis",
    "credibility": "Brief explanation of credibility assessment",
    "bias": "Brief explanation of bias analysis"
  }
}

Consider these factors:
- Sentiment: Overall tone and emotional content
- Credibility: Source reputation, fact-checking, evidence quality, sensationalism
- Bias: Political lean, language use, topic selection, framing`;

  const completion = await groq.chat.completions.create({
    messages: [{
      role: "user",
      content: prompt
    }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1
  });

  try {
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }
    
    const analysis = JSON.parse(response) as ArticleAnalysis;
    
    if (!analysis.sentiment || !analysis.credibility || !analysis.bias) {
      throw new Error('Invalid analysis structure');
    }
    
    return analysis;
  } catch (error) {
    console.error('Error parsing AI analysis:', error);
    
    return {
      sentiment: 'neutral',
      sentimentScore: 0,
      credibility: 'medium',
      credibilityScore: 0.5,
      bias: 'center',
      biasScore: 0,
      reasoning: {
        sentiment: 'Unable to analyze sentiment',
        credibility: 'Unable to assess credibility',
        bias: 'Unable to detect bias'
      }
    };
  }
};