import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

const SERVICES = [
  { icon: 'build', titleKey: 'workshop.repair.title', descKey: 'workshop.repair.desc' },
  { icon: 'database', titleKey: 'workshop.recovery.title', descKey: 'workshop.recovery.desc' },
  { icon: 'handyman', titleKey: 'workshop.maintenance.title', descKey: 'workshop.maintenance.desc' },
];

const STEPS = [
  { num: '01', titleKey: 'workshop.step1.title', descKey: 'workshop.step1.desc' },
  { num: '02', titleKey: 'workshop.step2.title', descKey: 'workshop.step2.desc' },
];

const TRUST_ICONS = [
  { icon: 'verified', labelKey: 'workshop.trust.warranty' },
  { icon: 'speed', labelKey: 'workshop.trust.fast' },
  { icon: 'support_agent', labelKey: 'workshop.trust.support' },
  { icon: 'workspace_premium', labelKey: 'workshop.trust.certified' },
];

const FAQ_ITEMS = [
  { qKey: 'workshop.faq.q1', aKey: 'workshop.faq.a1' },
  { qKey: 'workshop.faq.q2', aKey: 'workshop.faq.a2' },
  { qKey: 'workshop.faq.q3', aKey: 'workshop.faq.a3' },
];

export function WorkshopPage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
//// its not conant to the nav bar and dont rigfierct to right slug adders https://www.aluf.co.il/pages/52435-%D7%9E%D7%A2%D7%91%D7%93%D7%94-%D7%9C%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D and https://www.aluf.co.il/pages/52435-%D7%9E%D7%A2%D7%91%D7%93%D7%94-%D7%9C%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-primary font-bold text-sm tracking-wide uppercase mb-4 block">
              PRO LAB SOLUTIONS
            </span>
            <h1 className="text-3xl lg:text-5xl font-black mb-4">
              {t('workshop.hero.title')}
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              {t('workshop.hero.subtitle')}
            </p>
            <Button variant="primary" size="lg" className="text-lg px-8 py-4">
              <Icon name="assignment" className="ml-2" />
              {t('workshop.hero.cta')}
            </Button>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SERVICES.map(s => (
              <div key={s.titleKey} className="text-center p-6 bg-card-bg rounded-xl border border-border-light">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name={s.icon} className="text-3xl text-primary" />
                </div>
                <h3 className="font-bold text-text-main mb-2">{t(s.titleKey)}</h3>
                <p className="text-sm text-text-muted">{t(s.descKey)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 bg-page-bg">
        <Container>
          <h2 className="text-2xl font-black text-text-main text-center mb-12">
            {t('workshop.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {STEPS.map(step => (
              <div key={step.num} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-text-main mb-1">{t(step.titleKey)}</h3>
                  <p className="text-sm text-text-muted">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust icons */}
      <section className="py-12">
        <Container>
          <div className="flex flex-wrap justify-center gap-8">
            {TRUST_ICONS.map(item => (
              <div key={item.labelKey} className="flex flex-col items-center gap-2">
                <Icon name={item.icon} className="text-3xl text-primary" />
                <span className="text-xs text-text-muted font-medium">{t(item.labelKey)}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-page-bg">
        <Container>
          <h2 className="text-2xl font-black text-text-main text-center mb-8">
            {t('workshop.faq.title')}
          </h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-card-bg rounded-xl border border-border-light overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-right"
                >
                  <span className="font-bold text-text-main text-sm">{t(faq.qKey)}</span>
                  <Icon
                    name={openFaq === i ? 'remove' : 'add'}
                    className="text-primary flex-shrink-0"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-text-muted">
                    {t(faq.aKey)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section className="py-16">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-black text-text-main mb-6">{t('workshop.contact.title')}</h2>
            <div className="space-y-4 text-sm">
              <a href="tel:1-700-50-50-50" className="flex items-center justify-center gap-2 text-text-main hover:text-primary transition">
                <Icon name="phone" className="text-primary" />
                1-700-50-50-50
              </a>
              <a href="mailto:sales@aluf.co.il" className="flex items-center justify-center gap-2 text-text-main hover:text-primary transition">
                <Icon name="email" className="text-primary" />
                sales@aluf.co.il
              </a>
              <p className="flex items-center justify-center gap-2 text-text-muted">
                <Icon name="location_on" className="text-primary" />
                {t('workshop.contact.address')}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
