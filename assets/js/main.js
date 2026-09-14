/* ==========================================================================
   CHEF SARDOR — Portfolio · main.js
   Tema, navigatsiya, filtrlar, lightbox, animatsiyalar, forma
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1. TEMA (kun / tun)
  ---------------------------------------------------------------------- */
  const root   = document.documentElement;
  const toggle = $('#themeToggle');
  const META   = $('meta[name="theme-color"]');

  function applyTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-checked', String(theme === 'dark'));
    if (META) META.setAttribute('content', theme === 'dark' ? '#241b15' : '#ece2d6');
    if (save) {
      try { localStorage.setItem('chef-theme', theme); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute('data-theme') || 'light', false);

  function flipTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    toast(next === 'dark' ? 'Tun rejimi yoqildi' : 'Kun rejimi yoqildi');
  }
  toggle && toggle.addEventListener('click', flipTheme);
  $('#themeToggleBottom') && $('#themeToggleBottom').addEventListener('click', flipTheme);

  /* Tizim temasi o'zgarsa va foydalanuvchi tanlovi bo'lmasa — kuzatamiz */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('chef-theme'); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
  });

  /* ----------------------------------------------------------------------
     2. HEADER / NAVIGATSIYA
  ---------------------------------------------------------------------- */
  const header = $('#header');
  const burger = $('#burger');
  const nav    = $('#nav');

  const onScrollHeader = () => header && header.classList.toggle('is-stuck', window.scrollY > 20);
  onScrollHeader();

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    burger && burger.classList.remove('is-open');
    burger && burger.setAttribute('aria-expanded', 'false');
  }

  burger && burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  $$('.nav a').forEach((a) => a.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      closeLightbox();
    }
  });

  /* Havolalar almashganda fokusni kontentga o'tkazish (a11y) */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (id === '#bosh' ? 0 : 78);
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.pushState(null, '', id);
    });
  });

  /* ----------------------------------------------------------------------
     3. SCROLL: progress, faol bo'lim, yuqoriga tugmasi
  ---------------------------------------------------------------------- */
  const progress = $('#scrollProgress');
  const toTop    = $('#toTop');
  const sections = $$('main section[id]');

  let ticking = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 640);

    let current = '';
    for (const sec of sections) {
      if (sec.offsetTop - 120 <= window.scrollY) current = sec.id;
    }
    $$('.nav__link').forEach((l) => {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(() => { onScroll(); onScrollHeader(); });
    }
  }, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     4. SCROLL REVEAL
  ---------------------------------------------------------------------- */
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------------------
     5. RAQAMLI HISOBLAGICH (stats) va KO'NIKMA CHIZIQLARI
  ---------------------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || '0');
    const dur = 1500;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('uz-UZ');
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString('uz-UZ');
    }
    reduceMotion ? (el.textContent = target) : requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        animateCount(en.target);
        countIO.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    $$('.count').forEach((el) => countIO.observe(el));

    const skillIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const fill = en.target;
        fill.style.width = (fill.dataset.value || 0) + '%';
        skillIO.unobserve(fill);
      });
    }, { threshold: 0.5 });
    $$('.skill__fill').forEach((el) => skillIO.observe(el));
  } else {
    $$('.count').forEach((el) => (el.textContent = el.dataset.count));
    $$('.skill__fill').forEach((el) => (el.style.width = el.dataset.value + '%'));
  }

  /* ----------------------------------------------------------------------
     6. TAOMLAR FILTRI
  ---------------------------------------------------------------------- */
  const dishes = $$('.dish');
  $$('.filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      $$('.filter').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      dishes.forEach((dish) => {
        const show = cat === 'all' || dish.dataset.cat === cat;
        if (show) {
          dish.classList.remove('is-hidden');
          dish.classList.add('is-filtering');
          requestAnimationFrame(() => requestAnimationFrame(() => dish.classList.remove('is-filtering')));
        } else {
          dish.classList.add('is-hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------------------
     7. LIGHTBOX
  ---------------------------------------------------------------------- */
  const lightbox = $('#lightbox');
  const lbImg    = $('#lbImg');
  const lbCap    = $('#lbCap');
  const visible  = () => dishes.filter((d) => !d.classList.contains('is-hidden'));
  let lbIndex = 0;
  let lastFocused = null;

  function openLightbox(index) {
    const list = visible();
    if (!list.length) return;
    lbIndex = (index + list.length) % list.length;
    const item = list[lbIndex];
    const img  = $('img', item);
    lastFocused = document.activeElement;

    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lastFocused && lastFocused.focus && lastFocused.focus();
  }

  function step(dir) {
    const list = visible();
    if (!list.length) return;
    lbIndex = (lbIndex + dir + list.length) % list.length;
    const img = $('img', list[lbIndex]);
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      lbImg.style.opacity = '1';
    }, 130);
  }

  dishes.forEach((dish) => {
    const media = $('.dish__media', dish);
    media && media.addEventListener('click', () => {
      openLightbox(visible().indexOf(dish));
    });
  });

  $('#lbClose') && $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev')  && $('#lbPrev').addEventListener('click', () => step(-1));
  $('#lbNext')  && $('#lbNext').addEventListener('click', () => step(1));
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ----------------------------------------------------------------------
     8. TOAST
  ---------------------------------------------------------------------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3600);
  }

  /* ----------------------------------------------------------------------
     9. ALOQA FORMASI (validatsiya + yuborish)
  ---------------------------------------------------------------------- */
  const form = $('#contactForm');
  if (form) {
    const validateField = (el) => {
      const wrap = el.closest('.field') || el.closest('.agree');
      let ok = el.checkValidity();
      if (el.name === 'message') ok = ok && el.value.trim().length >= 10;
      if (el.name === 'name')    ok = ok && el.value.trim().length >= 2;
      if (wrap && wrap.classList.contains('field')) wrap.classList.toggle('is-invalid', !ok);
      return ok;
    };

    $$('input, textarea, select', form).forEach((el) => {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        const wrap = el.closest('.field');
        if (wrap && wrap.classList.contains('is-invalid')) validateField(el);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = $$('input, textarea', form).filter((el) => el.hasAttribute('required'));
      const allOk  = fields.map(validateField).every(Boolean);

      if (!allOk) {
        const firstBad = $('.field.is-invalid input, .field.is-invalid textarea', form);
        firstBad && firstBad.focus();
        toast('Iltimos, maydonlarni to\'ldiring');
        return;
      }

      const btn = $('button[type="submit"]', form);
      const label = $('span', btn).textContent;
      btn.disabled = true;
      $('span', btn).textContent = 'Yuborilmoqda...';

      /* Demo: backend yo'q — 900ms dan keyin muvaffaqiyat ko'rsatiladi.
         Haqiqiy loyihada: fetch('/api/contact', { method:'POST', body: new FormData(form) }) */
      setTimeout(() => {
        btn.disabled = false;
        $('span', btn).textContent = label;
        const name = (form.elements['name'].value || '').trim().split(' ')[0];
        toast(`Rahmat, ${name}! Xabaringiz yuborildi.`);
        form.reset();
        $$('.field', form).forEach((f) => f.classList.remove('is-invalid'));
      }, 900);
    });
  }

  /* Mini obuna formasi */
  const mini = $('#miniForm');
  mini && mini.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', mini);
    if (!input.value.includes('@')) { toast('Email manzilni to\'g\'ri kiriting'); input.focus(); return; }
    toast('Obuna bo\'ldingiz. Rahmat!');
    mini.reset();
  });

  /* ----------------------------------------------------------------------
     10. YIL
  ---------------------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------------
     11. Klaviatura bilan navigatsiya uchun kichik yaxshilanishlar
  ---------------------------------------------------------------------- */
  $$('.dish__media').forEach((m) => {
    m.setAttribute('tabindex', '0');
    m.setAttribute('role', 'button');
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const dish = m.closest('.dish');
        openLightbox(visible().indexOf(dish));
      }
    });
  });

})();
