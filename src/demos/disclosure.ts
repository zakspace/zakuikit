/**
 * Demos — Disclosure & Expansion: accordion, collapse, expandable panel,
 * native details and show more / less.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const chevDown = svgIcon('chevron-down', 'zak-icon', 15);
const chevRight = svgIcon('chevron-right', 'zak-icon', 14);
const checkI = svgIcon('check', 'zak-icon', 13);
const shieldI = svgIcon('shield', 'zak-icon', 15);
const zapI = svgIcon('zap', 'zak-icon', 14);
const globeI = svgIcon('globe', 'zak-icon', 14);

export const disclosureDemos: Record<string, DemoDef> = {
  accordion: defineDemo({
    desc: 'Stacked FAQ / settings sections where one answer stays open at a time. The trigger owns aria-expanded, the panel owns hidden — and the chevron rotates off the aria state alone.',
    stage: 'stretch',
    tpl: `<div class="zak-accordion" data-zak-accordion="single" style="width:100%;max-width:38rem">
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="acc-1">How does seat-based billing work? ${chevDown}</button>
      <div class="zak-accordion__panel" id="acc-1">You are billed for members who signed in during the last 30 days. Invited members start counting on their first login — no charge for scoped guests.</div>
    </div>
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="acc-2">Can I self-host the grid runtime? ${chevDown}</button>
      <div class="zak-accordion__panel" id="acc-2" hidden>Yes — the entire component layer is dependency-free ES modules. Ship the CSS tokens and the behaviour scripts from your own origin; nothing calls home.</div>
    </div>
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="acc-3">What does enterprise support include? ${chevDown}</button>
      <div class="zak-accordion__panel" id="acc-3" hidden>A named engineer, a 4-hour response SLA on severity-1 issues, quarterly design-token audits and early access to beta components.</div>
    </div>
  </div>`,
    codeTpl: `<!-- data-zak-accordion — behaviour root; "single" keeps one item open -->
<div class="zak-accordion" data-zak-accordion="single">
  <div class="zak-accordion__item">
    <!-- aria-expanded + hidden: state lives in ARIA, CSS reads it — no class juggling -->
    <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="a1">How does seat-based billing work? <svg class="zak-icon" aria-hidden="true">…</svg></button>
    <div class="zak-accordion__panel" id="a1">You are billed for members who signed in during the last 30 days.</div>
  </div>
  <div class="zak-accordion__item">
    <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="a2">Can I self-host the grid runtime? <svg class="zak-icon" aria-hidden="true">…</svg></button>
    <div class="zak-accordion__panel" id="a2" hidden>Yes — the component layer is dependency-free ES modules.</div>
  </div>
</div>

<!-- .zak-accordion__panel — indented body copy; display:none when hidden -->
<!-- chevron transform: rotates 180deg from aria-expanded="true", no JS class toggling -->
<!-- data-zak-accordion="multi" allows several panels open at once -->`,
    js: `wrapper.addEventListener('click', (e) => {
  const trigger = e.target.closest('.zak-accordion__trigger');
  if (!trigger) return;
  const panel = document.getElementById(trigger.getAttribute('aria-controls'));
  const open = trigger.getAttribute('aria-expanded') === 'true';

  // data-zak-accordion="single" — close whatever was open before
  if (wrapper.dataset.zakAccordion === 'single' && !open) {
    wrapper.querySelectorAll('.zak-accordion__trigger[aria-expanded="true"]')
      .forEach((other) => {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).hidden = true;
      });
  }

  trigger.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
});`,
    examples: [
      {
        title: 'Single open',
        desc: '`data-zak-accordion="single"` closes the previous answer as the next one opens, so only one panel is ever visible.',
        stage: 'stretch',
        tpl: `<div class="zak-accordion" data-zak-accordion="single" style="width:100%;max-width:34rem">
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="ex-acc-s1">How does seat-based billing work? ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-s1">You are billed for members who signed in during the last 30 days.</div>
    </div>
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="ex-acc-s2">What does enterprise support include? ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-s2" hidden>A named engineer and a 4-hour response SLA on severity-1 issues.</div>
    </div>
  </div>`,
        code: `<!-- data-zak-accordion="single" — opening one item closes the rest -->
<div class="zak-accordion" data-zak-accordion="single">
  <div class="zak-accordion__item">
    <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="a1">
      How does seat-based billing work?<svg class="zak-icon" aria-hidden="true">…</svg>
    </button>
    <div class="zak-accordion__panel" id="a1">You are billed for members who signed in during the last 30 days.</div>
  </div>
  <div class="zak-accordion__item">
    <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="a2">
      What does enterprise support include?<svg class="zak-icon" aria-hidden="true">…</svg>
    </button>
    <div class="zak-accordion__panel" id="a2" hidden>A named engineer and a 4-hour response SLA.</div>
  </div>
</div>`,
      },
      {
        title: 'Multiple open',
        desc: 'Drop the value (or use `"multi"`) and every section toggles independently — the right shape for filter groups.',
        stage: 'stretch',
        tpl: `<div class="zak-accordion" data-zak-accordion="multi" style="width:100%;max-width:34rem">
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="ex-acc-m1">Region ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-m1">eu-west-1 · eu-central-1 · us-east-1</div>
    </div>
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="ex-acc-m2">Runtime ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-m2">node 24 · node 22 · bun 1.2</div>
    </div>
  </div>`,
        code: `<div class="zak-accordion" data-zak-accordion="multi">
  <div class="zak-accordion__item">
    <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="r1">Region</button>
    <div class="zak-accordion__panel" id="r1">eu-west-1 · eu-central-1</div>
  </div>
  <div class="zak-accordion__item">
    <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="r2">Runtime</button>
    <div class="zak-accordion__panel" id="r2">node 24 · node 22</div>
  </div>
</div>`,
      },
      {
        title: 'Initial state',
        desc: 'Which sections start open is pure markup: `aria-expanded="true"` with the panel visible, or `"false"` with `hidden` on it.',
        stage: 'stretch',
        tpl: `<div class="zak-accordion" style="width:100%;max-width:34rem">
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="ex-acc-i1">Open on load ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-i1">No script ran to get here — the markup ships expanded.</div>
    </div>
    <div class="zak-accordion__item">
      <button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="ex-acc-i2">Closed on load ${chevDown}</button>
      <div class="zak-accordion__panel" id="ex-acc-i2" hidden>The panel is hidden, so it is out of the tab order and the accessibility tree.</div>
    </div>
  </div>`,
        code: `<!-- aria-expanded + hidden are the whole state — CSS reads them, JS only flips them -->
<button class="zak-accordion__trigger" type="button" aria-expanded="true" aria-controls="p1">Open on load</button>
<div class="zak-accordion__panel" id="p1">…</div>

<button class="zak-accordion__trigger" type="button" aria-expanded="false" aria-controls="p2">Closed on load</button>
<div class="zak-accordion__panel" id="p2" hidden>…</div>`,
      },
    ],
    props: [
      ['data-zak-accordion', 'attr', '—', 'Behaviour root; value "single" keeps one item open.'],
      ['aria-expanded + hidden', 'attr', '—', 'State lives in ARIA; CSS rotates the chevron from it.'],
      ['.zak-accordion__panel', 'element', '—', 'Indented body copy; display:none when hidden.'],
      ['chevron transform', 'css', '180deg', 'Rotates on aria-expanded="true" — no JS class juggling.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Toggles the focused section.'],
        ['Tab', 'Moves to the next trigger — panels contain no traps.'],
      ],
      aria: [
        ['aria-expanded', 'Set on every trigger, mirroring panel visibility.'],
        ['aria-controls', 'Points each trigger at its panel id.'],
        ['hidden', 'Removes collapsed content from the accessibility tree entirely.'],
      ],
    },
  }),
  collapse: defineDemo({
    desc: 'One animated region for everything else. The modern grid-template-rows 0fr → 1fr technique animates to auto height without measuring, and it stays interruptible mid-flight.',
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:34rem">
    <button class="zak-btn zak-btn--outlined zak-collapse-trigger" type="button" aria-expanded="false" aria-controls="col-advanced" data-zak-toggle="collapse" data-zak-target="#col-advanced">Advanced options ${chevDown}</button>
    <div class="zak-collapse" id="col-advanced" hidden>
      <div>
        <div style="margin-block-start:var(--zak-space-3);border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface);padding:var(--zak-space-5)">
          <div class="zak-stack zak-stack--md">
            <label class="zak-switch"><input type="checkbox" checked role="switch"/> <span class="zak-switch__desc">Zero-downtime deploys <small>Health-gated cutover between colour groups</small></span></label>
            <label class="zak-switch"><input type="checkbox" role="switch"/> <span class="zak-switch__desc">Canary traffic <small>Route 5% to the new revision for 10 minutes</small></span></label>
            <div class="zak-field">
              <label class="zak-label" for="col-region">Fallback region</label>
              <select class="zak-select" id="col-region"><option>eu-west-1</option><option>us-east-1</option><option>ap-south-1</option></select>
              <div class="zak-hint">Traffic fails over automatically when p95 breaches 800 ms.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- data-zak-toggle="collapse" — trigger contract; pair with data-zak-target="#advanced" -->
<button class="zak-btn zak-btn--outlined" type="button" aria-expanded="false" aria-controls="advanced" data-zak-toggle="collapse" data-zak-target="#advanced">Advanced options <svg class="zak-icon" aria-hidden="true">…</svg></button>

<!-- .zak-collapse.is-open flips grid-template-rows 0fr → 1fr — height-agnostic.
     The direct child is the clip layer (padding-free); [hidden] is applied by the
     runtime when the closing transition ends, so no margin or border lingers. -->
<div class="zak-collapse" id="advanced" hidden>
  <div>
    <label class="zak-switch"><input type="checkbox" role="switch"/> Zero-downtime deploys</label>
    <label class="zak-switch"><input type="checkbox" role="switch"/> Canary traffic</label>
  </div>
</div>

<!-- interruption-safe: the grid-row animation re-targets smoothly mid-transition -->
<!-- inner padding rule: padding lives on the child, never the grid container -->`,
    css: `.zak-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--zak-duration-base) var(--zak-ease-standard);
}

/* Clip layer — must stay padding-free or the closed state leaves a sliver */
.zak-collapse > * { overflow: hidden; min-height: 0; }

