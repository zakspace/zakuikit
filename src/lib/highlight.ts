/**
 * ZAKUIKit Docs — dependency-free syntax highlighter.
 *
 * A tokenizing highlighter for the three languages used in the docs:
 *   html · css · js
 * Tokens are matched with a single ordered alternation per language (strings
 * and comments win over everything else), then every unmatched slice is
 * HTML-escaped, so output is always injection-safe.
 */
import { escapeHtml } from './strings';

export type Lang = 'html' | 'css' | 'js';

const HTML_RE = new RegExp(
  [
    '(?<com><!--[\\s\\S]*?-->)',
    '(?<str>"[^"]*"|\'[^\']*\')',
    '(?<tag></?[a-zA-Z][a-zA-Z0-9-]*)',
    '(?<attr>[a-zA-Z@:_][\\w:.-]*)(?==)',
    '(?<num>#?\\b\\d+(?:\\.\\d+)?\\b)(?![\\w-])',
    '(?<punct>/?>|</)',
    '(?<entity>&[a-z#0-9]+;)',
  ].join('|'),
  'g',
);

const CSS_RE = new RegExp(
  [
    '(?<com>/\\*[\\s\\S]*?\\*/)',
    '(?<str>"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')',
    '(?<var>--[\\w-]+)',
    '(?<kw>@[\\w-]+)',
    '(?<selector>\\.[\\w-]+|#(?![0-9a-fA-F]{3,8}\\b)[\\w-]+|::?[\\w-]+(?:\\([^)]*\\))?)',
    '(?<prop>[a-zA-Z-]+)(?=\\s*:)',
    '(?<fn>var|calc|color-mix|clamp|min|max|linear-gradient|radial-gradient|conic-gradient|translateX|translateY|scale|rotate|minmax|repeat|auto-fit|auto-fill)(?=\\()',
    '(?<num>#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|s|ms|vh|vw|dvh|vmin|ch|fr|deg|dpi)?\\b)',
  ].join('|'),
  'g',
);

const JS_RE = new RegExp(
  [
    '(?<com>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '(?<str>\'(?:[^\'\\\\]|\\\\.)*\'|"(?:[^"\\\\]|\\\\.)*"|`(?:[^`\\\\]|\\\\.)*`)',
    '(?<kw>\\b(?:const|let|var|function|return|if|else|for|of|in|import|export|from|new|class|extends|this|async|await|try|catch|finally|throw|typeof|instanceof|void|delete|do|while|switch|case|break|continue|default|yield|static|true|false|null|undefined)\\b)',
    '(?<fn>[a-zA-Z_$][\\w$]*)(?=\\()',
    '(?<num>\\b\\d+(?:\\.\\d+)?\\b)',
    '(?<punct>[{}()\\[\\];,.=+\\-*/&|!<>:?])',
    '(?<prop>[a-zA-Z_$][\\w$]*)(?=\\s*:)',
  ].join('|'),
  'g',
);

const GRAMMARS: Record<Lang, RegExp> = { html: HTML_RE, css: CSS_RE, js: JS_RE };

export function highlight(code: string, lang: Lang): string {
  const grammar = GRAMMARS[lang] ?? GRAMMARS.html;
  let out = '';
  let last = 0;
  let match: RegExpExecArray | null;

  grammar.lastIndex = 0;
  while ((match = grammar.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, match.index));
    const groups = match.groups ?? {};
    const entry = Object.entries(groups).find(([, value]) => value !== undefined);
    if (entry) {
      const [cls, text] = entry;
      out += `<span class="tok-${cls}">${escapeHtml(text as string)}</span>`;
    } else {
      out += escapeHtml(match[0]);
    }
    last = match.index + match[0].length;
    if (match[0].length === 0) grammar.lastIndex++; // guard against zero-width loops
  }
  out += escapeHtml(code.slice(last));
  return out;
}
