/**
 * ZAKUIKit Docs — media runtime: gallery lightbox, carousel, crossfade
 * slider, poster-first video and the audio row toggle.
 *
 * Stateless affordances (gallery tiles, video posters) ride document-level
 * delegation; stateful widgets (carousel, slider, audio) initialise
 * element-scoped behind a `data-zak-ready` guard and re-run on the
 * 'zak:refresh' event the playground dispatches after every re-render.
 *
 * No innerHTML sinks: the lightbox clones existing nodes and everything else
 * is built with createElement.
 */
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

/* ---- Gallery → shared lightbox with prev / next --------------------------- */

interface LightboxState {
  items: HTMLElement[];
  index: number;
}

const lightboxStates = new WeakMap<HTMLDialogElement, LightboxState>();

function renderLightboxItem(lightbox: HTMLDialogElement, state: LightboxState): void {
  const item = state.items[state.index];
  if (!item) return;
  const artwork = item.querySelector('.zak-img-ph, img');
  const stage = lightbox.querySelector<HTMLElement>('[data-lightbox-stage]');
  if (artwork && stage) stage.replaceChildren(artwork.cloneNode(true));
  const caption = lightbox.querySelector<HTMLElement>('[data-lightbox-caption]');
  if (caption) {
    const label = item.getAttribute('aria-label') ?? '';
    const text = label.replace(/^Open image\s*—\s*/, '');
    caption.textContent =
      state.items.length > 1 ? `${text} · ${state.index + 1} of ${state.items.length}` : text;
  }
}

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const item = event.target.closest<HTMLElement>('[data-gallery-item]');
  if (!item) return;

  // One dialog serves the whole grid — find it in the same demo stage.
  const scope: ParentNode = item.closest('.doc-demo__stage') ?? document;
  const lightbox = scope.querySelector<HTMLDialogElement>('dialog.zak-lightbox');
  if (!(lightbox instanceof HTMLDialogElement)) return;

  const items = Array.from(scope.querySelectorAll<HTMLElement>('[data-gallery-item]'));
  const state: LightboxState = { items, index: Math.max(0, items.indexOf(item)) };
  lightboxStates.set(lightbox, state);
  renderLightboxItem(lightbox, state);

  if (!lightbox.open) lightbox.showModal();
});

/* Prev / next — cycles the gallery set with wraparound. */
document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const btn = event.target.closest<HTMLElement>('[data-lightbox-prev], [data-lightbox-next]');
  if (!btn) return;
  const lightbox = btn.closest<HTMLDialogElement>('dialog.zak-lightbox');
  if (!(lightbox instanceof HTMLDialogElement)) return;
  const state = lightboxStates.get(lightbox);
  if (!state || state.items.length === 0) return;
  const dir = btn.hasAttribute('data-lightbox-next') ? 1 : -1;
  state.index = (state.index + dir + state.items.length) % state.items.length;
  renderLightboxItem(lightbox, state);
});

/* Arrow-key traversal while the lightbox is open. */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  const lightbox = document.querySelector<HTMLDialogElement>('dialog.zak-lightbox[open]');
  if (!(lightbox instanceof HTMLDialogElement)) return;
  const state = lightboxStates.get(lightbox);
  if (!state || state.items.length < 2) return;
  event.preventDefault();
  const dir = event.key === 'ArrowRight' ? 1 : -1;
  state.index = (state.index + dir + state.items.length) % state.items.length;
  renderLightboxItem(lightbox, state);
});

/* ---- Carousel: transform-based owl-style engine ---------------------------- */
/* A native reimplementation of an owl-style slider surface: `items` (fixed or
   per-breakpoint), `loop`, `nav`, `dots`, `slideBy` (count / 'page'), `autoplay`
   with hover-pause, pointer `drag` with velocity snap, `lazyLoad` and a `margin`
   gutter. The track is translated with `transform: translate3d`, never scrolled.
   Options arrive either as `data-zak-carousel='{…}'` JSON or via the imperative
   `new ZakCarousel(el, options)` API. Fires `zak:changed` / `zak:translated`. */

export interface ZakCarouselOptions {
  /** Visible items — a fixed count, or a `{ breakpointMin: count }` map. */
  items?: number | Record<string, number>;
  /** Wrap from the last stop to the first (and back) instead of clamping. */
  loop?: boolean;
  /** Show prev / next arrows. */
  nav?: boolean;
  /** Show position dots (one per reachable stop). */
  dots?: boolean;
  /** Advance by this many items, or a whole page. */
  slideBy?: number | 'page';
  /** Auto-advance on a timer. */
  autoplay?: boolean;
  /** Milliseconds between auto-advances. */
  autoplayTimeout?: number;
  /** Pause autoplay while the pointer is over the carousel. */
  autoplayHoverPause?: boolean;
  /** Enable pointer drag / swipe with velocity snap. */
  drag?: boolean;
  /** Assign `img[data-zak-src]` when its slide enters the viewport set. */
  lazyLoad?: boolean;
  /** Gutter between items, in pixels. */
  margin?: number;
}

