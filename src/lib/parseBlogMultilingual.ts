import type { MultilingualBlogData } from '@/data/products';

export function parseBlogMultilingual(html: string): {
  cleanHtml: string;
  multilingual: MultilingualBlogData | null;
} {
  const match = html.match(/<div[^>]*id=["']multilingual_context["'][^>]*>([\s\S]*?)<\/div>/);
  if (!match) return { cleanHtml: html, multilingual: null };

  const cleanHtml = html.replace(match[0], '').trim();
  try {
    const multilingual = JSON.parse(match[1].trim()) as MultilingualBlogData;
    return { cleanHtml, multilingual };
  } catch {
    return { cleanHtml, multilingual: null };
  }
}

export function langToKey(lang: string): keyof MultilingualBlogData {
  const map: Record<string, keyof MultilingualBlogData> = { he: 'heb', en: 'eng', ru: 'rus' };
  return map[lang] ?? 'heb';
}
