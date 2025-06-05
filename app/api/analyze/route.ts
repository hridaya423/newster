import { NextResponse } from 'next/server';
import { analyzeArticle } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { title, content, source } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeArticle(title, content, source);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json(
      { error: 'Failed to analyze article' },
      { status: 500 }
    );
  }
} 