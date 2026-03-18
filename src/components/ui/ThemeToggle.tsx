import { useTheme } from '@/theme/ThemeProvider';
import { IconButton } from './IconButton';
import { useLang } from '@/i18n';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  return (
    <IconButton
      icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
      label={t('a11y.toggleTheme')}
      onClick={toggleTheme}
      className="text-gray-300 hover:text-white"
    />
  );
}
