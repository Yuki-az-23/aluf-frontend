import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { HeroBanner } from '@/components/commerce/HeroBanner';
import { ServiceCard } from '@/components/commerce/ServiceCard';
import { TierCard } from '@/components/commerce/TierCard';
import { BlogCard } from '@/components/commerce/BlogCard';
import { TabbedProducts } from '@/components/commerce/TabbedProducts';
import { useLang } from '@/i18n';
import { useStoreData } from '@/lib/StoreDataContext';
import { services } from '@/data/services';
import { gamingTiers } from '@/data/tiers';
import { blogPosts } from '@/data/blog';

export function HomePage() {
  const { t } = useLang();
  const { banners } = useStoreData();

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroBanner banners={banners} />

      {/* Services */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => (
              <ServiceCard key={s.titleKey} service={s} />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products — Tabbed by Tag */}
      <section className="py-12">
        <Container>
          <SectionHeader title={t('products.title')} />
          <TabbedProducts />
        </Container>
      </section>

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

      {/* Blog */}
      <section className="py-12">
        <Container>
          <SectionHeader title={t('blog.title')} linkText={t('blog.readMore')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <Container>
          <div className="text-center text-white max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-3">{t('newsletter.title')}</h2>
            <p className="text-white/80 mb-8">{t('newsletter.subtitle')}</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-3 rounded-xl text-text-main text-sm focus:ring-2 focus:ring-white"
              />
              <Button variant="secondary" size="md" className="bg-white text-primary hover:bg-gray-100 shadow-none">
                {t('newsletter.submit')}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
