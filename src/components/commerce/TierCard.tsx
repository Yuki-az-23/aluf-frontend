import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import type { TierConfig } from '@/data/tiers';

interface TierCardProps {
  tier: TierConfig;
}

export function TierCard({ tier }: TierCardProps) {
  const { t } = useLang();
  return (
    <div className="bg-card-bg rounded-xl border border-border-light overflow-hidden hover:shadow-tech-hover transition-all group">
      <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
      {tier.image && (
        <div className="px-6 pt-6 flex justify-center">
          <img
            src={tier.image}
            alt={tier.name}
            className="h-40 w-auto object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-black text-xl text-brand-purple mb-2">{tier.name}</h3>
        <p className="text-3xl font-black text-primary mb-4">{t('price.currency')}{tier.price.toLocaleString()}</p>
        <ul className="space-y-2 mb-6">
          {tier.specs.map((spec, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
              <Icon name="check_circle" className="text-primary text-base" />
              {spec}
            </li>
          ))}
        </ul>
        {tier.href ? (
          <a href={tier.href} className="block w-full">
            <Button variant="outline" size="md" className="w-full">{t('tiers.cta')}</Button>
          </a>
        ) : (
          <Button variant="outline" size="md" className="w-full">{t('tiers.cta')}</Button>
        )}
      </div>
    </div>
  );
}
