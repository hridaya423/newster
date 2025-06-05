'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisBadge } from './AnalysisBadge';
import { analyzeNews } from '@/lib/api';
import { ArticleAnalysis } from '@/lib/groq';
import { calculateReadingTime } from '@/lib/utils';

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
  const [imageError, setImageError] = useState(false);
  const [analysis, setAnalysis] = useState<ArticleAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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

  const handleAnalyze = async () => {
    if (analysis) return; 
    
    setAnalysisLoading(true);
    try {
      const articleAnalysis = await analyzeNews(title, summary, source);
      setAnalysis(articleAnalysis);
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {!imageError ? (
        <img 
          src={image || '/placeholder-news.jpg'} 
          alt={title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        )}
        
        
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          {source}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white leading-tight line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {title}
        </h3>
        
        
        <div className="mb-4">
          <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-all duration-300 ${
            expanded ? '' : 'line-clamp-3'
          }`}>
            {expanded && aiSummary ? (
              <span className="relative">
                <span className="absolute -left-2 top-0 w-1 h-full bg-blue-500 rounded-full" />
                <span className="italic pl-2">{aiSummary}</span>
              </span>
            ) : (
              summary
            )}
        </p>
        </div>

        
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {calculateReadingTime(summary)}
          </span>
        </div>

        
        {analysis && <AnalysisBadge analysis={analysis} />}
        
        
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between items-center">
            <motion.button 
            onClick={handleReadMore}
            disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
            {loading ? (
              <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI Analyzing...</span>
              </>
            ) : (
                  <>
                    <span>{expanded ? 'Show Less' : 'AI Summary'}</span>
                    <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expanded ? "M5 15l7-7 7 7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </>
            )}
              </div>
            </motion.button>
          
            <motion.a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 font-medium text-sm"
            >
              <span>Read Full Article</span>
              <svg className="w-4 h-4 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </div>

          
          <motion.button 
            onClick={handleAnalyze}
            disabled={analysisLoading || analysis !== null}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:bg-purple-700"
          >
            <div className="flex items-center justify-center space-x-2">
              {analysisLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : analysis ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Analysis Complete</span>
                </>
              ) : (
                <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
                  <span>AI Analysis</span>
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}