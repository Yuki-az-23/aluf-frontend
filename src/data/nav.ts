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
    href: '/596696-מחשבים',
    subItems: [
      { label: 'הרכבות מבית אלוף המחשבים', href: '636802-הרכבות-מבית-אלוף-המחשבים/536380' },
      { label: 'מחשב נייד', href: '/617479-מחשב-נייד/536380' },
      { label: 'מחשבי All In One (AIO)', href: '/616403-מחשבי-All-In-One-AIO-/536380' },
      { label: 'מחשבי MiniPC', href: '/616392-מחשבי-MiniPC/536380' },
      { label: 'תחנות עבודה', href: '/616404-תחנות-עבודה/536380' },
      { label: 'תחנות עגינה', href: '/617511-תחנות-עגינה/536380' },
      { label: 'תיקים', href: '/617503-תיקים/536380' },
      { label: 'מטענים' , href: '/741138-מטענים/536380' },
    ],
  },
  {
    labelKey: 'nav.hardware',
    icon: 'memory',
    href: '/585802-חומרת-מחשב',
    subItems: [
      { label: 'מעבדי INTEL', href: '/613308-מעבדי-INTEL/536380' },
      { label: 'מעבדי AMD', href: '/613323-מעבדי-AMD/536380' },
      { label: 'מתאמים למעבדים', href: '/784274-מתאמים-למעבדים/536380' },
      { label: 'קירור אוויר למעבד', href: '/613342-קירור-אוויר-למעבד/536380' },
      { label: 'קירור נוזלי למעבד', href: '/613348-קירור-נוזלי-למעבד/536380' },
      { label: 'מאוררים', href: '613407-Arctic-Cooling-Antec-Corsair-Generic-Cooler-Master/536380' },
      { label: 'כרטיסי מסך NVIDIA', href: '/615371-כרטיסי-מסך-NVIDIA/536380' },
      { label: 'כרטיסי מסך AMD', href: '/615378-כרטיסי-מסך-AMD/536380' },
      { label: 'לוחות אם INTEL', href: '/613294-לוחות-אם-INTEL/536380' },
      { label: 'לוחות אם AMD', href: '/613299-לוחות-אם-AMD/536380' },
      { label: 'מארזים', href: '/613401-מארזים/536380' },
      { label: 'פנלים קדמיים ודלתות צד', href: '/757190-פנלים-קדמיים-ודלתות-צד/536380' },
      { label: 'זכרון למחשב נייח DIMM', href: '/613376-זכרון-למחשב-נייח-DIMM/536380' },
      { label: 'זכרון למחשב נייד SO-DIMM', href: '/613390-זכרון-למחשב-נייד-SODDIM-/536380' },
      { label: 'אחסון SSD', href: '/613361-אחסון-SSD/536380' },
      { label: 'אחסון HDD', href: '/613363-אחסון-HDD/536380' },
      { label: 'SSD/HDD חיצוני', href: '/613369-SSD-HDD-חיצוני/536380' },
      { label: 'שרתי אחסון', href: '/751731-שרתי-אחסון/536380' },
      { label: 'ספקי כוח', href: '/613408-ספקי-כוח/536380' },
    ],
  },
  /// stopted mapping here 
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
