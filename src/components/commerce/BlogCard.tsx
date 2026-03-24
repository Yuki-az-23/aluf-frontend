import { useLang } from '@/i18n';
import { langToKey } from '@/lib/parseBlogMultilingual';
import type { BlogPostItem } from '@/data/products';

interface BlogCardProps {
  post: BlogPostItem;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { t, dir, lang } = useLang();
  const href = post.href || '/632283-%D7%91%D7%9C%D7%95%D7%92';

  const translated = lang !== 'he' ? post.multilingual?.[langToKey(lang)] : undefined;
  const displayTitle = translated?.title ?? post.title;
  const displayExcerpt = translated?.summary ?? post.excerpt;

  if (featured) {
    return (
      <a href={href}
        className="bg-card-bg rounded-xl border border-border-light overflow-hidden hover:shadow-tech-hover hover:border-primary transition-all group flex flex-col sm:flex-row lg:col-span-2">
        <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden flex-shrink-0">
          <img
            src={post.image}
            alt={displayTitle}
            width={480}
            height={270}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={`flex-1 p-6 flex flex-col justify-center ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white px-2 py-0.5 rounded mb-3 w-fit ms-auto">
            {t('blog.hot')}
          </span>
          <span className="text-xs text-text-muted mb-2">{post.date}</span>
          <h3 className="font-black text-xl text-text-main mb-3 leading-snug">{displayTitle}</h3>
          <p className="text-sm text-text-muted line-clamp-3 mb-4">{displayExcerpt}</p>
          <span className="text-primary font-bold text-sm">{t('blog.readMore')} {dir === 'rtl' ? '←' : '→'}</span>
        </div>
      </a>
    );
  }

  return (
    <a href={href}
      className="bg-card-bg rounded-xl border border-border-light overflow-hidden hover:shadow-tech-hover hover:border-primary transition-all group block">
      <div className="aspect-video overflow-hidden">
        <img
          src={post.image}
          alt={displayTitle}
          width={480}
          height={270}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-5">
        <span className="text-xs text-text-muted">{post.date}</span>
        <h3 className="font-bold text-base text-text-main mt-1 mb-2 line-clamp-2">{displayTitle}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{displayExcerpt}</p>
        <span className="text-primary font-bold text-sm mt-3 inline-block">{t('blog.readMore')} {dir === 'rtl' ? '←' : '→'}</span>
      </div>
    </a>
  );
}
