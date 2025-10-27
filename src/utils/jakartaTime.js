const Intl = global.Intl || require('intl');

// Helper utilities to consistently produce and parse timestamps in Jakarta time (UTC+7)
// All functions return strings that include the +07:00 offset so they can be stored as-is
// and displayed without further conversion.

const OFFSET_HOURS = 7;

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function toJakartaDate(d = new Date()) {
  // create a Date for the same wall-clock components but interpreted in UTC
  // so that when serialized it carries the +07:00 offset explicitly.
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  // Build an ISO-like string with explicit +07:00 offset
  const isoLocal = `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}+07:00`;
  return isoLocal;
}

function nowJakarta() {
  return toJakartaDate(new Date());
}

function formatJakartaISO(dateInput) {
  const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  return toJakartaDate(d);
}

function parseJakartaLocal(dtstr) {
  // Accept strings like 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss' (no offset) which are
  // intended to mean local Jakarta wall time; return an ISO with +07:00.
  if (!dtstr) return null;
  // If already contains timezone offset or Z, return as-is
  if (/[zZ]|[+-]\d\d:?\d\d$/.test(dtstr)) return dtstr;

  // If date only
  const dateOnlyMatch = dtstr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [_, y, m, d] = dateOnlyMatch;
    return `${y}-${m}-${d}T00:00:00+07:00`;
  }

  // If datetime without offset
  const dtMatch = dtstr.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (dtMatch) {
    const y = dtMatch[1];
    const m = dtMatch[2];
    const d = dtMatch[3];
    const hh = dtMatch[4] || '00';
    const mm = dtMatch[5] || '00';
    const ss = dtMatch[6] || '00';
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}+07:00`;
  }

  // Fallback: try to parse as Date and format in Jakarta
  const parsed = new Date(dtstr);
  if (Number.isNaN(parsed.getTime())) return null;
  return toJakartaDate(parsed);
}

module.exports = {
  toJakartaDate,
  nowJakarta,
  formatJakartaISO,
  parseJakartaLocal
};
