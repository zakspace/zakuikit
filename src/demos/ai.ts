/**
 * Demos — AI Components: buttons, inputs, prompt, suggestions, chat,
 * messages, conversations, responses, streaming, thinking, avatar, tokens,
 * citations and the command menu. Gradient + ring primitives from zak-ai.css.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const spark = svgIcon('sparkles', 'zak-icon zak-sparkle', 15);
const sparkFlat = svgIcon('sparkles', 'zak-icon', 15);
const sparkSm = svgIcon('sparkles', 'zak-icon zak-sparkle', 13);
const sendI = svgIcon('send', 'zak-icon', 15);
const botI = svgIcon('bot', 'zak-icon', 15);
const paperclipI = svgIcon('paperclip', 'zak-icon', 14);
const micI = svgIcon('mic', 'zak-icon', 14);
const globeI = svgIcon('globe', 'zak-icon', 14);
const zapI = svgIcon('zap', 'zak-icon', 14);
const chartI = svgIcon('bar-chart', 'zak-icon', 14);
const lightbulbI = svgIcon('lightbulb', 'zak-icon', 14);
const codeI = svgIcon('code', 'zak-icon', 14);
const copyI = svgIcon('copy', 'zak-icon', 13);
const refreshI = svgIcon('refresh', 'zak-icon', 13);
const checkI = svgIcon('check', 'zak-icon', 13);
const shieldI = svgIcon('shield', 'zak-icon', 14);
const layersI = svgIcon('layers', 'zak-icon', 14);
const usersI = svgIcon('users', 'zak-icon', 14);
const rocketI = svgIcon('rocket', 'zak-icon', 14);
const xI = svgIcon('x', 'zak-icon', 13);
const moreI = svgIcon('more-h', 'zak-icon', 15);
const terminalI = svgIcon('terminal', 'zak-icon', 14);
const fileI = svgIcon('file', 'zak-icon', 14);

export const aiDemos: Record<string, DemoDef> = {
  'ai-button': defineDemo({
    desc: 'The gradient action for AI affordances. The sparkle twinkles on a 2.6s loop, the surface pans its gradient on hover — and a ghost variant sits in toolbars without shouting.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:38rem">
    <div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-3);align-items:center">
      <button class="zak-ai-btn" type="button">${spark} Ask AI</button>
      <button class="zak-ai-btn zak-ai-btn--ghost" type="button">${sparkSm} Summarize selection</button>
      <button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Generate with AI">${spark}</button>
    </div>
    <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4);border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface)">
      <span style="font-size:var(--zak-text-sm);font-weight:var(--zak-weight-semibold)">Release notes</span>
      <span class="zak-ai-badge">${sparkSm} AI</span>
      <span style="margin-inline-start:auto;display:flex;gap:var(--zak-space-2)">
        <button class="zak-ai-btn zak-ai-btn--ghost" type="button">Draft with AI</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Edit manually</button>
      </span>
    </div>
  </div>`,
    codeTpl: `<!-- Base: gradient surface, brand glow shadow, 2.375rem tall -->
<button class="zak-ai-btn" type="button">✦ Ask AI</button>

<!-- Ghost: transparent with brand text, for toolbars and dense rows -->
<button class="zak-ai-btn zak-ai-btn--ghost" type="button">✦ Summarize selection</button>

<!-- Icon: square icon-only; still requires aria-label -->
<button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Generate with AI">✦</button>

<!-- Sparkle: add this class to the sparkles icon to run the twinkle loop -->
<button class="zak-ai-btn" type="button"><svg class="zak-icon zak-sparkle" aria-hidden="true"></svg> Draft with AI</button>

<!-- Hover physics: lift 1px, deepen the glow and pan the gradient -->
<div style="display:flex;gap:var(--zak-space-2)">
  <button class="zak-ai-btn zak-ai-btn--ghost" type="button">Draft with AI</button>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Edit manually</button>
</div>`,
    props: [
      ['.zak-ai-btn', 'class', '—', 'Gradient surface (120°), brand glow shadow, 2.375rem tall.'],
      ['.zak-ai-btn--ghost', 'modifier', '—', 'Transparent with brand text — for toolbars and dense rows.'],
      ['.zak-ai-btn--icon', 'modifier', '—', 'Square icon-only; still requires aria-label.'],
      ['.zak-sparkle', 'class', '—', 'Apply to the sparkles icon for the twinkle loop.'],
      ['hover physics', 'css', '—', 'Lift 1px, deepen glow, pan the background-position.'],
    ],
    a11y: {
      aria: [
        ['aria-label', 'Icon-only AI buttons must be named — "Generate with AI".'],
        ['aria-busy', 'While generating, mark the button busy and keep the label stable.'],
      ],
    },
  }),
  'ai-input': defineDemo({
    desc: 'A single-line ask bar that lives inside existing chrome. The conic ring animates via @property — an honest indicator that this surface is AI, not a static border.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:38rem">
    <div class="zak-ai-input zak-ai-ring" style="border-radius:var(--zak-radius-lg);width:100%">
      <div class="zak-ai-input__inner">
        ${sparkFlat}
        <input class="zak-input" type="text" placeholder="Ask anything about your workspace…" aria-label="Ask AI"/>
        <button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Send question">${sendI}</button>
      </div>
    </div>
    <div class="zak-ai-input" style="border:1px solid var(--zak-border-color);border-radius:var(--zak-radius-lg);width:100%">
      <div class="zak-ai-input__inner">
        ${sparkFlat}
        <input class="zak-input" type="text" placeholder="Plain variant without the ring…" aria-label="Ask AI"/>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Voice input">${micI}</button>
        <button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Send question">${sendI}</button>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Ring: animated conic ring; composes on any rounded box -->
<div class="zak-ai-input zak-ai-ring" style="border-radius:var(--zak-radius-lg)">
  <!-- Inner row: flex row, min-height 2.75rem, brand-tinted leading icon -->
  <div class="zak-ai-input__inner">
    <span class="zak-icon" aria-hidden="true">✦</span>
    <!-- Input: borderless inside the shell; focus ring suppressed -->
    <input class="zak-input" type="text" placeholder="Ask anything about your workspace…" aria-label="Ask AI"/>
    <button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Send question">➤</button>
  </div>
</div>

<!-- Shell: surface radius and border come from the instance -->
<div class="zak-ai-input" style="border-radius:var(--zak-radius-lg)">
  <div class="zak-ai-input__inner">
    <span class="zak-icon" aria-hidden="true">✦</span>
    <input class="zak-input" type="text" placeholder="Plain variant without the ring…" aria-label="Ask AI"/>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Voice input">🎤</button>
    <button class="zak-ai-btn zak-ai-btn--icon" type="button" aria-label="Send question">➤</button>
  </div>
</div>`,
    props: [
      ['.zak-ai-input', 'class', '—', 'Surface shell; radius and border come from the instance.'],
      ['.zak-ai-input__inner', 'element', '—', 'Flex row, min-height 2.75rem, brand-tinted leading icon.'],
      ['input .zak-input', 'pattern', '—', 'Borderless inside the shell; focus ring suppressed.'],
      ['.zak-ai-ring', 'class', '—', 'Animated conic ring via @property — composes on any rounded box.'],
    ],
    notes: ['Reserve the ring for the primary AI entry point on a page — one per view keeps it meaningful.'],
  }),
  'ai-prompt-input': defineDemo({
    desc: 'The full composer: a growing textarea, context chips for attachments and tools, a send affordance that stays quiet until there is something to send, and keyboard hints that teach the shortcuts.',
    stage: 'stretch',
    tpl: `<div class="zak-prompt" style="width:100%;max-width:40rem" data-zak-prompt>
    <textarea class="zak-prompt__input" rows="2" placeholder="Describe the report you need — a 30-day latency review with p95 by region…" aria-label="Prompt" data-zak-prompt-input></textarea>
    <div class="zak-prompt__bar">
      <div class="zak-prompt__chips">
        <button class="zak-prompt__chip" type="button" aria-label="Attach files">${paperclipI} Attach</button>
        <button class="zak-prompt__chip" type="button">${botI} zak-1-pro</button>
        <button class="zak-prompt__chip" type="button" aria-pressed="true" style="background:var(--zak-primary-subtle);color:var(--zak-primary-text);border-color:var(--zak-primary-subtle-border)">${globeI} Web search</button>
      </div>
      <span class="zak-prompt__hint">Enter to send · Shift+Enter for a new line</span>
      <button class="zak-prompt__send" type="button" aria-label="Send prompt" data-zak-prompt-send>${sendI}</button>
    </div>
  </div>`,
    js: `const prompt = document.querySelector('[data-zak-prompt]');
const input = prompt.querySelector('[data-zak-prompt-input]');
const send = prompt.querySelector('[data-zak-prompt-send]');

// Auto-grow the textarea between min (3.4rem) and max (9.5rem)
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 152) + 'px';
});

// Dispatch a bubbling custom event — the host app owns the request
function submit() {
  const text = input.value.trim();
  if (!text) return;
  prompt.dispatchEvent(new CustomEvent('zak:prompt', {
    bubbles: true, detail: { text },
  }));
  input.value = '';
  input.style.height = 'auto';
}

send.addEventListener('click', submit);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
});`,
    codeTpl: `<!-- Composer shell: focus-within paints the brand border and ring -->
<div class="zak-prompt" data-zak-prompt>
  <!-- Input: borderless auto-grow textarea, 3.4 to 9.5rem clamp -->
  <textarea class="zak-prompt__input" rows="2" placeholder="Describe the report you need…" aria-label="Prompt" data-zak-prompt-input></textarea>

  <div class="zak-prompt__bar">
    <div class="zak-prompt__chips">
      <!-- Chips: context chips for attach, model and tools; aria-pressed for toggles -->
      <button class="zak-prompt__chip" type="button" aria-label="Attach files">📎 Attach</button>
      <button class="zak-prompt__chip" type="button">🤖 zak-1-pro</button>
      <button class="zak-prompt__chip" type="button" aria-pressed="true">🌐 Web search</button>
    </div>

    <!-- Hint: teaches Enter and Shift+Enter once -->
    <span class="zak-prompt__hint">Enter to send · Shift+Enter for a new line</span>

    <!-- Send: gradient square pinned inline-end; disable at 40% while empty -->
    <button class="zak-prompt__send" type="button" aria-label="Send prompt" data-zak-prompt-send>➤</button>
  </div>
</div>`,
    props: [
      ['.zak-prompt', 'class', '—', 'Composer shell; focus-within paints the brand border + ring.'],
      ['.zak-prompt__input', 'element', '—', 'Borderless auto-grow textarea, 3.4–9.5rem clamp.'],
      ['.zak-prompt__chip', 'element', '—', 'Context chips: attach, model, tools. aria-pressed for toggles.'],
      ['.zak-prompt__send', 'element', '—', 'Gradient square pinned inline-end; disable at 40% while empty.'],
      ['.zak-prompt__hint', 'element', '—', 'Teaches Enter / Shift+Enter once instead of on every use.'],
    ],
    a11y: {
      keys: [
        ['Enter', 'Submits the prompt.'],
        ['Shift+Enter', 'Inserts a newline without submitting.'],
        ['Tab', 'Chips → hint → send; focus stays after submit.'],
      ],
      aria: [
        ['aria-label="Prompt"', 'The textarea has no visible label — name it anyway.'],
        ['aria-pressed on tool chips', 'Web search is a toggle; announce its state.'],
        ['aria-busy on submit', 'While generating, mark the composer busy rather than disabling it.'],
      ],
    },
  }),
  'prompt-suggestions': defineDemo({
    desc: 'Zero-typing entry points: example prompts phrased as outcomes, not features. Pills lift 1px on hover and fill the composer on click.',
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:40rem">
    <p style="margin:0 0 var(--zak-space-2);font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">Try asking for</p>
    <div class="zak-suggest" data-zak-suggest data-suggest-target="#suggest-prompt">
      <button class="zak-suggest__pill" type="button">${chartI} Summarize last week’s incidents</button>
      <button class="zak-suggest__pill" type="button">${usersI} Find inactive admin accounts</button>
      <button class="zak-suggest__pill" type="button">${shieldI} Audit my API keys for rotation</button>
      <button class="zak-suggest__pill" type="button">${rocketI} Draft release notes for 2.4</button>
      <button class="zak-suggest__pill" type="button">${globeI} Compare eu-west vs us-east latency</button>
    </div>
    <div class="zak-prompt" style="margin-block-start:var(--zak-space-4)" data-zak-prompt>
      <textarea class="zak-prompt__input" id="suggest-prompt" rows="2" placeholder="Pick a suggestion above — or write your own…" aria-label="Prompt" data-zak-prompt-input></textarea>
      <div class="zak-prompt__bar">
        <span class="zak-prompt__hint">Enter to send · Shift+Enter for a new line</span>
        <button class="zak-prompt__send" type="button" aria-label="Send prompt" data-zak-prompt-send>${sendI}</button>
      </div>
    </div>
  </div>`,
    js: `// Pills fill a prompt input and focus it — never auto-submit on click
suggest.addEventListener('click', (e) => {
  const pill = e.target.closest('.zak-suggest__pill');
  if (!pill) return;
  const input = document.querySelector(suggest.dataset.suggestTarget);
  input.value = pill.textContent.trim();
  input.focus();
  input.dispatchEvent(new Event('input', { bubbles: true }));
});`,
    codeTpl: `<!-- Suggest row: wrapping flex row with 0.5rem gaps -->
<!-- data-suggest-target: CSS selector of the composer input to fill on click -->
<div class="zak-suggest" data-zak-suggest data-suggest-target="#suggest-prompt">
  <!-- Pill: full-radius chip; brand-subtle fill and lift on hover -->
  <button class="zak-suggest__pill" type="button">📊 Summarize last week's incidents</button>
  <button class="zak-suggest__pill" type="button">👥 Find inactive admin accounts</button>
  <button class="zak-suggest__pill" type="button">🛡 Audit my API keys for rotation</button>
</div>

<!-- Outcome copy: phrase suggestions as results, verbs first -->
<textarea class="zak-prompt__input" id="suggest-prompt" rows="2" placeholder="Pick a suggestion above…" aria-label="Prompt"></textarea>`,
    props: [
      ['.zak-suggest', 'class', '—', 'Wrapping flex row with 0.5rem gaps.'],
      ['.zak-suggest__pill', 'element', '—', 'Full-radius chips; brand-subtle fill and lift on hover.'],
      ['data-suggest-target', 'attr', '—', 'CSS selector of the composer input to fill on click.'],
      ['outcome copy', 'pattern', '—', 'Phrase suggestions as results ("Summarize…") — verbs first.'],
    ],
  }),
  chat: defineDemo({
    desc: 'The assembled chat surface: glass header with model status, a scrolling thread, and a docked composer. The scroll container owns the height — the frame never jumps.',
    stage: 'stretch',
    tpl: `<div class="zak-chat" style="width:100%;max-width:40rem" data-zak-chat>
    <div class="zak-chat__head">
      <span class="zak-ai-avatar" aria-hidden="true">${sparkSm}</span>
      <div>
        <div class="zak-chat__title">Zak Assistant</div>
        <div class="zak-chat__status">Online · zak-1-pro · web search off</div>
      </div>
      <div style="margin-inline-start:auto;display:flex;gap:var(--zak-space-1)">
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Clear conversation" data-zak-chat-clear>${xI}</button>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="More options">${moreI}</button>
      </div>
    </div>
    <div class="zak-chat__thread" data-zak-chat-thread aria-label="Conversation" aria-live="polite">
      <div class="zak-msg zak-msg--user">
        <span class="zak-msg__avatar zak-avatar zak-avatar--sm">AS</span>
        <div class="zak-msg__body">
          <div class="zak-msg__meta"><span class="zak-msg__author">You</span><span>09:41</span></div>
          <div class="zak-msg__bubble"><p>Which service degraded on Friday and what was the root cause?</p></div>
        </div>
      </div>
      <div class="zak-msg zak-msg--ai" style="max-width:100%">
        <span class="zak-msg__avatar zak-ai-avatar" aria-hidden="true">${sparkSm}</span>
        <div class="zak-msg__body">
          <div class="zak-msg__meta"><span class="zak-msg__author">Zak Assistant</span><span>09:41</span><span class="zak-ai-badge">${sparkSm} AI</span></div>
          <div class="zak-msg__bubble">
            <p>The grid runtime in <strong>eu-west-1</strong> degraded between 14:02–14:47 UTC. A cache key collision on the virtualised row store forced repeated full re-renders — p95 went from 186 ms to 2.4 s.<a class="zak-cite" href="#demo-chat-src">1</a></p>
            <p>A fixed key derivation shipped at 15:10 and the region has been green since.</p>
          </div>
          <div class="zak-msg__actions">
            <button class="zak-msg__action" type="button">${copyI} Copy</button>
            <button class="zak-msg__action" type="button">${refreshI} Regenerate</button>
            <button class="zak-msg__action" type="button">${checkI} Helpful</button>
          </div>
        </div>
      </div>
      <div class="zak-msg zak-msg--system"><div class="zak-msg__bubble">Model switched to zak-1-pro · web search disabled</div></div>
    </div>
    <div class="zak-chat__composer">
      <div class="zak-prompt" style="box-shadow:none;border-radius:var(--zak-radius-lg)">
        <textarea class="zak-prompt__input" rows="1" style="min-height:2.6rem;padding:var(--zak-space-2) var(--zak-space-3)" placeholder="Reply or ask a follow-up…" aria-label="Message"></textarea>
        <div class="zak-prompt__bar" style="padding-block:var(--zak-space-1) var(--zak-space-2)">
          <div class="zak-prompt__chips">
            <button class="zak-prompt__chip" type="button" aria-label="Attach files">${paperclipI}</button>
          </div>
          <button class="zak-prompt__send" type="button" aria-label="Send message">${sendI}</button>
        </div>
      </div>
    </div>
  </div>`,
    js: `// Keep the newest message in view without fighting user scroll
const nearBottom = () =>
  thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80;

new MutationObserver(() => {
  if (nearBottom()) thread.scrollTop = thread.scrollHeight;
}).observe(thread, { childList: true, subtree: true });`,
    codeTpl: `<!-- Chat frame: radius-xl, overflow hidden; the thread scrolls inside -->
<div class="zak-chat" data-zak-chat>
  <!-- Head: glass header with avatar, title, status and utilities -->
  <div class="zak-chat__head">
    <span class="zak-ai-avatar" aria-hidden="true">✦</span>
    <div class="zak-chat__title">Zak Assistant</div>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Clear conversation">✕</button>
  </div>

  <!-- Thread: scroll container; aria-live announces streamed replies -->
  <div class="zak-chat__thread" aria-label="Conversation" aria-live="polite">
    <div class="zak-msg zak-msg--ai">…</div>
  </div>

  <!-- Composer: docked on the muted surface with a border-top seam -->
  <div class="zak-chat__composer">
    <div class="zak-prompt">
      <textarea class="zak-prompt__input" rows="1" placeholder="Reply or ask a follow-up…" aria-label="Message"></textarea>
    </div>
  </div>
</div>`,
    props: [
      ['.zak-chat', 'class', '—', 'Frame: radius-xl, overflow hidden; the thread scrolls inside.'],
      ['.zak-chat__head', 'element', '—', 'Glass header — avatar, title, status line, utilities.'],
      ['.zak-chat__thread', 'element', '—', 'Scroll container; min 18rem / max 26rem tall.'],
      ['.zak-chat__composer', 'element', '—', 'Docked composer on the muted surface; border-top seam.'],
      ['aria-live="polite"', 'attr', '—', 'Streamed replies are announced as they land.'],
    ],
    a11y: {
      keys: [
        ['Esc', 'Stops generation while streaming (composer keeps the draft).'],
        ['↑ in composer', 'Recall your previous prompt.'],
      ],
      aria: [
        ['aria-live on thread', 'Announce new messages politely — never assertively.'],
        ['aria-busy while generating', 'Set on the thread; cleared when the response completes.'],
      ],
    },
  }),
  'chat-message': defineDemo({
    desc: 'The message primitive in all three roles: user bubbles right-aligned in brand fill, assistant bubbles left with hover actions, and centred system notes. Meta rows carry author, time and model tags.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:38rem">
    <div class="zak-msg zak-msg--user">
      <span class="zak-msg__avatar zak-avatar zak-avatar--sm">AS</span>
      <div class="zak-msg__body">
        <div class="zak-msg__meta"><span class="zak-msg__author">You</span><span>10:07</span></div>
        <div class="zak-msg__bubble"><p>Draft a migration plan for the token renames.</p></div>
      </div>
    </div>
    <div class="zak-msg zak-msg--ai" style="max-width:100%">
      <span class="zak-msg__avatar zak-ai-avatar" aria-hidden="true">${sparkSm}</span>
      <div class="zak-msg__body">
        <div class="zak-msg__meta"><span class="zak-msg__author">Zak Assistant</span><span>10:07</span><span class="zak-ai-badge">${sparkSm} AI</span></div>
        <div class="zak-msg__bubble">
          <p>Four steps, each shippable behind a codemod:</p>
          <ul><li>Land aliases for the 12 renamed colour tokens</li><li>Run the codemod across feature packages</li><li>Delete aliases after one release window</li></ul>
        </div>
        <div class="zak-msg__actions">
          <button class="zak-msg__action" type="button">${copyI} Copy</button>
          <button class="zak-msg__action" type="button">${terminalI} Insert as checklist</button>
        </div>
      </div>
    </div>
    <div class="zak-msg zak-msg--system"><div class="zak-msg__bubble">Conversation archived · 10:09</div></div>
  </div>`,
    codeTpl: `<!-- User message: right-aligned bubble in brand fill -->
<div class="zak-msg zak-msg--user">
  <!-- Avatar: regular avatar for humans, ai-avatar for the assistant -->
  <span class="zak-msg__avatar zak-avatar zak-avatar--sm">AS</span>
  <div class="zak-msg__body">
    <div class="zak-msg__meta"><span class="zak-msg__author">You</span><span>10:07</span></div>
    <div class="zak-msg__bubble"><p>Draft a migration plan for the token renames.</p></div>
  </div>
</div>

<!-- Assistant message: the bubble list is pre-spaced, no utility classes -->
<div class="zak-msg zak-msg--ai">
  <span class="zak-msg__avatar zak-ai-avatar" aria-hidden="true">✦</span>
  <div class="zak-msg__body">
    <div class="zak-msg__bubble">
      <p>Four steps, each shippable behind a codemod:</p>
      <ul><li>Land aliases for the 12 renamed tokens</li><li>Run the codemod across packages</li></ul>
    </div>
    <!-- Actions: hover and focus revealed row under the bubble -->
    <div class="zak-msg__actions">
      <button class="zak-msg__action" type="button">📋 Copy</button>
      <button class="zak-msg__action" type="button">⌨ Insert as checklist</button>
    </div>
  </div>
</div>

<!-- System note: centred message -->
<div class="zak-msg zak-msg--system"><div class="zak-msg__bubble">Conversation archived · 10:09</div></div>

<!-- Origin corner: the assistant bubble tucks the start corner toward the avatar -->`,
    props: [
      ['.zak-msg--user / --ai / --system', 'modifier', '—', 'Right brand bubble · left surface bubble · centred note.'],
      ['.zak-msg__avatar', 'element', '—', 'Regular avatar for humans, .zak-ai-avatar for the assistant.'],
      ['.zak-msg__actions', 'element', '—', 'Hover/focus-revealed action row under the bubble.'],
      ['.zak-msg__bubble ul', 'css', '—', 'Lists inside bubbles are pre-spaced — no utility classes.'],
      ['border-start-start-radius', 'css', 'sm', 'The assistant bubble tucks its origin corner toward the avatar.'],
    ],
    a11y: {
      aria: [
        ['author in meta', 'Screen readers should hear who spoke: keep it inside the message.'],
        ['aria-label on actions', 'Icon-only message actions need names.'],
      ],
    },
  }),
  conversation: defineDemo({
    desc: 'The session list: one row per thread with title, recency and message count. Active rows take the brand wash; the whole list is a nav landmark.',
    stage: 'start',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:21rem">
    <button class="zak-ai-btn" type="button" style="width:100%;justify-content:center">${spark} New conversation</button>
    <nav class="zak-conv" aria-label="Recent conversations">
      <button class="zak-conv__item is-active" type="button" aria-current="true">
        <span class="zak-conv__title">${layersI} Grid virtualization plan</span>
        <span class="zak-conv__meta"><span>2 min ago</span><span>14 messages</span></span>
      </button>
      <button class="zak-conv__item" type="button">
        <span class="zak-conv__title">${zapI} Streaming caret race</span>
        <span class="zak-conv__meta"><span>1 hour ago</span><span>8 messages</span></span>
      </button>
      <button class="zak-conv__item" type="button">
        <span class="zak-conv__title">${shieldI} Token rotation audit</span>
        <span class="zak-conv__meta"><span>Yesterday</span><span>23 messages</span></span>
      </button>
      <button class="zak-conv__item" type="button">
        <span class="zak-conv__title">${fileI} API docs rewrite</span>
        <span class="zak-conv__meta"><span>2 days ago</span><span>41 messages</span></span>
      </button>
    </nav>
  </div>`,
    codeTpl: `<!-- Nav landmark: wrap the list in a nav for assistive tech -->
<!-- Panel: padded conversation list, 19rem wide, 1px gaps between rows -->
<nav class="zak-conv" aria-label="Recent conversations">
  <!-- Active row: brand-subtle fill; the title flips to brand text -->
  <button class="zak-conv__item is-active" type="button" aria-current="true">
    <!-- Title and meta: row title with leading icon; recency and count in 2xs -->
    <span class="zak-conv__title">🗂 Grid virtualization plan</span>
    <span class="zak-conv__meta"><span>2 min ago</span><span>14 messages</span></span>
  </button>
  <button class="zak-conv__item" type="button">
    <span class="zak-conv__title">⚡ Streaming caret race</span>
    <span class="zak-conv__meta"><span>1 hour ago</span><span>8 messages</span></span>
  </button>
</nav>`,
    props: [
      ['.zak-conv', 'class', '—', 'Padded panel, 19rem wide, 1px gaps between rows.'],
      ['.zak-conv__item.is-active', 'class', '—', 'Brand-subtle fill; the title flips to brand text.'],
      ['.zak-conv__title / __meta', 'element', '—', 'Row title with leading icon; recency + count in 2xs.'],
      ['nav landmark', 'pattern', '—', 'Wrap the list in <nav aria-label="…"> for AT users.'],
    ],
  }),
  'ai-response': defineDemo({
    desc: 'A rendered answer: titled sections, inline citation chips wired to a source list, prose lists and a code block on the code theme. Everything a markdown renderer needs to target.',
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:40rem;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface);padding:var(--zak-space-5)">
    <div class="zak-ai-response">
      <div class="zak-ai-response__title">${sparkFlat} Deployment summary — release 2.4</div>
      <p style="margin:0">All 12 nodes are healthy on build #4821. The rollout took 2 m 41 s — 38 s faster than 2.3<a class="zak-cite" href="#src-release">1</a>. Two feature flags were promoted automatically after the soak period<a class="zak-cite" href="#src-flags">2</a>.</p>
      <ul style="margin:0">
        <li>Error rate steady at 0.42% (budget: 0.8%)</li>
        <li>p95 latency 186 ms in eu-west-1, 172 ms in us-east-1</li>
        <li>Zero sev-2 incidents during the window</li>
      </ul>
      <pre><code>zak deploy promote --build 4821 \\
  --flags streaming-grid,ai-prompt-v2 \\
  --soak 30m --region eu-west-1</code></pre>
      <ul class="zak-cite-list">
        <li><a class="zak-cite" href="#src-release">1</a><span>Release 2.4 notes — <a href="#">zakui.dev/changelog/2.4</a></span></li>
        <li><a class="zak-cite" href="#src-flags">2</a><span>Flag soak policy — <a href="#">internal runbook · deploy/flags.md</a></span></li>
      </ul>
    </div>
  </div>`,
    codeTpl: `<!-- Response block: vertical rhythm for prose, lists, pre and cite blocks -->
<div class="zak-ai-response">
  <!-- Title: semibold lead line with a leading sparkle -->
  <div class="zak-ai-response__title">✦ Deployment summary — release 2.4</div>
  <p>All 12 nodes are healthy on build #4821<a class="zak-cite" href="#src-release">1</a>.</p>
  <ul>
    <li>Error rate steady at 0.42% (budget: 0.8%)</li>
    <li>p95 latency 186 ms in eu-west-1</li>
  </ul>

  <!-- Code: pre blocks sit on the code surface with horizontal scroll -->
  <pre><code>zak deploy promote --build 4821</code></pre>

  <!-- Citation: superscript chip that pairs with the numbered source list -->
  <ul class="zak-cite-list">
    <li><a class="zak-cite" href="#src-release">1</a><span>Release 2.4 notes</span></li>
  </ul>
</div>`,
    props: [
      ['.zak-ai-response', 'class', '—', 'Vertical rhythm for prose, lists, pre and cite blocks.'],
      ['.zak-ai-response__title', 'element', '—', 'Semibold lead line with a leading sparkle.'],
      ['pre on code tokens', 'css', '—', 'Code blocks sit on --zak-code-bg with horizontal scroll.'],
      ['.zak-cite', 'element', '—', 'Superscript chips; pairs with .zak-cite-list sources.'],
    ],
    notes: ['Render model output as structure, never as an HTML blob — parse to a safe subset (paragraphs, lists, inline code, links) before display.'],
  }),
  'streaming-response': defineDemo({
    desc: 'The streaming primitive: tokens arrive into an aria-live bubble, a brand caret blinks until the final token, then .is-done drops it. Replay re-runs the reveal from data-stream-text.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:38rem" data-zak-stream-demo>
    <div class="zak-msg zak-msg--ai" style="max-width:100%">
      <span class="zak-msg__avatar zak-ai-avatar" aria-hidden="true">${sparkSm}</span>
      <div class="zak-msg__body" style="width:100%">
        <div class="zak-msg__meta"><span class="zak-msg__author">Zak Assistant</span><span>zak-1-pro · streaming</span></div>
        <div class="zak-msg__bubble" style="width:100%" aria-live="polite" aria-busy="true" data-zak-stream-bubble>
          <span class="zak-stream" data-zak-stream data-stream-text="All 12 nodes are healthy. The rollout took 2 minutes 41 seconds — 38 seconds faster than 2.3. Error rate steady at 0.42%, p95 at 186 ms in eu-west-1. Zero sev-2 incidents during the window.">All 12 nodes are healthy. The rollout took 2 minutes 41 seconds — 38 seco</span>
        </div>
        <div class="zak-msg__actions" style="opacity:1">
          <button class="zak-msg__action" type="button" data-zak-stream-replay>${refreshI} Replay stream</button>
        </div>
      </div>
    </div>
  </div>`,
    css: `.zak-stream::after {
  content: "▍";
  display: inline-block;
  margin-inline-start: 1px;
  color: var(--zak-primary);
  animation: zak-blink 0.9s step-end infinite;
}

.zak-stream.is-done::after { display: none; }

@keyframes zak-blink { 50% { opacity: 0; } }`,
    js: `const stream = document.querySelector('[data-zak-stream]');
const bubble = document.querySelector('[data-zak-stream-bubble]');
const full = stream.dataset.streamText;
let i = 0, timer;

function type() {
  clearInterval(timer);
  i = 0;
  stream.classList.remove('is-done');
  bubble.setAttribute('aria-busy', 'true');

  timer = setInterval(() => {
    stream.textContent = full.slice(0, ++i);
    if (i >= full.length) {
      clearInterval(timer);
      stream.classList.add('is-done');        // drop the caret
      bubble.setAttribute('aria-busy', 'false');
    }
  }, 24);
}

replay.addEventListener('click', type);`,
    codeTpl: `<!-- Live region: the bubble announces tokens as they arrive -->
<div class="zak-msg__bubble" aria-live="polite" aria-busy="true" data-zak-stream-bubble>
  <!-- Stream: inline token sink; the caret blinks via CSS -->
  <span class="zak-stream" data-zak-stream data-stream-text="All 12 nodes are healthy.">All 12 nodes are heal</span>
</div>

<!-- Done state: applied on the final token, the caret disappears -->
<span class="zak-stream is-done" data-zak-stream>All 12 nodes are healthy.</span>

<!-- Busy state: true while typing, false when done, batches announcements -->`,
    props: [
      ['.zak-stream', 'element', '—', 'Inline token sink; the ::after caret blinks via CSS.'],
      ['.zak-stream.is-done', 'class', '—', 'Applied on the final token — the caret disappears.'],
      ['aria-live="polite"', 'attr', '—', 'On the bubble; assistive tech reads newly arrived text.'],
      ['aria-busy', 'attr', '—', 'True while typing, false when done — suppresses partial announces.'],
    ],
    a11y: {
      keys: [
        ['Esc', 'Stop generating — freeze the partial text in place.'],
      ],
      aria: [
        ['prefers-reduced-motion', 'Serve the full text instantly instead of the reveal.'],
        ['aria-busy toggling', 'The cleanest way to batch live-region updates.'],
      ],
    },
  }),
  'thinking-indicator': defineDemo({
    desc: 'Two honest waiting states: the inline dots with a shimmering label, and the step panel that narrates real work — completed steps check off, the current step keeps a spinner.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:34rem">
    <div class="zak-thinking" role="status" data-zak-thinking>
      <span class="zak-thinking__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="zak-thinking__label">Thinking…</span>
    </div>
    <div class="zak-thinking zak-thinking--panel" role="status" aria-label="Generation progress">
      <div style="display:flex;align-items:center;gap:var(--zak-space-2)">
        <span class="zak-thinking__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="zak-thinking__label">Working through 3 steps</span>
      </div>
      <div class="zak-thinking__steps">
        <span class="zak-thinking__step">${checkI} Read workspace context</span>
        <span class="zak-thinking__step">${checkI} Query 412 test results</span>
        <span class="zak-thinking__step is-current"><span class="zak-spinner zak-spinner--sm" aria-hidden="true"></span> Drafting the summary…</span>
      </div>
    </div>
  </div>`,
    js: `let step = 0;
const steps = [...panel.querySelectorAll('.zak-thinking__step')];

const advance = setInterval(() => {
  steps[step].classList.remove('is-current');
  steps[step].replaceChildren(checkIcon.cloneNode(true), steps[step].lastChild.textContent);
  step += 1;
  if (step >= steps.length) {
    clearInterval(advance);
    panel.classList.add('is-done');
    return;
  }
  steps[step].classList.add('is-current');
}, 1400);`,
    codeTpl: `<!-- Inline pill: dots plus label; role status announces politely -->
<div class="zak-thinking" role="status">
  <span class="zak-thinking__dots" aria-hidden="true"><i></i><i></i><i></i></span>
  <!-- Label: shimmer via clipped gradient text, no JS -->
  <span class="zak-thinking__label">Thinking…</span>
</div>

<!-- Panel: column layout for the step list -->
<div class="zak-thinking zak-thinking--panel" role="status" aria-label="Generation progress">
  <span class="zak-thinking__label">Working through 3 steps</span>
  <div class="zak-thinking__steps">
    <span class="zak-thinking__step">✓ Read workspace context</span>
    <span class="zak-thinking__step">✓ Query 412 test results</span>
    <!-- Current step: promotes one step; swap its spinner for a check when done -->
    <span class="zak-thinking__step is-current"><span class="zak-spinner zak-spinner--sm" aria-hidden="true"></span> Drafting the summary…</span>
  </div>
</div>`,
    props: [
      ['.zak-thinking', 'class', '—', 'Inline pill: dots + label, tucks its origin corner.'],
      ['.zak-thinking__label', 'element', '—', 'Shimmer via clipped gradient text — no JS.'],
      ['.zak-thinking--panel', 'modifier', '—', 'Column layout for the step list.'],
      ['.zak-thinking__step.is-current', 'class', '—', 'Promotes one step; swap its spinner for a check when done.'],
      ['role="status"', 'attr', '—', 'Announce state changes politely; never focus the indicator.'],
    ],
    notes: ['Steps must reflect real work. Decorative step lists that always "complete" in order train users to ignore them.'],
  }),
  'ai-avatar': defineDemo({
    desc: 'The assistant identity: a slow conic glow with a top-left specular highlight. Three sizes cover message rows, chat headers and hero placements.',
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:38rem">
    <div class="zak-flex" style="align-items:flex-end;gap:var(--zak-space-6)">
      <span style="display:flex;flex-direction:column;align-items:center;gap:var(--zak-space-2)"><span class="zak-ai-avatar zak-ai-avatar--sm" aria-hidden="true"></span><span style="font-size:var(--zak-text-2xs);color:var(--zak-text-tertiary)">sm · rows</span></span>
      <span style="display:flex;flex-direction:column;align-items:center;gap:var(--zak-space-2)"><span class="zak-ai-avatar" aria-hidden="true"></span><span style="font-size:var(--zak-text-2xs);color:var(--zak-text-tertiary)">base · headers</span></span>
      <span style="display:flex;flex-direction:column;align-items:center;gap:var(--zak-space-2)"><span class="zak-ai-avatar zak-ai-avatar--lg" aria-hidden="true"></span><span style="font-size:var(--zak-text-2xs);color:var(--zak-text-tertiary)">lg · hero</span></span>
    </div>
    <div class="zak-flex" style="align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-3) var(--zak-space-4);border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface)">
      <span class="zak-ai-avatar" aria-hidden="true"></span>
      <div style="display:flex;flex-direction:column">
        <span style="font-size:var(--zak-text-sm);font-weight:var(--zak-weight-semibold)">Zak Assistant</span>
        <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">Typing…</span>
      </div>
      <span class="zak-ai-badge" style="margin-inline-start:auto">${sparkSm} AI</span>
    </div>
  </div>`,
    codeTpl: `<!-- Orb: 2.1rem conic-gradient with a specular highlight -->
<!-- Decorative: aria-hidden, the author name carries the meaning -->
<span class="zak-ai-avatar" aria-hidden="true"></span>

<!-- Sizes: sm for message rows, lg for hero placements -->
<span class="zak-ai-avatar zak-ai-avatar--sm" aria-hidden="true"></span>
<span class="zak-ai-avatar zak-ai-avatar--lg" aria-hidden="true"></span>

<!-- Badge: pairs with the orb to label AI-authored surfaces -->
<span class="zak-ai-badge">✦ AI</span>`,
    props: [
      ['.zak-ai-avatar', 'class', '—', '2.1rem conic-gradient orb with a specular ::after highlight.'],
      ['.zak-ai-avatar--sm / --lg', 'modifier', '—', '1.6rem for message rows · 2.75rem for hero placements.'],
      ['.zak-ai-badge', 'element', '—', 'Pairs with the orb to label AI-authored surfaces.'],
      ['aria-hidden', 'attr', '—', 'The orb is decorative — the author name carries meaning.'],
    ],
  }),
  'token-usage': defineDemo({
    desc: 'Honest metering: one segmented bar for input, output and remaining context, plus a monospaced count. The same primitive prices a session.',
    stage: 'stretch',
    tpl: `<div class="zak-flex" style="flex-wrap:wrap;gap:var(--zak-space-4);width:100%;max-width:40rem">
    <div class="zak-tokens">
      <div class="zak-tokens__head"><span>Context window</span><span class="zak-tokens__count">12,408 / 32,768</span></div>
      <div class="zak-tokens__bar" role="img" aria-label="Input 62 percent, output 18 percent, free 20 percent">
        <span class="zak-tokens__seg zak-tokens__seg--in" style="width:62%"></span>
        <span class="zak-tokens__seg zak-tokens__seg--out" style="width:18%"></span>
      </div>
      <div class="zak-tokens__legend">
        <span><i style="background:var(--zak-primary)"></i>Input 7,690</span>
        <span><i style="background:var(--zak-secondary-500)"></i>Output 2,214</span>
        <span><i style="background:var(--zak-bg-active)"></i>Free</span>
      </div>
    </div>
    <div class="zak-tokens">
      <div class="zak-tokens__head"><span>Session cost</span><span class="zak-tokens__count">$0.14</span></div>
      <div class="zak-tokens__bar" role="img" aria-label="Input cost 64 percent, output cost 36 percent">
        <span class="zak-tokens__seg zak-tokens__seg--in" style="width:64%"></span>
        <span class="zak-tokens__seg zak-tokens__seg--out" style="width:36%"></span>
      </div>
      <div class="zak-tokens__legend">
        <span><i style="background:var(--zak-primary)"></i>In $0.09</span>
        <span><i style="background:var(--zak-secondary-500)"></i>Out $0.05</span>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Panel: 15rem card with head, segmented bar and legend -->
<div class="zak-tokens">
  <div class="zak-tokens__head">
    <span>Context window</span>
    <!-- Count: monospaced tabular readout keeps numbers aligned as they tick -->
    <span class="zak-tokens__count">12,408 / 32,768</span>
  </div>

  <!-- Summary graphic: spell the percentages out in the aria-label -->
  <div class="zak-tokens__bar" role="img" aria-label="Input 62 percent, output 18 percent, free 20 percent">
    <!-- Segments: brand for input, secondary for output, free is the track -->
    <span class="zak-tokens__seg zak-tokens__seg--in" style="width:62%"></span>
    <span class="zak-tokens__seg zak-tokens__seg--out" style="width:18%"></span>
  </div>

  <div class="zak-tokens__legend">
    <span><i style="background:var(--zak-primary)"></i>Input 7,690</span>
    <span><i style="background:var(--zak-secondary-500)"></i>Output 2,214</span>
  </div>
</div>`,
    props: [
      ['.zak-tokens', 'class', '—', '15rem panel: head, segmented 0.45rem bar, legend.'],
      ['.zak-tokens__seg--in / --out', 'modifier', '—', 'Brand for input · secondary for output. Free = track.'],
      ['.zak-tokens__count', 'element', '—', 'Monospaced tabular readout — numbers stay aligned as they tick.'],
      ['role="img" + aria-label', 'attr', '—', 'The bar is a summary graphic; spell the percentages out.'],
    ],
    notes: ['Surface usage before the limit, not after. A bar that only appears when you are nearly out is a surprise, not a service.'],
  }),
  citation: defineDemo({
    desc: 'Inline superscript chips wired to a numbered source list — the trust layer of AI prose. Chips lift to full brand on hover; sources stay one tap away.',
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:38rem">
    <p style="margin:0 0 var(--zak-space-4);font-size:var(--zak-text-md);line-height:var(--zak-leading-relaxed);color:var(--zak-text-secondary)">Virtual grids hold a stable scroll position by writing tall spacer rows around the visible window<a class="zak-cite" href="#src-scroll">1</a>, while streaming responses must batch DOM writes to at most one per frame to avoid layout thrash<a class="zak-cite" href="#src-stream">2</a>. Both techniques anchor on the same browser primitive: scroll anchoring<a class="zak-cite" href="#src-anchor">3</a>.</p>
    <ul class="zak-cite-list" aria-label="Sources">
      <li><a class="zak-cite" href="#src-scroll">1</a><span>Virtual scrolling patterns — <a href="#">web.dev/articles/virtual-scrolling</a></span></li>
      <li><a class="zak-cite" href="#src-stream">2</a><span>Streaming UI without jank — <a href="#">developer.mozilla.org/…/Streams_API</a></span></li>
      <li><a class="zak-cite" href="#src-anchor">3</a><span>CSS scroll anchoring — <a href="#">drafts.csswg.org/css-scroll-anchoring</a></span></li>
    </ul>
  </div>`,
    codeTpl: `<!-- Chip: superscript 0.72em, brand wash, radius sm; each chip deep-links -->
<p>Virtual grids hold a stable scroll position by writing tall spacer rows<a class="zak-cite" href="#src-scroll">1</a>.</p>

<!-- Source list: muted panel of numbered sources, 0.5rem gaps -->
<ul class="zak-cite-list" aria-label="Sources">
  <li><a class="zak-cite" href="#src-scroll">1</a><span>Virtual scrolling patterns</span></li>
  <li><a class="zak-cite" href="#src-stream">2</a><span>Streaming UI without jank</span></li>
</ul>

<!-- Hover state: the chip inverts to brand fill for a confident hit target -->`,
    props: [
      ['.zak-cite', 'element', '—', 'Superscript chip: 0.72em, brand wash, radius sm.'],
      ['.zak-cite-list', 'element', '—', 'Muted panel of numbered sources, 0.5rem gaps.'],
      ['href per chip', 'attr', '—', 'Each chip deep-links to its row — anchors also aid keyboard users.'],
      ['hover state', 'css', '—', 'Chip inverts to brand fill for a confident hit target.'],
    ],
    a11y: {
      aria: [
        ['link semantics', 'Citations are links, not spans — they navigate.'],
        ['source list label', 'aria-label="Sources" on the list names the region.'],
      ],
    },
  }),
  'ai-command-menu': defineDemo({
    desc: 'The palette: a command input, keyboard-navigable results with live highlight, and a footer that teaches the keys. Model and scope appear as muted annotations.',
    stage: 'stretch',
    tpl: `<div class="zak-cmdmenu" style="width:100%;max-width:30rem" data-zak-cmdmenu>
    <div class="zak-cmdmenu__input-row">
      ${sparkFlat}
      <input class="zak-cmdmenu__input" type="text" value="summar" placeholder="Type a command or ask anything…" aria-label="Command or question"/>
      <kbd class="zak-kbd">Esc</kbd>
    </div>
    <div class="zak-cmdmenu__list" role="menu" aria-label="Commands">
      <button class="zak-cmdmenu__item is-active" type="button" role="menuitem">${sparkFlat} Summarize this page <small>Current document</small><kbd class="zak-kbd">↵</kbd></button>
      <button class="zak-cmdmenu__item" type="button" role="menuitem">${chartI} Summarize with a data table <small>Adds markdown table</small></button>
      <button class="zak-cmdmenu__item" type="button" role="menuitem">${lightbulbI} Explain the grid runtime <small>Ask docs</small></button>
      <button class="zak-cmdmenu__item" type="button" role="menuitem">${shieldI} Run an accessibility audit <small>WCAG 2.2 AA checklist</small></button>
      <button class="zak-cmdmenu__item" type="button" role="menuitem">${globeI} Translate the selection <small>12 languages</small></button>
      <button class="zak-cmdmenu__item" type="button" role="menuitem">${codeI} Refactor to design tokens <small>CSS codemod</small></button>
    </div>
    <div class="zak-cmdmenu__foot">
      <span><kbd class="zak-kbd">↑</kbd><kbd class="zak-kbd">↓</kbd> Navigate</span>
      <span><kbd class="zak-kbd">↵</kbd> Select</span>
      <span style="margin-inline-start:auto;display:inline-flex;align-items:center;gap:0.3rem">${botI} zak-1-pro</span>
    </div>
  </div>`,
    js: `// Filter as you type, keeping the highlight on a live option
input.addEventListener('input', () => {
  const q = input.value.toLowerCase();
  items.forEach((item) => {
    item.hidden = !item.textContent.toLowerCase().includes(q);
  });
  const first = items.find((i) => !i.hidden);
  items.forEach((i) => i.classList.toggle('is-active', i === first));
});

// Roving focus — arrows move, Enter activates
list.addEventListener('keydown', (e) => {
  const visible = [...items].filter((i) => !i.hidden);
  const current = visible.indexOf(document.activeElement);
  const next = e.key === 'ArrowDown' ? current + 1
             : e.key === 'ArrowUp'   ? current - 1 : -1;
  if (next >= 0) { e.preventDefault(); visible[next % visible.length].focus(); }
});`,
    codeTpl: `<!-- Palette: elevated card with input row, results and foot -->
<div class="zak-cmdmenu" data-zak-cmdmenu>
  <div class="zak-cmdmenu__input-row">
    <span class="zak-icon" aria-hidden="true">✦</span>
    <input class="zak-cmdmenu__input" type="text" placeholder="Type a command or ask anything…" aria-label="Command or question"/>
    <kbd class="zak-kbd">Esc</kbd>
  </div>

  <div class="zak-cmdmenu__list" role="menu" aria-label="Commands">
    <!-- Active item: brand wash marks the current option; hover matches it -->
    <button class="zak-cmdmenu__item is-active" type="button" role="menuitem">✦ Summarize this page <small>Current document</small></button>
    <!-- Scope: muted small annotation after the label -->
    <button class="zak-cmdmenu__item" type="button" role="menuitem">📊 Summarize with a data table <small>Adds markdown table</small></button>
  </div>

  <!-- Keys: footer kbd chips teach navigation before it is needed -->
  <div class="zak-cmdmenu__foot">
    <span><kbd class="zak-kbd">↑</kbd><kbd class="zak-kbd">↓</kbd> Navigate</span>
    <span><kbd class="zak-kbd">↵</kbd> Select</span>
  </div>
</div>`,
    props: [
      ['.zak-cmdmenu', 'class', '—', 'Elevated 30rem palette: input row, results, foot.'],
      ['.zak-cmdmenu__item.is-active', 'class', '—', 'Brand wash marks the current option; hover matches it.'],
      ['.zak-cmdmenu__item small', 'element', '—', 'Muted scope annotation after the label.'],
      ['kbd .zak-kbd', 'element', '—', 'Footer keys teach navigation before it is needed.'],
    ],
    a11y: {
      keys: [
        ['↑ / ↓', 'Move the highlight through visible results.'],
        ['Enter', 'Runs the highlighted command.'],
        ['Esc', 'Closes the palette and restores focus to the invoker.'],
      ],
      aria: [
        ['role="menu" / menuitem', 'Announce the list structure; keep one item active at a time.'],
        ['aria-expanded on input', 'Set while results are visible (combobox pattern).'],
      ],
    },
  }),
};
