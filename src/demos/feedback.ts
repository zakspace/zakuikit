/**
 * Demos — Feedback: alerts, banners, toasts, snackbar, notification, progress,
 * spinners, skeletons, loading, empty, result and status indicators.
 *
 * Every demo renders as a static preview card (`playground` defaults to the
 * preview + code card) and ships a curated `codeTpl` that demonstrates each
 * entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const infoI = svgIcon('info', 'zak-icon', 16);
const checkI = svgIcon('check-circle', 'zak-icon', 16);
const warnI = svgIcon('alert-triangle', 'zak-icon', 16);
const errI = svgIcon('alert-circle', 'zak-icon', 16);
const xI = svgIcon('x', 'zak-icon', 13);
const sparkI = svgIcon('sparkles', 'zak-icon', 15);
const folderI = svgIcon('folder', 'zak-icon', 22);
const uploadI = svgIcon('upload', 'zak-icon', 16);

export const feedbackDemos: Record<string, DemoDef> = {
  alert: defineDemo({
    desc: 'Inline contextual messages in four tones. Icon, title and description stack; the close button makes the alert dismissible without layout shift.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:36rem">
    <div class="zak-alert" role="status">
      <span class="zak-alert__icon">${infoI}</span>
      <div class="zak-alert__body"><div class="zak-alert__title">New version available</div><div class="zak-alert__desc">2.4.1 ships streaming grids and a 30% faster build pipeline.</div></div>
      <button class="zak-alert__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-alert zak-alert--success" role="status">
      <span class="zak-alert__icon">${checkI}</span>
      <div class="zak-alert__body"><div class="zak-alert__title">Deployment complete</div><div class="zak-alert__desc">All 12 nodes are healthy on #4821.</div></div>
      <button class="zak-alert__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-alert zak-alert--warning" role="alert">
      <span class="zak-alert__icon">${warnI}</span>
      <div class="zak-alert__body"><div class="zak-alert__title">Storage almost full</div><div class="zak-alert__desc">You have used 182 GB of 200 GB. Old artifacts will be pruned at 100%.</div></div>
      <button class="zak-alert__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-alert zak-alert--danger" role="alert">
      <span class="zak-alert__icon">${errI}</span>
      <div class="zak-alert__body"><div class="zak-alert__title">Payment method declined</div><div class="zak-alert__desc">Update your card to avoid service interruption on 1 July.</div></div>
      <button class="zak-alert__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
  </div>`,
    codeTpl: `<!-- Tones: base (info) · --primary · --success · --warning · --danger -->
<div class="zak-alert zak-alert--warning" role="alert">
  <span class="zak-alert__icon">⚠</span>
  <div class="zak-alert__body">
    <div class="zak-alert__title">Storage almost full</div>
    <div class="zak-alert__desc">You have used 182 GB of 200 GB.</div>
  </div>
  <button class="zak-alert__close" type="button" aria-label="Dismiss" data-zak-dismiss>✕</button>
</div>

<!-- role="status" (polite) for FYI updates, role="alert" (assertive) for failures -->
<div class="zak-alert zak-alert--success" role="status">
  <span class="zak-alert__icon">✓</span>
  <div class="zak-alert__body"><div class="zak-alert__title">Deployment complete</div></div>
</div>`,
    props: [
      ['(base / --primary / --success / --warning / --danger)', 'modifier', 'info', 'Tone sets accent, surface, border and text via one CSS-prop triple.'],
      ['role="status" vs role="alert"', 'attr', 'status', 'Polite for FYI tones, assertive only for errors that block work.'],
      ['.zak-alert__close', 'element', '—', 'Removal affordance; the row collapses without reflow jump.'],
    ],
    a11y: {
      aria: [
        ['role="alert"', 'Interrupts the screen reader — reserve for actionable failures.'],
        ['aria-live', 'Non-error alerts announce politely via role="status".'],
      ],
    },
  }),
  banner: defineDemo({
    desc: 'Full-width announcements that sit above content: brand gradient for launches, warning and danger tones for operational states, each with one action.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%">
    <div class="zak-banner" style="border-radius:var(--zak-radius-md)">
      ${sparkI}
      <span><strong>ZAKUIKit 2.4 is live</strong> — streaming AI components are now stable.</span>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Read the notes</button>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-banner zak-banner--warning" style="border-radius:var(--zak-radius-md)">
      ${warnI}
      <span><strong>Scheduled maintenance</strong> — read replicas pause on 12 July, 02:00–04:00 UTC.</span>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">View status</button>
    </div>
    <div class="zak-banner zak-banner--danger" style="border-radius:var(--zak-radius-md)">
      ${errI}
      <span><strong>Degraded performance</strong> in eu-west-1 — elevated p95 latency since 09:41.</span>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Incident page</button>
    </div>
  </div>`,
    codeTpl: `<!-- Brand gradient strip (default) with a trailing action -->
<div class="zak-banner">
  <span>✦</span>
  <span><strong>ZAKUIKit 2.4 is live</strong> — streaming AI components are stable.</span>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Read the notes</button>
</div>

<!-- Flat semantic surfaces: --warning / --danger -->
<div class="zak-banner zak-banner--warning">
  <span>⚠</span>
  <span><strong>Scheduled maintenance</strong> — read replicas pause 02:00–04:00 UTC.</span>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">View status</button>
</div>
<div class="zak-banner zak-banner--danger">
  <span>⛔</span>
  <span><strong>Degraded performance</strong> in eu-west-1.</span>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Incident page</button>
</div>`,
    props: [
      ['.zak-banner', 'class', '—', 'Brand gradient strip, 8px vertical padding, full width.'],
      ['--warning / --danger', 'modifier', '—', 'Swap the gradient for flat semantic surfaces.'],
      ['.zak-btn', 'child', '—', 'Action pins to the trailing edge via margin-inline-start:auto.'],
    ],
    notes: ['Banners push content down; dismissible banners should remember their dismissal per user.'],
  }),
  toast: defineDemo({
    desc: 'Transient notifications stacked in the bottom-right region: 5s autohide that pauses while the pointer or focus rests on the toast, a spring entry and a close affordance — Bootstrap-style behaviour on native APIs.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:23rem">
    <div class="zak-toast zak-toast--success" role="status">
      <span class="zak-toast__icon">${checkI}</span>
      <div class="zak-toast__body"><div class="zak-toast__title">Changes saved</div><div class="zak-toast__desc">Deployment config updated 2s ago.</div></div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
  </div>
  <div class="zak-flex" style="margin-block-start:var(--zak-space-5);gap:var(--zak-space-2)">
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button" data-zak-toast="Deployment started" data-zak-toast-tone="success">Fire a live toast</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-toast="API token expires in 3 days" data-zak-toast-tone="warning" data-zak-toast-desc="Rotate it to keep CI pipelines green.">Warning with description</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-toast="Pinned until dismissed" data-zak-toast-tone="danger" data-zak-toast-duration="0">Pinned toast</button>
  </div>`,
    codeTpl: `<!-- The fixed stack lives in a persistent region -->
<div class="zak-toast-region zak-toast-region--bottom-end">
  <div class="zak-toast zak-toast--success" role="status">
    <span class="zak-toast__icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
    <div class="zak-toast__body">
      <div class="zak-toast__title">Changes saved</div>
      <div class="zak-toast__desc">Deployment config updated 2s ago.</div>
    </div>
    <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>
</div>

<!-- .zak-toast-region: fixed stack — --top-end / --bottom-start reposition it -->
<!-- Fire from script — tone info · success · warning · danger; opts { duration, desc } -->
<script>
  window.ZakUI.toast('Deployment started', 'success');
  // duration:0 pins the toast until it is dismissed; autohide pauses on hover / focus
  window.ZakUI.toast('API token expires in 3 days', 'warning', {
    duration: 0,
    desc: 'Rotate it to keep CI pipelines green.',
  });
</script>

<!-- .is-leaving plays the slide-out; remove after animationend -->

<!-- Or fire from markup with no JavaScript at all: the runtime reads the
     attributes off any element you click -->
<button class="zak-btn zak-btn--outlined zak-btn--sm" type="button"
        data-zak-toast="Deployment started" data-zak-toast-tone="success">Fire a live toast</button>

<button class="zak-btn zak-btn--text zak-btn--sm" type="button"
        data-zak-toast="API token expires in 3 days" data-zak-toast-tone="warning"
        data-zak-toast-desc="Rotate it to keep CI pipelines green."
        data-zak-toast-duration="0">Pinned with description</button>`,
    js: `// One shared region, appended lazily — bottom-right by default
const region = document.querySelector('.zak-toast-region') ?? createRegion();

export function toast(title, tone = 'default', { duration = 5000, desc } = {}) {
  const el = buildToast(title, tone, desc);          // .zak-toast markup
  region.append(el);
  if (duration > 0) scheduleAutohide(el, duration);  // pauses on hover/focus
  el.querySelector('[aria-label="Dismiss"]').onclick = () => dismiss(el);
}

function dismiss(el) {
  el.classList.add('is-leaving');                    // 220ms exit animation
  el.addEventListener('animationend', () => el.remove(), { once: true });
}`,
    examples: [
      {
        title: 'Fired from attributes',
        desc: 'No inline JavaScript anywhere: the clicked element carries the title in `data-zak-toast` and the tone, description and lifetime in the companion attributes.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button" data-zak-toast="Deployment started" data-zak-toast-tone="success">Success</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-toast="Saved to drafts" data-zak-toast-tone="info">Info</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-toast="Token expires in 3 days" data-zak-toast-tone="warning" data-zak-toast-desc="Rotate it to keep CI pipelines green.">With description</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-toast="Build failed" data-zak-toast-tone="danger" data-zak-toast-duration="0">Pinned</button>
  </div>`,
        code: `<button class="zak-btn zak-btn--outlined zak-btn--sm" type="button"
        data-zak-toast="Deployment started" data-zak-toast-tone="success">Success</button>

<button class="zak-btn zak-btn--text zak-btn--sm" type="button"
        data-zak-toast="Token expires in 3 days" data-zak-toast-tone="warning"
        data-zak-toast-desc="Rotate it to keep CI pipelines green.">With description</button>

<!-- data-zak-toast-duration="0" — stays until the user dismisses it -->
<button class="zak-btn zak-btn--text zak-btn--sm" type="button"
        data-zak-toast="Build failed" data-zak-toast-tone="danger" data-zak-toast-duration="0">Pinned</button>`,
      },
      {
        title: 'Tones',
        desc: 'Four semantic tones swap the icon and accent; `danger` is the only one that announces as `role="alert"`.',
        tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:23rem">
    <div class="zak-toast zak-toast--info" role="status">
      <span class="zak-toast__icon">${infoI}</span>
      <div class="zak-toast__body"><div class="zak-toast__title">New sign-in from Chrome</div></div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-toast zak-toast--success" role="status">
      <span class="zak-toast__icon">${checkI}</span>
      <div class="zak-toast__body"><div class="zak-toast__title">Changes saved</div></div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-toast zak-toast--warning" role="status">
      <span class="zak-toast__icon">${warnI}</span>
      <div class="zak-toast__body"><div class="zak-toast__title">Quota at 82%</div></div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
    <div class="zak-toast zak-toast--danger" role="alert">
      <span class="zak-toast__icon">${errI}</span>
      <div class="zak-toast__body"><div class="zak-toast__title">Build failed</div></div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
  </div>`,
        code: `<!-- Tones: --info · --success · --warning · --danger (default = no modifier) -->
<div class="zak-toast zak-toast--success" role="status">
  <span class="zak-toast__icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
  <div class="zak-toast__body"><div class="zak-toast__title">Changes saved</div></div>
  <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss><svg class="zak-icon" aria-hidden="true">…</svg></button>
</div>

<!-- --danger announces with role="alert"; every other tone uses role="status" -->
<div class="zak-toast zak-toast--danger" role="alert">…</div>`,
      },
      {
        title: 'Title and description',
        desc: 'The body block takes a title and one supporting line; the title alone is enough for confirmations.',
        tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:23rem">
    <div class="zak-toast zak-toast--warning" role="status">
      <span class="zak-toast__icon">${warnI}</span>
      <div class="zak-toast__body">
        <div class="zak-toast__title">API token expires in 3 days</div>
        <div class="zak-toast__desc">Rotate it to keep CI pipelines green.</div>
      </div>
      <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
    </div>
  </div>`,
        code: `<div class="zak-toast zak-toast--warning" role="status">
  <!-- Leading icon, chosen by tone -->
  <span class="zak-toast__icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>

  <div class="zak-toast__body">
    <div class="zak-toast__title">API token expires in 3 days</div>
    <!-- Optional second line -->
    <div class="zak-toast__desc">Rotate it to keep CI pipelines green.</div>
  </div>

  <!-- data-zak-dismiss closes the toast wherever it is clicked -->
  <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss><svg class="zak-icon" aria-hidden="true">…</svg></button>
</div>`,
      },
      {
        title: 'Scripted toast',
        desc: '`ZakUI.toast()` builds and queues the same markup — useful from a fetch handler or an event listener.',
        tpl: `<div class="zak-toast zak-toast--danger" role="alert">
    <span class="zak-toast__icon">${errI}</span>
    <div class="zak-toast__body">
      <div class="zak-toast__title">Build failed</div>
      <div class="zak-toast__desc">Step “test:unit” exited with code 1.</div>
    </div>
    <button class="zak-toast__close" type="button" aria-label="Dismiss" data-zak-dismiss>${xI}</button>
  </div>`,
        code: `<!-- The region is created on first call — bottom-end by default -->
<script>
  ZakUI.toast('Build failed', 'danger', {
    desc: 'Step “test:unit” exited with code 1.',
    duration: 0,               // 0 pins it until dismissed
  });
</script>`,
        js: `// Same call through the controller class — tone is positional
ZakToast.show('Build failed', 'danger', {
  desc: 'Step “test:unit” exited with code 1.',
  duration: 8000,
});

// The autohide countdown pauses on hover and focus, then resumes

// Reposition the stack before the first toast appears — the runtime reuses it
document.body.insertAdjacentHTML(
  'beforeend',
  '<div class="zak-toast-region zak-toast-region--top-start" aria-live="polite"></div>',
);`,
      },
    ],
    props: [
      ['data-zak-toast', 'attr', '—', 'Any clicked element raises a toast with this title — no inline JS.'],
      ['data-zak-toast-tone', 'attr', 'info · success · warning · danger', 'Semantic tone; swaps the icon and accent.'],
      ['data-zak-toast-desc', 'attr', '—', 'Second line of supporting copy.'],
      ['data-zak-toast-duration', 'attr', '5000ms', 'Autohide delay; 0 pins the toast until dismissed.'],
      ['window.ZakUI.toast(title, tone, opts)', 'api', '—', 'Fire a toast — tone info · success · warning · danger; opts { duration, desc }.'],
      ['ZakToast.show(title, tone, opts)', 'api', '—', 'Controller-class entry point over the same runtime.'],
      ['.zak-toast-region', 'element', 'bottom-end', 'Fixed stack — --top-end / --top-start / --bottom-start reposition it.'],
      ['.zak-toast.is-leaving', 'class', '—', 'Slide-out exit; remove after animationend.'],
      ['duration: 0', 'option', '5000ms', 'Pins the toast until it is dismissed.'],
      ['pause on hover / focus', 'behaviour', '—', 'The autohide countdown freezes while the pointer or focus rests on the toast.'],
    ],
    notes: ['The autohide countdown pauses the moment the user hovers or focuses a toast — reading time never races the timer.'],
    a11y: {
      aria: [
        ['role="status"', 'Polite announcements for confirmations.'],
        ['role="alert"', 'Only for failures; never batch multiple alerts at once.'],
        ['aria-live="polite"', 'The region persists in the DOM so announcements are not dropped.'],
      ],
    },
  }),
  snackbar: defineDemo({
    desc: 'The single-action variant for reversible operations: dark inverse surface, one message, one Undo — anchored bottom-center in a live region the runtime creates on demand.',
    tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:23rem">
    <div class="zak-snackbar" role="status">
      ${svgIcon('trash', 'zak-icon', 15)}
      <span>Invite revoked for samuel@zakui.dev</span>
      <button class="zak-btn zak-btn--link zak-btn--sm" type="button">Undo</button>
    </div>
  </div>
  <div class="zak-flex" style="margin-block-start:var(--zak-space-5);gap:var(--zak-space-2)">
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button" data-zak-snackbar="Draft deleted" data-zak-snackbar-action="Undo">Show with Undo</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-snackbar="Message moved to Trash">Plain message</button>
  </div>`,
    codeTpl: `<!-- Dark inverse surface with one recovery action -->
<div class="zak-snackbar" role="status">
  <span class="zak-snackbar__msg">Invite revoked for samuel@zakui.dev</span>
  <!-- Undo uses the secondary-300 link tone -->
  <button class="zak-btn zak-btn--link zak-btn--sm" type="button">Undo</button>
</div>

<!-- Messages without a recovery action still use the inverse surface -->
<div class="zak-snackbar" role="status">
  <span class="zak-snackbar__msg">Message moved to Trash.</span>
</div>

<script>
  // The region (.zak-snackbar-region) is created on first call
  ZakUI.snackbar('Draft deleted', { actionLabel: 'Undo', onAction: restoreDraft });

  // duration pauses on hover / focus; 0 keeps it on screen until the action
  ZakUI.snackbar('Sync paused', { duration: 0 });
</script>

<!-- Or fire it from markup with no JavaScript at all -->
<button class="zak-btn zak-btn--outlined zak-btn--sm" type="button"
        data-zak-snackbar="Draft deleted" data-zak-snackbar-action="Undo">Show with Undo</button>`,
    js: `// ZakUI.snackbar(message, options) — bottom-centred, auto-dismissing
ZakUI.snackbar('Draft deleted', {
  actionLabel: 'Undo',            // renders the trailing link button
  onAction: () => restoreDraft(), // callback runs, then the snackbar leaves
  duration: 4000,                 // 0 pins it; hover/focus pauses the countdown
});

// The same call through the controller class
ZakSnackbar.show('Invite revoked', { actionLabel: 'Undo' });

// Clicking Undo without an onAction callback emits a zak:snackbar-action event
document.addEventListener('zak:snackbar-action', (e) => {
  console.log(e.detail.action, '→', e.detail.message);
});`,
    examples: [
      {
        title: 'Message with Undo',
        desc: 'The canonical case: one line of copy plus exactly one recovery action on the inverse surface.',
        tpl: `<div class="zak-snackbar" role="status">
      <span class="zak-snackbar__msg">Draft deleted</span>
      <button class="zak-btn zak-btn--link zak-btn--sm" type="button">Undo</button>
    </div>`,
        code: `<div class="zak-snackbar" role="status">
  <span class="zak-snackbar__msg">Draft deleted</span>
  <!-- The action inherits the secondary-300 link tone from .zak-snackbar -->
  <button class="zak-btn zak-btn--link zak-btn--sm" type="button">Undo</button>
</div>`,
      },
      {
        title: 'Message only',
        desc: 'When nothing can be undone, the message stands alone — the region still announces it politely.',
        tpl: `<div class="zak-snackbar" role="status">
      <span class="zak-snackbar__msg">Message moved to Trash</span>
    </div>`,
        code: `<div class="zak-snackbar" role="status">
  <span class="zak-snackbar__msg">Message moved to Trash</span>
</div>`,
      },
      {
        title: 'Fired from attributes',
        desc: 'Zero inline JavaScript: `data-zak-snackbar` carries the message, the companion attributes carry the action label and the lifetime.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button" data-zak-snackbar="Draft deleted" data-zak-snackbar-action="Undo">With Undo</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-snackbar="Message moved to Trash">Plain message</button>
    <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-snackbar="Sync paused" data-zak-snackbar-duration="0">Pinned</button>
  </div>`,
        code: `<button class="zak-btn zak-btn--outlined zak-btn--sm" type="button"
        data-zak-snackbar="Draft deleted" data-zak-snackbar-action="Undo">With Undo</button>

<!-- data-zak-snackbar-duration="0" — stays until the action is used -->
<button class="zak-btn zak-btn--text zak-btn--sm" type="button"
        data-zak-snackbar="Sync paused" data-zak-snackbar-duration="0">Pinned</button>`,
      },
      {
        title: 'Action callback',
        desc: '`onAction` runs before the snackbar leaves; without it the click emits `zak:snackbar-action` so any listener can react.',
        tpl: `<div class="zak-snackbar" role="status">
      <span class="zak-snackbar__msg">Invite revoked for samuel@zakui.dev</span>
      <button class="zak-btn zak-btn--link zak-btn--sm" type="button">Undo</button>
    </div>`,
        code: `<script>
  ZakUI.snackbar('Invite revoked', {
    actionLabel: 'Undo',
    onAction: () => restoreInvite(),   // runs, then the snackbar leaves
    duration: 0,                       // wait for the user instead of a timer
  });
</script>`,
        js: `// Controller-class entry point over the same runtime
ZakSnackbar.show('Draft deleted', { actionLabel: 'Undo' });

// Clicking an action with no callback bound emits the event instead
document.addEventListener('zak:snackbar-action', (event) => {
  console.log(event.detail.action, '→', event.detail.message);
});`,
      },
    ],
    props: [
      ['ZakUI.snackbar(message, opts)', 'api', '—', 'Show a snackbar — opts { actionLabel, onAction, duration }.'],
      ['ZakSnackbar.show(message, opts)', 'api', '—', 'Controller-class entry point over the same runtime.'],
      ['data-zak-snackbar', 'attr', '—', 'Any clicked element shows this message — no inline JS.'],
      ['data-zak-snackbar-action', 'attr', '—', 'Trailing action label; fires zak:snackbar-action when no callback is bound.'],
      ['data-zak-snackbar-duration', 'attr', '4000ms', 'Auto-dismiss delay; 0 keeps it until the action is used.'],
      ['.zak-snackbar-region', 'element', 'bottom-center', 'Fixed live region (aria-live=polite) created on first call.'],
      ['.zak-snackbar.is-leaving', 'class', '—', 'Drop-out exit; the node is removed on animationend.'],
      ['inverse surface', 'token', '—', 'bg-inverse / text-inverse — flips correctly with the theme.'],
      ['Undo as link button', 'pattern', '—', 'The recovery action uses the secondary-300 link tone.'],
    ],
    notes: ['Snackbars carry exactly one action; if the operation needs more, promote it to a toast with actions.'],
  }),
  notification: defineDemo({
    desc: 'Rich notification cards with unread state, actor avatar, body copy and relative time — the inbox-unit of the feedback family.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:30rem">
    <article class="zak-notification is-unread">
      <span class="zak-avatar zak-avatar--sm">MW</span>
      <div class="zak-notification__body">
        <div class="zak-notification__title">Marcus Webb requested access</div>
        <div class="zak-notification__desc">Wants editor rights on the platform workspace for the migration window.</div>
        <div class="zak-notification__time">4 minutes ago</div>
      </div>
      <span style="display:flex;gap:var(--zak-space-1);align-items:flex-start">
        <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">Approve</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Deny</button>
      </span>
    </article>
    <article class="zak-notification">
      <span class="zak-avatar zak-avatar--sm">PR</span>
      <div class="zak-notification__body">
        <div class="zak-notification__title">Priya Raman mentioned you</div>
        <div class="zak-notification__desc">“@abdul the grid filter schema needs one more column — can you check?”</div>
        <div class="zak-notification__time">1 hour ago</div>
      </div>
    </article>
  </div>`,
    codeTpl: `<!-- is-unread adds the brand leading border -->
<article class="zak-notification is-unread">
  <span class="zak-avatar zak-avatar--sm">MW</span>
  <div class="zak-notification__body">
    <div class="zak-notification__title">Marcus Webb requested access</div>
    <div class="zak-notification__desc">Wants editor rights for the migration window.</div>
    <!-- Relative timestamp in the tertiary tone -->
    <div class="zak-notification__time">4 minutes ago</div>
  </div>
  <!-- Actions slot: trailing button cluster aligned to the top -->
  <span style="display:flex;gap:var(--zak-space-1);align-items:flex-start">
    <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">Approve</button>
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Deny</button>
  </span>
</article>

<!-- Read state drops is-unread and the actions slot -->
<article class="zak-notification">
  <span class="zak-avatar zak-avatar--sm">PR</span>
  <div class="zak-notification__body">
    <div class="zak-notification__title">Priya Raman mentioned you</div>
    <div class="zak-notification__time">1 hour ago</div>
  </div>
</article>`,
    props: [
      ['.is-unread', 'class', '—', 'Brand 3px leading border; remove on read.'],
      ['actions slot', 'pattern', '—', 'Trailing button cluster aligned to the top.'],
      ['.zak-notification__time', 'element', '—', 'Tertiary relative timestamp.'],
    ],
  }),
  progress: defineDemo({
    desc: 'Determinate bars in four tones, size modifiers, stripe animation for in-flight work and an indeterminate mode when no percentage exists.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:30rem">
    <div>
      <div class="zak-flex" style="justify-content:space-between;font-size:var(--zak-text-xs);color:var(--zak-text-secondary);margin-block-end:var(--zak-space-1)"><span>Uploading assets</span><span class="zak-table__num">64%</span></div>
      <span class="zak-progress"><span class="zak-progress__bar" style="--value:64%"></span></span>
    </div>
    <div>
      <div class="zak-flex" style="justify-content:space-between;font-size:var(--zak-text-xs);color:var(--zak-text-secondary);margin-block-end:var(--zak-space-1)"><span>Backup complete</span><span class="zak-table__num">100%</span></div>
      <span class="zak-progress zak-progress--success"><span class="zak-progress__bar" style="--value:100%"></span></span>
    </div>
    <div>
      <div class="zak-flex" style="justify-content:space-between;font-size:var(--zak-text-xs);color:var(--zak-text-secondary);margin-block-end:var(--zak-space-1)"><span>Storage quota</span><span class="zak-table__num">82%</span></div>
      <span class="zak-progress zak-progress--warning zak-progress--lg"><span class="zak-progress__bar" style="--value:82%"></span></span>
    </div>
    <div>
      <div class="zak-flex" style="justify-content:space-between;font-size:var(--zak-text-xs);color:var(--zak-text-secondary);margin-block-end:var(--zak-space-1)"><span>Failed uploads</span><span class="zak-table__num">12%</span></div>
      <span class="zak-progress zak-progress--danger zak-progress--sm"><span class="zak-progress__bar" style="--value:12%"></span></span>
    </div>
    <div>
      <div class="zak-flex" style="justify-content:space-between;font-size:var(--zak-text-xs);color:var(--zak-text-secondary);margin-block-end:var(--zak-space-1)"><span>Deploying… (indeterminate)</span><span></span></div>
      <span class="zak-progress zak-progress--indeterminate zak-progress-stripes"><span class="zak-progress__bar"></span></span>
    </div>
  </div>`,
    codeTpl: `<!-- Determinate: fill width comes from --value -->
<span class="zak-progress">
  <span class="zak-progress__bar" style="--value:64%"></span>
</span>

<!-- Height modifiers: --sm / --lg -->
<span class="zak-progress zak-progress--sm">
  <span class="zak-progress__bar" style="--value:64%"></span>
</span>
<span class="zak-progress zak-progress--lg">
  <span class="zak-progress__bar" style="--value:64%"></span>
</span>

<!-- Indeterminate sweeps a 40% bar when progress is unknown -->
<span class="zak-progress zak-progress--indeterminate">
  <span class="zak-progress__bar"></span>
</span>

<!-- Animated 45° stripes for active transfers -->
<span class="zak-progress zak-progress-stripes">
  <span class="zak-progress__bar" style="--value:64%"></span>
</span>`,
    props: [
      ['--value', 'token', '0%', 'Fill width; animate it and the bar transitions on a slow ease-out.'],
      ['--sm / --lg', 'modifier', '0.5rem', 'Track height 0.3rem / 0.5rem / 0.75rem.'],
      ['--indeterminate', 'modifier', '—', 'Sweeps a 40% bar when progress is unknown.'],
      ['.zak-progress-stripes', 'class', '—', 'Animated 45° stripes for active transfers.'],
    ],
    a11y: {
      aria: [
        ['role="progressbar"', 'With aria-valuenow / valuemin / valuemax on determinate bars.'],
        ['aria-label', 'Name the operation — "Uploading assets".'],
      ],
    },
  }),
  'progress-circle': defineDemo({
    desc: 'Radial progress for compact spaces: an SVG ring driven by `--value`, with the numeric label centered and the track on the muted token.',
    stage: 'center',
    tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-6);align-items:center;justify-content:center">
    <div class="zak-progress-circle" role="img" aria-label="72 percent complete">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="45"></circle><circle class="fill" cx="50" cy="50" r="45" style="--value:72"></circle></svg>
      <span class="zak-progress-circle__label">72%</span>
    </div>
    <div class="zak-progress-circle" style="--size:3.2rem;--stroke:0.32rem" role="img" aria-label="38 percent complete">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="45"></circle><circle class="fill" cx="50" cy="50" r="45" style="--value:38"></circle></svg>
      <span class="zak-progress-circle__label" style="font-size:var(--zak-text-2xs)">38%</span>
    </div>
    <div class="zak-progress-circle" role="img" aria-label="100 percent complete">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="45"></circle><circle class="fill" cx="50" cy="50" r="45" style="--value:100;stroke:var(--zak-success)"></circle></svg>
      <span class="zak-progress-circle__label">${checkI}</span>
    </div>
  </div>`,
    codeTpl: `<!-- --value drives the dash offset -->
<div class="zak-progress-circle" role="img" aria-label="72 percent complete">
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="track" cx="50" cy="50" r="45"/>
    <circle class="fill" cx="50" cy="50" r="45" style="--value:72"/>
  </svg>
  <span class="zak-progress-circle__label">72%</span>
</div>

<!-- --size / --stroke resize the ring -->
<div class="zak-progress-circle" style="--size:3.2rem;--stroke:0.32rem" role="img" aria-label="38 percent complete">
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="track" cx="50" cy="50" r="45"/>
    <circle class="fill" cx="50" cy="50" r="45" style="--value:38"/>
  </svg>
  <span class="zak-progress-circle__label">38%</span>
</div>

<!-- --circ overrides the circumference when the radius changes -->
<div class="zak-progress-circle" style="--circ:251" role="img" aria-label="60 percent complete">
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="track" cx="50" cy="50" r="40"/>
    <circle class="fill" cx="50" cy="50" r="40" style="--value:60"/>
  </svg>
  <span class="zak-progress-circle__label">60%</span>
</div>`,
    props: [
      ['--size / --stroke', 'token', '4rem / 0.4rem', 'Ring diameter and stroke width.'],
      ['--value', 'token', '0', '0–100; the dash offset is computed in CSS from it.'],
      ['--circ', 'token', '283', 'Circumference override when the radius changes.'],
    ],
  }),
  spinner: defineDemo({
    desc: 'Ring spinners in three sizes, a bouncing-dots flavor for AI contexts, and the loading-button pattern where the spinner inherits the em box.',
    tpl: `<div class="zak-stack zak-stack--lg" style="align-items:center">
    <div class="zak-flex" style="gap:var(--zak-space-5);align-items:center">
      <span class="zak-spinner zak-spinner--sm" role="status" aria-label="Loading"></span>
      <span class="zak-spinner" role="status" aria-label="Loading"></span>
      <span class="zak-spinner zak-spinner--lg" role="status" aria-label="Loading"></span>
      <span class="zak-spinner zak-spinner--dots" role="status" aria-label="Loading"><i></i><i></i><i></i></span>
    </div>
    <button class="zak-btn zak-btn--primary is-loading" type="button" aria-busy="true">
      <span class="zak-btn__spinner" aria-hidden="true"></span>
      <span>Saving changes…</span>
    </button>
  </div>`,
    codeTpl: `<!-- Sizes: default · --sm · --lg -->
<span class="zak-spinner" role="status" aria-label="Loading"></span>
<span class="zak-spinner zak-spinner--sm" role="status" aria-label="Loading"></span>
<span class="zak-spinner zak-spinner--lg" role="status" aria-label="Loading"></span>

<!-- Bouncing dots — pairs well with AI surfaces -->
<span class="zak-spinner zak-spinner--dots" role="status" aria-label="Loading"><i></i><i></i><i></i></span>

<!-- In-button spinner sized in em -->
<button class="zak-btn zak-btn--primary is-loading" type="button" aria-busy="true">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Saving changes…</span>
</button>`,
    props: [
      ['--sm / --lg', 'modifier', '1.35rem', 'Ring sizes 1rem / 1.35rem / 2.25rem.'],
      ['--dots', 'modifier', '—', 'Three bouncing dots — pairs well with AI surfaces.'],
      ['.zak-btn__spinner', 'element', '—', 'In-button spinner sized in em, so it scales with any button size.'],
    ],
    a11y: {
      aria: [
        ['role="status"', 'Announce loading politely, twice max — do not spam.'],
        ['aria-busy', 'Set on the busy region or button instead of relying on the spinner.'],
      ],
    },
  }),
  skeleton: defineDemo({
    desc: 'Content-shaped placeholders with a shimmer sweep: build the skeleton out of the same box model as the real content so the swap is collinear.',
    stage: 'stretch',
    tpl: `<div class="zak-skeleton-card" style="width:100%;max-width:26rem" aria-hidden="true">
    <div class="zak-skeleton-card__head">
      <span class="zak-skeleton zak-skeleton--circle"></span>
      <span style="flex:1;display:flex;flex-direction:column;gap:6px"><span class="zak-skeleton zak-skeleton--title" style="width:45%"></span><span class="zak-skeleton zak-skeleton--text" style="width:30%"></span></span>
    </div>
    <span class="zak-skeleton zak-skeleton--text"></span>
    <span class="zak-skeleton zak-skeleton--text" style="width:92%"></span>
    <span class="zak-skeleton zak-skeleton--text" style="width:64%"></span>
    <div class="zak-flex" style="gap:var(--zak-space-2);margin-block-start:var(--zak-space-2)">
      <span class="zak-skeleton zak-skeleton--btn"></span>
      <span class="zak-skeleton zak-skeleton--btn" style="width:5.5rem"></span>
    </div>
  </div>
  <p class="zak-hint" style="margin-block-start:var(--zak-space-3)">Swap in when the real card arrives — head, lines and buttons keep their exact boxes.</p>`,
    codeTpl: `<!-- Shape presets: --text · --title · --circle · --rect · --btn -->
<div class="zak-skeleton-card" aria-hidden="true">
  <div class="zak-skeleton-card__head">
    <span class="zak-skeleton zak-skeleton--circle"></span>
    <span class="zak-skeleton zak-skeleton--title" style="width:45%"></span>
  </div>
  <span class="zak-skeleton zak-skeleton--text"></span>
  <span class="zak-skeleton zak-skeleton--text" style="width:64%"></span>
  <span class="zak-skeleton zak-skeleton--rect" style="height:4rem"></span>
  <span class="zak-skeleton zak-skeleton--btn"></span>
</div>

<!-- 1.6s shimmer sweep runs on ::after — disable under reduced motion -->`,
    props: [
      ['--text / --title / --circle / --rect / --btn', 'modifier', '—', 'Preset shapes: 0.85rem pill, 1.2rem pill, 40px circle, 80px rect, button.'],
      ['.zak-skeleton-card', 'element', '—', 'Pre-composed card scaffold matching the common card rhythm.'],
      ['shimmer', 'animation', '—', '1.6s translate sweep on ::after — disable under reduced motion.'],
    ],
    a11y: {
      aria: [
        ['aria-hidden="true"', 'Skeletons are decorative; hide them from AT.'],
        ['aria-busy', 'The busy region announces "loading" once instead.'],
      ],
    },
  }),
  loading: defineDemo({
    desc: 'Region-level loading: a blurred veil over the existing content with a centered spinner and label, so the Layout never jumps to a blank page.',
    stage: 'stretch',
    tpl: `<div class="zak-loading-overlay" style="width:100%;max-width:26rem;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface)">
    <div style="padding:var(--zak-space-5);display:flex;flex-direction:column;gap:var(--zak-space-3)">
      <div style="font-weight:var(--zak-weight-semibold)">Workspace overview</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--zak-space-3)">
        <div class="zak-stat"><span class="zak-stat__label">Deploys</span><span class="zak-stat__value" style="font-size:var(--zak-text-xl)">142</span></div>
        <div class="zak-stat"><span class="zak-stat__label">Members</span><span class="zak-stat__value" style="font-size:var(--zak-text-xl)">24</span></div>
        <div class="zak-stat"><span class="zak-stat__label">Uptime</span><span class="zak-stat__value" style="font-size:var(--zak-text-xl)">99.98%</span></div>
      </div>
      <div style="height:4rem;border-radius:var(--zak-radius-md);background:var(--zak-bg-muted)"></div>
    </div>
    <div class="zak-loading-overlay__content"><span class="zak-spinner"></span><span>Syncing workspace…</span></div>
  </div>`,
    codeTpl: `<!-- Apply the veil to any region while its data loads -->
<div class="zak-loading-overlay">
  <div class="your-content">…</div>
  <!-- Centered spinner + label sit above the veil -->
  <div class="zak-loading-overlay__content">
    <span class="zak-spinner"></span>
    <span>Syncing workspace…</span>
  </div>
</div>

<!-- Best for regions up to a viewport — beyond that prefer skeletons -->`,
    js: `const content = document.createElement('div');
content.className = 'zak-loading-overlay__content';

const spinner = document.createElement('span');
spinner.className = 'zak-spinner';

const label = document.createElement('span');
label.textContent = 'Syncing workspace…';

content.append(spinner, label);
region.classList.add('zak-loading-overlay');
region.append(content);`,
    props: [
      ['.zak-loading-overlay', 'class', '—', 'Veil (::after) with backdrop blur over the region.'],
      ['.zak-loading-overlay__content', 'element', '—', 'Centered spinner + label above the veil.'],
      ['best for', 'guideline', '—', 'Regions up to a viewport — beyond that prefer skeletons.'],
    ],
  }),
  'empty-state': defineDemo({
    desc: 'Zero-data guidance that explains what belongs here and how to add it: icon halo, one-line title, one-sentence description, then actions.',
    tpl: `<div class="zak-empty" style="width:100%;max-width:30rem;border:1px dashed var(--zak-border-color);border-radius:var(--zak-radius-lg)">
    <span class="zak-empty__icon">${folderI}</span>
    <div class="zak-empty__title">No projects yet</div>
    <p class="zak-empty__desc" style="margin:0">Projects group your deployments, secrets and members. Create one to run your first pipeline.</p>
    <div class="zak-flex" style="justify-content:center;gap:var(--zak-space-2);margin-block-start:var(--zak-space-2)">
      <button class="zak-btn zak-btn--primary" type="button">New project</button>
      <button class="zak-btn zak-btn--ghost" type="button">Import from GitHub</button>
    </div>
  </div>`,
    codeTpl: `<!-- Icon halo, one-line title, one-sentence description, then actions -->
<div class="zak-empty">
  <span class="zak-empty__icon">📁</span>
  <div class="zak-empty__title">No projects yet</div>
  <p class="zak-empty__desc">Projects group your deployments, secrets and members. Create one to run your first pipeline.</p>
  <div class="zak-flex" style="justify-content:center;gap:var(--zak-space-2)">
    <button class="zak-btn zak-btn--primary" type="button">New project</button>
    <button class="zak-btn zak-btn--ghost" type="button">Import from GitHub</button>
  </div>
</div>`,
    props: [
      ['.zak-empty__icon', 'element', '—', '56px muted circle that anchors the composition.'],
      ['.zak-empty__desc', 'element', '—', 'Max 42ch — one sentence, verb-first.'],
      ['actions', 'pattern', '—', 'Primary create action + one secondary import path.'],
    ],
    notes: ['Never show an empty state for filtered-to-zero results — that is a different message with a “Clear filters” action.'],
  }),
  result: defineDemo({
    desc: 'Terminal outcomes for multi-step flows: a status halo, headline, explanatory copy and route-out actions. Success and failure share one skeleton.',
    stage: 'stretch',
    tpl: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:var(--zak-space-4);width:100%">
    <div class="zak-result" style="border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
      <span class="zak-result__icon">${svgIcon('check-circle', 'zak-icon', 26)}</span>
      <div class="zak-result__title">Payment successful</div>
      <p class="zak-result__desc" style="margin:0">$148.00 charged to •••• 4242. A receipt was sent to abdul@zakui.dev.</p>
      <div class="zak-result__actions">
        <button class="zak-btn zak-btn--primary" type="button">View receipt</button>
        <button class="zak-btn zak-btn--ghost" type="button">Back to dashboard</button>
      </div>
    </div>
    <div class="zak-result zak-result--danger" style="border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
      <span class="zak-result__icon">${errI}</span>
      <div class="zak-result__title">Deployment failed</div>
      <p class="zak-result__desc" style="margin:0">Node 7 failed its health check after 3 retries. The previous release is still serving traffic.</p>
      <div class="zak-result__actions">
        <button class="zak-btn zak-btn--primary" type="button">Retry deploy</button>
        <button class="zak-btn zak-btn--ghost" type="button">View logs</button>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Success (default tone) with route-out actions -->
<div class="zak-result">
  <span class="zak-result__icon">✓</span>
  <div class="zak-result__title">Payment successful</div>
  <p class="zak-result__desc" style="margin:0">$148.00 charged to •••• 4242.</p>
  <div class="zak-result__actions">
    <button class="zak-btn zak-btn--primary" type="button">View receipt</button>
    <button class="zak-btn zak-btn--ghost" type="button">Back to dashboard</button>
  </div>
</div>

<!-- --danger / --warning recolor the halo; success is the default -->
<div class="zak-result zak-result--danger">
  <span class="zak-result__icon">⚠</span>
  <div class="zak-result__title">Deployment failed</div>
  <div class="zak-result__actions">
    <button class="zak-btn zak-btn--primary" type="button">Retry deploy</button>
  </div>
</div>`,
    props: [
      ['--danger / --warning', 'modifier', '—', 'Recolors the halo; success is the default tone.'],
      ['.zak-result__actions', 'pattern', '—', 'Primary retry/continue + one exit route.'],
    ],
  }),
  'status-indicator': defineDemo({
    desc: 'Availability dots with optional pulse — the compact form of an operational status, always text-paired so color is never the only signal.',
    tpl: `<div class="zak-stack zak-stack--md">
    <span class="zak-status zak-status--online zak-status--pulse">All systems operational</span>
    <span class="zak-status zak-status--busy">Incident in progress · #4822</span>
    <span class="zak-status zak-status--away">Degraded performance in eu-west-1</span>
    <span class="zak-status zak-status--offline">Maintenance window until 04:00 UTC</span>
    <span class="zak-status">Status unknown in 1 region</span>
  </div>`,
    codeTpl: `<!-- Dot + text tones: --online · --busy · --away · --offline -->
<span class="zak-status zak-status--online">All systems operational</span>
<span class="zak-status zak-status--busy">Incident in progress · #4822</span>
<span class="zak-status zak-status--away">Degraded performance in eu-west-1</span>
<span class="zak-status zak-status--offline">Maintenance window until 04:00 UTC</span>

<!-- --pulse adds the 1.8s halo — reserve for live states -->
<span class="zak-status zak-status--online zak-status--pulse">All systems operational</span>

<!-- The dot is pure ::before CSS — no extra element needed -->`,
    props: [
      ['--online / --busy / --away / --offline', 'modifier', '—', 'Dot + text tone; pairs with the status taxonomy.'],
      ['--pulse', 'modifier', '—', '1.8s halo pulse — reserve for live states.'],
      ['::before dot', 'css', '—', 'Pure CSS dot; no extra element needed.'],
    ],
    a11y: {
      aria: [
        ['text pairing', 'The label after the dot is the accessible content — never remove it.'],
        ['role="status"', 'Use when the value updates live (monitoring dashboards).'],
      ],
    },
  }),
};
