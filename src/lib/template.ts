/**
 * ZAKUIKit Docs — mustache-lite template renderer.
 *
 * Supported syntax:
 *   {{name}}            interpolate (HTML-escaped)
 *   {{{name}}}          interpolate (raw)
 *   {{#name}}...{{/name}}   section, rendered when value is truthy
 *   {{^name}}...{{/name}}   inverted section, rendered when falsy
 *
 * The same module renders previews at build time (Astro frontmatter) and in
 * the browser (playground controls), so behaviour is byte-for-byte identical.
 */
import { escapeHtml } from './strings';

export type TplValue = string | number | boolean | null | undefined;
export type TplVars = Record<string, TplValue>;

function truthy(value: TplValue): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.length > 0 && value !== 'false' && value !== '0';
  return Boolean(value);
}

export function renderTemplate(tpl: string, vars: TplVars): string {
  let out = tpl;

  // Sections (innermost first, loop to support nesting).
  const sectionRe = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  for (let i = 0; i < 12 && sectionRe.test(out); i++) {
    sectionRe.lastIndex = 0;
    out = out.replace(sectionRe, (_m, key: string, body: string) =>
      truthy(vars[key]) ? body : '',
    );
  }

  // Inverted sections.
  const inverseRe = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  for (let i = 0; i < 12 && inverseRe.test(out); i++) {
    inverseRe.lastIndex = 0;
    out = out.replace(inverseRe, (_m, key: string, body: string) =>
      truthy(vars[key]) ? '' : body,
    );
  }

  // Raw interpolation first (triple braces), then escaped interpolation.
  out = out.replace(/\{\{\{(\w+)\}\}\}/g, (_m, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? '' : String(value);
  });
  out = out.replace(/(?<!\{)\{\{(\w+)\}\}(?!\})/g, (_m, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? '' : escapeHtml(String(value));
  });

  return out;
}

/** Collect all placeholder names referenced by a template. */
export function templateVars(tpl: string): string[] {
  const found = new Set<string>();
  const re = /\{\{[#^/]?\{?(\w+)\}?\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(tpl)) !== null) {
    found.add(match[1]);
  }
  return [...found];
}
