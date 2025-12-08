
// RSS & Backend Types
export interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    creator?: string;
    content?: string;
    contentSnippet?: string;
    guid?: string;
    categories?: string[];
    isoDate?: string;
    enclosure?: {
        url: string;
        type?: string;
        length?: number;
    };
}

export interface WebPImage {
    url: string;
    width: number;
    height: number;
    isWebP: boolean;
}
