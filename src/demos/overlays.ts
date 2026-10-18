/**
 * Demos — Overlays: modal, dialog, drawer, offcanvas, popover, tooltip,
 * dropdown and context menu. Native-first: <dialog> + the Popover API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const xI = svgIcon('x', 'zak-icon', 15);
const mailI = svgIcon('mail', 'zak-icon', 18);
const warnI = svgIcon('alert-triangle', 'zak-icon', 18);
const rocketI = svgIcon('rocket', 'zak-icon', 18);
const keyI = svgIcon('lock', 'zak-icon', 18);
const editI = svgIcon('edit', 'zak-icon', 14);
const copyI = svgIcon('copy', 'zak-icon', 14);
const downloadI = svgIcon('download', 'zak-icon', 14);
const trashI = svgIcon('trash', 'zak-icon', 14);
const fileI = svgIcon('file', 'zak-icon', 17);
const externalI = svgIcon('external', 'zak-icon', 13);
const moreI = svgIcon('more-h', 'zak-icon', 15);
const refreshI = svgIcon('refresh', 'zak-icon', 15);
const chevDown = svgIcon('chevron-down', 'zak-icon', 13);
const printI = svgIcon('file', 'zak-icon', 14);

export const overlayDemos: Record<string, DemoDef> = {
  modal: defineDemo({
    desc: 'The standard task dialog: centred, size-staged and blocking. Built on a native <dialog>, so Esc, focus containment and the dimmed backdrop come from the platform — no focus-trap library.',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3);justify-content:center;align-items:center">
    <button class="zak-btn zak-btn--primary" type="button" data-zak-toggle="modal" data-zak-target="#demo-modal">Open modal</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="modal" data-zak-target="#demo-modal-sm">Small prompt</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="modal" data-zak-target="#demo-modal-lg">Large</button>
  </div>

  <dialog class="zak-modal" id="demo-modal" aria-labelledby="demo-modal-title" aria-describedby="demo-modal-desc">
    <div class="zak-modal__header">
      <span class="zak-modal__icon">${mailI}</span>
      <div>
        <div class="zak-modal__title" id="demo-modal-title">Invite teammates</div>
        <div class="zak-modal__subtitle" id="demo-modal-desc">They receive an email link to join the platform workspace.</div>
      </div>
      <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>${xI}</button>
    </div>
    <div class="zak-modal__body">
      <div class="zak-stack zak-stack--md">
        <div class="zak-field">
          <label class="zak-label" for="invite-email">Work email <span class="zak-label__req" aria-hidden="true">*</span></label>
          <input class="zak-input" id="invite-email" type="email" placeholder="name@acme.com" required/>
        </div>
        <div class="zak-field">
          <label class="zak-label" for="invite-role">Role</label>
          <select class="zak-select" id="invite-role"><option>Viewer</option><option selected>Editor</option><option>Admin</option></select>
          <div class="zak-hint">Admins can manage billing and API keys.</div>
        </div>
      </div>
    </div>
    <div class="zak-modal__footer">
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
      <button class="zak-btn zak-btn--primary" type="button">Send invite</button>
    </div>
  </dialog>

  <dialog class="zak-modal zak-modal--sm" id="demo-modal-sm" aria-labelledby="demo-modal-sm-title">
    <div class="zak-modal__header">
      <div>
        <div class="zak-modal__title" id="demo-modal-sm-title">Rename workspace</div>
        <div class="zak-modal__subtitle">Visible to every member of Acme Corp.</div>
      </div>
      <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>${xI}</button>
    </div>
    <div class="zak-modal__body">
      <div class="zak-field">
        <label class="zak-label" for="ws-name">Workspace name</label>
        <input class="zak-input" id="ws-name" value="Platform Core"/>
      </div>
    </div>
    <div class="zak-modal__footer">
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
      <button class="zak-btn zak-btn--primary" type="button" data-zak-close>Save name</button>
    </div>
  </dialog>

  <dialog class="zak-modal zak-modal--lg" id="demo-modal-lg" aria-labelledby="demo-modal-lg-title">
    <div class="zak-modal__header">
      <span class="zak-modal__icon">${rocketI}</span>
      <div>
        <div class="zak-modal__title" id="demo-modal-lg-title">What’s new in 2.4</div>
        <div class="zak-modal__subtitle">Released 2 July · 14 additions · 6 fixes</div>
      </div>
      <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>${xI}</button>
    </div>
    <div class="zak-modal__body">
      <ul style="margin:0;padding-inline-start:var(--zak-space-5);display:flex;flex-direction:column;gap:var(--zak-space-2)">
        <li><strong>Streaming AI components</strong> — prompts, chat and streaming responses left beta.</li>
        <li><strong>Data grid virtual mode</strong> now handles 100k rows with a stable scroll position.</li>
        <li><strong>Container-query toolbars</strong> collapse to icon-only below 34rem — automatically.</li>
        <li><strong>Density tokens</strong> add a comfortable / compact switch at the app root.</li>
      </ul>
    </div>
    <div class="zak-modal__footer">
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Remind me later</button>
      <button class="zak-btn zak-btn--primary" type="button" data-zak-close>Got it</button>
    </div>
  </dialog>`,
    codeTpl: `<!-- Trigger contract: data-zak-toggle="modal" + data-zak-target="#invite" -->
<button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="modal" data-zak-target="#invite">Open modal</button>

<!-- Native <dialog> — showModal() gives top layer, focus containment and Esc -->
<dialog class="zak-modal" id="invite" aria-labelledby="invite-title" aria-describedby="invite-desc">
  <div class="zak-modal__header">
    <!-- .zak-modal__icon--danger tones the header chip: brand · danger · success · warning -->
    <span class="zak-modal__icon zak-modal__icon--danger">⚑</span>
    <div>
      <div class="zak-modal__title" id="invite-title">Invite teammates</div>
      <div class="zak-modal__subtitle" id="invite-desc">They receive an email link to join the workspace.</div>
    </div>
    <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>✕</button>
  </div>
  <div class="zak-modal__body">…</div>
  <!-- data-zak-close — any button with this attribute closes its host dialog -->
  <div class="zak-modal__footer">
    <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
    <button class="zak-btn zak-btn--filled" type="button">Send invite</button>
  </div>
</dialog>

<!-- Size modifiers: .zak-modal--sm (24rem) · .zak-modal--lg (46rem) · .zak-modal--xl (64rem) -->
<dialog class="zak-modal zak-modal--lg" id="changelog" aria-labelledby="changelog-title">
  <div class="zak-modal__header">
    <div class="zak-modal__title" id="changelog-title">What’s new in 2.4</div>
    <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>✕</button>
  </div>
</dialog>`,
    js: `// Trigger contract — works for any dialog-based overlay
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-zak-toggle][data-zak-target]');
  if (trigger) {
    document.querySelector(trigger.dataset.zakTarget)?.showModal();
  }
  const closer = e.target.closest('[data-zak-close]');
  if (closer) closer.closest('dialog')?.close();
});

// Click on ::backdrop targets the <dialog> itself
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});`,
    props: [
      ['data-zak-toggle="modal"', 'attr', '—', 'Trigger contract; pair with data-zak-target="#id".'],
      ['showModal()', 'method', '—', 'Top layer, focus containment, Esc handling — all native.'],
      ['.zak-modal--sm / --lg / --xl', 'modifier', '—', 'Width staging: 24 / 46 / 64rem, viewport-clamped.'],
      ['.zak-modal__icon--danger', 'modifier', '—', 'Tones the header chip: brand · danger · success · warning.'],
      ['data-zak-close', 'attr', '—', 'Any button with this attribute closes its host dialog.'],
    ],
    a11y: {
      keys: [
        ['Esc', 'Closes the dialog and returns focus to the invoking control.'],
        ['Tab / Shift+Tab', 'Cycles inside the dialog only — the page behind is inert.'],
        ['Enter', 'Submits the primary action when the form is valid.'],
      ],
      aria: [
        ['aria-labelledby / aria-describedby', 'Name and describe the dialog from its title and subtitle ids.'],
        ['aria-modal', 'Implicit via showModal(); the background is removed from the a11y tree.'],
        ['autofocus', 'Place focus on the first logical control when the dialog opens.'],
      ],
    },
  }),
  dialog: defineDemo({
    desc: 'Lightweight alert dialogs for one irreversible decision: explicit tone, consequence spelled out, and the destructive action never the default. Screen readers get role="alertdialog".',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3);justify-content:center">
    <button class="zak-btn zak-btn--danger" type="button" data-zak-toggle="modal" data-zak-target="#demo-dialog-danger">Revoke API key</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="modal" data-zak-target="#demo-dialog-warn">Archive project</button>
  </div>

  <dialog class="zak-modal zak-modal--sm" id="demo-dialog-danger" role="alertdialog" aria-labelledby="dlg-danger-title" aria-describedby="dlg-danger-desc">
    <div class="zak-modal__header">
      <span class="zak-modal__icon zak-modal__icon--danger">${keyI}</span>
      <div>
        <div class="zak-modal__title" id="dlg-danger-title">Revoke this API key?</div>
      </div>
      <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>${xI}</button>
    </div>
    <div class="zak-modal__body" id="dlg-danger-desc">
      Requests signed with <code style="font-family:var(--zak-font-mono);background:var(--zak-code-bg);color:var(--zak-code-text);padding:0.1em 0.4em;border-radius:var(--zak-radius-sm)">zak_live_9f31…e2</code> stop working immediately. This cannot be undone.
    </div>
    <div class="zak-modal__footer">
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
      <button class="zak-btn zak-btn--danger" type="button" data-zak-close>Revoke key</button>
    </div>
  </dialog>

  <dialog class="zak-modal zak-modal--sm" id="demo-dialog-warn" role="alertdialog" aria-labelledby="dlg-warn-title" aria-describedby="dlg-warn-desc">
    <div class="zak-modal__header">
      <span class="zak-modal__icon zak-modal__icon--warning">${warnI}</span>
      <div>
        <div class="zak-modal__title" id="dlg-warn-title">Archive “Billing v2”?</div>
      </div>
      <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>${xI}</button>
    </div>
    <div class="zak-modal__body" id="dlg-warn-desc">
      The project becomes read-only and disappears from team dashboards. You can restore it for 90 days.
    </div>
    <div class="zak-modal__footer">
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Keep active</button>
      <button class="zak-btn zak-btn--primary" type="button" data-zak-close>Archive</button>
    </div>
  </dialog>`,
    codeTpl: `<!-- role="alertdialog" — one irreversible decision, destructive never the default -->
<dialog class="zak-modal zak-modal--sm" id="revoke" role="alertdialog" aria-labelledby="revoke-title" aria-describedby="revoke-desc">
  <div class="zak-modal__header">
    <span class="zak-modal__icon zak-modal__icon--danger">⚑</span>
    <div class="zak-modal__title" id="revoke-title">Revoke this API key?</div>
    <button class="zak-modal__close" type="button" aria-label="Close" data-zak-close>✕</button>
  </div>
  <!-- aria-describedby announces the consequence alongside the title -->
  <div class="zak-modal__body" id="revoke-desc">
    Requests signed with this key stop working immediately. This cannot be undone.
  </div>
  <div class="zak-modal__footer">
    <button class="zak-btn zak-btn--ghost" type="button" data-zak-close autofocus>Cancel</button>
    <button class="zak-btn zak-btn--danger" type="button" data-zak-close>Revoke key</button>
  </div>
</dialog>

<!-- .zak-modal__icon--warning tones the header chip for reversible-but-impactful actions -->
<dialog class="zak-modal zak-modal--sm" id="archive" role="alertdialog" aria-labelledby="archive-title">
  <div class="zak-modal__header">
    <span class="zak-modal__icon zak-modal__icon--warning">⚠</span>
    <div class="zak-modal__title" id="archive-title">Archive “Billing v2”?</div>
  </div>
</dialog>

<!-- default focus: focus Cancel; the destructive button is never the default -->`,
    js: `// Focus the least-destructive action by default
const cancel = dialog.querySelector('.zak-modal__footer .zak-btn--ghost');
dialog.addEventListener('close', () => trigger.focus());
dialog.showModal();
cancel.focus();`,
    props: [
      ['role="alertdialog"', 'attr', '—', 'For decisions that demand attention — never for routine forms.'],
      ['aria-describedby', 'attr', '—', 'Points at the consequence text so it is announced with the title.'],
      ['.zak-modal__icon--warning', 'modifier', '—', 'Warning tone for reversible-but-impactful actions.'],
      ['default focus', 'pattern', '—', 'Focus Cancel; the destructive button is never the default.'],
    ],
    notes: ['Keep alert dialogs to one decision and two buttons. If the user needs context to decide, link out to a full page instead.'],
  }),
  drawer: defineDemo({
    desc: 'Full-height slide-over for editing without leaving context — the list stays visible behind. Header, scrollable body and pinned footer form the three-row shell.',
    tpl: `<div class="zak-flex" style="justify-content:center">
    <button class="zak-btn zak-btn--primary" type="button" data-zak-toggle="drawer" data-zak-target="#demo-drawer">Edit profile</button>
  </div>

  <dialog class="zak-drawer" id="demo-drawer" aria-labelledby="demo-drawer-title">
    <div class="zak-drawer__header">
      <span class="zak-drawer__title" id="demo-drawer-title">Edit profile</span>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button>
    </div>
    <div class="zak-drawer__body">
      <div class="zak-stack zak-stack--md">
        <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3)">
          <span class="zak-avatar zak-avatar--lg">AS</span>
          <div class="zak-stack zak-stack--sm">
            <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">Upload photo</button>
            <span class="zak-hint">PNG or JPG, up to 2 MB.</span>
          </div>
        </div>
        <div class="zak-field">
          <label class="zak-label" for="drawer-name">Full name</label>
          <input class="zak-input" id="drawer-name" value="Abdul Shaikh"/>
        </div>
        <div class="zak-field">
          <label class="zak-label" for="drawer-email">Email</label>
          <input class="zak-input" id="drawer-email" type="email" value="abdul@zakui.dev"/>
        </div>
        <div class="zak-field">
          <label class="zak-label" for="drawer-bio">Bio</label>
          <textarea class="zak-textarea" id="drawer-bio" rows="3">Design systems engineer. Building ZAKUIKit from the tokens up.</textarea>
        </div>
        <div class="zak-field">
          <span class="zak-label">Notifications</span>
          <label class="zak-switch"><input type="checkbox" checked role="switch"/> Deployments</label>
          <label class="zak-switch"><input type="checkbox" role="switch"/> Weekly digest</label>
        </div>
      </div>
    </div>
    <div class="zak-drawer__footer">
      <button class="zak-btn zak-btn--ghost" type="button" style="color:var(--zak-danger-text);margin-inline-end:auto">Delete account</button>
      <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
      <button class="zak-btn zak-btn--primary" type="button" data-zak-close>Save changes</button>
    </div>
  </dialog>`,
    codeTpl: `<!-- .zak-drawer — right-anchored slide-over, 24rem wide, full height, own scroll -->
<div class="zak-flex" style="justify-content:center">
  <button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="drawer" data-zak-target="#profile">Edit profile</button>
</div>

<dialog class="zak-drawer" id="profile" aria-labelledby="profile-title">
  <div class="zak-drawer__header">
    <span class="zak-drawer__title" id="profile-title">Edit profile</span>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>✕</button>
  </div>

  <!-- .zak-drawer__body — the only scrolling region; header and footer stay pinned -->
  <div class="zak-drawer__body">
    <div class="zak-field">
      <label class="zak-label" for="profile-name">Full name</label>
      <input class="zak-input" id="profile-name" value="Abdul Shaikh"/>
    </div>
  </div>

  <!-- margin-inline-end:auto pushes a leading action away from the save cluster -->
  <div class="zak-drawer__footer">
    <button class="zak-btn zak-btn--ghost" type="button" style="color:var(--zak-danger-text);margin-inline-end:auto">Delete account</button>
    <button class="zak-btn zak-btn--ghost" type="button" data-zak-close>Cancel</button>
    <button class="zak-btn zak-btn--primary" type="button" data-zak-close>Save changes</button>
  </div>
</dialog>

<!-- [open] animation: 40px slide-in on the slow duration token, ease-out -->
<!-- Edge: .zak-drawer--right (default) or .zak-drawer--left — mirrors the border -->`,
    js: `// Same trigger contract — the drawer is a <dialog> with slide-in CSS
document.querySelector('[data-zak-toggle="drawer"]')
  .addEventListener('click', (e) => {
    document.querySelector(e.currentTarget.dataset.zakTarget).showModal();
  });

// Unsaved-changes guard before closing
dialog.addEventListener('cancel', (e) => {
  if (formDirty && !confirm('Discard unsaved changes?')) e.preventDefault();
});`,
    examples: [
      {
        title: 'Right (default)',
        desc: 'The drawer is right-anchored by default; `.zak-drawer--right` restates the edge explicitly so it is inspectable in the markup.',
        stage: 'stretch',
        tpl: `<div style="width:100%;max-width:26rem">
    <button class="zak-btn zak-btn--primary" type="button" data-zak-toggle="drawer" data-zak-target="#drawer-right">Open right drawer</button>
    <dialog class="zak-drawer zak-drawer--right" id="drawer-right" aria-labelledby="drawer-right-title">
      <div class="zak-drawer__header"><span class="zak-drawer__title" id="drawer-right-title">Right drawer</span>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button></div>
      <div class="zak-drawer__body"><p>Slides in from the inline-end edge — the list stays visible behind.</p></div>
    </dialog>
  </div>`,
        code: `<dialog class="zak-drawer zak-drawer--right" id="profile" aria-labelledby="profile-title">…</dialog>`,
      },
      {
        title: 'Left',
        desc: '`.zak-drawer--left` anchors the panel to the inline-start edge and mirrors the divider to the right side.',
        stage: 'stretch',
        tpl: `<div style="width:100%;max-width:26rem">
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="drawer" data-zak-target="#drawer-left">Open left drawer</button>
    <dialog class="zak-drawer zak-drawer--left" id="drawer-left" aria-labelledby="drawer-left-title">
      <div class="zak-drawer__header"><span class="zak-drawer__title" id="drawer-left-title">Left drawer</span>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button></div>
      <div class="zak-drawer__body"><p>Slides in from the inline-start edge.</p></div>
    </dialog>
  </div>`,
        code: `<dialog class="zak-drawer zak-drawer--left" id="nav" aria-labelledby="nav-title">…</dialog>`,
      },
    ],
    props: [
      ['.zak-drawer', 'class', '—', 'Right-anchored, 24rem (92vw max), full height, own scroll.'],
      ['.zak-drawer--right', 'modifier', '—', 'Explicit inline-end anchor (identical to the default).'],
      ['.zak-drawer--left', 'modifier', '—', 'Inline-start anchor; mirrors the border to the right edge.'],
      ['[open] animation', 'css', '—', '40px slide-in on the slow duration token, ease-out.'],
      ['.zak-drawer__body', 'element', '—', 'The only scrolling region — header and footer stay pinned.'],
      ['margin-inline-end:auto', 'css', '—', 'A leading footer action (Delete) pushed away from the save cluster.'],
    ],
    a11y: {
      keys: [
        ['Esc', 'Closes the drawer — intercept cancel for unsaved-changes guards.'],
        ['Tab / Shift+Tab', 'Focus stays inside the drawer while it is open.'],
      ],
      aria: [
        ['aria-labelledby', 'Names the drawer from its title element.'],
        ['aria-hidden on background', 'Implicit — showModal() makes the page inert.'],
      ],
    },
  }),
  offcanvas: defineDemo({
    desc: 'Edge panels that feel like persistent surfaces: a left navigation sheet for small screens and a bottom action sheet for thumb reach. Same dialog mechanics, different edges.',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3);justify-content:center">
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="drawer" data-zak-target="#demo-offcanvas-left">Open navigation</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="drawer" data-zak-target="#demo-offcanvas-right">Open panel (right)</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="drawer" data-zak-target="#demo-offcanvas-top">Open top sheet</button>
    <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="drawer" data-zak-target="#demo-offcanvas-bottom">Open share sheet</button>
  </div>

  <dialog class="zak-drawer zak-drawer--left" id="demo-offcanvas-left" aria-labelledby="demo-offcanvas-left-title">
    <div class="zak-drawer__header">
      <span class="zak-ai-avatar zak-ai-avatar--sm" aria-hidden="true"></span>
      <span class="zak-drawer__title" id="demo-offcanvas-left-title">Navigation</span>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button>
    </div>
    <div class="zak-drawer__body">
      <nav aria-label="App sections" class="zak-stack zak-stack--sm">
        <a class="zak-menu__item is-active" href="#">${svgIcon('layout', 'zak-icon', 15)} Overview</a>
        <a class="zak-menu__item" href="#">${fileI} Projects</a>
        <a class="zak-menu__item" href="#">${svgIcon('users', 'zak-icon', 15)} Members</a>
        <a class="zak-menu__item" href="#">${svgIcon('bar-chart', 'zak-icon', 15)} Analytics</a>
        <a class="zak-menu__item" href="#">${svgIcon('settings', 'zak-icon', 15)} Settings</a>
      </nav>
    </div>
    <div class="zak-drawer__footer" style="justify-content:flex-start">
      <span class="zak-avatar zak-avatar--sm">AS</span>
      <span style="font-size:var(--zak-text-sm)">abdul@zakui.dev</span>
    </div>
  </dialog>

  <dialog class="zak-drawer zak-drawer--bottom" id="demo-offcanvas-bottom" aria-labelledby="demo-offcanvas-bottom-title">
    <div class="zak-drawer__header">
      <span class="zak-drawer__title" id="demo-offcanvas-bottom-title">Share document</span>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button>
    </div>
    <div class="zak-drawer__body">
      <div class="zak-stack zak-stack--sm">
        <button class="zak-menu__item" type="button">${copyI} Copy link</button>
        <button class="zak-menu__item" type="button">${downloadI} Download PDF</button>
        <button class="zak-menu__item" type="button">${printI} Print</button>
        <button class="zak-menu__item" type="button" style="color:var(--zak-danger-text)">${trashI} Move to trash</button>
      </div>
    </div>
  </dialog>

  <dialog class="zak-drawer zak-drawer--right" id="demo-offcanvas-right" aria-labelledby="demo-offcanvas-right-title">
    <div class="zak-drawer__header">
      <span class="zak-drawer__title" id="demo-offcanvas-right-title">Details</span>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button>
    </div>
    <div class="zak-drawer__body">
      <p>A right-edge sheet for contextual detail without leaving the page.</p>
    </div>
  </dialog>

  <dialog class="zak-drawer zak-drawer--top" id="demo-offcanvas-top" aria-labelledby="demo-offcanvas-top-title">
    <div class="zak-drawer__header">
      <span class="zak-drawer__title" id="demo-offcanvas-top-title">Announcement</span>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>${xI}</button>
    </div>
    <div class="zak-drawer__body">
      <p>Top-anchored sheet — useful for banners and system notices.</p>
    </div>
  </dialog>`,
    codeTpl: `<!-- .zak-drawer--left — slides in from the inline-start edge -->
<dialog class="zak-drawer zak-drawer--left" id="nav" aria-labelledby="nav-title">
  <div class="zak-drawer__header">
    <span class="zak-drawer__title" id="nav-title">Navigation</span>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close" style="margin-inline-start:auto" data-zak-close>✕</button>
  </div>
  <div class="zak-drawer__body">
    <nav aria-label="App sections" class="zak-stack zak-stack--sm">
      <a class="zak-menu__item is-active" href="#">Overview</a>
      <a class="zak-menu__item" href="#">Projects</a>
      <a class="zak-menu__item" href="#">Settings</a>
    </nav>
  </div>
</dialog>

<!-- .zak-drawer--bottom — bottom action sheet sized for thumb reach -->
<dialog class="zak-drawer zak-drawer--bottom" id="share" aria-labelledby="share-title">
  <div class="zak-drawer__header">
    <span class="zak-drawer__title" id="share-title">Share document</span>
  </div>
  <div class="zak-drawer__body">
    <!-- menu rows in sheets: full-width .zak-menu__item with a leading icon -->
    <div class="zak-stack zak-stack--sm">
      <button class="zak-menu__item" type="button"><svg class="zak-icon" aria-hidden="true">…</svg> Copy link</button>
      <button class="zak-menu__item" type="button"><svg class="zak-icon" aria-hidden="true">…</svg> Download PDF</button>
      <button class="zak-menu__item" type="button" style="color:var(--zak-danger-text)"><svg class="zak-icon" aria-hidden="true">…</svg> Move to trash</button>
    </div>
  </div>
</dialog>

<!-- min-height on rows: keep touch targets at least 44px tall -->
<!-- Positions: .zak-drawer--left · .zak-drawer--right (default) · .zak-drawer--top · .zak-drawer--bottom -->`,
    props: [
      ['.zak-drawer--left', 'modifier', '—', 'Slides in from the inline-start edge; mirrors the border.'],
      ['.zak-drawer--right', 'modifier', '—', 'Slides in from the inline-end edge (the default).'],
      ['.zak-drawer--top', 'modifier', '—', 'Top sheet: full width, rounded bottom corners, 80dvh max.'],
      ['.zak-drawer--bottom', 'modifier', '—', 'Bottom sheet: full width, rounded top corners, 80dvh max.'],
      ['menu rows in sheets', 'pattern', '—', 'Action sheets use full-width menu items with leading icons.'],
      ['min-height on rows', 'token', '44px', 'Touch targets stay at least 44px tall in bottom sheets.'],
    ],
    notes: ['Offcanvas navigation should mirror the desktop sidebar structure exactly — same order, same labels, same active states.'],
  }),
  popover: defineDemo({
    desc: 'Light-dismiss popups built on the Popover API: Escape, click-outside and top-layer stacking come native. The runtime anchors the panel to its trigger — below-start by default, flipping to the side with room — so it never detaches from the control that opened it.',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3);justify-content:center">
    <button class="zak-btn zak-btn--outlined" type="button" popovertarget="demo-pop-notify">Notification settings</button>
    <button class="zak-btn zak-btn--text zak-btn--icon" type="button" popovertarget="demo-pop-quick" aria-label="Quick actions">${moreI}</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="demo-pop-side">Anchored to the side</button>
  </div>

  <div class="zak-popover" popover id="demo-pop-notify" aria-labelledby="demo-pop-notify-title">
    <div id="demo-pop-notify-title" style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-3)">Notify me about</div>
    <div class="zak-stack zak-stack--sm">
      <label class="zak-switch zak-switch--sm"><input type="checkbox" checked role="switch"/> Deployments</label>
      <label class="zak-switch zak-switch--sm"><input type="checkbox" checked role="switch"/> Incident alerts</label>
      <label class="zak-switch zak-switch--sm"><input type="checkbox" role="switch"/> Marketing</label>
    </div>
  </div>

  <div class="zak-popover zak-popover--menu" popover id="demo-pop-quick" aria-label="Quick actions">
    <ul class="zak-menu">
      <li><button class="zak-menu__item" type="button">${editI} Rename</button></li>
      <li><button class="zak-menu__item" type="button">${copyI} Duplicate</button></li>
      <li><button class="zak-menu__item" type="button">${externalI} Open in new tab</button></li>
      <li><div class="zak-menu__sep" role="separator"></div></li>
      <li><button class="zak-menu__item" type="button" style="color:var(--zak-danger-text)">${trashI} Delete</button></li>
    </ul>
  </div>

  <div class="zak-popover" popover id="demo-pop-side" data-zak-placement="end" aria-label="Cell notes">
    <div style="max-width:14rem;font-size:var(--zak-text-sm)">Requested placement is the inline end; the runtime keeps it there only while it fits.</div>
  </div>`,
    codeTpl: `<!-- popovertarget wires the trigger to the panel by id -->
<button class="zak-btn zak-btn--outlined" type="button" popovertarget="notify">Notification settings</button>

<!-- popover="auto" — light dismiss: Esc, outside click and top-layer stacking -->
<div class="zak-popover" popover id="notify" aria-labelledby="notify-title">
  <div id="notify-title" style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-3)">Notify me about</div>
  <div class="zak-stack zak-stack--sm">
    <label class="zak-switch zak-switch--sm"><input type="checkbox" checked role="switch"/> Deployments</label>
    <label class="zak-switch zak-switch--sm"><input type="checkbox" role="switch"/> Incident alerts</label>
  </div>
</div>

<!-- .zak-popover — elevated surface the runtime anchors to its trigger -->
<!-- data-zak-placement="side[-align]" — side: top|bottom|left|right · align: start|center|end (default bottom) -->
<div class="zak-popover" popover id="notes" data-zak-placement="end" aria-label="Cell notes">…</div>

<!-- ::backdrop: none — popovers never dim the page; that is modal-dialog only -->
<!-- toggle event fires with newState on open/close — position the panel on open -->`,
    js: `// Native toggling — no JS needed for open/close at all
// <button popovertarget="panel-id"> + <div popover id="panel-id">

// Popovers never get a ::backdrop — that treatment is modal-dialog only.
// Placement is anchored to the trigger, then clamped into the viewport:
// measure the panel after the open styles apply (rAF), flip when clipped.
document.addEventListener('toggle', (event) => {
  const popover = event.target;
  if (popover.newState !== 'open') return;

  const trigger = popover.invoker ?? document.querySelector('[popovertarget="' + popover.id + '"]');
  const rect = trigger.getBoundingClientRect();
  const gap = 8, edge = 12;
  let placement = popover.dataset.zakPlacement ?? 'bottom';

  // Flip to the opposite side when the preferred one is clipped by the viewport
  const below = rect.bottom + gap + popover.offsetHeight <= innerHeight - edge;
  if (placement === 'bottom' && !below) placement = 'top';

  const top = placement === 'bottom' ? rect.bottom + gap : rect.top - gap - popover.offsetHeight;
  popover.style.left = Math.min(Math.max(edge, rect.left), innerWidth - popover.offsetWidth - edge) + 'px';
  popover.style.top = Math.max(edge, top) + 'px';
});`,
    examples: [
      {
        title: 'Light-dismiss panel',
        desc: 'One trigger, one panel: `popovertarget` opens it, and Escape, an outside click and top-layer stacking are handled by the platform.',
        tpl: `<button class="zak-btn zak-btn--outlined" type="button" popovertarget="ex-pop-notify">Notification settings</button>
  <div class="zak-popover" popover id="ex-pop-notify" aria-labelledby="ex-pop-notify-title">
    <div id="ex-pop-notify-title" style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-3)">Notify me about</div>
    <div class="zak-stack zak-stack--sm">
      <label class="zak-switch zak-switch--sm"><input type="checkbox" checked role="switch"/> Deployments</label>
      <label class="zak-switch zak-switch--sm"><input type="checkbox" role="switch"/> Incident alerts</label>
    </div>
  </div>`,
        code: `<!-- popovertarget wires the trigger to the panel by id -->
<button class="zak-btn zak-btn--outlined" type="button" popovertarget="notify">Notification settings</button>

<!-- popover="auto" — light dismiss: Esc, outside click, top-layer stacking -->
<div class="zak-popover" popover id="notify" aria-labelledby="notify-title">
  <div id="notify-title">Notify me about</div>
  <label class="zak-switch"><input type="checkbox" checked role="switch"/> Deployments</label>
  <label class="zak-switch"><input type="checkbox" role="switch"/> Incident alerts</label>
</div>`,
      },
      {
        title: 'Placement',
        desc: '`data-zak-placement` takes a side with an optional alignment — `top`, `bottom`, `left`, `right` plus `-start` / `-center` / `-end`. The runtime keeps the request only while it fits, then flips to the first side with room.',
        tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3)">
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-tl">Top Left</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-tr">Top Right</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-bl">Bottom Left</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-br">Bottom Right</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-left">Left</button>
    <button class="zak-btn zak-btn--text" type="button" popovertarget="ex-pop-right">Right</button>
  </div>
  <div class="zak-popover" popover id="ex-pop-tl" data-zak-placement="top-start" aria-label="Top left"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored above, left-aligned to the trigger.</div></div>
  <div class="zak-popover" popover id="ex-pop-tr" data-zak-placement="top-end" aria-label="Top right"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored above, right-aligned to the trigger.</div></div>
  <div class="zak-popover" popover id="ex-pop-bl" data-zak-placement="bottom-start" aria-label="Bottom left"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored below, left-aligned — the default.</div></div>
  <div class="zak-popover" popover id="ex-pop-br" data-zak-placement="bottom-end" aria-label="Bottom right"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored below, right-aligned to the trigger.</div></div>
  <div class="zak-popover" popover id="ex-pop-left" data-zak-placement="left" aria-label="Left"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored to the inline-start edge.</div></div>
  <div class="zak-popover" popover id="ex-pop-right" data-zak-placement="right" aria-label="Right"><div style="max-width:12rem;font-size:var(--zak-text-sm)">Anchored to the inline-end edge.</div></div>`,
        code: `<!-- data-zak-placement="side[-align]" -->
<!-- side: top | bottom | left | right  ·  align: start | center | end -->
<button class="zak-btn zak-btn--text" type="button" popovertarget="menu">Top Right</button>
<div class="zak-popover" popover id="menu" data-zak-placement="top-end" aria-label="Menu">…</div>`,
      },
      {
        title: 'Action menu',
        desc: 'A `.zak-menu` list dropped into a `.zak-popover--menu` panel — the modifier strips the list\'s duplicate chrome so items keep one uniform row. The popover owns the dismissal, the menu owns the keyboard ring.',
        tpl: `<button class="zak-btn zak-btn--text zak-btn--icon" type="button" popovertarget="ex-pop-menu" aria-label="Quick actions">${moreI}</button>
  <div class="zak-popover zak-popover--menu" popover id="ex-pop-menu" aria-label="Quick actions">
    <ul class="zak-menu">
      <li><button class="zak-menu__item" type="button">${editI} Rename</button></li>
      <li><button class="zak-menu__item" type="button">${copyI} Duplicate</button></li>
      <li><div class="zak-menu__sep" role="separator"></div></li>
      <li><button class="zak-menu__item" type="button" style="color:var(--zak-danger-text)">${trashI} Delete</button></li>
    </ul>
  </div>`,
        code: `<button class="zak-btn zak-btn--text zak-btn--icon" type="button"
        popovertarget="quick" aria-label="Quick actions"><svg class="zak-icon" aria-hidden="true">…</svg></button>

<!-- .zak-popover--menu strips the embedded list's box chrome -->
<div class="zak-popover zak-popover--menu" popover id="quick" aria-label="Quick actions">
  <ul class="zak-menu">
    <li><button class="zak-menu__item" type="button">Rename</button></li>
    <li><button class="zak-menu__item" type="button">Duplicate</button></li>
    <li><div class="zak-menu__sep" role="separator"></div></li>
    <li><button class="zak-menu__item" type="button" style="color:var(--zak-danger-text)">Delete</button></li>
  </ul>
</div>`,
      },
      {
        title: 'Editable content',
        desc: 'Popovers hold live controls — a field and its commit buttons — without a backdrop or a focus trap.',
        tpl: `<button class="zak-btn zak-btn--outlined" type="button" popovertarget="ex-pop-form">Rename workspace</button>
  <div class="zak-popover" popover id="ex-pop-form" aria-label="Rename workspace">
    <div class="zak-field zak-field--outlined" style="width:14rem">
      <div class="zak-field__row"><label class="zak-label" for="ex-pop-input">Workspace name</label></div>
      <input class="zak-input" id="ex-pop-input" value="northwind-labs"/>
    </div>
    <div class="zak-flex" style="gap:var(--zak-space-2);margin-block-start:var(--zak-space-3)">
      <button class="zak-btn zak-btn--filled zak-btn--sm" type="button" popovertarget="ex-pop-form">Save</button>
      <button class="zak-btn zak-btn--text zak-btn--sm" type="button" popovertarget="ex-pop-form">Cancel</button>
    </div>
  </div>`,
        code: `<!-- A second popovertarget on the action button closes the panel -- no JS -->
<button class="zak-btn zak-btn--outlined" type="button" popovertarget="rename">Rename workspace</button>

<div class="zak-popover" popover id="rename" aria-label="Rename workspace">
  <div class="zak-field zak-field--outlined">
    <div class="zak-field__row"><label class="zak-label" for="ws">Workspace name</label></div>
    <input class="zak-input" id="ws" value="northwind-labs"/>
  </div>
  <button class="zak-btn zak-btn--filled zak-btn--sm" type="button" popovertarget="rename">Save</button>
</div>`,
      },
    ],
    props: [
      ['popovertarget', 'attr', '—', 'Native trigger wiring — pairs with the popover attribute.'],
      ['popover="auto"', 'attr', '—', 'Light-dismiss: Esc, outside click and top-layer stacking.'],
      ['data-zak-placement', 'attr', 'top · bottom · left · right (± start/center/end)', 'Side and optional alignment; the runtime flips to the first side that fits.'],
      ['.zak-popover', 'class', '—', 'Elevated fixed surface; measured and clamped to the viewport on open.'],
      ['.zak-popover--menu', 'modifier', '—', 'Tightens padding and strips the embedded `.zak-menu` chrome for an action-menu surface.'],
      ['::backdrop', 'pseudo', 'none', 'Popovers never dim the page — backdrop styling is scoped to modal dialogs.'],
      ['toggle event', 'event', '—', 'Fires with newState on open/close — position on open.'],
    ],
    a11y: {
      keys: [
        ['Esc', 'Closes the popover and returns focus to the invoker.'],
        ['Tab', 'Moves into the popover; focus leaves trigger light dismiss.'],
      ],
      aria: [
        ['aria-labelledby / aria-label', 'Give each popover an accessible name.'],
        ['aria-expanded', 'Implicit on the invoker while the panel is open.'],
      ],
    },
  }),
  tooltip: defineDemo({
    desc: 'Pure-CSS tooltips on hover and keyboard focus — the bubble fades and lifts 2px in. Attribute-style: one wrapper, one bubble, zero JavaScript.',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-5);align-items:center;justify-content:center;padding-block-start:var(--zak-space-6)">
    <span class="zak-tooltip">
      <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Refresh data">${refreshI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Refresh data</span>
    </span>
    <span class="zak-tooltip">
      <button class="zak-btn zak-btn--outlined" type="button">Deploy ${chevDown}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Runs 412 checks first · ~2 min</span>
    </span>
    <span class="zak-tooltip">
      <span class="zak-badge zak-badge--success" tabindex="0" style="cursor:default"><span class="zak-badge__dot"></span>Healthy</span>
      <span class="zak-tooltip__bubble" role="tooltip">All 12 nodes green for 14 days</span>
    </span>
    <span class="zak-tooltip zak-tooltip--end">
      <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" aria-label="Delete workspace" style="color:var(--zak-danger-text)">${trashI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Delete workspace</span>
    </span>
    <span class="zak-tooltip zak-tooltip--bottom">
      <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Information">${refreshI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Shown below the trigger</span>
    </span>
  </div>`,
    codeTpl: `<!-- .zak-tooltip wraps the trigger and its bubble -->
<span class="zak-tooltip">
  <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Refresh data"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Refresh data</span>
</span>

<!-- .zak-tooltip__bubble — inverse surface offset 0.45rem above the trigger -->
<span class="zak-tooltip">
  <button class="zak-btn zak-btn--outlined" type="button">Deploy</button>
  <span class="zak-tooltip__bubble" role="tooltip">Runs 412 checks first · ~2 min</span>
</span>

<!-- :focus-within — keyboard users see the same bubble as pointer users -->
<span class="zak-tooltip">
  <span class="zak-badge zak-badge--success" tabindex="0">Healthy</span>
  <span class="zak-tooltip__bubble" role="tooltip">All 12 nodes green for 14 days</span>
</span>

<!-- .zak-tooltip--end — right-align the bubble for triggers at the container edge -->
<span class="zak-tooltip zak-tooltip--end">
  <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" aria-label="Delete workspace" style="color:var(--zak-danger-text)"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Delete workspace</span>
</span>

<!-- .zak-tooltip--bottom — drop the bubble below the trigger and flip the arrow -->
<span class="zak-tooltip zak-tooltip--bottom">
  <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Information"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Below the trigger</span>
</span>`,
    css: `.zak-tooltip { position: relative; display: inline-flex; }

.zak-tooltip__bubble {
  position: absolute;
  bottom: calc(100% + 0.45rem);
  left: 50%;
  transform: translateX(-50%) translateY(2px) scale(0.97);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--zak-duration-fast),
    transform var(--zak-duration-fast) var(--zak-ease-out);
}

.zak-tooltip:hover .zak-tooltip__bubble,
.zak-tooltip:focus-within .zak-tooltip__bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

/* .zak-tooltip--bottom drops the bubble below and flips the arrow */
.zak-tooltip--bottom .zak-tooltip__bubble { bottom: auto; top: calc(100% + 0.45rem); }`,
    examples: [
      {
        title: 'Icon button',
        desc: 'The common case: an icon-only control whose name lives in `aria-label` and repeats in the bubble.',
        tpl: `<span class="zak-tooltip">
      <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Refresh data">${refreshI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Refresh data</span>
    </span>`,
        code: `<!-- .zak-tooltip wraps trigger + bubble; the bubble needs no id wiring -->
