/**
 * ZAKUIKit Docs — AI runtime: prompt composer, suggestion pills, simulated
 * chat, streaming responses, thinking steps and the command palette.
 *
 * The streaming engine is shared across demos: one WeakMap-tracked interval
 * per stream element, a reduced-motion fast path that renders the full text
 * instantly, and a document-level Escape that freezes whatever is in flight.
 *
 * No innerHTML sinks: icons arrive through `setHtml` (DOMParser) and every
 * other node is built with createElement/textContent.
 */
import { setHtml } from './dom';
import { svgIcon } from '../data/icons';
import { toast } from './behaviors';

const isElement = (node: EventTarget | null): node is Element => node instanceof Element;

function isReady(el: Element): boolean {
  return el.getAttribute('data-zak-ready') === '1';
}

function markReady(el: Element): void {
  el.setAttribute('data-zak-ready', '1');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---- Streaming engine ------------------------------------------------------ */

interface StreamRun {
  timer: number;
  done?: () => void;
}

const streamRuns = new WeakMap<HTMLElement, StreamRun>();

function completeStream(stream: HTMLElement, run: StreamRun): void {
  window.clearInterval(run.timer);
  streamRuns.delete(stream);
  stream.classList.add('is-done');
  stream.closest('[data-zak-stream-bubble]')?.setAttribute('aria-busy', 'false');
  run.done?.();
}

/** Freeze an in-flight reveal in place (Escape, re-render, restart). */
function stopStream(stream: HTMLElement): void {
  const run = streamRuns.get(stream);
  if (run) completeStream(stream, run);
}

function runStream(stream: HTMLElement, text: string, step = 24, done?: () => void): void {
  stopStream(stream);
  const bubble = stream.closest('[data-zak-stream-bubble]');
  stream.classList.remove('is-done');
  bubble?.setAttribute('aria-busy', 'true');

  if (prefersReducedMotion()) {
    stream.textContent = text;
    stream.classList.add('is-done');
    bubble?.setAttribute('aria-busy', 'false');
    done?.();
    return;
  }

  const run: StreamRun = { timer: 0, done };
  let index = 0;
  run.timer = window.setInterval(() => {
    if (!stream.isConnected) {
      window.clearInterval(run.timer);
      streamRuns.delete(stream);
      done?.();
      return;
    }
    index += 1;
    stream.textContent = text.slice(0, index);
    if (index >= text.length) completeStream(stream, run);
  }, step);
  streamRuns.set(stream, run);
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll<HTMLElement>('[data-zak-stream]').forEach(stopStream);
});

/* ---- Prompt composer (delegated) -------------------------------------------- */

