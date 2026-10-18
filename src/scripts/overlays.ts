/**
 * ZAKUIKit — Overlay & Disclosure Runtime (Global Delegation)
 *
 * ALL interactive behavior uses document-level event delegation.
 * Components work on dynamically injected HTML without re-initialization.
 * No `data-zak-ready` guards — every listener uses `closest()` to find its target.
 */

const isElement = (node: EventTarget | null): node is Element => node instanceof Element;
const isHTMLElement = (node: EventTarget | null | undefined): node is HTMLElement =>
  node instanceof HTMLElement;

/* ========================================================================
   Trigger contract: data-zak-toggle / data-zak-target / data-zak-close
   ======================================================================== */

/** Height-agnostic disclosure: the grid row animates 0fr → 1fr. The panel is
    taken out of the layout (`hidden`) once the closing transition settles, so no
    padding, border or child height survives as residue. */
function toggleCollapse(trigger: HTMLElement, panel: HTMLElement): void {
  const open = !panel.classList.contains('is-open');
  trigger.setAttribute('aria-expanded', String(open));

  if (open) {
    panel.hidden = false;
    /* One frame unstyled, then animate — the transition needs a starting box. */
    window.requestAnimationFrame(() => panel.classList.add('is-open'));
    return;
  }

  panel.classList.remove('is-open');
  const settle = (): void => {
    if (!panel.classList.contains('is-open')) panel.hidden = true;
  };
  const onEnd = (event: TransitionEvent): void => {
    if (event.target !== panel || event.propertyName !== 'grid-template-rows') return;
    panel.removeEventListener('transitionend', onEnd);
    settle();
  };
  panel.addEventListener('transitionend', onEnd);
  /* Fallback for reduced motion or a transition that never fires. */
  window.setTimeout(settle, 400);
}

function setDropdown(wrapper: HTMLElement, open: boolean): void {
  const panel = wrapper.querySelector<HTMLElement>('.zak-dropdown__panel');
  if (panel) panel.hidden = !open;
  wrapper
    .querySelector<HTMLElement>('[data-zak-toggle="dropdown"]')
    ?.setAttribute('aria-expanded', String(open));
  wrapper.classList.toggle('is-open', open);
}

function closeDropdowns(except?: Element): void {
  const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.querySelectorAll<HTMLElement>('[data-zak-dropdown]').forEach((wrapper) => {
    if (except && wrapper.contains(except)) return;
    const wasOpen = !wrapper.querySelector<HTMLElement>('.zak-dropdown__panel')?.hidden;
    setDropdown(wrapper, false);
    if (wasOpen && returnFocus && wrapper.contains(returnFocus)) {
      wrapper.querySelector<HTMLElement>('[data-zak-toggle="dropdown"]')?.focus();
    }
  });
}

function toggleDropdown(trigger: HTMLElement): void {
  const wrapper = trigger.closest<HTMLElement>('[data-zak-dropdown]');
  if (!wrapper) return;
  const panel = wrapper.querySelector<HTMLElement>('.zak-dropdown__panel');
  if (!panel) return;

  const open = trigger.getAttribute('aria-expanded') === 'true';
  closeDropdowns(wrapper);
  setDropdown(wrapper, !open);

  if (!open) {
    panel.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, button')?.focus();
  } else {
    trigger.focus();
  }
}

function handleToggle(trigger: HTMLElement): void {
  const kind = trigger.dataset.zakToggle ?? '';
  if (kind === 'dropdown') {
    toggleDropdown(trigger);
    return;
  }

  const selector = trigger.dataset.zakTarget;
  const panel = selector ? document.querySelector<HTMLElement>(selector) : null;
  if (!panel) return;

  if (panel instanceof HTMLDialogElement) {
    if (!panel.open) panel.showModal();
    return;
  }

  if (kind === 'collapse' || panel.classList.contains('zak-collapse')) {
    toggleCollapse(trigger, panel);
    return;
  }

  const open = panel.classList.toggle('is-open');
  trigger.setAttribute('aria-expanded', String(open));
}

