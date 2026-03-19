import { Container } from './Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const BASE = 'https://alufshop.konimbo.co.il';
const MAPS_QUERY = encodeURIComponent('אלוף המחשבים הרצל 102 ראשון לציון');
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&output=embed&hl=iw&z=15`;
const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

const deptLinks = [
  { key: 'desktops', href: BASE + '/596696-מחשבים' },
  { key: 'laptops', href: BASE + '/585876-ציוד-הקפי' },
  { key: 'components', href: BASE + '/585802-חומרת-מחשב' },
  { key: 'gamingGear', href: BASE + '/596731-גיימינג' },
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
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto text-gray-300">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 text-start">
          {/* Brand */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4 justify-start">
              <img
                src={logoSrc}
                alt={t('site.name')}
                className="h-6 w-auto object-contain bg-white p-0.5 rounded-sm"
              />
              <span className="font-display font-bold text-xl text-white">
                {t('site.name.prefix')} <span className="text-primary">{t('site.name.suffix')}</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('footer.description')}</p>
            <div className="flex gap-4 justify-start">
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
          <div className="flex-grow flex flex-col sm:flex-row justify-start gap-12 md:gap-24">
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
                <li className="flex items-start gap-3 justify-start">
                  <Icon name="location_on" className="text-primary text-base mt-0.5 flex-shrink-0" />
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    {t('footer.address')}
                  </a>
                </li>
                <li className="flex items-center gap-3 justify-start">
                  <Icon name="call" className="text-primary text-base" />
                  <a href="tel:0533368048" className="hover:text-primary transition" dir="ltr">03-123-4567</a>
                </li>
                <li className="flex items-center gap-3 justify-start">
                  <Icon name="mail" className="text-primary text-base" />
                  <a href="mailto:sales@aluf.co.il" className="hover:text-primary transition">sales@aluf.co.il</a>
                </li>
                <li className="flex items-center gap-3 justify-start">
                  <Icon name="schedule" className="text-primary text-base" />
                  <span>{t('footer.hours')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Store map */}
        <div className="mt-10 rounded-xl overflow-hidden border border-gray-700">
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block relative group">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="200"
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          {t('footer.copyright')}
        </div>
      </Container>
    </footer>
  );
}
