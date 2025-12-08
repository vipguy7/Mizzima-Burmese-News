import React, { useState } from 'react';
import { Article, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NewsCardProps {
  article: Article;
  language: Language;
  variant?: 'standard' | 'compact' | 'featured' | 'briefing';
  onRead?: (articleId: string) => void; // New callback
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, language, variant = 'standard', onRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  const t = TRANSLATIONS[language];
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const isBriefing = variant === 'briefing';

  const toggleExpand = () => {
      const newState = !isExpanded;
      setIsExpanded(newState);
      if (newState && onRead) {
          onRead(article.id);
      }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white transition-all duration-300 ${isFeatured ? 'border-b border-brand-border pb-6 mb-6' : ''} ${isExpanded ? 'shadow-md rounded-lg p-4 -mx-4' : ''}`}>
      {/* Image Handling */}
      {(!isBriefing || isExpanded) && (isFeatured || !isCompact) && article.imageUrl && (
        <div className={`relative overflow-hidden bg-gray-100 ${isFeatured ? 'mb-4' : 'mb-3'}`}>
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${isFeatured ? 'h-64 md:h-96' : 'h-48'}`}
            loading="lazy"
          />
          <span className="absolute bottom-0 left-0 bg-brand-black text-white text-xs px-2 py-1 uppercase tracking-wider">
            {article.source}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-xs text-gray-500 uppercase tracking-widest font-sans">
                <span className="font-bold text-brand-black mr-2">{article.category}</span>
                <span>{article.publishedAt}</span>
            </div>
            
            <div className="relative">
                <button 
                    onClick={handleShare}
                    className="text-gray-400 hover:text-brand-black p-1 transition-colors"
                    aria-label="Share"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
                {showShareTooltip && (
                    <div className="absolute right-0 top-full mt-1 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                        {t.shareSuccess}
                    </div>
                )}
            </div>
        </div>
        
        <h3 className={`font-serif font-bold text-brand-black leading-tight mb-2 hover:text-gray-600 cursor-pointer ${isFeatured ? 'text-2xl md:text-4xl' : isBriefing ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`}
            onClick={toggleExpand}>
          {article.title}
        </h3>
        
        <div className={`font-sans text-gray-600 flex-grow ${isCompact && !isExpanded ? 'text-sm' : 'text-base'}`}>
          {isExpanded ? (
            <div className="mt-4 space-y-4 text-brand-black leading-relaxed animate-fade-in">
                {article.fullContent.split('\n').map((para, i) => (
                    para.trim() && <p key={i}>{para}</p>
                ))}
            </div>
          ) : (
            <p className={isBriefing || isCompact ? 'line-clamp-2' : 'line-clamp-3'}>{article.summary}</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-sans">
          <span className="text-gray-400 uppercase">By {article.author}</span>
          <button 
            onClick={toggleExpand}
            className="text-brand-black font-bold hover:underline decoration-1 underline-offset-2 flex items-center gap-1"
          >
            {isExpanded ? t.readLess : t.readMore}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};