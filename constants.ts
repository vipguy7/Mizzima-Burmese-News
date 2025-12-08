import { Language, NewsCategory, Translation, Article, RankBadge, LeaderboardUser } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  [Language.EN]: {
    title: 'MIZZIMA READER',
    loading: 'Loading content...',
    extracting: 'Aggregating latest news via AI...',
    readMore: 'Continue reading',
    readLess: 'Read Less',
    share: 'Share',
    shareSuccess: 'Link copied!',
    nav: {
      [NewsCategory.TOP_STORIES]: 'Top Stories',
      [NewsCategory.MYANMAR]: 'Myanmar',
      [NewsCategory.WORLD]: 'World',
      [NewsCategory.BUSINESS]: 'Business',
      [NewsCategory.SPORT]: 'Sport',
    },
    footer: '© 2024 Mizzima Reader AI. Designed with New York Times aesthetics.',
    refresh: 'Update News',
    heroTitle: 'Last 12 Hours',
    dailyBriefing: 'Daily News Briefing',
    latestNews: 'Latest News',
    seeMore: 'See More News',
    lastUpdated: 'Last Updated:',
    editionMm: 'Burmese News (မြန်မာသတင်း)',
    editionEn: 'English News',
    // New
    fightTitle: 'Fight with Mizzima',
    fightDesc: 'Support independent journalism without spending money.',
    points: 'Points',
    rank: 'Your Rank',
    watchAds: 'Watch Partner Ads',
    watchAdsDesc: 'Watch a short ad to support our operations.',
    watchAdsConfirm: 'Are you sure you want to watch an ad to support us?',
    watchVideo: 'YouTube Mission',
    watchVideoDesc: 'Watch and comment on trending videos.',
    leaderboard: 'Top Supporters Today',
    subscribe: 'Subscribe to Mizzima',
    subscribeDesc: 'Get exclusive insights delivered to your inbox via Substack.',
    subscribeBtn: 'Subscribe Now',
    scrollTop: 'Back to Top',
    categories: 'Sections',
    support: 'Support Us',
    adWatching: 'Watching Ad...',
    adSuccess: '+50 Points! Thanks for supporting.',
    videoTask: 'Watch on YouTube',
    verifyComment: 'I commented',
    // Offline
    saveOffline: 'Save for Offline',
    saved: 'Saved Offline',
    removeFromSaved: 'Remove from Saved',
  },
  [Language.MM]: {
    title: 'မဇ္ဈိမ သတင်း',
    loading: 'အချက်အလက်များ ရယူနေပါသည်...',
    extracting: 'AI စနစ်ဖြင့် နောက်ဆုံးရ သတင်းများကို ရှာဖွေနေပါသည်...',
    readMore: 'ဆက်လက်ဖတ်ရှုရန်',
    readLess: 'ပြန်လည်ချုံ့ရန်',
    share: 'မျှဝေမည်',
    shareSuccess: 'လင့်ခ်ကို ကူးယူပြီးပါပြီ',
    nav: {
      [NewsCategory.TOP_STORIES]: 'အထူးသတင်း',
      [NewsCategory.MYANMAR]: 'မြန်မာ',
      [NewsCategory.WORLD]: 'ကမ္ဘာ',
      [NewsCategory.BUSINESS]: 'စီးပွားရေး',
      [NewsCategory.SPORT]: 'အားကစား',
    },
    footer: '© ၂၀၂၄ မဇ္ဈိမ Reader AI.',
    refresh: 'သတင်းမွမ်းမံရန်',
    heroTitle: 'လွန်ခဲ့သော ၁၂ နာရီ',
    dailyBriefing: 'နေ့စဉ် သတင်းအကျဉ်းချုပ်',
    latestNews: 'နောက်ဆုံးရ သတင်းများ',
    seeMore: 'နောက်ထပ် သတင်းများ ကြည့်ရန်',
    lastUpdated: 'နောက်ဆုံးမွမ်းမံမှု -',
    editionMm: 'မြန်မာသတင်း',
    editionEn: 'English News',
    // New
    fightTitle: 'မဇ္ဈိမနှင့်အတူ ရပ်တည်မည်',
    fightDesc: 'ငွေကြေးကုန်ကျမှုမရှိဘဲ လွတ်လပ်သော သတင်းမီဒီယာကို ကူညီနိုင်ပါသည်။',
    points: 'ရမှတ်များ',
    rank: 'သင့်အဆင့်',
    watchAds: 'ကြော်ငြာကြည့်ရန်',
    watchAdsDesc: 'လုပ်ငန်းလည်ပတ်မှုအတွက် ကြော်ငြာတိုများ ကြည့်ရှုပေးပါ။',
    watchAdsConfirm: 'မဇ္ဈိမကို ကူညီရန် ကြော်ငြာကြည့်မည်မှာ သေချာပါသလား?',
    watchVideo: 'YouTube မစ်ရှင်',
    watchVideoDesc: 'ဗီဒီယိုကြည့်ပြီး မှတ်ချက်ရေးသား အားပေးပါ။',
    leaderboard: 'ယနေ့ ထိပ်တန်း အားပေးသူများ',
    subscribe: 'မဇ္ဈိမ ကို Subscribe လုပ်ပါ',
    subscribeDesc: 'အထူး သတင်းဆောင်းပါးများကို Substack မှတဆင့် ရယူပါ။',
    subscribeBtn: 'စာရင်းသွင်းမည်',
    scrollTop: 'ထိပ်ဆုံးသို့',
    categories: 'ကဏ္ဍများ',
    support: 'ကူညီရန်',
    adWatching: 'ကြော်ငြာ ကြည့်ရှုနေပါသည်...',
    adSuccess: '+၅၀ မှတ် ရရှိပါသည်။ ကျေးဇူးတင်ပါသည်။',
    videoTask: 'YouTube တွင်ကြည့်မည်',
    verifyComment: 'မှတ်ချက်ရေးပြီးပြီ',
    // Offline
    saveOffline: 'သိမ်းဆည်းမည်',
    saved: 'သိမ်းဆည်းပြီး',
    removeFromSaved: 'ဖယ်ရှားမည်',
  }
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Welcome to Mizzima Reader AI',
    summary: 'Select an Edition above to start aggregating real-time simulations of current events from Mizzima websites.',
    fullContent: 'This application demonstrates a high-fidelity Newspaper UI. It uses the Gemini API to simulate a content extraction system. By selecting "English News", the system simulates extracting content from eng.mizzima.com. By selecting "မြန်မာသတင်း", it simulates extracting from bur.mizzima.com.',
    category: 'System',
    author: 'System',
    publishedAt: new Date().toLocaleDateString(),
    imageUrl: 'https://picsum.photos/800/400',
    source: 'Aggregated'
  }
];

