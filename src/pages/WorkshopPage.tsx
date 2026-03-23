import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import { cn } from '@/lib/cn';
import { sendLead, LEAD_SOURCES, type LeadSource } from '@/lib/leads';

const WA_NUM = '972533368048';
const WAZE_URL = 'https://waze.com/ul?ll=31.961256,34.802603&navigate=yes';

const LAB_SERVICES = [
  { icon: 'monitor',                nameKey: 'workshop.svc.screen',     descKey: 'workshop.svc.screen.desc',      value: 'svc.screen' },
  { icon: 'memory',                 nameKey: 'workshop.svc.upgrade',    descKey: 'workshop.svc.upgrade.desc',     value: 'svc.upgrade' },
  { icon: 'ac_unit',                nameKey: 'workshop.svc.cooling',    descKey: 'workshop.svc.cooling.desc',     value: 'svc.cooling' },
  { icon: 'battery_charging_full',  nameKey: 'workshop.svc.battery',    descKey: 'workshop.svc.battery.desc',     value: 'svc.battery' },
  { icon: 'folder_special',         nameKey: 'workshop.svc.recovery',   descKey: 'workshop.svc.recovery.desc',   value: 'svc.recovery' },
  { icon: 'security',               nameKey: 'workshop.svc.virus',      descKey: 'workshop.svc.virus.desc',       value: 'svc.virus' },
  { icon: 'install_desktop',        nameKey: 'workshop.svc.os',         descKey: 'workshop.svc.os.desc',          value: 'svc.os' },
  { icon: 'wifi',                   nameKey: 'workshop.svc.networkSvc', descKey: 'workshop.svc.networkSvc.desc',  value: 'svc.networkSvc' },
];

const BIZ_CARDS = [
  { icon: 'router',        nameKey: 'workshop.biz.network',     descKey: 'workshop.biz.network.desc',     value: 'biz.network' },
  { icon: 'shield',        nameKey: 'workshop.biz.security',    descKey: 'workshop.biz.security.desc',    value: 'biz.security' },
  { icon: 'handyman',      nameKey: 'workshop.biz.maintenance', descKey: 'workshop.biz.maintenance.desc', value: 'biz.maintenance' },
  { icon: 'support_agent', nameKey: 'workshop.biz.consult',     descKey: 'workshop.biz.consult.desc',     value: 'biz.consult' },
];

const HOME_INCLUDES = [
  'workshop.home.inc1',
  'workshop.home.inc2',
  'workshop.home.inc3',
  'workshop.home.inc4',
  'workshop.home.inc5',
];

const CUSTOMER_FAQ = [
  { q: 'workshop.faq.q1', a: 'workshop.faq.a1' },
  { q: 'workshop.faq.q2', a: 'workshop.faq.a2' },
  { q: 'workshop.faq.q3', a: 'workshop.faq.a3' },
  { q: 'workshop.faq.q4', a: 'workshop.faq.a4' },
];

const BUSINESS_FAQ = [
  { q: 'workshop.faq.bq1', a: 'workshop.faq.ba1' },
  { q: 'workshop.faq.bq2', a: 'workshop.faq.ba2' },
  { q: 'workshop.faq.bq3', a: 'workshop.faq.ba3' },
  { q: 'workshop.faq.bq4', a: 'workshop.faq.ba4' },
];

const WaSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.197a.75.75 0 00.91.91l5.339-1.479A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 01-4.95-1.355l-.355-.212-3.683 1.02 1.02-3.683-.211-.355A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const SERVICE_TYPE_SOURCE: Record<string, LeadSource> = {
  lab:            LEAD_SOURCES.WORKSHOP_LAB,
  'svc.screen':   LEAD_SOURCES.WORKSHOP_LAB,
  'svc.upgrade':  LEAD_SOURCES.WORKSHOP_LAB,
  'svc.cooling':  LEAD_SOURCES.WORKSHOP_LAB,
  'svc.battery':  LEAD_SOURCES.WORKSHOP_LAB,
  'svc.recovery': LEAD_SOURCES.WORKSHOP_LAB,
  'svc.virus':    LEAD_SOURCES.WORKSHOP_LAB,
  'svc.os':       LEAD_SOURCES.WORKSHOP_LAB,
  'svc.networkSvc': LEAD_SOURCES.WORKSHOP_LAB,
  home:             LEAD_SOURCES.WORKSHOP_HOME,
  biz:              LEAD_SOURCES.WORKSHOP_BIZ,
  'biz.network':    LEAD_SOURCES.WORKSHOP_BIZ,
  'biz.security':   LEAD_SOURCES.WORKSHOP_BIZ,
  'biz.maintenance':LEAD_SOURCES.WORKSHOP_BIZ,
  'biz.consult':    LEAD_SOURCES.WORKSHOP_BIZ,
  other:            LEAD_SOURCES.GENERAL,
};

