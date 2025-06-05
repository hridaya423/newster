'use client'
import { useState } from 'react';
import { useTheme } from '@/lib/theme-context';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  searchQuery?: string;
}

export function Navbar({ onSearch, onClearSearch, searchQuery }: NavbarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const { theme, toggleTheme, mounted } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim() && onSearch) {
      onSearch(localSearchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Newster
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                AI-Powered News
              </p>
            </div>
          </div>

          
          <div className="flex items-center space-x-4">
            
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-64 md:w-80 px-4 py-2 pl-10 pr-10 text-sm bg-gray-50 dark:bg-gray-800 
                           border border-gray-300 dark:border-gray-600 rounded-lg
                           text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-300"
                />
                
                
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 
                       border border-gray-200 dark:border-gray-700"
              aria-label="Toggle dark mode"
            >
              <div className="w-5 h-5">
                {mounted ? (
                  theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                ) : (
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
