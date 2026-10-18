/**
 * Playground controller — re-renders the preview and the HTML tab from the
 * embedded template whenever a control changes. Reuses the same isomorphic
 * renderer and highlighter as the build, so client output matches the
 * server-rendered markup byte for byte.
 *
 * After each re-render a `zak:refresh` event is dispatched so the demo
 * behaviour modules can initialise markup that was just replaced.
 */
import { renderTemplate } from '../lib/template';
import { highlight } from '../lib/highlight';
import { setHtml } from './dom';

type Vars = Record<string, string | number | boolean>;

interface PlaygroundConfig {
  tpl: string;
  codeTpl: string | null;
  defaults: Vars;
}

function siteTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function initPlayground(root: HTMLElement): void {
  const configEl = root.querySelector<HTMLScriptElement>('[data-playground-config]');
  if (!configEl) return;

  let config: PlaygroundConfig;
  try {
    config = JSON.parse(configEl.textContent ?? '{}') as PlaygroundConfig;
  } catch {
    return;
  }

  const preview = root.querySelector<HTMLElement>('[data-playground-preview]');
  const codeEl = root.querySelector<HTMLElement>('[data-playground-html]');
  const themeButton = root.querySelector<HTMLButtonElement>('[data-playground-theme]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-playground-reset]');
  const fields = Array.from(
    root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-control]'),
  );
  const outputs = Array.from(root.querySelectorAll<HTMLElement>('[data-control-out]'));

  const vars: Vars = { ...config.defaults };
  let invertTheme = false;

  function syncThemeScope(): void {
    if (!preview) return;
    if (invertTheme) preview.dataset.theme = siteTheme() === 'dark' ? 'light' : 'dark';
    else delete preview.dataset.theme;
    themeButton?.setAttribute('aria-pressed', String(invertTheme));
    themeButton?.classList.toggle('is-active', invertTheme);
  }

  function readValues(): void {
    for (const field of fields) {
      const name = field.dataset.control;
      if (!name) continue;
      if (field instanceof HTMLInputElement && field.type === 'checkbox') vars[name] = field.checked;
      else if (field instanceof HTMLInputElement && field.type === 'range')
        vars[name] = Number(field.value);
      else vars[name] = field.value;
    }
  }

  function syncRangeUI(): void {
    for (const field of fields) {
      if (!(field instanceof HTMLInputElement) || field.type !== 'range') continue;
      const min = Number(field.min || 0);
      const max = Number(field.max || 100);
      const span = max - min || 1;
      const pct = Math.round(((Number(field.value) - min) / span) * 100);
      field.style.setProperty('--zak-range-fill', `${pct}%`);
    }
    for (const output of outputs) {
      const name = output.dataset.controlOut;
      if (name && vars[name] !== undefined) output.textContent = String(vars[name]);
    }
  }

  function render(): void {
    readValues();
    if (preview) setHtml(preview, renderTemplate(config.tpl, vars));
    if (codeEl) {
      setHtml(codeEl, highlight(renderTemplate(config.codeTpl ?? config.tpl, vars), 'html'));
    }
    syncRangeUI();
    document.dispatchEvent(new CustomEvent('zak:refresh', { detail: { root: preview } }));
  }

  for (const field of fields) {
    const useChange =
      field instanceof HTMLSelectElement ||
      (field instanceof HTMLInputElement && field.type === 'checkbox');
    field.addEventListener(useChange ? 'change' : 'input', render);
  }

  themeButton?.addEventListener('click', () => {
    invertTheme = !invertTheme;
    syncThemeScope();
  });
  document.addEventListener('zak:theme', syncThemeScope);

  resetButton?.addEventListener('click', () => {
    for (const field of fields) {
      const name = field.dataset.control;
      if (!name) continue;
      const fallback = config.defaults[name];
      if (field instanceof HTMLInputElement && field.type === 'checkbox')
        field.checked = fallback === true;
      else field.value = String(fallback ?? '');
    }
    render();
  });

  syncThemeScope();
  render();
}

document.querySelectorAll<HTMLElement>('[data-playground]').forEach(initPlayground);
