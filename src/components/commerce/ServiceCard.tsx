import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import type { ServiceItem } from '@/data/services';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLang();
  return (
    <div className="relative bg-card-bg rounded-xl border border-border-light p-5 hover:shadow-tech-hover hover:border-primary transition-all group flex items-start gap-4 overflow-hidden">
      {/* Right border accent (RTL: visually on the right) */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-r-xl" />
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
        <Icon name={service.icon} className="text-primary group-hover:text-white text-2xl transition-colors" />
      </div>
      <div className="flex-1 text-right">
        <h3 className="font-bold text-base text-text-main mb-1">{t(service.titleKey)}</h3>
        <p className="text-text-muted text-sm leading-relaxed">{t(service.descKey)}</p>
      </div>
    </div>
  );
}
