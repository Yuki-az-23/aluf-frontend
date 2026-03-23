import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

export function BlogPostPage() {
  const { t, dir } = useLang();
  const { blogPostDetail, breadcrumbs } = useStoreData();

  if (!blogPostDetail) {
    return (
      <Container className="py-16">
        <p className="text-center text-text-muted">{t('products.empty')}</p>
      </Container>
    );
  }

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [
        { label: t('breadcrumb.home'), href: '/' },
        { label: t('blog.title'), href: '/632283-%D7%91%D7%9C%D7%95%D7%92' },
        { label: blogPostDetail.title },
      ];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-6" />

      <article dir={dir} className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-black text-text-main mb-4">
          {blogPostDetail.title}
        </h1>

        {blogPostDetail.date && (
          <p className="text-sm text-text-muted mb-6">{blogPostDetail.date}</p>
        )}

        {blogPostDetail.image && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img
              src={blogPostDetail.image}
              alt={blogPostDetail.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {blogPostDetail.contentHtml && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-text-main leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blogPostDetail.contentHtml }}
          />
        )}
      </article>
    </Container>
  );
}
