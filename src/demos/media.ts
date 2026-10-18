/**
 * Demos — Media: images, gallery + lightbox, carousel, slider, video, audio
 * and the media object. Gradient placeholders stand in for real assets.
 *
 * Every demo renders as a static preview card (`playground` defaults to the
 * preview + code card) and ships a curated `codeTpl` that demonstrates each
 * entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const imageI = svgIcon('image', 'zak-icon', 24);
const eyeI = svgIcon('eye', 'zak-icon', 14);
const playI = svgIcon('play', 'zak-icon', 16);
const pauseI = svgIcon('pause', 'zak-icon', 16);
const chevLeft = svgIcon('chevron-left', 'zak-icon', 16);
const chevRight = svgIcon('chevron-right', 'zak-icon', 16);
const copyI = svgIcon('copy', 'zak-icon', 14);
const downloadI = svgIcon('download', 'zak-icon', 14);
const xI = svgIcon('x', 'zak-icon', 15);
const micI = svgIcon('mic', 'zak-icon', 18);
const clockI = svgIcon('clock', 'zak-icon', 12);

const ph = (mod = '', icon = imageI, label = '') =>
  `<span class="zak-img-ph${mod}" style="width:100%;height:100%"><span style="display:flex;flex-direction:column;align-items:center;gap:var(--zak-space-2);pointer-events:none">${icon}${label ? `<span style="font-size:var(--zak-text-xs);font-weight:var(--zak-weight-semibold);letter-spacing:0.02em">${label}</span>` : ''}</span></span>`;

export const mediaDemos: Record<string, DemoDef> = {
  image: defineDemo({
    desc: 'Content images in the four shipped treatments: base, rounded, bordered and hover-zoom — plus the circular crop. Figures pair the image with a caption line.',
    playground: false,
    stage: 'stretch',
    tpl: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));gap:var(--zak-space-4);width:100%;max-width:42rem">
    <figure class="zak-img-caption" style="margin:0">
      <span class="zak-img" style="aspect-ratio:4/3;overflow:hidden;display:block">${ph('', imageI)}</span>
      <figcaption>Default · radius md</figcaption>
    </figure>
    <figure class="zak-img-caption" style="margin:0">
      <span class="zak-img zak-img--rounded zak-img--bordered" style="aspect-ratio:4/3;overflow:hidden;display:block">${ph(' zak-img-ph--cool', imageI)}</span>
      <figcaption>Rounded + bordered</figcaption>
    </figure>
    <figure class="zak-img-caption" style="margin:0">
      <span class="zak-img zak-img--bordered zak-img--zoom" style="aspect-ratio:4/3;overflow:hidden;display:block">${ph(' zak-img-ph--alt', imageI)}</span>
      <figcaption>Hover-zoom · try it</figcaption>
    </figure>
    <figure class="zak-img-caption" style="margin:0;align-items:center">
      <span class="zak-img zak-img--circle zak-img--bordered" style="width:7rem;overflow:hidden;display:block">${ph(' zak-img-ph--green', svgIcon('user', 'zak-icon', 26))}</span>
      <figcaption>Circle crop</figcaption>
    </figure>
  </div>`,
    codeTpl: `<!-- Base: block, max-width 100%, radius md -->
<img class="zak-img" src="hero.webp" alt="Launch keynote hero" width="960" height="720"/>

<!-- Rounded (radius lg) + bordered (hairline + shadow) -->
<img class="zak-img zak-img--rounded zak-img--bordered"
     src="card.webp" alt="Product still" width="640" height="480"/>

<!-- Hover-zoom: scales 1.03 with cursor: zoom-in -->
<img class="zak-img zak-img--zoom" src="scene.webp" alt="Night city long exposure"
     width="800" height="600"/>

<!-- Circular crop: aspect-ratio 1, object-fit cover -->
<img class="zak-img zak-img--circle" src="avatar.webp" alt="Ada Chen"
     width="240" height="240"/>

<!-- Figure pairs the image with a caption line -->
<figure class="zak-img-caption">
  <img class="zak-img" src="chart.webp" alt="Revenue by quarter"/>
  <figcaption>Revenue by quarter — FY26</figcaption>
</figure>`,
    props: [
      ['.zak-img', 'class', '—', 'display:block, max-width:100%, radius md — the safe default.'],
      ['.zak-img--rounded / --bordered', 'modifier', '—', 'Radius lg, and a hairline border with a small shadow.'],
      ['.zak-img--zoom', 'modifier', '—', 'Scales 1.03 with a deeper shadow on hover; cursor: zoom-in.'],
      ['.zak-img--circle', 'modifier', '50%', 'Circular crop with aspect-ratio 1 and object-fit cover.'],
      ['.zak-img-caption', 'element', '—', 'Caption stack in the tertiary text tone.'],
    ],
    a11y: {
      aria: [
        ['alt', 'Required for meaningful images; empty alt="" for purely decorative ones.'],
        ['width / height', 'Always set both to reserve space and prevent layout shift.'],
      ],
    },
  }),
  'image-gallery': defineDemo({
    desc: 'An auto-filling grid of thumbnails with a zoom cue on hover. Clicking a tile opens the shared lightbox dialog — one dialog serves every image, and prev/next arrows plus the arrow keys cycle the whole set.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-gallery" data-zak-gallery style="width:100%;max-width:42rem">
    <button class="zak-gallery__item" type="button" aria-label="Open image — Aurora over the fjord" data-gallery-item>${ph(' zak-img-ph--cool', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
    <button class="zak-gallery__item" type="button" aria-label="Open image — Dunes at golden hour" data-gallery-item>${ph(' zak-img-ph--alt', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
    <button class="zak-gallery__item" type="button" aria-label="Open image — Reef survey drone shot" data-gallery-item>${ph(' zak-img-ph--green', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
    <button class="zak-gallery__item" type="button" aria-label="Open image — Studio product still" data-gallery-item>${ph('', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
    <button class="zak-gallery__item" type="button" aria-label="Open image — Night city long exposure" data-gallery-item>${ph(' zak-img-ph--cool', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
    <button class="zak-gallery__item" type="button" aria-label="Open image — Alpine trailhead" data-gallery-item>${ph(' zak-img-ph--green', imageI)}<span class="zak-gallery__zoom">${eyeI}</span></button>
  </div>

  <dialog class="zak-lightbox" id="demo-lightbox" aria-label="Image preview">
    <div class="zak-lightbox__figure">
      <div class="zak-lightbox__stage" data-lightbox-stage>${ph(' zak-img-ph--cool', imageI)}</div>
      <button class="zak-lightbox__btn zak-lightbox__btn--prev" type="button" aria-label="Previous image" data-lightbox-prev>${chevLeft}</button>
      <button class="zak-lightbox__btn zak-lightbox__btn--next" type="button" aria-label="Next image" data-lightbox-next>${chevRight}</button>
    </div>
    <div class="zak-lightbox__bar">
      <span data-lightbox-caption>Select a tile to preview</span>
      <span style="display:flex;gap:var(--zak-space-2)">
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Download image" style="color:inherit">${downloadI}</button>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close preview" style="color:inherit" data-zak-close>${xI}</button>
      </span>
    </div>
  </dialog>`,
    codeTpl: `<!-- Delegation root; each tile carries data-gallery-item -->
<div class="zak-gallery" data-zak-gallery>
  <button class="zak-gallery__item" type="button" aria-label="Open image — Aurora over the fjord" data-gallery-item>
    <img class="zak-img" src="aurora.webp" alt="Aurora over the fjord"/>
    <!-- Zoom cue fades in with the hover veil -->
    <span class="zak-gallery__zoom">🔍</span>
  </button>
  <button class="zak-gallery__item" type="button" aria-label="Open image — Dunes at golden hour" data-gallery-item>
    <img class="zak-img" src="dunes.webp" alt="Dunes at golden hour"/>
    <span class="zak-gallery__zoom">🔍</span>
  </button>
  <!-- Auto-fill grid: minmax(140px, 1fr) tiles keep their 4:3 frame -->
</div>

<!-- One shared lightbox dialog serves the whole grid -->
<dialog class="zak-lightbox" aria-label="Image preview">
  <div class="zak-lightbox__figure">
    <div class="zak-lightbox__stage" data-lightbox-stage></div>
    <!-- prev/next cycle the set; arrows sit on the image edges, vertically centred -->
    <button class="zak-lightbox__btn zak-lightbox__btn--prev" type="button" aria-label="Previous image" data-lightbox-prev>‹</button>
    <button class="zak-lightbox__btn zak-lightbox__btn--next" type="button" aria-label="Next image" data-lightbox-next>›</button>
  </div>
  <div class="zak-lightbox__bar">
    <span data-lightbox-caption>Select a tile to preview</span>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close preview" data-zak-close>✕</button>
  </div>
</dialog>`,
    js: `// One dialog serves the whole grid — no per-image overlays
grid.addEventListener('click', (e) => {
  const item = e.target.closest('[data-gallery-item]');
  if (!item) return;

  // Snapshot the whole set so prev/next can cycle it
  const items = [...scope.querySelectorAll('[data-gallery-item]')];
  state = { items, index: items.indexOf(item) };

  // Safe DOM swap — clone the artwork, no HTML parsing
  stage.replaceChildren(items[state.index].querySelector('.zak-img-ph').cloneNode(true));
  lightbox.showModal();
});

// Arrows (and ← / → while open) wrap around the set
next.addEventListener('click', () => show(state.index + 1));
prev.addEventListener('click', () => show(state.index - 1));
const show = (i) => {
  state.index = (i + state.items.length) % state.items.length;
  /* …re-clone the artwork + caption… */
};`,
    props: [
      ['data-zak-gallery', 'attr', '—', 'Delegation root; tiles carry data-gallery-item.'],
      ['auto-fill grid', 'css', '—', 'minmax(140px, 1fr) tiles keep their 4:3 frame.'],
      ['.zak-gallery__zoom', 'element', '—', 'Circular cue fades in with the hover veil.'],
      ['.zak-lightbox', 'dialog', '—', 'Shared preview dialog; ::backdrop darkens to 0.82.'],
      ['.zak-lightbox__figure', 'element', '—', 'Centred frame clamped to the viewport; the stage sits inside it.'],
      ['[data-lightbox-prev / -next]', 'attr', '—', 'Edge arrows cycle the gallery set with wraparound.'],
      ['data-lightbox-caption', 'attr', '—', 'Filled from the tile aria-label, with an “n of total” counter.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Opens the focused tile in the lightbox.'],
        ['← / →', 'While the lightbox is open, steps through the gallery set.'],
        ['Esc', 'Closes the lightbox and returns focus to the tile.'],
      ],
      aria: [
        ['aria-label per tile', 'Describes the image — doubles as the lightbox caption.'],
        ['dialog + modal', 'Focus is contained while the preview is open.'],
      ],
    },
  }),
  'image-preview': defineDemo({
    desc: 'The single-asset viewer: a zoom-in thumbnail with an asset card, opening the lightbox for full-size inspection with download in reach.',
    playground: false,
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:34rem">
    <figure class="zak-img-caption" style="margin:0">
      <span class="zak-img zak-img--rounded zak-img--bordered zak-img--zoom" style="aspect-ratio:16/9;overflow:hidden;display:block" data-zak-toggle="modal" data-zak-target="#demo-preview">${ph(' zak-img-ph--alt', imageI)}</span>
      <div class="zak-flex" style="align-items:center;gap:var(--zak-space-2);margin-block-start:var(--zak-space-3)">
        <span style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);color:var(--zak-text-primary)">june-launch-hero.png</span>
        <span style="font-size:var(--zak-text-xs)">2400 × 1350 · 1.2 MB</span>
        <span style="margin-inline-start:auto;display:flex;gap:var(--zak-space-2)">
          <button class="zak-btn zak-btn--outline zak-btn--sm" type="button" data-zak-toggle="modal" data-zak-target="#demo-preview">Preview</button>
          <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Copy link">${copyI}</button>
          <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Download">${downloadI}</button>
        </span>
      </div>
    </figure>
  </div>

  <dialog class="zak-lightbox" id="demo-preview" aria-label="Preview — june-launch-hero.png">
    <div class="zak-lightbox__stage">${ph(' zak-img-ph--alt', imageI)}</div>
    <div class="zak-lightbox__bar">
      <span>june-launch-hero.png · 2400 × 1350</span>
      <span style="display:flex;gap:var(--zak-space-2)">
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="color:inherit">Copy link</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="color:inherit">Download PNG</button>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close preview" style="color:inherit" data-zak-close>${xI}</button>
      </span>
    </div>
  </dialog>`,
    codeTpl: `<!-- The thumbnail itself is the trigger — cursor: zoom-in -->
<figure class="zak-img-caption">
  <img class="zak-img zak-img--rounded zak-img--bordered zak-img--zoom"
       src="june-launch-hero.png" alt="June launch hero"
       data-zak-toggle="modal" data-zak-target="#demo-preview"/>

  <!-- Asset facts + actions -->
  <div class="zak-flex" style="align-items:center;gap:var(--zak-space-2)">
    <span>june-launch-hero.png</span>
    <span>2400 × 1350 · 1.2 MB</span>
    <button class="zak-btn zak-btn--outline zak-btn--sm" type="button"
            data-zak-toggle="modal" data-zak-target="#demo-preview">Preview</button>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Copy link">🔗</button>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Download">⬇</button>
  </div>
</figure>

<!-- Lightbox: 16:9 stage + caption/actions bar -->
<dialog class="zak-lightbox" id="demo-preview" aria-label="Preview — june-launch-hero.png">
  <div class="zak-lightbox__stage"><img class="zak-img" src="june-launch-hero.png" alt=""/></div>
  <div class="zak-lightbox__bar">
    <span>june-launch-hero.png · 2400 × 1350</span>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Close preview" data-zak-close>✕</button>
  </div>
</dialog>`,
    props: [
      ['data-zak-toggle="modal"', 'attr', '—', 'The thumbnail itself is the trigger — cursor: zoom-in affordance.'],
      ['.zak-lightbox__stage', 'element', '—', '16:9 frame; swap its child when the asset changes.'],
      ['.zak-lightbox__bar', 'element', '—', 'Caption plus actions row under the stage.'],
      ['cursor: zoom-in', 'css', '—', 'Thumbnail clicks reuse the modal trigger contract; the Preview button is the keyboard path.'],
    ],
    notes: ['For photos, offer download in the bar — preview without an escape hatch forces users into screenshots.'],
  }),
  carousel: defineDemo({
    desc: "A transform-based slider engine with an owl-style API and zero dependencies: responsive `items`, `loop`, `nav` arrows, `dots`, `slideBy` (a count or \"page\"), `autoplay` with hover-pause, pointer `drag` with velocity snap, `lazyLoad` and a `margin` gutter. The track is translated with `transform`, never scrolled. Options arrive as `data-zak-carousel` JSON or through `new ZakUI.ZakCarousel(el, options)`.",
    playground: false,
    stage: 'stretch',
    usage: '<div class="zak-carousel" data-zak-carousel=\'{"items":2,"margin":12,"loop":true,"nav":true,"dots":true}\'>\n  <div class="zak-carousel__track">\n    <div class="zak-carousel__slide">…</div>\n    <div class="zak-carousel__slide">…</div>\n  </div>\n</div>',
    tpl: `<div class="zak-carousel" data-zak-carousel='{"loop":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', imageI, '01 · Design tokens')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('grid', 'zak-icon', 24), '02 · Data grid')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('brain', 'zak-icon', 24), '03 · AI surfaces')}</div>
    </div>
  </div>`,
    codeTpl: `<!-- Bare attribute = defaults: items 1, nav + dots + drag on, loop off -->
<div class="zak-carousel" data-zak-carousel>
  <div class="zak-carousel__track">
    <div class="zak-carousel__slide">01 · Design tokens</div>
    <div class="zak-carousel__slide">02 · Data grid</div>
    <div class="zak-carousel__slide">03 · AI surfaces</div>
  </div>
</div>

<!-- Every option is JSON on the same attribute; the runtime generates the
     prev/next arrows and dots, so the markup only needs the track + slides -->
<div class="zak-carousel"
     data-zak-carousel='{"items":3,"margin":12,"loop":true,"autoplay":true,"autoplayTimeout":3000,"slideBy":"page"}'>
  <div class="zak-carousel__track">
    <!-- slides… -->
  </div>
</div>`,
    js: `// Declarative — JSON on the attribute, auto-initialised on load and re-run after every playground render.
// <div class="zak-carousel" data-zak-carousel='{"items":2,"slideBy":"page","dots":false}'>…</div>

// Imperative — the class is exposed on the global API.
const car = new ZakUI.ZakCarousel(el, {
  items: { 0: 1, 560: 2, 880: 3 },   // responsive: min container width → items
  loop: true,
  margin: 16,
  autoplay: true,
  autoplayTimeout: 4000,
  autoplayHoverPause: true,
  drag: true,
});

car.next();
car.prev();
car.to(2);        // jump to a stop index
car.destroy();    // detach observers + timers

// The engine reports movement through bubbling custom events.
el.addEventListener('zak:changed', (e) => console.log('stop', e.detail.index));
el.addEventListener('zak:translated', (e) => console.log('translated', e.detail.items, 'visible'));`,
    examples: [
      {
        title: 'Multiple items',
        desc: '`items` shows several slides at once; `margin` is the pixel gutter and `slideBy:"page"` flips a whole view.',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"items":3,"margin":12,"slideBy":"page","loop":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', imageI, 'Alpha')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', imageI, 'Bravo')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', imageI, 'Charlie')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--alt', imageI, 'Delta')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', imageI, 'Echo')}</div>
    </div>
  </div>`,
        code: `<div class="zak-carousel" data-zak-carousel='{"items":3,"margin":12,"slideBy":"page","loop":true}'>
  <div class="zak-carousel__track">
    <div class="zak-carousel__slide">Alpha</div>
    <div class="zak-carousel__slide">Bravo</div>
    <div class="zak-carousel__slide">Charlie</div>
    <div class="zak-carousel__slide">Delta</div>
    <div class="zak-carousel__slide">Echo</div>
  </div>
</div>`,
      },
      {
        title: 'Responsive items',
        desc: '`items` as an object maps a minimum container width to a count — the engine relayouts on resize.',
        stage: 'stretch',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"items":{"0":1,"360":2,"640":3},"margin":12,"nav":true,"dots":true}' style="width:100%">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', svgIcon('layout', 'zak-icon', 22), 'Resize me')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('grid', 'zak-icon', 22), '1 → 2 → 3')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('responsive', 'zak-icon', 22), 'Mobile first')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--alt', svgIcon('monitor', 'zak-icon', 22), 'Desktop')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('window', 'zak-icon', 22), 'Tablet')}</div>
      <div class="zak-carousel__slide">${ph('', svgIcon('grid', 'zak-icon', 22), 'Wide')}</div>
    </div>
  </div>`,
        code: `<!-- keys are min-width breakpoints (px), values are item counts -->
<div class="zak-carousel" data-zak-carousel='{"items":{"0":1,"360":2,"640":3},"margin":12}'>
  <div class="zak-carousel__track">
    <div class="zak-carousel__slide">…</div>
  </div>
</div>`,
      },
      {
        title: 'Loop + autoplay',
        desc: '`loop` wraps last → first; `autoplay` advances on a timer and `autoplayHoverPause` holds it under the pointer.',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"loop":true,"autoplay":true,"autoplayTimeout":2500,"autoplayHoverPause":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('rocket', 'zak-icon', 26), 'Auto-advancing')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('zap', 'zak-icon', 26), 'Hover to pause')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--alt', svgIcon('arrow-right', 'zak-icon', 26), 'Loops forever')}</div>
    </div>
  </div>`,
        code: `<div class="zak-carousel"
     data-zak-carousel='{"loop":true,"autoplay":true,"autoplayTimeout":2500,"autoplayHoverPause":true}'>
  <div class="zak-carousel__track">…</div>
