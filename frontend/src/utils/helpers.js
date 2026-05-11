import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

// ─── Date ──────────────────────────────────────────────────────────────────
export const fromNow   = (date) => dayjs(date).fromNow();
export const formatTime = (date) => dayjs(date).format('HH:mm');
export const formatDate = (date) => dayjs(date).format('D MMM YYYY');

// ─── Numbers ───────────────────────────────────────────────────────────────
export const formatCount = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

// ─── Strings ───────────────────────────────────────────────────────────────
export const truncate = (str = '', max = 100) =>
  str.length > max ? str.slice(0, max) + '…' : str;

export const initials = (username = '') =>
  username.slice(0, 2).toUpperCase();

// ─── Validation ────────────────────────────────────────────────────────────
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Image ─────────────────────────────────────────────────────────────────
export const getAspectRatio = (width, height) =>
  width && height ? width / height : 1;

// ─── Array ─────────────────────────────────────────────────────────────────
export const groupByDate = (items = [], key = 'createdAt') => {
  return items.reduce((groups, item) => {
    const date = dayjs(item[key]).format('YYYY-MM-DD');
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});
};

// ─── Debounce ──────────────────────────────────────────────────────────────
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
