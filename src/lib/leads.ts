/**
 * Centralised lead submission via postMessage → Konimbo parent script → POST /tickets
 *
 * Each placement has its own source identifier so tickets are distinguishable
 * in the Konimbo admin. The `message` field carries a JSON string that includes
 * placement metadata + the user's own message text.
 *
 * Konimbo parent script maps:
 *   d.name    → ticket[customer_name]
 *   d.phone   → ticket[customer_phone]
 *   d.email   → ticket[customer_email]
 *   d.message → ticket[content]        ← we put structured JSON here
 *   item_id   → ticket[item_id]        (hardcoded on Konimbo side)
 */

export interface LeadSource {
  placement: string;   // machine key  — e.g. 'newsletter-homepage'
  label: string;       // Hebrew label  — shown in ticket[content]
  page?: string;       // optional page slug for filtering
}

export interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  message?: string;    // optional free-text from the user
  item_id?: string;    // pass when submitting from an item page
  source: LeadSource;
}

/** All placement sources in one place — add new ones here as forms are built */
export const LEAD_SOURCES = {
  // Homepage forms
  NEWSLETTER:    { placement: 'newsletter-homepage',  label: 'ניוזלטר — דף הבית',       page: 'home'     },
  // Homepage contact — service-specific
  LAB_SERVICE:   { placement: 'contact-lab',          label: 'שירותי מעבדה — דף הבית',  page: 'home'     },
  GAMING_PC:     { placement: 'contact-gaming',       label: 'מחשב גיימינג — דף הבית',  page: 'home'     },
  CONSULTATION:  { placement: 'contact-consult',      label: 'ייעוץ טכני — דף הבית',    page: 'home'     },
  ORDER_SUPPORT: { placement: 'contact-order',        label: 'תמיכה בהזמנה — דף הבית',  page: 'home'     },
  BUSINESS:      { placement: 'contact-business',     label: 'פנייה עסקית — דף הבית',   page: 'home'     },
  BULK_ORDER:    { placement: 'contact-bulk',         label: 'הזמנה כמותית — דף הבית',  page: 'home'     },
  // Item page
  ITEM_FAQ:      { placement: 'item-faq',             label: 'שאלת מוצר — עמוד פריט',   page: 'item'     },
  ITEM_CONTACT:  { placement: 'item-contact',         label: 'צור קשר — עמוד פריט',     page: 'item'     },
  // Workshop page
  WORKSHOP_LAB:  { placement: 'workshop-lab',         label: 'שירותי מעבדה — ורקשופ',   page: 'workshop' },
  WORKSHOP_HOME: { placement: 'workshop-home',        label: 'טכנאי עד הבית — ורקשופ',  page: 'workshop' },
  WORKSHOP_BIZ:  { placement: 'workshop-biz',         label: 'עסקים — ורקשופ',           page: 'workshop' },
  // Other pages
  CANCEL_ORDER:  { placement: 'cancel-order',          label: 'ביטול עסקה — צור קשר',    page: 'contact'  },
  JOB_APPLICATION: { placement: 'job-application',    label: 'מועמדות לתפקיד — דרושים',  page: 'careers'  },
  CART_CONTACT:  { placement: 'cart-contact',         label: 'צור קשר — עגלה',          page: 'cart'     },
  PC_BUILDER:    { placement: 'pc-builder',           label: 'בנה מחשב — מבנה',         page: 'builder'  },
  GENERAL:       { placement: 'general-contact',      label: 'צור קשר כללי',             page: 'contact'  },
} as const satisfies Record<string, LeadSource>;

/**
 * Send a lead to the Konimbo parent frame.
 * Returns a Promise that resolves when SUBMISSION_SUCCESS is received,
 * or rejects after 10 s timeout.
 */
export function sendLead(payload: LeadPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Lead submission timed out'));
    }, 10_000);

    const handler = (ev: MessageEvent) => {
      if (ev.data?.type === 'SUBMISSION_SUCCESS') {
        clearTimeout(timer);
        window.removeEventListener('message', handler);
        resolve();
      }
    };
    window.addEventListener('message', handler);

    const content = JSON.stringify({
      placement: payload.source.placement,
      label:     payload.source.label,
      page:      payload.source.page ?? '',
      message:   payload.message ?? '',
    });

    window.parent.postMessage({
      type: 'FAQ_LEAD_SUBMISSION',
      payload: {
        name:    payload.name,
        phone:   payload.phone,
        email:   payload.email || 'null@null.co.il',
        message: content,
        ...(payload.item_id ? { item_id: payload.item_id } : {}),
      },
    }, '*');
  });
}