</div>`,
      },
      {
        title: 'Drag / swipe',
        desc: '`drag` (on by default) lets a pointer pull the track; release snaps by distance or flick velocity.',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"items":2,"margin":10,"drag":true,"loop":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', svgIcon('mouse-pointer', 'zak-icon', 24), 'Grab')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('mouse-pointer', 'zak-icon', 24), 'Drag')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('mouse-pointer', 'zak-icon', 24), 'Release')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--alt', svgIcon('mouse-pointer', 'zak-icon', 24), 'Snaps')}</div>
    </div>
  </div>`,
        code: `<!-- drag is on by default; set "drag":false to disable pointer swiping -->
<div class="zak-carousel" data-zak-carousel='{"items":2,"margin":10,"drag":true}'>
  <div class="zak-carousel__track">…</div>
</div>`,
      },
      {
        title: 'Lazy load',
        desc: '`lazyLoad` only assigns `img[data-zak-src]` when its slide scrolls into the visible set — here the cue is a placeholder label.',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"items":2,"margin":12,"lazyLoad":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', svgIcon('image', 'zak-icon', 24), 'Loaded now')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('image', 'zak-icon', 24), 'Loaded now')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('eye-off', 'zak-icon', 24), 'Loads on view')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--alt', svgIcon('eye-off', 'zak-icon', 24), 'Loads on view')}</div>
    </div>
  </div>`,
        code: `<div class="zak-carousel" data-zak-carousel='{"items":2,"lazyLoad":true}'>
  <div class="zak-carousel__track">
    <div class="zak-carousel__slide">
      <!-- src is withheld until the slide enters view, then moved from data-zak-src -->
      <img class="zak-img" data-zak-src="hero-04.webp" alt="Scene four"/>
    </div>
  </div>
