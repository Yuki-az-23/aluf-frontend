import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { HeroBanner } from '@/components/commerce/HeroBanner';
import { TierCard } from '@/components/commerce/TierCard';
import { BlogCard } from '@/components/commerce/BlogCard';
import { TabbedProducts } from '@/components/commerce/TabbedProducts';
import { useLang } from '@/i18n';
import { useStoreData } from '@/lib/StoreDataContext';
import { usePCBuilder } from '@/lib/PCBuilderContext';
import { sendLead, LEAD_SOURCES, type LeadSource } from '@/lib/leads';
import { gamingTiers } from '@/data/tiers';
import { cn } from '@/lib/cn';

// ── Contact form service chips ─────────────────────────────────────────────
const PERSONAL_SERVICES: { icon: string; labelKey: string; source: LeadSource }[] = [
  { icon: 'build',          labelKey: 'contact.service.lab',      source: LEAD_SOURCES.LAB_SERVICE   },
  { icon: 'sports_esports', labelKey: 'contact.service.gaming',   source: LEAD_SOURCES.GAMING_PC     },
  { icon: 'support_agent',  labelKey: 'contact.service.consult',  source: LEAD_SOURCES.CONSULTATION  },
  { icon: 'shopping_cart',  labelKey: 'contact.service.order',    source: LEAD_SOURCES.ORDER_SUPPORT  },
];

const BUSINESS_SERVICES: { icon: string; labelKey: string; source: LeadSource }[] = [
  { icon: 'business',       labelKey: 'contact.service.business', source: LEAD_SOURCES.BUSINESS  },
  { icon: 'inventory_2',    labelKey: 'contact.service.bulk',     source: LEAD_SOURCES.BULK_ORDER },
];

export function HomePage() {
  const { t } = useLang();
  const { banners, blogPosts } = useStoreData();
  const { open: openPcBuilder } = usePCBuilder();

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

  // ── Contact / ticket state ───────────────────────────────────────────────
  const [ctName, setCtName] = useState('');
  const [ctPhone, setCtPhone] = useState('');
  const [ctEmail, setCtEmail] = useState('');
  const [ctMessage, setCtMessage] = useState('');
  const [ctService, setCtService] = useState<LeadSource | null>(null);
  const [ctError, setCtError] = useState('');
  const [ctSuccess, setCtSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtError('');
    if (!ctService) { setCtError(t('contact.errorService')); return; }
    if (!ctName.trim()) { setCtError(t('newsletter.errorName')); return; }
    if (!/^[\d\s\-+()]{7,15}$/.test(ctPhone)) { setCtError(t('newsletter.errorPhone')); return; }
    sendLead({ name: ctName.trim(), phone: ctPhone.trim(), email: ctEmail.trim(), message: ctMessage.trim(), source: ctService })
      .then(() => setCtSuccess(true)).catch(() => setCtSuccess(true));
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

      {/* Newsletter + Contact — two columns */}
      <section className="py-16 bg-card-bg border-t border-border-light">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── Left: Newsletter ── */}
            <div>
              <h2 className="text-2xl font-black text-text-main mb-1">{t('newsletter.title')}</h2>
              <p className="text-text-muted text-sm mb-6">{t('newsletter.subtitle')}</p>
              {nlSuccess ? (
                <p className="text-primary font-bold">{t('newsletter.success')}</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col gap-3">
                  <input type="text" value={nlName} onChange={e => setNlName(e.target.value)}
                    placeholder={t('newsletter.namePlaceholder')}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  <input type="tel" value={nlPhone} onChange={e => setNlPhone(e.target.value)}
                    placeholder={t('newsletter.phonePlaceholder')} dir="ltr"
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  {nlError && <p className="text-red-500 text-xs">{nlError}</p>}
                  <Button variant="primary" size="md" className="w-full">{t('newsletter.submit')}</Button>
                </form>
              )}
            </div>

            {/* ── Right: Contact / Ticket ── */}
            <div>
              <h2 className="text-2xl font-black text-text-main mb-1">{t('contact.title')}</h2>
              <p className="text-text-muted text-sm mb-4">{t('contact.subtitle')}</p>

              {ctSuccess ? (
                <p className="text-primary font-bold">{t('contact.success')}</p>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="flex flex-col gap-3">

                  {/* Personal services */}
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('contact.personal')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PERSONAL_SERVICES.map(svc => (
                      <button key={svc.source.placement} type="button"
                        onClick={() => setCtService(svc.source)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all',
                          ctService?.placement === svc.source.placement
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-light bg-input-bg text-text-muted hover:border-primary hover:text-primary',
                        )}>
                        <Icon name={svc.icon} className="text-base flex-shrink-0" />
                        <span className="leading-tight text-start">{t(svc.labelKey)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Business services */}
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{t('contact.business')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_SERVICES.map(svc => (
                      <button key={svc.source.placement} type="button"
                        onClick={() => setCtService(svc.source)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all',
                          ctService?.placement === svc.source.placement
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-light bg-input-bg text-text-muted hover:border-primary hover:text-primary',
                        )}>
                        <Icon name={svc.icon} className="text-base flex-shrink-0" />
                        <span className="leading-tight text-start">{t(svc.labelKey)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <input type="text" value={ctName} onChange={e => setCtName(e.target.value)}
                      placeholder={t('newsletter.namePlaceholder')}
                      className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                    <input type="tel" value={ctPhone} onChange={e => setCtPhone(e.target.value)}
                      placeholder={t('newsletter.phonePlaceholder')} dir="ltr"
                      className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  </div>
                  <input type="email" value={ctEmail} onChange={e => setCtEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg" />
                  <textarea value={ctMessage} onChange={e => setCtMessage(e.target.value)}
                    placeholder={t('contact.messagePlaceholder')} rows={3}
                    className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg resize-none" />
                  {ctError && <p className="text-red-500 text-xs">{ctError}</p>}
                  <Button variant="primary" size="md" className="w-full">{t('contact.submit')}</Button>
                </form>
              )}
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}
