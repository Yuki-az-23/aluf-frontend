import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import type { ServiceItem } from '@/data/services';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLang();
  return (
    <div className="bg-card-bg rounded-xl border border-border-light p-6 hover:shadow-tech-hover hover:border-primary transition-all group text-center">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon name={service.icon} className="text-primary text-3xl" />
      </div>
      <h3 className="font-bold text-lg text-text-main mb-2">{t(service.titleKey)}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{t(service.descKey)}</p>
    </div>
  );
}
