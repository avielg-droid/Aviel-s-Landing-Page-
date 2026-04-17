/**
 * Dark mode — avielg.com
 * - Respects prefers-color-scheme on first visit
 * - Manual toggle stored in localStorage ('avielg_theme': 'light'|'dark')
 * - Applies data-theme="dark" on <html> before first paint to prevent flash
 * - Injects scoped CSS; does NOT modify inline styles on elements
 * - Works with both homepage nav (.nav-right) and sub-page nav structures
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'avielg_theme';

  /* ── Theme detection ──────────────────────────────────────────── */
  function getPreferredTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /* Apply theme to <html> immediately (before stylesheet parse to kill FOUC) */
  var initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  /* ── Dark mode CSS ────────────────────────────────────────────── */
  function injectCSS() {
    var css = [

      /* ── Root tokens ──────────────────────────────────────────── */
      'html[data-theme="dark"]{',
        '--bg:#0f1713;',        /* very dark teal-tinted  — L≈0.026 */
        '--surface:#141f1b;',   /* slightly lighter dark  */
        '--card:#192421;',      /* card surface           — L≈0.050 */
        '--border:#1e3330;',    /* subtle dark border     */
        '--green:#14b8a6;',     /* teal-500 text color    — 5.7:1 on bg  */
        '--text:#f0fdfb;',      /* near-white teal tint   — 13.5:1 on bg */
        '--muted:#a8b0bb;',     /* gray, 4.8:1 on card    */
        '--orange:#f472b6;',    /* pink-400 text, 5.2:1 on bg */
      '}',

      /* ── Body ──────────────────────────────────────────────────── */
      'html[data-theme="dark"] body{',
        'background:var(--bg);color:var(--text);',
      '}',

      /* ── Dot grid: reduce opacity on dark bg ────────────────────  */
      'html[data-theme="dark"] .hero::before,',
      'html[data-theme="dark"] body::before{',
        'opacity:.15!important;',
      '}',

      /* ── Nav — hardcoded rgba overrides ─────────────────────────  */
      'html[data-theme="dark"] nav{',
        'background:rgba(15,23,19,.92)!important;',
        'border-bottom-color:var(--border)!important;',
      '}',
      'html[data-theme="dark"] nav.scrolled{',
        'background:rgba(10,16,13,.98)!important;',
      '}',
      'html[data-theme="dark"] .nav-links.open{',
        'background:rgba(10,16,13,.98)!important;',
        'border-bottom-color:var(--border)!important;',
      '}',
      'html[data-theme="dark"] .nav-links a:hover{color:var(--text)!important;}',

      /* ── Buttons ─────────────────────────────────────────────────  */
      /*
       * --green in dark mode is teal-500 (#14b8a6).
       * White text on teal-500 = 2.45:1 — FAILS.
       * Override button backgrounds to the original accessible dark teal.
       */
      'html[data-theme="dark"] .btn-primary{',
        'background:#0f766e!important;',
        'box-shadow:0 6px 24px rgba(15,118,110,.3)!important;',
      '}',
      'html[data-theme="dark"] .btn-primary:hover{',
        'box-shadow:0 12px 36px rgba(15,118,110,.45)!important;',
      '}',
      'html[data-theme="dark"] .btn-secondary{',
        'color:var(--text)!important;',
      '}',
      'html[data-theme="dark"] .mode-btn.active{background:#0f766e!important;}',
      /* Marketer toggle: --orange in dark mode is pink-400, too light for white text */
      'html[data-theme="dark"] .mode-btn-marketer.active{background:#be185d!important;}',
      /* Marketer text overrides: use lighter pink for readability */
      'html[data-theme="dark"] .mode-marketer .hero-eyebrow,',
      'html[data-theme="dark"] .mode-marketer .highlight,',
      'html[data-theme="dark"] .mode-marketer .typewriter-text,',
      'html[data-theme="dark"] .mode-marketer .typewriter-cursor{color:#f472b6!important;}',
      'html[data-theme="dark"] .mode-marketer .campaign-status,',
      'html[data-theme="dark"] .mode-marketer .perf-stat-badge,',
      'html[data-theme="dark"] .mode-marketer .why-check{',
        'background:rgba(244,114,182,.1)!important;',
        'color:#f472b6!important;',
        'border-color:rgba(244,114,182,.25)!important;',
      '}',
      'html[data-theme="dark"] .mode-marketer .campaign-status-dot{background:#f472b6!important;}',

      /* ── Skip link ───────────────────────────────────────────────  */
      'html[data-theme="dark"] .skip-link{background:#0f766e!important;}',

      /* ── Perf panel live dot box-shadow ─────────────────────────  */
      'html[data-theme="dark"] .nav-status-dot,',
      'html[data-theme="dark"] .footer-status-dot{',
        'box-shadow:0 0 10px var(--green)!important;',
      '}',

      /* ── CTA band top gradient line ─────────────────────────────  */
      'html[data-theme="dark"] .cta-band::before{',
        'background:linear-gradient(90deg,transparent,var(--green),transparent)!important;',
      '}',

      /* ── Blog post extra surfaces (old purple scheme) ───────────  */
      'html[data-theme="dark"] .result-callout{',
        'background:var(--surface)!important;',
        'border-left-color:var(--green)!important;',
      '}',
      'html[data-theme="dark"] .info-box,',
      'html[data-theme="dark"] .case-study,',
      'html[data-theme="dark"] .comparison-table th{',
        'background:var(--card)!important;',
        'color:var(--text)!important;',
      '}',
      'html[data-theme="dark"] .comparison-table td{',
        'border-color:var(--border)!important;',
        'color:var(--text)!important;',
      '}',
      'html[data-theme="dark"] table{border-color:var(--border)!important;}',

      /* ── Logo carousel: invert so white bgs blend into dark bg ────  */
      'html[data-theme="dark"] .logo-item img{',
        'filter:grayscale(100%) invert(1) opacity(.55)!important;',
      '}',
      'html[data-theme="dark"] .logo-item img:hover{',
        'filter:grayscale(20%) invert(1) opacity(1)!important;',
      '}',

      /* ── Footer social buttons stay branded ─────────────────────  */
      'html[data-theme="dark"] .s-linkedin{background:#0a66c2!important;}',
      'html[data-theme="dark"] .s-whatsapp{background:#128c7e!important;}',

      /* ── Cookie consent banner ───────────────────────────────────  */
      'html[data-theme="dark"] #cookie-consent-banner{',
        'background:#192421!important;',
        'border-color:#1e3330!important;',
        'color:#a8b0bb!important;',
        'box-shadow:0 8px 32px rgba(0,0,0,.4)!important;',
      '}',
      'html[data-theme="dark"] #cookie-consent-banner .ccb-text{color:#a8b0bb!important;}',
      'html[data-theme="dark"] #cookie-consent-banner .ccb-text strong{color:#f0fdfb!important;}',
      'html[data-theme="dark"] #cookie-consent-banner .ccb-decline{',
        'border-color:#1e3330!important;color:#a8b0bb!important;background:#192421!important;',
      '}',

      /* ── Accessibility toolbar ───────────────────────────────────  */
      'html[data-theme="dark"] #a11y-tb{',
        'background:#192421!important;border-color:#2a4a45!important;',
      '}',
      'html[data-theme="dark"] .a11y-row{border-bottom-color:#1e3330!important;}',
      'html[data-theme="dark"] .a11y-lbl{color:#a8b0bb!important;}',
      'html[data-theme="dark"] .a11y-fb{',
        'background:#141f1b!important;border-color:#1e3330!important;color:#f0fdfb!important;',
      '}',
      'html[data-theme="dark"] .a11y-fb:hover:not(:disabled){',
        'background:#0f1713!important;border-color:#14b8a6!important;color:#14b8a6!important;',
      '}',
      'html[data-theme="dark"] #a11y-font-val{color:#a8b0bb!important;}',
      'html[data-theme="dark"] .a11y-sw{background:#1e3330!important;}',
      'html[data-theme="dark"] .a11y-sw[aria-pressed="true"]{background:#1d4ed8!important;}',
      'html[data-theme="dark"] .a11y-reset{',
        'background:#141f1b!important;border-color:#1e3330!important;color:#a8b0bb!important;',
      '}',

      /* ── Theme toggle button ─────────────────────────────────────  */
      '#theme-toggle{',
        'display:inline-flex;align-items:center;justify-content:center;',
        'width:34px;height:34px;border-radius:8px;',
        'background:transparent;',
        'border:1px solid var(--border);',
        'color:var(--muted);',
        'cursor:pointer;',
        'transition:background .2s,color .2s,border-color .2s;',
        'flex-shrink:0;',
      '}',
      '#theme-toggle:hover{',
        'background:var(--surface);',
        'color:var(--text);',
        'border-color:var(--green);',
      '}',
      '#theme-toggle svg{display:block;pointer-events:none;}',

      /* On mobile, hide toggle when hamburger is hidden — always show it */
      '@media(max-width:900px){',
        '.nav-right{gap:8px!important;}',
      '}',

      /* ── Transition: smooth theme switch ────────────────────────  */
      'html.theme-transitioning *{',
        'transition:',
          'background-color .25s ease,',
          'color .2s ease,',
          'border-color .2s ease,',
          'box-shadow .2s ease',
          '!important;',
      '}',

    ].join('');

    var style = document.createElement('style');
    style.id = 'theme-css';
    style.textContent = css;
    /* Insert as first style so page CSS can still override if needed */
    var firstStyle = document.head.querySelector('style,link[rel="stylesheet"]');
    if (firstStyle) document.head.insertBefore(style, firstStyle);
    else document.head.appendChild(style);
  }

  /* ── Toggle ───────────────────────────────────────────────────── */
  var MOON_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SUN_ICON  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

  function setTheme(theme, persist) {
    /* Smooth transition class */
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(function () {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);

    document.documentElement.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var dark = theme === 'dark';
      btn.innerHTML = dark ? SUN_ICON : MOON_ICON;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', String(dark));
    }
  }

  function toggleTheme() {
    setTheme(isDark() ? 'light' : 'dark', true);
  }

  /* ── Inject toggle button into nav ───────────────────────────── */
  function addToggleButton() {
    if (document.getElementById('theme-toggle')) return;

    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-pressed', String(isDark()));
    btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = isDark() ? SUN_ICON : MOON_ICON;
    btn.addEventListener('click', toggleTheme);

    /* Homepage: .nav-right exists; insert before hamburger */
    var navRight  = document.querySelector('.nav-right');
    var hamburger = document.getElementById('navHamburger');

    if (navRight && hamburger) {
      navRight.insertBefore(btn, hamburger);
    } else if (navRight) {
      navRight.appendChild(btn);
    } else {
      /* Sub-pages: flat nav — insert before nav-links */
      var navLinks = document.querySelector('nav .nav-links');
      if (navLinks) navLinks.parentNode.insertBefore(btn, navLinks);
      else {
        var navEl = document.querySelector('nav');
        if (navEl) navEl.appendChild(btn);
      }
    }
  }

  /* ── Listen for system preference changes ─────────────────────── */
  var mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', function (e) {
    /* Only follow system if user hasn't set a manual preference */
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  /* ── Init ─────────────────────────────────────────────────────── */
  injectCSS();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToggleButton);
  } else {
    addToggleButton();
  }

})();
