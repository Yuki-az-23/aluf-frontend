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
// /536380 suffix = in-stock filter
export const mainNavItems: NavItem[] = [
  {
    labelKey: 'nav.computers',
    icon: 'computer',
    href: '/596696-מחשבים',
    subItems: [
      { label: 'הרכבות מבית אלוף המחשבים', href: '/636802-הרכבות-מביתא-אלוף-המחשבים/536380' },
      { label: 'מחשב נייד', href: '/617479-מחשב-נייד/536380' },
      { label: 'מחשבי All In One (AIO)', href: '/616403-מחשבי-All-In-One-AIO/536380' },
      { label: 'מחשבי MiniPC', href: '/616392-מחשבי-MiniPC/536380' },
      { label: 'תחנות עבודה', href: '/616404-תחנות-עבודה/536380' },
      { label: 'תחנות עגינה', href: '/617511-תחנות-עגינה/536380' },
      { label: 'תיקים', href: '/617503-תיקים/536380' },
      { label: 'מטענים', href: '/741138-מטענים/536380' },
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
      { label: 'מאוררים', href: '/613407-Arctic-Cooling-Antec-Corsair-Generic-Cooler-Master/536380' },
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
      { label: 'ספקי כוח', href: '/615384-ספקי-כוח-למחשבים-נייחים/536380' },
    ],
  },
  {
    labelKey: 'nav.peripherals',
    icon: 'keyboard',
    href: '/585876-ציוד-הקפי',
    subItems: [
      { label: 'מקלדות', href: '/616281-מקלדות/536380' },
      { label: 'עכברים', href: '/616287-עכברים/536380' },
      { label: 'אוזניות', href: '/616295-אוזניות/536380' },
      { label: 'מסכים מחשב', href: '/616355-מסכים-מחשב/536380' },
      { label: 'רמקולים', href: '/616294-רמקולים/536380' },
      { label: 'מצלמות', href: '/616301-מצלמות/536380' },
    ],
  },
  {
    labelKey: 'nav.networking',
    icon: 'router',
    href: '/649010-ציוד-רשת',
    subItems: [
      { label: 'נתבים', href: '/658680-נתבים/536380' },
      { label: 'מתגים', href: '/753892-מתגים/536380' },
      { label: 'מגדילי טווח', href: '/753902-מגדילי-טווח/536380' },
      { label: 'כרטיסי רשת', href: '/753899-כרטיסי-רשת-מתאם-רשת/536380' },
    ],
  },
  {
    labelKey: 'nav.consoles',
    icon: 'sports_esports',
    href: '/596717-קונסולות',
    subItems: [
      { label: 'קונסולות PlayStation', href: '/617545-קונסולות-PlayStation/536380' },
      { label: 'קונסולות XBOX', href: '/617538-קונסולות-XBOX/536380' },
      { label: 'קונסולות Nintendo', href: '/617558-קונסולות-Nintendo/536380' },
      { label: 'VALVE STEAM DECK', href: '/763328-קונסולה-VALVE-STEAM-DECK/536380' },
    ],
  },
  {
    labelKey: 'nav.gaming',
    icon: 'stadia_controller',
    href: '/596731-גיימינג',
    subItems: [
      { label: 'מחשבים ניידים גיימינג', href: '/617573-מחשבים-ניידים-גיימינג/536380' },
      { label: 'מחשבים נייחים גיימינג', href: '/617567-מחשבים-ניידים-גיימינג/536380' },
      { label: 'מסכי גיימינג', href: '/617575-מסכי-גיימינג/536380' },
      { label: 'אוזניות גיימינג', href: '/617615-אוזניות-גיימינג/536380' },
      { label: 'כיסאות גיימינג', href: '/617621-כיסאות-גיימינג/536380' },
    ],
  },
];
