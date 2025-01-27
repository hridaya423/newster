import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const page = searchParams.get('page') || '1';

  if (!process.env.NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'News API key is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.articles) {
      return NextResponse.json(
        { error: 'Invalid response from News API', articles: [] },
        { status: 500 }
      );
    }

    const filteredArticles = data.articles.filter((article: { url: string; urlToImage: string }) => 
      article?.url && 
      article?.urlToImage &&
      article.url.trim() !== '' &&
      article.urlToImage.trim() !== ''
    );

    return NextResponse.json({
      ...data,
      articles: filteredArticles
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}   