import { motion } from 'framer-motion';

export function NewsCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      
      <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      
      <div className="p-6">
        
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        </div>
        
        
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
        </div>
        
        
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-6 animate-pulse" />
        
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

interface NewsGridSkeletonProps {
  count?: number;
}

export function NewsGridSkeleton({ count = 6 }: NewsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {Array.from({ length: count }, (_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
} 