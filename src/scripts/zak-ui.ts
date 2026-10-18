/**
 * ZAKUIKit — Global Entry Point for Distributable Bundle
 *
 * This module:
 * 1. Initializes all core runtimes (theme, overlays, behaviors, controllers)
 * 2. Exposes `window.ZakUI` global API with facade methods
 * 3. Ensures ALL interactive behavior uses document-level event delegation
 *    so components work on dynamically injected HTML without re-initialization.
 */
import './theme';
import './overlays';
import './behaviors';
import './calendar';
import './pickers';
import './media';
import './ai';
import './charts';
import './grid';
import './controllers';

import { snackbar, toast } from './behaviors';
import { createChart, renderChart, scanCharts, type ChartConfig } from './charts';
import { ZakCarousel, type ZakCarouselOptions } from './media';
import {
  init,
  ZakModal,
  ZakDrawer,
  ZakDropdown,
  ZakTabs,
  ZakAccordion,
  ZakCollapse,
  ZakTooltip,
  ZakButton,
  ZakSnackbar,
  ZakToast,
} from './controllers';

/* --------------------------------------------------------------------------
   Theme Facade — matches spec: ZakUI.theme.set('light'|'dark'|'system')
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'zak-theme';
const root = document.documentElement;

function systemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark', persist: boolean): void {
  root.dataset.theme = theme;
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
  }
  const meta = document.querySelector<HTMLMetaElement>('[data-theme-color]');
  if (meta) meta.content = theme === 'dark' ? '#070b14' : '#f6f7fb';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
  document.dispatchEvent(new CustomEvent('zak:theme', { detail: { theme } }));
}

/* --------------------------------------------------------------------------
   Modal Facade — ZakUI.modal.open(selector|element)
   -------------------------------------------------------------------------- */
const modalFacade = {
  open(target: string | HTMLDialogElement): ZakModal {
    const modal = typeof target === 'string' ? document.querySelector<HTMLDialogElement>(target) : target;
    if (!modal) throw new Error(`ZAKUIKit: modal target "${String(target)}" not found`);
    if (!modal.open) modal.showModal();
    return new ZakModal(modal);
  },
  close(target: string | HTMLDialogElement): void {
    const modal = typeof target === 'string' ? document.querySelector<HTMLDialogElement>(target) : target;
    modal?.close();
  },
};

/* --------------------------------------------------------------------------
   Chart Facade — ZakChart.create(host, config) / ZakUI.chart(host, config)
   -------------------------------------------------------------------------- */
const ZakChart = {
  /** Mount a Chart.js-style config onto a host and return { update, destroy }. */
  create: createChart,
  /** Render a config to an SVG markup string without touching the DOM. */
  render: renderChart,
  /** Mount every `[data-zak-chart]` host in a subtree. */
  scan: scanCharts,
};

/* --------------------------------------------------------------------------
   Expose window.ZakUI (camelCase to match IIFE bundle)
   -------------------------------------------------------------------------- */
const ZakUI = {
  /** Initialize all `[data-zak-component]` controllers in a subtree (default: document). */
  init(root: ParentNode = document): unknown[] {
    return init(root);
  },

  /** Theme control: set('light') | set('dark') | set('system') | get() */
  theme: {
    set(mode: 'light' | 'dark' | 'system'): void {
      const theme = mode === 'system' ? systemTheme() : mode;
      applyTheme(theme, mode !== 'system');
    },
    get(): 'light' | 'dark' {
      return root.dataset.theme === 'dark' ? 'dark' : 'light';
    },
    toggle(): void {
      const next = ZakUI.theme.get() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    },
  },

  /** Toast notifications — ZakUI.toast(title, tone?, options?) */
  toast,

  /** Snackbars — ZakUI.snackbar(message, { actionLabel, onAction, duration }) */
  snackbar,

  /** Modal control — ZakUI.modal.open(selector) */
  modal: modalFacade,

  /** Charts — ZakUI.chart(host, config) with a Chart.js-shaped config object. */
  chart(target: HTMLElement | string, config: ChartConfig = {}): ReturnType<typeof createChart> {
    return createChart(target, config);
  },
  ZakChart,

  /** Carousel — ZakUI.carousel(el|selector, options) mounts a ZakCarousel. */
  carousel(target: HTMLElement | string, options: ZakCarouselOptions = {}): ZakCarousel {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) throw new Error(`ZAKUIKit: carousel target "${String(target)}" not found`);
    return new ZakCarousel(el, options);
  },
  ZakCarousel,

  /** Controller classes for imperative use */
  ZakButton,
  ZakModal,
  ZakDrawer,
  ZakDropdown,
  ZakTabs,
  ZakAccordion,
  ZakCollapse,
  ZakTooltip,
  ZakToast,
  ZakSnackbar,
};

/* Merge into any existing global (IIFE bundle, docs entry, manual script tags) */
const globalScope = window as unknown as Window & { ZakUI?: typeof ZakUI; ZakChart?: typeof ZakChart };
globalScope.ZakUI = Object.assign(globalScope.ZakUI ?? {}, ZakUI);
globalScope.ZakChart = ZakChart;

/* Auto-initialize controllers on DOMContentLoaded for drop-in usage */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ZakUI.init());
} else {
  ZakUI.init();
}

export { ZakUI };
export { ZakChart };
export { snackbar, toast } from './behaviors';
export { createChart, renderChart, scanCharts } from './charts';
export type { ChartConfig, ChartDataset, ChartOptions, ZakChartInstance } from './charts';
export { ZakCarousel } from './media';
export type { ZakCarouselOptions } from './media';
export * from './controllers';