.zak-collapse.is-open { grid-template-rows: 1fr; }

/* Fully closed: applied by the runtime when the closing transition ends */
.zak-collapse[hidden] { display: none; }`,
    js: `document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-zak-toggle="collapse"]');
  if (!trigger) return;
  const region = document.querySelector(trigger.dataset.zakTarget);
  const open = !region.classList.contains('is-open');
  trigger.setAttribute('aria-expanded', String(open));

  if (open) {
    region.hidden = false;
    // one unstyled frame so the transition has a 0fr starting box
    requestAnimationFrame(() => region.classList.add('is-open'));
    return;
  }

  region.classList.remove('is-open');
  // take it out of the layout only once the row has finished collapsing
  region.addEventListener('transitionend', (ev) => {
    if (ev.target === region && ev.propertyName === 'grid-template-rows' && !open) region.hidden = true;
  });
});`,
    examples: [
      {
        title: 'Button-triggered region',
        desc: 'A trigger button wired by `data-zak-target` — the panel can hold any content, including form controls.',
        stage: 'stretch',
        tpl: `<div style="width:100%;max-width:32rem">
    <button class="zak-btn zak-btn--outlined zak-collapse-trigger" type="button" aria-expanded="false" aria-controls="ex-col-1" data-zak-toggle="collapse" data-zak-target="#ex-col-1">Advanced options ${chevDown}</button>
    <div class="zak-collapse" id="ex-col-1" hidden>
      <div>
        <div class="zak-collapse__body">
          <label class="zak-switch"><input type="checkbox" role="switch"/> <span class="zak-switch__desc">Canary traffic</span></label>
        </div>
      </div>
    </div>
  </div>`,
        code: `<button class="zak-btn zak-btn--outlined" type="button" aria-expanded="false"
        aria-controls="advanced" data-zak-toggle="collapse" data-zak-target="#advanced">
  Advanced options<svg class="zak-icon" aria-hidden="true">…</svg>