<span class="zak-tooltip">
  <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Refresh data"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Refresh data</span>
</span>`,
      },
      {
        title: 'Explanatory text',
        desc: 'A labelled button with cost or prerequisite information that does not belong in the button text.',
        tpl: `<span class="zak-tooltip">
      <button class="zak-btn zak-btn--outlined" type="button">Deploy ${chevDown}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Runs 412 checks first · ~2 min</span>
    </span>`,
        code: `<span class="zak-tooltip">
  <button class="zak-btn zak-btn--outlined" type="button">Deploy</button>
  <span class="zak-tooltip__bubble" role="tooltip">Runs 412 checks first · ~2 min</span>
</span>`,
      },
      {
        title: 'Keyboard focus',
        desc: '`:focus-within` reveals the bubble, so any focusable trigger works with the keyboard — no JavaScript involved.',
        tpl: `<span class="zak-tooltip">
      <span class="zak-badge zak-badge--success" tabindex="0"><span class="zak-badge__dot"></span>Healthy</span>
      <span class="zak-tooltip__bubble" role="tooltip">All 12 nodes green for 14 days</span>
    </span>`,
        code: `<!-- tabindex="0" makes the non-interactive trigger reachable by keyboard -->
<span class="zak-tooltip">
  <span class="zak-badge zak-badge--success" tabindex="0">Healthy</span>
  <span class="zak-tooltip__bubble" role="tooltip">All 12 nodes green for 14 days</span>