interface ResolvedOptions {
  items: number | Record<string, number>;
  loop: boolean;
  nav: boolean;
  dots: boolean;
  slideBy: number | 'page';
  autoplay: boolean;
  autoplayTimeout: number;
  autoplayHoverPause: boolean;
  drag: boolean;
  lazyLoad: boolean;
  margin: number;
}

const CAROUSEL_DEFAULTS: ResolvedOptions = {
  items: 1,
  loop: false,
  nav: true,
  dots: true,
  slideBy: 1,
  autoplay: false,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  drag: true,
  lazyLoad: false,
  margin: 0,
};

const clampNum = (n: number, lo: number, hi: number): number => Math.min(Math.max(n, lo), hi);

export class ZakCarousel {
  readonly element: HTMLElement;
  private readonly track: HTMLElement;
  private readonly slides: HTMLElement[];
  private readonly opts: ResolvedOptions;
  private index = 0;
  private itemsPerView = 1;
  private step = 0;
  private maxIndex = 0;
  private dotsWrap: HTMLElement | null = null;
  private navPrev: HTMLElement | null = null;
  private navNext: HTMLElement | null = null;
  private timer = 0;
  private ro: ResizeObserver | null = null;
  private dragging = false;
  private startX = 0;
  private startT = 0;
  private baseTranslate = 0;
  private lastDx = 0;

