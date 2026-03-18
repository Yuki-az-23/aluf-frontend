export interface NavItem {
  labelKey: string;
  label?: string;
  icon: string;
  href: string;
}

const BASE = 'https://alufshop.konimbo.co.il';

export const mainNavItems: NavItem[] = [
  { labelKey: 'nav.computers', icon: 'computer', href: BASE + '/636802-%D7%94%D7%A8%D7%9B%D7%91%D7%95%D7%AA-%D7%9E%D7%91%D7%99%D7%AA-%D7%90%D7%9C%D7%95%D7%A3-%D7%94%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
  { labelKey: 'nav.hardware', icon: 'memory', href: BASE + '/613308-%D7%9E%D7%A2%D7%91%D7%93%D7%99-INTEL' },
  { labelKey: 'nav.peripherals', icon: 'keyboard', href: BASE + '/802813-%D7%94%D7%92%D7%94-%D7%9C%D7%A1%D7%99%D7%9E%D7%95%D7%9C%D7%98%D7%95%D7%A8' },
  { labelKey: 'nav.networking', icon: 'router', href: BASE + '/649783-FORTINET-FORTIGATE' },
  { labelKey: 'nav.consoles', icon: 'sports_esports', href: BASE + '/617538-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-XBOX' },
  { labelKey: 'nav.gaming', icon: 'stadia_controller', href: BASE + '/617567-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%A0%D7%99%D7%99%D7%93%D7%99%D7%9D-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
];
