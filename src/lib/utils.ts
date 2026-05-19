import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function generateQrCode(prefix = 'QR'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return `${prefix}${random}`;
}

export function translateDbText(text: string | null | undefined, lang: string): string {
  if (!text) return '';
  
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 1. Try JSON parsing
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const obj = JSON.parse(trimmed);
      const normalizedLang = lang.toLowerCase();
      if (obj[normalizedLang]) return obj[normalizedLang];
      const shortLang = normalizedLang.split('-')[0];
      if (obj[shortLang]) return obj[shortLang];
      return obj['it'] || obj['en'] || obj['sq'] || Object.values(obj)[0] || text;
    } catch (e) {
      // ignore
    }
  }

  // 2. Try explicit language tags like "it: ciao | en: hello | sq: tungjatjeta"
  const tagRegex = /(?:^|\||\/)\s*(it|en|sq|sq-AL|en-US|it-IT|IT|EN|SQ)\s*:\s*([^|/]+)/gi;
  const matches = [...trimmed.matchAll(tagRegex)];
  if (matches.length > 0) {
    const dict: Record<string, string> = {};
    for (const match of matches) {
      const l = match[1].toLowerCase().split('-')[0];
      dict[l] = match[2].trim();
    }
    const normalizedLang = lang.toLowerCase().split('-')[0];
    if (dict[normalizedLang]) return dict[normalizedLang];
    return dict['it'] || dict['en'] || dict['sq'] || Object.values(dict)[0] || text;
  }

  // 3. Try positional separation with | or / (assuming it | en | sq)
  if (trimmed.includes('|') || trimmed.includes('/')) {
    const delimiter = trimmed.includes('|') ? '|' : '/';
    const parts = trimmed.split(delimiter).map(p => p.trim());
    const normalizedLang = lang.toLowerCase().split('-')[0];
    if (normalizedLang === 'it') {
      return parts[0] || text;
    } else if (normalizedLang === 'en') {
      return parts[1] || parts[0] || text;
    } else if (normalizedLang === 'sq') {
      return parts[2] || parts[1] || parts[0] || text;
    }
  }

  // 4. Fallback
  return text;
}
