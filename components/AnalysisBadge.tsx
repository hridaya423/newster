'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArticleAnalysis } from '@/lib/groq';

interface AnalysisBadgeProps {
  analysis: ArticleAnalysis;
}

export function AnalysisBadge({ analysis }: AnalysisBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case 'high': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'right': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getCredibilityIcon = (credibility: string) => {
    switch (credibility) {
      case 'high': return '✅';
      case 'medium': return '⚠️';
      case 'low': return '❌';
      default: return '❓';
    }
  };

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case 'left': return '⬅️';
      case 'right': return '➡️';
      default: return '⚖️';
    }
  };

  return (
    <div className="mt-4">
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSentimentColor(analysis.sentiment)}`}>
          <span className="mr-1">{getSentimentIcon(analysis.sentiment)}</span>
          {analysis.sentiment}
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCredibilityColor(analysis.credibility)}`}>
          <span className="mr-1">{getCredibilityIcon(analysis.credibility)}</span>
          {analysis.credibility} credibility
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getBiasColor(analysis.bias)}`}>
          <span className="mr-1">{getBiasIcon(analysis.bias)}</span>
          {analysis.bias === 'center' ? 'center' : `${analysis.bias} leaning`}
        </span>
      </div>

      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center"
      >
        <span>AI Analysis Details</span>
        <svg 
          className={`w-3 h-3 ml-1 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Sentiment Analysis:</span>
                <div className="ml-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2 flex-1 max-w-20">
                  <div 
                    className={`h-2 rounded-full ${analysis.sentiment === 'positive' ? 'bg-green-500' : analysis.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'}`}
                    style={{ width: `${Math.abs(analysis.sentimentScore) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{analysis.reasoning.sentiment}</p>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Credibility:</span>
                <div className="ml-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2 flex-1 max-w-20">
                  <div 
                    className={`h-2 rounded-full ${analysis.credibility === 'high' ? 'bg-green-500' : analysis.credibility === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${analysis.credibilityScore * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{analysis.reasoning.credibility}</p>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Political Bias:</span>
                <div className="ml-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2 flex-1 max-w-20 relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-blue-300 rounded-l-full opacity-50" />
                    <div className="w-1/2 bg-red-300 rounded-r-full opacity-50" />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-2 bg-gray-800 dark:bg-white rounded-full"
                    style={{ left: `${((analysis.biasScore + 1) / 2) * 100}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{analysis.reasoning.bias}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 