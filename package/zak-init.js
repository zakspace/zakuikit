/*!
 * ZAKUIKit — production initialisation script (v2.2)
 *
 * Drop-in bootstrap that handles the three cross-cutting concerns every
 * ZAKUIKit app needs, before and alongside the self-initialising runtime:
 *
 *   1. Theme detection  — zero-FOUC boot, OS preference tracking, persistence
 *   2. Auto-registration — mounts every [data-zak-component] controller,
 *      including hosts added later by your app (via MutationObserver)
 *   3. Event delegation  — one document-level router for app actions,
 *      so dynamically rendered markup never needs re-binding
 *
 * Load it as an ES module import or paste it inline before </body>.
 * Dependency-free — uses only the public window.ZakUI surface.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'zak-theme';
  var root = document.documentElement;

  /* ------------------------------------------------------------ 1. theme */

  function readStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch (e) {
      return null; // private mode — fall through to the system preference
    }
  }

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* session-only */
      }
    }
    var meta = document.querySelector('[data-theme-color]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#070b14' : '#f6f7fb');
    document.dispatchEvent(new CustomEvent('zak:theme', { detail: { theme: theme } }));
  }

  // Boot — runs synchronously; on a cold visit the inline <head> copy of this
  // block guarantees data-theme exists before first paint (no FOUC).
  applyTheme(readStoredTheme() || systemTheme(), false);

  // Follow the OS while the user has not expressed an explicit choice.
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function (event) {
      if (readStoredTheme()) return;
      applyTheme(event.matches ? 'dark' : 'light', false);
    });

  // Delegated toggle — any <button data-theme-toggle> works, ever, anywhere.
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
  });

  /* ----------------------------------------------- 2. auto-registration */

  function registerComponents(scope) {
    if (window.ZakUI && typeof window.ZakUI.init === 'function') {
      window.ZakUI.init(scope || document);
    }
  }

  // Controllers read state from classes/ARIA attributes, so mounting once per
  // host is enough; ZakUI's internal WeakMap makes re-runs cheap and safe.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      registerComponents(document);
    });
  } else {
    registerComponents(document);
  }

  // Watch for app-rendered subtrees (SPA fragments, template inserts) and
  // register components inside them. Attribute-only behaviour needs nothing
  // here — the delegated listeners below already cover it.
  function observeAppUpdates() {
    if (!document.body) return; // cold head script — DOMContentLoaded path will re-run
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (node.nodeType === 1 && (node.querySelector || node.matches)) {
            if (node.matches('[data-zak-component]') || node.querySelector('[data-zak-component]')) {
              registerComponents(node);
            }
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAppUpdates);
  } else {
    observeAppUpdates();
  }

  /* ----------------------------------------------- 3. event delegation */

  // One router for the whole app: [data-zak-action] names an action,
  // [data-zak-arg] carries its payload. Rendered HTML never needs inline JS.
  var actions = {
    // Fire a toast: <button data-zak-action="toast" data-zak-arg="Saved">
    toast: function (el) {
      if (window.ZakUI) {
        window.ZakUI.toast(el.getAttribute('data-zak-arg') || 'Done', 'success');
      }
    },
    // Run an async task with the button's spinner: <button data-zak-action="busy">
    busy: function (el) {
      if (!window.ZakUI) return;
      var button = new window.ZakUI.ZakButton(el);
      var task = new Promise(function (resolve) {
        setTimeout(resolve, Number(el.getAttribute('data-zak-arg') || 1500));
      });
      button.withLoading(function () {
        return task;
      });
    },
    // Open a dialog/drawer by id: <button data-zak-action="open" data-zak-arg="#modal-edit">
    open: function (el) {
      if (!window.ZakUI) return;
      var dialog = document.querySelector(el.getAttribute('data-zak-arg') || '');
      if (dialog instanceof HTMLDialogElement) new window.ZakUI.ZakModal(dialog).open();
    },
  };

  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('[data-zak-action]');
    if (!el) return;
    var handler = actions[el.getAttribute('data-zak-action')];
    if (handler) handler(el, event);
  });

  // Expose the router so apps can register custom actions.
  window.ZakApp = { actions: actions, registerComponents: registerComponents };
})();
