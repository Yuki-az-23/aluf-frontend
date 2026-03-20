import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const WA_NUM = '972533368048';
const WA_URL = `https://api.whatsapp.com/send?phone=${WA_NUM}`;
const WAZE_URL = 'https://waze.com/ul?ll=31.961256,34.802603&navigate=yes';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=הרצל+102+ראשון+לציון';

const LAB_SERVICES = [
  { icon: 'monitor',                nameKey: 'workshop.svc.screen',      descKey: 'workshop.svc.screen.desc' },
  { icon: 'memory',                 nameKey: 'workshop.svc.upgrade',     descKey: 'workshop.svc.upgrade.desc' },
  { icon: 'ac_unit',                nameKey: 'workshop.svc.cooling',     descKey: 'workshop.svc.cooling.desc' },
  { icon: 'battery_charging_full',  nameKey: 'workshop.svc.battery',     descKey: 'workshop.svc.battery.desc' },
  { icon: 'folder_special',         nameKey: 'workshop.svc.recovery',    descKey: 'workshop.svc.recovery.desc' },
  { icon: 'security',               nameKey: 'workshop.svc.virus',       descKey: 'workshop.svc.virus.desc' },
  { icon: 'install_desktop',        nameKey: 'workshop.svc.os',          descKey: 'workshop.svc.os.desc' },
  { icon: 'wifi',                   nameKey: 'workshop.svc.networkSvc',  descKey: 'workshop.svc.networkSvc.desc' },
];

const BIZ_CARDS = [
  { icon: 'router',         nameKey: 'workshop.biz.network',     descKey: 'workshop.biz.network.desc' },
  { icon: 'shield',         nameKey: 'workshop.biz.security',    descKey: 'workshop.biz.security.desc' },
  { icon: 'handyman',       nameKey: 'workshop.biz.maintenance', descKey: 'workshop.biz.maintenance.desc' },
  { icon: 'support_agent',  nameKey: 'workshop.biz.consult',     descKey: 'workshop.biz.consult.desc' },
];

const HOME_INCLUDES = [
  'workshop.home.inc1',
  'workshop.home.inc2',
  'workshop.home.inc3',
  'workshop.home.inc4',
  'workshop.home.inc5',
];

const FAQ_ITEMS = [
  { q: 'workshop.faq.q1', a: 'workshop.faq.a1' },
  { q: 'workshop.faq.q2', a: 'workshop.faq.a2' },
  { q: 'workshop.faq.q3', a: 'workshop.faq.a3' },
  { q: 'workshop.faq.q4', a: 'workshop.faq.a4' },
];

const WaSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.197a.75.75 0 00.91.91l5.339-1.479A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 01-4.95-1.355l-.355-.212-3.683 1.02 1.02-3.683-.211-.355A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const TICKET_ITEM_ID = '8765261';

