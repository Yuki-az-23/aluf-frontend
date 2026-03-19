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

// ─── Item detail (item page) ───────────────────────────────────────────────
const ITEM_DETAIL = {
  id: '7893524',
  title: 'Solid F272P1 FHD IPS 27" Monitor — HDMI VGA רמקולים',
  sku: 'F272P1',
  images: [
    'https://placehold.co/800x800/1a1a2e/FF6B00?text=Monitor+Front',
    'https://placehold.co/800x800/1a1a2e/FF6B00?text=Monitor+Side',
    'https://placehold.co/800x800/1a1a2e/FF6B00?text=Monitor+Back',
  ],
  price: 899,
  originalPrice: 1099,
  descriptionHtml: '<p>מסך IPS איכותי 27 אינץ\' ברזולוציה Full HD, מתאים לעבודה, לימודים וגיימינג קל. כולל חיבורי HDMI ו-VGA, רמקולים מובנים, וזמן תגובה של 5ms.</p><p>מגיע עם אחריות יצרן 3 שנים.</p>',
  specs: [
    'גודל מסך: 27 אינץ\'',
    'פאנל: IPS',
    'רזולוציה: 1920×1080 FHD',
    'זמן תגובה: 5ms',
    'קצב רענון: 75Hz',
    'חיבורים: HDMI + VGA',
    'רמקולים מובנים: כן',
  ],
  specRows: [
    { label: 'גודל מסך', value: '27 אינץ\'' },
    { label: 'סוג פאנל', value: 'IPS' },
    { label: 'רזולוציה', value: '1920×1080 Full HD' },
    { label: 'קצב רענון', value: '75Hz' },
    { label: 'זמן תגובה', value: '5ms GTG' },
    { label: 'חיבורים', value: 'HDMI 1.4 / VGA' },
    { label: 'רמקולים', value: '2×2W מובנים' },
    { label: 'צבע', value: 'שחור' },
    { label: 'אחריות', value: '3 שנים' },
  ],
  relatedItems: PRODUCTS.slice(1, 5),
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
  { label: 'ציוד הקפי', href: '/585876-ציוד-הקפי' },
  { label: 'מסכים מחשב', href: '/616355-מסכים-מחשב' },
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

console.info('[aluf-dev] Mock data injected — page type:', PAGE_TYPE);
