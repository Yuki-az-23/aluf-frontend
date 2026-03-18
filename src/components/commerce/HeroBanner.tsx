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
  const { t } = useLang();
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
      <section className="bg-gradient-to-br from-header-bg via-purple-900 to-header-bg text-white py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  <Icon name="storefront" />
                  {t('hero.cta.shop')}
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-header-bg">
                  <Icon name="build" />
                  {t('hero.cta.services')}
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Icon name="memory" className="text-[120px] text-primary/60" />
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
            className="block w-full"
          >
            <img
              src={slide.image}
              alt={slide.alt || `Banner ${i + 1}`}
              className="w-full h-auto object-cover"
              loading={i < 2 ? 'eager' : 'lazy'}
            />
          </a>
        ))}
      </Carousel>
    </section>
  );
}
