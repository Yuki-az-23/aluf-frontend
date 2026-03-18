export interface NavItem {
  labelKey: string;
  icon: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { labelKey: 'nav.computers', icon: 'computer', href: '#' },
  { labelKey: 'nav.hardware', icon: 'memory', href: '#' },
  { labelKey: 'nav.peripherals', icon: 'keyboard', href: '#' },
  { labelKey: 'nav.networking', icon: 'router', href: '#' },
  { labelKey: 'nav.consoles', icon: 'sports_esports', href: '#' },
  { labelKey: 'nav.gaming', icon: 'stadia_controller', href: '#' },
];
