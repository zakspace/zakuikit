/**
 * Demos — Forms, part 1: scaffolding, text inputs and choice controls.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const userI = svgIcon('user', 'zak-icon', 15);
const sparkI = svgIcon('sparkles', 'zak-icon', 15);
const alertI = svgIcon('alert-circle', 'zak-icon', 14);

export const formDemos: Record<string, DemoDef> = {
  forms: defineDemo({
    desc: 'Form scaffolding: a `.zak-form` stack, an auto-fit `.zak-form-grid`, inline rows and fieldset grouping for sections inside long forms.',
    tpl: `<form class="zak-form" style="width:100%;max-width:34rem" onsubmit="return false">
  <fieldset class="zak-fieldset">
    <legend class="zak-fieldset__legend">Account</legend>
    <div class="zak-form-grid">
      <div class="zak-field zak-field--outlined">
        <label class="zak-label" for="f-given">Given name</label>
        <input class="zak-input" id="f-given" placeholder="Ada"/>
      </div>
      <div class="zak-field zak-field--outlined">
        <label class="zak-label" for="f-family">Family name</label>
        <input class="zak-input" id="f-family" placeholder="Lovelace"/>
      </div>
    </div>
  </fieldset>
  <div class="zak-form-row zak-form-row--inline">
    <label class="zak-label" for="f-mail">Email</label>
    <input class="zak-input" id="f-mail" type="email" placeholder="ada@example.dev"/>
  </div>
  <div class="zak-flex" style="justify-content:flex-end">
    <button class="zak-btn zak-btn--text" type="reset">Reset</button>
    <button class="zak-btn zak-btn--filled" type="submit">Create account</button>
  </div>
</form>`,
    codeTpl: `<!-- Form with grid and inline row -->
<form class="zak-form" onsubmit="return false">
  <fieldset class="zak-fieldset">
    <legend class="zak-fieldset__legend">Account</legend>
    <div class="zak-form-grid">
      <div class="zak-field zak-field--outlined">
        <label class="zak-label" for="f-given">Given name</label>
        <input class="zak-input" id="f-given" placeholder="Ada"/>
      </div>
      <div class="zak-field zak-field--outlined">
        <label class="zak-label" for="f-family">Family name</label>
        <input class="zak-input" id="f-family" placeholder="Lovelace"/>
      </div>
    </div>
  </fieldset>
  <div class="zak-form-row zak-form-row--inline">
    <label class="zak-label" for="f-mail">Email</label>
    <input class="zak-input" id="f-mail" type="email" placeholder="ada@example.dev"/>
  </div>
  <div class="zak-flex" style="justify-content:flex-end">
    <button class="zak-btn zak-btn--text" type="reset">Reset</button>
    <button class="zak-btn zak-btn--filled" type="submit">Create account</button>
  </div>
</form>`,
    props: [
      ['.zak-form', 'class', '—', 'Column stack with 20px rhythm between groups.'],
      ['.zak-form-grid', 'class', '—', 'Auto-fit grid, min track 240px.'],
      ['.zak-form-row--inline', 'class', '—', 'Label + control row; stacks below 640px.'],
      ['.zak-fieldset', 'element', '—', 'Bordered section with uppercase legend.'],
      ['.zak-fieldset__legend', 'element', '—', 'Uppercase section title.'],
    ],
    notes: ['Reset buttons should use `type="reset"`; browsers restore initial values natively.'],
  }),
  'form-field': defineDemo({
    desc: 'The canonical field wrapper: label, control, hint and message slots wired together with `aria-describedby` so validation is announced, not just colored. Variant modifiers restyle the control surface: filled, outlined, underline and ghost.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <div class="zak-field__row">
      <label class="zak-label" for="ff-name">Workspace name <span class="zak-label__req" title="required">*</span></label>
      <span class="zak-hint">Lowercase, no spaces</span>
    </div>
    <input class="zak-input" id="ff-name" value="northwind-labs" aria-describedby="ff-name-hint"/>
    <span class="zak-hint" id="ff-name-hint">Used in URLs wherever the workspace is referenced.</span>
    <span class="zak-msg zak-msg--success">${svgIcon('check-circle', 'zak-icon', 14)} Name is available.</span>
  </div>
  <div class="zak-field zak-field--filled">
    <div class="zak-field__row">
      <label class="zak-label" for="ff-email">Email <span class="zak-label__req" title="required">*</span></label>
    </div>
    <input class="zak-input is-invalid" id="ff-email" value="invalid-email" aria-describedby="ff-email-msg" aria-invalid="true"/>
    <span class="zak-msg zak-msg--error" id="ff-email-msg">${svgIcon('alert-circle', 'zak-icon', 14)} Enter a valid email address.</span>
  </div>
  <div class="zak-field zak-field--underline">
    <div class="zak-field__row">
      <label class="zak-label" for="ff-url">Website</label>
      <span class="zak-hint">Optional</span>
    </div>
    <input class="zak-input" id="ff-url" placeholder="https://example.com"/>
    <span class="zak-hint">Your public profile URL.</span>
  </div>
  <div class="zak-field zak-field--ghost">
    <div class="zak-field__row">
      <label class="zak-label" for="ff-bio">Bio</label>
    </div>
    <textarea class="zak-textarea" rows="3" placeholder="Tell us about yourself…"></textarea>
  </div>
</div>`,
    codeTpl: `<!-- Outlined (default) -->
<div class="zak-field zak-field--outlined">
  <div class="zak-field__row">
    <label class="zak-label" for="name">Workspace name <span class="zak-label__req">*</span></label>
    <span class="zak-hint">Lowercase, no spaces</span>
  </div>
  <input class="zak-input" id="name" aria-describedby="name-hint"/>
  <span class="zak-hint" id="name-hint">Used in URLs.</span>
  <span class="zak-msg zak-msg--success"><svg class="zak-icon" aria-hidden="true">…</svg> Name is available.</span>
</div>

<!-- Filled -->
<div class="zak-field zak-field--filled">
  <label class="zak-label" for="email">Email <span class="zak-label__req">*</span></label>
  <input class="zak-input is-invalid" id="email" value="invalid" aria-describedby="email-msg" aria-invalid="true"/>
  <span class="zak-msg zak-msg--error" id="email-msg">Enter a valid email.</span>
</div>

<!-- Underline -->
<div class="zak-field zak-field--underline">
  <label class="zak-label" for="url">Website</label>
  <input class="zak-input" id="url" placeholder="https://example.com"/>
  <span class="zak-hint">Optional.</span>
</div>

<!-- Ghost -->
<div class="zak-field zak-field--ghost">
  <label class="zak-label" for="bio">Bio</label>
  <textarea class="zak-textarea" rows="3" placeholder="Tell us about yourself…"></textarea>
</div>

<!-- Sizes — control modifiers --sm / default / --lg -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="sm">Small</label>
  <input class="zak-input zak-input--sm" id="sm"/>
</div>
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="lg">Large</label>
  <input class="zak-input zak-input--lg" id="lg"/>
</div>`,
    examples: [
      {
        title: 'Outlined (default)',
        desc: 'Label row, control, hint and validation message — all four slots wired with `aria-describedby`.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <div class="zak-field__row">
    <label class="zak-label" for="ffx-name">Workspace name <span class="zak-label__req" title="required">*</span></label>
    <span class="zak-hint">Lowercase, no spaces</span>
  </div>
  <input class="zak-input" id="ffx-name" value="northwind-labs" aria-describedby="ffx-name-hint"/>
  <span class="zak-hint" id="ffx-name-hint">Used in URLs wherever the workspace is referenced.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <div class="zak-field__row">
    <label class="zak-label" for="name">Workspace name <span class="zak-label__req">*</span></label>
    <span class="zak-hint">Lowercase, no spaces</span>
  </div>
  <input class="zak-input" id="name" aria-describedby="name-hint"/>
  <span class="zak-hint" id="name-hint">Used in URLs.</span>
</div>`,
      },
      {
        title: 'Filled + validation',
        desc: 'Muted well that stays quiet until focus; the error is announced, not just coloured.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--filled" style="width:100%;max-width:22rem">
  <label class="zak-label" for="ffx-email">Email <span class="zak-label__req" title="required">*</span></label>
  <input class="zak-input is-invalid" id="ffx-email" type="email" value="invalid-email" aria-describedby="ffx-email-msg" aria-invalid="true"/>
  <span class="zak-msg zak-msg--error" id="ffx-email-msg">${svgIcon('alert-circle', 'zak-icon', 14)} Enter a valid email address.</span>
</div>`,
        code: `<div class="zak-field zak-field--filled">
  <label class="zak-label" for="email">Email <span class="zak-label__req">*</span></label>
  <input class="zak-input is-invalid" id="email" type="email" value="invalid-email"
         aria-describedby="email-msg" aria-invalid="true"/>
  <span class="zak-msg zak-msg--error" id="email-msg">Enter a valid email address.</span>
</div>`,
      },
      {
        title: 'Underline',
        desc: 'Single bottom rule and zero radius — for dense toolbars and inline editing.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--underline" style="width:100%;max-width:22rem">
  <div class="zak-field__row">
    <label class="zak-label" for="ffx-url">Website</label>
    <span class="zak-hint">Optional</span>
  </div>
  <input class="zak-input" id="ffx-url" placeholder="https://example.com"/>
</div>`,
        code: `<div class="zak-field zak-field--underline">
  <label class="zak-label" for="url">Website <span class="zak-hint">Optional</span></label>
  <input class="zak-input" id="url" placeholder="https://example.com"/>
</div>`,
      },
      {
        title: 'Ghost',
        desc: 'No chrome at rest — the surface appears on hover and focus only.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--ghost" style="width:100%;max-width:22rem">
  <label class="zak-label" for="ffx-bio">Bio</label>
  <textarea class="zak-textarea" id="ffx-bio" rows="3" placeholder="Tell us about yourself…"></textarea>
</div>`,
        code: `<div class="zak-field zak-field--ghost">
  <label class="zak-label" for="bio">Bio</label>
  <textarea class="zak-textarea" id="bio" rows="3" placeholder="Tell us about yourself…"></textarea>
</div>`,
      },
      {
        title: 'Success message',
        desc: '`zak-msg--success` pairs an icon with confirmation copy under the control.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <label class="zak-label" for="ffx-ok">Workspace name</label>
  <input class="zak-input" id="ffx-ok" value="northwind-labs" aria-describedby="ffx-ok-msg"/>
  <span class="zak-msg zak-msg--success" id="ffx-ok-msg">${svgIcon('check-circle', 'zak-icon', 14)} Name is available.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="name">Workspace name</label>
  <input class="zak-input" id="name" aria-describedby="name-msg"/>
  <span class="zak-msg zak-msg--success" id="name-msg">Name is available.</span>
</div>`,
      },
      {
        title: 'Sizes',
        desc: 'Control size modifiers `--sm` (32px), default `md` (38px) and `--lg` (44px) apply to the input inside any field variant.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ffx-sm">Small</label>
    <input class="zak-input zak-input--sm" id="ffx-sm" value="32px"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ffx-md">Medium (default)</label>
    <input class="zak-input" id="ffx-md" value="38px"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ffx-lg">Large</label>
    <input class="zak-input zak-input--lg" id="ffx-lg" value="44px"/>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="sm">Small</label>
  <input class="zak-input zak-input--sm" id="sm"/>
</div>
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="lg">Large</label>
  <input class="zak-input zak-input--lg" id="lg"/>
</div>`,
      },
      {
        title: 'Label, hint & required',
        desc: 'A `.zak-field__row` sits the label and an optional trailing hint on one baseline; `.zak-label__req` marks a required field.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <div class="zak-field__row">
    <label class="zak-label" for="ffx-req">Username <span class="zak-label__req" title="required">*</span></label>
    <span class="zak-hint">3–20 characters</span>
  </div>
  <input class="zak-input" id="ffx-req" placeholder="your-name"/>
  <span class="zak-hint">This appears in your profile URL.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <div class="zak-field__row">
    <label class="zak-label" for="user">Username <span class="zak-label__req">*</span></label>
    <span class="zak-hint">3–20 characters</span>
  </div>
  <input class="zak-input" id="user" placeholder="your-name"/>
  <span class="zak-hint">This appears in your profile URL.</span>
</div>`,
      },
      {
        title: 'Error message',
        desc: '`zak-msg--error` pairs an icon with the failure copy and is wired to the control via `aria-describedby`.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <label class="zak-label" for="ffx-err">Email</label>
  <input class="zak-input is-invalid" id="ffx-err" value="not-an-email" aria-describedby="ffx-err-msg" aria-invalid="true"/>
  <span class="zak-msg zak-msg--error" id="ffx-err-msg">${svgIcon('alert-circle', 'zak-icon', 14)} Enter a valid email address.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="email">Email</label>
  <input class="zak-input is-invalid" id="email" value="not-an-email"
         aria-describedby="email-msg" aria-invalid="true"/>
  <span class="zak-msg zak-msg--error" id="email-msg">Enter a valid email address.</span>
</div>`,
      },
    ],
    props: [
      ['.zak-field', 'class', '—', 'Vertical wrapper: label row, control, hint, message.'],
      ['.zak-field--filled', 'modifier', '—', 'Muted surface, invisible border until focus.'],
      ['.zak-field--outlined', 'modifier', '—', 'Default surface with visible border.'],
      ['.zak-field--underline', 'modifier', '—', 'Single bottom rule, zero radius.'],
      ['.zak-field--ghost', 'modifier', '—', 'No chrome at rest; appears on hover/focus.'],
      ['.zak-input--sm', 'size', '—', 'Compact 32px control inside the field.'],
      ['.zak-input--lg', 'size', '—', 'Large 44px control inside the field.'],
      ['.zak-field__row', 'class', '—', 'Label + trailing hint on one baseline.'],
      ['.zak-label__req', 'class', '—', 'Red asterisk marking a required field.'],
      ['.zak-hint', 'class', '—', 'Secondary helper text beside or under the control.'],
      ['.zak-msg--success', 'modifier', '—', 'Confirmation message with icon.'],
      ['.zak-msg--error', 'modifier', '—', 'Failure message with icon.'],
      ['aria-describedby', 'attr', '—', 'References hint and message element ids.'],
      ['aria-invalid', 'attr', 'false', 'Marks the control as failing validation.'],
    ],
  }),
  label: defineDemo({
    desc: 'Labels pair a 13px semibold face with optional markers. Click targets include the control thanks to native `for`/`id` association.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:20rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="l-1">Default label</label>
    <input class="zak-input" id="l-1" placeholder="…"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="l-2">Required field <span class="zak-label__req" aria-hidden="true">*</span></label>
    <input class="zak-input" id="l-2" aria-required="true" placeholder="…"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="l-3">Optional field <span class="zak-hint">(optional)</span></label>
    <input class="zak-input" id="l-3" placeholder="…"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="l-4">With description <span class="zak-hint" style="margin-inline-start:auto">Help text</span></label>
    <input class="zak-input" id="l-4" placeholder="…"/>
  </div>
</div>`,
    codeTpl: `<!-- Default -->
<label class="zak-label" for="name">Workspace name</label>
<input class="zak-input" id="name" placeholder="…"/>

<!-- Required -->
<label class="zak-label" for="email">Email <span class="zak-label__req" aria-hidden="true">*</span></label>
<input class="zak-input" id="email" aria-required="true" placeholder="…"/>

<!-- Optional -->
<label class="zak-label" for="bio">Bio <span class="zak-hint">(optional)</span></label>
<input class="zak-input" id="bio" placeholder="…"/>

<!-- With trailing hint -->
<label class="zak-label" for="url">Website <span class="zak-hint" style="margin-inline-start:auto">Lowercase, no spaces</span></label>
<input class="zak-input" id="url" placeholder="…"/>`,
    props: [
      ['.zak-label', 'class', '—', '13px semibold label.'],
      ['.zak-label__req', 'element', '—', 'Red asterisk; keep aria-required on the control too.'],
      ['for / id', 'attr', '—', 'Native association — never skip it.'],
      ['.zak-hint', 'element', '—', 'Low-emphasis trailing text.'],
    ],
  }),
  input: defineDemo({
    desc: 'Every input lives in a labelled Form Field — the label, the control surface and the hint are one contract. Three heights and the four field variants are all available on the control directly.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="in-md">Project name <span class="zak-hint">default · 38px</span></label>
    <input class="zak-input" id="in-md" value="Zak UI Kit"/>
    <span class="zak-hint">Shown in the sidebar and in reports.</span>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="in-sm">Small <span class="zak-hint">--sm · 32px</span></label>
    <input class="zak-input zak-input--sm" id="in-sm" placeholder="Compact"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="in-lg">Large <span class="zak-hint">--lg · 44px</span></label>
    <input class="zak-input zak-input--lg" id="in-lg" placeholder="Prominent"/>
  </div>
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="in-filled">Filled field</label>
    <input class="zak-input" id="in-filled" placeholder="Muted well"/>
  </div>
  <div class="zak-field zak-field--underline">
    <label class="zak-label" for="in-ul">Underline field</label>
    <input class="zak-input" id="in-ul" placeholder="Single rule"/>
  </div>
  <div class="zak-field zak-field--ghost">
    <label class="zak-label" for="in-ghost">Ghost field</label>
    <input class="zak-input" id="in-ghost" placeholder="Chrome appears on hover"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="in-ro">Read-only <span class="zak-hint">focusable</span></label>
    <input class="zak-input" id="in-ro" value="Read-only value" readonly/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="in-dis">Disabled</label>
    <input class="zak-input" id="in-dis" disabled placeholder="Not editable"/>
  </div>
</div>`,
    codeTpl: `<!-- Canonical: a labelled Form Field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="name">Project name</label>
  <input class="zak-input" id="name"/>
  <span class="zak-hint">Shown in the sidebar.</span>
</div>

<!-- Sizes: sm · md · lg -->
<input class="zak-input zak-input--sm" placeholder="Small · 32px" type="text"/>
<input class="zak-input" placeholder="Medium · 38px" type="text"/>
<input class="zak-input zak-input--lg" placeholder="Large · 44px" type="text"/>

<!-- Variants (set on the field wrapper or the control) -->
<input class="zak-input zak-input--filled" placeholder="Filled" type="text"/>
<input class="zak-input zak-input--underline" placeholder="Underline" type="text"/>
<input class="zak-input zak-input--ghost" placeholder="Ghost" type="text"/>

<!-- States -->
<input class="zak-input" value="Read-only" readonly type="text"/>
<input class="zak-input" disabled placeholder="Disabled" type="text"/>

<!-- With a leading icon -->
<div class="zak-input-wrap">
  <svg class="zak-icon" aria-hidden="true">…</svg>
  <input class="zak-input" placeholder="Search…" type="search"/>
</div>`,
    examples: [
      {
        title: 'Sizes',
        desc: 'Three heights — 32, 38 and 44 px — set on the control inside the field.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="inx-sm">Small <span class="zak-hint">--sm · 32px</span></label>
    <input class="zak-input zak-input--sm" id="inx-sm" placeholder="Compact"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="inx-md">Medium <span class="zak-hint">default · 38px</span></label>
    <input class="zak-input" id="inx-md" placeholder="Default"/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="inx-lg">Large <span class="zak-hint">--lg · 44px</span></label>
    <input class="zak-input zak-input--lg" id="inx-lg" placeholder="Prominent"/>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="sm">Small</label>
  <input class="zak-input zak-input--sm" id="sm" type="text"/>
</div>

<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="md">Medium</label>
  <input class="zak-input" id="md" type="text"/>
</div>

<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="lg">Large</label>
  <input class="zak-input zak-input--lg" id="lg" type="text"/>
</div>`,
      },
      {
        title: 'Field variants',
        desc: 'The variant class goes on the `.zak-field` wrapper; the control inherits the surface.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="inx-filled">Filled</label>
    <input class="zak-input" id="inx-filled" placeholder="Muted well"/>
  </div>
  <div class="zak-field zak-field--underline">
    <label class="zak-label" for="inx-ul">Underline</label>
    <input class="zak-input" id="inx-ul" placeholder="Single rule"/>
  </div>
  <div class="zak-field zak-field--ghost">
    <label class="zak-label" for="inx-ghost">Ghost</label>
    <input class="zak-input" id="inx-ghost" placeholder="Chrome appears on hover"/>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--filled">
  <label class="zak-label" for="a">Filled</label>
  <input class="zak-input" id="a" type="text"/>
</div>

<div class="zak-field zak-field--underline">
  <label class="zak-label" for="b">Underline</label>
  <input class="zak-input" id="b" type="text"/>
</div>

<div class="zak-field zak-field--ghost">
  <label class="zak-label" for="c">Ghost</label>
  <input class="zak-input" id="c" type="text"/>
</div>`,
      },
      {
        title: 'Read-only and disabled',
        desc: 'Read-only stays in the tab order and is copyable; disabled leaves it entirely.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="inx-ro">API endpoint <span class="zak-hint">focusable</span></label>
    <input class="zak-input" id="inx-ro" value="https://api.zakui.dev/v1" readonly/>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="inx-dis">Workspace ID</label>
    <input class="zak-input" id="inx-dis" value="Locked by plan" disabled/>
  </div>
</div>`,
        code: `<!-- Read-only: selectable, still focusable -->
<input class="zak-input" id="ro" value="https://api.zakui.dev/v1" readonly type="text"/>

<!-- Disabled: out of the tab order -->
<input class="zak-input" id="dis" value="Locked by plan" disabled type="text"/>`,
      },
      {
        title: 'With a leading icon',
        desc: '`.zak-input-wrap` positions the icon inside the field surface — no extra padding classes.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <label class="zak-label" for="inx-search">Search</label>
  <div class="zak-input-wrap">
    ${svgIcon('search', 'zak-icon', 15)}
    <input class="zak-input" id="inx-search" type="search" placeholder="Search deployments…"/>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="q">Search</label>
  <div class="zak-input-wrap">
    <svg class="zak-icon" aria-hidden="true">…</svg>
    <input class="zak-input" id="q" type="search" placeholder="Search deployments…"/>
  </div>
</div>`,
      },
    ],
    props: [
      ['.zak-field', 'class', '—', 'Label + control + hint wrapper — the field contract.'],
      ['size', 'enum', 'md', 'sm · md · lg — height 32px / 38px / 44px.'],
      ['variant', 'enum', 'outlined', 'Direct control modifier: --filled · --outlined · --underline · --ghost.'],
      ['readonly', 'boolean', 'false', 'Keeps focusability but blocks edits.'],
      ['disabled', 'boolean', 'false', 'Removes from tab order; dims surface.'],
      ['placeholder', 'string', '—', 'Placeholder text.'],
      ['type', 'enum', 'text', 'text · email · password · search · url · tel · number.'],
    ],
  }),
  'input-group': defineDemo({
    desc: 'A Form Field with segments: the `.zak-input-group` container draws the single field surface (border, radius, focus ring) and every addon, icon or button inside is borderless, so the row reads as one control. Text prefix, text suffix, icon addons, actions, checkbox addons and all three sizes are shown.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-domain">Website <span class="zak-hint">text prefix</span></label>
    <div class="zak-input-group">
      <span class="zak-input-group__addon">https://</span>
      <input class="zak-input" id="ig-domain" value="zakui.dev"/>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-amount">Amount <span class="zak-hint">text suffix</span></label>
    <div class="zak-input-group">
      <input class="zak-input" id="ig-amount" value="49.50"/>
      <span class="zak-input-group__addon">USD</span>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-both">Repository <span class="zak-hint">both addons</span></label>
    <div class="zak-input-group">
      <span class="zak-input-group__addon">git@</span>
      <input class="zak-input" id="ig-both" value="zakui/core"/>
      <span class="zak-input-group__addon">.git</span>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-icon">Search users <span class="zak-hint">icon addon</span></label>
    <div class="zak-input-group">
      <span class="zak-input-group__addon zak-input-group__addon--icon">${userI}</span>
      <input class="zak-input" id="ig-icon" placeholder="Name or email…"/>
      <span class="zak-input-group__addon zak-input-group__addon--icon">${sparkI}</span>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-btn">Invite by email <span class="zak-hint">button action</span></label>
    <div class="zak-input-group">
      <input class="zak-input" id="ig-btn" type="email" placeholder="ada@example.dev"/>
      <button class="zak-btn zak-btn--filled" type="button">Invite</button>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-check">Shipping <span class="zak-hint">checkbox addon</span></label>
    <div class="zak-input-group">
      <label class="zak-check">
        <input type="checkbox" aria-label="Include shipping"/>
      </label>
      <input class="zak-input" id="ig-check" value="Standard · 3–5 days"/>
      <button class="zak-btn zak-btn--text" type="button">Edit</button>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-size">Sizes <span class="zak-hint">--sm / --lg</span></label>
    <div class="zak-stack zak-stack--sm">
      <div class="zak-input-group zak-input-group--sm">
        <span class="zak-input-group__addon">#</span>
        <input class="zak-input" id="ig-size" value="Small"/>
      </div>
      <div class="zak-input-group zak-input-group--lg">
        <span class="zak-input-group__addon">#</span>
        <input class="zak-input" value="Large" aria-label="Large size"/>
      </div>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ig-invalid">Coupon <span class="zak-hint">invalid state</span></label>
    <div class="zak-input-group is-invalid">
      <span class="zak-input-group__addon">%</span>
      <input class="zak-input" id="ig-invalid" value="0FFER" aria-invalid="true" aria-describedby="ig-invalid-msg"/>
    </div>
    <span class="zak-msg zak-msg--error" id="ig-invalid-msg">${alertI} Coupon code is not valid.</span>
  </div>
</div>`,
    codeTpl: `<!-- Inside a Form Field: label + one group surface -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="domain">Website</label>
  <div class="zak-input-group">
    <span class="zak-input-group__addon">https://</span>
    <input class="zak-input" id="domain" value="zakui.dev"/>
  </div>
</div>

<!-- Text suffix -->
<div class="zak-input-group">
  <input class="zak-input" value="49.50" aria-label="Amount"/>
  <span class="zak-input-group__addon">USD</span>
</div>

<!-- Icon addons (prefix + suffix) -->
<div class="zak-input-group">
  <span class="zak-input-group__addon zak-input-group__addon--icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
  <input class="zak-input" placeholder="Name or email…" aria-label="User"/>
  <span class="zak-input-group__addon zak-input-group__addon--icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
</div>

<!-- Button action -->
<div class="zak-input-group">
  <input class="zak-input" type="email" placeholder="ada@example.dev" aria-label="Invite"/>
  <button class="zak-btn zak-btn--filled" type="button">Invite</button>
</div>

<!-- Checkbox addon -->
<div class="zak-input-group">
  <label class="zak-check"><input type="checkbox" aria-label="Include shipping"/></label>
  <input class="zak-input" value="Standard · 3–5 days" aria-label="Shipping"/>
</div>

<!-- Sizes -->
<div class="zak-input-group zak-input-group--sm">…</div>
<div class="zak-input-group zak-input-group--lg">…</div>

<!-- Invalid state -->
<div class="zak-input-group is-invalid">…</div>

<!-- Disabled state -->
<div class="zak-input-group">
  <input class="zak-input" disabled value="Locked" aria-label="Locked"/>
</div>`,
    examples: [
      {
        title: 'Text prefix',
        desc: 'A fixed prefix that belongs to the value — the group draws one field surface, the addon stays borderless.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="igx-prefix">Website</label>
  <div class="zak-input-group">
    <span class="zak-input-group__addon">https://</span>
    <input class="zak-input" id="igx-prefix" value="zakui.dev"/>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="domain">Website</label>
  <div class="zak-input-group">
    <span class="zak-input-group__addon">https://</span>
    <input class="zak-input" id="domain" value="zakui.dev"/>
  </div>
</div>`,
      },
      {
        title: 'Text suffix',
        desc: 'Unit or extension after the value; the addon divider flips to the correct edge.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="igx-suffix">Amount</label>
  <div class="zak-input-group">
    <input class="zak-input" id="igx-suffix" value="49.50"/>
    <span class="zak-input-group__addon zak-input-group__addon--suffix">USD</span>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="amount">Amount</label>
  <div class="zak-input-group">
    <input class="zak-input" id="amount" value="49.50"/>
    <span class="zak-input-group__addon zak-input-group__addon--suffix">USD</span>
  </div>
</div>`,
      },
      {
        title: 'Icon addons',
        desc: '`--icon` makes the segment a square, centred glyph instead of a text chip.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="igx-icon">Search users</label>
  <div class="zak-input-group">
    <span class="zak-input-group__addon zak-input-group__addon--icon">${userI}</span>
    <input class="zak-input" id="igx-icon" placeholder="Name or email…"/>
    <span class="zak-input-group__addon zak-input-group__addon--icon">${sparkI}</span>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="user">Search users</label>
  <div class="zak-input-group">
    <span class="zak-input-group__addon zak-input-group__addon--icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
    <input class="zak-input" id="user" placeholder="Name or email…"/>
    <span class="zak-input-group__addon zak-input-group__addon--icon"><svg class="zak-icon" aria-hidden="true">…</svg></span>
  </div>
</div>`,
      },
      {
        title: 'Button action',
        desc: 'A `.zak-btn` segment shares the field height and flushes its touching corners.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="igx-btn">Invite by email</label>
  <div class="zak-input-group">
    <input class="zak-input" id="igx-btn" type="email" placeholder="ada@example.dev"/>
    <button class="zak-btn zak-btn--filled" type="button">Invite</button>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="invite">Invite by email</label>
  <div class="zak-input-group">
    <input class="zak-input" id="invite" type="email" placeholder="ada@example.dev"/>
    <button class="zak-btn zak-btn--filled" type="button">Invite</button>
  </div>
</div>`,
      },
      {
        title: 'Checkbox addon',
        desc: 'A bare `.zak-check` gates the value of the field it is attached to.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="igx-check">Shipping</label>
  <div class="zak-input-group">
    <label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Include shipping"/></label>
    <input class="zak-input" id="igx-check" value="Standard · 3–5 days"/>
    <button class="zak-btn zak-btn--text" type="button">Edit</button>
  </div>
</div>`,
        code: `<div class="zak-input-group">
  <label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Include shipping"/></label>
  <input class="zak-input" id="shipping" value="Standard · 3–5 days"/>
  <button class="zak-btn zak-btn--text" type="button">Edit</button>
</div>`,
      },
      {
        title: 'Sizes',
        desc: '`--sm` and `--lg` scale the whole group, addons included.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:26rem">
  <div class="zak-input-group zak-input-group--sm">
    <span class="zak-input-group__addon">#</span>
    <input class="zak-input" value="Small" aria-label="Small group"/>
  </div>
  <div class="zak-input-group">
    <span class="zak-input-group__addon">#</span>
    <input class="zak-input" value="Medium" aria-label="Medium group"/>
  </div>
  <div class="zak-input-group zak-input-group--lg">
    <span class="zak-input-group__addon">#</span>
    <input class="zak-input" value="Large" aria-label="Large group"/>
  </div>
</div>`,
        code: `<div class="zak-input-group zak-input-group--sm">…</div>
<div class="zak-input-group">…</div>
<div class="zak-input-group zak-input-group--lg">…</div>`,
      },
      {
        title: 'Invalid and disabled',
        desc: '`is-invalid` puts the danger border and focus ring on the group; a disabled input dims the whole row.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="igx-invalid">Coupon</label>
    <div class="zak-input-group is-invalid">
      <span class="zak-input-group__addon">%</span>
      <input class="zak-input" id="igx-invalid" value="0FFER" aria-invalid="true" aria-describedby="igx-invalid-msg"/>
    </div>
    <span class="zak-msg zak-msg--error" id="igx-invalid-msg">${alertI} Coupon code is not valid.</span>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="igx-disabled">Locked field</label>
    <div class="zak-input-group">
      <span class="zak-input-group__addon">@</span>
      <input class="zak-input" id="igx-disabled" value="managed-by-policy" disabled/>
    </div>
  </div>
</div>`,
        code: `<!-- Invalid -->
<div class="zak-input-group is-invalid">
  <span class="zak-input-group__addon">%</span>
  <input class="zak-input" id="coupon" value="0FFER" aria-invalid="true" aria-describedby="coupon-msg"/>
</div>
<span class="zak-msg zak-msg--error" id="coupon-msg">Coupon code is not valid.</span>

<!-- Disabled — the group dims automatically via :has() -->
<div class="zak-input-group">
  <span class="zak-input-group__addon">@</span>
  <input class="zak-input" id="locked" value="managed-by-policy" disabled/>
</div>`,
      },
    ],
    props: [
      ['.zak-input-group', 'class', '—', 'Single field surface; segments inside are borderless.'],
      ['.zak-input-group__addon', 'element', '—', 'Text prefix/suffix segment on the muted surface.'],
      ['.zak-input-group__addon--icon', 'modifier', '—', 'Square centred icon segment.'],
      ['.zak-input-group__addon--suffix', 'modifier', '—', 'Marks the divider on the correct edge.'],
      ['--sm / --lg', 'modifier', 'md', 'Group sizes; height matches the input scale.'],
      ['.zak-btn', 'element', '—', 'A button segment — flush radius on the touching edge.'],
      ['.zak-check', 'element', '—', 'A checkbox segment rendered as a field addon.'],
      ['is-invalid', 'class', '—', 'Danger border + danger focus ring on the whole group.'],
      ['disabled', 'attr', '—', 'The group dims automatically via :has().'],
    ],
    notes: [
      'The focus ring lives on the group (`:focus-within`) so any segment receiving focus lights the field once.',
      'For a purely decorative leading icon, `.zak-input-wrap` + `.zak-icon` is the lighter option.',
    ],
  }),
  textarea: defineDemo({
    desc: 'Multi-line entry with vertical resize only — horizontal resizing breaks grid layouts and is disabled.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="ta-1">Release notes</label>
  <textarea class="zak-textarea zak-textarea--outlined" id="ta-1" rows="4" placeholder="What changed in this release?">Improved grid virtualization
Fixed a focus-trap regression in Drawer</textarea>
  <span class="zak-hint">Markdown supported · 4000 characters max</span>
</div>`,
    codeTpl: `<!-- Outlined -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="notes">Release notes</label>
  <textarea class="zak-textarea" id="notes" rows="4" placeholder="What changed?"></textarea>
  <span class="zak-hint">Markdown supported · 4000 characters max</span>
</div>

<!-- Filled -->
<div class="zak-field zak-field--filled">
  <label class="zak-label" for="bio">Bio</label>
  <textarea class="zak-textarea" rows="3" placeholder="Tell us about yourself…"></textarea>
</div>

<!-- Underline -->
<div class="zak-field zak-field--underline">
  <label class="zak-label" for="feedback">Feedback</label>
  <textarea class="zak-textarea" rows="3" placeholder="Your thoughts…"></textarea>
</div>`,
    props: [
      ['variant', 'enum', 'outlined', 'Direct control modifier: --filled · --outlined · --underline · --ghost.'],
      ['resize', 'css', 'vertical', 'Only the vertical axis is resizable.'],
      ['rows', 'number', '—', 'Initial height in text lines.'],
      ['min-height', 'token', '6rem', 'Default floor height; rows attribute also respected.'],
    ],
    examples: [
      {
        title: 'Field variants',
        desc: 'Set the variant on the `.zak-field` wrapper — the textarea inherits the surface.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="tav-out">Outlined</label>
    <textarea class="zak-textarea" id="tav-out" rows="2" placeholder="Bordered surface"></textarea>
  </div>
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="tav-filled">Filled</label>
    <textarea class="zak-textarea" id="tav-filled" rows="2" placeholder="Muted well"></textarea>
  </div>
  <div class="zak-field zak-field--underline">
    <label class="zak-label" for="tav-ul">Underline</label>
    <textarea class="zak-textarea" id="tav-ul" rows="2" placeholder="Single rule"></textarea>
  </div>
  <div class="zak-field zak-field--ghost">
    <label class="zak-label" for="tav-ghost">Ghost</label>
    <textarea class="zak-textarea" id="tav-ghost" rows="2" placeholder="Chrome appears on focus"></textarea>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--filled">
  <label class="zak-label" for="bio">Filled</label>
  <textarea class="zak-textarea" id="bio" rows="2"></textarea>
</div>`,
      },
      {
        title: 'Sizes',
        desc: '`--sm` and `--lg` scale font size and floor height; medium is the default.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="tav-sm">Small <span class="zak-hint">--sm</span></label>
    <textarea class="zak-textarea zak-textarea--sm" id="tav-sm" rows="2" placeholder="Compact"></textarea>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="tav-lg">Large <span class="zak-hint">--lg</span></label>
    <textarea class="zak-textarea zak-textarea--lg" id="tav-lg" rows="3" placeholder="Prominent"></textarea>
  </div>
</div>`,
        code: `<textarea class="zak-textarea zak-textarea--sm" rows="2" placeholder="Small"></textarea>
<textarea class="zak-textarea" rows="3" placeholder="Medium"></textarea>
<textarea class="zak-textarea zak-textarea--lg" rows="3" placeholder="Large"></textarea>`,
      },
    ],
  }),
  select: defineDemo({
    desc: 'A native `<select>` — best mobile ergonomics, zero JS — styled with a custom chevron and generous end padding. It carries the same field surface as an input, so it composes inside `.zak-field` identically.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="se-team">Team</label>
    <select class="zak-select" id="se-team">
      <option>Platform</option>
      <option>Design</option>
      <option>Data</option>
      <option>Infrastructure</option>
    </select>
    <span class="zak-hint">Determines the default review pool.</span>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="se-density">Density <span class="zak-hint">--sm</span></label>
    <select class="zak-select zak-input--sm" id="se-density">
      <option>Comfortable</option>
      <option>Compact</option>
    </select>
  </div>
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="se-filled">Filled field</label>
    <select class="zak-select" id="se-filled">
      <option>EU-West</option>
      <option>US-East</option>
    </select>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="se-dis">Disabled</label>
    <select class="zak-select" id="se-dis" disabled>
      <option>Managed by policy</option>
    </select>
  </div>
</div>`,
    codeTpl: `<!-- Canonical: labelled field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="team">Team</label>
  <select class="zak-select" id="team">
    <option>Platform</option>
    <option>Design</option>
  </select>
  <span class="zak-hint">Sets the review pool.</span>
</div>

<!-- Standalone (aria-label instead of a label element) -->
<select class="zak-select" aria-label="Team">
  <option>Platform</option>
  <option>Design</option>
  <option>Data</option>
  <option>Infrastructure</option>
</select>

<!-- Small size -->
<select class="zak-select zak-input--sm" aria-label="Density">
  <option>Comfortable</option>
  <option>Compact</option>
</select>

<!-- Variants (on the wrapper or the control) -->
<select class="zak-select zak-select--filled" aria-label="Region">
  <option>EU-West</option>
</select>
<select class="zak-select zak-select--underline" aria-label="Theme">
  <option>Light</option>
</select>

<!-- Disabled -->
<select class="zak-select" disabled aria-label="Disabled">
  <option>Disabled</option>
</select>`,
    examples: [
      {
        title: 'Labelled field',
        desc: 'The canonical form: label, select and hint inside a `.zak-field`.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <label class="zak-label" for="sex-team">Team</label>
  <select class="zak-select" id="sex-team">
    <option>Platform</option>
    <option>Design</option>
    <option>Data</option>
    <option>Infrastructure</option>
  </select>
  <span class="zak-hint">Determines the default review pool.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="team">Team</label>
  <select class="zak-select" id="team">
    <option>Platform</option>
    <option>Design</option>
  </select>
  <span class="zak-hint">Determines the default review pool.</span>
</div>`,
      },
      {
        title: 'Standalone',
        desc: 'Toolbars and table cells often have no visible label — name the control with `aria-label`.',
        tpl: `<select class="zak-select" aria-label="Team" style="width:min(16rem,100%)">
  <option>Platform</option>
  <option>Design</option>
  <option>Data</option>
</select>`,
        code: `<select class="zak-select" aria-label="Team">
  <option>Platform</option>
  <option>Design</option>
  <option>Data</option>
</select>`,
      },
      {
        title: 'Grouped options',
        desc: 'Native `<optgroup>` labels keep long choice lists scannable.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
  <label class="zak-label" for="sex-group">Region</label>
  <select class="zak-select" id="sex-group">
    <optgroup label="Europe">
      <option>eu-west-1</option>
      <option>eu-central-1</option>
    </optgroup>
    <optgroup label="Americas">
      <option>us-east-1</option>
      <option>sa-east-1</option>
    </optgroup>
  </select>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="region">Region</label>
  <select class="zak-select" id="region">
    <optgroup label="Europe">
      <option>eu-west-1</option>
      <option>eu-central-1</option>
    </optgroup>
    <optgroup label="Americas">
      <option>us-east-1</option>
      <option>sa-east-1</option>
    </optgroup>
  </select>
</div>`,
      },
      {
        title: 'Sizes and variants',
        desc: 'Height modifiers are shared with inputs; the surface variant stays on the wrapper.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="sex-sm">Density <span class="zak-hint">--sm</span></label>
    <select class="zak-select zak-input--sm" id="sex-sm">
      <option>Comfortable</option>
      <option>Compact</option>
    </select>
  </div>
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="sex-filled">Filled field</label>
    <select class="zak-select" id="sex-filled">
      <option>EU-West</option>
      <option>US-East</option>
    </select>
  </div>
  <div class="zak-field zak-field--underline">
    <label class="zak-label" for="sex-ul">Underline field</label>
    <select class="zak-select" id="sex-ul">
      <option>Light</option>
      <option>Dark</option>
    </select>
  </div>
</div>`,
        code: `<select class="zak-select zak-input--sm" aria-label="Density">…</select>

<div class="zak-field zak-field--filled">
  <label class="zak-label" for="region">Region</label>
  <select class="zak-select" id="region">…</select>
</div>

<div class="zak-field zak-field--underline">
  <label class="zak-label" for="theme">Theme</label>
  <select class="zak-select" id="theme">…</select>
</div>`,
      },
      {
        title: 'Disabled and invalid',
        desc: 'Disabled leaves the tab order; an invalid select carries `aria-invalid` plus a message.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="sex-dis">Plan region</label>
    <select class="zak-select" id="sex-dis" disabled>
      <option>Managed by policy</option>
    </select>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="sex-invalid">Approval group</label>
    <select class="zak-select is-invalid" id="sex-invalid" aria-invalid="true" aria-describedby="sex-invalid-msg">
      <option value="">Select a group…</option>
      <option>Platform</option>
    </select>
    <span class="zak-msg zak-msg--error" id="sex-invalid-msg">${alertI} Choose the group that reviews this release.</span>
  </div>
</div>`,
        code: `<select class="zak-select" id="plan" disabled>
  <option>Managed by policy</option>
</select>

<select class="zak-select is-invalid" id="group" aria-invalid="true" aria-describedby="group-msg">
  <option value="">Select a group…</option>
  <option>Platform</option>
</select>
<span class="zak-msg zak-msg--error" id="group-msg">Choose the group that reviews this release.</span>`,
      },
    ],
    props: [
      ['.zak-field', 'class', '—', 'Label + control + hint wrapper — same surface as an input.'],
      ['variant', 'enum', 'outlined', 'Direct control modifier: --filled · --outlined · --underline · --ghost.'],
      ['appearance', 'css', 'none', 'Native chrome removed; SVG chevron supplied as background.'],
      ['--sm / --lg', 'modifier', 'md', 'Height modifiers shared with inputs.'],
      ['multiple', 'boolean', 'false', 'Enables multi-select (use Multi Select for chip UI).'],
    ],
    notes: ['For searchable lists use Combobox; for multi-value use Multi Select or Tags Input.'],
  }),
  'multi-select': defineDemo({
    desc: 'Dropdown multi-select: a checkbox option list whose selections render as removable chips inside the field. Options and initial values come from JSON via `data-zak-source` and `data-zak-value` — no options are hard-coded in markup. Keyboard: focus the field and press Enter/Space to open, Escape to close.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:24rem">
  <label class="zak-label">Notification channels</label>
  <div class="zak-multiselect" data-zak-multiselect
       data-zak-source='[{"label":"Email","value":"email"},{"label":"Slack","value":"slack"},{"label":"PagerDuty","value":"pagerduty"},{"label":"SMS","value":"sms"},{"label":"Webhook","value":"webhook"}]'
       data-zak-value='["email","slack"]'
       data-zak-placeholder="Select channels…">
    <div class="zak-multiselect__field" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
      <span class="zak-multiselect__chips"></span>
      <span class="zak-multiselect__toggle" aria-hidden="true">${svgIcon('chevron-down', 'zak-icon', 16)}</span>
    </div>
    <div class="zak-multiselect__panel" role="listbox" aria-multiselectable="true" hidden></div>
  </div>
</div>`,
    codeTpl: `<div class="zak-multiselect" data-zak-multiselect
     data-zak-source='[{"label":"Email","value":"email"},{"label":"Slack","value":"slack"},{"label":"PagerDuty","value":"pagerduty"}]'
     data-zak-value='["email","slack"]'
     data-zak-placeholder="Select channels…">
  <div class="zak-multiselect__field" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
    <span class="zak-multiselect__chips"></span>
    <span class="zak-multiselect__toggle" aria-hidden="true"><svg>…</svg></span>
  </div>
  <div class="zak-multiselect__panel" role="listbox" aria-multiselectable="true" hidden></div>
</div>`,
    examples: [
      {
        title: 'With a preselected count',
        desc: 'Passing more values than fit shows an `n selected` summary via the placeholder slot.',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:24rem">
  <label class="zak-label">Team access</label>
  <div class="zak-multiselect" data-zak-multiselect
       data-zak-source='[{"label":"Engineering","value":"eng"},{"label":"Design","value":"design"},{"label":"Product","value":"product"},{"label":"Marketing","value":"marketing"}]'
       data-zak-value='["eng","design","product","marketing"]'>
    <div class="zak-multiselect__field" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
      <span class="zak-multiselect__chips"></span>
      <span class="zak-multiselect__count" aria-hidden="true"></span>
      <span class="zak-multiselect__toggle" aria-hidden="true">${svgIcon('chevron-down', 'zak-icon', 16)}</span>
    </div>
    <div class="zak-multiselect__panel" role="listbox" aria-multiselectable="true" hidden></div>
  </div>
</div>`,
      },
      {
        title: 'Small / large sizes',
        desc: 'Combine with the shared field size modifiers for compact or prominent controls.',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:24rem">
  <div class="zak-multiselect" data-zak-multiselect
       data-zak-source='[{"label":"Sm","value":"sm"},{"label":"Option","value":"a"}]'
       data-zak-value='["sm"]'>
    <div class="zak-multiselect__field zak-input--sm" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
      <span class="zak-multiselect__chips"></span>
      <span class="zak-multiselect__toggle" aria-hidden="true">${svgIcon('chevron-down', 'zak-icon', 16)}</span>
    </div>
    <div class="zak-multiselect__panel" role="listbox" aria-multiselectable="true" hidden></div>
  </div>
  <div class="zak-multiselect" data-zak-multiselect
       data-zak-source='[{"label":"Lg","value":"lg"},{"label":"Option","value":"b"}]'
       data-zak-value='["lg"]'>
    <div class="zak-multiselect__field zak-input--lg" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
      <span class="zak-multiselect__chips"></span>
      <span class="zak-multiselect__toggle" aria-hidden="true">${svgIcon('chevron-down', 'zak-icon', 16)}</span>
    </div>
    <div class="zak-multiselect__panel" role="listbox" aria-multiselectable="true" hidden></div>
  </div>
</div>`,
      },
    ],
    props: [
      ['data-zak-multiselect', 'attr', '—', 'Marks the root and enables the controller.'],
      ['data-zak-source', 'json', '—', 'Options array: strings or `{ label, value, hint? }`.'],
      ['data-zak-value', 'json', '[]', 'Initially selected values (render as chips).'],
      ['data-zak-placeholder', 'attr', 'Select…', 'Text shown when nothing is selected.'],
      ['.zak-multiselect__field', 'element', '—', 'Clickable box that holds chips and the toggle.'],
      ['.zak-multiselect__panel', 'element', '—', 'Dropdown list of checkbox options (built lazily).'],
    ],
    js: 'The multiselect controller reads `data-zak-source`/`data-zak-value`, renders chips on load, builds the option panel on first open, and syncs selection on checkbox change or chip removal. Dispatches `zak:change` with the current value array.',
    notes: ['For free-text tokens use Tags Input; for a searchable single-select use Autocomplete/Combobox.'],
  }),
  checkbox: defineDemo({
    desc: 'Custom-drawn checkbox with checked, indeterminate and disabled states. The control stays a real input for forms and assistive tech.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <label class="zak-check">
    <input type="checkbox" checked/>
    <span class="zak-check__label">Email me release notes <span class="zak-check__desc">Optional description</span></span>
  </label>
  <label class="zak-check">
    <input type="checkbox"/>
    <span class="zak-check__label">Weekly digest <span class="zak-check__desc">A summary every Monday at 9:00</span></span>
  </label>
  <label class="zak-check">
    <input type="checkbox" id="cb-ind"/>
    <span class="zak-check__label">Select all visible rows <span class="zak-check__desc">Indeterminate when partially selected</span></span>
  </label>
  <label class="zak-check">
    <input type="checkbox" checked disabled/>
    <span class="zak-check__label">Managed by your organization</span>
  </label>
</div>`,
    codeTpl: `<label class="zak-check">
  <input type="checkbox" checked/>
  <span class="zak-check__label">
    Email me release notes
    <span class="zak-check__desc">Optional description</span>
  </span>
</label>

<script>
  // Partial selection (indeterminate)
  const box = document.getElementById('cb-ind');
  box.indeterminate = true;
</script>

<!-- Disabled -->
<label class="zak-check">
  <input type="checkbox" disabled checked/>
  <span class="zak-check__label">Managed by your organization</span>
</label>`,
    examples: [
      {
        title: 'Label + description',
        desc: 'The whole row is the click target; the description is secondary text under the label.',
        stage: 'stretch',
        tpl: `<label class="zak-check" style="width:100%;max-width:22rem">
  <input type="checkbox" checked/>
  <span class="zak-check__label">Email me release notes <span class="zak-check__desc">Sent to my verified address only</span></span>
</label>`,
        code: `<label class="zak-check">
  <input type="checkbox" checked/>
  <span class="zak-check__label">
    Email me release notes
    <span class="zak-check__desc">Sent to my verified address only</span>
  </span>
</label>`,
      },
      {
        title: 'Indeterminate',
        desc: 'The dash glyph is set through the JS property, never an attribute — bulk-selection header boxes need it.',
        stage: 'stretch',
        tpl: `<label class="zak-check" style="width:100%;max-width:22rem">
  <input type="checkbox" id="cbx-ind"/>
  <span class="zak-check__label">Select all visible rows <span class="zak-check__desc">Partially selected on this page</span></span>
</label>`,
        code: `<label class="zak-check">
  <input type="checkbox" id="selectAll"/>
  <span class="zak-check__label">Select all visible rows</span>
</label>

<script>
  // Partial selection is a property, not an attribute
  document.getElementById('selectAll').indeterminate = true;
</script>`,
        js: `const box = document.getElementById('selectAll');
box.indeterminate = true;   // dash glyph
box.indeterminate = false;  // back to checked / unchecked`,
      },
      {
        title: 'Disabled',
        desc: 'Locks the state, dims the row and leaves the tab order.',
        stage: 'stretch',
        tpl: `<label class="zak-check" style="width:100%;max-width:22rem">
  <input type="checkbox" checked disabled/>
  <span class="zak-check__label">Two-factor auth <span class="zak-check__desc">Managed by your organization</span></span>
</label>`,
        code: `<label class="zak-check">
  <input type="checkbox" checked disabled/>
  <span class="zak-check__label">Two-factor auth</span>
</label>`,
      },
      {
        title: 'Bare (table cells)',
        desc: '`zak-check--bare` drops the label text and tightens the box for grid and table selection columns.',
        stage: 'stretch',
        tpl: `<div style="display:flex;align-items:center;gap:var(--zak-space-4)">
  <label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select row 1"/></label>
  <label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select row 2"/></label>
</div>`,
        code: `<th class="zak-grid__check">
  <label class="zak-check zak-check--bare">
    <input type="checkbox" data-grid-check-all aria-label="Select all rows"/>
  </label>
</th>`,
      },
    ],
    props: [
      ['indeterminate', 'boolean', 'false', 'Renders the dash glyph; set via JS property.'],
      ['disabled', 'boolean', 'false', 'Locks the state and dims the row.'],
      ['role="checkbox"', 'attr', 'implicit', 'Native semantics via input type.'],
    ],
  }),
  radio: defineDemo({
    desc: 'Single-choice control in classic circle form or as a descriptive radio card for plan/option pickers.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:30rem">
  <div class="zak-radio-group" role="radiogroup" aria-label="Deploy target">
    <label class="zak-radio"><input type="radio" name="dd" checked/> Production</label>
    <label class="zak-radio"><input type="radio" name="dd" disabled/> Staging</label>
    <label class="zak-radio"><input type="radio" name="dd"/> Preview</label>
  </div>
  <div class="zak-radio-cards">
    <label class="zak-radio-card">
      <input type="radio" name="plan" checked/>
      <span class="zak-radio-card__title">Standard</span>
      <span class="zak-radio-card__desc">1 vCPU · 2 GB RAM · shared runners</span>
    </label>
    <label class="zak-radio-card">
      <input type="radio" name="plan"/>
      <span class="zak-radio-card__title">Performance</span>
      <span class="zak-radio-card__desc">4 vCPU · 16 GB RAM · dedicated runners</span>
    </label>
  </div>
</div>`,
    codeTpl: `<!-- Radio group (classic) -->
<div class="zak-radio-group" role="radiogroup" aria-label="Deploy target">
  <label class="zak-radio"><input type="radio" name="dd" checked/> Production</label>
  <label class="zak-radio"><input type="radio" name="dd" disabled/> Staging</label>
  <label class="zak-radio"><input type="radio" name="dd"/> Preview</label>
</div>

<!-- Radio cards -->
<div class="zak-radio-cards">
  <label class="zak-radio-card">
    <input type="radio" name="plan" checked/>
    <span class="zak-radio-card__title">Standard</span>
    <span class="zak-radio-card__desc">1 vCPU · 2 GB RAM · shared runners</span>
  </label>
  <label class="zak-radio-card">
    <input type="radio" name="plan"/>
    <span class="zak-radio-card__title">Performance</span>
    <span class="zak-radio-card__desc">4 vCPU · 16 GB RAM · dedicated runners</span>
  </label>
</div>

<!-- Vertical group -->
<div class="zak-radio-group zak-radio-group--col" role="radiogroup" aria-label="Severity">
  <label class="zak-radio"><input type="radio" name="sev" checked/> Low</label>
  <label class="zak-radio"><input type="radio" name="sev"/> Medium</label>
  <label class="zak-radio"><input type="radio" name="sev" disabled/> High</label>
  <label class="zak-radio"><input type="radio" name="sev"/> Critical</label>
</div>`,
    examples: [
      {
        title: 'Inline group',
        desc: 'Short choices sit on one row; the group needs a name for assistive tech.',
        tpl: `<div class="zak-radio-group" role="radiogroup" aria-label="Deploy target" style="width:100%">
  <label class="zak-radio"><input type="radio" name="ex-dd" checked/> Production</label>
  <label class="zak-radio"><input type="radio" name="ex-dd"/> Preview</label>
  <label class="zak-radio"><input type="radio" name="ex-dd" disabled/> Staging</label>
</div>`,
        code: `<div class="zak-radio-group" role="radiogroup" aria-label="Deploy target">
  <label class="zak-radio"><input type="radio" name="target" checked/> Production</label>
  <label class="zak-radio"><input type="radio" name="target"/> Preview</label>
  <label class="zak-radio"><input type="radio" name="target" disabled/> Staging</label>
</div>`,
      },
      {
        title: 'Vertical group with descriptions',
        desc: '`--col` stacks the options and each row can carry a description.',
        stage: 'stretch',
        tpl: `<div class="zak-radio-group zak-radio-group--col" role="radiogroup" aria-label="Visibility" style="width:100%;max-width:24rem">
  <label class="zak-radio"><input type="radio" name="ex-vis" checked/> <span class="zak-check__label">Public <span class="zak-check__desc">Anyone with the link can view</span></span></label>
  <label class="zak-radio"><input type="radio" name="ex-vis"/> <span class="zak-check__label">Private <span class="zak-check__desc">Only invited members</span></span></label>
</div>`,
        code: `<div class="zak-radio-group zak-radio-group--col" role="radiogroup" aria-label="Visibility">
  <label class="zak-radio">
    <input type="radio" name="vis" checked/>
    <span class="zak-check__label">Public <span class="zak-check__desc">Anyone with the link can view</span></span>
  </label>
  <label class="zak-radio">
    <input type="radio" name="vis"/>
    <span class="zak-check__label">Private <span class="zak-check__desc">Only invited members</span></span>
  </label>
</div>`,
      },
      {
        title: 'Radio cards',
        desc: 'A card-sized target with title and description; selection styling is pure CSS via `:has()`.',
        stage: 'stretch',
        tpl: `<div class="zak-radio-cards" role="radiogroup" aria-label="Runner size" style="width:100%">
  <label class="zak-radio-card">
    <input type="radio" name="ex-plan" checked/>
    <span class="zak-radio-card__title">Standard</span>
    <span class="zak-radio-card__desc">1 vCPU · 2 GB RAM · shared runners</span>
  </label>
  <label class="zak-radio-card">
    <input type="radio" name="ex-plan"/>
    <span class="zak-radio-card__title">Performance</span>
    <span class="zak-radio-card__desc">4 vCPU · 16 GB RAM · dedicated runners</span>
  </label>
</div>`,
        code: `<div class="zak-radio-cards">
  <label class="zak-radio-card">
    <input type="radio" name="plan" checked/>
    <span class="zak-radio-card__title">Standard</span>
    <span class="zak-radio-card__desc">1 vCPU · 2 GB RAM · shared runners</span>
  </label>
  <label class="zak-radio-card">
    <input type="radio" name="plan"/>
    <span class="zak-radio-card__title">Performance</span>
    <span class="zak-radio-card__desc">4 vCPU · 16 GB RAM · dedicated runners</span>
  </label>
</div>`,
      },
    ],
    props: [
      ['.zak-radio', 'class', '—', 'Circle indicator + label row.'],
      ['.zak-radio-card', 'class', '—', 'Card-sized target with title and description.'],
      [':has(input:checked)', 'css', '—', 'Card selection styling without JS.'],
      ['role="radiogroup"', 'attr', '—', 'Groups the radios for assistive tech.'],
      ['--col', 'modifier', 'inline', 'Switches the group to vertical flow.'],
    ],
  }),
  'radio-group': defineDemo({
    desc: 'Radio sets in inline or vertical flow, with `role="radiogroup"` for screen-reader grouping and arrow-key navigation supplied by the browser.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:28rem">
  <fieldset style="border:0;padding:0;margin:0">
    <legend class="zak-label" style="margin-block-end:var(--zak-space-3)">Severity</legend>
    <div class="zak-radio-group" role="radiogroup" aria-label="Severity">
      <label class="zak-radio"><input type="radio" name="sev" checked/> Low</label>
      <label class="zak-radio"><input type="radio" name="sev"/> Medium</label>
      <label class="zak-radio"><input type="radio" name="sev" disabled/> High</label>
      <label class="zak-radio"><input type="radio" name="sev"/> Critical</label>
    </div>
  </fieldset>
  <fieldset style="border:0;padding:0;margin:0">
    <legend class="zak-label" style="margin-block-end:var(--zak-space-3)">Visibility (vertical)</legend>
    <div class="zak-radio-group zak-radio-group--col">
      <label class="zak-radio"><input type="radio" name="vis" checked/> <span class="zak-check__label">Public <span class="zak-check__desc">Anyone with the link can view</span></span></label>
      <label class="zak-radio"><input type="radio" name="vis"/> <span class="zak-check__label">Private <span class="zak-check__desc">Only invited members</span></span></label>
    </div>
  </fieldset>
</div>`,
    codeTpl: `<!-- Horizontal group -->
<fieldset style="border:0;padding:0;margin:0">
  <legend class="zak-label" style="margin-block-end:var(--zak-space-3)">Severity</legend>
  <div class="zak-radio-group" role="radiogroup" aria-label="Severity">
    <label class="zak-radio"><input type="radio" name="sev" checked/> Low</label>
    <label class="zak-radio"><input type="radio" name="sev"/> Medium</label>
    <label class="zak-radio"><input type="radio" name="sev"/> High</label>
    <label class="zak-radio"><input type="radio" name="sev"/> Critical</label>
  </div>
</fieldset>

<!-- Vertical group -->
<fieldset style="border:0;padding:0;margin:0">
  <legend class="zak-label" style="margin-block-end:var(--zak-space-3)">Visibility (vertical)</legend>
  <div class="zak-radio-group zak-radio-group--col">
    <label class="zak-radio"><input type="radio" name="vis" checked/> <span class="zak-check__label">Public <span class="zak-check__desc">Anyone with the link can view</span></span></label>
    <label class="zak-radio"><input type="radio" name="vis"/> <span class="zak-check__label">Private <span class="zak-check__desc">Only invited members</span></span></label>
  </div>
</fieldset>`,
    props: [
      ['role="radiogroup"', 'attr', '—', 'Groups the radios for assistive tech.'],
      ['--col', 'modifier', 'inline', 'Switches the group to vertical flow.'],
      ['Arrow keys', 'interaction', 'native', 'Moves selection within the group.'],
    ],
    a11y: {
      keys: [
        ['Arrow keys', 'Moves selection within the group.'],
      ],
      aria: [
        ['role="radiogroup"', 'Groups the radios for assistive tech.'],
      ],
    },
  }),
  switch: defineDemo({
    desc: 'Binary settings apply instantly — the switch communicates that immediacy. Track and thumb animate on the spring curve.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:24rem">
  <label class="zak-switch"><input type="checkbox" checked role="switch"/> <span class="zak-switch__desc">Dark mode <small>Syncs across devices</small></span></label>
  <label class="zak-switch"><input type="checkbox" role="switch"/> Auto-deploy on merge</label>
  <label class="zak-switch zak-switch--sm"><input type="checkbox" role="switch"/> Compact size</label>
  <label class="zak-switch"><input type="checkbox" disabled role="switch"/> Locked by policy</label>
</div>`,
    codeTpl: `<!-- Standard -->
<label class="zak-switch">
  <input type="checkbox" checked role="switch"/>
  <span class="zak-switch__desc">Dark mode <small>Syncs across devices</small></span>
</label>

<!-- Compact -->
<label class="zak-switch zak-switch--sm">
  <input type="checkbox" role="switch"/>
  Compact size
</label>

<!-- Disabled -->
<label class="zak-switch">
  <input type="checkbox" disabled role="switch"/>
  Locked by policy
</label>`,
    examples: [
      {
        title: 'With description',
        desc: '`zak-switch__desc` carries the label and a small explainer line.',
        stage: 'stretch',
        tpl: `<label class="zak-switch" style="width:100%;max-width:24rem">
  <input type="checkbox" checked role="switch"/>
  <span class="zak-switch__desc">Dark mode <small>Syncs across devices</small></span>
</label>`,
        code: `<label class="zak-switch">
  <input type="checkbox" checked role="switch"/>
  <span class="zak-switch__desc">Dark mode <small>Syncs across devices</small></span>
</label>`,
      },
      {
        title: 'Plain label',
        desc: 'Most toolbars only need the text beside the track.',
        stage: 'stretch',
        tpl: `<label class="zak-switch" style="width:100%;max-width:24rem">
  <input type="checkbox" role="switch"/> Auto-deploy on merge
</label>`,
        code: `<label class="zak-switch">
  <input type="checkbox" role="switch"/> Auto-deploy on merge
</label>`,
      },
      {
        title: 'Compact',
        desc: '`zak-switch--sm` renders the 29px track for dense surfaces.',
        stage: 'stretch',
        tpl: `<label class="zak-switch zak-switch--sm" style="width:100%;max-width:24rem">
  <input type="checkbox" checked role="switch"/> Compact density
</label>`,
        code: `<label class="zak-switch zak-switch--sm">
  <input type="checkbox" checked role="switch"/> Compact density
</label>`,
      },
      {
        title: 'Disabled',
        desc: 'Policy-locked settings stay visible but immutable.',
        stage: 'stretch',
        tpl: `<label class="zak-switch" style="width:100%;max-width:24rem">
  <input type="checkbox" disabled role="switch"/> Locked by policy
</label>`,
        code: `<label class="zak-switch">
  <input type="checkbox" disabled role="switch"/> Locked by policy
</label>`,
      },
    ],
    props: [
      ['role="switch"', 'attr', '—', 'Correct semantics for a binary setting.'],
      ['--sm', 'modifier', '—', 'Renders a 29px track for dense surfaces.'],
      ['checked', 'boolean', 'false', 'Initial state; persist to your backend on change.'],
    ],
    notes: ['Switches take effect immediately — for settings applied on submit, use a Checkbox instead.'],
  }),
};