</button>

<div class="zak-collapse" id="advanced" hidden>
  <div>                                  <!-- clip layer: no padding, no border -->
    <div class="zak-collapse__body">…</div>  <!-- padded content -->
  </div>
</div>`,
      },
      {
        title: 'Shipping open',
        desc: 'A region that starts expanded simply ships `is-open` with no `hidden`; the first click collapses it.',
        stage: 'stretch',
        tpl: `<div style="width:100%;max-width:32rem">
    <button class="zak-btn zak-btn--outlined zak-collapse-trigger" type="button" aria-expanded="true" aria-controls="ex-col-2" data-zak-toggle="collapse" data-zak-target="#ex-col-2">Deployment notes ${chevDown}</button>
    <div class="zak-collapse is-open" id="ex-col-2">
      <div>
        <div class="zak-collapse__body" style="font-size:var(--zak-text-sm);color:var(--zak-text-secondary)">Health-gated cutover between colour groups; rollback keeps the old revision warm for 10 minutes.</div>
      </div>
    </div>
  </div>`,
        code: `<button class="zak-btn zak-btn--outlined" type="button" aria-expanded="true"
        aria-controls="notes" data-zak-toggle="collapse" data-zak-target="#notes">Deployment notes</button>

<!-- .zak-collapse.is-open — grid-template-rows already at 1fr, nothing hidden -->
<div class="zak-collapse is-open" id="notes">
  <div><div class="zak-collapse__body">…</div></div>
