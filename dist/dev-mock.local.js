/**
 * LOCAL DEV MOCK — gitignored, never committed
 * Change PAGE_TYPE to switch between page views:
 *   'home' | 'items' | 'category' | 'item' | 'cart'
 */
const PAGE_TYPE = 'item'; // ← change this to test different pages

// ─── Shared product list ───────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: '7893524',
    title: 'Solid F272P1 FHD IPS 27" Monitor',
    category: 'מסכים מחשב',
    image: 'https://placehold.co/400x400/1a1a2e/FF6B00?text=Monitor',
    specs: ['27 אינץ\'', 'IPS FHD', 'HDMI + VGA', 'רמקולים מובנים'],
    price: 899,
    originalPrice: 1099,
    inStock: true,
    href: '/items/7893524-solid-monitor',
  },
  {
    id: '7893530',
    title: 'Samsung Odyssey S27D362 100Hz FHD',
    category: 'מסכים מחשב',
    image: 'https://placehold.co/400x400/1a1a2e/FF6B00?text=Samsung',
    specs: ['27"', 'FHD 1080p', '100Hz', 'FreeSync'],
    price: 1199,
    inStock: true,
    href: '/items/7893530-samsung-s27d362',
  },
  {
    id: '7893379',
    title: 'Gold Touch BT מקלדת Bluetooth KY-200',
    category: 'מקלדות',
    image: 'https://placehold.co/400x400/0f3460/FF6B00?text=Keyboard',
    specs: ['Bluetooth', 'עברית/אנגלית', 'נטענת'],
    price: 249,
    inStock: true,
    href: '/items/7893379-goldtouch-keyboard',
  },
  {
    id: '7893387',
    title: 'Logitech B100 עכבר חוטי USB',
    category: 'עכברים',
    image: 'https://placehold.co/400x400/0f3460/FF6B00?text=Mouse',
    specs: ['USB חוטי', '800 DPI', 'סימטרי'],
    price: 59,
    inStock: true,
    href: '/items/7893387-logitech-b100',
  },
  {
    id: '7893444',
    title: 'Edifier R12U רמקולים שחור USB',
    category: 'רמקולים',
    image: 'https://placehold.co/400x400/16213e/FF6B00?text=Speakers',
    specs: ['USB', '4W RMS', 'מהדק 3.5mm'],
    price: 149,
    originalPrice: 179,
    inStock: true,
    href: '/items/7893444-edifier-r12u',
  },
  {
    id: '7893472',
    title: 'Logitech H340 אוזניות USB עם מיקרופון',
    category: 'אוזניות',
    image: 'https://placehold.co/400x400/16213e/FF6B00?text=Headset',
    specs: ['USB', 'מיקרופון מובנה', 'בקר עוצמה'],
    price: 179,
    inStock: true,
    href: '/items/7893472-logitech-h340',
  },
  {
    id: '7893488',
    title: 'Logitech Brio 105 FHD Webcam',
    category: 'מצלמות',
    image: 'https://placehold.co/400x400/16213e/FF6B00?text=Webcam',
    specs: ['FHD 1080p', 'USB-A', 'Auto-light correction'],
    price: 299,
    inStock: true,
    href: '/items/7893488-logitech-brio105',
  },
  {
    id: '7896635',
    title: 'Xbox Series Wireless Controller Black',
    category: 'קונסולות',
    image: 'https://placehold.co/400x400/107c10/ffffff?text=Xbox',
    specs: ['אלחוטי', 'Bluetooth', 'USB-C'],
    price: 249,
    inStock: true,
    href: '/items/7896635-xbox-controller',
  },
  {
    id: '7893546',
    title: 'Samsung S32 VA 32" FHD Smart Monitor',
    category: 'מסכים מחשב',
    image: 'https://placehold.co/400x400/1a1a2e/FF6B00?text=Smart+TV',
    specs: ['32"', 'VA FHD', 'WiFi + BT', 'Smart Hub'],
    price: 1799,
    originalPrice: 2199,
    inStock: false,
    href: '/items/7893546-samsung-s32-smart',
  },
  {
    id: '7893413',
    title: 'Logitech MK540 Advanced Keyboard + Mouse',
    category: 'מקלדות',
    image: 'https://placehold.co/400x400/0f3460/FF6B00?text=Combo',
    specs: ['אלחוטי 2.4GHz', 'עברית/אנגלית', 'סוללות כלולות'],
    price: 349,
    inStock: true,
    href: '/items/7893413-logitech-mk540',
  },
  {
    id: '7893447',
    title: 'Edifier R1280T רמקולים לבן 42W RMS',
    category: 'רמקולים',
    image: 'https://placehold.co/400x400/16213e/FF6B00?text=Edifier',
    specs: ['42W RMS', 'AUX כפול', 'עיצוב רטרו'],
    price: 499,
    inStock: true,
    href: '/items/7893447-edifier-r1280t',
  },
  {
    id: '7893491',
    title: 'Logitech C920 1080p HD Pro Webcam',
    category: 'מצלמות',
    image: 'https://placehold.co/400x400/16213e/FF6B00?text=C920',
    specs: ['Full HD 1080p', '30fps', 'מיקרופון כפול', 'AutoFocus'],
    price: 449,
    originalPrice: 549,
    inStock: true,
    href: '/items/7893491-logitech-c920',
  },
];