function autoGrow(input: HTMLTextAreaElement): void {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 152)}px`;
}

function syncPromptSend(root: HTMLElement): void {
  const input = root.querySelector<HTMLTextAreaElement>('[data-zak-prompt-input]');
  const send = root.querySelector<HTMLButtonElement>('[data-zak-prompt-send]');
  if (input && send) send.disabled = input.value.trim() === '';
}

function submitPrompt(root: HTMLElement): void {
  const input = root.querySelector<HTMLTextAreaElement>('[data-zak-prompt-input]');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  root.dispatchEvent(new CustomEvent('zak:prompt', { bubbles: true, detail: { text } }));
  input.value = '';
  input.style.height = 'auto';
  syncPromptSend(root);
}

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const send = event.target.closest<HTMLElement>('[data-zak-prompt-send]');
  if (!send) return;
  const root = send.closest<HTMLElement>('[data-zak-prompt]');
  if (root) submitPrompt(root);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  if (!isElement(event.target)) return;
  const input = event.target.closest<HTMLTextAreaElement>('[data-zak-prompt-input]');
  const root = input?.closest<HTMLElement>('[data-zak-prompt]');
  if (!input || !root) return;
  event.preventDefault();
  submitPrompt(root);
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement) || !target.matches('[data-zak-prompt-input]')) return;
  autoGrow(target);
  const root = target.closest<HTMLElement>('[data-zak-prompt]');
  if (root) syncPromptSend(root);
});

// The docs page has no inference endpoint, so acknowledge the dispatched
// event with a toast — the host app owns the real request.
document.addEventListener('zak:prompt', (event) => {
  const text = (event as CustomEvent<{ text?: string }>).detail?.text ?? '';
  if (!text) return;
  const preview = text.length > 42 ? `${text.slice(0, 42)}…` : text;
  toast(`zak:prompt · “${preview}”`, 'info');
});

/* ---- Prompt suggestions (delegated) ------------------------------------------ */

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const pill = event.target.closest<HTMLElement>('.zak-suggest__pill');
  if (!pill) return;
  const suggest = pill.closest<HTMLElement>('[data-zak-suggest]');
  const selector = suggest?.dataset.suggestTarget;
  if (!selector) return;
  const input = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(selector);
  if (!input) return;
  input.value = pill.textContent.trim();
  input.focus();
  input.dispatchEvent(new Event('input', { bubbles: true }));
  if (input instanceof HTMLTextAreaElement) autoGrow(input);
});

/* ---- Streaming demo -------------------------------------------------------------- */

function initStreamDemo(root: HTMLElement): void {
  if (isReady(root)) return;
  const stream = root.querySelector<HTMLElement>('[data-zak-stream]');
  if (!stream) return;
  markReady(root);

  root.querySelector<HTMLElement>('[data-zak-stream-replay]')?.addEventListener('click', () => {
    runStream(stream, stream.dataset.streamText ?? '');
  });

  window.requestAnimationFrame(() => {
    runStream(stream, stream.dataset.streamText ?? '');
  });
}

/* ---- Thinking panel ---------------------------------------------------------------- */

function initThinking(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.zak-thinking--panel').forEach((panel) => {
    if (isReady(panel)) return;
    const steps = Array.from(panel.querySelectorAll<HTMLElement>('.zak-thinking__step'));
    if (steps.length === 0) return;
    markReady(panel);

    // Capture the plain labels, then replay the narrative from step one —
    // the same story the static markup shows, but in motion.
    const labels = steps.map((step) => step.textContent.trim());
    steps.forEach((step, i) => {
      step.classList.remove('is-current');
      step.textContent = labels[i];
    });

    let index = -1;
    let timer = 0;

    const advance = (): void => {
      if (!panel.isConnected) {
        window.clearInterval(timer);
        return;
      }
      if (index >= 0) {
        const finished = steps[index];
        const check = document.createElement('span');
        setHtml(check, svgIcon('check', 'zak-icon', 13));
        finished.replaceChildren(check, document.createTextNode(` ${labels[index]}`));
      }
      index += 1;
      if (index >= steps.length) {
        window.clearInterval(timer);
        panel.classList.add('is-done');
        const dots = panel.querySelector<HTMLElement>('.zak-thinking__dots');
        if (dots) {
          const seal = document.createElement('span');
          setHtml(seal, svgIcon('check-circle', 'zak-icon', 16));
          seal.style.color = 'var(--zak-success)';
          seal.setAttribute('aria-hidden', 'true');
          dots.replaceWith(seal);
        }
        const label = panel.querySelector<HTMLElement>('.zak-thinking__label');
        if (label) label.textContent = 'All steps complete';
        return;
      }
      const current = steps[index];
      current.classList.add('is-current');
      const spinner = document.createElement('span');
      spinner.className = 'zak-spinner zak-spinner--sm';
      spinner.setAttribute('aria-hidden', 'true');
      current.prepend(spinner);
    };

    advance();
    timer = window.setInterval(advance, 1400);
  });
}

/* ---- Chat simulation ------------------------------------------------------------------ */

const CHAT_REPLIES = [
  'Here’s what I found: the degradation window was 14:02–14:47 UTC in eu-west-1. A cache-key collision forced repeated full re-renders — p95 moved from 186 ms to 2.4 s. The fix shipped at 15:10 and the region has been green since.',
  'Done. I pulled the last 30 days of p95 latency by region: eu-west-1 holds 186 ms, us-east-1 172 ms, and the only regression was the Friday window — resolved by build #4821.',
  'Summary: 12 of 12 nodes healthy, error rate 0.42% against a 0.8% budget, and no pending deploys. Want me to draft the weekly report from these numbers?',
];

function chatStamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildUserMessage(text: string): HTMLElement {
  const message = document.createElement('div');
  message.className = 'zak-msg zak-msg--user';

  const avatar = document.createElement('span');
  avatar.className = 'zak-msg__avatar zak-avatar zak-avatar--sm';
  avatar.textContent = 'AS';

  const body = document.createElement('div');
  body.className = 'zak-msg__body';

  const meta = document.createElement('div');
  meta.className = 'zak-msg__meta';
  const author = document.createElement('span');
  author.className = 'zak-msg__author';
  author.textContent = 'You';
  const time = document.createElement('span');
  time.textContent = chatStamp();
  meta.append(author, time);

  const bubble = document.createElement('div');
  bubble.className = 'zak-msg__bubble';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  bubble.append(paragraph);

  body.append(meta, bubble);
  message.append(avatar, body);
  return message;
}

function buildAiMessage(): { message: HTMLElement; stream: HTMLElement; bubble: HTMLElement } {
  const message = document.createElement('div');
  message.className = 'zak-msg zak-msg--ai';
  message.style.maxWidth = '100%';

  const avatar = document.createElement('span');
  avatar.className = 'zak-msg__avatar zak-ai-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  setHtml(avatar, svgIcon('sparkles', 'zak-icon', 13));

  const body = document.createElement('div');
  body.className = 'zak-msg__body';

  const meta = document.createElement('div');
  meta.className = 'zak-msg__meta';
  const author = document.createElement('span');
  author.className = 'zak-msg__author';
  author.textContent = 'Zak Assistant';
  const time = document.createElement('span');
  time.textContent = chatStamp();
  const badge = document.createElement('span');
  badge.className = 'zak-ai-badge';
  setHtml(badge, svgIcon('sparkles', 'zak-icon', 13));
  badge.append(document.createTextNode(' AI'));
  meta.append(author, time, badge);

  const bubble = document.createElement('div');
  bubble.className = 'zak-msg__bubble';
  bubble.setAttribute('aria-live', 'polite');
  bubble.setAttribute('aria-busy', 'true');
  bubble.style.width = '100%';

  const stream = document.createElement('span');
  stream.className = 'zak-stream';
  stream.dataset.zakStream = '';
  bubble.append(stream);

  body.append(meta, bubble);
  message.append(avatar, body);
  return { message, stream, bubble };
}

function initChat(root: HTMLElement): void {
  if (isReady(root)) return;
  const thread = root.querySelector<HTMLElement>('[data-zak-chat-thread]');
  const composer = root.querySelector<HTMLElement>('.zak-chat__composer');
  if (!thread || !composer) return;
  markReady(root);

  const input = composer.querySelector<HTMLTextAreaElement>('textarea');
  const send = composer.querySelector<HTMLButtonElement>('.zak-prompt__send');
  const clear = root.querySelector<HTMLElement>('[data-zak-chat-clear]');

  let replyIndex = 0;
  let pending = false;

  const nearBottom = (): boolean =>
    thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80;

  new MutationObserver(() => {
    if (nearBottom()) thread.scrollTop = thread.scrollHeight;
  }).observe(thread, { childList: true, subtree: true });

  const syncSend = (): void => {
    if (input && send) send.disabled = input.value.trim() === '';
  };
  syncSend();

  const submit = (): void => {
    const text = input?.value.trim() ?? '';
    if (!text || pending) return;
    pending = true;

    thread.append(buildUserMessage(text));
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }
    syncSend();
    thread.setAttribute('aria-busy', 'true');

    const reply = CHAT_REPLIES[replyIndex % CHAT_REPLIES.length];
    replyIndex += 1;

    const { message, stream } = buildAiMessage();
    thread.append(message);

    window.setTimeout(() => {
      runStream(stream, reply, 16, () => {
        pending = false;
        thread.setAttribute('aria-busy', 'false');
      });
    }, 420);
  };

  send?.addEventListener('click', submit);
  if (input) {
    const field = input;
    field.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
      event.preventDefault();
      submit();
    });
    field.addEventListener('input', () => {
      autoGrow(field);
      syncSend();
    });
  }

  clear?.addEventListener('click', () => {
    thread.replaceChildren();
    const note = document.createElement('div');
    note.className = 'zak-msg zak-msg--system';
    const noteBubble = document.createElement('div');
    noteBubble.className = 'zak-msg__bubble';
    noteBubble.textContent = 'Conversation cleared';
    note.append(noteBubble);
    thread.append(note);
  });
}

/* ---- Command menu --------------------------------------------------------------------------- */

function initCmdMenu(root: HTMLElement): void {
  if (isReady(root)) return;
  const input = root.querySelector<HTMLInputElement>('.zak-cmdmenu__input');
  if (!input) return;
  markReady(root);

  const items = Array.from(root.querySelectorAll<HTMLButtonElement>('.zak-cmdmenu__item'));

  const apply = (): void => {
    const query = input.value.trim().toLowerCase();
    items.forEach((item) => {
      item.hidden = query !== '' && !item.textContent.toLowerCase().includes(query);
    });
    const first = items.find((item) => !item.hidden) ?? null;
    items.forEach((item) => item.classList.toggle('is-active', item === first));
  };

  const move = (direction: 1 | -1): void => {
    const visible = items.filter((item) => !item.hidden);
    if (visible.length === 0) return;
    const current = visible.findIndex(
      (item) => item === document.activeElement || item.classList.contains('is-active'),
    );
    const next =
      current === -1
        ? direction === 1
          ? 0
          : visible.length - 1
        : (current + direction + visible.length) % visible.length;
    const target = visible[next];
    items.forEach((item) => item.classList.toggle('is-active', item === target));
    target.focus();
  };

  input.addEventListener('input', apply);
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Escape') {
      input.value = '';
      apply();
      input.focus();
    }
  });
  items.forEach((item) =>
    item.addEventListener('focus', () => {
      items.forEach((other) => other.classList.toggle('is-active', other === item));
    }),
  );

  apply(); // honour the preset query ("summar")
}

/* ---- Boot + playground re-init ------------------------------------------------------------------ */

function initAi(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-zak-stream-demo]').forEach(initStreamDemo);
  root.querySelectorAll<HTMLElement>('[data-zak-chat]').forEach(initChat);
  root.querySelectorAll<HTMLElement>('[data-zak-cmdmenu]').forEach(initCmdMenu);
  root.querySelectorAll<HTMLElement>('[data-zak-prompt]').forEach(syncPromptSend);
  initThinking(root);
}

initAi(document);
document.addEventListener('zak:refresh', () => initAi(document));
