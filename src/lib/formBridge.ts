// src/lib/formBridge.ts

// ── Confirmed Konimbo native form selectors (verified by DOM inspection) ──────
// LOGIN:   '#show_customer_session_form form'
//          fields: 'customer_session[username]' (email), 'customer_session[password]'
// SIGNUP:  '#show_customer_form form'
//          fields: 'customer[full_name]', 'customer[email]', 'customer[mobile_phone]',
//                  'customer[set_password]', 'customer[set_password_confirmation]'
// ACCOUNT EDIT: '/current_customer/edit' — password-only, no form bridge needed

/**
 * Populate input[name] fields inside a native Konimbo form.
 * Keys in `fields` map to [name="{key}"] elements within the form.
 * Returns false if the form element is not found in the DOM.
 */
export function populate(
  formSelector: string,
  fields: Record<string, string>,
): boolean {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return false;
  for (const [name, value] of Object.entries(fields)) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]`,
    );
    if (input) input.value = value;
  }
  return true;
}

/**
 * Submit a native Konimbo form by selector.
 * Returns false if the form element is not found in the DOM.
 * Note: triggers a full browser POST + page navigation — no response to await.
 */
export function submit(formSelector: string): boolean {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return false;
  form.submit();
  return true;
}
