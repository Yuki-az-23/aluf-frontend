import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

export function BlogListPage() {
  const { t } = useLang();
  const { blogPosts, breadcrumbs, pageTitle } = useStoreData();

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || t('blog.title') }];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      <h1 className="text-3xl font-black text-text-main mb-8 text-start">
        {pageTitle || t('blog.title')}
      </h1>

      {blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <a
              key={post.id}
              href={post.href}
              className="bg-card-bg rounded-xl border border-border-light overflow-hidden hover:shadow-tech-hover hover:border-primary transition-all group block"
            >
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                {post.date && (
                  <span className="text-xs text-text-muted">{post.date}</span>
                )}
                <h3 className="font-bold text-base text-text-main mt-1 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
                )}
                <span className="text-primary font-bold text-sm mt-3 inline-block">
                  {t('blog.readMore')} &larr;
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
      )}
    </Container>
  );
}
