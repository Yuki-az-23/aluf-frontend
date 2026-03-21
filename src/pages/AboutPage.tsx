import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const MAPS_LINK  = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('אלוף המחשבים הרצל 102 ראשון לציון');
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.9895786435923!2d34.80514595994381!3d31.96117942533949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b4393971eb43%3A0xd5c1850ae56401!2z15TXqNem15wgMTAyLCDXqNeQ16nXldefINec16bXmdeV158!5e0!3m2!1siw!2sil!4v1739104221746!5m2!1siw!2sil';
const logoSrc    = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

const STATS: { key: string; value: string; icon: string }[] = [
  { key: 'years',     value: '20+',    icon: 'history'          },
  { key: 'customers', value: '50,000+', icon: 'people'          },
  { key: 'products',  value: '10,000+', icon: 'inventory_2'     },
];

const VALUES: { key: string; icon: string }[] = [
  { key: 'price',   icon: 'sell'          },
  { key: 'service', icon: 'support_agent' },
  { key: 'expert',  icon: 'verified'      },
  { key: 'lab',     icon: 'handyman'      },
];

export function AboutPage() {
  const { t } = useLang();

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('footer.about') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-4xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
        <img src={logoSrc} alt={t('site.name')} className="h-16 w-auto bg-white p-1.5 rounded-xl shadow-sm" />
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-text-main leading-tight">{t('about.title')}</h1>
          <p className="text-primary font-bold mt-1 text-sm">{t('about.subtitle')}</p>
          <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
        </div>
      </div>

      {/* Description */}
      <p className="text-text-muted leading-relaxed text-sm mb-10 max-w-2xl">
        {t('about.description')}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map(({ key, value, icon }) => (
          <div key={key} className="bg-card-bg border border-border-light rounded-2xl p-5 text-center shadow-sm">
            <Icon name={icon} className="text-primary text-3xl mb-2" />
            <p className="text-2xl font-black text-text-main">{value}</p>
            <p className="text-xs text-text-muted mt-1">{t(`about.stat.${key}`)}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {VALUES.map(({ key, icon }) => (
          <div key={key} className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm flex gap-4">
            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={icon} className="text-primary text-xl" />
            </span>
            <div>
              <h3 className="font-black text-text-main text-sm mb-1">{t(`about.value.${key}.title`)}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{t(`about.value.${key}.body`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
          <Icon name="location_on" className="text-primary" />
          {t('about.location.title')}
        </h2>
        <div className="rounded-2xl overflow-hidden border border-border-light">
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block relative group">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="260"
              style={{ border: 0, display: 'block', pointerEvents: 'none' }}
              loading="lazy"
              title={t('footer.address')}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Icon name="open_in_new" className="text-sm" />
                {t('footer.openMap')}
              </span>
            </div>
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5"><Icon name="location_on" className="text-primary text-base" />{t('footer.address')}</span>
          <span className="flex items-center gap-1.5"><Icon name="schedule" className="text-primary text-base" />{t('footer.hours')}</span>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/contact"
        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors"
      >
        <Icon name="contact_support" className="text-base" />
        {t('about.cta')}
      </a>
    </Container>
  );
}
