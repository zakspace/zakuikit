/**
 * Demos — Forms, part 2: advanced controls, composition and validation.
 *
 * Every demo renders as a static preview card (`playground` defaults to the
 * preview + code card) and ships a curated `codeTpl` that demonstrates each
 * entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

export const formAdvancedDemos: Record<string, DemoDef> = {
  range: defineDemo({
    desc: 'Slider input for numeric values. The filled track is drawn with a gradient whose stop position is the `--zak-range-fill` custom property.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:24rem">
    <div class="zak-field zak-field--outlined">
      <div class="zak-field__row">
        <label class="zak-label" for="rg-1">CPU quota</label>
        <span class="zak-hint">4 vCPU</span>
      </div>
      <input class="zak-range" id="rg-1" type="range" min="1" max="16" value="4" style="--zak-range-fill:25%"/>
      <span class="zak-hint">1 – 16 vCPU · billed per hour</span>
    </div>
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="rg-2">Opacity</label>
      <input class="zak-range" id="rg-2" type="range" min="0" max="100" value="62" style="--zak-range-fill:62%"/>
    </div>
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="rg-3">Disabled</label>
      <input class="zak-range" id="rg-3" type="range" disabled value="40"/>
    </div>
  </div>`,
    codeTpl: `<!-- Inside a Form Field -->
<div class="zak-field zak-field--outlined">
  <div class="zak-field__row">
    <label class="zak-label" for="quota">CPU quota</label>
    <span class="zak-hint">4 vCPU</span>
  </div>
  <input class="zak-range" id="quota" type="range" min="1" max="16" value="4" style="--zak-range-fill:25%"/>
  <span class="zak-hint">Billed per hour</span>
</div>

<!-- Basic range -->
<input class="zak-range" type="range" aria-label="Opacity"/>

<!-- Filled track: --zak-range-fill sets the gradient stop -->
<input class="zak-range" type="range" value="62" style="--zak-range-fill:62%" aria-label="Opacity"/>

<!-- Bounds + step -->
<input class="zak-range" type="range" min="1" max="16" step="1" value="4" style="--zak-range-fill:25%" aria-label="CPU quota"/>

<!-- Disabled -->
<input class="zak-range" type="range" value="40" disabled aria-label="Disabled range"/>`,
    props: [
      ['.zak-field', 'class', '—', 'Label + value readout wrapper — the field contract.'],
      ['value', 'number', '50', 'Current value.'],
      ['min / max', 'number', '0 / 100', 'Bounds of the track.'],
      ['step', 'number', '1', 'Increment applied while dragging.'],
      ['--zak-range-fill', 'percentage', '50%', 'Position of the filled portion of the track.'],
      ['disabled', 'boolean', 'false', 'Blocks interaction and dims the track.'],
    ],
    notes: ['Update `--zak-range-fill` in an `input` listener to keep the fill in sync while dragging.'],
  }),
  'file-upload': defineDemo({
    desc: 'Dashed drop target with an accent hover, plus a file list where each item shows name, size and a remove affordance.',
    tpl: `<div style="width:100%;max-width:28rem" class="zak-field zak-field--outlined">
    <span class="zak-label">Attachments <span class="zak-hint">max 10 MB each</span></span>
    <label class="zak-file" data-zak-dropzone>
      <input type="file" multiple aria-label="Upload attachments"/>
      <span class="zak-file__icon">${svgIcon('upload', 'zak-icon', 20)}</span>
      <span class="zak-file__title">Drop files here or <em>browse</em></span>
      <span class="zak-file__hint">PNG, JPG or PDF up to 10 MB each</span>
    </label>
    <span class="zak-hint">Files are scanned before they are stored.</span>
    <div class="zak-file-list">
      <div class="zak-file-item">
        <span class="zak-icon" style="color:var(--zak-primary-text)">${svgIcon('file', 'zak-icon', 16)}</span>
        <span class="zak-file-item__meta"><span class="zak-file-item__name">design-specs.pdf</span><br/><span class="zak-file-item__size">2.4 MB · uploaded</span></span>
        <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Complete</span>
        <button class="zak-btn zak-btn--text zak-btn--icon zak-btn--sm" aria-label="Remove design-specs.pdf">${svgIcon('x', 'zak-icon', 14)}</button>
      </div>
      <div class="zak-file-item">
        <span class="zak-icon" style="color:var(--zak-primary-text)">${svgIcon('file', 'zak-icon', 16)}</span>
        <span class="zak-file-item__meta"><span class="zak-file-item__name">screenshot.png</span><br/><span class="zak-file-item__size">840 KB · uploading…</span></span>
        <span style="flex:0 0 90px"><span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:68%"></span></span></span>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Drop target inside a Form Field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="files">Attachments</label>
  <label class="zak-file" data-zak-dropzone>
    <input type="file" multiple id="files"/>
    <span class="zak-file__icon">⬆</span>
    <span class="zak-file__title">Drop files here or <em>browse</em></span>
    <span class="zak-file__hint">PNG, JPG or PDF up to 10 MB each</span>
  </label>
  <span class="zak-hint">Files are scanned before storage.</span>
</div>

<!-- Standalone drop target -->
<label class="zak-file" data-zak-dropzone>
  <input type="file" multiple/>
  <span class="zak-file__icon">⬆</span>
  <span class="zak-file__title">Drop files here or <em>browse</em></span>
  <span class="zak-file__hint">PNG, JPG or PDF up to 10 MB each</span>
</label>

<!-- Single-file drop target (drop the multiple attribute) -->
<label class="zak-file" data-zak-dropzone>
  <input type="file" accept="image/*,.pdf"/>
  <span class="zak-file__title">Choose a file</span>
</label>

<!-- Completed file item -->
<div class="zak-file-list">
  <div class="zak-file-item">
    <span class="zak-file-item__meta">design-specs.pdf · 2.4 MB</span>
    <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Complete</span>
    <button class="zak-btn zak-btn--text zak-btn--icon zak-btn--sm" aria-label="Remove design-specs.pdf">✕</button>
  </div>

  <!-- Uploading file item with inline progress -->
  <div class="zak-file-item">
    <span class="zak-file-item__meta">screenshot.png · 840 KB</span>
    <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:68%"></span></span>
  </div>
</div>`,
    js: `const zone = document.querySelector('[data-zak-dropzone]');
['dragenter', 'dragover'].forEach((type) =>
  zone.addEventListener(type, (event) => {
    event.preventDefault();
    zone.classList.add('is-dragover');
  })
);
zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
zone.addEventListener('drop', (event) => {
  event.preventDefault();
  zone.classList.remove('is-dragover');
  handleFiles(event.dataTransfer.files);
});`,
    props: [
      ['.zak-field', 'class', '—', 'Label + dropzone + hint wrapper.'],
      ['data-zak-dropzone', 'attr', '—', 'Marks the label as a drop target for the behaviour module.'],
      ['multiple', 'boolean', 'false', 'Allows selecting more than one file.'],
      ['accept', 'string', '—', 'MIME filter, e.g. image/* or .pdf,.docx.'],
      ['is-dragover', 'class', '—', 'Brand-tinted state applied during drag-over.'],
    ],
  }),
  'search-input': defineDemo({
    desc: 'Pill search field with a leading glyph and a keyboard hint. The whole surface is the input — no inner dead zones.',
    tpl: `<div style="width:100%;max-width:24rem" class="zak-stack zak-stack--lg">
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="sc-1">Search</label>
      <div class="zak-search zak-search--field">
        ${svgIcon('search', 'zak-icon', 16)}
        <input id="sc-1" type="search" placeholder="Search components, tokens, pages…"/>
        <kbd class="zak-kbd">/</kbd>
      </div>
      <span class="zak-hint">Press / anywhere on the page to focus.</span>
    </div>
    <div class="zak-field zak-field--filled">
      <label class="zak-label" for="sc-2">Filled field</label>
      <div class="zak-search">
        ${svgIcon('search', 'zak-icon', 16)}
        <input id="sc-2" type="search" value="data grid"/>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Inside a Form Field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="q">Search</label>
  <div class="zak-search zak-search--field">
    <svg class="zak-icon" aria-hidden="true"></svg>
    <input id="q" type="search" placeholder="Search components, tokens, pages…"/>
    <kbd class="zak-kbd">/</kbd>
  </div>
  <span class="zak-hint">Press / to focus.</span>
</div>

<!-- Standalone pill -->
<div class="zak-search">
  <svg class="zak-icon" aria-hidden="true"></svg>
  <input type="search" value="data grid" aria-label="Search"/>
</div>`,
    js: `// '/'-to-focus shortcut
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    event.preventDefault();
    document.querySelector('.zak-search input')?.focus();
  }
});`,
    props: [
      ['.zak-field', 'class', '—', 'Label + control + hint wrapper.'],
      ['.zak-search', 'class', '—', 'Pill surface; the whole area forwards clicks to the input.'],
      ['.zak-search--field', 'modifier', '—', 'Square field radius so search matches other controls.'],
      ['type="search"', 'attr', 'text', 'Gains the native clear affordance in some browsers.'],
      ['kbd', 'element', '—', 'Hint chip positioned inside the field.'],
    ],
  }),
  'password-input': defineDemo({
    desc: 'Masked entry with a reveal toggle. The toggle is a button — not a checkbox — so it never participates in form serialization.',
    tpl: `<div style="width:100%;max-width:22rem" class="zak-stack zak-stack--sm">
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="pw-1">Password</label>
      <div class="zak-input-wrap zak-input-wrap--suffix">
        <input class="zak-input" id="pw-1" type="password" value="correct horse battery staple" aria-describedby="pw-hint" data-zak-password/>
        <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 15)}</button>
      </div>
      <span class="zak-hint" id="pw-hint">At least 12 characters</span>
    </div>
    <div style="display:flex;gap:4px">
      <span class="zak-progress zak-progress--sm zak-progress--success" style="flex:1"><span class="zak-progress__bar" style="--value:100%"></span></span>
      <span class="zak-progress zak-progress--sm zak-progress--success" style="flex:1"><span class="zak-progress__bar" style="--value:100%"></span></span>
      <span class="zak-progress zak-progress--sm zak-progress--success" style="flex:1"><span class="zak-progress__bar" style="--value:100%"></span></span>
      <span class="zak-progress zak-progress--sm" style="flex:1;opacity:.35"><span class="zak-progress__bar" style="--value:100%"></span></span>
    </div>
    <span class="zak-msg zak-msg--success">${svgIcon('check-circle', 'zak-icon', 14)} Strong password</span>
  </div>`,
    codeTpl: `<!-- Password field with reveal toggle -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="pw">Password</label>
  <div class="zak-input-wrap zak-input-wrap--suffix">
    <input class="zak-input" id="pw" type="password" autocomplete="current-password"
           aria-describedby="pw-hint" data-zak-password/>
    <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>
  <span class="zak-hint" id="pw-hint">At least 12 characters</span>
</div>

<!-- Strength readout pairs colour with the success message -->
<span class="zak-msg zak-msg--success">Strong password</span>`,
    js: `document.querySelectorAll('[data-zak-reveal]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
});`,
    props: [
      ['type="password"', 'attr', '—', 'Masks input; the reveal toggle swaps it to text.'],
      ['data-zak-reveal', 'attr', '—', 'Button that toggles visibility and its aria-label.'],
      ['autocomplete', 'string', 'current-password', 'Lets password managers assist.'],
    ],
    examples: [
      {
        title: 'Field variants',
        desc: 'The reveal toggle sits inside any variant — set it on the `.zak-field` wrapper.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="pwv-filled">Filled</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input" id="pwv-filled" type="password" value="hunter2" data-zak-password/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 15)}</button>
    </div>
  </div>
  <div class="zak-field zak-field--underline">
    <label class="zak-label" for="pwv-ul">Underline</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input" id="pwv-ul" type="password" value="hunter2" data-zak-password/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 15)}</button>
    </div>
  </div>
</div>`,
        code: `<div class="zak-field zak-field--filled">
  <label class="zak-label" for="pw">Filled</label>
  <div class="zak-input-wrap zak-input-wrap--suffix">
    <input class="zak-input" id="pw" type="password" data-zak-password/>
    <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </div>
</div>`,
      },
      {
        title: 'Sizes',
        desc: 'The `--sm`/`--lg` control modifiers shrink or grow the field and its toggle.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="pws-sm">Small</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input zak-input--sm" id="pws-sm" type="password" value="compact" data-zak-password/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 14)}</button>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="pws-lg">Large</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input zak-input--lg" id="pws-lg" type="password" value="prominent" data-zak-password/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 16)}</button>
    </div>
  </div>
</div>`,
      },
    ],
  }),
  'otp-input': defineDemo({
    desc: 'One-time passcode entry: six single-character boxes with auto-advance, single-press backspace clearing (Ctrl+A then Backspace clears the whole code) and paste support.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:24rem">
    <label class="zak-label">One-time passcode <span class="zak-hint">sent to your device</span></label>
    <div class="zak-otp" role="group" aria-label="One-time passcode">
    <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 1"/>
    <input class="is-filled" inputmode="numeric" maxlength="1" value="8" aria-label="Digit 2"/>
    <input class="is-filled" inputmode="numeric" maxlength="1" value="1" aria-label="Digit 3"/>
    <input inputmode="numeric" maxlength="1" aria-label="Digit 4" autofocus/>
    <input inputmode="numeric" maxlength="1" aria-label="Digit 5"/>
    <input inputmode="numeric" maxlength="1" aria-label="Digit 6"/>
  </div>
    <span class="zak-hint">Code expires in 10 minutes.</span>
  </div>`,
    codeTpl: `<!-- Inside a Form Field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label">One-time passcode</label>
  <div class="zak-otp" role="group" aria-label="One-time passcode">
    <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 1"/>
    <input inputmode="numeric" maxlength="1" aria-label="Digit 2"/>
  </div>
  <span class="zak-hint">Code expires in 10 minutes.</span>
</div>

<!-- One box per digit; is-filled marks entered values -->
<div class="zak-otp" role="group" aria-label="One-time passcode">
  <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 1"/>
  <input class="is-filled" inputmode="numeric" maxlength="1" value="8" aria-label="Digit 2"/>
  <input class="is-filled" inputmode="numeric" maxlength="1" value="1" aria-label="Digit 3"/>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 4" autofocus/>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 5"/>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 6"/>
</div>`,
    js: `const boxes = [...document.querySelectorAll('.zak-otp input')];
boxes.forEach((box, i) => {
  box.addEventListener('input', () => {
    box.classList.toggle('is-filled', box.value !== '');
    if (box.value && boxes[i + 1]) boxes[i + 1].focus();
  });
  box.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && box.value) {
      event.preventDefault(); // one press erases the focused digit
      box.value = '';
      box.classList.remove('is-filled');
    } else if (event.key === 'Backspace' && !box.value && boxes[i - 1]) {
      event.preventDefault(); // empty box: clear and land on the previous digit
      boxes[i - 1].value = '';
      boxes[i - 1].classList.remove('is-filled');
      boxes[i - 1].focus();
    }
  });
  box.addEventListener('paste', (event) => {
    const digits = event.clipboardData.getData('text').replace(/\\D/g, '');
    boxes.forEach((target, j) => {
      target.value = digits[j] ?? '';
      target.classList.toggle('is-filled', target.value !== '');
    });
    event.preventDefault();
  });
});`,
    props: [
      ['.zak-field', 'class', '—', 'Label + box row + hint wrapper.'],
      ['maxlength="1"', 'attr', '1', 'One glyph per box keeps the layout rigid.'],
      ['inputmode="numeric"', 'attr', '—', 'Opens the numeric keypad on mobile.'],
      ['is-filled', 'class', '—', 'Filled boxes gain the brand-tinted surface.'],
      ['autofocus', 'boolean', 'false', 'Focuses the first empty box on load.'],
    ],
    examples: [
      {
        title: 'Sizes',
        desc: '`--sm` and `--lg` scale the box size and digit size.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:24rem">
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ot-sm">Small <span class="zak-hint">--sm</span></label>
    <div class="zak-otp zak-otp--sm" role="group" aria-label="One-time passcode, small">
      <input class="is-filled" inputmode="numeric" maxlength="1" value="2" aria-label="Digit 1"/>
      <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 2"/>
      <input inputmode="numeric" maxlength="1" aria-label="Digit 3"/>
      <input inputmode="numeric" maxlength="1" aria-label="Digit 4"/>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="ot-lg">Large <span class="zak-hint">--lg</span></label>
    <div class="zak-otp zak-otp--lg" role="group" aria-label="One-time passcode, large">
      <input class="is-filled" inputmode="numeric" maxlength="1" value="2" aria-label="Digit 1"/>
      <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 2"/>
      <input inputmode="numeric" maxlength="1" aria-label="Digit 3"/>
      <input inputmode="numeric" maxlength="1" aria-label="Digit 4"/>
    </div>
  </div>
</div>`,
        code: `<div class="zak-otp zak-otp--sm" role="group" aria-label="Small code">…</div>
<div class="zak-otp" role="group" aria-label="Medium code">…</div>
<div class="zak-otp zak-otp--lg" role="group" aria-label="Large code">…</div>`,
      },
      {
        title: 'Invalid state',
        desc: 'Mark the group `is-invalid` when the code is rejected; every box takes the danger border.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:24rem">
    <label class="zak-label">One-time passcode</label>
    <div class="zak-otp is-invalid" role="group" aria-label="Invalid passcode" aria-invalid="true">
      <input class="is-filled" inputmode="numeric" maxlength="1" value="1" aria-label="Digit 1"/>
      <input class="is-filled" inputmode="numeric" maxlength="1" value="2" aria-label="Digit 2"/>
      <input class="is-filled" inputmode="numeric" maxlength="1" value="3" aria-label="Digit 3"/>
      <input class="is-filled" inputmode="numeric" maxlength="1" value="4" aria-label="Digit 4"/>
    </div>
    <span class="zak-msg zak-msg--error">${svgIcon('alert-circle', 'zak-icon', 14)} That code is incorrect or expired.</span>
  </div>`,
      },
    ],
  }),
  autocomplete: defineDemo({
    desc: 'Type-ahead over a JS-driven dataset. Options are supplied as JSON via `data-zak-source` and rendered into the listbox at load — none are hard-coded in markup. Filtering, keyboard navigation, match highlighting and the no-result state run live.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
    <label class="zak-label" for="ac-input">Assign to</label>
    <div class="zak-combo" data-zak-autocomplete
         data-zak-source='[{"label":"Alina Popescu","value":"alina","hint":"Platform"},{"label":"Marcus Webb","value":"marcus","hint":"Platform"},{"label":"Priya Raman","value":"priya","hint":"Design"},{"label":"Mei Chen","value":"mei","hint":"Data"},{"label":"Tom Okafor","value":"tom","hint":"Data"}]'>
      <div class="zak-search zak-search--field">
        ${svgIcon('search', 'zak-icon', 15)}
        <input id="ac-input" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="ac-list" placeholder="Type a name…"/>
      </div>
      <div class="zak-combo__list" id="ac-list" role="listbox" hidden>
        <p class="zak-combo__empty" hidden>No matches</p>
      </div>
    </div>
    <span class="zak-hint">Options come from <code>data-zak-source</code>; the list stays hidden until you type, then reveals the matches.</span>
  </div>`,
    codeTpl: `<!-- Inside a Form Field: the input controls a listbox built from data -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="assignee">Assign to</label>
  <div class="zak-combo" data-zak-autocomplete
       data-zak-source='["Alina Popescu","Marcus Webb","Priya Raman"]'>
    <div class="zak-search zak-search--field">
      <svg class="zak-icon" aria-hidden="true"></svg>
      <input id="assignee" role="combobox" aria-expanded="false" aria-autocomplete="list"
             aria-controls="ac-list" placeholder="Type a name…"/>
    </div>

    <!-- The runtime renders one .zak-combo__item per source entry, then filters them -->
    <div class="zak-combo__list" id="ac-list" role="listbox" hidden>
      <p class="zak-combo__empty" hidden>No matches</p>
    </div>
  </div>
  <span class="zak-hint">Options are data-driven — pass strings or { label, value, hint }.</span>
</div>`,
    js: `// The dataset can also be hydrated imperatively before first interaction:
// ZakUI ships a declarative controller, but you can re-run the seeder on injected markup
// document.querySelectorAll('[data-zak-source]').forEach(/* re-render listbox */);
input.addEventListener('change', () => console.log('assigned', input.value));`,
    props: [
      ['.zak-field', 'class', '—', 'Label + control + hint wrapper.'],
      ['data-zak-autocomplete', 'attr', '—', 'Wires filtering, keyboard navigation and selection.'],
      ['data-zak-source', 'json', '—', 'Dataset array: strings or `{ label, value, hint? }`.'],
      ['role="combobox"', 'attr', '—', 'Textbox that controls the listbox.'],
      ['aria-controls', 'id', '—', 'Points at the listbox element.'],
      ['aria-expanded', 'boolean', 'false', 'Runtime-managed; reflects whether the list is showing.'],
      ['aria-activedescendant', 'id', '—', 'Set by the runtime to the highlighted option id.'],
      ['.zak-combo__item', 'class', '—', 'One option; generated from the source and given an id.'],
      ['.zak-combo__empty', 'class', '—', 'Shown when the query filters out every option.'],
    ],
    examples: [
      {
        title: 'Sizes and variants',
        desc: 'The search control takes the shared `--sm`/`--lg` modifiers; the surface variant stays on the wrapper.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--filled">
    <label class="zak-label" for="acs-sm">Filled · small</label>
    <div class="zak-combo" data-zak-autocomplete data-zak-source='["Ada Lovelace","Alan Turing","Grace Hopper"]'>
      <div class="zak-search zak-search--field">
        ${svgIcon('search', 'zak-icon', 14)}
        <input class="zak-input--sm" id="acs-sm" role="combobox" aria-expanded="false" aria-autocomplete="list" placeholder="Type a name…"/>
      </div>
      <div class="zak-combo__list" role="listbox" hidden><p class="zak-combo__empty" hidden>No matches</p></div>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <label class="zak-label" for="acs-lg">Outlined · large</label>
    <div class="zak-combo" data-zak-autocomplete data-zak-source='["Ada Lovelace","Alan Turing","Grace Hopper"]'>
      <div class="zak-search zak-search--field">
        ${svgIcon('search', 'zak-icon', 16)}
        <input class="zak-input--lg" id="acs-lg" role="combobox" aria-expanded="false" aria-autocomplete="list" placeholder="Type a name…"/>
      </div>
      <div class="zak-combo__list" role="listbox" hidden><p class="zak-combo__empty" hidden>No matches</p></div>
    </div>
  </div>
</div>`,
      },
    ],
    a11y: {
      keys: [
        ['↓ / ↑', 'Moves the active option without leaving the input.'],
        ['Enter', 'Commits the active option.'],
        ['Esc', 'Closes the suggestion list.'],
      ],
      aria: [
        ['role="combobox"', 'Identifies the controlling textbox.'],
        ['aria-activedescendant', 'Points at the highlighted option id.'],
      ],
    },
  }),
  combobox: defineDemo({
    desc: 'Single-value picker combining a button trigger with a filterable option list — ideal when choices exceed comfortable select length.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:22rem">
    <span class="zak-label">Reviewer</span>
    <div class="zak-combo" data-zak-autocomplete>
      <button class="zak-select" type="button" style="display:flex;align-items:center;gap:var(--zak-space-2);text-align:left" aria-haspopup="listbox" aria-expanded="false">
        <span class="zak-avatar zak-avatar--xs">MC</span>
        <span style="flex:1">Mei Chen</span>
        ${svgIcon('chevron-down', 'zak-icon', 15)}
      </button>
      <div class="zak-combo__list" role="listbox" hidden>
        <div style="padding:var(--zak-space-1)">
          <input class="zak-input zak-input--sm" placeholder="Filter people…" aria-label="Filter people"/>
        </div>
        <button class="zak-combo__item" id="cb-1" role="option" aria-selected="true"><span class="zak-avatar zak-avatar--xs">MC</span> Mei Chen <small>Data</small></button>
        <button class="zak-combo__item" id="cb-2" role="option" aria-selected="false"><span class="zak-avatar zak-avatar--xs">TO</span> Tom Okafor <small>Data</small></button>
        <button class="zak-combo__item" id="cb-3" role="option" aria-selected="false"><span class="zak-avatar zak-avatar--xs">EV</span> Elena Vasquez <small>Infra</small></button>
        <button class="zak-combo__item" id="cb-4" role="option" aria-selected="false"><span class="zak-avatar zak-avatar--xs">RH</span> Rin Nakamura <small>Quality</small></button>
        <p class="zak-combo__empty" hidden>No matches</p>
      </div>
    </div>
    <span class="zak-hint">The trigger toggles the list; the panel filter narrows it.</span>
  </div>`,
    codeTpl: `<!-- Inside a Form Field: button trigger announces the popup type -->
<div class="zak-field zak-field--outlined">
  <span class="zak-label">Reviewer</span>
  <div class="zak-combo" data-zak-autocomplete>
    <button class="zak-select" type="button" aria-haspopup="listbox" aria-expanded="false">
      Mei Chen
    </button>

    <!-- Floating option list with an inline filter field; hidden until opened -->
    <div class="zak-combo__list" role="listbox" hidden>
      <input class="zak-input zak-input--sm" placeholder="Filter people…" aria-label="Filter people"/>
      <button class="zak-combo__item" id="cb-1" role="option" aria-selected="true">Mei Chen</button>
      <button class="zak-combo__item" id="cb-2" role="option" aria-selected="false">Tom Okafor</button>
      <button class="zak-combo__item" id="cb-3" role="option" aria-selected="false">Elena Vasquez</button>
      <p class="zak-combo__empty" hidden>No matches</p>
    </div>
  </div>
</div>`,
    props: [
      ['.zak-field', 'class', '—', 'Label + trigger + hint wrapper.'],
      ['data-zak-autocomplete', 'attr', '—', 'Shared runtime contract with Autocomplete.'],
      ['.zak-select', 'class', '—', 'Button trigger that shows the current value.'],
      ['aria-haspopup="listbox"', 'attr', '—', 'Announces the picker type.'],
      ['aria-expanded', 'boolean', 'false', 'Runtime-managed; reflects whether the option list is open.'],
      ['aria-selected', 'boolean', 'false', 'Marks the chosen option in the list.'],
      ['.zak-combo__list', 'class', '—', 'Floating option panel anchored under the trigger.'],
      ['.zak-combo__empty', 'class', '—', 'Shown when the filter matches nothing.'],
    ],
    examples: [
      {
        title: 'Sizes',
        desc: 'The trigger uses the shared height modifiers; only the custom chevron shows — the native select arrow is suppressed.',
        stage: 'stretch',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:22rem">
  <div class="zak-field zak-field--outlined">
    <span class="zak-label">Small</span>
    <div class="zak-combo" data-zak-autocomplete>
      <button class="zak-select zak-input--sm" type="button" style="display:flex;align-items:center;gap:var(--zak-space-2);text-align:left" aria-haspopup="listbox" aria-expanded="false">
        <span style="flex:1">Mei Chen</span>${svgIcon('chevron-down', 'zak-icon', 14)}
      </button>
      <div class="zak-combo__list" role="listbox" hidden>
        <button class="zak-combo__item" role="option" aria-selected="true">Mei Chen</button>
        <button class="zak-combo__item" role="option" aria-selected="false">Tom Okafor</button>
      </div>
    </div>
  </div>
  <div class="zak-field zak-field--outlined">
    <span class="zak-label">Large</span>
    <div class="zak-combo" data-zak-autocomplete>
      <button class="zak-select zak-input--lg" type="button" style="display:flex;align-items:center;gap:var(--zak-space-2);text-align:left" aria-haspopup="listbox" aria-expanded="false">
        <span style="flex:1">Mei Chen</span>${svgIcon('chevron-down', 'zak-icon', 16)}
      </button>
      <div class="zak-combo__list" role="listbox" hidden>
        <button class="zak-combo__item" role="option" aria-selected="true">Mei Chen</button>
        <button class="zak-combo__item" role="option" aria-selected="false">Tom Okafor</button>
      </div>
    </div>
  </div>
</div>`,
      },
    ],
    notes: ['Combobox keeps the selected value in a trigger; Autocomplete keeps typing in an input. Same listbox, different affordance.'],
  }),
  'tags-input': defineDemo({
    desc: 'Free-form label entry: commit with Enter or comma, remove with Backspace or the chip close button, paste to import many at once.',
    tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
    <label class="zak-label" id="tags-label">Labels <span class="zak-hint" style="margin-inline-start:auto">Enter or comma to add</span></label>
    <div class="zak-tags" data-zak-tags aria-labelledby="tags-label">
      <span class="zak-tag">design-system <button class="zak-tag__x" aria-label="Remove design-system">${svgIcon('x', 'zak-icon', 11)}</button></span>
      <span class="zak-tag">enterprise <button class="zak-tag__x" aria-label="Remove enterprise">${svgIcon('x', 'zak-icon', 11)}</button></span>
      <span class="zak-tag">a11y <button class="zak-tag__x" aria-label="Remove a11y">${svgIcon('x', 'zak-icon', 11)}</button></span>
      <input class="zak-tags__input" placeholder="Add label…" aria-label="Add label"/>
    </div>
  </div>`,
    codeTpl: `<!-- Committed chips plus a draft input -->
<div class="zak-tags" data-zak-tags>
  <span class="zak-tag">design-system <button class="zak-tag__x" aria-label="Remove design-system">✕</button></span>
  <span class="zak-tag">enterprise <button class="zak-tag__x" aria-label="Remove enterprise">✕</button></span>
  <span class="zak-tag">a11y <button class="zak-tag__x" aria-label="Remove a11y">✕</button></span>
  <input class="zak-tags__input" placeholder="Add label…" aria-label="Add label"/>
</div>`,
    js: `const root = document.querySelector('[data-zak-tags]');
const input = root.querySelector('.zak-tags__input');

function addTag(value) {
  const text = value.trim();
  if (!text) return;
  const chip = document.createElement('span');
  chip.className = 'zak-tag';
  chip.textContent = text + ' ';
  const remove = document.createElement('button');
  remove.className = 'zak-tag__x';
  remove.type = 'button';
  remove.setAttribute('aria-label', 'Remove ' + text);
  remove.textContent = '×';
  chip.append(remove);
  root.insertBefore(chip, input);
  input.value = '';
}

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addTag(input.value); }
  if (event.key === 'Backspace' && !input.value) root.querySelector('.zak-tag:last-of-type')?.remove();
});`,
    props: [
      ['data-zak-tags', 'attr', '—', 'Marks the tags container for the behaviour module.'],
      ['.zak-tags__input', 'element', '—', 'Entry point; flexes to fill remaining width.'],
      ['Enter / ,', 'interaction', '—', 'Commits the current draft as a chip.'],
      ['Backspace', 'interaction', '—', 'Removes the last chip when the draft is empty.'],
    ],
  }),
  'form-wizard': defineDemo({
    desc: 'Multi-step flow that works from markup alone: the rail, the panels and the nav buttons are wired by the behaviour runtime. Required fields in the leaving panel block progress.',
    tpl: `<div class="zak-box" style="width:100%" data-zak-wizard>
    <div class="zak-wizard__steps" role="list" aria-label="Checkout steps">
      <button class="zak-wizard__step is-active" type="button" role="listitem" data-zak-wizard-goto="0" aria-current="step">1 · Workspace</button>
      <button class="zak-wizard__step" type="button" role="listitem" data-zak-wizard-goto="1">2 · Billing</button>
      <button class="zak-wizard__step" type="button" role="listitem" data-zak-wizard-goto="2">3 · Review</button>
    </div>

    <div class="zak-wizard__panel zak-stack zak-stack--md" data-zak-wizard-panel="0">
      <div class="zak-form-grid">
        <div class="zak-field zak-field--outlined">
          <label class="zak-label" for="wz-company">Company</label>
          <input class="zak-input" id="wz-company" value="Northwind Labs" required/>
        </div>
        <div class="zak-field zak-field--outlined">
          <label class="zak-label" for="wz-plan">Plan</label>
          <select class="zak-select" id="wz-plan"><option>Enterprise</option><option>Team</option><option>Starter</option></select>
        </div>
      </div>
      <span class="zak-hint">Step 1 of 3 · the company name is required to continue.</span>
    </div>

    <div class="zak-wizard__panel zak-stack zak-stack--md" data-zak-wizard-panel="1" hidden>
      <div class="zak-form-grid">
        <div class="zak-field zak-field--outlined">
          <label class="zak-label" for="wz-vat">VAT ID</label>
          <input class="zak-input" id="wz-vat" placeholder="DE123456789" required/>
        </div>
        <div class="zak-field zak-field--outlined">
          <label class="zak-label" for="wz-card">Card number</label>
          <input class="zak-input" id="wz-card" inputmode="numeric" placeholder="4242 4242 4242 4242"/>
        </div>
      </div>
      <label class="zak-check"><input type="checkbox" checked/> <span class="zak-check__label">Bill annually <span class="zak-check__desc">Save 20% · invoiced once per year</span></span></label>
    </div>

    <div class="zak-wizard__panel zak-stack zak-stack--sm" data-zak-wizard-panel="2" hidden>
      <div class="zak-flex"><span style="flex:1">Plan</span><strong>Enterprise</strong></div>
      <div class="zak-flex"><span style="flex:1">Billing cycle</span><strong>Annual</strong></div>
      <div class="zak-flex"><span style="flex:1">Seats</span><strong>24</strong></div>
      <span class="zak-msg">${svgIcon('info', 'zak-icon', 14)} Nothing is charged until you place the order.</span>
    </div>

    <div class="zak-wizard__actions">
      <button class="zak-btn zak-btn--text" type="button" data-zak-wizard-back disabled>Back</button>
      <button class="zak-btn zak-btn--filled" type="button" data-zak-wizard-next>Continue</button>
    </div>
  </div>`,
    codeTpl: `<!-- Wizard root: rail, one panel per step, shared actions. No init call needed -->
