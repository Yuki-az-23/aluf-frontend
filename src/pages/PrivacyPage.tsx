import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useLang } from '@/i18n';

const LAST_UPDATED = '01/01/2026';
const STORE_EMAIL  = 'sales@aluf.co.il';

const SECTION_ICONS: Record<string, string> = {
  s1: '🔍', s2: '🎯', s3: '🔒', s4: '🍪',
  s5: '🤝', s6: '✏️', s7: '📅', s8: '📬',
};
const SECTION_KEYS = ['s1','s2','s3','s4','s5','s6','s7','s8'] as const;

export function PrivacyPage() {
  const { t } = useLang();

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('privacy.breadcrumb') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-3xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <span>🔒</span>
          <span>{t('privacy.updated')}: {LAST_UPDATED}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-text-main font-display leading-tight">
          {t('privacy.title')}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
        <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-xl">
          {t('privacy.intro')}
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {SECTION_KEYS.map(key => (
          <section key={key} className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-3 text-base font-black text-text-main mb-3">
              <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                {SECTION_ICONS[key]}
              </span>
              {t(`privacy.${key}.title`)}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">
              {t(`privacy.${key}.body`)}
            </p>
          </section>
        ))}
      </div>

      {/* Law note */}
      <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <span className="text-primary text-xl shrink-0 mt-0.5">⚖️</span>
        <p className="text-sm text-text-muted leading-relaxed">
          {t('privacy.footerNote')}
          <a href={`mailto:${STORE_EMAIL}`} className="text-primary font-semibold hover:underline">
            {STORE_EMAIL}
          </a>
        </p>
      </div>
    </Container>
  );
}