// ─── Item detail — Lenovo V15 (https://www.aluf.co.il/items/8804152) ────────
const ITEM_DETAIL = {
  id: '8804152',
  title: 'Lenovo V15 מחשב נייד — AMD Athlon Silver 7120U | 8GB | 256GB NVMe | 15.6"',
  sku: '82YY00BDIV',
  images: [
    'https://psref.lenovo.com/syspool/Sys/Image/Lenovo/Lenovo_V15_Gen_4/Lenovo_V15_Gen_4_CT1_01.png',
    'https://psref.lenovo.com/syspool/Sys/Image/Lenovo/Lenovo_V15_Gen_4/Lenovo_V15_Gen_4_CT1_02.png',
    'https://psref.lenovo.com/syspool/Sys/Image/Lenovo/Lenovo_V15_Gen_4/Lenovo_V15_Gen_4_CT1_03.png',
  ],
  price: 1599,
  originalPrice: 1899,
  descriptionHtml: `
    <p>מחשב נייד <strong>Lenovo V15 Gen 4</strong> — אמין, שקט ויעיל לשימוש יומיומי בבית ובעבודה.</p>
    <p>מופעל על ידי מעבד AMD Athlon Silver 7120U עם גרפיקת Radeon מובנית, 8GB RAM ו-256GB SSD מהיר — מציע ביצועים חלקים לגלישה, עבודה עם Office, ועריכת מסמכים.</p>
    <ul>
      <li>מסך FHD 15.6 אינץ' Anti-Glare בהיר ונוח לעיניים</li>
      <li>מקלדת עברית/אנגלית מלאה עם NumPad</li>
      <li>חיי סוללה של עד 7.5 שעות</li>
      <li>Windows 11 Home מותקן ומורשה</li>
    </ul>
  `,
  specs: [
    'AMD Athlon Silver 7120U (2 ליבות, עד 3.5GHz)',
    '8GB DDR4 RAM',
    '256GB NVMe SSD',
    '15.6" FHD IPS Anti-Glare',
    'AMD Radeon 610M גרפיקה',
    'Windows 11 Home',
    'מקלדת עברית + NumPad',
  ],
  specRows: [
    { label: 'מעבד', value: 'AMD Athlon Silver 7120U — 2 ליבות, עד 3.5GHz' },
    { label: 'זיכרון RAM', value: '8GB DDR4-3200MHz' },
    { label: 'אחסון', value: '256GB M.2 NVMe SSD' },
    { label: 'מסך', value: '15.6" FHD (1920×1080) IPS Anti-Glare' },
    { label: 'כרטיס גרפי', value: 'AMD Radeon 610M (משולב)' },
    { label: 'מצלמה', value: 'HD 720p' },
    { label: 'חיבורים', value: 'USB 3.2 ×2, USB 2.0, HDMI 1.4, RJ-45, 3.5mm' },
    { label: 'Wi-Fi', value: 'Wi-Fi 5 (802.11ac)' },
    { label: 'Bluetooth', value: 'Bluetooth 5.1' },
    { label: 'סוללה', value: '38Wh — עד 7.5 שעות' },
    { label: 'מערכת הפעלה', value: 'Windows 11 Home' },
    { label: 'משקל', value: '1.65 ק"ג' },
    { label: 'צבע', value: 'Business Black' },
    { label: 'אחריות', value: '1 שנה אחריות יצרן' },
  ],
  relatedItems: PRODUCTS.slice(0, 4),
  inStock: true,
};

