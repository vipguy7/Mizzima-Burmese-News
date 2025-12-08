import { GoogleGenAI, Type } from "@google/genai";
import { Article, Language, NewsCategory } from '../types';

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to format date
const formatDate = (lang: Language) => 
  new Date().toLocaleDateString(lang === Language.MM ? 'my-MM' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const getSourceConfig = (language: Language) => {
  if (language === Language.MM) {
    return {
      // Specific Burmese Category URL
      url: 'https://bur.mizzima.com/category/သတင်း/မြန်မာသတင်း',
      root: 'https://bur.mizzima.com',
      name: 'Mizzima Burmese (မြန်မာသတင်း)',
      langName: 'Burmese (Myanmar)'
    };
  }
  return {
    // English Root URL
    url: 'https://eng.mizzima.com',
    root: 'https://eng.mizzima.com',
    name: 'Mizzima English',
    langName: 'English'
  };
};

export const fetchHeroSummary = async (language: Language): Promise<string> => {
  const ai = getClient();
  const source = getSourceConfig(language);
  
  const prompt = `
    Role: You are an intelligent news extraction system for ${source.name}.
    Task: Analyze the simulated content strictly from this URL: ${source.url} for the last 12 hours.
    Output: A concise summary of the most critical developing story found on that page.
    Language: ${source.langName}.
    Constraints: 
    - Text only.
    - 2-3 sentences.
    - Tone: Urgent, journalistic, objective.
    - If specific news is not found, generate a plausible summary typical of current events in Myanmar based on your training data, but strictly formatted as if extracted from ${source.url}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No summary available at this time.";
  } catch (error) {
    console.error("Hero Summary Error:", error);
    return "Unable to generate summary.";
  }
};

export const fetchDailyBriefing = async (language: Language): Promise<Article[]> => {
  const ai = getClient();
  const source = getSourceConfig(language);
  
  const prompt = `
    Role: You are an intelligent news extraction system for ${source.name}.
    Task: Extract and summarize 10 key headlines for a "Daily News Briefing" from ${source.url}.
    Language: ${source.langName}.
    Format: JSON Array.
    
    Item Requirements:
    - title: Headline in ${source.langName}.
    - summary: 1 sentence overview.
    - fullContent: 3-4 detailed sentences expanding on the story, written in ${source.langName}.
    - category: Politics, Local News, or Economy.
    - author: "Mizzima News"
    
    Tone: Formal, newspaper style.
    Content Source: Simulate extraction strictly from ${source.url}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ['title', 'summary', 'fullContent', 'author', 'category']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((item: any, index: number) => ({
      id: `briefing-${Date.now()}-${index}`,
      title: item.title,
      summary: item.summary,
      fullContent: item.fullContent,
      category: item.category || 'Briefing',
      author: item.author || 'Mizzima Desk',
      publishedAt: formatDate(language),
      imageUrl: `https://picsum.photos/seed/briefing${index}/200/200`,
      source: language === Language.MM ? 'Mizzima Myanmar' : 'Mizzima English'
    }));

  } catch (error) {
    console.error("Briefing Error:", error);
    return [];
  }
};

export const fetchNewsFeed = async (language: Language, category: NewsCategory, page: number): Promise<Article[]> => {
  const ai = getClient();
  const source = getSourceConfig(language);
  const count = 5;
  
  const prompt = `
    Role: You are an intelligent news extraction system for ${source.name}.
    Source URL: ${source.url}
    Task: Generate ${count} full news articles for the "${category}" section.
    Page/Batch: ${page}.
    Language: ${source.langName}.
    
    Content Requirements:
    - Simulate extracting distinct articles found on ${source.url} or ${source.root}.
    - 'fullContent' must be substantive (at least 3 paragraphs).
    - 'imageKeyword' should be a single English word describing the image (e.g., "Yangon", "Parliament", "Soldier", "Protest", "Map").
    
    Format: JSON Array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              imageKeyword: { type: Type.STRING }
            },
            required: ['title', 'summary', 'fullContent', 'author', 'category', 'imageKeyword']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((item: any, index: number) => ({
      id: `feed-${page}-${Date.now()}-${index}`,
      title: item.title,
      summary: item.summary,
      fullContent: item.fullContent,
      category: item.category,
      author: item.author || 'Mizzima Staff',
      publishedAt: formatDate(language),
      imageUrl: `https://picsum.photos/seed/${item.imageKeyword || 'news'}/800/600`,
      source: language === Language.MM ? 'Mizzima Myanmar' : 'Mizzima English'
    }));

  } catch (error) {
    console.error("Feed Error:", error);
    return [];
  }
};