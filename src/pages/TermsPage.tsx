import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const LAST_UPDATED  = '01/01/2026';
const STORE_EMAIL   = 'sales@aluf.co.il';
const SECTION_KEYS  = ['s1','s2','s3','s4','s5','s6','s7','s8','s9'] as const;

export function TermsPage() {
  const { t } = useLang();

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('terms.breadcrumb') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-3xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <Icon name="description" className="text-sm" />
          <span>{t('terms.updated')}: {LAST_UPDATED}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-text-main font-display leading-tight">
          {t('terms.title')}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {SECTION_KEYS.map((key, i) => (
          <section key={key} className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2.5 text-lg font-black text-text-main mb-3">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {t(`terms.${key}.title`)}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">
              {t(`terms.${key}.body`)}
            </p>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <Icon name="info" className="text-primary text-xl shrink-0 mt-0.5" />
        <p className="text-sm text-text-muted leading-relaxed">
          {t('terms.footerNote')}
          <a href={`mailto:${STORE_EMAIL}`} className="text-primary font-semibold hover:underline">
            {STORE_EMAIL}
          </a>
        </p>
      </div>
    </Container>
  );
}
