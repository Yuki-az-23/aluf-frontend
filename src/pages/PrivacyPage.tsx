import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useLang } from '@/i18n';

const LAST_UPDATED = '01/01/2026';
const STORE_NAME   = 'אלוף המחשבים';
const STORE_EMAIL  = 'sales@aluf.co.il';
const STORE_PHONE  = '053-336-8084';

const SECTIONS = [
  {
    icon: '🔍',
    title: 'איזה מידע אנו אוספים?',
    body: `אנו אוספים מידע שאתה מסרת מרצונך בעת ביצוע רכישה או פנייה לשירות לקוחות:\n• שם מלא\n• מספר טלפון ודוא"ל\n• כתובת למשלוח\n• נתוני תשלום (מעובדים ישירות על ידי מערכת הסליקה המאובטחת – אין גישה לפרטי כרטיס אשראי)\n\nכמו כן, אנו עשויים לאסוף מידע טכני: כתובת IP, סוג הדפדפן, עמודים שנצפו ומשך הביקור – לצרכי שיפור האתר בלבד.`,
  },
  {
    icon: '🎯',
    title: 'כיצד אנו משתמשים במידע?',
    body: `המידע נאסף לצורך:\n• עיבוד הזמנות ותיאום משלוחים\n• שירות לקוחות ומענה לפניות\n• שליחת עדכונים על הזמנות (SMS / דוא"ל)\n• שיפור חוויית הגלישה באתר\n• שליחת ניוזלטר ומבצעים – רק לאחר הסכמה מפורשת\n\nלא נעשה שימוש במידעך לכל מטרה אחרת ללא הסכמתך.`,
  },
  {
    icon: '🔒',
    title: 'אבטחת מידע',
    body: `האתר מאובטח בתקן SSL/TLS. תשלומים מעובדים על ידי מערכת סליקה מאושרת PCI-DSS. פרטי כרטיסי האשראי אינם נשמרים בשרתינו.\n\nאנו נוקטים באמצעי אבטחה מתאימים למניעת גישה לא מורשית, עם זאת, אין אבטחה מוחלטת ברשת.`,
  },
  {
    icon: '🍪',
    title: 'עוגיות (Cookies)',
    body: `האתר משתמש בקובצי עוגיות לצרכים הבאים:\n• שמירת פריטים בסל הקניות\n• זכירת העדפות שפה ותצוגה\n• ניתוח תנועה (Google Analytics – מידע אנונימי בלבד)\n\nניתן לנהל או למחוק עוגיות בהגדרות הדפדפן שלך. מחיקתן עלולה להשפיע על פונקציונליות מסוימת.`,
  },
  {
    icon: '🤝',
    title: 'שיתוף עם צדדים שלישיים',
    body: `אנו לא מוכרים, סוחרים או מעבירים את המידע האישי שלך לצדדים שלישיים, למעט:\n• שירותי משלוחים – לצורך אספקת ההזמנה בלבד\n• מערכת הסליקה – לעיבוד תשלומים בלבד\n• ספקי ענן – לתחזוקת שרתים בתנאי סודיות\n\nבמקרה של דרישה חוקית, נשתף מידע עם הרשויות המוסמכות בלבד.`,
  },
  {
    icon: '✏️',
    title: 'זכויותיך',
    body: `בהתאם לחוק הגנת הפרטיות (ישראל), יש לך הזכות:\n• לבקש לראות את המידע שנשמר עליך\n• לבקש תיקון של מידע שגוי\n• לבקש מחיקת המידע שלך\n• לבטל הסכמה לקבלת דיוור שיווקי בכל עת\n\nלמימוש זכויות אלו פנה ל-${STORE_EMAIL}`,
  },
  {
    icon: '📅',
    title: 'שינויים במדיניות',
    body: `${STORE_NAME} שומרת לעצמה את הזכות לעדכן מדיניות זו. שינויים מהותיים יפורסמו באתר וייכנסו לתוקף 7 ימים לאחר פרסומם. תאריך העדכון האחרון מופיע בראש הדף.`,
  },
  {
    icon: '📬',
    title: 'יצירת קשר',
    body: `לכל שאלה בנוגע לפרטיות:\n📞 ${STORE_PHONE}\n✉️ ${STORE_EMAIL}`,
  },
];

export function PrivacyPage() {
  const { t } = useLang();

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('privacy.breadcrumb') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-3xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <span>🔒</span>
          <span>{t('privacy.updated')}: {LAST_UPDATED}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-text-main font-display leading-tight">
          {t('privacy.title')}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
        <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-xl">
          ב-{STORE_NAME} אנו מחויבים להגן על פרטיותך. מדיניות זו מסבירה אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם ומהן זכויותיך.
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {SECTIONS.map((sec, i) => (
          <section key={i} className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-3 text-base font-black text-text-main mb-3">
              <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                {sec.icon}
              </span>
              {sec.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">{sec.body}</p>
          </section>
        ))}
      </div>

      {/* GDPR / Law note */}
      <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <span className="text-primary text-xl shrink-0 mt-0.5">⚖️</span>
        <p className="text-sm text-text-muted leading-relaxed">
          מדיניות זו עומדת בדרישות חוק הגנת הפרטיות, תשמ"א-1981 ותקנות הגנת הפרטיות (אבטחת מידע), תשע"ז-2017.
          לשאלות משפטיות פנו ל-
          <a href={`mailto:${STORE_EMAIL}`} className="text-primary font-semibold hover:underline">{STORE_EMAIL}</a>.
        </p>
      </div>
    </Container>
  );
}
