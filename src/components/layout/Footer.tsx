import { Container } from './Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const BASE = 'https://alufshop.konimbo.co.il';

const deptLinks = [
  { key: 'desktops', href: BASE + '/636802-%D7%94%D7%A8%D7%9B%D7%91%D7%95%D7%AA-%D7%9E%D7%91%D7%99%D7%AA-%D7%90%D7%9C%D7%95%D7%A3-%D7%94%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
  { key: 'laptops', href: BASE + '/617567-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%A0%D7%99%D7%99%D7%93%D7%99%D7%9D-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
  { key: 'components', href: BASE + '/613308-%D7%9E%D7%A2%D7%91%D7%93%D7%99-INTEL' },
  { key: 'gamingGear', href: BASE + '/802813-%D7%94%D7%92%D7%94-%D7%9C%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%98%D7%95%D7%A8' },
];

const serviceLinks = [
  { key: 'tracking', href: BASE },
  { key: 'returns', href: BASE },
  { key: 'support', href: BASE },
  { key: 'terms', href: BASE },
];

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-header-bg border-t border-gray-800 mt-auto text-gray-300">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 text-right">
          {/* Brand */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4 justify-end">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <Icon name="deployed_code" className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                {t('site.name.prefix')} <span className="text-primary">{t('site.name.suffix')}</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('footer.description')}</p>
            <div className="flex gap-4 justify-end">
              {[
                { icon: 'public', href: BASE },
                { icon: 'chat', href: BASE },
                { icon: 'mail', href: 'mailto:sales@aluf.co.il' },
              ].map(({ icon, href }) => (
                <a key={icon} href={href} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition text-gray-400 border border-gray-700">
                  <Icon name={icon} className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex-grow flex flex-col sm:flex-row justify-end gap-12 md:gap-24">
            <div>
              <h3 className="text-white font-bold mb-4 text-base">{t('footer.departments')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {deptLinks.map(({ key, href }) => (
                  <li key={key}><a className="hover:text-primary transition" href={href}>{t(`footer.${key}`)}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-base">{t('footer.customerService')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {serviceLinks.map(({ key, href }) => (
                  <li key={key}><a className="hover:text-primary transition" href={href}>{t(`footer.${key}`)}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-base">{t('footer.contact')}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3 justify-end">
                  <span>רחוב המחשב 10, תל אביב</span>
                  <Icon name="location_on" className="text-primary text-base mt-0.5" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <a href="tel:03-123-4567" className="hover:text-primary transition" dir="ltr">03-123-4567</a>
                  <Icon name="call" className="text-primary text-base" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <a href="mailto:sales@aluf.co.il" className="hover:text-primary transition">sales@aluf.co.il</a>
                  <Icon name="mail" className="text-primary text-base" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          {t('footer.copyright')}
        </div>
      </Container>
    </footer>
  );
}
