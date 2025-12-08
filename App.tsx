
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import { FightSection } from './components/FightSection';
import { Footer } from './components/Footer';
import { fetchHeroSummary, fetchDailyBriefing, fetchNewsFeed } from './services/geminiService';
import { Language, NewsCategory, Article, UserStats } from './types';
import { TRANSLATIONS, INITIAL_ARTICLES } from './constants';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.TOP_STORIES);
  
  // Data States
  const [heroSummary, setHeroSummary] = useState<string>("");
  const [heroLastUpdated, setHeroLastUpdated] = useState<string>("");
  const [briefingArticles, setBriefingArticles] = useState<Article[]>([]);
  const [feedArticles, setFeedArticles] = useState<Article[]>(INITIAL_ARTICLES);
  
  // Gamification State
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    adsWatched: 0,
    videosWatched: [],
    articlesRead: []
  });

  // UI States
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const t = TRANSLATIONS[language];

  const refreshAll = useCallback(async () => {
    setIsInitialLoading(true);
    setPage(1);
    
    const now = new Date();
    setHeroLastUpdated(now.toLocaleTimeString(language === Language.MM ? 'my-MM' : 'en-US', { hour: '2-digit', minute: '2-digit' }));

    const summary = await fetchHeroSummary(language);
    setHeroSummary(summary);

    const briefing = await fetchDailyBriefing(language);
    setBriefingArticles(briefing);

    const feed = await fetchNewsFeed(language, activeCategory, 1);
    setFeedArticles(feed);

    setIsInitialLoading(false);
  }, [language, activeCategory]);

  const loadMoreNews = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const newArticles = await fetchNewsFeed(language, activeCategory, nextPage);
    
    if (newArticles.length > 0) {
        setFeedArticles(prev => [...prev, ...newArticles]);
        setPage(nextPage);
    }
    setIsLoadingMore(false);
  };

  const handleArticleRead = (articleId: string) => {
    if (!userStats.articlesRead.includes(articleId)) {
      setUserStats(prev => ({
        ...prev,
        points: prev.points + 10,
        articlesRead: [...prev.articlesRead, articleId]
      }));
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <div className={`min-h-screen flex flex-col bg-white text-brand-black ${language === Language.MM ? 'lang-mm font-serif' : 'lang-en font-serif'}`}>
      
      <Header 
        language={language}
        setLanguage={setLanguage}
        activeCategory={activeCategory}
        setCategory={setActiveCategory}
        onRefresh={refreshAll}
        isLoading={isInitialLoading}
      />

      <main className="flex-grow container mx-auto px-4 py-6">
        
        {/* HERO SECTION */}
        <section className="bg-brand-gray border border-brand-border p-6 mb-8 rounded-sm shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                    <h2 className="font-sans font-bold uppercase text-xs tracking-widest text-red-700 mb-2">
                        {t.heroTitle}
                    </h2>
                    {isInitialLoading && !heroSummary ? (
                        <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <p className="font-serif text-lg md:text-xl leading-relaxed text-brand-black">
                            {heroSummary || "System ready. Click 'Update News' to fetch the latest summary."}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400 font-sans border-t md:border-t-0 md:border-l border-gray-300 pt-2 md:pt-0 md:pl-4">
                    <span className="block font-bold mb-1">{t.lastUpdated}</span>
                    <span>{heroLastUpdated || "--:--"}</span>
                </div>
            </div>
        </section>

        {isInitialLoading && feedArticles.length <= 1 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse text-gray-400">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="font-sans uppercase tracking-widest text-sm">{t.extracting}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-brand-border">
            
                {/* LEFT SIDEBAR (Desktop: 4 cols) */}
                <div className="lg:col-span-4 pr-0 lg:pr-8">
                    {/* FIGHT WITH MIZZIMA SECTION */}
                    <FightSection 
                        language={language}
                        userStats={userStats}
                        onUpdateStats={setUserStats}
                    />

                    {/* DAILY BRIEFING */}
                    <div className="sticky top-24">
                        <h2 className="font-serif text-2xl font-bold border-b-2 border-black pb-2 mb-6">
                            {t.dailyBriefing}
                        </h2>
                        <div className="space-y-6 divide-y divide-gray-100 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                            {briefingArticles.map((article) => (
                                <div key={article.id} className="pt-4 first:pt-0">
                                    <NewsCard 
                                      article={article} 
                                      language={language} 
                                      variant="briefing" 
                                      onRead={handleArticleRead}
                                    />
                                </div>
                            ))}
                            {briefingArticles.length === 0 && (
                                <p className="text-gray-400 italic text-sm">Briefing unavailable.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN FEED (Desktop: 8 cols) */}
                <div className="lg:col-span-8 pl-0 lg:pl-8 pt-8 lg:pt-0">
                    <h2 className="font-serif text-2xl font-bold border-b border-black pb-2 mb-6">
                        {t.latestNews}
                    </h2>
                    
                    <div className="space-y-10">
                        {feedArticles.map((article, index) => (
                            <NewsCard 
                                key={article.id} 
                                article={article} 
                                language={language} 
                                variant={index === 0 && page === 1 ? 'featured' : 'standard'} 
                                onRead={handleArticleRead}
                            />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button 
                            onClick={loadMoreNews}
                            disabled={isLoadingMore}
                            className="bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black text-brand-black font-sans font-bold text-sm uppercase tracking-widest py-3 px-8 transition-colors disabled:opacity-50"
                        >
                            {isLoadingMore ? t.loading : t.seeMore}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>

      <Footer language={language} setCategory={setActiveCategory} />
    </div>
  );
};

export default App;
