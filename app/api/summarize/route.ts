/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateSummary } from '@/lib/groq';

export async function POST(request: Request) {
  const { text } = await request.json();
  
  try {
    const completion = await generateSummary(text);
    return Response.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}