import { useState, useEffect } from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import type { BannerData, BannerSlide } from '@/lib/konimbo-scraper';

interface HeroBannerProps {
  banners: BannerData;
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const { t, dir, lang } = useLang();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const slides: BannerSlide[] = isMobile
    ? (banners.mobile.length ? banners.mobile : banners.desktop)
    : banners.desktop;

  // Fallback: no banner data — show static hero
  if (!slides.length) {
    return (
      <section className="bg-slate-900 dark:bg-header-bg text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />
        <Container className="py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Icon name="verified" className="text-base" />
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className={`flex flex-wrap gap-4 ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                <Button variant="primary" size="lg">
                  <Icon name="storefront" />
                  {t('hero.cta.shop')}
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-header-bg">
                  <Icon name="build" />
                  {t('hero.cta.services')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-8 justify-start">
                {(['hero.trust1', 'hero.trust2', 'hero.trust3'] as const).map(key => (
                  <span key={key} className="flex items-center gap-1.5 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <Icon name="check_circle" className="text-primary text-base" />
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl absolute -inset-8" />
                <div className="relative w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border border-white/10 flex items-center justify-center">
                  <Icon name="memory" className="text-[100px] text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Carousel
        slidesPerView={isMobile ? 1 : 2}
        gap={0}
        autoPlay={4000}
        showArrows
        showDots
      >
        {slides.map((slide, i) => (
          <a
            key={i}
            href={slide.href || '#'}
            className="block w-full relative group"
          >
            <img
              src={slide.image}
              alt={slide.alt || `Banner ${i + 1}`}
              className="w-full h-auto object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding={i === 0 ? 'sync' : 'async'}
            />

          </a>
        ))}
      </Carousel>
    </section>
  );
}