</div>`,
      },
    ],
    props: [
      ['data-zak-toggle="collapse"', 'attr', '—', 'Trigger contract; pair with data-zak-target="#id".'],
      ['.zak-collapse.is-open', 'class', '—', 'Flips grid-template-rows to 1fr — height-agnostic.'],
      ['.zak-collapse > *', 'layer', '—', 'Clip layer; no padding or border here or the closed state shows a sliver.'],
      ['hidden', 'attr', '—', 'Set by the runtime when the closing transition ends; cleared immediately on open.'],
      ['interruption-safe', 'css', '—', 'Grid-row animation re-targets smoothly mid-transition.'],
    ],
    notes: ['The runtime applies `hidden` once the closing transition settles (400 ms fallback for reduced motion), so collapsed content leaves both the layout and the accessibility tree with no extra work.'],
  }),
  'expandable-panel': defineDemo({
    desc: 'A framed container with a fixed header and a collapsible body — for filter panels, pipeline logs and order summaries. Combine the collapse primitive with any card chrome.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:34rem">
    <div class="zak-expandable">
      <div class="zak-expandable__head">
        <span class="zak-avatar zak-avatar--sm">PC</span>
        <div style="display:flex;flex-direction:column">
          <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Pipeline configuration</span>
          <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">3 stages · eu-west-1</span>
        </div>
        <button class="zak-btn zak-btn--ghost zak-btn--sm zak-collapse-trigger" type="button" aria-expanded="false" aria-controls="exp-1" data-zak-toggle="collapse" data-zak-target="#exp-1">Details ${chevDown}</button>
      </div>
      <div class="zak-collapse" id="exp-1" hidden>
        <div>
          <div class="zak-collapse__body">
            <div class="zak-stack zak-stack--sm">
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-success)">${checkI}</span> Build · 2m 14s · node 24</div>
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-success)">${checkI}</span> Test · 412 passed · 0 flaky</div>
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-text-tertiary)">${svgIcon('clock', 'zak-icon', 13)}</span> Deploy · waiting for approval</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="zak-expandable">
      <div class="zak-expandable__head">
        <span class="zak-avatar zak-avatar--sm" style="background:var(--zak-primary-subtle);color:var(--zak-primary-text)">AL</span>
        <div style="display:flex;flex-direction:column">
          <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Alert rules</span>
          <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">4 active · 1 muted</span>
        </div>
        <button class="zak-btn zak-btn--ghost zak-btn--sm zak-collapse-trigger" type="button" aria-expanded="true" aria-controls="exp-2" data-zak-toggle="collapse" data-zak-target="#exp-2">Details ${chevDown}</button>
      </div>
      <div class="zak-collapse is-open" id="exp-2">
        <div>
          <div class="zak-collapse__body">
            <div class="zak-stack zak-stack--sm">
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-primary-text)">${zapI}</span> Latency p95 &gt; 800 ms <span class="zak-badge zak-badge--warning" style="margin-inline-start:auto">1 firing</span></div>
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-primary-text)">${shieldI}</span> Failed auth spike <span class="zak-badge zak-badge--success" style="margin-inline-start:auto">Armed</span></div>
              <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);font-size:var(--zak-text-sm)"><span style="color:var(--zak-primary-text)">${globeI}</span> Edge 5xx rate <span class="zak-badge" style="margin-inline-start:auto">Muted</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- .zak-expandable — framed surface: border, radius and overflow clip -->
<div class="zak-expandable">
  <div class="zak-expandable__head">
    <span class="zak-avatar zak-avatar--sm">PC</span>
    <div style="display:flex;flex-direction:column">
      <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Pipeline configuration</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">3 stages · eu-west-1</span>
    </div>

    <!-- .zak-expandable__head — fixed header row with a .zak-btn pinned to the end -->
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" aria-expanded="false" aria-controls="exp-1" data-zak-toggle="collapse" data-zak-target="#exp-1">Details <svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>

  <!-- .zak-collapse inside — the panel body reuses the shared collapse primitive.
       The direct child is the clip layer and stays padding-free; .zak-collapse__body
       carries the inset, and [hidden] marks the closed panel so nothing lingers. -->
  <div class="zak-collapse" id="exp-1" hidden>
    <div>
      <div class="zak-collapse__body">…</div>
    </div>
  </div>
</div>

<!-- is-open + aria-expanded="true" — second instance ships expanded, same contract -->
<div class="zak-expandable">
  <div class="zak-expandable__head">
    <span class="zak-avatar zak-avatar--sm">AL</span>
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" aria-expanded="true" aria-controls="exp-2" data-zak-toggle="collapse" data-zak-target="#exp-2">Details <svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>
  <div class="zak-collapse is-open" id="exp-2">
    <div>
      <div class="zak-collapse__body">…</div>
    </div>
  </div>
</div>`,
    css: `.zak-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--zak-duration-base); }
.zak-collapse > * { overflow: hidden; min-height: 0; }   /* clip layer — never padded */
.zak-collapse.is-open { grid-template-rows: 1fr; }
.zak-collapse[hidden] { display: none; }                 /* closed after the transition */
.zak-collapse__body { padding: var(--zak-space-2) var(--zak-space-5) var(--zak-space-5); }`,
    examples: [
      {
        title: 'Collapsed body',
        desc: 'The frame keeps its header while the body rides the shared collapse primitive — closed panels leave no residue.',
        stage: 'stretch',
        tpl: `<div class="zak-expandable" style="width:100%;max-width:32rem">
      <div class="zak-expandable__head">
        <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Pipeline configuration</span>
        <button class="zak-btn zak-btn--ghost zak-btn--sm zak-collapse-trigger" type="button" aria-expanded="false" aria-controls="ex-exp-1" data-zak-toggle="collapse" data-zak-target="#ex-exp-1">Details ${chevDown}</button>
      </div>
      <div class="zak-collapse" id="ex-exp-1" hidden>
        <div>
          <div class="zak-collapse__body" style="font-size:var(--zak-text-sm)">3 stages · node 24 · eu-west-1</div>
        </div>
      </div>
    </div>`,
        code: `<div class="zak-expandable">
  <div class="zak-expandable__head">
    <span>Pipeline configuration</span>
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" aria-expanded="false"
            aria-controls="p1" data-zak-toggle="collapse" data-zak-target="#p1">Details</button>
  </div>

  <!-- clip layer stays padding-free; .zak-collapse__body carries the inset -->
  <div class="zak-collapse" id="p1" hidden>
    <div><div class="zak-collapse__body">3 stages · node 24 · eu-west-1</div></div>
  </div>
</div>`,
      },
      {
        title: 'Expanded on load',
        desc: 'Ship `is-open` on the region and `aria-expanded="true"` on the trigger to start the panel open — no extra CSS.',
        stage: 'stretch',
        tpl: `<div class="zak-expandable" style="width:100%;max-width:32rem">
      <div class="zak-expandable__head">
        <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Alert rules</span>
        <button class="zak-btn zak-btn--ghost zak-btn--sm zak-collapse-trigger" type="button" aria-expanded="true" aria-controls="ex-exp-2" data-zak-toggle="collapse" data-zak-target="#ex-exp-2">Details ${chevDown}</button>
      </div>
      <div class="zak-collapse is-open" id="ex-exp-2">
        <div>
          <div class="zak-collapse__body" style="font-size:var(--zak-text-sm)">Latency p95 &gt; 800 ms · failed auth spike · edge 5xx rate</div>
        </div>
      </div>
    </div>`,
        code: `<div class="zak-expandable">
  <div class="zak-expandable__head">
    <span>Alert rules</span>
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" aria-expanded="true"
            aria-controls="p2" data-zak-toggle="collapse" data-zak-target="#p2">Details</button>
  </div>
  <div class="zak-collapse is-open" id="p2">
    <div><div class="zak-collapse__body">…</div></div>
  </div>
</div>`,
      },
      {
        title: 'Rich header',
        desc: 'The head row is plain flex: avatar, a title / subtitle column and the trigger pushed to the inline end.',
        stage: 'stretch',
        tpl: `<div class="zak-expandable" style="width:100%;max-width:32rem">
      <div class="zak-expandable__head">
        <span class="zak-avatar zak-avatar--sm">PC</span>
        <div style="display:flex;flex-direction:column">
          <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Pipeline configuration</span>
          <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">3 stages · eu-west-1</span>
        </div>
        <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Passing</span>
        <button class="zak-btn zak-btn--ghost zak-btn--sm zak-collapse-trigger" type="button" aria-expanded="false" aria-controls="ex-exp-3" data-zak-toggle="collapse" data-zak-target="#ex-exp-3">Details ${chevDown}</button>
      </div>
      <div class="zak-collapse" id="ex-exp-3" hidden>
        <div>
          <div class="zak-collapse__body" style="font-size:var(--zak-text-sm)">Build · 2m 14s · Test · 412 passed · Deploy · waiting for approval</div>
        </div>
      </div>
    </div>`,
        code: `<div class="zak-expandable">
  <div class="zak-expandable__head">
    <span class="zak-avatar zak-avatar--sm">PC</span>
    <div>
      <span>Pipeline configuration</span>       <!-- title -->
      <span>3 stages · eu-west-1</span>         <!-- subtitle -->
    </div>
    <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Passing</span>
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" aria-expanded="false"
            aria-controls="p3" data-zak-toggle="collapse" data-zak-target="#p3">Details</button>
  </div>
  <div class="zak-collapse" id="p3" hidden>
    <div><div class="zak-collapse__body">…</div></div>
  </div>
</div>`,
      },
    ],
    props: [
      ['.zak-expandable', 'class', '—', 'Framed surface: border, radius and overflow clip.'],
      ['.zak-expandable__head', 'element', '—', 'Fixed header row; a .zak-btn pins to the trailing edge.'],
      ['.zak-collapse > *', 'layer', '—', 'Clip layer — no padding or border here or the closed state leaves a sliver.'],
      ['.zak-collapse__body', 'element', '—', 'Padded content one level below the clip layer.'],
      ['hidden', 'attr', '—', 'Set by the runtime when the closing transition ends; cleared on open.'],
      ['is-open + aria-expanded="true"', 'state', '—', 'Second instance ships expanded — same contract, no new CSS.'],
      ['.zak-collapse inside', 'pattern', '—', 'The panel body reuses the shared collapse primitive.'],
    ],
  }),
  details: defineDemo({
    desc: 'The native <details> element — zero JavaScript, browser-managed state, and content that plays nicely with in-page find. The chevron rotates 90° off the [open] attribute.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:36rem">
    <details class="zak-details" open>
      <summary>${chevRight} What counts as an active seat?</summary>
      <div class="zak-details__body">A seat is active when a member signs in at least once every 30 days. Guest collaborators with scoped link access never consume a seat.</div>
    </details>
    <details class="zak-details">
      <summary>${chevRight} Can I change plans mid-cycle?</summary>
      <div class="zak-details__body">Yes. Upgrades apply instantly and are prorated to the day; downgrades take effect at the next renewal. Usage beyond the new limit is never billed retroactively.</div>
    </details>
    <details class="zak-details">
      <summary>${chevRight} Where is my data stored?</summary>
      <div class="zak-details__body">Primary storage is eu-west-1 with hot standby in eu-central-1. US workspaces pin to us-east-1. Region is fixed at workspace creation.</div>
    </details>
  </div>`,
    codeTpl: `<!-- <details> / <summary> — native disclosure: state, keyboard and find-in-page for free -->
<details class="zak-details" open>
  <summary>▸ What counts as an active seat?</summary>
  <div class="zak-details__body">A seat is active when a member signs in at least once every 30 days.</div>
</details>

<!-- [open] — the attribute drives the chevron rotation via CSS only -->
<details class="zak-details">
  <summary>▸ Can I change plans mid-cycle?</summary>
  <div class="zak-details__body">Upgrades apply instantly and are prorated to the day.</div>
</details>

<!-- name="group" — group details elements for exclusive accordion behaviour -->
<details class="zak-details" name="faq">
  <summary>▸ Where is my data stored?</summary>
  <div class="zak-details__body">Primary storage is eu-west-1 with hot standby in eu-central-1.</div>
</details>

<!-- list-style: none hides the default triangle; a chevron icon is shipped instead -->`,
    css: `.zak-details > summary { list-style: none; cursor: pointer; }

.zak-details > summary::-webkit-details-marker { display: none; }

.zak-details > summary .zak-icon {
  transition: transform var(--zak-duration-fast);
}

.zak-details[open] > summary .zak-icon { transform: rotate(90deg); }`,
    props: [
      ['<details> / <summary>', 'element', '—', 'Native disclosure — state, keyboard and find-in-page for free.'],
      ['[open]', 'attr', '—', 'Attribute drives the chevron rotation via CSS only.'],
      ['name="group"', 'attr', '—', 'Group details elements for exclusive accordion behaviour.'],
      ['list-style: none', 'css', '—', 'Hides the default triangle; ships a chevron icon instead.'],
    ],
    notes: ['Content inside details is indexable by browsers and assistive tech even when collapsed — ideal for FAQ blocks and changelog entries.'],
  }),
  'show-more-show-less': defineDemo({
    desc: 'Line-clamped copy with a soft fade and a single toggle. Cards stay scannable; long prose expands in place without navigating away.',
    stage: 'stretch',
    tpl: `<div class="zak-showmore" data-zak-showmore style="width:100%;max-width:36rem">
    <p class="zak-showmore__text" style="--lines:3;margin:0">ZAKUIKit 2.4 focuses on the Data Grid and AI surfaces. Virtual scroll now renders 100k rows with a stable scroll position, the streaming response primitive graduated from beta, and popovers gained native light-dismiss handling. The token layer adds density modes at the app root, container-query toolbars collapse gracefully below 34rem, and every overlay moved onto the native dialog element — cutting the behaviour bundle by a third while improving focus management.</p>
    <span class="zak-showmore__fade" aria-hidden="true"></span>
    <button class="zak-showmore__toggle zak-btn zak-btn--link zak-btn--sm" type="button" aria-expanded="false" data-zak-showmore-toggle>Show more</button>
  </div>`,
    codeTpl: `<!-- data-zak-showmore — root hook; .is-open releases the line clamp -->
<div class="zak-showmore" data-zak-showmore style="width:100%;max-width:36rem">

  <!-- --lines custom prop: -webkit-line-clamp: var(--lines, 3) -->
  <p class="zak-showmore__text" style="--lines:3;margin:0">ZAKUIKit 2.4 focuses on the Data Grid and AI surfaces. Virtual scroll now renders 100k rows with a stable scroll position, the streaming response primitive graduated from beta, and popovers gained native light-dismiss handling.</p>

  <!-- .zak-showmore__fade — gradient veil above the toggle; hidden once open -->
  <span class="zak-showmore__fade" aria-hidden="true"></span>

  <!-- aria-expanded on the toggle announces state; the label swaps to “Show less” -->
  <button class="zak-showmore__toggle zak-btn zak-btn--link zak-btn--sm" type="button" aria-expanded="false" data-zak-showmore-toggle>Show more</button>
</div>`,
    js: `const wrapper = document.querySelector('[data-zak-showmore]');
const toggle = wrapper.querySelector('[data-zak-showmore-toggle]');

toggle.addEventListener('click', () => {
  const open = wrapper.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Show less' : 'Show more';
});`,
    props: [
      ['data-zak-showmore', 'attr', '—', 'Root hook; .is-open releases the line clamp.'],
      ['--lines (custom prop)', 'token', '3', 'Clamp height: -webkit-line-clamp: var(--lines, 3).'],
      ['.zak-showmore__fade', 'element', '—', 'Gradient veil above the toggle; hidden once open.'],
      ['aria-expanded on toggle', 'attr', '—', 'Announces the expanded state; label swaps to “Show less”.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Toggles between clamped and full text.'],
      ],
      aria: [
        ['aria-expanded', 'The toggle is a disclosure button — state must be announced.'],
        ['full text in DOM', 'Clamped copy stays readable by screen readers and search.'],
      ],
    },
  }),
};
