import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SortOption = 'latest' | 'oldest' | 'relevance';

interface ArticleSortingProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  articleCount: number;
}

const sortOptions = [
  { value: 'latest' as SortOption, label: 'Latest First', icon: '🕐' },
  { value: 'oldest' as SortOption, label: 'Oldest First', icon: '📅' },
  { value: 'relevance' as SortOption, label: 'Most Relevant', icon: '🎯' },
];

export function ArticleSorting({ currentSort, onSortChange, articleCount }: ArticleSortingProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = sortOptions.find(option => option.value === currentSort);

  return (
    <div className="flex items-center justify-between mb-6">
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{articleCount}</span> articles found
      </div>

      
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span className="text-lg">{currentOption?.icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentOption?.label}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"
            >
              <div className="py-2">
                {sortOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center space-x-3 ${
                      currentSort === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    {currentSort === option.value && (
                      <svg className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
} 