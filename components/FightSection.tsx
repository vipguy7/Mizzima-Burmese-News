
import React, { useState, useEffect } from 'react';
import { Language, UserStats, RankBadge } from '../types';
import { TRANSLATIONS, BADGES, YOUTUBE_TASKS, LEADERBOARD_DATA } from '../constants';

interface FightSectionProps {
  language: Language;
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const FightSection: React.FC<FightSectionProps> = ({ language, userStats, onUpdateStats }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'ads' | 'video' | 'ranking'>('ads');
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);

  // Calculate Badge
  const currentBadge = BADGES.slice().reverse().find(b => userStats.points >= b.threshold) || BADGES[0];
  
  // Progress to next badge
  const nextBadge = BADGES.find(b => b.threshold > userStats.points);
  const progressPercent = nextBadge 
    ? ((userStats.points - currentBadge.threshold) / (nextBadge.threshold - currentBadge.threshold)) * 100
    : 100;

  const handleWatchAd = () => {
    if (userStats.adsWatched >= 5) return;
    setIsWatchingAd(true);
    setAdTimer(5);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWatchingAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adTimer === 0) {
      setIsWatchingAd(false);
      onUpdateStats({
        ...userStats,
        points: userStats.points + 50,
        adsWatched: userStats.adsWatched + 1
      });
      alert(t.adSuccess);
    }
    return () => clearInterval(interval);
  }, [isWatchingAd, adTimer, userStats, onUpdateStats, t]);

  const handleVideoAction = (videoId: string) => {
    if (userStats.videosWatched.includes(videoId)) return;
    
    // In a real app, this would open YouTube
    // window.open('https://youtube.com/...', '_blank');
    
    const confirm = window.confirm(`${t.videoTask}? \n\n(Simulation: Click OK to confirm you watched and commented)`);
    if (confirm) {
      onUpdateStats({
        ...userStats,
        points: userStats.points + 100,
        videosWatched: [...userStats.videosWatched, videoId]
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 rounded-sm shadow-xl mb-8 border border-gray-700">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h2 className="font-serif font-bold text-xl text-yellow-500 uppercase tracking-widest">{t.fightTitle}</h2>
        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentBadge.color}`}>
          {currentBadge.icon} {currentBadge.name}
        </div>
      </div>

      {/* User Stats Summary */}
      <div className="flex items-center justify-between mb-4 bg-gray-800 p-3 rounded">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{t.points}</div>
          <div className="text-2xl font-black text-white font-mono">{userStats.points.toLocaleString()}</div>
        </div>
        <div className="flex-1 ml-4">
           <div className="text-[10px] text-gray-400 flex justify-between mb-1">
             <span>Current Level</span>
             <span>Next: {nextBadge?.name || 'Max'}</span>
           </div>
           <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
             <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
           </div>
        </div>
      </div>

      <p className="text-xs text-gray-300 mb-4 italic leading-relaxed opacity-80">{t.fightDesc}</p>

      {/* Tabs */}
      <div className="flex text-xs font-bold border-b border-gray-700 mb-4">
        <button 
          onClick={() => setActiveTab('ads')}
          className={`flex-1 py-2 text-center uppercase tracking-wider hover:bg-gray-800 ${activeTab === 'ads' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500'}`}
        >
          Ads
        </button>
        <button 
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-2 text-center uppercase tracking-wider hover:bg-gray-800 ${activeTab === 'video' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500'}`}
        >
          YouTube
        </button>
        <button 
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-2 text-center uppercase tracking-wider hover:bg-gray-800 ${activeTab === 'ranking' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500'}`}
        >
          Top 5
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'ads' && (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-gray-400">{t.watchAdsDesc}</p>
            <div className="p-4 border-2 border-dashed border-gray-600 rounded bg-gray-800/50">
               {isWatchingAd ? (
                 <div className="text-yellow-400 animate-pulse font-mono text-xl">
                   {t.adWatching} {adTimer}s
                 </div>
               ) : userStats.adsWatched < 5 ? (
                 <button 
                   onClick={handleWatchAd}
                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded shadow-lg transform transition active:scale-95"
                 >
                   ▶ {t.watchAds} ({userStats.adsWatched}/5)
                 </button>
               ) : (
                 <div className="text-green-400 font-bold">
                   ✓ All daily ads watched!
                 </div>
               )}
            </div>
            <div className="text-[10px] text-gray-500">
               Reward: <span className="text-yellow-500 font-bold">+50 Points</span> per ad
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-2">
             <p className="text-xs text-gray-400 mb-2">{t.watchVideoDesc}</p>
             <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
               {YOUTUBE_TASKS.map((video) => {
                 const isCompleted = userStats.videosWatched.includes(video.id);
                 return (
                   <div key={video.id} className={`p-2 rounded border border-gray-700 flex justify-between items-center ${isCompleted ? 'bg-green-900/20' : 'bg-gray-800'}`}>
                     <div className="flex-1 pr-2">
                       <div className="text-xs font-bold text-gray-200 line-clamp-1">{video.title}</div>
                       <div className="text-[10px] text-gray-500">{video.views} views</div>
                     </div>
                     {isCompleted ? (
                       <span className="text-green-500 text-xs font-bold">✓</span>
                     ) : (
                       <button 
                         onClick={() => handleVideoAction(video.id)}
                         className="text-[10px] bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-white font-bold uppercase"
                       >
                         Watch
                       </button>
                     )}
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">{t.leaderboard}</h3>
            {LEADERBOARD_DATA.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${user.rank === 1 ? 'bg-yellow-500 text-black' : user.rank === 2 ? 'bg-gray-400 text-black' : user.rank === 3 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {user.rank}
                  </div>
                  <div className="text-sm font-bold text-gray-200">{user.name}</div>
                </div>
                <div className="font-mono text-yellow-500 text-sm font-bold">
                  {user.points.toLocaleString()}
                </div>
              </div>
            ))}
            <div className="mt-4 pt-2 border-t border-gray-700 text-center">
               <div className="text-[10px] text-gray-500 uppercase">You are currently</div>
               <div className="text-sm font-bold text-white">Not Ranked in Top 5</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
