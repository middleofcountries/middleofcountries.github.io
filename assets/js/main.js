// Theme, Language and Responsive Nav
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const langSwitch = document.getElementById('lang-switch');

  // Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeButton(theme);
    });
  }

  function updateThemeButton(theme) {
    if (!themeToggle) return;
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Language
  let currentLang = localStorage.getItem('lang') || 'en';
  if (langSwitch) langSwitch.value = currentLang;

  // Update language select labels to full English names (for pages with short codes)
  const LANG_LABELS = {
    en: 'English', tr: 'Turkish', es: 'Spanish', fr: 'French', de: 'German', ru: 'Russian', zh: 'Chinese', ar: 'Arabic', pt: 'Portuguese', it: 'Italian', ja: 'Japanese', ko: 'Korean', hi: 'Hindi'
  };
  if (langSwitch) {
    Array.from(langSwitch.querySelectorAll('option')).forEach(opt => {
      if (LANG_LABELS[opt.value]) opt.textContent = LANG_LABELS[opt.value];
    });
  }

  function getNested(obj, path) {
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : null, obj);
  }

  function applyTranslations(dataRoot, lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.getAttribute('data-lang');
      const val = getNested(dataRoot, key);
      if (val !== null) {
        // inputs: placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', val);
        } else if (el.tagName === 'BUTTON') {
          el.textContent = val;
          if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', val);
        } else if (el.tagName === 'OPTION') {
          el.textContent = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // If there's a no-results element present, update it from translations
    const noEl = document.getElementById('no-results');
    const noText = getNested(dataRoot, 'countries.search.noResults');
    if (noEl && noText) noEl.textContent = noText;
  }

  function loadLanguage(lang) {
    // choose correct relative prefix for pages under /countries/ vs root
    const prefix = location.pathname.includes('/countries/') ? '../' : '';
    return fetch(`${prefix}assets/lang/${lang}.json`)
      .then(r => r.json())
      .then(data => {
        // file contains top-level language keys (e.g. data.en)
        const root = data[lang] || data;
        applyTranslations(root, lang);
        // Expose loaded translations root for other scripts
        window.__langRoot = root;
        // set document language attribute and og:locale
        document.documentElement.setAttribute('lang', lang);
        const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
        if (ogLocaleMeta) ogLocaleMeta.setAttribute('content', lang);
      })
      .catch(err => console.warn('Language load failed', err));
  }

  if (langSwitch) {
    langSwitch.addEventListener('change', function() {
      currentLang = this.value;
      localStorage.setItem('lang', currentLang);
      loadLanguage(currentLang);
    });
  }

  // initial load
  loadLanguage(currentLang);

  // SEO: inject keywords meta and JSON-LD for list of countries
  try {
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    const countriesList = (typeof COUNTRIES !== 'undefined') ? COUNTRIES : [];
    const kws = countriesList.join(', ');
    if (!keywordsMeta) {
      const m = document.createElement('meta');
      m.name = 'keywords';
      m.content = kws;
      document.head.appendChild(m);
    } else {
      keywordsMeta.content = kws;
    }

    // JSON-LD: itemList of countries
    const existingJsonLd = document.getElementById('countries-jsonld');
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": countriesList.map((c, i) => ({
        "@type": "ListItem",
        "position": i+1,
        "url": window.location.origin + window.location.pathname.replace(/index.html$/, '') + 'countries/right-in-the-middle-of-' + (c.normalize ? c.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') : c).toLowerCase().replace(/[^0-9a-zA-Z\s\-]/g,'').trim().replace(/\s+/g,'-') + '.html',
        "name": c
      }))
    };
    if (!existingJsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = 'countries-jsonld';
      s.textContent = JSON.stringify(itemList);
      document.head.appendChild(s);
    } else {
      existingJsonLd.textContent = JSON.stringify(itemList);
    }
  } catch (err) {
    console.warn('SEO injection failed', err);
  }

  // Responsive nav toggle (inject if missing)
  const header = document.querySelector('.header-content');
  if (header) {
    if (!document.getElementById('nav-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'nav-toggle';
      btn.className = 'nav-toggle';
      btn.setAttribute('aria-label', 'Toggle navigation');
      btn.innerHTML = '<span class="burger">☰</span>';
      header.insertBefore(btn, header.firstChild);

      btn.addEventListener('click', function() {
        document.body.classList.toggle('nav-open');
      });
    }
  }

  // Countries search & sort
  function setupCountrySearch() {
    // avoid double-init
    if (window.__countrySearchSetupDone) return;
    const searchInput = document.getElementById('country-search') || document.getElementById('search');
    const sortSelect = document.getElementById('sort-select');
    const grid = document.getElementById('countries-grid') || document.getElementById('countries-list');
    if (!grid || !searchInput) return;

    function filter() {
      const q = (searchInput.value || '').trim().toLowerCase();
      const qNorm = q.normalize ? q.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') : q;
      const cards = Array.from(grid.children);
      let matchCount = 0;
      cards.forEach(card => {
        // Support both card grid and generic list views
        const nameEl = card.querySelector('.country-name');
        const rawName = (nameEl && nameEl.textContent) ? nameEl.textContent : (card.textContent || '');
        const name = rawName.normalize ? rawName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : rawName.toLowerCase();
        const tokens = qNorm.split(/\s+/).filter(Boolean);
        function tokenMatch(t) {
          if (!t) return true;
          if (name.startsWith(t) || name.includes(t)) return true;
          const nameWords = name.split(/\s+/);
          for (let w of nameWords) {
            if (fuzzyEq(w, t)) return true;
          }
          return false;
        }
        const match = tokens.length === 0 ? true : tokens.every(tokenMatch);
        card.style.display = match ? '' : 'none';
        if (match) matchCount++;
      });

      // Show a no-results message when no matches
      let noEl = document.getElementById('no-results');
      if (!noEl) {
        noEl = document.createElement('div');
        noEl.id = 'no-results';
        noEl.style.padding = '16px';
        noEl.style.textAlign = 'center';
        noEl.style.color = 'var(--muted, #777)';
        const fallback = 'No results';
        const txt = (window.__langRoot && getNested(window.__langRoot, 'countries.search.noResults')) || fallback;
        noEl.textContent = txt;
        grid.parentNode.appendChild(noEl);
      }
      noEl.style.display = matchCount === 0 ? '' : 'none';
    }

    function fuzzyEq(a, b) {
      if (!a || !b) return false;
      if (Math.abs(a.length - b.length) > 2) return false;
      const limit = Math.max(1, Math.floor(b.length / 4));
      return levenshtein(a, b) <= limit;
    }

    function levenshtein(a, b) {
      if (a === b) return 0;
      const al = a.length; const bl = b.length;
      if (al === 0) return bl; if (bl === 0) return al;
      const v0 = new Array(bl + 1); const v1 = new Array(bl + 1);
      for (let i = 0; i <= bl; i++) v0[i] = i;
      for (let i = 0; i < al; i++) {
        v1[0] = i + 1;
        for (let j = 0; j < bl; j++) {
          const cost = a[i] === b[j] ? 0 : 1;
          v1[j+1] = Math.min(v1[j] + 1, v0[j+1] + 1, v0[j] + cost);
        }
        for (let k = 0; k <= bl; k++) v0[k] = v1[k];
      }
      return v1[bl];
    }

    function sortGrid(dir) {
      const allCards = Array.from(grid.children);
      const cards = allCards.filter(c => c.style.display !== 'none');
      cards.sort((a, b) => {
        const an = a.querySelector('.country-name')?.textContent || '';
        const bn = b.querySelector('.country-name')?.textContent || '';
        return dir === 'za' ? bn.localeCompare(an) : an.localeCompare(bn);
      });
      cards.forEach(c => grid.appendChild(c));
    }

    searchInput.addEventListener('input', function() {
      filter();
    });

    // Search button (magnifier) triggers the same filter
    const searchBtn = document.getElementById('country-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        filter();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
      // Re-filter then sort so visible set is ordered
      filter();
      sortGrid(this.value);
      });
    }

    // Apply initial sort to grid according to currently selected option
    try { if (sortSelect) sortGrid(sortSelect.value); } catch(e){}

    // Expose functions for debugging
    window.__countrySearch = { filter, sortGrid, run: filter };
    window.__countrySearchSetupDone = true;
  }

  // Run setup when cards are present
  function trySetup(attempts) {
    attempts = attempts || 0;
    const grid = document.getElementById('countries-grid');
    if (grid && grid.children.length > 0) {
      setupCountrySearch();
      return;
    }
    if (attempts < 80) {
      setTimeout(function() { trySetup(attempts + 1); }, 50);
    }
  }

  // Start trying immediately (DOMContentLoaded already fired since we're inside it)
  trySetup();

  // Also on window load (all scripts done)
  window.addEventListener('load', function() { trySetup(); });

  // Also listen for the custom event from map.js / inline scripts
  document.addEventListener('countryCardsRendered', function() {
    window.__countrySearchSetupDone = false; // allow re-init
    setTimeout(function() { trySetup(); }, 20);
  });
});