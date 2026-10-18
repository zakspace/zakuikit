# ZAKUIKit

Enterprise design system in **pure CSS + vanilla JavaScript** — 15 component
categories, zero third-party dependencies, native light/dark theming via
CSS custom properties, and a cascade-layered stylesheet that never fights
your own code.

- **npm**: `npm install zakuikit`
- **CDN (jsDelivr):** drop-in `<link>` + `<script>` — no build step required

## Install — npm

```bash
npm install zakuikit
```

```js
// Bundle the whole toolkit…
import 'zakuikit/css';                 // tokens + base + all components + utilities (@layer-ed)
import { init, toast, ZakModal, ZakButton } from 'zakuikit';

// …or go granular — one stylesheet per category, in cascade order
// (tokens → base → components → utilities; import zak-utilities.css last).
import 'zakuikit/css/tokens.css';
import 'zakuikit/css/base.css';
import 'zakuikit/css/zak-buttons.css';
import 'zakuikit/css/zak-forms.css';
import 'zakuikit/css/zak-utilities.css';

// Mount controllers for declarative hosts, then use the API.
init(document); // scans [data-zak-component="modal" | "dropdown" | "tabs" | …]

document.querySelector('#save').addEventListener('click', () => {
  toast('Saved', 'success', { desc: '3 records updated.' });
});
```

The runtime is **side-effect self-initialising**: the data-attribute
contracts (`data-zak-toggle`, `data-zak-target`, `data-zak-close`, …) work
with no setup call at all. `init()` only adds controller instances for
apps that prefer an imperative API.

## Install — jsDelivr CDN

```html
<!-- Theme boot — before first paint, zero FOUC -->
<script>
  (function () {
    var t = localStorage.getItem('zak-theme');
    if (t !== 'light' && t !== 'dark')
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>

<!-- Stylesheet -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zakuikit.min.css"
/>
<!-- Or the uncompressed bundle for development -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zakuikit.css"
/>

<!-- Runtime — one global, window.ZakUI -->
<script src="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zakuikit.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zakuikit.js" defer></script> <!-- dev -->

<!-- Optional: production bootstrap (theme tracking, auto-registration, action delegation) -->
<script src="https://cdn.jsdelivr.net/npm/zakuikit@latest/zak-init.js" defer></script>
```

Pin a version for production safety: `zakuikit@2.2.0/dist/…`.

> **Hardening tip** — when loading from a CDN in production, pin the exact
> version and add Subresource Integrity so a tampered artifact cannot execute:
>
> ```html
> <script
>   src="https://cdn.jsdelivr.net/npm/zakuikit@2.2.0/dist/zakuikit.min.js"
>   integrity="sha384-<hash-from-jsdelivr-sri-tool>"
>   crossorigin="anonymous"
>   defer></script>
> ```
>
> jsDelivr exposes the `x-sri` header on every file (`curl -sI <url> | grep x-sri`)
> or generate it locally with `openssl dgst -sha384 -binary dist/zakuikit.min.js | openssl base64 -A`.

## Theming

Themes resolve entirely through `[data-theme="light"]` / `[data-theme="dark"]`
on any ancestor — default is light, dark is opt-in, per-subtree overrides
are supported. `color-scheme` is set with the theme so native controls
(scrollbars, form widgets, date pickers) flip in lock-step.

```html
<html data-theme="dark">…</html>
```

Override any `--zak-*` token in unlayered CSS and every component follows:

```css
:root {
  --zak-brand-600: #7c3aed; /* re-key the brand ramp */
}
```

## Package layout

| Path | Contents |
| --- | --- |
| `dist/zakuikit.css` / `.min.css` | Every component stylesheet, `@layer`-ordered: `zak.tokens < zak.base < zak.components` |
| `dist/zakuikit.js` / `.min.js` | IIFE runtime — self-initialising, exposes `window.ZakUI` |
| `dist/zakuikit.mjs` | ESM entry — named exports (`ZakButton`, `ZakModal`, `toast`, `init`, …) |
| `dist/css/*.css` | Granular per-category stylesheets |
| `zak-init.js` | Optional production bootstrap (theme, registration, delegation) |
| `zakuikit.d.ts` | TypeScript declarations for the public API |

## API at a glance

```js
import {
  toast, snackbar, init, register, autoRegister,
  ZakChart,            // create(host, config) / render(config) / scan(root)
  ZakButton,   // loading()/disabled()/withLoading()
  ZakModal,    // open()/close()/onDismiss() — native <dialog>
  ZakDrawer,   // modal variant for anchored drawers
  ZakDropdown, // open()/close()/toggle() with ARIA keyboard routing
  ZakTabs,     // select(index) with roving tabindex
  ZakAccordion,// open/close/toggle(index)
  ZakCollapse, // grid-row collapse
  ZakTooltip,  // show()/hide()
  ZakToast,    // static show()
  ZakSnackbar, // static show()
} from 'zakuikit';

// Charts render from a Chart.js-shaped config, or from a JSON host:
// <div data-zak-chart='{"type":"line","data":{"labels":[…],"datasets":[…]}}'></div>
const chart = ZakChart.create('#latency', {
  type: 'line',
  data: { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'p95', data: [58, 44, 51] }] },
  options: { grid: true, points: true, legend: true },
});
chart.update();   // re-render; chart.destroy() clears the host
```

Custom events: controllers emit `zak:open`, `zak:close`, `zak:select` on
their host element; theme changes emit `zak:theme` on `document`; an action
clicked on a snackbar with no callback emits `zak:snackbar-action`.

## Browser support

Modern evergreen browsers (Chrome/Edge 99+, Firefox 102+, Safari 15.4+).
Uses `<dialog>`, Popover API, `@layer`, `color-mix()`, `:focus-visible`,
`aspect-ratio` and logical properties — no polyfills, no shim JS.

## License

MIT © ZAKUIKit