/** Strip HTML/script tags and dangerous characters to prevent injection */
function sanitize(val: string): string {
  return val
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>"'`]/g, '')
    .trim();
}

export function WorkshopPage() {
  const { t, dir } = useLang();

  // Build WhatsApp URLs
  const waBaseUrl = `https://api.whatsapp.com/send?phone=${WA_NUM}`;
  const waHomeUrl = `${waBaseUrl}&text=${encodeURIComponent(t('workshop.home.waMessage'))}`;

  const [openFaq, setOpenFaq] = useState<number | string | null>(null);

  // Ticket form state
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [email, setEmail]         = useState('');
  const [serviceType, setServiceType] = useState('lab');
  const [deviceType, setDeviceType]   = useState('laptop');
  const [desc, setDesc]           = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [prefilledFrom, setPrefilledFrom] = useState<string | null>(null);

  /** Click a service/biz card → pre-fill ticket + scroll */
  const prefillTicket = (serviceName: string, serviceValue: string) => {
    setServiceType(serviceValue);
    setPrefilledFrom(serviceName);
    setDesc(sanitize(serviceName) + ' — ');
    document.getElementById('ticket')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // ── Client-side validation ─────────────────────────────────────────────
    const cleanName  = sanitize(name);
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const cleanEmail = sanitize(email);
    const cleanDesc  = sanitize(desc);

    if (cleanName.length < 2) {
      setSubmitError(t('workshop.ticket.error.name')); return;
    }
    if (!/^0[2-9]\d{7,8}$/.test(cleanPhone)) {
      setSubmitError(t('workshop.ticket.error.phone')); return;
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setSubmitError(t('workshop.ticket.error.email')); return;
    }
    if (cleanDesc.length < 5) {
      setSubmitError(t('workshop.ticket.error.desc')); return;
    }

    setSubmitting(true);

    const svcLabels: Record<string, string> = {
      lab:              t('workshop.ticket.type.lab'),
      'svc.screen':     t('workshop.svc.screen'),
      'svc.upgrade':    t('workshop.svc.upgrade'),
      'svc.cooling':    t('workshop.svc.cooling'),
      'svc.battery':    t('workshop.svc.battery'),
      'svc.recovery':   t('workshop.svc.recovery'),
      'svc.virus':      t('workshop.svc.virus'),
      'svc.os':         t('workshop.svc.os'),
      'svc.networkSvc': t('workshop.svc.networkSvc'),
      home:             t('workshop.ticket.type.home'),
      biz:              t('workshop.ticket.type.biz'),
      'biz.network':    t('workshop.biz.network'),
      'biz.security':   t('workshop.biz.security'),
      'biz.maintenance':t('workshop.biz.maintenance'),
      'biz.consult':    t('workshop.biz.consult'),
      other:            t('workshop.ticket.type.other'),
    };
    const devLabels: Record<string, string> = {
      desktop:  t('workshop.ticket.device.desktop'),
      laptop:   t('workshop.ticket.device.laptop'),
      allinone: t('workshop.ticket.device.allinone'),
      tablet:   t('workshop.ticket.device.tablet'),
      server:   t('workshop.ticket.device.server'),
      other:    t('workshop.ticket.device.other'),
    };

    const message = [
      `סוג שירות: ${svcLabels[serviceType] ?? serviceType}`,
      `סוג מכשיר: ${devLabels[deviceType] ?? deviceType}`,
      `תיאור: ${cleanDesc}`,
    ].join('\n');

    try {
      await sendLead({
        name: cleanName, phone: cleanPhone, email: cleanEmail, message,
        source: SERVICE_TYPE_SOURCE[serviceType] ?? LEAD_SOURCES.GENERAL,
      });
      setSubmitted(true);
      setName(''); setPhone(''); setEmail(''); setDesc('');
      setServiceType('lab'); setDeviceType('laptop');
      setPrefilledFrom(null);
    } catch {
      setSubmitError(t('workshop.ticket.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-border-light bg-card-bg text-text-main px-4 py-2.5 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition';

  return (
    <div dir={dir} style={{ direction: dir }}>

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 sm:py-20">
        <Container className="text-center">
          <span className="inline-block text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 rounded-full px-4 py-1 mb-5 uppercase">
            PRO LAB SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
            {t('workshop.hero.title')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            {t('workshop.hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <a href="#ticket"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-6 py-3 transition">
              <Icon name="build_circle" className="text-xl" />
              {t('workshop.ticket.send.cta')}
            </a>
            {/* Direct WhatsApp with language-based pre-written message */}
            <a href={waHomeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-xl px-6 py-3 transition">
              <WaSvg />
              {t('workshop.home.cta')}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-300">
            {[
              { icon: 'workspace_premium', key: 'workshop.trust.years' },
              { icon: 'devices',           key: 'workshop.trust.brands' },
              { icon: 'verified',          key: 'workshop.trust.warranty' },
              { icon: 'search',            key: 'workshop.trust.diagnosis' },
            ].map(({ icon, key }) => (
              <span key={key} className="flex items-center gap-1.5">
                <Icon name={icon} className="text-primary text-base" />
                {t(key)}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 2. LAB SERVICES (left) + BUSINESS SOLUTIONS (right) — 2 columns ── */}
      <section className="bg-page-bg py-10 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left: Lab Services */}
            <div>
              <h2 className="text-xl font-bold text-text-main mb-2">{t('workshop.lab.title')}</h2>
              <p className="text-text-muted text-sm mb-6">{t('workshop.lab.subtitle')}</p>
              <div className="grid grid-cols-2 gap-3">
                {LAB_SERVICES.map(({ icon, nameKey, descKey, value }) => (
                  <button key={nameKey} type="button"
                    onClick={() => prefillTicket(t(nameKey), value)}
                    className="bg-card-bg border border-border-light rounded-xl p-3 sm:p-4 flex flex-col items-center text-center hover:shadow-md hover:border-primary/60 hover:bg-primary/5 transition group cursor-pointer">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition">
                      <Icon name={icon} className="text-primary text-xl" />
                    </span>
                    <h3 className="font-semibold text-xs text-text-main mb-1 group-hover:text-primary transition leading-tight">{t(nameKey)}</h3>
                    <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{t(descKey)}</p>
                    <span className="mt-2 text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                      <Icon name="edit_note" className="text-sm" />
                      {t('workshop.card.openTicket')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Business Solutions */}
            <div>
              <h2 className="text-xl font-bold text-text-main mb-2">{t('workshop.biz.title')}</h2>
              <p className="text-text-muted text-sm mb-6">{t('workshop.biz.subtitle')}</p>
              <div className="grid grid-cols-1 gap-4">
                {BIZ_CARDS.map(({ icon, nameKey, descKey, value }) => (
                  <button key={nameKey} type="button"
                    onClick={() => prefillTicket(t(nameKey), value)}
                    className="bg-card-bg border border-border-light rounded-xl p-5 flex gap-4 hover:shadow-md hover:border-primary/60 hover:bg-primary/5 transition text-start group cursor-pointer">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                      <Icon name={icon} className="text-primary text-xl" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-text-main mb-0.5 group-hover:text-primary transition">{t(nameKey)}</h3>
                      <p className="text-text-muted text-xs">{t(descKey)}</p>
                      <span className="mt-1.5 text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <Icon name="edit_note" className="text-sm" />
                        {t('workshop.card.openTicket')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. HOME TECHNICIAN — left: ticket form | right: info + WhatsApp ── */}
      <section id="ticket" className="py-10 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* LEFT — full ticket form */}
            <div>
              <h2 className="text-xl font-bold text-text-main mb-1">{t('workshop.ticket.title')}</h2>
              <p className="text-text-muted text-sm mb-5">{t('workshop.ticket.subtitle')}</p>

              {submitted ? (
                <div className="bg-card-bg border border-green-500/40 rounded-2xl p-8 text-center shadow-sm">
                  <span className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <Icon name="check_circle" className="text-green-500 text-4xl" />
                  </span>
                  <h3 className="text-lg font-bold text-text-main mb-2">{t('workshop.ticket.success.title')}</h3>
                  <p className="text-text-muted text-sm mb-5">{t('workshop.ticket.success.body')}</p>
                  <button type="button" onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors">
                    {t('workshop.ticket.send.cta')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} noValidate
                  className="bg-card-bg border border-border-light rounded-2xl p-5 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.name')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className={inputCls} placeholder={t('workshop.ticket.name')} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.phone')}</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        className={inputCls} placeholder="05X-XXXXXXX" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.email')}</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className={inputCls} placeholder={t('workshop.ticket.email.placeholder')} dir="ltr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.type')}</label>
                      <select value={serviceType} onChange={e => setServiceType(e.target.value)} className={inputCls}>
                        <optgroup label={t('workshop.ticket.type.lab')}>
                          <option value="lab">{t('workshop.ticket.type.lab.general')}</option>
                          {LAB_SERVICES.map(({ nameKey, value }) => (
                            <option key={value} value={value}>{t(nameKey)}</option>
                          ))}
                        </optgroup>
                        <option value="home">{t('workshop.ticket.type.home')}</option>
                        <optgroup label={t('workshop.ticket.type.biz')}>
                          <option value="biz">{t('workshop.ticket.type.biz.general')}</option>
                          {BIZ_CARDS.map(({ nameKey, value }) => (
                            <option key={value} value={value}>{t(nameKey)}</option>
                          ))}
                        </optgroup>
                        <option value="other">{t('workshop.ticket.type.other')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.device')}</label>
                      <select value={deviceType} onChange={e => setDeviceType(e.target.value)} className={inputCls}>
                        <option value="desktop">{t('workshop.ticket.device.desktop')}</option>
                        <option value="laptop">{t('workshop.ticket.device.laptop')}</option>
                        <option value="allinone">{t('workshop.ticket.device.allinone')}</option>
                        <option value="tablet">{t('workshop.ticket.device.tablet')}</option>
                        <option value="server">{t('workshop.ticket.device.server')}</option>
                        <option value="other">{t('workshop.ticket.device.other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-sm font-medium text-text-main">{t('workshop.ticket.desc')}</label>
                      {prefilledFrom && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full px-2.5 py-0.5">
                          <Icon name="auto_fix_high" className="text-xs" />
                          {prefilledFrom}
                        </span>
                      )}
                    </div>
                    <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
                      className={cn(inputCls, 'resize-none')} placeholder={t('workshop.ticket.desc.placeholder')} />
                  </div>
                  {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold rounded-xl px-6 py-3 transition">
                    <Icon name="send" className="text-lg" />
                    {submitting ? t('workshop.ticket.sending') : t('workshop.ticket.send')}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT — home tech info + WhatsApp CTA */}
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                <Icon name="home_repair_service" className="text-base" />
                {t('workshop.home.title')}
              </span>
              <h2 className="text-2xl font-bold text-text-main mb-2">{t('workshop.home.title')}</h2>
              <p className="text-text-muted text-sm mb-4">{t('workshop.home.subtitle')}</p>
              <ul className="space-y-2 mb-3">
                {HOME_INCLUDES.map(key => (
                  <li key={key} className="flex items-start gap-2 text-sm text-text-main">
                    <Icon name="check_circle" className="text-green-500 text-base mt-0.5 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-muted border-s-2 border-border-light ps-3 mb-5 leading-relaxed">
                {t('workshop.home.note')}
              </p>

              {/* WhatsApp ₪300 card */}
              <a href={waHomeUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-card-bg border border-border-light rounded-xl px-4 py-4 hover:border-[#25D366]/60 hover:shadow-md transition group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition text-[#25D366]">
                    <WaSvg />
                  </span>
                  <div className="text-start min-w-0">
                    <p className="font-bold text-sm text-text-main leading-snug">{t('workshop.home.cta')}</p>
                    <p className="text-xs text-amber-500 font-semibold">{t('workshop.home.centerOnly')}</p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-primary shrink-0">₪300</span>
              </a>
            </div>

          </div>
        </Container>
      </section>

      {/* ── 5. FAQ — 2 columns: customer | business ── */}
      <section className="py-10 sm:py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main text-center mb-10">{t('workshop.faq.title')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Customer FAQ */}
            <div>
              <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
                <Icon name="person" className="text-primary text-xl" />
                {t('workshop.faq.customer.title')}
              </h3>
              <div className="space-y-3">
                {CUSTOMER_FAQ.map(({ q, a }, i) => (
                  <div key={q} className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
                    <button type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-start font-semibold text-sm text-text-main hover:bg-primary/5 transition"
                      aria-expanded={openFaq === i}>
                      {t(q)}
                      <Icon name={openFaq === i ? 'expand_less' : 'expand_more'} className="text-text-muted text-xl shrink-0" />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-3 text-sm text-text-muted leading-relaxed border-t border-border-light">
                        {t(a)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business FAQ */}
            <div>
              <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
                <Icon name="business" className="text-primary text-xl" />
                {t('workshop.faq.business.title')}
              </h3>
              <div className="space-y-3">
                {BUSINESS_FAQ.map(({ q, a }, i) => {
                  const key = `biz-${i}`;
                  return (
                    <div key={q} className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
                      <button type="button"
                        onClick={() => setOpenFaq(openFaq === key ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-start font-semibold text-sm text-text-main hover:bg-primary/5 transition"
                        aria-expanded={openFaq === key}>
                        {t(q)}
                        <Icon name={openFaq === key ? 'expand_less' : 'expand_more'} className="text-text-muted text-xl shrink-0" />
                      </button>
                      {openFaq === key && (
                        <div className="px-5 pb-5 pt-3 text-sm text-text-muted leading-relaxed border-t border-border-light">
                          {t(a)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </Container>
      </section>

    </div>
  );
}
