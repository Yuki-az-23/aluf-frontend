import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
  jsonLd?: object | object[];
}

function upsertMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function PageMeta({ title, description, jsonLd }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
  }, [title, description]);

  useEffect(() => {
    const SELECTOR = 'script[type="application/ld+json"][data-aluf-schema]';
    if (!jsonLd) {
      document.querySelector(SELECTOR)?.remove();
      return;
    }
    let el = document.querySelector<HTMLScriptElement>(SELECTOR);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-aluf-schema', '');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(jsonLd);
    return () => { document.querySelector(SELECTOR)?.remove(); };
  }, [jsonLd]);

  return null;
}