/* ========================================================================
   MAIN CLICK HANDLER — document level
   Handles: dialog close, dropdown toggle, accordion, show-more, popover
   ======================================================================== */

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;

  /* Dialog close via [data-zak-close] or backdrop click */
  const closer = event.target.closest<HTMLElement>('[data-zak-close]');
  if (closer) {
    closer.closest('dialog')?.close();
    return;
  }
  if (event.target instanceof HTMLDialogElement && event.target.open) {
    event.target.close();
    return;
  }

  /* data-zak-toggle — dropdown, collapse, dialog, generic */
  const trigger = event.target.closest<HTMLElement>('[data-zak-toggle]');
  if (trigger) {
    handleToggle(trigger);
    return;
  }

  /* Accordion trigger */
  const accordionTrigger = event.target.closest<HTMLElement>('.zak-accordion__trigger');
  if (accordionTrigger) {
    const wrapper = accordionTrigger.closest<HTMLElement>('[data-zak-accordion]');
    const panelId = accordionTrigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (wrapper && panel) {
      const open = accordionTrigger.getAttribute('aria-expanded') === 'true';
      if (!open && wrapper.dataset.zakAccordion === 'single') {
        wrapper
          .querySelectorAll<HTMLElement>('.zak-accordion__trigger[aria-expanded="true"]')
          .forEach((other) => {
            other.setAttribute('aria-expanded', 'false');
            const otherId = other.getAttribute('aria-controls');
            const otherPanel = otherId ? document.getElementById(otherId) : null;
            if (otherPanel) otherPanel.hidden = true;
          });
      }
      accordionTrigger.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    }
    return;
  }

  /* Show more / less toggle */
  const showMoreToggle = event.target.closest<HTMLElement>('[data-zak-showmore-toggle]');
  if (showMoreToggle) {
    const wrapper = showMoreToggle.closest<HTMLElement>('[data-zak-showmore]');
    if (wrapper) {
      const open = wrapper.classList.toggle('is-open');
      showMoreToggle.setAttribute('aria-expanded', String(open));
      showMoreToggle.textContent = open ? 'Show less' : 'Show more';
    }
    return;
  }

  /* Popover trigger — [popovertarget] or [data-zak-popover-trigger] */
  const popoverTrigger = event.target.closest<HTMLElement>('[popovertarget], [data-zak-popover-trigger]');
  if (popoverTrigger) {
    const popoverId = popoverTrigger.getAttribute('popovertarget') ?? popoverTrigger.dataset.zakPopoverTrigger;
    const popover = popoverId ? document.getElementById(popoverId) : null;
    if (popover && popover.hasAttribute('popover')) {
      /* Positioning happens in the popover's toggle event listener */
      return;
    }
  }

  /* Close dropdowns on outside click */
  closeDropdowns(event.target);
});

/* ========================================================================
   ESC KEY — close dropdowns, context menus, popovers
   ======================================================================== */

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeDropdowns();
  document.querySelectorAll<HTMLElement>('.zak-context-menu').forEach((menu) => {
    if (!menu.hidden) hideContextMenu(menu);
  });
  document.querySelectorAll<HTMLElement>('[popover]').forEach((popover) => {
    if (popover.matches(':popover-open')) popover.hidePopover?.();
  });
});

/* ========================================================================
   Dropdown keyboard routing (ARIA menu pattern)
   ======================================================================== */

function dropdownItems(wrapper: HTMLElement): HTMLElement[] {
  const panel = wrapper.querySelector<HTMLElement>('.zak-dropdown__panel');
  if (!panel || panel.hidden) return [];
  return Array.from(
    panel.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled]), .zak-menu__item:not(.is-disabled), a[href], button:not([disabled])',
    ),
  );
}

const isTextEntry = (el: Element | null): boolean =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;

