/**
 * AI-DISPO® Multilingual Translation & Selector Engine
 * Powered by Google Translate Client API with Custom UI Overlay
 */

(function () {
  const LANGUAGES = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v40 M0,20 h60" stroke="#fff" stroke-width="12"/><path d="M30,0 v40 M0,20 h60" stroke="#C8102E" stroke-width="6"/></svg>`
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#006C35"/><circle cx="30" cy="18" r="8" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M20,28 h20" stroke="#fff" stroke-width="2" stroke-linecap="round"/><text x="30" y="21" font-size="8" fill="#fff" text-anchor="middle" font-weight="bold">عربي</text></svg>`
    },
    {
      code: 'zh-CN',
      name: 'Chinese (Simplified)',
      nativeName: '简体中文',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#DE2910"/><polygon points="10,6 12,12 18,12 13,16 15,22 10,18 5,22 7,16 2,12 8,12" fill="#FFDE00"/><circle cx="20" cy="6" r="1.5" fill="#FFDE00"/><circle cx="24" cy="10" r="1.5" fill="#FFDE00"/><circle cx="24" cy="16" r="1.5" fill="#FFDE00"/><circle cx="20" cy="20" r="1.5" fill="#FFDE00"/></svg>`
    },
    {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="13.33" fill="#AE1C28"/><rect y="13.33" width="60" height="13.33" fill="#FFFFFF"/><rect y="26.66" width="60" height="13.34" fill="#21468B"/></svg>`
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#FFFFFF"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>`
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="13.33" fill="#000000"/><rect y="13.33" width="60" height="13.33" fill="#DD0000"/><rect y="26.66" width="60" height="13.34" fill="#FFCE00"/></svg>`
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#FFFFFF"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>`
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/><circle cx="16" cy="20" r="4" fill="#AA151B"/></svg>`
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="13.33" fill="#FFFFFF"/><rect y="13.33" width="60" height="13.33" fill="#0039A6"/><rect y="26.66" width="60" height="13.34" fill="#D52B1E"/></svg>`
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="24" height="40" fill="#006600"/><rect x="24" width="36" height="40" fill="#FF0000"/><circle cx="24" cy="20" r="6" fill="#FFFF00"/><circle cx="24" cy="20" r="4" fill="#FFFFFF"/><rect x="22" y="18" width="4" height="4" fill="#0000FF"/></svg>`
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="13.33" fill="#FF9933"/><rect y="13.33" width="60" height="13.33" fill="#FFFFFF"/><rect y="26.66" width="60" height="13.34" fill="#138808"/><circle cx="30" cy="20" r="4.5" fill="none" stroke="#000080" stroke-width="1.2"/><circle cx="30" cy="20" r="1" fill="#000080"/></svg>`
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: `<svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/><circle cx="30" cy="20" r="9" fill="#BC002D"/></svg>`
    }
  ];

  // Helper to read cookie
  function getLanguageCookie() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (!match) return 'en';
    const parts = decodeURIComponent(match[1]).split('/');
    return parts[parts.length - 1] || 'en';
  }

  // Set translation cookie and trigger translation
  function setLanguage(langCode) {
    const current = getLanguageCookie();
    if (current === langCode) return;

    // Set cookie for current domain and root path
    const host = window.location.hostname;
    const isIpOrLocal = host === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);

    if (langCode === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (!isIpOrLocal) {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + host + "; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + host.replace(/^www\./, '') + "; path=/;";
      }
      document.cookie = "googtrans=/en/en; path=/;";
    } else {
      document.cookie = "googtrans=/en/" + langCode + "; path=/;";
      if (!isIpOrLocal) {
        document.cookie = "googtrans=/en/" + langCode + "; domain=" + host + "; path=/;";
        document.cookie = "googtrans=/en/" + langCode + "; domain=." + host.replace(/^www\./, '') + "; path=/;";
      }
    }

    localStorage.setItem('aidispo_selected_lang', langCode);

    // If google translate select element is available, trigger it directly
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
      updateAllLanguageWidgets(langCode);
    } else {
      // Reload to apply Google Translate translation from cookie
      window.location.reload();
    }
  }

  // Update UI widgets
  function updateAllLanguageWidgets(activeCode) {
    const activeLang = LANGUAGES.find(l => l.code.toLowerCase() === activeCode.toLowerCase()) || LANGUAGES[0];
    const displayCode = (activeLang.code === 'zh-CN' ? 'ZH' : activeLang.code).toUpperCase();

    // Update triggers
    document.querySelectorAll('.lang-btn-current-flag').forEach(el => {
      el.innerHTML = activeLang.flag;
    });
    document.querySelectorAll('.lang-btn-current-code').forEach(el => {
      el.textContent = displayCode;
    });

    // Update active highlight in dropdowns
    document.querySelectorAll('.lang-option-item').forEach(item => {
      const itemCode = item.getAttribute('data-lang');
      if (itemCode === activeLang.code) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Generate Dropdown Menu HTML
  function renderDropdownMenuHtml() {
    return LANGUAGES.map(l => `
      <button type="button" class="lang-option-item" data-lang="${l.code}" role="menuitem">
        <span class="lang-option-flag">${l.flag}</span>
        <span class="lang-option-name">${l.name}</span>
      </button>
    `).join('');
  }

  // Init Language Switcher Widgets on Page
  function initLanguageSwitcher() {
    // 1. Create hidden google translate element if not present
    if (!document.getElementById('google_translate_element')) {
      const gtDiv = document.createElement('div');
      gtDiv.id = 'google_translate_element';
      gtDiv.style.display = 'none';
      document.body.appendChild(gtDiv);
    }

    // 2. Render dropdown items into all .lang-dropdown-inner elements
    const dropdownInners = document.querySelectorAll('.lang-dropdown-inner');
    const menuHtml = renderDropdownMenuHtml();
    dropdownInners.forEach(container => {
      container.innerHTML = menuHtml;
    });

    // 3. Bind click events for dropdown items
    document.querySelectorAll('.lang-option-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const code = btn.getAttribute('data-lang');
        closeAllDropdowns();
        setLanguage(code);
      });
    });

    // 4. Bind Toggle Buttons
    document.querySelectorAll('.lang-switcher-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wrap = trigger.closest('.lang-switcher-wrap');
        const isOpen = wrap.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          wrap.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // 5. Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-switcher-wrap')) {
        closeAllDropdowns();
      }
    });

    // 6. Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    // 7. Sync initial active state
    let activeCode = getLanguageCookie();
    const saved = localStorage.getItem('aidispo_selected_lang');
    if (saved && (!activeCode || activeCode === 'en') && saved !== 'en') {
      activeCode = saved;
    }
    updateAllLanguageWidgets(activeCode);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.lang-switcher-wrap.open').forEach(wrap => {
      wrap.classList.remove('open');
      const trigger = wrap.querySelector('.lang-switcher-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Global Google Translate Init Callback
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,zh-CN,nl,fr,de,it,es,ru,pt,hi,ja,en',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    } catch (err) {
      console.warn('Google translate init:', err);
    }
  };

  // Inject Google Translate script dynamically if not present
  function loadGoogleTranslateScript() {
    if (document.getElementById('google-translate-script')) return;
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLanguageSwitcher();
      loadGoogleTranslateScript();
    });
  } else {
    initLanguageSwitcher();
    loadGoogleTranslateScript();
  }
})();
