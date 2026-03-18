import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

// Map category names to Material Symbols icons
const CATEGORY_ICONS: Record<string, string> = {
  'מחשבים': 'computer',
  'חומרת מחשב': 'memory',
  'ציוד היקפי': 'mouse',
  'ציוד רשת': 'router',
  'קונסולות': 'sports_esports',
  'גיימינג': 'stadia_controller',
  'מחשבים ניידים': 'laptop',
  'אחסון': 'storage',
  'מסכים': 'monitor',
  'מעבדים': 'developer_board',
  'לוחות אם': 'dashboard',
  'כרטיסי מסך': 'videocam',
  'זיכרון': 'sd_card',
  'ספקי כח': 'bolt',
};

function getCategoryIcon(name: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return 'category';
}

export function CategoryPage() {
  const { t } = useLang();
  const { categories, breadcrumbs, pageTitle } = useStoreData();

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {pageTitle && (
        <h1 className="text-3xl font-black text-text-main mb-8 text-right">
          {pageTitle}
        </h1>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map(cat => (
          <a
            key={cat.href}
            href={cat.href}
            className="flex flex-col items-center gap-3 p-6 bg-card-bg rounded-xl border border-border-light hover:border-primary hover:shadow-tech-hover transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon name={getCategoryIcon(cat.title)} className="text-3xl text-primary" />
            </div>
            <span className="text-sm font-bold text-text-main text-center">{cat.title}</span>
          </a>
        ))}
      </div>
    </Container>
  );
}
