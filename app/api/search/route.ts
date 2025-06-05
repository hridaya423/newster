import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  if (!query || query.trim() === '') {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  if (!process.env.NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'News API key is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=20&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
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

    const filteredArticles = data.articles.filter((article: { url: string; urlToImage: string; title: string }) => 
      article?.url && 
      article?.urlToImage &&
      article?.title &&
      article.url.trim() !== '' &&
      article.urlToImage.trim() !== '' &&
      article.title.trim() !== '' &&
      !article.title.includes('[Removed]')
    );

    return NextResponse.json({
      ...data,
      articles: filteredArticles
    });
  } catch (error) {
    console.error('Error searching news:', error);
    return NextResponse.json(
      { error: 'Failed to search news' },
      { status: 500 }
    );
  }
} 