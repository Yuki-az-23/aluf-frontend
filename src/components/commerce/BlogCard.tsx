import { useLang } from '@/i18n';
import type { BlogPost } from '@/data/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { t } = useLang();
  return (
    <a href={post.href || 'https://alufshop.konimbo.co.il/632283-%D7%91%D7%9C%D7%95%D7%92'} className="bg-card-bg rounded-xl border border-border-light overflow-hidden hover:shadow-tech-hover hover:border-primary transition-all group block">
      <div className="aspect-video overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <span className="text-xs text-text-muted">{post.date}</span>
        <h3 className="font-bold text-base text-text-main mt-1 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{post.excerpt}</p>
        <span className="text-primary font-bold text-sm mt-3 inline-block">{t('blog.readMore')} &larr;</span>
      </div>
    </a>
  );
}