</span>`,
      },
      {
        title: 'Edge-aligned bubble',
        desc: '`.zak-tooltip--end` right-aligns the bubble so a trigger at the container edge never pushes it off-screen.',
        tpl: `<span class="zak-tooltip zak-tooltip--end">
      <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" aria-label="Delete workspace" style="color:var(--zak-danger-text)">${trashI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Delete workspace</span>
    </span>`,
        code: `<span class="zak-tooltip zak-tooltip--end">
  <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" aria-label="Delete workspace" style="color:var(--zak-danger-text)"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Delete workspace</span>
</span>`,
      },
      {
        title: 'Placement — bottom',
        desc: '`.zak-tooltip--bottom` drops the bubble below the trigger and flips the arrow — for controls at the top edge of a container.',
        tpl: `<span class="zak-tooltip zak-tooltip--bottom">
      <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Information">${refreshI}</button>
      <span class="zak-tooltip__bubble" role="tooltip">Shown below the trigger</span>
    </span>`,
        code: `<span class="zak-tooltip zak-tooltip--bottom">
  <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Information"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  <span class="zak-tooltip__bubble" role="tooltip">Shown below the trigger</span>
</span>`,
      },
    ],
    props: [
      ['.zak-tooltip', 'class', '—', 'Inline-flex wrapper; keeps the trigger and bubble adjacent.'],
      ['.zak-tooltip__bubble', 'element', '—', 'Inverse surface + arrow, offset 0.45rem above the trigger.'],
      [':focus-within', 'selector', '—', 'Keyboard users see the same bubble as pointer users.'],
      ['.zak-tooltip--end', 'modifier', '—', 'Right-aligns the bubble for triggers at the container edge.'],
      ['.zak-tooltip--bottom', 'placement', '—', 'Drops the bubble below the trigger and flips the arrow.'],
    ],
    notes: ['Tooltips must not contain interactive elements or essential-only information. If it is clickable, use a popover.'],
  }),
  'context-menu': defineDemo({
    desc: 'Pointer-positioned actions on a target region — right-click on desktop, long-press on touch. The runtime clamps the panel to the viewport and keeps it keyboard-reachable.',
    tpl: `<div style="width:100%;max-width:32rem" data-zak-context="ctx-files">
    <div style="border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);overflow:hidden;background:var(--zak-bg-surface)">
      <div style="display:flex;align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4);border-block-end:1px solid var(--zak-border-subtle)">
        <span style="color:var(--zak-primary-text)">${fileI}</span>
        <span style="flex:1;font-size:var(--zak-text-sm)">launch-hero.png</span>
        <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">1.2 MB</span>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Actions for launch-hero.png" data-zak-context-trigger="ctx-files">${moreI}</button>
      </div>
      <div style="display:flex;align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4);border-block-end:1px solid var(--zak-border-subtle)">
        <span style="color:var(--zak-primary-text)">${fileI}</span>
        <span style="flex:1;font-size:var(--zak-text-sm)">q3-report.pdf</span>
        <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">4.8 MB</span>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Actions for q3-report.pdf" data-zak-context-trigger="ctx-files">${moreI}</button>
      </div>
      <div style="display:flex;align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4)">
        <span style="color:var(--zak-primary-text)">${fileI}</span>
        <span style="flex:1;font-size:var(--zak-text-sm)">tokens-export.zip</span>
        <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">320 KB</span>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Actions for tokens-export.zip" data-zak-context-trigger="ctx-files">${moreI}</button>
      </div>
    </div>
    <p class="zak-hint" style="margin-block-start:var(--zak-space-3)">Right-click a row — or press the ⋯ button — to open the menu.</p>
  </div>

  <div class="zak-context-menu" id="ctx-files" role="menu" aria-label="File actions" hidden>
    <button class="zak-context-menu__item" type="button" role="menuitem">${externalI} Open <kbd class="zak-kbd">↵</kbd></button>
    <button class="zak-context-menu__item" type="button" role="menuitem">${editI} Rename <kbd class="zak-kbd">F2</kbd></button>
    <button class="zak-context-menu__item" type="button" role="menuitem">${copyI} Duplicate</button>
    <button class="zak-context-menu__item" type="button" role="menuitem">${downloadI} Download</button>
    <div class="zak-menu__sep" role="separator"></div>
    <button class="zak-context-menu__item zak-context-menu__item--danger" type="button" role="menuitem">${trashI} Delete <kbd class="zak-kbd">⌫</kbd></button>
  </div>`,
    codeTpl: `<!-- data-zak-context points the target region at its menu id -->
