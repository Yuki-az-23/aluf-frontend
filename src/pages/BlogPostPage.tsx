import { useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { parseBlogMultilingual, langToKey } from '@/lib/parseBlogMultilingual';
import { TTSPlayer } from '@/components/blog/TTSPlayer';

export function BlogPostPage() {
  const { t, dir, lang } = useLang();
  const { blogPostDetail, breadcrumbs } = useStoreData();

  const { cleanHtml, multilingual } = useMemo(
    () => parseBlogMultilingual(blogPostDetail?.contentHtml ?? ''),
    [blogPostDetail?.contentHtml],
  );

  const langData = lang !== 'he' ? multilingual?.[langToKey(lang)] : undefined;

  const articleText = useMemo(() => {
    if (!blogPostDetail) return '';
    if (langData) {
      const parts = [langData.title, langData.summary, ...langData.key_points];
      return parts.join('. ');
    }
    const bodyText = cleanHtml
      ? cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : '';
    return blogPostDetail.title + '. ' + bodyText;
  }, [langData, cleanHtml, blogPostDetail]);

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
          {langData?.title ?? blogPostDetail.title}
        </h1>

        {blogPostDetail.date && (
          <p className="text-sm text-text-muted mb-6">{blogPostDetail.date}</p>
        )}

        {blogPostDetail.image && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img
              src={blogPostDetail.image}
              alt={langData?.title ?? blogPostDetail.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <TTSPlayer text={articleText} lang={lang} />

        {langData ? (
          <div className="prose prose-lg dark:prose-invert max-w-none text-text-main leading-relaxed">
            <p>{langData.summary}</p>
            {langData.key_points.length > 0 && (
              <ul>
                {langData.key_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          cleanHtml && (
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-text-main leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          )
        )}
      </article>
    </Container>
  );
}
