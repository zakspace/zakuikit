/**
 * ZAKUIKit Docs — shared string utilities.
 * Pure functions only: safe to import from both server (Astro frontmatter)
 * and client scripts.
 */

/** Convert a human label into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Escape a string for safe interpolation into HTML text/attributes. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Format a number without trailing zeros (1.50 -> 1.5). */
export function nf(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Markdown-lite: escape text, then render `backticked` runs as <code>. */
export function inlineCode(text: string): string {
  return escapeHtml(text)
    .split('`')
    .map((part, index) => (index % 2 === 1 ? `<code>${part}</code>` : part))
    .join('');
}
