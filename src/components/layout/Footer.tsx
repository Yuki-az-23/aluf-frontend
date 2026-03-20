import { Container } from './Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

const ALUF = 'https://www.aluf.co.il';
const SHOP = 'https://alufshop.konimbo.co.il';

const MAPS_QUERY = encodeURIComponent('אלוף המחשבים הרצל 102 ראשון לציון');
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.9895786435923!2d34.80514595994381!3d31.96117942533949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b4393971eb43%3A0xd5c1850ae56401!2z15TXqNem15wgMTAyLCDXqNeQ16nXldefINec16bXmdeV158!5e0!3m2!1siw!2sil!4v1739104221746!5m2!1siw!2sil`;
const WAZE_LINK = 'https://waze.com/ul?ll=31.961256,34.802603&navigate=yes';
const WA_LINK = 'https://api.whatsapp.com/send?phone=972533368048';
const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

const deptLinks = [
  { key: 'desktops',    href: ALUF + '/596696-מחשבים' },
  { key: 'laptops',     href: ALUF + '/617479-מחשב-נייד' },
  { key: 'components',  href: ALUF + '/585802-חומרת-מחשב' },
  { key: 'gamingGear',  href: ALUF + '/596731-גיימינג' },
];

const serviceLinks = [
  { key: 'contactPage',   href: ALUF  + '/contact' },
  { key: 'support',       href: ALUF  + '/contact' },
  { key: 'orderTracking', href: ALUF  + '/customer_login' },
  { key: 'cancelOrder',   href: SHOP  + '/contact?CancellingTransaction=true&msg=%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%91%D7%98%D7%9C%20%D7%90%D7%AA%20%D7%94%D7%94%D7%96%D7%9E%D7%A0%D7%94' },
  { key: 'contract',      href: '/contract' },
  { key: 'about',         href: ALUF  + '/about' },
  { key: 'directions',    href: ALUF  + '/location' },
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

            {/* Social */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('footer.followUs')}</p>
            <div className="flex gap-3 justify-start flex-wrap">
              <a href="https://www.facebook.com/alufcomputers" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1877F2] flex items-center justify-center transition text-gray-400 hover:text-white border border-gray-700"
                title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/alufcomputers/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] flex items-center justify-center transition text-gray-400 hover:text-white border border-gray-700"
                title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] flex items-center justify-center transition text-gray-400 hover:text-white border border-gray-700"
                title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.197a.75.75 0 00.91.91l5.339-1.479A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 01-4.95-1.355l-.355-.212-3.683 1.02 1.02-3.683-.211-.355A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
              </a>
              <a href={WAZE_LINK} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#33CCFF] flex items-center justify-center transition text-gray-400 hover:text-white border border-gray-700"
                title={t('footer.waze')}>
                <Icon name="navigation" className="text-sm" />
              </a>
              <a href="mailto:sales@aluf.co.il"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition text-gray-400 border border-gray-700"
                title="sales@aluf.co.il">
                <Icon name="mail" className="text-sm" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex-grow flex flex-col sm:flex-row justify-start gap-10 md:gap-16">
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
                <li className="flex items-start gap-3">
                  <Icon name="location_on" className="text-primary text-base mt-0.5 flex-shrink-0" />
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    {t('footer.address')}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="call" className="text-primary text-base flex-shrink-0" />
                  <a href="tel:0533368048" className="hover:text-primary transition" dir="ltr">053-336-8048</a>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="mail" className="text-primary text-base flex-shrink-0" />
                  <a href="mailto:sales@aluf.co.il" className="hover:text-primary transition">sales@aluf.co.il</a>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="schedule" className="text-primary text-base flex-shrink-0" />
                  <span>{t('footer.hours')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="navigation" className="text-[#33CCFF] text-base flex-shrink-0" />
                  <a href={WAZE_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    {t('footer.waze')}
                  </a>
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
