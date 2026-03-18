import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ServiceCard } from '@/components/commerce/ServiceCard';
import { TierCard } from '@/components/commerce/TierCard';
import { BlogCard } from '@/components/commerce/BlogCard';
import { useLang } from '@/i18n';
import { useStoreData } from '@/lib/StoreDataContext';
import { services } from '@/data/services';
import { gamingTiers } from '@/data/tiers';
import { blogPosts } from '@/data/blog';

export function HomePage() {
  const { t } = useLang();
  const { products: featuredProducts } = useStoreData();

  return (
    <>
      {/* Hero */}
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

      {/* Featured Products */}
      <section className="py-12">
        <Container>
          <SectionHeader title={t('products.title')} linkText={t('products.viewAll')} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
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
