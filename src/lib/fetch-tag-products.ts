import { parseProductElements } from './konimbo-scraper';
import type { Product } from '@/data/products';

export async function fetchTagProducts(tagPath: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(tagPath, { signal: controller.signal });
    if (!res.ok) return [];
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return parseProductElements(doc, window.location.origin);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