  constructor(element: HTMLElement, options: ZakCarouselOptions = {}) {
    const track = element.querySelector<HTMLElement>('.zak-carousel__track, [data-carousel-track]');
    if (!track) throw new Error('ZakCarousel: no .zak-carousel__track found inside the element');
    this.element = element;
    this.track = track;
    this.slides = Array.from(track.children) as HTMLElement[];
    this.opts = { ...CAROUSEL_DEFAULTS, ...options };

    this.buildControls();
    this.layout();
    this.translate(false);
    this.bindDrag();
    this.bindHover();
    this.startAutoplay();

    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(this.element);
    } else {
      window.addEventListener('resize', () => this.onResize());
    }
  }

  /** Current left-most visible item index. */
  get current(): number {
    return this.index;
  }

  private slideSize(): number {
    return this.opts.slideBy === 'page' ? this.itemsPerView : clampNum(this.opts.slideBy, 1, this.slides.length);
  }

  private resolveItems(): number {
    const it = this.opts.items;
    if (typeof it === 'number') return clampNum(it, 1, this.slides.length);
    const width = this.element.clientWidth || this.track.clientWidth;
    const keys = Object.keys(it)
      .map(Number)
      .sort((a, b) => a - b);
    if (keys.length === 0) return 1;
    let val = it[String(keys[0])] ?? 1;
    for (const k of keys) if (width >= k) val = it[String(k)];
    return clampNum(val, 1, this.slides.length);
  }

  private layout(): void {
    const items = this.resolveItems();
    this.itemsPerView = items;
    const margin = this.opts.margin;
    const trackW = this.track.clientWidth || this.element.clientWidth;
    const itemW = (trackW - margin * (items - 1)) / items;
    this.step = itemW + margin;
    for (const s of this.slides) {
      s.style.flex = `0 0 ${itemW}px`;
      s.style.marginRight = `${margin}px`;
    }
    this.maxIndex = Math.max(0, this.slides.length - items);
    this.index = clampNum(this.index, 0, this.maxIndex);
  }

  private translate(animate: boolean): void {
    const x = -(this.index * this.step);
    const dur = animate && !prefersReducedMotion();
    this.track.style.transition = dur ? 'transform var(--zak-duration-base) var(--zak-ease-standard)' : 'none';
    this.track.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  private go(index: number, animate = true): void {
    let target = index;
    if (this.opts.loop) {
      if (target > this.maxIndex) target = 0;
      else if (target < 0) target = this.maxIndex;
    } else {
      target = clampNum(target, 0, this.maxIndex);
    }
    const changed = target !== this.index;
    this.index = target;
    this.translate(animate);
    this.syncDots();
    this.syncNav();
    this.revealLazy();
    if (changed) this.emit('zak:changed');
    this.emit('zak:translated');
  }

  private emit(name: string): void {
    this.element.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        detail: { index: this.index, count: this.slides.length, items: this.itemsPerView },
      }),
    );
  }

  private buildControls(): void {
    let prev = this.element.querySelector<HTMLElement>('[data-carousel-prev]');
    let next = this.element.querySelector<HTMLElement>('[data-carousel-next]');
    if (this.opts.nav && !prev && !next && this.slides.length > 1) {
      prev = document.createElement('button');
      prev.setAttribute('type', 'button');
      prev.className = 'zak-carousel__btn zak-carousel__btn--prev';
      prev.setAttribute('data-carousel-prev', '');
      prev.setAttribute('aria-label', 'Previous slide');
      prev.textContent = '‹';
      next = document.createElement('button');
      next.setAttribute('type', 'button');
      next.className = 'zak-carousel__btn zak-carousel__btn--next';
      next.setAttribute('data-carousel-next', '');
      next.setAttribute('aria-label', 'Next slide');
      next.textContent = '›';
      this.element.append(prev, next);
    }
    if (!this.opts.nav) {
      prev?.remove();
      next?.remove();
      prev = null;
      next = null;
    }
    prev?.addEventListener('click', () => this.go(this.index - this.slideSize()));
    next?.addEventListener('click', () => this.go(this.index + this.slideSize()));
    this.navPrev = prev;
    this.navNext = next;

    if (this.opts.dots) {
      let wrap = this.element.querySelector<HTMLElement>('.zak-carousel__dots, [data-carousel-dots]');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'zak-carousel__dots';
        wrap.setAttribute('data-carousel-dots', '');
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-label', 'Slide position');
        this.element.append(wrap);
      }
      this.dotsWrap = wrap;
      this.buildDots();
    } else {
      this.element.querySelector('.zak-carousel__dots')?.remove();
    }
  }

  private buildDots(): void {
    const wrap = this.dotsWrap;
    if (!wrap) return;
    const count = this.maxIndex + 1;
    if (wrap.children.length !== count) {
      wrap.replaceChildren();
      for (let i = 0; i < count; i += 1) {
        const b = document.createElement('button');
        b.setAttribute('type', 'button');
        b.className = 'zak-carousel__dot';
        b.setAttribute('data-carousel-dot', '');
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => this.go(i));
        wrap.append(b);
      }
    }
    this.syncDots();
  }

  private syncDots(): void {
    if (!this.dotsWrap) return;
    Array.from(this.dotsWrap.children).forEach((dot, i) => dot.classList.toggle('is-active', i === this.index));
  }

  private syncNav(): void {
    if (this.opts.loop) return;
    if (this.navPrev) (this.navPrev as HTMLButtonElement).disabled = this.index <= 0;
    if (this.navNext) (this.navNext as HTMLButtonElement).disabled = this.index >= this.maxIndex;
  }

  private revealLazy(): void {
    if (!this.opts.lazyLoad) return;
    for (let i = this.index; i < this.index + this.itemsPerView; i += 1) {
      const slide = this.slides[i];
      if (!slide) continue;
      slide.querySelectorAll<HTMLImageElement>('img[data-zak-src]').forEach((img) => {
        if (!img.getAttribute('src') && img.dataset.zakSrc) {
          img.src = img.dataset.zakSrc;
          img.removeAttribute('data-zak-src');
        }
      });
      slide.classList.add('is-loaded');
    }
  }

  private startAutoplay(): void {
    if (!this.opts.autoplay || this.timer) return;
    this.timer = window.setInterval(() => this.go(this.index + 1), this.opts.autoplayTimeout);
  }

  private stopAutoplay(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = 0;
    }
  }

  private bindHover(): void {
    if (!this.opts.autoplay || !this.opts.autoplayHoverPause) return;
    this.element.addEventListener('pointerenter', () => this.stopAutoplay());
    this.element.addEventListener('pointerleave', () => this.startAutoplay());
  }

  private bindDrag(): void {
    if (!this.opts.drag) return;
    const t = this.track;
    t.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (this.slides.length <= this.itemsPerView) return;
      this.dragging = true;
      this.lastDx = 0;
      this.stopAutoplay();
      this.startX = e.clientX;
      this.startT = Date.now();
      this.baseTranslate = -(this.index * this.step);
      t.classList.add('is-dragging');
      t.setPointerCapture?.(e.pointerId);
    });
    t.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.startX;
      this.lastDx = dx;
      t.style.transition = 'none';
      t.style.transform = `translate3d(${this.baseTranslate + dx}px, 0, 0)`;
    });
    const end = (e: PointerEvent) => {
      if (!this.dragging) return;
      this.dragging = false;
      t.classList.remove('is-dragging');
      t.releasePointerCapture?.(e.pointerId);
      const dt = Math.max(Date.now() - this.startT, 1);
      const v = this.lastDx / dt;
      const s = this.step || 1;
      let target = this.index;
      if (this.lastDx <= -s * 0.25 || v <= -0.4) target = this.index + this.slideSize();
      else if (this.lastDx >= s * 0.25 || v >= 0.4) target = this.index - this.slideSize();
      this.go(target);
      if (this.opts.autoplay) this.startAutoplay();
    };
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
  }

  private onResize(): void {
    if (!this.element.isConnected) {
      this.ro?.disconnect();
      return;
    }
    this.layout();
    this.buildDots();
    this.translate(false);
  }

  /** Move to an absolute stop index. */
  to(index: number): this {
    this.go(index);
    return this;
  }

  next(): this {
    this.go(this.index + this.slideSize());
    return this;
  }

  prev(): this {
    this.go(this.index - this.slideSize());
    return this;
  }

  destroy(): void {
    this.stopAutoplay();
    this.ro?.disconnect();
  }
}

