/* ==========================================================================
   Bloom & Batter Cake Studio — Main JS
   Vanilla JS only. Every function guards for element existence so this
   single file can be safely included on every page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     1. THEME (Dark / Light) — persisted in localStorage
  --------------------------------------------------------------------- */
  const THEME_KEY = 'bb-theme';
  const html = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    document.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
      icon.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const next = html.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  });

  /* ---------------------------------------------------------------------
     2. DIRECTION (RTL / LTR) — persisted in localStorage
  --------------------------------------------------------------------- */
  const DIR_KEY = 'bb-dir';

  function applyDir(dir) {
    html.setAttribute('dir', dir);
    document.querySelectorAll('[data-dir-label]').forEach(function (el) {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  applyDir(localStorage.getItem(DIR_KEY) || 'ltr');

  document.querySelectorAll('[data-dir-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const next = html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem(DIR_KEY, next);
      applyDir(next);
    });
  });

  /* ---------------------------------------------------------------------
     3. HEADER — stays fixed and visible at all times (see #site-header in
     style.css for the permanent glass background). This only adds a
     deeper shadow once the page has scrolled, for depth.
  --------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     4. MOBILE DRAWER MENU
     Only the hamburger button (#drawer-open), the close button, the
     backdrop, or Escape can open/close this — nothing else touches it.
  --------------------------------------------------------------------- */
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const openBtn = document.getElementById('drawer-open');
  const closeBtn = document.getElementById('drawer-close');
  const DESKTOP_BREAKPOINT = 1280; // matches Tailwind's `xl` — desktop nav takes over above this
  // (raised from `lg`/1024: with 7 nav links + icons + CTA, 1024px doesn't
  // reliably fit everything on one line without crowding/overlap — 1280px does)

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // If the viewport is resized (or rotated) into desktop width while the
  // drawer happens to be open, close it so it never lingers over the
  // desktop nav.
  if (drawer) {
    window.addEventListener('resize', function () {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) closeDrawer();
    });
  }

  /* ---------------------------------------------------------------------
     5. ACTIVE NAV STATE
  --------------------------------------------------------------------- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('text-raspberry-600', 'dark:text-caramel-400');
      link.classList.remove('text-choco-700', 'dark:text-cream-200');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------------------------------------------------------------------
     5b. NAV DROPDOWN — data-dropdown / data-dropdown-trigger / data-dropdown-panel
     Used by the header's "Home" item, which reveals Home Page 1 / Home
     Page 2. Click-to-toggle (works for touch and keyboard, not just
     hover), closes on outside click or Escape, and highlights the
     trigger itself when one of its own links is the active page.
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-dropdown]').forEach(function (dropdown) {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const panel = dropdown.querySelector('[data-dropdown-panel]');
    const caret = dropdown.querySelector('[data-dropdown-caret]');
    if (!trigger || !panel) return;

    function open() {
      panel.classList.remove('hidden');
      trigger.setAttribute('aria-expanded', 'true');
      if (caret) caret.classList.add('rotate-180');
    }
    function close() {
      panel.classList.add('hidden');
      trigger.setAttribute('aria-expanded', 'false');
      if (caret) caret.classList.remove('rotate-180');
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    if (dropdown.querySelector('[data-nav-link][aria-current="page"]')) {
      trigger.classList.add('text-raspberry-600', 'dark:text-caramel-400');
      trigger.classList.remove('text-choco-700', 'dark:text-cream-100');
    }
  });

  /* ---------------------------------------------------------------------
     6. BACK TO TOP
  --------------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     7. IMAGE FALLBACK — swap broken images for a graceful gradient block.
     A fast-failing request (e.g. a 404) can resolve before this deferred
     script attaches its listener, so the `error` event fires and is missed —
     the image would be stuck as a native broken-image icon. Checking
     `complete && naturalWidth === 0` on load catches that case too.
  --------------------------------------------------------------------- */
  function applyImageFallback(img) {
    img.classList.add('img-fallback-active');
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="%23FCE4EC"/></svg>'
    );
    img.alt = img.alt + ' (image unavailable)';
  }
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      applyImageFallback(img);
    } else {
      img.addEventListener('error', function () { applyImageFallback(img); }, { once: true });
    }
  });

  /* ---------------------------------------------------------------------
     8. FAQ ACCORDION
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      item.closest('[data-faq-group]') && item.closest('[data-faq-group]').querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-panel').style.maxHeight = null;
          openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------------------
     9. FILTER TABS (Menu / Gallery) — data-filter-group / data-filter-item

     Also auto-selects the matching tab from the URL hash, so a "Shop by
     Category" link (from the Home page's occasion cards, or the in-page
     category cards on menu.html) both scrolls to AND filters down to that
     category — not just scrolls with every product still showing. Runs
     once on load (covers arriving from another page with a hash already
     in the URL) and again on every `hashchange` (covers clicking a
     same-page anchor, which doesn't reload the page).
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    const buttons = group.querySelectorAll('[data-filter]');
    const targetSelector = group.getAttribute('data-filter-group');
    const items = document.querySelectorAll(targetSelector + ' [data-filter-item]');

    function activate(filter) {
      buttons.forEach(function (b) {
        const isMatch = b.getAttribute('data-filter') === filter;
        b.classList.toggle('bg-raspberry-600', isMatch);
        b.classList.toggle('hover:bg-raspberry-700', isMatch);
        b.classList.toggle('text-white', isMatch);
        b.classList.toggle('bg-white', !isMatch);
        b.classList.toggle('dark:bg-choco-800', !isMatch);
        b.classList.toggle('text-choco-700', !isMatch);
        b.classList.toggle('dark:text-cream-200', !isMatch);
        // The inactive-state hover classes below (hover:bg-raspberry-50 /
        // dark:hover:bg-choco-700) must be removed entirely on the active
        // tab, not just out-prioritized — a `:hover` pseudo-class selector
        // has higher CSS specificity than a plain utility class, so if left
        // in place it repaints the active tab back to the lighter inactive
        // color on hover (desktop) or on tap (mobile/tablet, where touch
        // browsers apply :hover after tap and it sticks), making the
        // active tab look unselected.
        b.classList.toggle('hover:bg-raspberry-50', !isMatch);
        b.classList.toggle('dark:hover:bg-choco-700', !isMatch);
        b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
      items.forEach(function (item) {
        const cats = (item.getAttribute('data-categories') || '').split(',');
        const shouldShow = filter === 'all' || cats.indexOf(filter) !== -1;
        if (shouldShow) {
          // AOS only reveals data-aos elements once its own scroll-position
          // check adds .aos-animate — it never fires just because we
          // un-hide something, so a card that hadn't scrolled into view
          // yet stays stuck at opacity:0 (AOS's own CSS) forever, looking
          // like it "didn't load". A CSS animation (`.filter-fade-in`)
          // overrides that cascaded opacity:0 for its duration and holds
          // the end state via fill-mode, independent of AOS entirely —
          // so the card is guaranteed visible the instant a filter
          // reveals it. AOS.refresh() below keeps AOS's own position
          // cache in sync for later scroll-based animations elsewhere.
          item.classList.remove('hidden');
          item.classList.remove('filter-fade-in');
          void item.offsetWidth; // force reflow so the fade-in can replay every time
          item.classList.add('filter-fade-in');
        } else {
          item.classList.add('hidden');
        }
      });
      if (window.AOS) window.AOS.refresh();
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activate(btn.getAttribute('data-filter'));
      });
    });

    function syncFromHash() {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const match = group.querySelector('[data-filter="' + hash + '"]');
      if (!match) return;
      activate(hash);
      // Re-scroll after filtering: hiding the other cards reflows the grid,
      // so the browser's automatic (pre-filter) anchor scroll can end up
      // slightly off target.
      requestAnimationFrame(function () {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ block: 'start' });
      });
    }

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
  });

  /* ---------------------------------------------------------------------
     10. COUNTERS (CountUp.js if available, otherwise simple fallback)
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const runCounter = function (el) {
      const end = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      if (window.CountUp) {
        const cu = new window.CountUp.CountUp(el, end, { duration: 2.4, separator: ',' });
        if (!cu.error) cu.start();
      } else {
        let start = 0;
        const step = Math.max(1, Math.round(end / 60));
        const timer = setInterval(function () {
          start += step;
          if (start >= end) { start = end; clearInterval(timer); }
          el.textContent = start.toLocaleString();
        }, 30);
      }
    };
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------------------------------------------------------------
     11. AOS INIT (scroll reveal) — respects reduced motion
  --------------------------------------------------------------------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      once: true,
      offset: 60,
      disable: prefersReduced
    });
  }

  /* ---------------------------------------------------------------------
     12. TESTIMONIAL SWIPER (home page)
  --------------------------------------------------------------------- */
  const testimonialEl = document.querySelector('.testimonial-swiper');
  if (testimonialEl && window.Swiper) {
    new window.Swiper('.testimonial-swiper', {
      loop: true,
      autoplay: { delay: 5500, disableOnInteraction: false },
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: {
        768: { slidesPerView: 2 },
        1280: { slidesPerView: 3 }
      },
      pagination: { el: '.testimonial-pagination', clickable: true },
      a11y: { enabled: true }
    });
  }

  /* ---------------------------------------------------------------------
     12b. BESTSELLER SWIPER (Home Page 1 — featured cakes carousel)
  --------------------------------------------------------------------- */
  const bestsellerEl = document.querySelector('.bestseller-swiper');
  if (bestsellerEl && window.Swiper) {
    new window.Swiper('.bestseller-swiper', {
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      spaceBetween: 24,
      slidesPerView: 1.15,
      breakpoints: {
        640: { slidesPerView: 2.1 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 }
      },
      pagination: { el: '.bestseller-pagination', clickable: true },
      a11y: { enabled: true }
    });
  }

  /* ---------------------------------------------------------------------
     13. GLIGHTBOX INIT (gallery)
  --------------------------------------------------------------------- */
  if (window.GLightbox) {
    window.GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  }

  /* ---------------------------------------------------------------------
     14. GENERIC FORM VALIDATION
     Applies to any <form data-validate> — checks required fields,
     email format, phone format, min/max length, date-not-in-past.
  --------------------------------------------------------------------- */
  function showError(field, message) {
    clearError(field);
    field.classList.add('border-red-500', 'ring-1', 'ring-red-500');
    field.setAttribute('aria-invalid', 'true');
    const err = document.createElement('p');
    err.className = 'field-error text-sm text-red-600 dark:text-red-400 mt-1';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    field.insertAdjacentElement('afterend', err);
  }
  function clearError(field) {
    field.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    field.removeAttribute('aria-invalid');
    const next = field.nextElementSibling;
    if (next && next.classList.contains('field-error')) next.remove();
  }
  function validateField(field) {
    clearError(field);
    const value = field.value.trim();
    const label = field.getAttribute('data-label') || field.name || 'This field';

    if (field.hasAttribute('required') && !value) {
      showError(field, label + ' is required.');
      return false;
    }
    if (!value) return true; // optional & empty

    if (field.type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) { showError(field, 'Please enter a valid email address.'); return false; }
    }
    if (field.type === 'tel') {
      const re = /^[0-9+\-\s()]{7,16}$/;
      if (!re.test(value)) { showError(field, 'Please enter a valid phone number.'); return false; }
    }
    if (field.type === 'date') {
      const chosen = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) { showError(field, 'Pickup date cannot be in the past.'); return false; }
    }
    const min = field.getAttribute('minlength');
    if (min && value.length < parseInt(min, 10)) {
      showError(field, label + ' must be at least ' + min + ' characters.');
      return false;
    }
    const max = field.getAttribute('maxlength');
    if (max && value.length > parseInt(max, 10)) {
      showError(field, label + ' must be under ' + max + ' characters.');
      return false;
    }
    return true;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      const successBox = form.parentElement.querySelector('[data-form-success]');
      const errorSummary = form.querySelector('[data-form-error-summary]');

      if (valid) {
        form.reset();
        form.classList.add('hidden');
        if (successBox) {
          successBox.classList.remove('hidden');
          successBox.setAttribute('tabindex', '-1');
          successBox.focus();
        }
        if (errorSummary) errorSummary.classList.add('hidden');
      } else {
        if (errorSummary) {
          errorSummary.classList.remove('hidden');
          errorSummary.focus();
        }
        const firstInvalid = form.querySelector('.border-red-500');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });

  /* ---------------------------------------------------------------------
     15. DATE INPUT — set min to today (pickup date fields)
  --------------------------------------------------------------------- */
  document.querySelectorAll('input[type="date"][data-min-today]').forEach(function (input) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    input.setAttribute('min', yyyy + '-' + mm + '-' + dd);
  });

  /* ---------------------------------------------------------------------
     15b. PRE-SELECT OCCASION from ?occasion= query param
     Lets an "Order Now" link from a specific category card (e.g. Menu's
     "Anniversary Cakes" card → order.html?occasion=Anniversary) land on
     the enquiry form with that occasion already chosen, instead of
     making the visitor pick it again.
  --------------------------------------------------------------------- */
  (function () {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('occasion');
    if (!wanted) return;
    const match = Array.from(occasionSelect.options).find(function (opt) {
      return opt.value.toLowerCase() === wanted.toLowerCase();
    });
    if (match) occasionSelect.value = match.value;
  })();

  /* ---------------------------------------------------------------------
     16. CHARACTER COUNTER for textareas with data-char-count
  --------------------------------------------------------------------- */
  document.querySelectorAll('textarea[data-char-count]').forEach(function (ta) {
    const counter = document.querySelector(ta.getAttribute('data-char-count'));
    const max = ta.getAttribute('maxlength');
    if (!counter) return;
    const update = function () {
      counter.textContent = ta.value.length + ' / ' + max;
    };
    ta.addEventListener('input', update);
    update();
  });

  /* ---------------------------------------------------------------------
     17. NEWSLETTER MINI-FORM (footer) — lightweight inline validation
  --------------------------------------------------------------------- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.querySelector('[data-newsletter-msg]');
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input && re.test(input.value.trim())) {
        if (msg) { msg.textContent = 'Thank you! Watch your inbox for sweet updates.'; msg.classList.remove('hidden', 'text-red-500'); msg.classList.add('text-green-600'); }
        form.reset();
      } else {
        if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.classList.remove('hidden', 'text-green-600'); msg.classList.add('text-red-500'); }
      }
    });
  });

  /* ---------------------------------------------------------------------
     18. TESTIMONIAL SPOTLIGHT SWITCHER — data-testimonial-widget
     A single large quote with clickable avatar tabs (Home Page 1's
     testimonials section) — lighter-weight alternative to the Swiper
     carousel used on the main Home page.
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-testimonial-widget]').forEach(function (widget) {
    const panels = widget.querySelectorAll('[data-testimonial-panel]');
    const triggers = widget.querySelectorAll('[data-testimonial-trigger]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const index = trigger.getAttribute('data-testimonial-trigger');
        panels.forEach(function (panel) {
          panel.classList.toggle('hidden', panel.getAttribute('data-testimonial-panel') !== index);
        });
        triggers.forEach(function (t) {
          const isActive = t === trigger;
          t.classList.toggle('ring-2', isActive);
          t.classList.toggle('ring-raspberry-500', isActive);
          t.classList.toggle('dark:ring-caramel-400', isActive);
          t.classList.toggle('opacity-60', !isActive);
          t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      });
    });
  });

});
