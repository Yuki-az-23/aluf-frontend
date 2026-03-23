import { useState, useEffect } from 'react';
import type { BlogPostItem } from '@/data/products';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { PageMeta } from '@/components/ui/PageMeta';
import { HeroBanner } from '@/components/commerce/HeroBanner';
import { TierCard } from '@/components/commerce/TierCard';
import { BlogCard } from '@/components/commerce/BlogCard';
import { TabbedProducts } from '@/components/commerce/TabbedProducts';
import { useLang } from '@/i18n';
import { useStoreData } from '@/lib/StoreDataContext';
import { usePCBuilder } from '@/lib/PCBuilderContext';
import { sendLead, LEAD_SOURCES } from '@/lib/leads';
import { gamingTiers } from '@/data/tiers';
import type { TierConfig } from '@/data/tiers';
import { fetchTierProducts } from '@/lib/konimbo-scraper';


const BLOG_URL = '/632283-%D7%91%D7%9C%D7%95%D7%92?order=down_created_at';

const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
    logo: 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png',
  },
];

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
    let image = '';
    if (rawSrc) {
      try {
        const normalized = rawSrc.startsWith('//') ? 'https:' + rawSrc : rawSrc;
        image = new URL(normalized, window.location.origin).href;
      } catch { image = rawSrc; }
    }
    const dateEl = el.querySelector('.date, .item_date, .created_at');
    const date = dateEl?.textContent?.trim() || '';
    const excerptEl = el.querySelector('.description, .item_description, .excerpt');
    const excerpt = excerptEl?.textContent?.trim() || '';
    const linkEl = el.querySelector('a');
    const rawHref = linkEl?.getAttribute('href') || '';
    let href = BLOG_URL;
    if (rawHref) {
      try {
        const normalized = rawHref.startsWith('//') ? 'https:' + rawHref : rawHref;
        href = new URL(normalized, window.location.origin).pathname;
      } catch { href = rawHref; }
    }
    posts.push({ id: String(idx), title, image, excerpt, date, href });
  });
  return posts;
}

export function HomePage() {
  const { t } = useLang();
  const { banners } = useStoreData();
  const { open: openPcBuilder } = usePCBuilder();

  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);

  const TIER_COLORS = ['from-blue-500 to-cyan-400', 'from-primary to-amber-400', 'from-purple-600 to-secondary'] as const;

  useEffect(() => {
    fetchTierProducts('/tags/246816-tier').then(live => {
      if (!live.length) return;
      setTiers(live.map((t, i) => ({
        name: t.title,
        price: t.price,
        specs: t.specs,
        href: t.href,
        color: TIER_COLORS[i] ?? TIER_COLORS[0],
      })));
    }).finally(() => setTiersLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(BLOG_URL)
      .then(r => r.text())
      .then(html => setBlogPosts(parseBlogPosts(html)))
      .catch(() => {})
      .finally(() => setBlogLoading(false));
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
      <PageMeta
        title="אלוף המחשבים | מחשבים, גיימינג, רכיבים ומעבדה מקצועית"
        description="אלוף המחשבים - חנות מחשבים מובילה בישראל. מחשבים, כרטיסי מסך, רכיבים, ציוד גיימינג ושירותי מעבדה מקצועיים. משלוח חינם מ-₪500."
        jsonLd={homeSchema}
      />
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
      <section className="py-4">
        <Container>
          <div className="rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-l from-slate-900 to-primary/20 shadow-tech">
            <div className="flex items-center justify-between px-6 py-5 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl hidden sm:block">🖥️</span>
                <div>
                  <p className="font-black text-base text-white leading-tight">בנה מחשב מותאם אישית</p>
                  <p className="text-xs text-white/70 mt-1">בחר רכיבים ובנה את המחשב שלך בדיוק לפי הצרכים שלך</p>
                </div>
              </div>
              <button
                className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-lg"
                onClick={openPcBuilder}
              >
                בנה עכשיו ←
              </button>
            </div>
          </div>
        </Container>
      </section>


      {/* Gaming Tiers */}
      {(tiersLoading || tiers.length > 0) && (
      <section className="py-12">
        <Container>
          <SectionHeader title={t('tiers.title')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiersLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card-bg rounded-xl border border-border-light overflow-hidden animate-pulse">
                    <div className="h-2 bg-border-light" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 w-2/3 bg-border-light rounded" />
                      <div className="h-8 w-1/2 bg-border-light rounded" />
                      <div className="space-y-2 my-4">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="h-4 bg-border-light rounded" />
                        ))}
                      </div>
                      <div className="h-10 bg-border-light rounded-lg" />
                    </div>
                  </div>
                ))
              : tiers.map(tier => <TierCard key={tier.name} tier={tier} />)
            }
          </div>
        </Container>
      </section>
      )}

      {/* Blog — fetched from the blog listing page */}
      {(blogLoading || blogPosts.length > 0) && (
        <section className="py-12">
          <Container>
            <SectionHeader title={t('blog.title')} linkText={t('blog.readMore')} linkHref={BLOG_URL} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card-bg rounded-xl border border-border-light overflow-hidden animate-pulse">
                      <div className="aspect-video bg-border-light" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 w-1/3 bg-border-light rounded" />
                        <div className="h-5 bg-border-light rounded" />
                        <div className="h-4 w-5/6 bg-border-light rounded" />
                      </div>
                    </div>
                  ))
                : blogPosts.slice(0, 3).map(post => <BlogCard key={post.id} post={post} />)
              }
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
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input type="text" value={nlName} onChange={e => setNlName(e.target.value)}
                    placeholder={t('newsletter.namePlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-primary/50 text-text-main text-sm ring-1 ring-primary/25 hover:ring-2 hover:ring-primary/45 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-input-bg" />
                  <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-primary/50 text-text-main text-sm ring-1 ring-primary/25 hover:ring-2 hover:ring-primary/45 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-input-bg" />
                  <input type="tel" value={nlPhone} onChange={e => setNlPhone(e.target.value)}
                    placeholder={t('newsletter.phonePlaceholder')} dir="ltr"
                    className="flex-1 px-4 py-3 rounded-xl border border-primary/50 text-text-main text-sm ring-1 ring-primary/25 hover:ring-2 hover:ring-primary/45 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-input-bg" />
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
