import { useState } from 'react';
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
import { gamingTiers } from '@/data/tiers';

export function HomePage() {
  const { t } = useLang();
  const { banners, blogPosts } = useStoreData();
  const { open: openPcBuilder } = usePCBuilder();

  // Newsletter form state
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

    const onSuccess = (ev: MessageEvent) => {
      if (ev.data?.type === 'SUBMISSION_SUCCESS') {
        window.removeEventListener('message', onSuccess);
        setNlSuccess(true);
      }
    };
    window.addEventListener('message', onSuccess);

    window.parent.postMessage({
      type: 'FAQ_LEAD_SUBMISSION',
      payload: {
        name: nlName.trim(),
        phone: nlPhone.trim(),
        email: nlEmail.trim(),
        message: 'הרשמה לניוזלטר',
      },
    }, '*');
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

      {/* Blog — shown only when real posts are scraped from Konimbo */}
      {blogPosts.length > 0 && (
        <section className="py-12">
          <Container>
            <SectionHeader title={t('blog.title')} linkText={t('blog.readMore')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(0, 1).map(post => (
                <BlogCard key={post.title} post={post} featured />
              ))}
              {blogPosts.slice(1, 3).map(post => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-card-bg border-t border-border-light">
        <Container>
          <div className="max-w-3xl mx-auto text-start">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-3xl font-black text-text-main mb-3">{t('newsletter.title')}</h2>
                <p className="text-text-muted">{t('newsletter.subtitle')}</p>
              </div>
              {nlSuccess ? (
                <p className="text-primary font-bold text-sm md:min-w-[340px]">{t('newsletter.success')}</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col gap-2 w-full md:w-auto md:min-w-[340px]">
                  <input
                    type="text"
                    value={nlName}
                    onChange={e => setNlName(e.target.value)}
                    placeholder={t('newsletter.namePlaceholder')}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
                  />
                  <input
                    type="email"
                    value={nlEmail}
                    onChange={e => setNlEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
                  />
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      value={nlPhone}
                      onChange={e => setNlPhone(e.target.value)}
                      placeholder={t('newsletter.phonePlaceholder')}
                      className="flex-1 px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
                      dir="ltr"
                    />
                    <Button variant="primary" size="md">
                      {t('newsletter.submit')}
                    </Button>
                  </div>
                  {nlError && <p className="text-red-500 text-xs">{nlError}</p>}
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
