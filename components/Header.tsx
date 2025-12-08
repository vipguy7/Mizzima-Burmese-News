import React, { useState } from 'react';
import { Language, NewsCategory } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeCategory: NewsCategory;
  setCategory: (cat: NewsCategory) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  language, 
  setLanguage, 
  activeCategory, 
  setCategory,
  onRefresh,
  isLoading
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Cast to any to access the extended properties (editionMm, editionEn)
  const t = TRANSLATIONS[language] as any;
  const dateStr = new Date().toLocaleDateString(language === Language.MM ? 'my-MM' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="flex flex-col bg-white">
      {/* 1. Main Edition Tabs - The Primary Switcher */}
      <div className="bg-brand-gray border-b border-gray-300">
        <div className="container mx-auto px-4 flex">
            {/* English News Tab */}
            <button 
              onClick={() => setLanguage(Language.EN)}
              className={`flex-1 md:flex-none md:w-48 py-3 text-center text-xs md:text-sm uppercase tracking-widest font-bold transition-all border-t-2 ${
                  language === Language.EN 
                  ? 'bg-white text-brand-black border-brand-black shadow-[0_-1px_4px_rgba(0,0,0,0.05)] translate-y-[1px]' 
                  : 'bg-brand-gray text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              English News
            </button>
            
            {/* Burmese News Tab */}
            <button 
              onClick={() => setLanguage(Language.MM)}
              className={`flex-1 md:flex-none md:w-48 py-3 text-center text-xs md:text-sm uppercase tracking-widest font-bold transition-all border-t-2 ${
                  language === Language.MM 
                  ? 'bg-white text-brand-black border-brand-black shadow-[0_-1px_4px_rgba(0,0,0,0.05)] translate-y-[1px]' 
                  : 'bg-brand-gray text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              မြန်မာသတင်း
            </button>
        </div>
      </div>

      {/* 2. Date & Actions */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center text-xs md:text-sm text-gray-600 border-b border-brand-border">
        <div className="font-bold font-sans">{dateStr}</div>
        <div className="flex items-center space-x-4">
           <button 
            onClick={onRefresh}
            disabled={isLoading}
            className={`font-bold hover:text-black transition-colors flex items-center gap-2 ${isLoading ? 'opacity-50' : ''}`}
          >
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            {t.refresh}
          </button>
        </div>
      </div>

      {/* 3. Main Logo Area */}
      <div className="py-6 md:py-8 text-center border-b border-black">
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight text-brand-black mb-2 ${language === Language.MM ? 'font-serif' : 'font-serif'}`}>
          {t.title}
        </h1>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
          {language === Language.MM 
            ? 'bur.mizzima.com မှ သတင်းများ' 
            : 'Independent News from eng.mizzima.com'}
        </p>
      </div>

      {/* 4. Navigation */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-4 border-brand-border shadow-sm font-sans">
        <nav className="container mx-auto px-4">
          {/* Mobile Hamburger */}
          <div className="md:hidden flex justify-between items-center py-3">
             <span className="font-bold text-sm uppercase">{t.nav[activeCategory]}</span>
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
          </div>

          {/* Desktop Nav */}
          <ul className={`md:flex md:justify-center md:space-x-8 md:py-3 text-sm font-bold tracking-wide transition-all ${isMenuOpen ? 'block pb-4' : 'hidden'}`}>
            {Object.values(NewsCategory).map((category) => (
              <li key={category} className="border-b md:border-none border-gray-100 last:border-none">
                <button
                  onClick={() => {
                    setCategory(category);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left md:inline-block md:w-auto py-3 md:py-0 px-2 transition-colors ${
                    activeCategory === category 
                      ? 'text-black border-b-2 border-black md:pb-1' 
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {t.nav[category]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};