<div class="zak-box" data-zak-wizard>
  <!-- Step rail: is-done / is-active / upcoming, driven by the runtime -->
  <div class="zak-wizard__steps" role="list" aria-label="Checkout steps">
    <button class="zak-wizard__step is-active" type="button" role="listitem" data-zak-wizard-goto="0" aria-current="step">1 · Workspace</button>
    <button class="zak-wizard__step" type="button" role="listitem" data-zak-wizard-goto="1">2 · Billing</button>
    <button class="zak-wizard__step" type="button" role="listitem" data-zak-wizard-goto="2">3 · Review</button>
  </div>

  <!-- Panels: index matches the rail; every panel but the first starts hidden -->
  <div class="zak-wizard__panel" data-zak-wizard-panel="0">
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="company">Company</label>
      <input class="zak-input" id="company" required/>
    </div>
  </div>
  <div class="zak-wizard__panel" data-zak-wizard-panel="1" hidden>…</div>
  <div class="zak-wizard__panel" data-zak-wizard-panel="2" hidden>…</div>

  <!-- Actions: back is disabled on the first step, next validates then advances -->
  <div class="zak-wizard__actions">
    <button class="zak-btn zak-btn--text" type="button" data-zak-wizard-back disabled>Back</button>
    <button class="zak-btn zak-btn--filled" type="button" data-zak-wizard-next>Continue</button>
  </div>
