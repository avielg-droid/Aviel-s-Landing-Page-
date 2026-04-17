(function () {
  'use strict';

  var STORAGE_KEY = 'avielg_consent';
  var CONSENT_VERSION = '1';

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data.analytics; // true | false
    } catch (e) {
      return null;
    }
  }

  function setConsent(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        analytics: analytics,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function loadVercelAnalytics() {
    if (document.querySelector('script[src*="/_vercel/insights"]')) return;
    var s = document.createElement('script');
    s.src = '/_vercel/insights/script.js';
    s.defer = true;
    document.head.appendChild(s);
  }

  function removeBanner() {
    var el = document.getElementById('cookie-consent-banner');
    if (el) {
      el.style.transform = 'translateY(calc(100% + 24px))';
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
    }
  }

  function accept() {
    setConsent(true);
    loadVercelAnalytics();
    removeBanner();
  }

  function decline() {
    setConsent(false);
    removeBanner();
  }

  function showBanner() {
    var css = [
      '#cookie-consent-banner {',
      '  position: fixed; bottom: 24px; left: 50%; z-index: 9999;',
      '  transform: translateX(-50%) translateY(0);',
      '  width: min(680px, calc(100vw - 32px));',
      '  background: #FAFFFE;',
      '  border: 1px solid #CCEAE7;',
      '  border-radius: 14px;',
      '  padding: 20px 24px;',
      '  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;',
      '  box-shadow: 0 8px 32px rgba(13,148,136,.12), 0 2px 8px rgba(13,148,136,.08);',
      '  font-family: "Roboto Flex", sans-serif;',
      '  font-size: .875rem; line-height: 1.55; color: #374151;',
      '  transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .35s ease;',
      '}',
      '#cookie-consent-banner .ccb-text { flex: 1; min-width: 200px; }',
      '#cookie-consent-banner .ccb-text strong { color: #111827; font-weight: 600; display: block; margin-bottom: 4px; font-family: "JetBrains Mono", monospace; font-size: .78rem; letter-spacing: .05em; text-transform: uppercase; }',
      '#cookie-consent-banner .ccb-text a { color: #0f766e; text-underline-offset: 3px; }',
      '#cookie-consent-banner .ccb-actions { display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap; }',
      '#cookie-consent-banner .ccb-accept {',
      '  background: #0f766e; color: #fff; border: none; border-radius: 8px;',
      '  padding: 9px 20px; font-size: .82rem; font-weight: 600; cursor: pointer;',
      '  font-family: "Roboto Flex", sans-serif; letter-spacing: .02em;',
      '  transition: background .2s, transform .15s;',
      '}',
      '#cookie-consent-banner .ccb-accept:hover { background: #0c5e57; }',
      '#cookie-consent-banner .ccb-accept:active { transform: scale(.97); }',
      '#cookie-consent-banner .ccb-decline {',
      '  background: transparent; color: #6B7280; border: 1px solid #CCEAE7; border-radius: 8px;',
      '  padding: 9px 16px; font-size: .82rem; font-weight: 500; cursor: pointer;',
      '  font-family: "Roboto Flex", sans-serif;',
      '  transition: border-color .2s, color .2s, transform .15s;',
      '}',
      '#cookie-consent-banner .ccb-decline:hover { border-color: #0f766e; color: #0f766e; }',
      '#cookie-consent-banner .ccb-decline:active { transform: scale(.97); }',
      '#cookie-consent-banner .ccb-accept:focus-visible, #cookie-consent-banner .ccb-decline:focus-visible {',
      '  outline: 3px solid #1d4ed8; outline-offset: 3px; box-shadow: 0 0 0 1px #fff;',
      '}',
      '@media (max-width: 480px) {',
      '  #cookie-consent-banner { bottom: 16px; padding: 16px; }',
      '  #cookie-consent-banner .ccb-actions { width: 100%; }',
      '  #cookie-consent-banner .ccb-accept, #cookie-consent-banner .ccb-decline { flex: 1; text-align: center; }',
      '}'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = [
      '<div class="ccb-text">',
      '  <strong>Cookie preferences</strong>',
      '  This site uses analytics to understand how visitors use it. No advertising trackers. <a href="/privacy/">Privacy policy</a>.',
      '</div>',
      '<div class="ccb-actions">',
      '  <button class="ccb-accept" id="ccb-accept-btn">Accept analytics</button>',
      '  <button class="ccb-decline" id="ccb-decline-btn">Decline</button>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    document.getElementById('ccb-accept-btn').addEventListener('click', accept);
    document.getElementById('ccb-decline-btn').addEventListener('click', decline);
  }

  // Entry point
  var consent = getConsent();

  if (consent === true) {
    loadVercelAnalytics();
  } else if (consent === null) {
    // No decision yet — show banner after page paint
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  // consent === false: do nothing (user declined)

})();
