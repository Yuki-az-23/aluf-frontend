import { useState, useEffect } from 'react';
import type { BlogPostItem } from '@/data/products';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { HeroBanner } from '@/components/commerce/HeroBanner';
import { TierCard } from '@/components/commerce/TierCard';
import { BlogCard } from '@/components/commerce/BlogCard';
import { TabbedProducts } from '@/components/commerce/TabbedProducts';
import { useLang } from '@/i18n';
import { useStoreData } from '@/lib/StoreDataContext';
import { usePCBuilder } from '@/lib/PCBuilderContext';
import { sendLead, LEAD_SOURCES } from '@/lib/leads';
import { gamingTiers } from '@/data/tiers';


const BLOG_URL = '/632283-%D7%91%D7%9C%D7%95%D7%92?order=down_created_at';

function parseBlogPosts(html: string): BlogPostItem[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('.layout_list_item.item');
  const posts: BlogPostItem[] = [];
  items.forEach((el, idx) => {
    const titleEl = el.querySelector('h4.title, .title, h3, h4');
    const title = titleEl?.textContent?.trim() || '';
    if (!title) return;
    const imgEl = el.querySelector('img');
    const rawSrc = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
    const image = rawSrc.startsWith('http') ? rawSrc : (rawSrc ? window.location.origin + rawSrc : '');
    const dateEl = el.querySelector('.date, .item_date, .created_at');
    const date = dateEl?.textContent?.trim() || '';
    const excerptEl = el.querySelector('.description, .item_description, .excerpt');
    const excerpt = excerptEl?.textContent?.trim() || '';
    const linkEl = el.querySelector('a');
    const rawHref = linkEl?.getAttribute('href') || '';
    const href = rawHref.startsWith('http') ? new URL(rawHref).pathname : (rawHref || BLOG_URL);
    posts.push({ id: String(idx), title, image, excerpt, date, href });
  });
  return posts;
}

export function HomePage() {
  const { t } = useLang();
  const { banners } = useStoreData();
  const { open: openPcBuilder } = usePCBuilder();

  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);

  useEffect(() => {
    fetch(BLOG_URL)
      .then(r => r.text())
      .then(html => setBlogPosts(parseBlogPosts(html)))
      .catch(() => {});
  }, []);

  // ── Newsletter state ────────────────────────────────────────────────────
  const [nlName, setNlName] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [nlPhone, setNlPhone] = useState('');
  const [nlError, setNlError] = useState('');
  const [nlSuccess, setNlSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNlError('');
    if (!nlName.trim()) { setNlError(t('newsletter.errorName')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail)) { setNlError(t('newsletter.errorEmail')); return; }
    if (nlPhone && !/^[\d\s\-+()]{7,15}$/.test(nlPhone)) { setNlError(t('newsletter.errorPhone')); return; }
    sendLead({ name: nlName.trim(), phone: nlPhone.trim(), email: nlEmail.trim(), source: LEAD_SOURCES.NEWSLETTER })
      .then(() => setNlSuccess(true)).catch(() => setNlSuccess(true));
  };


  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroBanner banners={banners} />

      {/* Featured Products — Tabbed by Tag */}
      <section className="py-12">
        <Container>
          <SectionHeader title={t('products.title')} />
          <TabbedProducts />
        </Container>
      </section>

      {/* PC Builder CTA */}
      <div className="mx-4 md:mx-0 mb-2 mt-2 md:mt-0 rounded-xl md:rounded-none overflow-hidden border border-primary/30 md:border-x-0 md:border-y bg-gradient-to-l from-gray-900 to-primary/20">
        <Container>
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl hidden sm:block">🖥️</span>
              <div>
                <p className="font-black text-base text-white leading-tight">בנה מחשב מותאם אישית</p>
                <p className="text-xs text-white/70 mt-0.5">בחר רכיבים ובנה את המחשב שלך בדיוק לפי הצרכים שלך</p>
              </div>
            </div>
            <button
              className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-lg"
              onClick={openPcBuilder}
            >
              בנה עכשיו ←
            </button>
          </div>
        </Container>
      </div>


      {/* Gaming Tiers */}
      <section className="py-12">
        <Container>
          <SectionHeader title={t('tiers.title')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gamingTiers.map(tier => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </Container>
      </section>

      {/* Blog — fetched from the blog listing page */}
      {blogPosts.length > 0 && (
        <section className="py-12">
          <Container>
            <SectionHeader title={t('blog.title')} linkText={t('blog.readMore')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(0, 6).map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-card-bg border-t border-border-light">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-black text-text-main mb-1">{t('newsletter.title')}</h2>
            <p className="text-text-muted text-sm mb-6">{t('newsletter.subtitle')}</p>
            {nlSuccess ? (
              <p className="text-primary font-bold">{t('newsletter.success')}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input type="text" value={nlName} onChange={e => setNlName(e.target.value)}
                    placeholder={t('newsletter.namePlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                </div>
                <div className="flex gap-3">
                  <input type="tel" value={nlPhone} onChange={e => setNlPhone(e.target.value)}
                    placeholder={t('newsletter.phonePlaceholder')} dir="ltr"
                    className="flex-1 px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  <Button variant="primary" size="md" className="flex-shrink-0">{t('newsletter.submit')}</Button>
                </div>
                {nlError && <p className="text-red-500 text-xs text-start">{nlError}</p>}
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
