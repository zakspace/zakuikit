/**
 * ZAKUIKit Docs — design token metadata.
 * Mirrors src/styles/tokens.css so the Foundations docs can render tables,
 * swatches and scales from a single description of the token set.
 */

export interface ColorScale {
  name: string;
  tokenPrefix: string;
  shades: Array<{ shade: string; value: string }>;
}

export const paletteScales: ColorScale[] = [
  {
    name: 'Primary · Indigo',
    tokenPrefix: '--zak-primary',
    shades: [
      { shade: '50', value: '#eef1ff' },
      { shade: '100', value: '#e0e5ff' },
      { shade: '200', value: '#c7cfff' },
      { shade: '300', value: '#a5aeff' },
      { shade: '400', value: '#8187fc' },
      { shade: '500', value: '#6366f1' },
      { shade: '600', value: '#4f46e5' },
      { shade: '700', value: '#4338ca' },
      { shade: '800', value: '#3730a3' },
      { shade: '900', value: '#272457' },
    ],
  },
  {
    name: 'Secondary · Cyan',
    tokenPrefix: '--zak-secondary',
    shades: [
      { shade: '100', value: '#cffafe' },
      { shade: '300', value: '#67e8f9' },
      { shade: '500', value: '#06b6d4' },
      { shade: '600', value: '#0891b2' },
      { shade: '700', value: '#0e7490' },
      { shade: '900', value: '#164e63' },
    ],
  },
  {
    name: 'Neutral · Slate',
    tokenPrefix: '--zak-neutral',
    shades: [
      { shade: '100', value: '#f1f5f9' },
      { shade: '200', value: '#e2e8f0' },
      { shade: '300', value: '#cbd5e1' },
      { shade: '400', value: '#94a3b8' },
      { shade: '500', value: '#64748b' },
      { shade: '600', value: '#475569' },
      { shade: '700', value: '#334155' },
      { shade: '800', value: '#1e293b' },
      { shade: '900', value: '#0f172a' },
    ],
  },
  {
    name: 'Success · Emerald',
    tokenPrefix: '--zak-success',
    shades: [
      { shade: '100', value: '#d1fae5' },
      { shade: '300', value: '#6ee7b7' },
      { shade: '500', value: '#10b981' },
      { shade: '600', value: '#059669' },
      { shade: '700', value: '#047857' },
      { shade: '900', value: '#064e3b' },
    ],
  },
  {
    name: 'Warning · Amber',
    tokenPrefix: '--zak-warning',
    shades: [
      { shade: '100', value: '#fef3c7' },
      { shade: '300', value: '#fcd34d' },
      { shade: '500', value: '#f59e0b' },
      { shade: '600', value: '#d97706' },
      { shade: '700', value: '#b45309' },
      { shade: '900', value: '#78350f' },
    ],
  },
  {
    name: 'Danger · Rose',
    tokenPrefix: '--zak-danger',
    shades: [
      { shade: '100', value: '#ffe4e6' },
      { shade: '300', value: '#fda4af' },
      { shade: '500', value: '#f43f5e' },
      { shade: '600', value: '#e11d48' },
      { shade: '700', value: '#be123c' },
      { shade: '900', value: '#881337' },
    ],
  },
  {
    name: 'Info · Sky',
    tokenPrefix: '--zak-info',
    shades: [
      { shade: '100', value: '#e0f2fe' },
      { shade: '300', value: '#7dd3fc' },
      { shade: '500', value: '#0ea5e9' },
      { shade: '600', value: '#0284c7' },
      { shade: '700', value: '#0369a1' },
      { shade: '900', value: '#0c4a6e' },
    ],
  },
];

export interface SemanticToken {
  token: string;
  light: string;
  dark: string;
  usage: string;
}

export const semanticTokens: SemanticToken[] = [
  { token: '--zak-bg-app', light: '#f6f7fb', dark: '#070b14', usage: 'Application canvas' },
  { token: '--zak-bg-surface', light: '#ffffff', dark: '#101827', usage: 'Cards, panels, sheets' },
  { token: '--zak-bg-elevated', light: '#ffffff', dark: '#17203b', usage: 'Popovers, menus, modals' },
  { token: '--zak-bg-sunken', light: '#f1f5f9', dark: '#0b1120', usage: 'Recessed wells, code areas' },
  { token: '--zak-bg-hover', light: 'rgba(15,23,42,.05)', dark: 'rgba(226,232,240,.07)', usage: 'Hover surfaces' },
  { token: '--zak-text-primary', light: '#0f172a', dark: '#f1f5fb', usage: 'Primary copy' },
  { token: '--zak-text-secondary', light: '#43506b', dark: '#a5b2cc', usage: 'Supporting copy' },
  { token: '--zak-text-tertiary', light: '#7c8aa5', dark: '#6c7a99', usage: 'Meta, placeholders' },
  { token: '--zak-border-color', light: 'rgba(15,23,42,.12)', dark: 'rgba(226,232,240,.14)', usage: 'Default borders' },
  { token: '--zak-border-subtle', light: 'rgba(15,23,42,.07)', dark: 'rgba(226,232,240,.08)', usage: 'Hairline separators' },
  { token: '--zak-primary', light: '#4f46e5', dark: '#6366f1', usage: 'Primary actions' },
  { token: '--zak-primary-subtle', light: '#eef1ff', dark: 'rgba(99,102,241,.16)', usage: 'Primary-tinted backgrounds' },
  { token: '--zak-success', light: '#059669', dark: '#34d399', usage: 'Positive status' },
  { token: '--zak-warning', light: '#d97706', dark: '#fbbf24', usage: 'Caution status' },
  { token: '--zak-danger', light: '#e11d48', dark: '#fb7185', usage: 'Destructive status' },
  { token: '--zak-info', light: '#0284c7', dark: '#38bdf8', usage: 'Informational status' },
  { token: '--zak-focus-ring', light: '3px rgba(99,102,241,.32)', dark: '3px rgba(129,135,252,.40)', usage: 'Keyboard focus halo' },
  { token: '--zak-glass-bg', light: 'rgba(255,255,255,.72)', dark: 'rgba(16,24,39,.66)', usage: 'Glassmorphic surfaces' },
  { token: '--zak-backdrop-blur', light: 'saturate(160%) blur(14px)', dark: 'saturate(150%) blur(16px)', usage: 'Glass blur recipe' },
];