export function WorkshopPage() {
  const { t, dir } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('lab');
  const [deviceType, setDeviceType] = useState('laptop');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const svcLabels: Record<string, string> = {
      lab: t('workshop.ticket.type.lab'),
      home: t('workshop.ticket.type.home'),
      biz: t('workshop.ticket.type.biz'),
      other: t('workshop.ticket.type.other'),
    };
    const devLabels: Record<string, string> = {
      desktop: t('workshop.ticket.device.desktop'),
      laptop: t('workshop.ticket.device.laptop'),
      other: t('workshop.ticket.device.other'),
    };

    const content = [
      `סוג שירות: ${svcLabels[serviceType] ?? serviceType}`,
      `סוג מכשיר: ${devLabels[deviceType] ?? deviceType}`,
      `תיאור: ${desc}`,
    ].join('\n');

    const body = new URLSearchParams();
    body.append('ticket[customer_name]', name);
    body.append('ticket[customer_phone]', phone);
    body.append('ticket[customer_email]', email);
    body.append('ticket[item_id]', TICKET_ITEM_ID);
    body.append('ticket[content]', content);
    body.append('ticket[newsletter]', '0');

    try {
      const res = await fetch('/tickets', { method: 'POST', body });
      if (res.ok) {
        setSubmitted(true);
        setName(''); setPhone(''); setEmail(''); setDesc('');
        setServiceType('lab'); setDeviceType('laptop');
      } else {
        setSubmitError(t('workshop.ticket.error'));
      }
    } catch {
      setSubmitError(t('workshop.ticket.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-border-light bg-card-bg text-text-main px-4 py-2.5 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition';

  return (
    <div dir={dir}>

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
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
            <a
              href="#ticket"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-6 py-3 transition"
            >
              <Icon name="build_circle" className="text-xl" />
              {t('workshop.ticket.send.cta')}
            </a>
            <a
              href="https://www.aluf.co.il/pages/52434-%D7%98%D7%9B%D7%A0%D7%90%D7%99-%D7%A2%D7%93-%D7%94%D7%91%D7%99%D7%AA"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white font-semibold rounded-xl px-6 py-3 transition"
            >
              <Icon name="home_repair_service" className="text-xl" />
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

      {/* ── 2. LAB SERVICES ── */}
      <section className="bg-page-bg py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">{t('workshop.lab.title')}</h2>
            <p className="text-text-muted max-w-xl mx-auto">{t('workshop.lab.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LAB_SERVICES.map(({ icon, nameKey, descKey }) => (
              <div key={nameKey} className="bg-card-bg border border-border-light rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md hover:border-primary/40 transition">
                <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Icon name={icon} className="text-primary text-2xl" />
                </span>
                <h3 className="font-semibold text-sm text-text-main mb-1">{t(nameKey)}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. HOME TECHNICIAN ── */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                <Icon name="home_repair_service" className="text-base" />
                {t('workshop.home.title')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">{t('workshop.home.title')}</h2>
              <p className="text-text-muted mb-6">{t('workshop.home.subtitle')}</p>
              <ul className="space-y-3 mb-6">
                {HOME_INCLUDES.map(key => (
                  <li key={key} className="flex items-start gap-2 text-sm text-text-main">
                    <Icon name="check_circle" className="text-green-500 text-base mt-0.5 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-muted border-s-2 border-border-light ps-3 leading-relaxed">
                {t('workshop.home.note')}
              </p>
            </div>

            <div className="w-full lg:w-72 bg-card-bg border border-border-light rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
              <span className="text-5xl font-extrabold text-primary mb-1">₪300</span>
              <p className="text-text-muted text-sm mb-8">{t('workshop.home.region')}</p>
              <a
                href={WA_URL}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-xl px-5 py-3 transition"
              >
                <WaSvg />
                {t('workshop.home.cta')}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. BUSINESS SOLUTIONS ── */}
      <section className="bg-page-bg py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">{t('workshop.biz.title')}</h2>
            <p className="text-text-muted max-w-xl mx-auto">{t('workshop.biz.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {BIZ_CARDS.map(({ icon, nameKey, descKey }) => (
              <div key={nameKey} className="bg-card-bg border border-border-light rounded-xl p-6 flex gap-4 hover:shadow-md hover:border-primary/40 transition">
                <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={icon} className="text-primary text-2xl" />
                </span>
                <div>
                  <h3 className="font-semibold text-text-main mb-1">{t(nameKey)}</h3>
                  <p className="text-text-muted text-sm">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="https://www.aluf.co.il/contact" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              {t('workshop.biz.cta')}
              <Icon name={dir === 'rtl' ? 'arrow_back' : 'arrow_forward'} className="text-base" />
            </a>
          </div>
        </Container>
      </section>

      {/* ── 5. SERVICE TICKET FORM ── */}
      <section id="ticket" className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">{t('workshop.ticket.title')}</h2>
              <p className="text-text-muted">{t('workshop.ticket.subtitle')}</p>
            </div>

            {submitted ? (
              <div className="bg-card-bg border border-green-500/40 rounded-2xl p-10 text-center shadow-sm">
                <span className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="check_circle" className="text-green-500 text-4xl" />
                </span>
                <h3 className="text-xl font-bold text-text-main mb-2">{t('workshop.ticket.success.title')}</h3>
                <p className="text-text-muted mb-6">{t('workshop.ticket.success.body')}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {t('workshop.ticket.send.cta')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="bg-card-bg border border-border-light rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.name')}</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder={t('workshop.ticket.name')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.phone')}</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="05X-XXXXXXX" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.email')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder={t('workshop.ticket.email.placeholder')} dir="ltr" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.type')}</label>
                    <select value={serviceType} onChange={e => setServiceType(e.target.value)} className={inputCls}>
                      <option value="lab">{t('workshop.ticket.type.lab')}</option>
                      <option value="home">{t('workshop.ticket.type.home')}</option>
                      <option value="biz">{t('workshop.ticket.type.biz')}</option>
                      <option value="other">{t('workshop.ticket.type.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.device')}</label>
                    <select value={deviceType} onChange={e => setDeviceType(e.target.value)} className={inputCls}>
                      <option value="desktop">{t('workshop.ticket.device.desktop')}</option>
                      <option value="laptop">{t('workshop.ticket.device.laptop')}</option>
                      <option value="other">{t('workshop.ticket.device.other')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">{t('workshop.ticket.desc')}</label>
                  <textarea rows={4} required value={desc} onChange={e => setDesc(e.target.value)} className={inputCls} placeholder={t('workshop.ticket.desc.placeholder')} />
                </div>
                {submitError && (
                  <p className="text-red-500 text-sm text-center">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold rounded-xl px-6 py-3 transition"
                >
                  <Icon name="send" className="text-lg" />
                  {submitting ? t('workshop.ticket.sending') : t('workshop.ticket.send')}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ ── */}
      <section className="bg-page-bg py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main text-center mb-10">{t('workshop.faq.title')}</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div key={q} className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-start font-semibold text-sm text-text-main hover:bg-primary/5 transition"
                  aria-expanded={openFaq === i}
                >
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
        </Container>
      </section>

      {/* ── 7. CONTACT STRIP ── */}
      <section className="bg-gray-900 text-white py-10">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0533368048" className="flex flex-col items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-7 py-5 transition min-w-[130px] text-center">
              <Icon name="phone" className="text-primary text-3xl" />
              <span className="font-semibold text-sm">053-336-8048</span>
              <span className="text-gray-400 text-xs">התקשרו עכשיו</span>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-7 py-5 transition min-w-[130px] text-center">
              <WaSvg />
              <span className="font-semibold text-sm">WhatsApp</span>
              <span className="text-gray-400 text-xs">שלחו הודעה</span>
            </a>
            <a href={WAZE_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-7 py-5 transition min-w-[130px] text-center">
              <Icon name="navigation" className="text-[#33CCFF] text-3xl" />
              <span className="font-semibold text-sm">Waze</span>
              <span className="text-gray-400 text-xs">נווטו אלינו</span>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-7 py-5 transition min-w-[130px] text-center">
              <Icon name="location_on" className="text-red-400 text-3xl" />
              <span className="font-semibold text-sm">הרצל 102</span>
              <span className="text-gray-400 text-xs">ראשון לציון</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
