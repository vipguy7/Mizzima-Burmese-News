
import React from 'react';
import { Language, NewsCategory } from '../types';
import { TRANSLATIONS, MIZZIMA_SUBSTACK_URL } from '../constants';

interface FooterProps {
  language: Language;
  setCategory: (cat: NewsCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setCategory }) => {
  const t = TRANSLATIONS[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-black text-white mt-12 border-t-4 border-red-700">
      {/* Subscribe Section */}
      <div className="bg-gray-900 py-10">
        <div className="container mx-auto px-4 text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">{t.subscribe}</h3>
            <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto">{t.subscribeDesc}</p>
            <a 
              href={MIZZIMA_SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-brand-black font-sans font-bold uppercase tracking-widest text-sm py-3 px-8 hover:bg-gray-200 transition-colors"
            >
              {t.subscribeBtn}
            </a>
        </div>
      </div>

      {/* Links & Info */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-1">
            <h4 className={`font-black text-2xl mb-4 ${language === Language.MM ? 'font-serif' : 'font-serif'}`}>
              {t.title}
            </h4>
            <p className="text-gray-500 text-xs leading-relaxed">
               {t.fightDesc}
            </p>
         </div>

         <div className="md:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">{t.categories}</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
                {Object.values(NewsCategory).map((category) => (
                    <li key={category}>
                        <button 
                            onClick={() => {
                                setCategory(category);
                                scrollToTop();
                            }}
                            className="hover:text-red-500 transition-colors text-gray-300 text-left"
                        >
                            {t.nav[category]}
                        </button>
                    </li>
                ))}
            </ul>
         </div>

         <div className="md:col-span-1 flex flex-col items-start md:items-end justify-between">
            <button 
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-sm font-bold hover:text-red-500 transition-colors mb-6 md:mb-0"
            >
                {t.scrollTop}
                <span className="p-2 border border-gray-600 rounded-full group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </span>
            </button>
            <div className="text-[10px] text-gray-600">
                © 2024 Mizzima Reader AI.
            </div>
         </div>
      </div>
    </footer>
  );
};
