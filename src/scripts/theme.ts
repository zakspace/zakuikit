/**
 * Theme switcher — localStorage persistence, system preference listener and
 * a `zak:theme` event so the playground can re-scope its preview.
 */

const STORAGE_KEY = 'zak-theme';
const root = document.documentElement;

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme(): Theme {
  return root.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme, persist: boolean): void {
  root.dataset.theme = theme;

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode — the theme still applies for this session */
    }
  }

  const meta = document.querySelector<HTMLMetaElement>('[data-theme-color]');
  if (meta) meta.content = theme === 'dark' ? '#070b14' : '#f6f7fb';

  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    );
  });

  document.dispatchEvent(new CustomEvent('zak:theme', { detail: { theme } }));
}

document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (stored === 'light' || stored === 'dark') return;
  applyTheme(event.matches ? 'dark' : 'light', false);
});

// Sync toggle state and the theme-color meta with the inline head boot.
applyTheme(root.dataset.theme === 'dark' ? 'dark' : systemTheme(), false);