</div>`,
      },
      {
        title: 'Arrows only (no dots)',
        desc: '`dots:false` drops the position dots; `nav` keeps the arrows. With one item, the engine clamps at the ends unless `loop` is on.',
        tpl: `<div class="zak-carousel" data-zak-carousel='{"dots":false,"nav":true}' style="width:100%;max-width:42rem">
    <div class="zak-carousel__track">
      <div class="zak-carousel__slide">${ph('', svgIcon('chevron-left', 'zak-icon', 24), 'Step 1 of 3')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--cool', svgIcon('arrow-right', 'zak-icon', 24), 'Step 2 of 3')}</div>
      <div class="zak-carousel__slide">${ph(' zak-img-ph--green', svgIcon('check-circle', 'zak-icon', 24), 'Step 3 of 3')}</div>
    </div>
  </div>`,
        code: `<div class="zak-carousel" data-zak-carousel='{"dots":false,"nav":true}'>
  <div class="zak-carousel__track">…</div>
</div>`,
      },
    ],
    props: [
      ['data-zak-carousel', 'attr', '{…}', 'JSON options on the element; a bare attribute uses every default.'],
      ['items', 'number | {breakpoint: number}', '1', 'Visible items — fixed, or keyed by minimum container width.'],
      ['loop', 'boolean', 'false', 'Wraps the last stop to the first (and back) instead of clamping.'],
      ['nav', 'boolean', 'true', 'Renders prev/next arrows; `false` hides any authored arrows.'],
      ['dots', 'boolean', 'true', 'Renders one position dot per reachable stop.'],
      ['slideBy', 'number | "page"', '1', 'Items to advance per step, or a whole view for `"page"`.'],
      ['autoplay', 'boolean', 'false', 'Auto-advances on a timer.'],
      ['autoplayTimeout', 'number', '5000', 'Milliseconds between auto-advances.'],
      ['autoplayHoverPause', 'boolean', 'true', 'Pauses autoplay while the pointer is over the carousel.'],
      ['drag', 'boolean', 'true', 'Pointer drag / swipe with distance- or velocity-based snap.'],
      ['lazyLoad', 'boolean', 'false', 'Assigns `img[data-zak-src]` when its slide becomes visible.'],
      ['margin', 'number', '0', 'Gutter between items, in pixels.'],
      ['new ZakUI.ZakCarousel(el, opts)', 'api', '—', 'Imperative mount; instance exposes `next()`, `prev()`, `to(i)`, `destroy()`.'],
      ['zak:changed / zak:translated', 'event', '—', 'Bubble from the root with `{ index, count, items }` detail.'],
      ['.zak-carousel__track / __slide', 'element', '—', 'The engine translates the track and sizes each slide from `items` / `margin`.'],
    ],
    a11y: {
      keys: [
        ['← / →', 'Arrow buttons are focusable; activating them steps the carousel.'],
        ['Tab', 'Reaches the arrows and each dot in order.'],
      ],
      aria: [
        ['aria-label per control', 'Arrows name their direction; each dot names its target slide.'],
        ['prefers-reduced-motion', 'Falls back to an instant translate instead of an animated one.'],
      ],
    },
    notes: [
      'Slides are plain content — the engine only reads the track\'s direct children, so any markup works inside a `.zak-carousel__slide`.',
      '`loop` wraps by jumping the index (no cloned items), so with `items` equal to the slide count it simply stays put.',
    ],
  }),
  slider: defineDemo({
    desc: 'A crossfade slideshow: one stage, stacked slides, single active frame. Prev/next wrap around and the counter tracks position — good for launch galleries and onboarding.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-slider" data-zak-slider style="width:100%;max-width:42rem">
    <div class="zak-slider__slide is-active" data-slider-slide>${ph('', svgIcon('rocket', 'zak-icon', 26), 'Release 2.4')}</div>
    <div class="zak-slider__slide" data-slider-slide>${ph(' zak-img-ph--cool', svgIcon('layers', 'zak-icon', 26), 'Token density modes')}</div>
    <div class="zak-slider__slide" data-slider-slide>${ph(' zak-img-ph--green', svgIcon('sparkles', 'zak-icon', 26), 'Streaming AI kit')}</div>
    <div class="zak-slider__slide" data-slider-slide>${ph(' zak-img-ph--alt', svgIcon('shield', 'zak-icon', 26), 'Enterprise audit')}</div>
    <button class="zak-carousel__btn zak-carousel__btn--prev" type="button" aria-label="Previous slide" data-slider-prev>${chevLeft}</button>
    <button class="zak-carousel__btn zak-carousel__btn--next" type="button" aria-label="Next slide" data-slider-next>${chevRight}</button>
    <span class="zak-slider__counter" data-slider-counter aria-live="polite">1 / 4</span>
  </div>`,
    codeTpl: `<!-- Behaviour root; slides carry data-slider-slide -->
<div class="zak-slider" data-zak-slider>
  <div class="zak-slider__slide is-active" data-slider-slide>Release 2.4</div>
  <div class="zak-slider__slide" data-slider-slide>Token density modes</div>
  <div class="zak-slider__slide" data-slider-slide>Streaming AI kit</div>

  <button class="zak-carousel__btn zak-carousel__btn--prev" type="button" aria-label="Previous slide" data-slider-prev>‹</button>
  <button class="zak-carousel__btn zak-carousel__btn--next" type="button" aria-label="Next slide" data-slider-next>›</button>

  <!-- Tabular counter pill; aria-live polite on change -->
  <span class="zak-slider__counter" data-slider-counter aria-live="polite">1 / 3</span>
</div>

<!-- .is-active crossfades over the slow duration token; index arithmetic wraps both ways -->`,
    css: `.zak-slider { position: relative; aspect-ratio: 16 / 7; overflow: hidden; }

.zak-slider__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--zak-duration-slow) var(--zak-ease-standard);
}

.zak-slider__slide.is-active { opacity: 1; }`,
    js: `const slides = [...root.querySelectorAll('[data-slider-slide]')];
let current = slides.findIndex((s) => s.classList.contains('is-active'));

function show(index) {
  current = (index + slides.length) % slides.length;   // wrap both ways
  slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
  counter.textContent = (current + 1) + ' / ' + slides.length;
}

prev.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));

// Arrow keys while the stage has focus; swipe via pointer events
root.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});`,
    props: [
      ['data-zak-slider', 'attr', '—', 'Behaviour root; slides carry data-slider-slide.'],
      ['.zak-slider__slide.is-active', 'class', '—', 'Crossfades over the slow duration token.'],
      ['.zak-slider__counter', 'element', '—', 'Tabular counter pill; aria-live polite on change.'],
      ['wrap-around', 'behaviour', '—', 'Index arithmetic wraps in both directions.'],
    ],
  }),
  video: defineDemo({
    desc: 'A poster-first player: the gradient poster and play affordance keep the layout calm until intent — then the real <video> element takes over.',
    playground: false,
    stage: 'stretch',
    tpl: `<figure style="margin:0;width:100%;max-width:42rem">
    <div class="zak-video" data-zak-video style="width:100%">
      ${ph('', svgIcon('monitor', 'zak-icon', 42))}
      <button class="zak-video__overlay" type="button" data-video-overlay aria-label="Play video — Why teams choose ZAKUIKit, 2 minutes 47 seconds">
        <span class="zak-video__play">${playI}</span>
        <span class="zak-video__meta">Why teams choose ZAKUIKit · 2:47</span>
      </button>
    </div>
    <figcaption style="margin-block-start:var(--zak-space-3);font-size:var(--zak-text-sm);color:var(--zak-text-secondary);display:flex;align-items:center;gap:var(--zak-space-2)">
      ${micI} Product keynote · recorded 18 June · captions in EN
    </figcaption>
  </figure>`,
    codeTpl: `<!-- Poster-first 16:9 frame, near-black stage -->
<div class="zak-video" data-zak-video>
  <img class="zak-img" src="keynote-poster.webp" alt=""/>

  <!-- Full-frame trigger; radial scrim keeps the play glyph legible -->
  <button class="zak-video__overlay" type="button" data-video-overlay
          aria-label="Play video — Why teams choose ZAKUIKit, 2 minutes 47 seconds">
    <span class="zak-video__play">▶</span>
    <!-- Title + duration; drive the aria-label from it -->
    <span class="zak-video__meta">Why teams choose ZAKUIKit · 2:47</span>
  </button>
</div>`,
    js: `overlay.addEventListener('click', () => {
  const video = document.createElement('video');
  video.src = overlay.dataset.src;
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  overlay.replaceWith(video);      // swap poster for the real player
});`,
    props: [
      ['.zak-video', 'class', '—', '16:9 frame, near-black stage, overflow-clipped radius.'],
      ['.zak-video__overlay', 'button', '—', 'Full-frame trigger; radial scrim keeps the play glyph legible.'],
      ['.zak-video__play', 'element', '—', 'Glass circle scaling 1.08× on hover.'],
      ['.zak-video__meta', 'element', '—', 'Title + duration under the glyph; drive the aria-label from it.'],
    ],
    notes: ['Always offer captions and a transcript link. Never autoplay with sound — the demo swaps in `controls` only after an explicit click.'],
  }),
  audio: defineDemo({
    desc: 'The compact audio row: a play toggle, episode metadata, inline progress and elapsed/total time. Mirror native media events onto the row when a real source is wired up.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--sm" style="width:100%;max-width:34rem">
    <div class="zak-audio" data-zak-audio>
      <button class="zak-btn zak-btn--primary zak-btn--icon" type="button" aria-label="Play episode" aria-pressed="false" data-zak-audio-toggle>
        <span data-audio-play>${playI}</span>
        <span data-audio-pause hidden>${pauseI}</span>
      </button>
      <div class="zak-audio__meta" style="flex:1">
        <span class="zak-audio__title">Designing for trust</span>
        <span class="zak-audio__sub">Episode 24 · Ada Chen · 38 min</span>
        <span class="zak-progress zak-progress--sm" style="margin-block-start:var(--zak-space-2)"><span class="zak-progress__bar" style="--value:34%"></span></span>
      </div>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums">12:58 / 38:04</span>
    </div>

    <div class="zak-audio" style="max-width:34rem">
      <span class="zak-avatar zak-avatar--sm" aria-hidden="true">RP</span>
      <div class="zak-audio__meta" style="flex:1">
        <span class="zak-audio__title">Release notes, read aloud</span>
        <span class="zak-audio__sub">2.4 highlights · 6 min left</span>
      </div>
      <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">Queue ${clockI}</button>
    </div>
  </div>`,
    codeTpl: `<!-- Row shell: play control · flexible meta · trailing facts -->
<div class="zak-audio" data-zak-audio>
  <button class="zak-btn zak-btn--primary zak-btn--icon" type="button"
          aria-label="Play episode" aria-pressed="false" data-zak-audio-toggle>
    <span data-audio-play>▶</span>
    <span data-audio-pause hidden>⏸</span>
  </button>
  <div class="zak-audio__meta">
    <span class="zak-audio__title">Designing for trust</span>
    <span class="zak-audio__sub">Episode 24 · Ada Chen · 38 min</span>
    <!-- The shared progress track visualises playhead position -->
    <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:34%"></span></span>
  </div>
  <span>12:58 / 38:04</span>
</div>

<!-- A native <audio> is styled to 100% width inside the row -->
<audio class="zak-audio__native" src="/episodes/24.mp3" controls></audio>`,
    js: `// With a real source, mirror native events into the custom row
const el = document.createElement('audio');
el.src = '/episodes/24.mp3';

toggle.addEventListener('click', () => {
  const paused = el.paused;
  paused ? el.play() : el.pause();
  root.classList.toggle('is-playing', paused);
  toggle.setAttribute('aria-pressed', String(paused));
});

el.addEventListener('timeupdate', () => {
  bar.style.setProperty('--value', (el.currentTime / el.duration) * 100 + '%');
});`,
    props: [
      ['.zak-audio', 'class', '—', 'Row shell: play control, flexible meta, trailing facts.'],
      ['[data-zak-audio-toggle]', 'attr', '—', 'Swap data-audio-play / data-audio-pause spans, flip aria-pressed.'],
      ['.zak-progress inside', 'pattern', '—', 'The shared progress track visualises playhead position.'],
      ['native <audio>', 'element', '—', 'Styled to 100% width inside the row when used directly.'],
    ],
    a11y: {
      keys: [
        ['Space', 'Toggles playback while the row has focus.'],
        ['← / →', 'Seeks within the episode timeline.'],
      ],
      aria: [
        ['aria-pressed', 'Communicates the toggle state of the play button.'],
        ['aria-label with title', 'Name the episode in the control label, not just "Play".'],
      ],
    },
  }),
  'media-object': defineDemo({
    desc: 'The classic figure → body pattern: avatar or thumbnail beside flexible content. Reverse flips the sides for timeline-style commentary rows.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-stack zak-stack--md" style="width:100%;max-width:36rem">
    <div class="zak-media">
      <span class="zak-media__figure"><span class="zak-ai-avatar zak-ai-avatar--lg" aria-hidden="true"></span></span>
      <div class="zak-media__body">
        <div style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">Zak Assistant</div>
        <p style="margin:var(--zak-space-1) 0 0;font-size:var(--zak-text-sm);color:var(--zak-text-secondary);line-height:var(--zak-leading-normal)">Patched the streaming caret race in <code style="font-family:var(--zak-font-mono);font-size:0.9em">qa/stream.spec.ts</code> — 3 tests now green.</p>
        <div style="margin-block-start:var(--zak-space-2)"><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Resolved</span></div>
      </div>
    </div>

    <div class="zak-media">
      <span class="zak-media__figure"><span class="zak-img zak-img--rounded zak-img--bordered" style="width:4.2rem;aspect-ratio:1;overflow:hidden;display:block">${ph(' zak-img-ph--cool', svgIcon('file', 'zak-icon', 18))}</span></span>
      <div class="zak-media__body">
        <div style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">q3-architecture.pdf</div>
        <p style="margin:var(--zak-space-1) 0 0;font-size:var(--zak-text-sm);color:var(--zak-text-secondary)">Uploaded by Priya · 18 pages · 2.1 MB</p>
      </div>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Download q3-architecture.pdf">${downloadI}</button>
    </div>

    <div class="zak-media zak-media--reverse">
      <span class="zak-media__figure"><span class="zak-avatar zak-avatar--md">AS</span></span>
      <div class="zak-media__body" style="text-align:right">
        <div style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm)">You</div>
        <p style="margin:var(--zak-space-1) 0 0;font-size:var(--zak-text-sm);color:var(--zak-text-secondary)">Approved the merge — shipping after the EU window opens.</p>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Figure + fluid body; figures are clamped with flex: none -->
<div class="zak-media">
  <span class="zak-media__figure"><span class="zak-avatar zak-avatar--md">AT</span></span>
  <div class="zak-media__body">
    <div>Alina Tudor</div>
    <p>Approved the merge — shipping after the EU window opens.</p>
  </div>
</div>

<!-- __figure holds the fixed media column, __body the fluid content column (min-width: 0) -->
<div class="zak-media">
  <span class="zak-media__figure"><span class="zak-avatar zak-avatar--md">MW</span></span>
  <div class="zak-media__body">
    <div>Marcus Webb</div>
    <p>Uploaded q3-architecture.pdf · 18 pages · 2.1 MB</p>
  </div>
</div>

<!-- --reverse flips to row-reverse for right-aligned conversation rows -->
<div class="zak-media zak-media--reverse">
  <span class="zak-media__figure"><span class="zak-avatar zak-avatar--md">AS</span></span>
  <div class="zak-media__body" style="text-align:right">
    <div>You</div>
    <p>Approved the merge.</p>
  </div>
</div>

<!-- .zak-media__body :first-child has zero top margin so titles align with the figure edge -->`,
    props: [
      ['.zak-media', 'class', '—', 'Flex row, 1rem gap, figures clamped with flex: none.'],
      ['.zak-media__figure / __body', 'element', '—', 'Fixed media column + fluid content column (min-width: 0).'],
      ['.zak-media--reverse', 'modifier', '—', 'row-reverse for right-aligned conversation rows.'],
      ['.zak-media__body :first-child', 'css', '—', 'Zero top margin so titles align with the figure edge.'],
    ],
  }),
};
