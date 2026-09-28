/* ============================================================
   ZAKUIKit Docs Site Scripts
   Sidebar, navigation, table of contents, theme toggle,
   copy-code, and documentation search.
   Load AFTER dist/js/zak.js on documentation pages.
   ============================================================ */

/* ======================================================
   ZAKUIKIT DOCS SHELL (sidebar, theme, copy, search)
   Consolidated into a single file per docs requirement.
   ====================================================== */
(function () {
  'use strict';

  /* ---------------- docs.js ---------------- */
  /* ===== Sidebar Toggle (Mobile) ===== */
  function initSidebarToggle() {
    var hamburger = document.querySelector('.docs-hamburger');
    var sidebar = document.querySelector('.docs-sidebar');
    var overlay = document.querySelector('.docs-sidebar-overlay');

    if (!hamburger) return;

    /* Pages without a docs sidebar (e.g. landing page): the hamburger
       toggles the header nav into a dropdown panel. */
    if (!sidebar) {
      var header = document.querySelector('.docs-header');
      if (!header) return;
      hamburger.addEventListener('click', function () {
        header.classList.toggle('docs-header--nav-open');
      });
      var nav = header.querySelector('.docs-header__nav');
      if (nav) {
        nav.addEventListener('click', function (e) {
          if (e.target.closest('a')) header.classList.remove('docs-header--nav-open');
        });
      }
      return;
    }

    function openSidebar() {
      sidebar.classList.add('docs-sidebar--open');
      if (overlay) {
        overlay.style.display = 'block';
        requestAnimationFrame(function () {
          overlay.classList.add('docs-sidebar-overlay--visible');
        });
      }
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('docs-sidebar--open');
      if (overlay) {
        overlay.classList.remove('docs-sidebar-overlay--visible');
        setTimeout(function () {
          overlay.style.display = '';
        }, 300);
      }
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (sidebar.classList.contains('docs-sidebar--open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }
  }

  /* ===== Sidebar Category Collapse/Expand ===== */
  var SIDEBAR_STATE_KEY = 'zak-docs-sidebar-open';

  function getOpenCategories() {
    try {
      var v = JSON.parse(localStorage.getItem(SIDEBAR_STATE_KEY));
      if (Array.isArray(v)) return v;
    } catch (e) { }
    return null;
  }

  function setOpenCategories(cats) {
    try { localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(cats)); } catch (e) { }
  }

  function initSidebarCategories() {
    var categories = document.querySelectorAll('.docs-sidebar__category');
    categories.forEach(function (category) {
      var section = category.closest('.docs-sidebar__section');
      if (!section) return;

      category.addEventListener('click', function () {
        category.classList.toggle('docs-sidebar__category--collapsed');
        var cat = category.getAttribute('data-cat');
        if (!cat) return;
        var open = getOpenCategories() || [];
        var isOpen = !category.classList.contains('docs-sidebar__category--collapsed');
        if (isOpen) {
          if (open.indexOf(cat) === -1) open.push(cat);
        } else {
          open = open.filter(function (c) { return c !== cat; });
        }
        setOpenCategories(open);
      });
    });
  }

  /* ===== Active Link Highlighting ===== */
  function initActiveLink() {
    var links = document.querySelectorAll('.docs-sidebar__link');
    var currentPath = window.location.pathname;

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var a = document.createElement('a');
      a.href = href;
      if (a.pathname === currentPath) {
        link.classList.add('docs-sidebar__link--active');
      }
    });
  }

  /* ===== Smooth Scroll to Sections ===== */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + targetId);
    });
  }

  /* ===== Preview Container Toggle ===== */
  function initPreviewToggle() {
    var toggleBtns = document.querySelectorAll('.docs-preview__toggle');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preview = btn.closest('.docs-preview');
        if (!preview) return;
        var codeArea = preview.querySelector('.docs-preview__code');
        if (!codeArea) return;

        var isOpen = codeArea.classList.contains('docs-preview__code--open');
        if (isOpen) {
          codeArea.classList.remove('docs-preview__code--open');
          btn.textContent = 'Show Code';
        } else {
          codeArea.classList.add('docs-preview__code--open');
          btn.textContent = 'Hide Code';
        }
      });
    });

    var themeBtns = document.querySelectorAll('.docs-preview__toolbar-btn[data-preview-theme]');
    themeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preview = btn.closest('.docs-preview');
        if (!preview) return;
        var area = preview.querySelector('.docs-preview__area');
        if (!area) return;

        var currentTheme = btn.getAttribute('data-preview-theme');
        if (currentTheme === 'dark') {
          area.classList.add('docs-preview__area--dark');
          btn.classList.add('docs-preview__toolbar-btn--active');
          var lightBtn = preview.querySelector('.docs-preview__toolbar-btn[data-preview-theme="light"]');
          if (lightBtn) lightBtn.classList.remove('docs-preview__toolbar-btn--active');
        } else {
          area.classList.remove('docs-preview__area--dark');
          btn.classList.add('docs-preview__toolbar-btn--active');
          var darkBtn = preview.querySelector('.docs-preview__toolbar-btn[data-preview-theme="dark"]');
          if (darkBtn) darkBtn.classList.remove('docs-preview__toolbar-btn--active');
        }
      });
    });
  }

  /* ===== Responsive iframe Sizing ===== */
  function initResponsiveIframes() {
    var iframes = document.querySelectorAll('.docs-preview iframe');
    iframes.forEach(function (iframe) {
      if (!iframe.style.width) {
        iframe.style.width = '100%';
      }
      if (!iframe.style.border) {
        iframe.style.border = 'none';
      }
    });
  }

  /* ===== Table of Contents Generation ===== */
  function initTableOfContents() {
    var tocContainer = document.querySelector('.docs-toc');
    if (!tocContainer) return;

    var content = document.querySelector('.docs-content');
    if (!content) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }

    var list = tocContainer.querySelector('.docs-toc__list');
    if (!list) {
      list = document.createElement('ul');
      list.className = 'docs-toc__list';
      tocContainer.appendChild(list);
    } else {
      list.innerHTML = '';
    }

    headings.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = 'section-' + index + '-' + heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'docs-toc__link';
      if (heading.tagName === 'H3') {
        a.classList.add('docs-toc__link--h3');
      }
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      a.setAttribute('data-target', heading.id);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ===== Scroll Spy for Table of Contents ===== */
  function initScrollSpy() {
    var tocLinks = document.querySelectorAll('.docs-toc__link');
    if (tocLinks.length === 0) return;

    var headings = [];
    tocLinks.forEach(function (link) {
      var targetId = link.getAttribute('data-target');
      var heading = document.getElementById(targetId);
      if (heading) {
        headings.push({ element: heading, link: link });
      }
    });

    if (headings.length === 0) return;

    function updateActiveHeading() {
      var scrollPosition = window.scrollY + 100;
      var currentHeading = null;

      for (var i = 0; i < headings.length; i++) {
        if (headings[i].element.offsetTop <= scrollPosition) {
          currentHeading = headings[i];
        }
      }

      tocLinks.forEach(function (link) {
        link.classList.remove('docs-toc__link--active');
      });

      if (currentHeading) {
        currentHeading.link.classList.add('docs-toc__link--active');
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveHeading();
  }

  /* ===== Initialize ===== */
  function initDocsChrome() {
    initSidebarToggle();
    initSidebarCategories();
    initActiveLink();
    initSmoothScroll();
    initPreviewToggle();
    initResponsiveIframes();
    initTableOfContents();
    initScrollSpy();
  }



  /* ---------------- theme.js ---------------- */
  var STORAGE_KEY = 'zak-docs-theme';
  var THEME_ATTR = 'data-theme';

  var sunIcon = '<svg class="docs-theme-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var moonIcon = '<svg class="docs-theme-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var systemIcon = '<svg class="docs-theme-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';

  var themeOrder = ['light', 'dark', 'system'];
  var currentIndex = 0;

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* ignore */ }
  }

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function resolveTheme(theme) {
    if (theme === 'system') {
      return getSystemPreference();
    }
    return theme;
  }

  function applyTheme(theme) {
    var resolved = resolveTheme(theme);
    document.documentElement.setAttribute(THEME_ATTR, resolved);
  }

  function updateToggleButton(button) {
    var theme = themeOrder[currentIndex];
    if (theme === 'light') {
      button.innerHTML = sunIcon;
      button.setAttribute('aria-label', 'Switch to dark theme');
    } else if (theme === 'dark') {
      button.innerHTML = moonIcon;
      button.setAttribute('aria-label', 'Switch to system theme');
    } else {
      button.innerHTML = systemIcon;
      button.setAttribute('aria-label', 'Switch to light theme');
    }
  }

  function cycleTheme(button) {
    currentIndex = (currentIndex + 1) % themeOrder.length;
    var theme = themeOrder[currentIndex];
    storeTheme(theme);
    applyTheme(theme);
    updateToggleButton(button);
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored && themeOrder.indexOf(stored) !== -1) {
      currentIndex = themeOrder.indexOf(stored);
    } else {
      currentIndex = 2;
    }
    applyTheme(themeOrder[currentIndex]);
  }

  function setupMediaListener() {
    if (!window.matchMedia) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) {
      mq.addEventListener('change', function () {
        var stored = getStoredTheme();
        if (!stored || stored === 'system') {
          applyTheme('system');
        }
      });
    }
  }

  function setupButton() {
    var buttons = document.querySelectorAll('.docs-theme-toggle');
    buttons.forEach(function (button) {
      updateToggleButton(button);
      button.addEventListener('click', function () {
        cycleTheme(button);
      });
    });
  }

  initTheme();
  setupMediaListener();



  /* ---------------- copy-code.js ---------------- */
  var RESET_DELAY = 2000;

  function getCopyButtons() {
    return document.querySelectorAll('.docs-copy-btn, .copy-code-btn, .zak-docs-copy-btn');
  }

  function getButtonText(btn) {
    return btn.querySelector('.docs-copy-btn__text');
  }

  function getCodeBlockContent(btn) {
    var codeBlock = btn.closest('.docs-code-block') || btn.closest('.zak-docs-code');
    if (!codeBlock) return '';
    var code = codeBlock.querySelector('code');
    if (!code) return '';
    return code.textContent || '';
  }


  function showCopied(btn) {
    btn.classList.add('docs-copy-btn--copied');
    var text = getButtonText(btn);
    if (text) {
      text.textContent = 'Copied!';
    } else {
      btn.textContent = 'Copied!';
    }
  }

  function resetButton(btn) {
    btn.classList.remove('docs-copy-btn--copied');
    var text = getButtonText(btn);
    var original = btn.getAttribute('data-copy-label') || 'Copy';
    if (text) {
      text.textContent = original;
    } else {
      btn.textContent = original;
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function handleCopy(event) {
    var btn = event.currentTarget;
    var content = getCodeBlockContent(btn);

    copyToClipboard(content)
      .then(function () {
        showCopied(btn);
        setTimeout(function () {
          resetButton(btn);
        }, RESET_DELAY);
      })
      .catch(function () {
        showCopied(btn);
        setTimeout(function () {
          resetButton(btn);
        }, RESET_DELAY);
      });
  }

  function initCopyCode() {
    var buttons = getCopyButtons();
    buttons.forEach(function (btn) {
      var label = btn.querySelector('.docs-copy-btn__text');
      btn.setAttribute('data-copy-label', label ? label.textContent : (btn.textContent || 'Copy'));
      btn.addEventListener('click', handleCopy);
    });
  }



  /* ---------------- search.js ---------------- */
  var DEBOUNCE_DELAY = 150;
  var MAX_RESULTS = 20;

  var searchIndexRef = [
    { name: 'ai avatar', category: 'ai', description: 'ai avatar ai component', url: 'dist/components/ai/ai-avatar/index.html' },
    { name: 'ai button', category: 'ai', description: 'ai button ai component', url: 'dist/components/ai/ai-button/index.html' },
    { name: 'ai command menu', category: 'ai', description: 'ai command menu ai component', url: 'dist/components/ai/ai-command-menu/index.html' },
    { name: 'ai input', category: 'ai', description: 'ai input ai component', url: 'dist/components/ai/ai-input/index.html' },
    { name: 'ai prompt input', category: 'ai', description: 'ai prompt input ai component', url: 'dist/components/ai/ai-prompt-input/index.html' },
    { name: 'ai response', category: 'ai', description: 'ai response ai component', url: 'dist/components/ai/ai-response/index.html' },
    { name: 'chat', category: 'ai', description: 'chat ai component', url: 'dist/components/ai/chat/index.html' },
    { name: 'chat message', category: 'ai', description: 'chat message ai component', url: 'dist/components/ai/chat-message/index.html' },
    { name: 'citation', category: 'ai', description: 'citation ai component', url: 'dist/components/ai/citation/index.html' },
    { name: 'conversation', category: 'ai', description: 'conversation ai component', url: 'dist/components/ai/conversation/index.html' },
    { name: 'prompt suggestions', category: 'ai', description: 'prompt suggestions ai component', url: 'dist/components/ai/prompt-suggestions/index.html' },
    { name: 'streaming response', category: 'ai', description: 'streaming response ai component', url: 'dist/components/ai/streaming-response/index.html' },
    { name: 'thinking indicator', category: 'ai', description: 'thinking indicator ai component', url: 'dist/components/ai/thinking-indicator/index.html' },
    { name: 'token usage', category: 'ai', description: 'token usage ai component', url: 'dist/components/ai/token-usage/index.html' },
    { name: 'button', category: 'buttons', description: 'button buttons component', url: 'dist/components/buttons/button/index.html' },
    { name: 'button group', category: 'buttons', description: 'button group buttons component', url: 'dist/components/buttons/button-group/index.html' },
    { name: 'button toolbar', category: 'buttons', description: 'button toolbar buttons component', url: 'dist/components/buttons/button-toolbar/index.html' },
    { name: 'floating action button', category: 'buttons', description: 'floating action button buttons component', url: 'dist/components/buttons/floating-action-button/index.html' },
    { name: 'icon button', category: 'buttons', description: 'icon button buttons component', url: 'dist/components/buttons/icon-button/index.html' },
    { name: 'loading button', category: 'buttons', description: 'loading button buttons component', url: 'dist/components/buttons/loading-button/index.html' },
    { name: 'activity feed', category: 'data-display', description: 'activity feed data-display component', url: 'dist/components/data-display/activity-feed/index.html' },
    { name: 'avatar', category: 'data-display', description: 'avatar data-display component', url: 'dist/components/data-display/avatar/index.html' },
    { name: 'avatar group', category: 'data-display', description: 'avatar group data-display component', url: 'dist/components/data-display/avatar-group/index.html' },
    { name: 'badge', category: 'data-display', description: 'badge data-display component', url: 'dist/components/data-display/badge/index.html' },
    { name: 'card', category: 'data-display', description: 'card data-display component', url: 'dist/components/data-display/card/index.html' },
    { name: 'chip', category: 'data-display', description: 'chip data-display component', url: 'dist/components/data-display/chip/index.html' },
    { name: 'list', category: 'data-display', description: 'list data-display component', url: 'dist/components/data-display/list/index.html' },
    { name: 'list group', category: 'data-display', description: 'list group data-display component', url: 'dist/components/data-display/list-group/index.html' },
    { name: 'organization chart', category: 'data-display', description: 'organization chart data-display component', url: 'dist/components/data-display/organization-chart/index.html' },
    { name: 'rating', category: 'data-display', description: 'rating data-display component', url: 'dist/components/data-display/rating/index.html' },
    { name: 'stat', category: 'data-display', description: 'stat data-display component', url: 'dist/components/data-display/stat/index.html' },
    { name: 'timeline', category: 'data-display', description: 'timeline data-display component', url: 'dist/components/data-display/timeline/index.html' },
    { name: 'tree', category: 'data-display', description: 'tree data-display component', url: 'dist/components/data-display/tree/index.html' },
    { name: 'column selector', category: 'data-grid', description: 'column selector data-grid component', url: 'dist/components/data-grid/column-selector/index.html' },
    { name: 'file manager', category: 'data-grid', description: 'file manager data-grid component', url: 'dist/components/data-grid/file-manager/index.html' },
    { name: 'query builder', category: 'data-grid', description: 'query builder data-grid component', url: 'dist/components/data-grid/query-builder/index.html' },
    { name: 'transfer', category: 'data-grid', description: 'transfer data-grid component', url: 'dist/components/data-grid/transfer/index.html' },
    { name: 'charts', category: 'data-visualization', description: 'charts data-visualization component', url: 'dist/components/data-visualization/charts/index.html' },
    { name: 'dashboard widget', category: 'data-visualization', description: 'dashboard widget data-visualization component', url: 'dist/components/data-visualization/dashboard-widget/index.html' },
    { name: 'filter panel', category: 'data-visualization', description: 'filter panel data-visualization component', url: 'dist/components/data-visualization/filter-panel/index.html' },
    { name: 'kpi card', category: 'data-visualization', description: 'kpi card data-visualization component', url: 'dist/components/data-visualization/kpi-card/index.html' },
    { name: 'accordion', category: 'disclosure-expansion', description: 'accordion disclosure-expansion component', url: 'dist/components/disclosure-expansion/accordion/index.html' },
    { name: 'collapse', category: 'disclosure-expansion', description: 'collapse disclosure-expansion component', url: 'dist/components/disclosure-expansion/collapse/index.html' },
    { name: 'details', category: 'disclosure-expansion', description: 'details disclosure-expansion component', url: 'dist/components/disclosure-expansion/details/index.html' },
    { name: 'expandable panel', category: 'disclosure-expansion', description: 'expandable panel disclosure-expansion component', url: 'dist/components/disclosure-expansion/expandable-panel/index.html' },
    { name: 'show more', category: 'disclosure-expansion', description: 'show more disclosure-expansion component', url: 'dist/components/disclosure-expansion/show-more/index.html' },
    { name: 'alert', category: 'feedback', description: 'alert feedback component', url: 'dist/components/feedback/alert/index.html' },
    { name: 'banner', category: 'feedback', description: 'banner feedback component', url: 'dist/components/feedback/banner/index.html' },
    { name: 'empty state', category: 'feedback', description: 'empty state feedback component', url: 'dist/components/feedback/empty-state/index.html' },
    { name: 'error state', category: 'feedback', description: 'error state feedback component', url: 'dist/components/feedback/error-state/index.html' },
    { name: 'loading', category: 'feedback', description: 'loading feedback component', url: 'dist/components/feedback/loading/index.html' },
    { name: 'loading overlay', category: 'feedback', description: 'loading overlay feedback component', url: 'dist/components/feedback/loading-overlay/index.html' },
    { name: 'maintenance state', category: 'feedback', description: 'maintenance state feedback component', url: 'dist/components/feedback/maintenance-state/index.html' },
    { name: 'offline state', category: 'feedback', description: 'offline state feedback component', url: 'dist/components/feedback/offline-state/index.html' },
    { name: 'progress', category: 'feedback', description: 'progress feedback component', url: 'dist/components/feedback/progress/index.html' },
    { name: 'progress bar', category: 'feedback', description: 'progress bar feedback component', url: 'dist/components/feedback/progress-bar/index.html' },
    { name: 'progress circle', category: 'feedback', description: 'progress circle feedback component', url: 'dist/components/feedback/progress-circle/index.html' },
    { name: 'result', category: 'feedback', description: 'result feedback component', url: 'dist/components/feedback/result/index.html' },
    { name: 'skeleton', category: 'feedback', description: 'skeleton feedback component', url: 'dist/components/feedback/skeleton/index.html' },
    { name: 'snackbar', category: 'feedback', description: 'snackbar feedback component', url: 'dist/components/feedback/snackbar/index.html' },
    { name: 'spinner', category: 'feedback', description: 'spinner feedback component', url: 'dist/components/feedback/spinner/index.html' },
    { name: 'status indicator', category: 'feedback', description: 'status indicator feedback component', url: 'dist/components/feedback/status-indicator/index.html' },
    { name: 'toast', category: 'feedback', description: 'toast feedback component', url: 'dist/components/feedback/toast/index.html' },
    { name: 'autocomplete', category: 'forms', description: 'autocomplete forms component', url: 'dist/components/forms/autocomplete/index.html' },
    { name: 'checkbox', category: 'forms', description: 'checkbox forms component', url: 'dist/components/forms/checkbox/index.html' },
    { name: 'combobox', category: 'forms', description: 'combobox forms component', url: 'dist/components/forms/combobox/index.html' },
    { name: 'file upload', category: 'forms', description: 'file upload forms component', url: 'dist/components/forms/file-upload/index.html' },
    { name: 'form', category: 'forms', description: 'form forms component', url: 'dist/components/forms/form/index.html' },
    { name: 'form field', category: 'forms', description: 'form field forms component', url: 'dist/components/forms/form-field/index.html' },
    { name: 'form wizard', category: 'forms', description: 'form wizard forms component', url: 'dist/components/forms/form-wizard/index.html' },
    { name: 'input', category: 'forms', description: 'input forms component', url: 'dist/components/forms/input/index.html' },
    { name: 'input group', category: 'forms', description: 'input group forms component', url: 'dist/components/forms/input-group/index.html' },
    { name: 'label', category: 'forms', description: 'label forms component', url: 'dist/components/forms/label/index.html' },
    { name: 'multi select', category: 'forms', description: 'multi select forms component', url: 'dist/components/forms/multi-select/index.html' },
    { name: 'otp input', category: 'forms', description: 'otp input forms component', url: 'dist/components/forms/otp-input/index.html' },
    { name: 'password input', category: 'forms', description: 'password input forms component', url: 'dist/components/forms/password-input/index.html' },
    { name: 'radio', category: 'forms', description: 'radio forms component', url: 'dist/components/forms/radio/index.html' },
    { name: 'radio group', category: 'forms', description: 'radio group forms component', url: 'dist/components/forms/radio-group/index.html' },
    { name: 'range', category: 'forms', description: 'range forms component', url: 'dist/components/forms/range/index.html' },
    { name: 'select', category: 'forms', description: 'select forms component', url: 'dist/components/forms/select/index.html' },
    { name: 'switch', category: 'forms', description: 'switch forms component', url: 'dist/components/forms/switch/index.html' },
    { name: 'tags input', category: 'forms', description: 'tags input forms component', url: 'dist/components/forms/tags-input/index.html' },
    { name: 'textarea', category: 'forms', description: 'textarea forms component', url: 'dist/components/forms/textarea/index.html' },
    { name: 'toggle', category: 'forms', description: 'toggle forms component', url: 'dist/components/forms/toggle/index.html' },
    { name: 'validation', category: 'forms', description: 'validation forms component', url: 'dist/components/forms/validation/index.html' },
    { name: 'borders', category: 'foundations', description: 'borders foundations component', url: 'dist/components/foundations/borders/index.html' },
    { name: 'colors', category: 'foundations', description: 'colors foundations component', url: 'dist/components/foundations/colors/index.html' },
    { name: 'icons', category: 'foundations', description: 'icons foundations component', url: 'dist/components/foundations/icons/index.html' },
    { name: 'responsive', category: 'foundations', description: 'responsive foundations component', url: 'dist/components/foundations/responsive/index.html' },
    { name: 'shadows', category: 'foundations', description: 'shadows foundations component', url: 'dist/components/foundations/shadows/index.html' },
    { name: 'spacing', category: 'foundations', description: 'spacing foundations component', url: 'dist/components/foundations/spacing/index.html' },
    { name: 'typography', category: 'foundations', description: 'typography foundations component', url: 'dist/components/foundations/typography/index.html' },
    { name: 'aspect ratio', category: 'layout', description: 'aspect ratio layout component', url: 'dist/components/layout/aspect-ratio/index.html' },
    { name: 'box', category: 'layout', description: 'box layout component', url: 'dist/components/layout/box/index.html' },
    { name: 'columns', category: 'layout', description: 'columns layout component', url: 'dist/components/layout/columns/index.html' },
    { name: 'container', category: 'layout', description: 'container layout component', url: 'dist/components/layout/container/index.html' },
    { name: 'flex', category: 'layout', description: 'flex layout component', url: 'dist/components/layout/flex/index.html' },
    { name: 'grid', category: 'layout', description: 'grid layout component', url: 'dist/components/layout/grid/index.html' },
    { name: 'row', category: 'layout', description: 'row layout component', url: 'dist/components/layout/row/index.html' },
    { name: 'stack', category: 'layout', description: 'stack layout component', url: 'dist/components/layout/stack/index.html' },
    { name: 'audio', category: 'media', description: 'audio media component', url: 'dist/components/media/audio/index.html' },
    { name: 'carousel', category: 'media', description: 'carousel media component', url: 'dist/components/media/carousel/index.html' },
    { name: 'image', category: 'media', description: 'image media component', url: 'dist/components/media/image/index.html' },
    { name: 'image gallery', category: 'media', description: 'image gallery media component', url: 'dist/components/media/image-gallery/index.html' },
    { name: 'image preview', category: 'media', description: 'image preview media component', url: 'dist/components/media/image-preview/index.html' },
    { name: 'media object', category: 'media', description: 'media object media component', url: 'dist/components/media/media-object/index.html' },
    { name: 'slider', category: 'media', description: 'slider media component', url: 'dist/components/media/slider/index.html' },
    { name: 'video', category: 'media', description: 'video media component', url: 'dist/components/media/video/index.html' },
    { name: 'breadcrumb', category: 'navigation', description: 'breadcrumb navigation component', url: 'dist/components/navigation/breadcrumb/index.html' },
    { name: 'dropdown menu', category: 'navigation', description: 'dropdown menu navigation component', url: 'dist/components/navigation/dropdown-menu/index.html' },
    { name: 'navbar', category: 'navigation', description: 'navbar navigation component', url: 'dist/components/navigation/navbar/index.html' },
    { name: 'nav menu', category: 'navigation', description: 'nav menu navigation component', url: 'dist/components/navigation/navmenu/index.html' },
    { name: 'pagination', category: 'navigation', description: 'pagination navigation component', url: 'dist/components/navigation/pagination/index.html' },
    { name: 'sidebar', category: 'navigation', description: 'sidebar navigation component', url: 'dist/components/navigation/sidebar/index.html' },
    { name: 'stepper', category: 'navigation', description: 'stepper navigation component', url: 'dist/components/navigation/stepper/index.html' },
    { name: 'tabs', category: 'navigation', description: 'tabs navigation component', url: 'dist/components/navigation/tabs/index.html' },
    { name: 'context menu', category: 'overlays', description: 'context menu overlays component', url: 'dist/components/overlays/context-menu/index.html' },
    { name: 'drawer', category: 'overlays', description: 'drawer overlays component', url: 'dist/components/overlays/drawer/index.html' },
    { name: 'dropdown', category: 'overlays', description: 'dropdown overlays component', url: 'dist/components/overlays/dropdown/index.html' },
    { name: 'modal', category: 'overlays', description: 'modal overlays component', url: 'dist/components/overlays/modal/index.html' },
    { name: 'offcanvas', category: 'overlays', description: 'offcanvas overlays component', url: 'dist/components/overlays/offcanvas/index.html' },
    { name: 'popover', category: 'overlays', description: 'popover overlays component', url: 'dist/components/overlays/popover/index.html' },
    { name: 'tooltip', category: 'overlays', description: 'tooltip overlays component', url: 'dist/components/overlays/tooltip/index.html' },
    { name: 'calendar', category: 'pickers', description: 'calendar pickers component', url: 'dist/components/pickers/calendar/index.html' },
    { name: 'cascader', category: 'pickers', description: 'cascader pickers component', url: 'dist/components/pickers/cascader/index.html' },
    { name: 'color picker', category: 'pickers', description: 'color picker pickers component', url: 'dist/components/pickers/color-picker/index.html' },
    { name: 'date picker', category: 'pickers', description: 'date picker pickers component', url: 'dist/components/pickers/date-picker/index.html' },
    { name: 'date range picker', category: 'pickers', description: 'date range picker pickers component', url: 'dist/components/pickers/date-range-picker/index.html' },
    { name: 'date time picker', category: 'pickers', description: 'date time picker pickers component', url: 'dist/components/pickers/date-time-picker/index.html' },
    { name: 'month picker', category: 'pickers', description: 'month picker pickers component', url: 'dist/components/pickers/month-picker/index.html' },
    { name: 'time picker', category: 'pickers', description: 'time picker pickers component', url: 'dist/components/pickers/time-picker/index.html' },
    { name: 'year picker', category: 'pickers', description: 'year picker pickers component', url: 'dist/components/pickers/year-picker/index.html' },
    { name: 'advanced data grid', category: 'tables', description: 'advanced data grid tables component', url: 'dist/components/tables/advanced-data-grid/index.html' },
    { name: 'data grid', category: 'tables', description: 'data grid tables component', url: 'dist/components/tables/data-grid/index.html' },
    { name: 'data table', category: 'tables', description: 'data table tables component', url: 'dist/components/tables/data-table/index.html' },
    { name: 'search filter', category: 'tables', description: 'search filter tables component', url: 'dist/components/tables/search-filter/index.html' },
    { name: 'table', category: 'tables', description: 'table tables component', url: 'dist/components/tables/table/index.html' },
    { name: 'tree table', category: 'tables', description: 'tree table tables component', url: 'dist/components/tables/tree-table/index.html' }

  ];
  var searchIndex = (function () {
    var path = window.location.pathname;
    var prefix = path.indexOf('/dist/components/') !== -1 ? '../../../../' : '';
    return searchIndexRef.map(function (item) {
      return { name: item.name, category: item.category, description: item.description, url: prefix + item.url };
    });
  })();

  window.ZAKSearchIndex = searchIndex;

  var activeResultIndex = -1;
  var overlay = null;
  var input = null;
  var resultsContainer = null;

  function initSearch() {
    overlay = document.querySelector('.docs-search-overlay');
    if (!overlay) return;

    input = overlay.querySelector('.docs-search__input');
    resultsContainer = overlay.querySelector('.docs-search__results');

    var openBtns = document.querySelectorAll('.docs-header__search-btn');
    openBtns.forEach(function (btn) {
      btn.addEventListener('click', openSearch);
    });

    document.addEventListener('keydown', handleGlobalShortcut);

    if (input) {
      input.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
      input.addEventListener('keydown', handleInputKeydown);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    var closeBtn = overlay.querySelector('.docs-search__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearch);
    }
  }

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add('docs-search-overlay--visible');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
    activeResultIndex = -1;
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('docs-search-overlay--visible');
    document.body.style.overflow = '';
  }

  function handleGlobalShortcut(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay && overlay.classList.contains('docs-search-overlay--visible')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && overlay && overlay.classList.contains('docs-search-overlay--visible')) {
      closeSearch();
    }
  }

  function handleSearch() {
    if (!input || !resultsContainer) return;
    var query = input.value.trim().toLowerCase();

    if (query.length === 0) {
      resultsContainer.innerHTML = '';
      activeResultIndex = -1;
      return;
    }

    var results = searchIndex.filter(function (item) {
      return (
        item.name.toLowerCase().indexOf(query) !== -1 ||
        item.category.toLowerCase().indexOf(query) !== -1 ||
        item.description.toLowerCase().indexOf(query) !== -1
      );
    });

    results.sort(function (a, b) {
      var aName = a.name.toLowerCase();
      var bName = b.name.toLowerCase();
      var aStarts = aName.indexOf(query) === 0;
      var bStarts = bName.indexOf(query) === 0;
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });

    results = results.slice(0, MAX_RESULTS);
    activeResultIndex = results.length > 0 ? 0 : -1;
    renderResults(results);
  }

  function renderResults(results) {
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="docs-search__empty">No components found</div>';
      return;
    }

    var html = '';
    results.forEach(function (item, index) {
      html += '<a href="' + item.url + '" class="docs-search__result' + (index === activeResultIndex ? ' docs-search__result--active' : '') + '" data-index="' + index + '">' +
        '<div class="docs-search__result-info">' +
        '<div class="docs-search__result-name">' + escapeHtml(item.name) + '</div>' +
        '<div class="docs-search__result-desc">' + escapeHtml(item.description) + '</div>' +
        '</div>' +
        '<span class="docs-search__result-category">' + escapeHtml(item.category) + '</span>' +
        '</a>';
    });

    resultsContainer.innerHTML = html;

    var links = resultsContainer.querySelectorAll('.docs-search__result');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var href = link.getAttribute('href');
        if (href) {
          closeSearch();
          window.location.href = href;
        }
      });
    });
  }

  function handleInputKeydown(e) {
    var links = resultsContainer ? resultsContainer.querySelectorAll('.docs-search__result') : [];
    if (links.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeResultIndex = Math.min(activeResultIndex + 1, links.length - 1);
      updateActiveResult(links);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeResultIndex = Math.max(activeResultIndex - 1, 0);
      updateActiveResult(links);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeResultIndex >= 0 && activeResultIndex < links.length) {
        var href = links[activeResultIndex].getAttribute('href');
        if (href) {
          closeSearch();
          window.location.href = href;
        }
      }
    }
  }

  function updateActiveResult(links) {
    links.forEach(function (link, index) {
      if (index === activeResultIndex) {
        link.classList.add('docs-search__result--active');
        link.scrollIntoView({ block: 'nearest' });
      } else {
        link.classList.remove('docs-search__result--active');
      }
    });
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }



  function initDocsShell() {
    if (typeof initSidebarToggle === 'function') initSidebarToggle();
    if (typeof initSidebarCategories === 'function') initSidebarCategories();
    if (typeof initActiveLink === 'function') initActiveLink();
    if (typeof initSmoothScroll === 'function') initSmoothScroll();
    if (typeof initPreviewToggle === 'function') initPreviewToggle();
    if (typeof initResponsiveIframes === 'function') initResponsiveIframes();
    if (typeof initTableOfContents === 'function') initTableOfContents();
    if (typeof initScrollSpy === 'function') initScrollSpy();
    if (typeof setupButton === 'function') setupButton();
    if (typeof initCopyCode === 'function') initCopyCode();
    if (typeof initSearch === 'function') initSearch();
  }

  /* ======================================================
       Registry-driven boot (single source of truth).
       Builds the sidebar and search index from
       dist/data/zak-components.json when reachable, and
       falls back to the legacy hardcoded refs on error.
       ====================================================== */
  function getDocsPrefix() {
    var path = window.location.pathname;
    return path.indexOf('/dist/components/') !== -1 ? '../../../../' : '';
  }

  function loadRegistry(cb) {
    var target = getDocsPrefix() + 'dist/data/zak-components.json';
    var xreq = new XMLHttpRequest();
    xreq.open('GET', target, true);
    xreq.onreadystatechange = function () {
      if (xreq.readyState !== 4) return;
      if (xreq.status >= 200 && xreq.status < 300) {
        try { cb(JSON.parse(xreq.responseText)); return; } catch (e) { }
      }
      cb(null);
    };
    try { xreq.send(null); } catch (e) { cb(null); }
  }

  function applyRegistryToSearch(reg) {
    if (!reg || !reg.length) return false;
    var p = getDocsPrefix();
    var mapped = reg.map(function (c) {
      return {
        name: componentLabel(c.name),
        category: categoryLabel(c.category),
        description: categoryLabel(c.category) + ' / ' + componentLabel(c.name),
        url: p + 'dist/' + c.path
      };
    });
    searchIndexRef = mapped;
    searchIndex = mapped.map(function (item) {
      return { name: item.name, category: item.category, description: item.description, url: item.url };
    });
    window.ZAKSearchIndex = searchIndexRef;
    return true;
  }

  var CATEGORY_LABELS = {
    ai: 'AI', buttons: 'Buttons', 'data-display': 'Data Display', 'data-grid': 'Data Grid',
    'data-visualization': 'Data Visualization', 'disclosure-expansion': 'Disclosure Expansion',
    feedback: 'Feedback', forms: 'Forms', foundations: 'Foundations', layout: 'Layout',
    media: 'Media', navigation: 'Navigation', overlays: 'Overlays', pickers: 'Pickers', tables: 'Tables'
  };

  var CATEGORY_ORDER = [
    'foundations', 'layout', 'buttons', 'navigation', 'forms',
    'pickers', 'tables', 'media', 'overlays', 'feedback',
    'data-display', 'data-grid', 'disclosure-expansion', 'data-visualization', 'ai'
  ];

  function componentLabel(name) {
    return String(name).replace(/(^|[-\s])([a-z])/g, function (m, lead, ch) {
      return lead + ch.toUpperCase();
    }).replace(/\b(Ai|Ui|Kpi|Fab)\b/g, function (m) { return m.toUpperCase(); });
  }

  function categoryLabel(cat) { return CATEGORY_LABELS[cat] || escapeHtml(cat); }

  function renderRegistrySidebar(reg) {
    var host = document.getElementById('zak-docs-sidebar');
    if (!host) return;
    var p = getDocsPrefix();
    var html = '<nav class="docs-sidebar__nav">';
    html += '<div class="docs-sidebar__section">';
    [
      ['Getting Started', 'getting-started.html'],
      ['Components', 'components.html'],
      ['Utilities Reference', 'utilities.html'],
      ['Templates', 'templates.html'],
      ['Icons Reference', 'icons.html']
    ].forEach(function (item) {
      html += '<a href="' + p + item[1] + '" class="docs-sidebar__link">' + item[0] + '</a>';
    });
    html += '</div>';

    var byCat = {};
    var order = [];
    var currentPath = window.location.pathname;
    var source = (reg && reg.length) ? reg : searchIndexRef.map(function (item) {
      var rel = (item.url || '').replace(/^(?:\.\.\/\.\.\/\.\.\/\.\.\/)+/, '').replace(/^dist\//, '');
      return { name: item.name, category: item.category, path: rel, slug: '' };
    });
    source.forEach(function (c) {
      if (!byCat[c.category]) { byCat[c.category] = []; order.push(c.category); }
      byCat[c.category].push(c);
    });

    /* Keep the user's preferred category sequence (unknown categories
       encountered in the registry are appended at the end). */
    order = order.sort(function (a, b) {
      var ia = CATEGORY_ORDER.indexOf(a);
      var ib = CATEGORY_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a < b ? -1 : a > b ? 1 : 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    /* Sidebar stays open across navigations: start from the user's saved
       open categories, then force-expand the section holding the active
       page so a freshly loaded page never arrives collapsed on its own item. */
    var openCats = getOpenCategories() || [];
    var activeCat = null;
    order.some(function (cat) {
      if (!byCat[cat]) return false;
      var hit = byCat[cat].some(function (c) {
        var url = p + 'dist/' + (c.path || c.url.replace(/^(?:\.\.\/\.\.\/\.\.\/\.\.\/)+/, ''));
        var a = document.createElement('a');
        a.href = url;
        return a.pathname === currentPath;
      });
      if (hit) { activeCat = cat; return true; }
      return false;
    });
    if (activeCat && openCats.indexOf(activeCat) === -1) {
      openCats.push(activeCat);
      setOpenCategories(openCats);
    }

    order.forEach(function (cat) {
      var items = byCat[cat].slice().sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
      var collapsed = openCats.indexOf(cat) === -1;
      html += '<div class="docs-sidebar__section">';
      html += '<button type="button" data-cat="' + cat + '" class="docs-sidebar__category' +
        (collapsed ? ' docs-sidebar__category--collapsed' : '') + '">' +
        categoryLabel(cat) +
        ' <svg class="docs-sidebar__category-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>';
      html += '<ul class="docs-sidebar__links">';
      items.forEach(function (c) {
        var url = p + 'dist/' + (c.path || c.url.replace(/^(?:\.\.\/\.\.\/\.\.\/\.\.\/)+/, ''));
        var a = document.createElement('a');
        a.href = url;
        var active = (a.pathname === currentPath) ? ' docs-sidebar__link--active' : '';
        html += '<li><a href="' + url + '" class="docs-sidebar__link' + active + '">' + escapeHtml(componentLabel(c.name)) + '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '</nav>';
    host.innerHTML = html;
  }

  var bootDocs = function () {
    loadRegistry(function (reg) {
      applyRegistryToSearch(reg);
      renderRegistrySidebar(reg);
      initDocsShell();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootDocs);
  } else {
    bootDocs();
  }
})();