export interface ScaleToken {
  token: string;
  value: string;
  pixels: string;
}

export const spacingScale: ScaleToken[] = [
  ['--zak-space-1', '0.25rem', '4px'],
  ['--zak-space-2', '0.5rem', '8px'],
  ['--zak-space-3', '0.75rem', '12px'],
  ['--zak-space-4', '1rem', '16px'],
  ['--zak-space-5', '1.25rem', '20px'],
  ['--zak-space-6', '1.5rem', '24px'],
  ['--zak-space-7', '2rem', '32px'],
  ['--zak-space-8', '2.5rem', '40px'],
  ['--zak-space-9', '3rem', '48px'],
  ['--zak-space-10', '4rem', '64px'],
  ['--zak-space-11', '5rem', '80px'],
  ['--zak-space-12', '6rem', '96px'],
].map(([token, value, pixels]) => ({ token, value, pixels }));

export const radiusScale: ScaleToken[] = [
  ['--zak-radius-sm', '0.25rem', '4px'],
  ['--zak-radius-md', '0.5rem', '8px'],
  ['--zak-radius-lg', '0.75rem', '12px'],
  ['--zak-radius-xl', '1rem', '16px'],
  ['--zak-radius-2xl', '1.25rem', '20px'],
  ['--zak-radius-full', '9999px', 'pill'],
].map(([token, value, pixels]) => ({ token, value, pixels }));

export const shadowScale: Array<{ token: string; usage: string }> = [
  { token: '--zak-shadow-sm', usage: 'Resting cards, inputs' },
  { token: '--zak-shadow-md', usage: 'Hovered cards, dropdowns' },
  { token: '--zak-shadow-lg', usage: 'Popovers, raised panels' },
  { token: '--zak-shadow-xl', usage: 'Modals, drawers, toasts' },
  { token: '--zak-shadow-xxl', usage: 'Primary CTAs, FABs' },
];

export const typeScale: Array<{ token: string; size: string; weight: string; sample: string }> = [
  { token: '--zak-text-5xl', size: '3rem / 48px', weight: '700', sample: 'Display' },
  { token: '--zak-text-4xl', size: '2.25rem / 36px', weight: '700', sample: 'Page title' },
  { token: '--zak-text-3xl', size: '1.875rem / 30px', weight: '700', sample: 'Section heading' },
  { token: '--zak-text-2xl', size: '1.5rem / 24px', weight: '700', sample: 'Card heading' },
  { token: '--zak-text-xl', size: '1.25rem / 20px', weight: '600', sample: 'Modal title' },
  { token: '--zak-text-lg', size: '1.0625rem / 17px', weight: '600', sample: 'Lead paragraph' },
  { token: '--zak-text-base', size: '0.9375rem / 15px', weight: '400', sample: 'Body copy' },
  { token: '--zak-text-md', size: '0.875rem / 14px', weight: '400', sample: 'UI default' },
  { token: '--zak-text-sm', size: '0.8125rem / 13px', weight: '500', sample: 'Captions, labels' },
  { token: '--zak-text-xs', size: '0.75rem / 12px', weight: '500', sample: 'Meta, hints' },
  { token: '--zak-text-2xs', size: '0.6875rem / 11px', weight: '600', sample: 'Badges, overline' },
];

export const breakpoints: Array<{ token: string; value: string; usage: string }> = [
  { token: '--zak-bp-sm', value: '480px', usage: 'Large phones — single column' },
  { token: '--zak-bp-md', value: '768px', usage: 'Tablets — 2-column grids' },
  { token: '--zak-bp-lg', value: '1024px', usage: 'Small laptops — full sidebar' },
  { token: '--zak-bp-xl', value: '1280px', usage: 'Desktops — 3/4-column layouts' },
  { token: '--zak-bp-2xl', value: '1536px', usage: 'Large displays — max content' },
];
