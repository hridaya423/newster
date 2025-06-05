'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { NewsGrid } from '@/components/NewsGrid'
import { NewsTabs } from '@/components/NewsTabs'
import { Navbar } from '@/components/Navbar'
import { ArticleSorting, SortOption } from '@/components/ArticleSorting'
import { NewsGridSkeleton } from '@/components/NewsSkeleton'
import { fetchTopHeadlines, searchNews } from '@/lib/news'

export default function Dashboard() {
  const [news, setNews] = useState({ articles: [] });
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  const loadNews = async (pageNum: number, isNewCategory: boolean = false, query?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (query) {
        data = await searchNews(query, pageNum);
      } else {
        data = await fetchTopHeadlines(category, pageNum);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNews(prev => ({
        ...data,
        articles: isNewCategory ? data.articles : [...prev.articles, ...data.articles]
      }));
      
      setHasMore(data.articles.length > 0);
    } catch (error) {
      console.error('Error loading news:', error);
      setError(error instanceof Error ? error.message : 'Failed to load news');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    setHasMore(true);
    setIsSearchMode(false);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    setIsSearchMode(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    setHasMore(true);
    setIsSearchMode(false);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  interface Article {
    url: string;
    title: string;
    description: string;
    urlToImage: string;
    publishedAt?: string;
    source: {
      name: string;
    };
  }

  const sortArticles = (articles: Article[]) => {
    const sorted = [...articles];
    switch (sortOption) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.publishedAt || '').getTime() - new Date(b.publishedAt || '').getTime());
      case 'relevance':
      default:
        return sorted; 
    }
  };

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

    if (scrolledToBottom) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (isSearchMode && searchQuery) {
      loadNews(1, true, searchQuery);
    } else if (!isSearchMode) {
    loadNews(1, true);
    }
  }, [category, searchQuery, isSearchMode]);

  useEffect(() => {
    if (page > 1) {
      if (isSearchMode && searchQuery) {
        loadNews(page, false, searchQuery);
      } else {
      loadNews(page, false);
      }
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getCategoryName = (categoryId: string) => {
    const categoryMap: { [key: string]: string } = {
      'general': 'Top Stories',
      'business': 'Business',
      'technology': 'Technology',
      'politics': 'Politics',
      'entertainment': 'Entertainment',
      'health': 'Health',
      'science': 'Science',
      'sports': 'Sports'
    };
    return categoryMap[categoryId] || 'News';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar 
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchQuery={searchQuery}
      />
      
      <main className="container mx-auto px-4 py-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {isSearchMode ? 'Search Results' : getCategoryName(category)}
        </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isSearchMode 
              ? `Found articles matching "${searchQuery}"` 
              : 'Stay informed with the latest news from trusted sources around the world'
            }
          </p>
        </motion.div>
        
        
        {isSearchMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Categories</span>
            </button>
          </motion.div>
        )}
        
        
        {!isSearchMode && (
          <NewsTabs 
            onCategoryChange={handleCategoryChange} 
            activeCategory={category}
          />
        )}
        
        
        <motion.div
          key={isSearchMode ? `search-${searchQuery}` : `category-${category}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
        {error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600 dark:text-red-300">{error}</p>
                <button
                  onClick={() => loadNews(1, true, isSearchMode ? searchQuery : undefined)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
          </div>
            </motion.div>
        ) : (
          <>
            
            {news.articles.length > 0 && (
              <ArticleSorting
                currentSort={sortOption}
                onSortChange={handleSortChange}
                articleCount={news.articles.length}
              />
            )}
            
            
            {loading && news.articles.length === 0 ? (
              <NewsGridSkeleton count={6} />
            ) : (
              <NewsGrid articles={sortArticles(news.articles)} />
            )}
          </>
        )}
        </motion.div>
        
        
        {loading && news.articles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Loading more stories...
              </span>
          </div>
          </motion.div>
        )}
        
        
        {!hasMore && news.articles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                You&apos;re all caught up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No more articles to load. Check back later for fresh content.
              </p>
            </div>
          </motion.div>
        )}
        
        
        {!loading && news.articles.length === 0 && !error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-6">
                {isSearchMode ? '🔍' : '📰'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {isSearchMode ? 'No results found' : 'No articles available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {isSearchMode 
                  ? `We couldn&apos;t find any articles matching "${searchQuery}". Try a different search term.`
                  : 'No articles are currently available for this category. Please try again later.'
                }
              </p>
              {isSearchMode && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                >
                  Browse Categories
                </button>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}