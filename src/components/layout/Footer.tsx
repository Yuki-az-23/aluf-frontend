import { Container } from './Container';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

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
              {['public', 'chat', 'mail'].map(icon => (
                <a key={icon} href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition text-gray-400 border border-gray-700">
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
                {['desktops', 'laptops', 'components', 'gamingGear'].map(key => (
                  <li key={key}><a className="hover:text-primary transition" href="#">{t(`footer.${key}`)}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-base">{t('footer.customerService')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {['tracking', 'returns', 'support', 'terms'].map(key => (
                  <li key={key}><a className="hover:text-primary transition" href="#">{t(`footer.${key}`)}</a></li>
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
                  <span dir="ltr">03-123-4567</span>
                  <Icon name="call" className="text-primary text-base" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span>sales@aluf.co.il</span>
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
