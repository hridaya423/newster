'use client'
import { useState, useEffect, useCallback } from 'react'
import { NewsGrid } from '@/components/NewsGrid'
import { NewsTabs } from '@/components/NewsTabs'
import { fetchTopHeadlines } from '@/lib/news'

export default function Dashboard() {
  const [news, setNews] = useState({ articles: [] });
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadNews = async (pageNum: number, isNewCategory: boolean = false) => {
    try {
      setLoading(true);
      const data = await fetchTopHeadlines(category, pageNum);
      
      setNews(prev => ({
        ...data,
        articles: isNewCategory ? data.articles : [...prev.articles, ...data.articles]
      }));
      
      // Check if we've reached the end of available articles
      setHasMore(data.articles.length > 0);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    setHasMore(true);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

    if (scrolledToBottom) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Initial load and category change
  useEffect(() => {
    loadNews(1, true);
  }, [category]);

  // Load more on page change
  useEffect(() => {
    if (page > 1) {
      loadNews(page, false);
    }
  }, [page]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Latest News
        </h1>
        <NewsTabs onCategoryChange={handleCategoryChange} />
        <NewsGrid articles={news.articles} />
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        )}
        {!hasMore && news.articles.length > 0 && (
          <p className="text-center text-gray-600 mt-4">No more articles to load</p>
        )}
      </main>
    </div>
  );
}