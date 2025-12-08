import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Language, UserStats, RankBadge } from '../types';
import { TRANSLATIONS, BADGES, YOUTUBE_TASKS, LEADERBOARD_DATA } from '../constants';

// Constants
const AD_POINTS_REWARD = 50;
const VIDEO_POINTS_REWARD = 100;
const MAX_DAILY_ADS = 5;
const AD_DURATION_SECONDS = 5;

interface FightSectionProps {
  language: Language;
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

type TabType = 'ads' | 'video' | 'ranking';

// Toast Component for better UX
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in z-50">
    <div className="flex items-center gap-2">
      <span className="text-lg">✓</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white text-xl leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  </div>
);

// Tab Button Component
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  ariaControls: string;
}> = ({ active, onClick, label, ariaControls }) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={active}
    aria-controls={ariaControls}
    className={`flex-1 py-3 px-4 text-center uppercase tracking-wider hover:bg-gray-800 transition-colors min-h-[44px] touch-manipulation ${active ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500'
      }`}
  >
    {label}
  </button>
);

// Badge Display Component
const BadgeDisplay: React.FC<{ badge: RankBadge }> = ({ badge }) => (
  <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${badge.color}`}>
    <span aria-hidden="true">{badge.icon}</span> {badge.name}
  </div>
);

export const FightSection: React.FC<FightSectionProps> = React.memo(
  ({ language, userStats, onUpdateStats }) => {
    const t = TRANSLATIONS[language];
    const [activeTab, setActiveTab] = useState<TabType>('ads');
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [adTimer, setAdTimer] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Memoized calculations for performance
    const currentBadge = useMemo(
      () => BADGES.slice().reverse().find(b => userStats.points >= b.threshold) || BADGES[0],
      [userStats.points]
    );

    const nextBadge = useMemo(
      () => BADGES.find(b => b.threshold > userStats.points),
      [userStats.points]
    );

    const progressPercent = useMemo(() => {
      if (!nextBadge) return 100;
      return Math.min(
        100,
        ((userStats.points - currentBadge.threshold) / (nextBadge.threshold - currentBadge.threshold)) * 100
      );
    }, [userStats.points, currentBadge, nextBadge]);

    // Show toast notification
    const showNotification = useCallback((message: string) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, []);

    // Ad watching logic - Fixed dependency array
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
          points: userStats.points + AD_POINTS_REWARD,
          adsWatched: userStats.adsWatched + 1
        });
        showNotification(t.adSuccess);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isWatchingAd, adTimer]); // Removed userStats from dependencies

    const handleWatchAd = useCallback(() => {
      // Validation
      if (userStats.adsWatched >= MAX_DAILY_ADS) {
        showNotification('Daily ad limit reached!');
        return;
      }

      if (isWatchingAd) {
        console.warn('Ad already in progress');
        return;
      }

      setIsWatchingAd(true);
      setAdTimer(AD_DURATION_SECONDS);
    }, [userStats.adsWatched, isWatchingAd, showNotification]);

    const handleVideoAction = useCallback(async (videoId: string) => {
      if (isProcessing || userStats.videosWatched.includes(videoId)) return;

      setIsProcessing(true);

      try {
        // Better confirmation with more context
        const video = YOUTUBE_TASKS.find(v => v.id === videoId);
        const shouldProceed = window.confirm(
          `${t.videoTask}?\n\n` +
          `Video: ${video?.title}\n\n` +
          `This will open YouTube in a new tab. After watching and commenting, ` +
          `come back to claim your ${VIDEO_POINTS_REWARD} points.`
        );

        if (shouldProceed) {
          // In production, uncomment this to open YouTube
          // window.open(video.url, '_blank', 'noopener,noreferrer');

          onUpdateStats({
            ...userStats,
            points: userStats.points + VIDEO_POINTS_REWARD,
            videosWatched: [...userStats.videosWatched, videoId]
          });

          // Show completion animation
          setRecentlyCompleted(videoId);
          setTimeout(() => setRecentlyCompleted(null), 2000);

          showNotification(`+${VIDEO_POINTS_REWARD} points earned!`);
        }
      } catch (error) {
        console.error('Video action error:', error);
        showNotification('Failed to complete action. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, [isProcessing, userStats, onUpdateStats, showNotification, t.videoTask]);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 rounded-sm shadow-xl mb-8 border border-gray-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-gray-700 pb-3 gap-2">
          <h2 className="font-serif font-bold text-xl text-yellow-500 uppercase tracking-widest">
            {t.fightTitle}
          </h2>
          <BadgeDisplay badge={currentBadge} />
        </div>

        {/* User Stats Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-gray-800 p-4 rounded gap-3">
          <div className="w-full sm:w-auto">
            <div className="text-xs text-gray-400 uppercase tracking-wider">{t.points}</div>
            <div className="text-3xl font-black text-white font-mono">
              {userStats.points.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 w-full sm:ml-4">
            <div className="text-[10px] text-gray-400 flex justify-between mb-1">
              <span>Current Level</span>
              <span>
                {nextBadge
                  ? `${Math.round(progressPercent)}% to ${nextBadge.name}`
                  : 'Max Level!'
                }
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress to next level: ${Math.round(progressPercent)}%`}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 mb-4 italic leading-relaxed opacity-80">
          {t.fightDesc}
        </p>

        {/* Tabs */}
        <div className="flex text-xs font-bold border-b border-gray-700 mb-4" role="tablist">
          <TabButton
            active={activeTab === 'ads'}
            onClick={() => setActiveTab('ads')}
            label="Ads"
            ariaControls="ads-panel"
          />
          <TabButton
            active={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
            label="YouTube"
            ariaControls="video-panel"
          />
          <TabButton
            active={activeTab === 'ranking'}
            onClick={() => setActiveTab('ranking')}
            label="Top 5"
            ariaControls="ranking-panel"
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <div id="ads-panel" role="tabpanel" aria-labelledby="ads-tab" className="space-y-4 text-center py-4">
              <p className="text-xs text-gray-400">{t.watchAdsDesc}</p>
              <div className="p-4 border-2 border-dashed border-gray-600 rounded bg-gray-800/50">
                {isWatchingAd ? (
                  <div className="text-yellow-400 animate-pulse font-mono text-xl" aria-live="polite">
                    {t.adWatching} {adTimer}s
                  </div>
                ) : userStats.adsWatched < MAX_DAILY_ADS ? (
                  <button
                    onClick={handleWatchAd}
                    aria-label={`Watch advertisement. ${userStats.adsWatched} of ${MAX_DAILY_ADS} watched. Earn ${AD_POINTS_REWARD} points.`}
                    className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition active:scale-95 min-h-[44px] touch-manipulation"
                  >
                    ▶ {t.watchAds} ({userStats.adsWatched}/{MAX_DAILY_ADS})
                  </button>
                ) : (
                  <div className="text-green-400 font-bold">
                    ✓ All daily ads watched!
                  </div>
                )}
              </div>
              <div className="text-[10px] text-gray-500">
                Reward: <span className="text-yellow-500 font-bold">+{AD_POINTS_REWARD} Points</span> per ad
              </div>
            </div>
          )}

          {/* Video Tab */}
          {activeTab === 'video' && (
            <div id="video-panel" role="tabpanel" aria-labelledby="video-tab" className="space-y-2">
              <p className="text-xs text-gray-400 mb-2">{t.watchVideoDesc}</p>
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                {YOUTUBE_TASKS.map((video) => {
                  const isCompleted = userStats.videosWatched.includes(video.id);
                  const isRecent = recentlyCompleted === video.id;

                  return (
                    <div
                      key={video.id}
                      className={`p-3 rounded border transition-all duration-300 flex justify-between items-center ${isCompleted
                          ? 'bg-green-900/20 border-green-700'
                          : isRecent
                            ? 'bg-green-500/30 border-green-500 scale-105'
                            : 'bg-gray-800 border-gray-700'
                        }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="text-xs font-bold text-gray-200 line-clamp-1">
                          {video.title}
                        </div>
                        <div className="text-[10px] text-gray-500">{video.views} views</div>
                      </div>
                      {isCompleted ? (
                        <span className="text-green-500 text-lg font-bold" aria-label="Completed">✓</span>
                      ) : (
                        <button
                          onClick={() => handleVideoAction(video.id)}
                          disabled={isProcessing}
                          aria-label={`Watch ${video.title} and earn ${VIDEO_POINTS_REWARD} points`}
                          className="text-[10px] bg-red-600 hover:bg-red-500 active:bg-red-700 px-3 py-2 rounded text-white font-bold uppercase transition min-h-[36px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Watch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-[10px] text-gray-500 mt-2">
                Reward: <span className="text-yellow-500 font-bold">+{VIDEO_POINTS_REWARD} Points</span> per video
              </div>
            </div>
          )}

          {/* Ranking Tab */}
          {activeTab === 'ranking' && (
            <div id="ranking-panel" role="tabpanel" aria-labelledby="ranking-tab" className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">{t.leaderboard}</h3>
              {LEADERBOARD_DATA.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${user.rank === 1
                          ? 'bg-yellow-500 text-black'
                          : user.rank === 2
                            ? 'bg-gray-400 text-black'
                            : user.rank === 3
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-700 text-gray-400'
                        }`}
                      aria-label={`Rank ${user.rank}`}
                    >
                      {user.rank}
                    </div>
                    <div className="text-sm font-bold text-gray-200">{user.name}</div>
                  </div>
                  <div className="font-mono text-yellow-500 text-sm font-bold">
                    {user.points.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-gray-700 text-center">
                <div className="text-[10px] text-gray-500 uppercase">You are currently</div>
                <div className="text-sm font-bold text-white">Not Ranked in Top 5</div>
                <div className="text-xs text-gray-400 mt-1">
                  Keep earning points to climb the leaderboard!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}

        {/* Screen reader live region for point updates */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          You have {userStats.points} points. Current rank: {currentBadge.name}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for React.memo optimization
    return (
      prevProps.language === nextProps.language &&
      prevProps.userStats.points === nextProps.userStats.points &&
      prevProps.userStats.adsWatched === nextProps.userStats.adsWatched &&
      prevProps.userStats.videosWatched.length === nextProps.userStats.videosWatched.length
    );
  }
);

FightSection.displayName = 'FightSection';
