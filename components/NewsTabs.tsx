
'use client'
import { motion } from 'framer-motion';

interface NewsTabsProps {
  onCategoryChange: (categoryId: string) => void;
  activeCategory: string;
}

export function NewsTabs({ onCategoryChange, activeCategory }: NewsTabsProps) {
  const categories = [
    { id: 'general', label: 'Top Stories', icon: '🔥' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'politics', label: 'Politics', icon: '🏛️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const handleTabChange = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="mb-12">
      
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative group overflow-hidden rounded-lg p-4 text-sm font-semibold transition-all duration-300
                  ${activeCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md'}
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-xs font-medium">{category.label}</span>
                </div>
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="md:hidden">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mx-4">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300
                  ${activeCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="whitespace-nowrap">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}