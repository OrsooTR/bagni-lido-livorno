/* =========================================================
   BAGNI LIDO LIVORNO — Interazioni
   ========================================================= */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Lingua ---------- */
  const dict = window.I18N || { it: {}, en: {} };
  function applyLang(lang) {
    const t = dict[lang] || dict.it;
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (t[k] != null) el.innerHTML = t[k];
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (t[k] != null) el.setAttribute('placeholder', t[k]);
    });
    $$('[data-setlang]').forEach(b => {
      const on = b.dataset.setlang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem('lido_lang', lang); } catch (e) {}
    if (typeof window.renderEvents === 'function') window.renderEvents();
  }
  function initLang() {
    let lang = 'it';
    const url = new URLSearchParams(location.search).get('lang');
    try { lang = url || localStorage.getItem('lido_lang') || (navigator.language || 'it').slice(0, 2); } catch (e) {}
    if (!dict[lang]) lang = 'it';
    applyLang(lang);
  }
  $$('[data-setlang]').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.setlang)));
  // i18n.js è caricato con defer prima di questo file, ma per sicurezza:
  if (window.I18N) initLang(); else window.addEventListener('DOMContentLoaded', initLang);

  /* ---------- 2. Header scroll state ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. Menu mobile ---------- */
  const toggle = $('#navToggle'), nav = $('#mainNav');
  function closeNav() {
    nav.classList.remove('open'); document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Apri menu');
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  });
  $$('#mainNav a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* ---------- 4. Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal], [data-reveal-group]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- 5. Contatori animati ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1400; const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const nums = $$('.num');
  if (nums.length) {
    const io2 = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(n => io2.observe(n));
  }

  /* ---------- 6. Nav active section ---------- */
  const sections = ['lido', 'servizi', 'ristorante', 'eventi', 'contatti']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('#mainNav a');
  if ('IntersectionObserver' in window) {
    const io3 = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io3.observe(s));
  }

  /* ---------- 7. Eventi: render + filtro + dati strutturati ---------- */
  const MONTH_KEY = { '07': 'month.jul', '08': 'month.aug', '09': 'month.sep' };
  const CAT_KEY   = { cinema: 'events.f.cinema', music: 'events.f.music', dj: 'events.f.dj', family: 'events.f.family' };
  const grid = $('#eventsGrid'), emptyMsg = $('#eventsEmpty');
  let currentFilter = 'all';

  function tt(key) { const l = document.body.dataset.lang || 'it'; return (dict[l] && dict[l][key]) || key; }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderEvents() {
    if (!grid || !Array.isArray(window.LIDO_EVENTS)) return;
    const lang = document.body.dataset.lang || 'it';
    grid.innerHTML = window.LIDO_EVENTS.map(ev => {
      const tx = ev[lang] || ev.it;
      const dd = String(ev.day).padStart(2, '0');
      const time = ev.time ? `<span class="event-time">🕒 ${esc(ev.time)}</span>` : '';
      return `<article class="event-card" data-cat="${ev.cat}">
        <div class="event-date"><span class="d">${dd}</span><span class="m">${tt(MONTH_KEY[ev.month] || 'month.jul')}</span></div>
        <div class="event-body">
          <span class="event-cat">${tt(CAT_KEY[ev.cat] || '')}</span>
          <h3>${esc(tx.t)}</h3>
          <p>${esc(tx.d)}</p>${time}
        </div>
      </article>`;
    }).join('');
    applyFilter(currentFilter);
  }
  window.renderEvents = renderEvents;

  function applyFilter(f) {
    currentFilter = f;
    const cards = $$('.event-card', grid);
    let visible = 0;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hide', !show);
      if (show) visible++;
    });
    if (emptyMsg) emptyMsg.hidden = visible !== 0;
  }

  $$('.event-filters .chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.event-filters .chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('is-active'); chip.setAttribute('aria-selected', 'true');
    applyFilter(chip.dataset.filter);
  }));

  // Dati strutturati Event (SEO / Google rich results)
  function injectEventsLD() {
    if (!Array.isArray(window.LIDO_EVENTS)) return;
    const year = window.LIDO_YEAR || new Date().getFullYear();
    const items = window.LIDO_EVENTS.map(ev => ({
      '@type': 'Event',
      'name': ev.it.t,
      'description': ev.it.d,
      'startDate': `${year}-${ev.month}-${String(ev.day).padStart(2, '0')}` + (ev.time ? `T${ev.time}:00+02:00` : ''),
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place', 'name': 'Bagni Lido Livorno',
        'address': { '@type': 'PostalAddress', 'streetAddress': 'Viale Italia 126', 'addressLocality': 'Livorno', 'postalCode': '57128', 'addressCountry': 'IT' }
      },
      'organizer': { '@type': 'Organization', 'name': 'Bagni Lido Livorno', 'url': 'https://bagnilidolivorno.com/' }
    }));
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': items });
    document.head.appendChild(s);
  }

  renderEvents();
  injectEventsLD();

  /* ---------- 8. Form (backend PHP + fallback mailto) ---------- */
  function t(key) { const l = document.body.dataset.lang || 'it'; return (dict[l] && dict[l][key]) || key; }
  const ENDPOINT = 'contact.php';
  const MAILTO = 'info@bagnilidolivorno.com';

  // Invia al backend. Ritorna {ok, message, noBackend}.
  // noBackend=true se PHP non è disponibile (es. hosting statico come GitHub Pages).
  async function postForm(payload) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const ct = res.headers.get('content-type') || '';
      if (res.status === 404 || res.status === 405 || !ct.includes('json')) return { ok: false, noBackend: true };
      const json = await res.json().catch(() => ({}));
      return { ok: res.ok && json.ok !== false, message: json.message };
    } catch (e) {
      return { ok: false, noBackend: true };
    }
  }

  function openMailto(subject, body) {
    window.location.href = `mailto:${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const cForm = $('#contactForm'), cMsg = $('#formMsg');
  if (cForm) cForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!cForm.checkValidity()) {
      cMsg.textContent = t('form.required'); cMsg.className = 'form-msg err';
      cForm.reportValidity(); return;
    }
    const btn = $('button[type="submit"]', cForm);
    const orig = btn.textContent; btn.disabled = true; btn.textContent = t('form.sending');
    cMsg.textContent = ''; cMsg.className = 'form-msg';
    const fd = new FormData(cForm);
    const payload = {
      action: 'contact',
      name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
      topic: fd.get('topic'), message: fd.get('message'), website: fd.get('website') || ''
    };
    const r = await postForm(payload);
    if (r.ok) {
      cMsg.textContent = t('form.ok'); cMsg.className = 'form-msg ok'; cForm.reset();
    } else if (r.noBackend) {
      // Hosting statico: ripieghiamo sul client email dell'utente.
      cMsg.textContent = t('form.mailto'); cMsg.className = 'form-msg ok';
      openMailto(`[Sito] ${payload.topic} — ${payload.name}`,
        `Nome: ${payload.name}\nEmail: ${payload.email}\nTelefono: ${payload.phone}\nMotivo: ${payload.topic}\n\n${payload.message}`);
    } else {
      cMsg.textContent = r.message || t('form.error'); cMsg.className = 'form-msg err';
    }
    btn.disabled = false; btn.textContent = orig;
  });

  const nForm = $('#newsForm');
  if (nForm) nForm.addEventListener('submit', async e => {
    e.preventDefault();
    const input = nForm.querySelector('input[type="email"]');
    const btn = $('button', nForm);
    if (!nForm.checkValidity()) { nForm.reportValidity(); return; }
    const orig = btn.textContent; btn.disabled = true; btn.textContent = t('form.sending');
    const r = await postForm({ action: 'newsletter', email: input.value, website: nForm.querySelector('input[name="website"]')?.value || '' });
    if (r.ok) { btn.textContent = t('news.done'); input.value = ''; }
    else if (r.noBackend) { btn.textContent = t('news.done'); openMailto('Iscrizione newsletter', `Iscrivetemi: ${input.value}`); input.value = ''; }
    else { btn.disabled = false; btn.textContent = orig; alert(r.message || t('form.error')); }
  });

  /* ---------- 9. Meteo live (Open-Meteo, senza API key) ---------- */
  (function weather() {
    const tempEl = $('#liveTemp'), waterEl = $('#liveWater');
    if (!tempEl) return;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=43.55&longitude=10.31&current=temperature_2m';
    fetch(url).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      const air = Math.round(d.current.temperature_2m);
      tempEl.textContent = air + ' °C';
      // Stima acqua: tipicamente qualche grado sotto l'aria in stagione.
      if (waterEl) waterEl.textContent = Math.max(0, air - 3) + ' °C';
    }).catch(() => {
      tempEl.textContent = '—'; if (waterEl) waterEl.textContent = '—';
    });
  })();

  /* ---------- 10. Anno footer ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
