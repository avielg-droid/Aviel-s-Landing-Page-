/**
 * Accessibility Toolbar — avielg.com
 * Self-contained. No dependencies. Injects its own styles.
 * Persists settings in localStorage under key 'avielg_a11y'.
 * Does NOT touch or override the page's :focus-visible rules.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'avielg_a11y';
  var FONT_SIZES  = [90, 100, 115, 130];  // %, index 1 = default

  var state = { fontSize: 1, highContrast: false, highlightLinks: false };

  /* ── Persistence ─────────────────────────────────────────────── */
  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (typeof s.fontSize      === 'number')  state.fontSize      = Math.max(0, Math.min(FONT_SIZES.length - 1, s.fontSize));
      if (typeof s.highContrast  === 'boolean') state.highContrast  = s.highContrast;
      if (typeof s.highlightLinks=== 'boolean') state.highlightLinks= s.highlightLinks;
    } catch (e) {}
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ── Apply state to document ─────────────────────────────────── */
  function applyState() {
    var html = document.documentElement;

    // Font size — scale root em
    html.style.fontSize = FONT_SIZES[state.fontSize] + '%';

    // High contrast / link highlight — CSS class toggles
    html.classList.toggle('a11y-hc', state.highContrast);
    html.classList.toggle('a11y-hl', state.highlightLinks);

    // Sync toolbar controls if they exist
    var tb = document.getElementById('a11y-tb');
    if (!tb) return;
    var btnContrast = document.getElementById('a11y-sw-contrast');
    var btnLinks    = document.getElementById('a11y-sw-links');
    var btnDec      = document.getElementById('a11y-font-dec');
    var btnInc      = document.getElementById('a11y-font-inc');
    var indicator   = document.getElementById('a11y-font-val');

    btnContrast.setAttribute('aria-pressed', String(state.highContrast));
    btnLinks.setAttribute('aria-pressed',    String(state.highlightLinks));
    btnDec.disabled = (state.fontSize === 0);
    btnInc.disabled = (state.fontSize === FONT_SIZES.length - 1);
    indicator.textContent = FONT_SIZES[state.fontSize] + '%';

    // Announce change to screen readers
    var live = document.getElementById('a11y-live');
    if (live) {
      live.textContent = '';
      setTimeout(function () {
        live.textContent =
          'Text size: ' + FONT_SIZES[state.fontSize] + '%. ' +
          'High contrast: ' + (state.highContrast  ? 'on' : 'off') + '. ' +
          'Link highlight: ' + (state.highlightLinks ? 'on' : 'off') + '.';
      }, 50);
    }
  }

  /* ── CSS ─────────────────────────────────────────────────────── */
  function injectCSS() {
    var css = [
      /* ── Widget chrome ────────────────────────────────── */
      '#a11y-wrap{',
        'position:fixed;bottom:112px;right:20px;z-index:9990;',
        'font-family:"JetBrains Mono","Courier New",monospace;',
        'display:flex;flex-direction:column;align-items:flex-end;gap:8px;',
      '}',

      /* Toggle button */
      '#a11y-open{',
        'width:44px;height:44px;border-radius:50%;',
        'background:#1d4ed8;color:#fff;border:2px solid #fff;',
        'cursor:pointer;display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 4px 16px rgba(29,78,216,.45);',
        'transition:background .2s,transform .15s;',
        'flex-shrink:0;',
      '}',
      '#a11y-open:hover{background:#1e40af;transform:scale(1.07);}',
      '#a11y-open:active{transform:scale(.96);}',
      /* preserve existing :focus-visible — just round the outline */
      '#a11y-open:focus-visible{border-radius:50%;}',

      /* Panel */
      '#a11y-tb{',
        'display:none;background:#fff;',
        'border:2px solid #1d4ed8;border-radius:12px;',
        'box-shadow:0 8px 40px rgba(0,0,0,.2);',
        'overflow:hidden;min-width:248px;',
      '}',
      '#a11y-tb[aria-hidden="false"]{display:block;}',

      /* Panel header */
      '.a11y-hdr{',
        'background:#1d4ed8;color:#fff;',
        'padding:10px 16px;',
        'font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;',
        'display:flex;align-items:center;gap:8px;',
      '}',
      '.a11y-hdr svg{flex-shrink:0;}',

      /* Section rows */
      '.a11y-row{',
        'padding:12px 16px;',
        'border-bottom:1px solid #e5e7eb;',
      '}',
      '.a11y-row:last-child{border-bottom:none;}',

      /* Row label */
      '.a11y-lbl{',
        'font-size:.68rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;',
        'color:#374151;margin-bottom:8px;display:block;',
      '}',

      /* Font size controls */
      '.a11y-font-row{display:flex;align-items:center;gap:6px;}',
      '.a11y-fb{',
        'flex:1;padding:8px 0;',
        'border:1px solid #d1d5db;border-radius:6px;',
        'background:#f9fafb;color:#111827;',
        'cursor:pointer;font-family:inherit;',
        'font-size:.85rem;font-weight:700;',
        'transition:background .15s,border-color .15s,color .15s;',
      '}',
      '.a11y-fb:hover:not(:disabled){background:#eff6ff;border-color:#1d4ed8;color:#1d4ed8;}',
      '.a11y-fb:disabled{opacity:.35;cursor:not-allowed;}',
      '#a11y-font-val{',
        'font-size:.72rem;color:#6b7280;',
        'min-width:38px;text-align:center;flex-shrink:0;',
      '}',

      /* Toggle switch */
      '.a11y-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}',
      '.a11y-toggle-row .a11y-lbl{margin:0;cursor:pointer;}',
      '.a11y-sw{',
        'position:relative;width:42px;height:24px;',
        'background:#d1d5db;border:none;border-radius:100px;',
        'cursor:pointer;padding:0;transition:background .2s;flex-shrink:0;',
      '}',
      '.a11y-sw::after{',
        'content:"";position:absolute;',
        'top:3px;left:3px;width:18px;height:18px;',
        'border-radius:50%;background:#fff;',
        'box-shadow:0 1px 4px rgba(0,0,0,.25);',
        'transition:transform .2s;',
      '}',
      '.a11y-sw[aria-pressed="true"]{background:#1d4ed8;}',
      '.a11y-sw[aria-pressed="true"]::after{transform:translateX(18px);}',
      /* focus ring inherits from page :focus-visible — no extra rule needed */

      /* Reset button */
      '.a11y-reset{',
        'width:100%;padding:9px;',
        'border:1px solid #d1d5db;border-radius:6px;',
        'background:#f9fafb;color:#6b7280;',
        'cursor:pointer;font-family:inherit;',
        'font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;',
        'transition:background .15s,color .15s,border-color .15s;',
      '}',
      '.a11y-reset:hover{background:#fee2e2;color:#b91c1c;border-color:#fca5a5;}',

      /* SR-only live region */
      '#a11y-live{',
        'position:absolute;width:1px;height:1px;',
        'padding:0;margin:-1px;overflow:hidden;',
        'clip:rect(0,0,0,0);white-space:nowrap;border:0;',
      '}',

      /* ── High contrast mode ──────────────────────────── */
      /*
       * Override CSS custom properties at root — the site uses them everywhere.
       * Hardcoded colours handled with targeted selectors below.
       * The #a11y-wrap toolbar is always excluded.
       */
      'html.a11y-hc{',
        '--bg:#000 !important;--surface:#0d0d0d !important;',
        '--card:#0d0d0d !important;--border:#555 !important;',
        '--text:#fff !important;--muted:#ccc !important;',
      '}',
      'html.a11y-hc body{background:#000 !important;color:#fff !important;}',

      /* Hardcoded nav / section backgrounds */
      'html.a11y-hc nav:not(#a11y-wrap *){',
        'background:rgba(0,0,0,.96) !important;',
        'border-bottom-color:#555 !important;',
      '}',
      'html.a11y-hc nav.scrolled:not(#a11y-wrap *){background:#000 !important;}',

      /* Cards and panels */
      'html.a11y-hc .perf-panel:not(#a11y-wrap *),'  ,
      'html.a11y-hc .why-item:not(#a11y-wrap *),'    ,
      'html.a11y-hc .campaign-row:not(#a11y-wrap *),' ,
      'html.a11y-hc .cta-band:not(#a11y-wrap *),'    ,
      'html.a11y-hc .services-table:not(#a11y-wrap *){'  ,
        'background:#0d0d0d !important;border-color:#555 !important;',
      '}',

      /* Buttons */
      'html.a11y-hc .btn-primary:not(#a11y-wrap *){background:#1d4ed8 !important;color:#fff !important;}',
      'html.a11y-hc .btn-secondary:not(#a11y-wrap *){border-color:#888 !important;color:#fff !important;}',
      'html.a11y-hc .btn-linkedin:not(#a11y-wrap *){background:#0a66c2 !important;}',
      'html.a11y-hc .btn-whatsapp:not(#a11y-wrap *){background:#128c7e !important;}',

      /* Links */
      'html.a11y-hc a:not(#a11y-wrap *){color:#93c5fd !important;text-decoration:underline !important;}',

      /* Focus ring in high-contrast: change to amber so it's visible on dark bg */
      'html.a11y-hc :focus-visible{',
        'outline:3px solid #fbbf24 !important;',
        'box-shadow:0 0 0 1px #000 !important;',
      '}',

      /* Images: add border so they stand out on dark bg */
      'html.a11y-hc img:not(#a11y-wrap *){',
        'filter:brightness(.9) contrast(1.1);',
        'border:1px solid #555;',
      '}',

      /* Logo carousel: re-saturate (they're greyscale by default) */
      'html.a11y-hc .logo-item img:not(#a11y-wrap *){',
        'filter:grayscale(0%) brightness(1.2) !important;',
      '}',

      /* Mode badges (green/orange on tinted bg) — force readable */
      'html.a11y-hc .campaign-status:not(#a11y-wrap *),'  ,
      'html.a11y-hc .perf-stat-badge:not(#a11y-wrap *),'  ,
      'html.a11y-hc .why-check:not(#a11y-wrap *),'        ,
      'html.a11y-hc .perf-panel-footer:not(#a11y-wrap *){',
        'background:#0d0d0d !important;',
      '}',

      /* Blog post / sub-page old purple scheme */
      'html.a11y-hc .post-header:not(#a11y-wrap *),'   ,
      'html.a11y-hc .post-content:not(#a11y-wrap *),'  ,
      'html.a11y-hc .post-card:not(#a11y-wrap *),'     ,
      'html.a11y-hc .blog-header:not(#a11y-wrap *){',
        'background:#000 !important;color:#fff !important;',
      '}',

      /* ── Link highlight mode ─────────────────────────── */
      'html.a11y-hl a:not(#a11y-wrap *){',
        'background:#fef08a !important;',
        'color:#000 !important;',
        'text-decoration:underline !important;',
        'text-decoration-thickness:2px !important;',
        'text-underline-offset:2px !important;',
        'border-radius:2px !important;',
        'padding:0 2px !important;',
        'outline:1px solid #ca8a04 !important;',
        'outline-offset:1px !important;',
      '}',
      /* Keep focus ring visible over the yellow */
      'html.a11y-hl a:focus-visible:not(#a11y-wrap *){',
        'outline:3px solid #1d4ed8 !important;',
        'outline-offset:3px !important;',
        'box-shadow:0 0 0 1px #fff !important;',
      '}',
    ].join('');

    var style = document.createElement('style');
    style.id = 'a11y-toolbar-css';
    style.textContent = css;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /* ── HTML ────────────────────────────────────────────────────── */
  function buildHTML() {
    var wrap = document.createElement('div');
    wrap.id = 'a11y-wrap';
    wrap.innerHTML = [
      /* Live region for SR announcements */
      '<div id="a11y-live" role="status" aria-live="polite" aria-atomic="true"></div>',

      /* Panel (hidden by default) */
      '<div id="a11y-tb" role="dialog" aria-modal="false" aria-label="Accessibility options" aria-hidden="true">',

        '<div class="a11y-hdr" aria-hidden="true">',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">',
            '<circle cx="12" cy="4" r="2"/>',
            '<path d="M9 9h6M12 9v11M9 20l3-4 3 4M6 12l6-3 6 3"/>',
          '</svg>',
          'Accessibility',
        '</div>',

        /* Text size */
        '<div class="a11y-row">',
          '<span class="a11y-lbl" id="a11y-font-lbl">Text size</span>',
          '<div class="a11y-font-row" role="group" aria-labelledby="a11y-font-lbl">',
            '<button class="a11y-fb" id="a11y-font-dec" aria-label="Decrease text size">A&minus;</button>',
            '<span id="a11y-font-val" aria-live="polite" aria-label="Current text size: 100%">100%</span>',
            '<button class="a11y-fb" id="a11y-font-inc" aria-label="Increase text size">A+</button>',
          '</div>',
        '</div>',

        /* High contrast */
        '<div class="a11y-row">',
          '<div class="a11y-toggle-row">',
            '<label class="a11y-lbl" for="a11y-sw-contrast">High contrast</label>',
            '<button class="a11y-sw" id="a11y-sw-contrast" role="switch" aria-pressed="false" aria-label="Toggle high contrast mode"></button>',
          '</div>',
        '</div>',

        /* Highlight links */
        '<div class="a11y-row">',
          '<div class="a11y-toggle-row">',
            '<label class="a11y-lbl" for="a11y-sw-links">Highlight links</label>',
            '<button class="a11y-sw" id="a11y-sw-links" role="switch" aria-pressed="false" aria-label="Toggle link highlighting"></button>',
          '</div>',
        '</div>',

        /* Reset */
        '<div class="a11y-row">',
          '<button class="a11y-reset" id="a11y-reset" aria-label="Reset all accessibility settings to default">Reset all</button>',
        '</div>',

      '</div>',

      /* Toggle button */
      '<button id="a11y-open" aria-label="Open accessibility toolbar" aria-expanded="false" aria-controls="a11y-tb">',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">',
          '<circle cx="12" cy="4" r="2"/>',
          '<path d="M9 9h6M12 9v11M9 20l3-4 3 4"/>',
          '<path d="M6 12l6-3 6 3"/>',
        '</svg>',
      '</button>',
    ].join('');

    document.body.appendChild(wrap);

    /* ── Event wiring ──────────────────────────────────── */
    var toggleBtn = document.getElementById('a11y-open');
    var panel     = document.getElementById('a11y-tb');

    function openPanel() {
      panel.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close accessibility toolbar');
      // Focus first interactive element inside
      document.getElementById('a11y-font-dec').focus();
    }
    function closePanel() {
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open accessibility toolbar');
    }

    toggleBtn.addEventListener('click', function () {
      if (panel.getAttribute('aria-hidden') === 'false') closePanel();
      else openPanel();
    });

    // Close on Escape from anywhere inside the toolbar
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanel();
        toggleBtn.focus();
      }
    });

    // Close when focus leaves the toolbar entirely
    wrap.addEventListener('focusout', function (e) {
      if (!wrap.contains(e.relatedTarget)) {
        closePanel();
      }
    });

    // Font size
    document.getElementById('a11y-font-dec').addEventListener('click', function () {
      if (state.fontSize > 0) { state.fontSize--; saveState(); applyState(); }
    });
    document.getElementById('a11y-font-inc').addEventListener('click', function () {
      if (state.fontSize < FONT_SIZES.length - 1) { state.fontSize++; saveState(); applyState(); }
    });

    // High contrast
    document.getElementById('a11y-sw-contrast').addEventListener('click', function () {
      state.highContrast = !state.highContrast;
      saveState(); applyState();
    });

    // Highlight links
    document.getElementById('a11y-sw-links').addEventListener('click', function () {
      state.highlightLinks = !state.highlightLinks;
      saveState(); applyState();
    });

    // Reset
    document.getElementById('a11y-reset').addEventListener('click', function () {
      state = { fontSize: 1, highContrast: false, highlightLinks: false };
      saveState(); applyState();
      // announce to SR
      var live = document.getElementById('a11y-live');
      if (live) { live.textContent = ''; setTimeout(function(){ live.textContent = 'Accessibility settings reset to default.'; }, 50); }
    });
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  loadState();
  injectCSS();

  // Apply font size + classes before paint to avoid flash
  document.documentElement.style.fontSize = FONT_SIZES[state.fontSize] + '%';
  document.documentElement.classList.toggle('a11y-hc', state.highContrast);
  document.documentElement.classList.toggle('a11y-hl', state.highlightLinks);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildHTML(); applyState(); });
  } else {
    buildHTML();
    applyState();
  }

})();
