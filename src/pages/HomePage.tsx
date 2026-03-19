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

      {/* Newsletter */}
      <section className="py-16 bg-card-bg border-t border-border-light">
        <Container>
          <div className="max-w-3xl mx-auto text-start">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-3xl font-black text-text-main mb-3">{t('newsletter.title')}</h2>
                <p className="text-text-muted">{t('newsletter.subtitle')}</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto md:min-w-[340px]">
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="flex-1 px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
                <Button variant="primary" size="md">
                  {t('newsletter.submit')}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