</div>`,
    js: `// The runtime fires one event per step change — use it to persist or gate
 document.querySelector('[data-zak-wizard]').addEventListener('zak:wizard', (event) => {
  console.log(event.detail.index, event.detail.action); // 0..n · 'next' | 'back' | 'goto' | 'complete'
});`,
    props: [
      ['data-zak-wizard', 'attr', '—', 'Root that owns the rail, panels and actions.'],
      ['data-zak-wizard-panel="i"', 'attr', '—', 'Step body; the runtime hides all but the active index.'],
      ['data-zak-wizard-goto="i"', 'attr', '—', 'Rail button that jumps to a step (forward jumps validate first).'],
      ['data-zak-wizard-next', 'attr', '—', 'Advances after validating `required` fields in the leaving panel.'],
      ['data-zak-wizard-back', 'attr', '—', 'Goes back one step; auto-disabled on the first panel.'],
      ['is-done / is-active', 'class', '—', 'Step rail states, applied by the runtime; `aria-current="step"` tracks the active one.'],
      ['zak:wizard', 'event', '—', 'Fires with `{ index, total, action }` on every change; `action: "complete"` on the final Continue.'],
    ],
    notes: ['The last step\'s Continue acts as Finish: it validates, marks every step done and emits `action: "complete"`.'],
    stage: 'stretch',
    playground: false,
  }),
  'dynamic-field': defineDemo({
    desc: 'Repeatable field groups: users add, remove and reorder rows. The runtime registers add, delete and HTML5 drag-reorder behaviour automatically — grab a row by its handle to move it.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:34rem" data-zak-repeater>
    <div class="zak-repeater" data-repeater-list>
      <div class="zak-repeater__row">
        <span class="zak-repeater__handle" aria-hidden="true" draggable="true" title="Drag to reorder">${svgIcon('grip', 'zak-icon', 15)}</span>
        <input class="zak-input" value="admin@northwind.dev" aria-label="Email"/>
        <select class="zak-select" aria-label="Role"><option>Owner</option><option>Editor</option><option>Viewer</option></select>
        <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Remove row" data-repeater-remove>${svgIcon('trash', 'zak-icon', 15)}</button>
      </div>
      <div class="zak-repeater__row">
        <span class="zak-repeater__handle" aria-hidden="true" draggable="true" title="Drag to reorder">${svgIcon('grip', 'zak-icon', 15)}</span>
        <input class="zak-input" value="team@northwind.dev" aria-label="Email"/>
        <select class="zak-select" aria-label="Role"><option>Owner</option><option selected>Editor</option><option>Viewer</option></select>
        <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Remove row" data-repeater-remove>${svgIcon('trash', 'zak-icon', 15)}</button>
      </div>
    </div>
    <button class="zak-btn zak-btn--outlined zak-btn--sm" style="align-self:flex-start" data-repeater-add>${svgIcon('plus', 'zak-icon', 14)} Add member</button>
  </div>`,
    codeTpl: `<!-- Repeater root with a list and an add button -->
<div data-zak-repeater>
  <div class="zak-repeater" data-repeater-list>
    <div class="zak-repeater__row">
      <!-- Handle is the drag source: draggable="true" starts an HTML5 drag of the row -->
      <span class="zak-repeater__handle" draggable="true" aria-hidden="true">⠿</span>
      <input class="zak-input" value="admin@northwind.dev" aria-label="Email"/>
      <select class="zak-select" aria-label="Role">
        <option>Owner</option><option>Editor</option><option>Viewer</option>
      </select>
      <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Remove row" data-repeater-remove><svg class="zak-icon" aria-hidden="true">…</svg></button>
    </div>
  </div>
  <button class="zak-btn zak-btn--outlined zak-btn--sm" data-repeater-add><svg class="zak-icon" aria-hidden="true">…</svg> Add member</button>
</div>`,
    js: `// No wiring needed — the delegated runtime handles add, remove and drag-reorder.
// Listen for the resulting order if you need to persist it:
const list = document.querySelector('[data-repeater-list]');
list.addEventListener('dragend', () => {
  console.log([...list.querySelectorAll('.zak-repeater__row input')].map((i) => i.value));
});`,
    props: [
      ['data-zak-repeater', 'attr', '—', 'Root that groups the repeatable list.'],
      ['data-repeater-add', 'attr', '—', 'Button that clones the last row (clears its inputs).'],
      ['data-repeater-remove', 'attr', '—', 'Button that removes its row (minimum one kept).'],
      ['.zak-repeater__handle', 'element', '—', 'Set `draggable="true"` to drag-reorder the row via HTML5 DnD.'],
      ['zak-repeater__row--dragging', 'class', '—', 'Applied to the row in flight; styles the ghost target.'],
    ],
  }),
  validation: defineDemo({
    desc: 'Validation states pair colour, an inline success/error icon inside the field, and a text message so meaning survives colorblindness. `aria-invalid` and live messages keep assistive tech informed. The icon treatment applies automatically to inputs, textareas, selects and password fields carrying `.is-valid`/`.is-invalid`.',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="v-1">Work email</label>
      <input class="zak-input is-invalid" id="v-1" value="ada@northwind" aria-invalid="true" aria-describedby="v-1-msg"/>
      <span class="zak-msg zak-msg--error" id="v-1-msg">${svgIcon('alert-circle', 'zak-icon', 14)} Enter a complete email address.</span>
    </div>
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="v-2">Workspace slug</label>
      <input class="zak-input is-valid" id="v-2" value="northwind-labs" aria-describedby="v-2-msg"/>
      <span class="zak-msg zak-msg--success" id="v-2-msg">${svgIcon('check-circle', 'zak-icon', 14)} Available.</span>
    </div>
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="v-3">Region</label>
      <select class="zak-select is-invalid" id="v-3" aria-invalid="true"><option>Select a region</option><option>EU-West</option></select>
      <span class="zak-msg zak-msg--error">${svgIcon('alert-circle', 'zak-icon', 14)} Region is required for compliance.</span>
    </div>
  </div>`,
    codeTpl: `<!-- Invalid field pairs colour with an icon + message -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="v-1">Work email</label>
  <input class="zak-input is-invalid" id="v-1" value="ada@northwind"
         aria-invalid="true" aria-describedby="v-1-msg"/>
  <span class="zak-msg zak-msg--error" id="v-1-msg"><svg class="zak-icon" aria-hidden="true">…</svg> Enter a complete email address.</span>
</div>

<!-- Valid field -->
<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="v-2">Workspace slug</label>
  <input class="zak-input is-valid" id="v-2" value="northwind-labs" aria-describedby="v-2-msg"/>
  <span class="zak-msg zak-msg--success" id="v-2-msg"><svg class="zak-icon" aria-hidden="true">…</svg> Available.</span>
</div>

<!-- Selects share the same states -->
<select class="zak-select is-invalid" aria-invalid="true">…</select>`,
    js: `input.addEventListener('blur', () => {
  const valid = input.checkValidity();
  input.classList.toggle('is-invalid', !valid);
  input.setAttribute('aria-invalid', String(!valid));
});`,
    props: [
      ['is-invalid / is-valid', 'class', '—', 'Border colour, focus ring and inline state icon on the right edge.'],
      ['aria-invalid', 'boolean', 'false', 'Announces the failing state.'],
      ['aria-describedby', 'id', '—', 'Links the control to its message.'],
      ['role="alert"', 'attr', '—', 'Add to the message when it appears dynamically.'],
    ],
    examples: [
      {
        title: 'Error (is-invalid)',
        desc: 'Adding `.is-invalid` recolours the border, focus ring and paints the inline error icon on the right edge.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="vv-err">Work email</label>
  <input class="zak-input is-invalid" id="vv-err" value="ada@northwind" aria-invalid="true" aria-describedby="vv-err-msg"/>
  <span class="zak-msg zak-msg--error" id="vv-err-msg">${svgIcon('alert-circle', 'zak-icon', 14)} Enter a complete email address.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="email">Work email</label>
  <input class="zak-input is-invalid" id="email" aria-invalid="true" aria-describedby="email-msg"/>
  <span class="zak-msg zak-msg--error" id="email-msg">Enter a complete email address.</span>
</div>`,
      },
      {
        title: 'Success (is-valid)',
        desc: '`.is-valid` mirrors the treatment in green with a trailing confirmation icon.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="vv-ok">Workspace slug</label>
  <input class="zak-input is-valid" id="vv-ok" value="northwind-labs" aria-describedby="vv-ok-msg"/>
  <span class="zak-msg zak-msg--success" id="vv-ok-msg">${svgIcon('check-circle', 'zak-icon', 14)} Available.</span>
</div>`,
        code: `<div class="zak-field zak-field--outlined">
  <label class="zak-label" for="slug">Workspace slug</label>
  <input class="zak-input is-valid" id="slug" aria-describedby="slug-msg"/>
  <span class="zak-msg zak-msg--success" id="slug-msg">Available.</span>
</div>`,
      },
      {
        title: 'Links to the message (aria-describedby)',
        desc: 'Every state is announced, not just coloured — the control references its message id so screen readers read it after the field name.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="vv-desc">Region</label>
  <select class="zak-select is-invalid" id="vv-desc" aria-invalid="true" aria-describedby="vv-desc-msg"><option>Select a region</option><option>EU-West</option></select>
  <span class="zak-msg zak-msg--error" id="vv-desc-msg">Region is required for compliance.</span>
</div>`,
        code: `<select class="zak-select is-invalid" aria-invalid="true" aria-describedby="region-msg">…</select>
<span class="zak-msg zak-msg--error" id="region-msg">Region is required for compliance.</span>`,
      },
      {
        title: 'Live message (role="alert")',
        desc: 'When an error appears after a blur or submit, promote the message with `role="alert"` so it is announced immediately.',
        stage: 'stretch',
        tpl: `<div class="zak-field zak-field--outlined" style="width:100%;max-width:26rem">
  <label class="zak-label" for="vv-live">Coupon code</label>
  <input class="zak-input is-invalid" id="vv-live" value="EXPIRED24" aria-invalid="true" aria-describedby="vv-live-msg"/>
  <span class="zak-msg zak-msg--error" id="vv-live-msg" role="alert">${svgIcon('alert-circle', 'zak-icon', 14)} This code has expired.</span>
</div>`,
        code: `<input class="zak-input is-invalid" aria-invalid="true" aria-describedby="coupon-msg"/>
<span class="zak-msg zak-msg--error" id="coupon-msg" role="alert">This code has expired.</span>`,
      },
      {
        title: 'Textarea and password',
        desc: 'The same inline icon sits inside taller and suffixed controls.',
        tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:26rem">
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="v-note">Notes</label>
      <textarea class="zak-textarea is-invalid" id="v-note" rows="3" aria-invalid="true">Short</textarea>
      <span class="zak-msg zak-msg--error">Please write at least 20 characters.</span>
    </div>
    <div class="zak-field zak-field--outlined">
      <label class="zak-label" for="v-pass">Password</label>
      <div class="zak-input-wrap zak-input-wrap--suffix">
        <input class="zak-input is-valid" id="v-pass" type="password" value="Str0ng!Pass" data-zak-password/>
        <button class="zak-input-wrap__btn" type="button" aria-label="Show password" data-zak-reveal>${svgIcon('eye', 'zak-icon', 15)}</button>
      </div>
      <span class="zak-msg zak-msg--success">Strong enough.</span>
    </div>
  </div>`,
      },
    ],
    notes: ['Validate on blur, re-validate on input — never show errors while the user is mid-keystroke on first entry.'],
    a11y: {
      keys: [
        ['Tab', 'Moves between fields in DOM order.'],
      ],
      aria: [
        ['aria-invalid', 'Announces the failing state on the control.'],
        ['aria-describedby', 'Points at the hint or error message id.'],
      ],
    },
  }),
};
