/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'

interface NewsTabsProps {
  onCategoryChange: (categoryId: string) => void;
}

export function NewsTabs({ onCategoryChange }: NewsTabsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const categories = [
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'politics', label: 'Politics', icon: '🏛️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const handleTabChange = (categoryId: any) => {
    setActiveTab(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 bg-white p-3 rounded-xl shadow-md mb-8 max-w-5xl mx-auto">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleTabChange(category.id)}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300
            ${activeTab === category.id 
              ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}
          `}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}