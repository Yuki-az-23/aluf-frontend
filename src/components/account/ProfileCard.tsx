// src/components/account/ProfileCard.tsx
import { useLang } from '@/i18n';

interface ProfileCardProps {
  name: string | null;
}

export function ProfileCard({ name }: ProfileCardProps) {
  const { t } = useLang();

  return (
    <div className="bg-card-bg border border-border-light rounded-2xl p-6">
      <h2 className="font-bold text-lg text-text-main mb-4">{t('account.profile.title')}</h2>
      {name ? (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-primary">{name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-bold text-text-main text-lg">{name}</p>
            <a
              href="/current_customer/edit"
              className="text-xs text-primary hover:underline mt-0.5 block"
            >
              {t('account.nav.edit')} →
            </a>
          </div>
        </div>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-border-light rounded w-1/2" />
          <div className="h-3 bg-border-light rounded w-1/3" />
        </div>
      )}
    </div>
  );
}