document.addEventListener('keydown', (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  const wrapper = event.target.closest<HTMLElement>('[data-zak-dropdown]');
  if (!wrapper) return;

  const trigger = wrapper.querySelector<HTMLElement>('[data-zak-toggle="dropdown"]');
  const panel = wrapper.querySelector<HTMLElement>('.zak-dropdown__panel');
  if (!panel) return;
  const onTrigger = trigger && (event.target === trigger || trigger.contains(event.target));
  const items = dropdownItems(wrapper);
  if (items.length === 0 && !onTrigger) return;
  const current = items.indexOf(event.target as HTMLElement);

  if (onTrigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault();
    if (panel.hidden) setDropdown(wrapper, true);
    const entries = dropdownItems(wrapper);
    (event.key === 'ArrowDown' ? entries[0] : entries[entries.length - 1])?.focus();
    return;
  }

  if (onTrigger || current !== -1 || items.includes(event.target as HTMLElement)) {
    if (event.key === 'ArrowDown' || (event.key === 'ArrowUp' && !isTextEntry(event.target))) {
      if (event.key === 'ArrowDown' && isTextEntry(event.target)) return;
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      items[(current + delta + items.length) % items.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === 'Tab') {
      closeDropdowns();
    }
  }
});

/* ========================================================================
   Popover positioning — delegated via toggle event on [popover] elements
   ======================================================================== */

let popoverPointer: { x: number; y: number; time: number } = { x: 0, y: 0, time: 0 };
document.addEventListener(
  'pointerdown',
  (event) => {
    popoverPointer = { x: event.clientX, y: event.clientY, time: Date.now() };
  },
  true,
);

/* Authored preference per popover, remembered so the resolved side written back
   to data-zak-placement never overwrites what the author asked for. */
const popoverPreferred = new WeakMap<HTMLElement, string>();

function positionPopover(popover: HTMLElement, anchor: Element | null): void {
  const gap = 8;
  const edge = 12;
  const viewportW = document.documentElement.clientWidth;
  const viewportH = document.documentElement.clientHeight;
  /* offsetWidth/Height are only meaningful once the popover is rendered open. */
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;

  /* Preferred side, overridable per popover with data-zak-placement. */
  let preferred = popoverPreferred.get(popover);
  if (!preferred) {
    preferred = popover.dataset.zakPlacement || 'bottom';
    popoverPreferred.set(popover, preferred);
  }

  /* "side[-align]" — the side places the panel, the optional align token slides
     it along the cross axis. `left`/`right` are the inline start/end sides; on
     vertical sides `left`/`right` (and start/end) align horizontally, on
     horizontal sides `top`/`bottom` align vertically. */
  const [rawSide = 'bottom', rawAlign = ''] = preferred.split('-');
  const sideOf: Record<string, string> = { top: 'top', bottom: 'bottom', left: 'start', right: 'end', start: 'start', end: 'end' };
  const alignOf: Record<string, string> = { start: 'start', end: 'end', center: 'center', left: 'start', right: 'end', top: 'start', bottom: 'end' };
  let side = sideOf[rawSide] ?? 'bottom';
  const align = alignOf[rawAlign] ?? 'start';

  /* The surface sits at `position: fixed`, so trigger rectangles are already
     in the same coordinate space — no scroll offsets to fold in. */
  const rect = anchor?.getBoundingClientRect();
  if (!rect) {
    /* Anchorless popover (e.g. opened from script): park it at the last pointer. */
    const left = Math.min(Math.max(edge, popoverPointer.x), viewportW - width - edge);
    const top = Math.min(Math.max(edge, popoverPointer.y + 4), viewportH - height - edge);
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
    return;
  }

  const fits = (s: string): boolean => {
    if (s === 'bottom') return rect.bottom + gap + height <= viewportH - edge;
    if (s === 'top') return rect.top - gap - height >= edge;
    if (s === 'end') return rect.right + gap + width <= viewportW - edge;
    if (s === 'start') return rect.left - gap - width >= edge;
    return true;
  };

  /* Flip to the first side with room: preferred → opposite → sides → keep. */
  const opposite: Record<string, string> = { bottom: 'top', top: 'bottom', end: 'start', start: 'end' };
  const order = [side, opposite[side] ?? 'bottom', 'end', 'start', 'bottom'];
  side = order.find(fits) ?? 'bottom';

  let left = rect.left;
  let top = rect.top;
  if (side === 'bottom' || side === 'top') {
    top = side === 'bottom' ? rect.bottom + gap : rect.top - gap - height;
    left = align === 'end' ? rect.right - width : align === 'center' ? rect.left + (rect.width - width) / 2 : rect.left;
  } else {
    left = side === 'end' ? rect.right + gap : rect.left - gap - width;
    top = align === 'end' ? rect.bottom - height : align === 'center' ? rect.top + (rect.height - height) / 2 : rect.top;
  }

  /* Keep the panel inside the viewport along the cross axis. */
  left = Math.min(Math.max(edge, left), viewportW - width - edge);
  top = Math.min(Math.max(edge, top), viewportH - height - edge);

  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
  /* Reflect the resolved side (and any alignment) back for inspection. */
  popover.dataset.zakPlacement = align === 'start' ? side : `${side}-${align}`;
}

/* Document-level toggle listener for ALL [popover] elements. The `toggle` event
   does not bubble, so the listener runs in the capture phase. */
document.addEventListener('toggle', (event) => {
  if (!isElement(event.target)) return;
  const popover = event.target;
  if (!popover.hasAttribute('popover')) return;

  const toggleEvent = event as Event & { newState?: string; relatedTarget?: Element | null };
  if (toggleEvent.newState !== 'open') return;

  const invoker =
    toggleEvent.relatedTarget ??
    (popover.id ? document.querySelector<HTMLElement>(`[popovertarget="${popover.id}"]`) : null) ??
    document.querySelector<HTMLElement>(`[data-zak-popover-trigger="${popover.id}"]`);

  /* Position once the open styles (and therefore the real box) have applied. */
  const place = (): void => {
    if (isHTMLElement(popover)) positionPopover(popover, invoker);
  };
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(place);
  }
  window.requestAnimationFrame(place);
}, true);

