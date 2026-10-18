/**
 * ZAKUIKit — "Get Started" guide pages.
 *
 * Single source of truth for the pinned sidebar section, the docs search
 * index and the previous/next chrome shared by every guide page. The
 * Introduction lives at the section root (`/docs/get-started/`); every other
 * guide is a sub-page.
 */

export interface GuidePage {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  keywords: string;
}

export const guideCategory = {
  slug: 'get-started',
  name: 'Get Started',
  icon: 'rocket',
} as const;

export const guidePages: GuidePage[] = [
  {
    slug: 'introduction',
    name: 'Introduction',
    desc: 'What ZAKUIKit is, how the toolkit is layered and where to go next.',
    icon: 'book',
    keywords: 'introduction overview about toolkit getting started what is',
  },
  {
    slug: 'installation',
    name: 'Installation',
    desc: 'Install via npm, the jsDelivr CDN, or two self-hosted files — one build feeds every channel.',
    icon: 'download',
    keywords: 'installation install setup npm jsdelivr cdn package link script download css files',
  },
  {
    slug: 'starter-template',
    name: 'Starter template',
    desc: 'A complete HTML page skeleton plus the production init script — theme boot, auto-registration, delegation.',
    icon: 'code',
    keywords: 'starter template boilerplate skeleton html page example scaffold init bootstrap script theme boot',
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    desc: 'The data-attribute contracts, the self-initialising runtime, the controller API and the toast helper.',
    icon: 'zap',
    keywords: 'javascript js runtime behaviour data attributes toast helper zak refresh controller api modal dropdown tabs accordion',
  },
  {
    slug: 'theming',
    name: 'Theming',
    desc: 'Light and dark via data-theme, and the token layers that drive every component.',
    icon: 'sun',
    keywords: 'theming theme dark mode tokens css variables customise brand colors',
  },
];

/** Introduction is the section root — everything else gets its own sub-page. */
export function guideHref(slug: string): string {
  return slug === 'introduction' ? '/docs/get-started/' : `/docs/get-started/${slug}/`;
}
