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

// Relative paths — work on any domain/environment
export const mainNavItems: NavItem[] = [
  {
    labelKey: 'nav.computers',
    icon: 'computer',
    href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D',
    subItems: [
      { label: 'הרכבות מבית אלוף המחשבים', href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
      { label: 'מחשב נייד', href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
      { label: 'מחשבי All In One (AIO)', href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
      { label: 'מחשבי MiniPC', href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
      { label: 'תחנות עבודה', href: '/596696-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D' },
    ],
  },
  {
    labelKey: 'nav.hardware',
    icon: 'memory',
    href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91',
    subItems: [
      { label: 'מעבדי INTEL', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'מעבדי AMD', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'כרטיסי מסך NVIDIA', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'כרטיסי מסך AMD', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'לוחות אם', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'זכרונות', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'אחסון SSD', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
      { label: 'ספקי כוח', href: '/585802-%D7%97%D7%95%D7%9E%D7%A8%D7%AA-%D7%9E%D7%97%D7%A9%D7%91' },
    ],
  },
  {
    labelKey: 'nav.peripherals',
    icon: 'keyboard',
    href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99',
    subItems: [
      { label: 'מקלדות', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
      { label: 'עכברים', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
      { label: 'אוזניות', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
      { label: 'מסכים מחשב', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
      { label: 'רמקולים', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
      { label: 'מצלמות', href: '/585876-%D7%A6%D7%99%D7%95%D7%93-%D7%94%D7%A7%D7%A4%D7%99' },
    ],
  },
  {
    labelKey: 'nav.networking',
    icon: 'router',
    href: '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA',
    subItems: [
      { label: 'נתבים', href: '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA' },
      { label: 'מתגים', href: '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA' },
      { label: 'מגדילי טווח', href: '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA' },
      { label: 'כרטיסי רשת', href: '/649010-%D7%A6%D7%99%D7%95%D7%93-%D7%A8%D7%A9%D7%AA' },
    ],
  },
  {
    labelKey: 'nav.consoles',
    icon: 'sports_esports',
    href: '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-',
    subItems: [
      { label: 'קונסולות PlayStation', href: '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-' },
      { label: 'קונסולות XBOX', href: '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-' },
      { label: 'קונסולות Nintendo', href: '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-' },
      { label: 'VALVE STEAM DECK', href: '/596717-%D7%A7%D7%95%D7%A0%D7%A1%D7%95%D7%9C%D7%95%D7%AA-' },
    ],
  },
  {
    labelKey: 'nav.gaming',
    icon: 'stadia_controller',
    href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92',
    subItems: [
      { label: 'מחשבים ניידים גיימינג', href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
      { label: 'מחשבים נייחים גיימינג', href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
      { label: 'מסכי גיימינג', href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
      { label: 'אוזניות גיימינג', href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
      { label: 'כיסאות גיימינג', href: '/596731-%D7%92%D7%99%D7%99%D7%9E%D7%99%D7%A0%D7%92' },
    ],
  },
];
