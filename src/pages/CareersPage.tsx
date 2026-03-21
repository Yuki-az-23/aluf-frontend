import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';
import { sendLead, LEAD_SOURCES } from '@/lib/leads';

const JOBS: { key: string; icon: string; type: 'field' | 'office' }[] = [
  { key: 'techField',       icon: 'handyman',        type: 'field'  },
  { key: 'sales',           icon: 'storefront',      type: 'office' },
  { key: 'backOffice',      icon: 'admin_panel_settings', type: 'office' },
  { key: 'customerService', icon: 'support_agent',   type: 'office' },
  { key: 'procurement',     icon: 'inventory_2',     type: 'office' },
  { key: 'automationDev',   icon: 'code',            type: 'office' },
  { key: 'productManager',  icon: 'manage_accounts', type: 'office' },
];

export function CareersPage() {
  const { t } = useLang();

  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [cover, setCover]       = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleApply = (key: string) => {
    setSelected(key);
    setSuccess(false);
    setError('');
    window.scrollTo({ top: document.getElementById('careers-form')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selected) { setError(t('careers.errorJob')); return; }
    if (!name.trim()) { setError(t('newsletter.errorName')); return; }
    if (!/^[\d\s\-+()]{7,15}$/.test(phone)) { setError(t('newsletter.errorPhone')); return; }

    const jobLabel = t(`careers.job.${selected}`);
    const message  = `תפקיד: ${jobLabel}\n\n${cover.trim()}`;

    setLoading(true);
    sendLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message,
      source: LEAD_SOURCES.JOB_APPLICATION,
    })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(true))
      .finally(() => setLoading(false));
  };

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('footer.careers') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-4xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      <h1 className="text-3xl lg:text-4xl font-black text-text-main mb-2">{t('careers.title')}</h1>
      <p className="text-text-muted text-sm mb-10 max-w-2xl leading-relaxed">{t('careers.subtitle')}</p>

      {/* Job cards */}
      <h2 className="text-lg font-black text-text-main mb-4">{t('careers.openPositions')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {JOBS.map(({ key, icon, type }) => (
          <div
            key={key}
            className={`bg-card-bg border rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-colors ${
              selected === key ? 'border-primary' : 'border-border-light'
            }`}
          >
            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={icon} className="text-primary text-xl" />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-text-main text-sm">{t(`careers.job.${key}`)}</h3>
              <p className="text-xs text-text-muted mt-0.5">{t(`careers.type.${type}`)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleApply(key)}
              className="flex-shrink-0 text-xs font-bold text-primary hover:underline"
            >
              {t('careers.apply')}
            </button>
          </div>
        ))}
      </div>

      {/* Application form */}
      <div id="careers-form">
        <h2 className="text-lg font-black text-text-main mb-4">
          {selected
            ? `${t('careers.applyFor')} — ${t(`careers.job.${selected}`)}`
            : t('careers.applyFor')}
        </h2>

        {success ? (
          <div className="flex items-center gap-3 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 font-bold">
            <Icon name="check_circle" className="text-2xl flex-shrink-0" />
            {t('careers.success')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm space-y-4">
            {/* Position selector chips */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('careers.openPositions')}</p>
              <div className="flex flex-wrap gap-2">
                {JOBS.map(({ key }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      selected === key
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card-bg text-text-muted border-border-light hover:border-primary hover:text-primary'
                    }`}
                  >
                    {t(`careers.job.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
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
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg"
            />
            <textarea
              value={cover} onChange={e => setCover(e.target.value)}
              placeholder={t('careers.cover')}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border-light text-text-main text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-input-bg resize-none"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <Button variant="primary" size="md" className="w-full" disabled={loading}>
              {loading ? '...' : t('careers.submit')}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
