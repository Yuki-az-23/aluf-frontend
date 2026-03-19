export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  labelKey: string;
  label?: string;
  icon: string;
  href: string;
  subItems?: NavSubItem[];
}

const BASE = 'https://alufshop.konimbo.co.il';

export const mainNavItems: NavItem[] = [
  {
    labelKey: 'nav.computers',
    icon: 'computer',
    href: BASE + '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D',
    subItems: [
      { label: 'מחשבים ניידים גיימינג', href: BASE + '/617567-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%A0%D7%99%D7%99%D7%93%D7%99%D7%9D-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
      { label: 'הרכבות מחשב', href: BASE + '/636802-%D7%94%D7%A8%D7%9B%D7%91%D7%95%D7%AA-%D7%9E%D7%91%D7%99%D7%AA-%D7%90%D7%9C%D7%95%D7%A3-%D7%94%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
    ],
  },
  {
    labelKey: 'nav.hardware',
    icon: 'memory',
    href: BASE + '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91',
    subItems: [
      { label: 'מעבדי INTEL', href: BASE + '/613308-%D7%9E%D7%A2%D7%91%D7%93%D7%99-INTEL' },
      { label: 'כרטיסי מסך', href: BASE + '/613310-%D7%9B%D7%A8%D7%98%D7%99%D7%A1%D7%99-%D7%9E%D7%A1%D7%9A' },
      { label: 'לוחות אם', href: BASE + '/613312-%D7%9C%D7%95%D7%97%D7%95%D7%AA-%D7%90%D7%9D' },
      { label: 'אחסון SSD', href: BASE + '/613315-%D7%90%D7%97%D7%A1%D7%95%D7%9F-SSD' },
      { label: 'ספקי כח', href: BASE + '/613317-%D7%A1%D7%A4%D7%A7%D7%99-%D7%9B%D7%97' },
    ],
  },
  {
    labelKey: 'nav.peripherals',
    icon: 'keyboard',
    href: BASE + '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99',
    subItems: [
      { label: 'עכברים', href: BASE + '/617541-%D7%A2%D7%9B%D7%91%D7%A8%D7%99%D7%9D' },
      { label: 'מקלדות', href: BASE + '/617542-%D7%9E%D7%A7%D7%9C%D7%93%D7%95%D7%AA' },
      { label: 'אוזניות', href: BASE + '/617543-%D7%90%D7%95%D7%96%D7%A0%D7%99%D7%95%D7%AA' },
      { label: 'מסכים', href: BASE + '/617544-%D7%9E%D7%A1%D7%9B%D7%99%D7%9D' },
    ],
  },
  { labelKey: 'nav.networking', icon: 'router', href: BASE + '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA' },
  { labelKey: 'nav.consoles', icon: 'sports_esports', href: BASE + '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-' },
  { labelKey: 'nav.gaming', icon: 'stadia_controller', href: BASE + '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
];
