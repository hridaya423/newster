'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NewsCardProps {
  title: string
  summary: string
  image: string
  source: string
  url: string
}

export function NewsCard({ title, summary, image, source, url }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReadMore = async () => {
    if (!expanded && !aiSummary) {
      setLoading(true);
      try {
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: summary }),
        });
        const data = await response.json();
        setAiSummary(data.summary);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    }
    setExpanded(!expanded);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative">
        <img 
          src={image || '/placeholder-news.jpg'} 
          alt={title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          {source}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 hover:line-clamp-none">
          {title}
        </h3>
        
        <p className={`text-gray-600 ${expanded ? '' : 'line-clamp-3'} text-sm leading-relaxed`}>
          {expanded && aiSummary ? aiSummary : summary}
        </p>
        
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={handleReadMore}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center space-x-2 text-sm font-medium"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Processing...</span>
              </>
            ) : (
              expanded ? 'Show Less' : 'Read More'
            )}
          </button>
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300 
                     flex items-center space-x-1 text-sm font-medium"
          >
            <span>Full Article</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}