<div data-zak-context="file-actions">
  <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4)">
    <span style="flex:1;font-size:var(--zak-text-sm)">launch-hero.png</span>
    <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">1.2 MB</span>

    <!-- data-zak-context-trigger keeps the menu keyboard-reachable -->
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Actions" data-zak-context-trigger="file-actions"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>
</div>

<!-- .zak-context-menu — fixed panel, 11.5rem min-width, entrance pop animation -->
<div class="zak-context-menu" id="file-actions" role="menu" aria-label="File actions" hidden>
  <button class="zak-context-menu__item" type="button" role="menuitem"><svg class="zak-icon" aria-hidden="true">…</svg> Open <kbd class="zak-kbd">↵</kbd></button>
  <button class="zak-context-menu__item" type="button" role="menuitem"><svg class="zak-icon" aria-hidden="true">…</svg> Rename <kbd class="zak-kbd">F2</kbd></button>
  <div class="zak-menu__sep" role="separator"></div>

  <!-- .zak-context-menu__item--danger — destructive row with a separator above -->
  <button class="zak-context-menu__item zak-context-menu__item--danger" type="button" role="menuitem"><svg class="zak-icon" aria-hidden="true">…</svg> Delete</button>
</div>`,
    js: `zone.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  openMenu(e.clientX, e.clientY);
});

function openMenu(x, y) {
  menu.hidden = false;
  const r = menu.getBoundingClientRect();
  menu.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
  menu.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  menu.querySelector('[role="menuitem"]').focus();
}

document.addEventListener('pointerdown', (e) => {
  if (!menu.contains(e.target)) menu.hidden = true;
});`,
    props: [
      ['data-zak-context="id"', 'attr', '—', 'Region that listens for contextmenu / long-press.'],
      ['data-zak-context-trigger', 'attr', '—', 'Button alternative so the menu is keyboard-reachable.'],
      ['.zak-context-menu', 'class', '—', 'Fixed panel, 11.5rem min-width, entrance pop animation.'],
      ['.zak-context-menu__item--danger', 'modifier', '—', 'Destructive row with danger text and a separator above.'],
    ],
    a11y: {
      keys: [
        ['Shift+F10 / ContextMenu key', 'Must open the menu at the focused element.'],
        ['↑ / ↓', 'Moves through items; Escape closes and restores focus.'],
      ],
      aria: [
        ['role="menu" / menuitem', 'Structured semantics for the action list.'],
        ['focus first item', 'Move focus into the menu on open so keyboard users continue.'],
      ],
    },
  }),
};
