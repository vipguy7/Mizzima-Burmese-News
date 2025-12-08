

export enum Language {
  EN = 'EN',
  MM = 'MM'
}

export enum NewsCategory {
  TOP_STORIES = 'Top Stories',
  MYANMAR = 'Myanmar',
  WORLD = 'World',
  BUSINESS = 'Business',
  SPORT = 'Sport',
  OPINION = 'Opinion',
  TV = 'TV Channel',
  ENTERTAINMENT = 'Entertainment',
  TECH = 'Science & Tech',
  LIFESTYLE = 'Lifestyle'
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  source: 'Mizzima English' | 'Mizzima Myanmar' | 'Aggregated';
}

export interface NavItem {
  label: string;
  key: NewsCategory;
}

// Gamification Interfaces
export interface UserStats {
  points: number;
  adsWatched: number;
  videosWatched: string[]; // IDs of videos
  articlesRead: string[]; // IDs of articles
}

export interface RankBadge {
  name: string;
  threshold: number;
  icon: string;
  color: string;
}

export interface LeaderboardUser {
  name: string;
  points: number;
  rank: number;
}

export interface Translation {
  title: string;
  loading: string;
  extracting: string;
  readMore: string;
  readLess: string;
  share: string;
  shareSuccess: string;
  nav: Record<NewsCategory, string>;
  footer: string;
  refresh: string;
  heroTitle: string;
  dailyBriefing: string;
  latestNews: string;
  seeMore: string;
  lastUpdated: string;
  editionMm: string;
  editionEn: string;
  // New Additions
  fightTitle: string;
  fightDesc: string;
  points: string;
  rank: string;
  watchAds: string;
  watchAdsDesc: string;
  watchAdsConfirm: string;
  watchVideo: string;
  watchVideoDesc: string;
  leaderboard: string;
  subscribe: string;
  subscribeDesc: string;
  subscribeBtn: string;
  scrollTop: string;
  categories: string;
  support: string;
  adWatching: string;
  adSuccess: string;
  videoTask: string;
  verifyComment: string;
  // Offline
  saveOffline: string;
  saved: string;
  removeFromSaved: string;
}