// ─── Banners ──────────────────────────────────────────────────────────────
const BANNERS = {
  desktop: [
    { image: 'https://placehold.co/1400x400/0f3460/FF6B00?text=Summer+Sale+Up+to+40%25+Off', href: '/596696-מחשבים', alt: 'Summer Sale' },
    { image: 'https://placehold.co/1400x400/16213e/00d4ff?text=New+RTX+5090+In+Stock', href: '/615371-כרטיסי-מסך-NVIDIA', alt: 'RTX 5090' },
    { image: 'https://placehold.co/1400x400/1a1a2e/FF6B00?text=Free+Shipping+On+All+Orders', href: '/', alt: 'Free Shipping' },
  ],
  mobile: [
    { image: 'https://placehold.co/600x300/0f3460/FF6B00?text=Summer+Sale', href: '/596696-מחשבים', alt: 'Summer Sale' },
    { image: 'https://placehold.co/600x300/16213e/00d4ff?text=RTX+5090+In+Stock', href: '/615371-כרטיסי-מסך-NVIDIA', alt: 'RTX 5090' },
  ],
};

// ─── Breadcrumbs ──────────────────────────────────────────────────────────
const CRUMBS_ITEMS = [
  { label: 'ראשי', href: '/' },
  { label: 'ציוד הקפי', href: '/585876-ציוד-הקפי' },
  { label: 'מסכים מחשב', href: '/616355-מסכים-מחשב' },
];

const CRUMBS_ITEM = [
  { label: 'ראשי', href: '/' },
  { label: 'מחשבים', href: '/596696-מחשבים' },
  { label: 'מחשב נייד', href: '/617479-מחשב-נייד' },
  { label: ITEM_DETAIL.title },
];

// ─── Categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { title: 'מחשבים', href: '/596696-מחשבים' },
  { title: 'מסכים מחשב', href: '/616355-מסכים-מחשב' },
  { title: 'מקלדות', href: '/616281-מקלדות' },
  { title: 'עכברים', href: '/616287-עכברים' },
  { title: 'אוזניות', href: '/616295-אוזניות' },
  { title: 'רמקולים', href: '/616294-רמקולים' },
  { title: 'מצלמות', href: '/616301-מצלמות' },
  { title: 'נתבים', href: '/658680-נתבים' },
  { title: 'קונסולות', href: '/596717-קונסולות' },
  { title: 'גיימינג', href: '/596731-גיימינג' },
];

// ─── Inject data based on page type ──────────────────────────────────────
const DATA_BY_TYPE = {
  home: {
    products: PRODUCTS,
    categories: CATEGORIES,
    categoryGroups: [],
    banners: BANNERS,
    itemDetail: null,
    breadcrumbs: [],
    pageTitle: '',
    blogPosts: [],
    blogPostDetail: null,
  },
  items: {
    products: PRODUCTS,
    categories: CATEGORIES,
    categoryGroups: [],
    banners: { desktop: [], mobile: [] },
    itemDetail: null,
    breadcrumbs: CRUMBS_ITEMS,
    pageTitle: 'מסכים מחשב',
    blogPosts: [],
    blogPostDetail: null,
  },
  category: {
    products: [],
    categories: CATEGORIES,
    categoryGroups: [
      { group: 'מחשבים', items: CATEGORIES.slice(0, 4) },
      { group: 'ציוד הקפי', items: CATEGORIES.slice(4, 8) },
    ],
    banners: { desktop: [], mobile: [] },
    itemDetail: null,
    breadcrumbs: [{ label: 'ראשי', href: '/' }, { label: 'ציוד הקפי' }],
    pageTitle: 'ציוד הקפי',
    blogPosts: [],
    blogPostDetail: null,
  },
  item: {
    products: [],
    categories: CATEGORIES,
    categoryGroups: [],
    banners: { desktop: [], mobile: [] },
    itemDetail: ITEM_DETAIL,
    breadcrumbs: CRUMBS_ITEM,
    pageTitle: '',
    blogPosts: [],
    blogPostDetail: null,
  },
  cart: {
    products: [],
    categories: CATEGORIES,
    categoryGroups: [],
    banners: { desktop: [], mobile: [] },
    itemDetail: null,
    breadcrumbs: [{ label: 'ראשי', href: '/' }, { label: 'עגלת קניות' }],
    pageTitle: '',
    blogPosts: [],
    blogPostDetail: null,
  },
};

