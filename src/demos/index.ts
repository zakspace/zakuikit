/**
 * ZAKUIKit Docs — the demo registry.
 * Every catalogue component maps to exactly one DemoDef. This module merges
 * the per-category modules and guards, at build time, that nothing is missing
 * and that no slug collides across categories.
 */
import type { DemoDef } from './types';
import { catalog } from '../data/catalog';

import { foundationsDemos } from './foundations';
import { utilitiesDemos } from './utilities';
import { layoutDemos } from './layout';
import { buttonDemos } from './buttons';
import { formDemos } from './forms';
import { formAdvancedDemos } from './forms-advanced';
import { pickerDemos } from './pickers';
import { displayDemos } from './display';
import { tableDemos } from './tables';
import { gridDemos } from './grid';
import { navigationDemos } from './navigation';
import { feedbackDemos } from './feedback';
import { overlayDemos } from './overlays';
import { disclosureDemos } from './disclosure';
import { mediaDemos } from './media';
import { datavizDemos } from './dataviz';
import { aiDemos } from './ai';

export const demos: Record<string, DemoDef> = {
  ...foundationsDemos,
  ...utilitiesDemos,
  ...layoutDemos,
  ...buttonDemos,
  ...formDemos,
  ...formAdvancedDemos,
  ...pickerDemos,
  ...displayDemos,
  ...tableDemos,
  ...gridDemos,
  ...navigationDemos,
  ...feedbackDemos,
  ...overlayDemos,
  ...disclosureDemos,
  ...mediaDemos,
  ...datavizDemos,
  ...aiDemos,
};

export function getDemo(slug: string): DemoDef | undefined {
  return demos[slug];
}

/* ---------------------------------------------------------------------------
   Build-time guards — fail the build loudly instead of shipping a page with
   an empty playground.
   --------------------------------------------------------------------------- */
{
  const seen = new Map<string, string>();
  const missing: string[] = [];
  const duplicates: string[] = [];

  for (const cat of catalog) {
    for (const comp of cat.components) {
      const previous = seen.get(comp.slug);
      if (previous) duplicates.push(`${comp.slug} (${previous} + ${cat.slug})`);
      seen.set(comp.slug, cat.slug);

      if (!(comp.slug in demos)) missing.push(`${cat.slug}/${comp.slug}`);
    }
  }

  if (missing.length) {
    throw new Error(`Demo registry is missing ${missing.length} component(s): ${missing.join(', ')}`);
  }
  if (duplicates.length) {
    throw new Error(`Demo slugs collide across categories — one was silently dropped: ${duplicates.join(', ')}`);
  }
}