const carouselInstances = new WeakMap<HTMLElement, ZakCarousel>();

function initCarousel(root: HTMLElement): void {
  if (isReady(root)) return;
  if (!root.querySelector('.zak-carousel__track, [data-carousel-track]')) return;
  const raw = root.getAttribute('data-zak-carousel') ?? '';
  const trimmed = raw.trim();
  let options: ZakCarouselOptions = {};
  if (trimmed.startsWith('{')) {
    try {
      options = JSON.parse(trimmed) as ZakCarouselOptions;
    } catch {
      options = {};
    }
  }
  markReady(root);
  const mount = (): void => {
    carouselInstances.set(root, new ZakCarousel(root, options));
  };
  // Defer the first layout until the element has a measurable width.
  if (root.clientWidth > 0) mount();
  else window.requestAnimationFrame(mount);
}

/* ---- Slider: crossfade slideshow with wrap-around --------------------------- */

function initSlider(root: HTMLElement): void {
  if (isReady(root)) return;
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slider-slide]'));
  if (slides.length === 0) return;
  markReady(root);

  const counter = root.querySelector<HTMLElement>('[data-slider-counter]');
  const prev = root.querySelector<HTMLButtonElement>('[data-slider-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-slider-next]');

  let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (current < 0) current = 0;

  const show = (index: number): void => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  };

  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  show(current); // normalise the counter against the active slide
}

/* ---- Video: poster → real player -------------------------------------------- */

document.addEventListener('click', (event) => {
  if (!isElement(event.target)) return;
  const overlay = event.target.closest<HTMLElement>('[data-video-overlay]');
  if (!overlay) return;

  const shell = overlay.closest<HTMLElement>('[data-zak-video]');
  const source = overlay.dataset.src ?? shell?.dataset.src;
  if (!source) {
    toast('This demo video has no source — point data-src at a real file to play.', 'info');
    return;
  }

  const video = document.createElement('video');
  video.src = source;
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  overlay.replaceWith(video);
});

/* ---- Audio row toggle --------------------------------------------------------- */

function initAudio(root: HTMLElement): void {
  if (isReady(root)) return;
  const toggle = root.querySelector<HTMLButtonElement>('[data-zak-audio-toggle]');
  if (!toggle) return;
  markReady(root);

  const playIcon = toggle.querySelector<HTMLElement>('[data-audio-play]');
  const pauseIcon = toggle.querySelector<HTMLElement>('[data-audio-pause]');

  toggle.addEventListener('click', () => {
    const playing = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(playing));
    root.classList.toggle('is-playing', playing);
    if (playIcon) playIcon.hidden = playing;
    if (pauseIcon) pauseIcon.hidden = !playing;

    const label = toggle.getAttribute('aria-label') ?? '';
    toggle.setAttribute(
      'aria-label',
      playing ? label.replace(/^Play/, 'Pause') : label.replace(/^Pause/, 'Play'),
    );
  });
}

/* ---- Boot + playground re-init ------------------------------------------------ */

function initMedia(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-zak-carousel]').forEach(initCarousel);
  root.querySelectorAll<HTMLElement>('[data-zak-slider]').forEach(initSlider);
  root.querySelectorAll<HTMLElement>('[data-zak-audio]').forEach(initAudio);
}

initMedia(document);
document.addEventListener('zak:refresh', () => initMedia(document));