window.__ALUF_SCRAPED__ = DATA_BY_TYPE[PAGE_TYPE] || DATA_BY_TYPE['home'];
window.__ALUF_DEV_PAGE_TYPE__ = PAGE_TYPE;

// ─── Inject #multilingual_context for item page testing ──────────────────
// Simulates the pipeline-injected div so multilingual title/spec/faq work
// in all three languages without needing a live Konimbo page.
if (PAGE_TYPE === 'item') {
  const MULTILINGUAL_CONTEXT = {
    heb: {
      title: 'Lenovo V15 מחשב נייד — AMD Athlon Silver 7120U | 8GB | 256GB NVMe | 15.6"',
      spec: [
        { key: 'מעבד', value: 'AMD Athlon Silver 7120U — 2 ליבות, עד 3.5GHz' },
        { key: 'זיכרון RAM', value: '8GB DDR4-3200MHz' },
        { key: 'אחסון', value: '256GB M.2 NVMe SSD' },
        { key: 'מסך', value: '15.6" FHD (1920×1080) IPS Anti-Glare' },
        { key: 'כרטיס גרפי', value: 'AMD Radeon 610M (משולב)' },
        { key: 'מערכת הפעלה', value: 'Windows 11 Home' },
        { key: 'אחריות', value: '1 שנה אחריות יצרן' },
      ],
      faq: [
        { question: 'האם המחשב מגיע עם Windows?', answer: 'כן, המחשב מגיע עם Windows 11 Home מותקן ומורשה.' },
        { question: 'האם ניתן לשדרג את הזיכרון?', answer: 'כן, ניתן לשדרג עד 16GB RAM.' },
        { question: 'כמה שעות סוללה?', answer: 'עד 7.5 שעות בשימוש רגיל.' },
      ],
    },
    eng: {
      title: 'Lenovo V15 Laptop — AMD Athlon Silver 7120U | 8GB | 256GB NVMe | 15.6"',
      spec: [
        { key: 'CPU', value: 'AMD Athlon Silver 7120U — 2 cores, up to 3.5GHz' },
        { key: 'RAM', value: '8GB DDR4-3200MHz' },
        { key: 'Storage', value: '256GB M.2 NVMe SSD' },
        { key: 'Display', value: '15.6" FHD (1920×1080) IPS Anti-Glare' },
        { key: 'GPU', value: 'AMD Radeon 610M (integrated)' },
        { key: 'OS', value: 'Windows 11 Home' },
        { key: 'Warranty', value: '1-year manufacturer warranty' },
      ],
      faq: [
        { question: 'Does it come with Windows?', answer: 'Yes, it comes with Windows 11 Home pre-installed and licensed.' },
        { question: 'Can I upgrade the RAM?', answer: 'Yes, upgradeable up to 16GB RAM.' },
        { question: 'How long is the battery life?', answer: 'Up to 7.5 hours of regular use.' },
      ],
    },
    rus: {
      title: 'Ноутбук Lenovo V15 — AMD Athlon Silver 7120U | 8GB | 256GB NVMe | 15.6"',
      spec: [
        { key: 'Процессор', value: 'AMD Athlon Silver 7120U — 2 ядра, до 3.5GHz' },
        { key: 'Память', value: '8GB DDR4-3200MHz' },
        { key: 'Хранилище', value: '256GB M.2 NVMe SSD' },
        { key: 'Экран', value: '15.6" FHD (1920×1080) IPS Anti-Glare' },
        { key: 'Видеокарта', value: 'AMD Radeon 610M (встроенная)' },
        { key: 'ОС', value: 'Windows 11 Home' },
        { key: 'Гарантия', value: '1 год гарантии производителя' },
      ],
      faq: [
        { question: 'Поставляется ли с Windows?', answer: 'Да, поставляется с предустановленной и лицензированной Windows 11 Home.' },
        { question: 'Можно ли увеличить оперативную память?', answer: 'Да, можно увеличить до 16GB RAM.' },
        { question: 'Сколько часов работает батарея?', answer: 'До 7.5 часов при обычном использовании.' },
      ],
    },
  };

  const div = document.createElement('div');
  div.id = 'multilingual_context';
  div.style.display = 'none';
  div.setAttribute('aria-hidden', 'true');
  div.textContent = JSON.stringify(MULTILINGUAL_CONTEXT);
  document.body.appendChild(div);
  console.info('[aluf-dev] #multilingual_context injected with heb/eng/rus data');
}

console.info('[aluf-dev] Mock data injected — page type:', PAGE_TYPE);
