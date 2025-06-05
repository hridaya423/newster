import { ArticleAnalysis } from '@/lib/groq';

interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

export const fetchNews = async (category: string = 'general'): Promise<Article[]> => {
  const response = await fetch(`/api/news?category=${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  const data = await response.json();
  return data.articles;
};

export const searchNews = async (query: string): Promise<Article[]> => {
  const response = await fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search news');
  }
  const data = await response.json();
  return data.articles;
};

export const analyzeNews = async (title: string, content: string, source: string): Promise<ArticleAnalysis> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, source }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze article');
  }
  
  const data = await response.json();
  return data.analysis;
}; 