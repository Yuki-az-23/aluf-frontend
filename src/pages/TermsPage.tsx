import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useLang } from '@/i18n';

const LAST_UPDATED = '01/01/2026';
const STORE_NAME   = 'אלוף המחשבים';
const STORE_ADDR   = 'רחוב הרצל 102, ראשון לציון';
const STORE_PHONE  = '053-336-8084';
const STORE_EMAIL  = 'sales@aluf.co.il';

const SECTIONS = [
  {
    title: 'כללי',
    body: `ברוכים הבאים לאתר ${STORE_NAME} (להלן: "האתר"). השימוש באתר ורכישת מוצרים ממנו כפופים לתנאים המפורטים להלן. קריאת והסכמה לתקנון זה מהווה תנאי לשימוש באתר. אם אינך מסכים לתנאי כלשהו, אנא הפסק את השימוש באתר.`,
  },
  {
    title: 'הזמנות ורכישות',
    body: `רכישה באתר מותרת לבני 18 ומעלה בלבד. האתר שומר לעצמו את הזכות לבטל הזמנה במקרה של טעות מוכחת במחיר המוצר, חוסר במלאי, או כל סיבה סבירה אחרת. במקרה כזה יושב החיוב במלואו ולא תהיה ללקוח טענה נוספת. המחירים המוצגים באתר כוללים מע"מ (18%) אלא אם צוין אחרת. התמונות המוצגות הן להמחשה בלבד.`,
  },
  {
    title: 'משלוחים',
    body: `משלוח חינם להזמנות מעל ₪500 לאזור המרכז. זמן אספקה: 2–4 ימי עסקים ממועד אישור ההזמנה. ${STORE_NAME} אינה אחראית לעיכובים שנגרמו על ידי חברת המשלוחים. לאיסוף עצמי: ניתן לאסוף מהחנות ב${STORE_ADDR} בתוך יום עסקים אחד.`,
  },
  {
    title: 'ביטולים והחזרות',
    body: `ניתן לבטל הזמנה תוך 14 ימים מקבלת המוצר בהתאם לחוק הגנת הצרכן. המוצר חייב להיות בחבילתו המקורית, ללא פגם או שימוש. בביטול עסקה יגבו דמי ביטול בהתאם לחוק (עד 5% ממחיר העסקה). לבירורים פנה ל-${STORE_EMAIL} או ל-${STORE_PHONE}.`,
  },
  {
    title: 'אחריות',
    body: `כל המוצרים מגיעים עם אחריות יבואן רשמי ל-3 שנים בבית הלקוח, אלא אם צוין אחרת. האחריות אינה מכסה נזק פיזי, נזמי נוזלים, שימוש לא תקין או פתיחת המוצר שלא על ידי טכנאי מורשה. ${STORE_NAME} אינה אחראית לנזקים עקיפים כלשהם.`,
  },
  {
    title: 'קניין רוחני',
    body: `כל התכנים באתר לרבות טקסטים, תמונות, לוגו ועיצובים הם רכוש בלעדי של ${STORE_NAME} ומוגנים בזכויות יוצרים. אין להעתיק, לשכפל, להפיץ או לעשות כל שימוש מסחרי ללא אישור מפורש בכתב.`,
  },
  {
    title: 'שמירת מידע',
    body: `${STORE_NAME} אוספת מידע אישי לצורך עיבוד הזמנות ושיפור השירות בלבד. המידע אינו נמכר לצד שלישי. לפרטים נוספים ראו מדיניות הפרטיות שלנו.`,
  },
  {
    title: 'שינויים בתקנון',
    body: `${STORE_NAME} שומרת לעצמה את הזכות לשנות תקנון זה בכל עת. שינויים יפורסמו באתר ויכנסו לתוקף מיד עם פרסומם. המשך השימוש באתר לאחר השינוי מהווה הסכמה לתנאים החדשים.`,
  },
  {
    title: 'יצירת קשר',
    body: `לשאלות ובירורים ניתן לפנות אלינו:\n📍 ${STORE_ADDR}\n📞 ${STORE_PHONE}\n✉️ ${STORE_EMAIL}`,
  },
];

export function TermsPage() {
  const { t } = useLang();

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('terms.breadcrumb') },
  ];

  return (
    <Container className="py-8 lg:py-14 max-w-3xl">
      <Breadcrumbs items={crumbs} className="mb-6" />

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <span>📋</span>
          <span>{t('terms.updated')}: {LAST_UPDATED}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-text-main font-display leading-tight">
          {t('terms.title')}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {SECTIONS.map((sec, i) => (
          <section key={i} className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2.5 text-lg font-black text-text-main mb-3">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {sec.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line">{sec.body}</p>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <span className="text-primary text-xl shrink-0 mt-0.5">ℹ️</span>
        <p className="text-sm text-text-muted leading-relaxed">
          תקנון זה נכתב בלשון זכר מטעמי נוחות בלבד ומתייחס לכל המינים. לשאלות משפטיות או עסקיות פנו ל-
          <a href={`mailto:${STORE_EMAIL}`} className="text-primary font-semibold hover:underline">{STORE_EMAIL}</a>.
        </p>
      </div>
    </Container>
  );
}
