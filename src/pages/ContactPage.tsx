import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';
import { sendLead, LEAD_SOURCES, type LeadSource } from '@/lib/leads';

const PHONE     = '053-336-8048';
const PHONE_TEL = 'tel:0533368048';
const EMAIL     = 'sales@aluf.co.il';
const WA_LINK   = 'https://api.whatsapp.com/send?phone=972533368048';

const PERSONAL_SERVICES: { key: string; icon: string; source: LeadSource }[] = [
  { key: 'lab',     icon: 'handyman',        source: LEAD_SOURCES.LAB_SERVICE  },
  { key: 'gaming',  icon: 'sports_esports',  source: LEAD_SOURCES.GAMING_PC    },
  { key: 'consult', icon: 'support_agent',   source: LEAD_SOURCES.CONSULTATION },
  { key: 'order',        icon: 'inventory_2',     source: LEAD_SOURCES.ORDER_SUPPORT },
  { key: 'cancelOrder',  icon: 'cancel',          source: LEAD_SOURCES.CANCEL_ORDER  },
];
const BUSINESS_SERVICES: { key: string; icon: string; source: LeadSource }[] = [
  { key: 'business', icon: 'business',    source: LEAD_SOURCES.BUSINESS   },
  { key: 'bulk',     icon: 'local_shipping', source: LEAD_SOURCES.BULK_ORDER },
];

export function ContactPage() {
  const { t, dir } = useLang();

  const [tab, setTab]         = useState<'personal' | 'business'>('personal');
  const [service, setService] = useState('');
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const services = tab === 'personal' ? PERSONAL_SERVICES : BUSINESS_SERVICES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!service) { setError(t('contact.errorService')); return; }
    if (!name.trim()) { setError(t('newsletter.errorName')); return; }
    if (!/^[\d\s\-+()]{7,15}$/.test(phone)) { setError(t('newsletter.errorPhone')); return; }

    const chosen = services.find(s => s.key === service);
    const source = chosen?.source ?? LEAD_SOURCES.GENERAL;

    setLoading(true);
    sendLead({ name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim(), source })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(true))
      .finally(() => setLoading(false));
  };

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('contact.title') },
  ];

  return (
    <Container className="py-8 lg:py-14">
      <Breadcrumbs items={crumbs} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Contact info sidebar ── */}
        <aside className="lg:w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm">
            <h2 className="font-black text-text-main text-lg mb-5">{t('footer.contact')}</h2>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="location_on" className="text-primary text-xl flex-shrink-0 mt-0.5" />
                <span className="text-text-muted leading-relaxed">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="call" className="text-primary text-xl flex-shrink-0" />
                <a href={PHONE_TEL} className="text-text-muted hover:text-primary transition font-medium" dir="ltr">{PHONE}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="text-primary text-xl flex-shrink-0" />
                <a href={`mailto:${EMAIL}`} className="text-text-muted hover:text-primary transition">{EMAIL}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="schedule" className="text-primary text-xl flex-shrink-0" />
                <span className="text-text-muted">{t('footer.hours')}</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href={PHONE_TEL}
                className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-primary/90 transition-colors"
              >
                <Icon name="call" className="text-base" />
                {t('contact.callNow')}
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-[#20b958] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.197a.75.75 0 00.91.91l5.339-1.479A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 01-4.95-1.355l-.355-.212-3.683 1.02 1.02-3.683-.211-.355A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                {t('contact.whatsapp')}
              </a>
            </div>
          </div>

          {/* Help line card */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center">
            <Icon name="live_help" className="text-primary text-3xl mb-2" />
            <p className="text-sm font-bold text-text-main">{t('contact.helpLine')}</p>
            <a href={PHONE_TEL} className="mt-3 inline-block text-primary font-black text-lg hover:underline" dir="ltr">{PHONE}</a>
          </div>
        </aside>

        {/* ── Contact form ── */}
        <div className="flex-1">
          <h1 className="text-3xl font-black text-text-main mb-1">{t('contact.title')}</h1>
          <p className="text-text-muted text-sm mb-6">{t('contact.subtitle')}</p>

          {success ? (
            <div className="flex items-center gap-3 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 font-bold">
              <Icon name="check_circle" className="text-2xl flex-shrink-0" />
              {t('contact.success')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm space-y-5">

              {/* Personal / Business tabs */}
              <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                {(['personal', 'business'] as const).map(t2 => (
                  <button
                    key={t2}
                    type="button"
                    onClick={() => { setTab(t2); setService(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                      tab === t2 ? 'bg-card-bg shadow-sm text-primary' : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    {t(`contact.${t2}`)}
                  </button>
                ))}
              </div>

              {/* Service topic chips */}
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('contact.subtitle')}</p>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setService(s.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        service === s.key
                          ? 'bg-primary text-white border-primary'
                          : 'bg-card-bg text-text-muted border-border-light hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon name={s.icon} className="text-sm" />
                      {t(`contact.service.${s.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  dir={dir}
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={t('newsletter.namePlaceholder')}
                  className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
                />
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder={t('newsletter.phonePlaceholder')} dir="ltr"
                  className="px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
                />
              </div>
              <input
                dir="ltr"
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
              />
              <textarea
                dir={dir}
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder={t('contact.messagePlaceholder')}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg resize-none"
              />

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <Button variant="primary" size="md" className="w-full" disabled={loading}>
                {loading ? '...' : t('contact.submit')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