/* ========================================================================
   Context menus — document-level delegation
   ======================================================================== */

let contextReturnFocus: HTMLElement | null = null;

function hideContextMenu(menu: HTMLElement, restoreFocus = true): void {
  if (menu.hidden) return;
  menu.hidden = true;
  if (restoreFocus && contextReturnFocus && document.contains(contextReturnFocus)) {
    contextReturnFocus.focus();
  }
  contextReturnFocus = null;
}

function openContextMenu(
  menu: HTMLElement,
  x: number,
  y: number,
  focusFrom: HTMLElement | null,
): void {
  contextReturnFocus = focusFrom;
  menu.hidden = false;

  const rect = menu.getBoundingClientRect();
  const left = Math.min(Math.max(8, x), window.innerWidth - rect.width - 8);
  const top = Math.min(Math.max(8, y), window.innerHeight - rect.height - 8);
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;

  menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
}

/* Context zone triggers — right-click, Shift+F10, click on [data-zak-context-trigger] */
document.addEventListener('contextmenu', (event) => {
  if (!isElement(event.target)) return;
  const zone = event.target.closest<HTMLElement>('[data-zak-context]');
  if (!zone) return;

  const menuId = zone.dataset.zakContext;
  const menu = menuId ? document.getElementById(menuId) : null;
  if (!menu || !menu.classList.contains('zak-context-menu')) return;

  event.preventDefault();
  openContextMenu(menu, event.clientX, event.clientY, null);
});

document.addEventListener('keydown', (event) => {
  if (!(event.target instanceof Element)) return;
  const isMenuKey = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');
  if (!isMenuKey) return;

  const zone = event.target.closest<HTMLElement>('[data-zak-context]');
  if (!zone) return;

  const menuId = zone.dataset.zakContext;
  const menu = menuId ? document.getElementById(menuId) : null;
  if (!menu || !menu.classList.contains('zak-context-menu')) return;

  event.preventDefault();
  const anchor =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-zak-context-trigger]')
      : null;
  const rect = (anchor ?? zone).getBoundingClientRect();
  openContextMenu(menu, rect.left, rect.bottom + 6, anchor);
});

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const trigger = event.target.closest<HTMLElement>('[data-zak-context-trigger]');
  if (!trigger) return;

  const zone = trigger.closest<HTMLElement>('[data-zak-context]');
  if (!zone) return;

  const menuId = zone.dataset.zakContext;
  const menu = menuId ? document.getElementById(menuId) : null;
  if (!menu || !menu.classList.contains('zak-context-menu')) return;

  const rect = trigger.getBoundingClientRect();
  openContextMenu(menu, rect.left, rect.bottom + 6, trigger);
});

/* Context menu internal keyboard navigation */
document.addEventListener('keydown', (event) => {
  if (!(event.target instanceof Element)) return;
  const menu = event.target.closest<HTMLElement>('.zak-context-menu');
  if (!menu) return;

  const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  if (!items.length) return;
  const current = items.findIndex((item) => item === document.activeElement);

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    items[(current + delta + items.length) % items.length]?.focus();
  } else if (event.key === 'Home') {
    event.preventDefault();
    items[0]?.focus();
  } else if (event.key === 'End') {
    event.preventDefault();
    items[items.length - 1]?.focus();
  } else if (event.key === 'Escape') {
    hideContextMenu(menu);
  } else if (event.key === 'Tab') {
    hideContextMenu(menu, false);
  }
});

/* Context menu item click */
document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const menu = event.target.closest<HTMLElement>('.zak-context-menu');
  if (menu && event.target.closest('[role="menuitem"]')) {
    hideContextMenu(menu, false);
  }
});

/* Click outside closes context menus */
document.addEventListener('pointerdown', (event) => {
  if (!isElement(event.target)) return;
  if (event.target.closest('[data-zak-context-trigger]')) return;
  document.querySelectorAll<HTMLElement>('.zak-context-menu').forEach((menu) => {
    if (!menu.hidden && !menu.contains(event.target as Node)) hideContextMenu(menu, false);
  });
});