export const BADGES: RankBadge[] = [
  { name: 'Reader', threshold: 0, icon: '📰', color: 'bg-gray-100 text-gray-600' },
  { name: 'Supporter', threshold: 100, icon: '🥉', color: 'bg-orange-100 text-orange-800' },
  { name: 'Defender', threshold: 500, icon: '🥈', color: 'bg-gray-200 text-gray-800' },
  { name: 'Champion', threshold: 1000, icon: '🥇', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Hero', threshold: 2500, icon: '💎', color: 'bg-blue-100 text-blue-800' },
];

export const MIZZIMA_SUBSTACK_URL = 'https://mizzimadailynews.substack.com/subscribe?utm_source=menu&simple=true&next=https%3A%2F%2Fmizzimadailynews.substack.com%2Fs%2Fmizzima-podcast';

export const YOUTUBE_TASKS = [
  { id: 'yt1', title: 'Daily News Recap: Major Updates', views: '20K' },
  { id: 'yt2', title: 'Special Report: Economic Impact', views: '15K' },
  { id: 'yt3', title: 'Interview with Local Leaders', views: '32K' },
  { id: 'yt4', title: 'Documentary: Voices from the Ground', views: '50K' },
  { id: 'yt5', title: 'Weekly Sports Highlights', views: '10K' },
];

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'Aung Kyaw', points: 4500 },
  { rank: 2, name: 'Su Su', points: 3200 },
  { rank: 3, name: 'Min Htet', points: 2800 },
  { rank: 4, name: 'Thida', points: 2100 },
  { rank: 5, name: 'Kyaw Zwa', points: 1950 },
];