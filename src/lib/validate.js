/** Common email + phone regex validators used across forms. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,}$/;

export const isEmail = (v) => EMAIL_RE.test(String(v || '').trim());
export const isPhone = (v) => PHONE_RE.test(String(v || '').trim());
export const required = (v) => String(v ?? '').trim().length > 0;
export const minLen = (n) => (v) => String(v ?? '').trim().length >= n;

/**
 * Run a set of rules and return an `{ field: errorMessage }` map.
 *  rules = { name: [ [validator, 'msg'], ... ] }
 */
export function validate(values, rules) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const [fn, msg] of fieldRules) {
      if (!fn(values[field])) {
        errors[field] = msg;
        break;
      }
    }
  }
  return errors;
}
