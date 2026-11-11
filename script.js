/* WCosta Tattoo · Divinópolis */

/* ================= CONFIGURAÇÃO =================
   Troque aqui o número do WhatsApp (só dígitos, com 55 + DDD).
   PLACEHOLDER: confirmar com o Wellington. */
const CONFIG = {
  whatsapp: '5537900000000',
  whatsappMsg: 'Oi, Wellington! Vi seu site e queria um orçamento de tattoo.',
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- links e dados ---------- */
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
  $$('[data-whatsapp]').forEach((a) => (a.href = wa));
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  const today = new Date().getDay();
  const row = $(`.hours tr[data-day="${today === 1 ? 0 : today}"]`);
  if (row) row.classList.add('is-today');

  /* raios em traço fino */
  const rays = $('.hero__rays .rays');
  if (rays) {
    const ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const long = i % 4 === 0 ? 190 : i % 2 ? 128 : 156;
      const l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', 200 + Math.cos(a) * 84);
      l.setAttribute('y1', 200 + Math.sin(a) * 84);
      l.setAttribute('x2', 200 + Math.cos(a) * long);
      l.setAttribute('y2', 200 + Math.sin(a) * long);
      rays.appendChild(l);
    }
  }

  /* ---------- menu mobile ---------- */
  let lenis = null;
  const burger = $('.nav__burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));

  /* ---------- âncoras ---------- */
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    })
  );

  /* ---------- portfólio: numeração, filtros ---------- */
  const cards = $$('.card:not(.card--cta)');
  const countEl = $('.catalog__count b');
  const totalEl = $('.catalog__count span');
  const visibleCards = () => cards.filter((c) => !c.classList.contains('is-hidden'));
  const renumber = () => {
    const v = visibleCards();
    v.forEach((c, i) => ($('.card__n', c).textContent = String(i + 1).padStart(2, '0')));
    totalEl.textContent = String(v.length).padStart(2, '0');
  };
  renumber();

  let current = 'all';
  $$('.filter').forEach((btn) =>
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      if (f === current) return;
      current = f;
      $$('.filter').forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn); });
      const apply = () => {
        cards.forEach((c) => c.classList.toggle('is-hidden', !(f === 'all' || c.dataset.cat === f)));
        renumber();
        $('.catalog__cards').scrollLeft = 0;
        if (window.gsap && !reduce) {
          gsap.fromTo(visibleCards(), { autoAlpha: 0, y: 40, rotate: 3 }, { autoAlpha: 1, y: 0, rotate: 0, duration: .9, ease: 'expo.out', stagger: .05, clearProps: 'transform,opacity,visibility' });
          ScrollTrigger.refresh();
        }
      };
      if (window.gsap && !reduce) gsap.to(visibleCards(), { autoAlpha: 0, y: -16, duration: .25, ease: 'power2.in', onComplete: apply });
      else apply();
    })
  );

  /* contador no celular (rolagem nativa) */
  const cardsBox = $('.catalog__cards');
  const barEl = $('.catalog__bar i');
  const nativeCount = () => {
    if (innerWidth >= 960 && window.gsap && !reduce) return;
    const max = cardsBox.scrollWidth - cardsBox.clientWidth;
    const p = max > 0 ? cardsBox.scrollLeft / max : 0;
    const n = visibleCards().length;
    countEl.textContent = String(Math.max(1, Math.min(n, Math.round(p * (n - 1)) + 1))).padStart(2, '0');
    barEl.style.transform = `scaleX(${Math.max(.08, p)})`;
  };
  cardsBox.addEventListener('scroll', nativeCount, { passive: true });

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  const fig = $('.lb__fig', lb);
  const cap = $('figcaption', fig);
  const count = $('.lb__count', lb);
  const lbImg = document.createElement('img');
  lbImg.decoding = 'async';
  fig.prepend(lbImg);
  let list = [], idx = 0, lastFocus = null;
  const render = () => {
    const src = list[idx];
    lbImg.classList.remove('is-ready');
    lbImg.onload = () => lbImg.classList.add('is-ready');
    lbImg.src = src.src;
    lbImg.alt = src.alt;
    cap.textContent = src.alt;
    count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  };
  const open = (card) => {
    list = visibleCards().map((c) => $('img', c));
    idx = Math.max(0, list.indexOf($('img', card)));
    lastFocus = document.activeElement;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    render();
    lenis ? lenis.stop() : (document.body.style.overflow = 'hidden');
    $('.lb__close', lb).focus();
  };
  const close = () => {
    lb.classList.remove('is-open');
    setTimeout(() => (lb.hidden = true), 400);
    lenis ? lenis.start() : (document.body.style.overflow = '');
    lastFocus && lastFocus.focus();
  };
  const step = (d) => { idx = (idx + d + list.length) % list.length; render(); };
  cards.forEach((c) => $('.card__open', c).addEventListener('click', () => open(c)));
  $('.lb__close', lb).addEventListener('click', close);
  $('.lb__prev', lb).addEventListener('click', () => step(-1));
  $('.lb__next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === fig) close(); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setMenu(false); if (!lb.hidden) close(); }
    if (lb.hidden) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  let sx = null;
  lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    sx = null;
  });

  /* ---------- FAQ ---------- */
  $$('.faq details').forEach((d) => {
    const s = $('summary', d);
    const body = $('.faq__body', d);
    s.addEventListener('click', (e) => {
      if (!window.gsap || reduce) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: .5, ease: 'expo.out', onComplete: () => { d.open = false; gsap.set(body, { clearProps: 'height' }); } });
      } else {
        $$('.faq details[open]').forEach((o) => o !== d && $('summary', o).click());
        d.open = true;
        gsap.from(body, { height: 0, duration: .7, ease: 'expo.out', clearProps: 'height' });
      }
    });
  });

  /* ================= animações ================= */
  const loader = $('.loader');
  const hideLoader = () => loader && loader.remove();
  const mbar = $('.mbar');

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    hideLoader();
    const onScroll = () => mbar.classList.toggle('is-visible', scrollY > innerHeight * .7);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (window.Lenis) {
    lenis = window.lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const splitChars = (el) => {
    const nodes = [...el.childNodes];
    el.textContent = '';
    const chars = [];
    nodes.forEach((n) => {
      const host = n.nodeType === 1 ? el.appendChild(n.cloneNode(false)) : el;
      [...n.textContent].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c === ' ' ? ' ' : c;
        host.appendChild(s);
        chars.push(s);
      });
    });
    return chars;
  };
  const splitWords = (el) => {
    const words = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.append(s);
          words.push(s);
        });
        n.replaceWith(frag);
      } else {
        n.classList.add('w');
        words.push(n);
      }
    });
    return words;
  };

  /* ---------- intro: loader -> hero ---------- */
  const title = $('.hero__title');
  title.setAttribute('aria-label', 'Wellington Costa · Tattoo');
  $$('.line', title).forEach((l) => l.setAttribute('aria-hidden', 'true'));
  const heroChars = $$('.line', title).flatMap(splitChars);
  const rayLines = $$('.hero__rays line, .hero__rays circle');
  rayLines.forEach((l) => { const len = l.getTotalLength ? l.getTotalLength() : 100; l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });

  gsap.set(heroChars, { yPercent: 115, rotate: 6 });
  const fadeIns = ['.nav', '.hero .kicker', '.hero__sub', '.hero__ctas > *', '.hero__rating', '.hero__meta', '.hero__scroll'];
  gsap.set(fadeIns, { autoAlpha: 0, y: 24 });

  const intro = gsap.timeline({ paused: true });
  intro
    .from('.hero__bg img', { scale: 1.4, duration: 2.4, ease: 'expo.out' }, 0)
    .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: .022 }, .1)
    .to(rayLines, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.out', stagger: { each: .012, from: 'random' } }, .35)
    .to(fadeIns, { autoAlpha: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .07, clearProps: 'transform' }, .55);

  const heroImg = $('.hero__bg img');
  const imgReady = heroImg.complete ? Promise.resolve() : new Promise((r) => { heroImg.onload = heroImg.onerror = r; });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([
    Promise.all([imgReady, fontsReady, new Promise((r) => setTimeout(r, 1100))]),
    new Promise((r) => setTimeout(r, 3200)),
  ]).then(() => {
    gsap.timeline()
      .to('.loader__inner', { autoAlpha: 0, y: -16, duration: .35, ease: 'power2.in' })
      .to(loader, { yPercent: -100, duration: .95, ease: 'expo.inOut' }, '-=.05')
      .add(() => intro.play(), '-=.55')
      .add(() => { hideLoader(); ScrollTrigger.refresh(); });
  });

  /* ---------- hero: artista -> portal para a tattoo ---------- */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: () => '+=' + innerHeight * 1.3, scrub: .6, pin: true, anticipatePin: 1 },
  })
    .to('.hero__content', { yPercent: -18, autoAlpha: 0, ease: 'power1.in', duration: .4 }, 0)
    .to(['.hero__scroll', '.hero__meta'], { autoAlpha: 0, duration: .2 }, 0)
    .to('.hero__bg', { scale: 1.3, ease: 'none', duration: 1 }, 0)
    .to('.hero__rays', { rotate: 50, scale: 1.4, autoAlpha: 0, ease: 'none', duration: .7 }, 0)
    .fromTo('.hero__portal', { clipPath: 'inset(50% 50% 50% 50% round 300px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: .75 }, .12)
    .fromTo('.hero__portal img', { scale: 1.5 }, { scale: 1, ease: 'none', duration: .88 }, .12)
    .from('.portal__text span', { yPercent: 60, autoAlpha: 0, stagger: .08, ease: 'power3.out', duration: .22 }, .66);

  /* letras do título reagem ao mouse */
  if (finePointer) {
    const setters = heroChars.map((c) => gsap.quickTo(c, 'y', { duration: .5, ease: 'power3.out' }));
    title.addEventListener('pointermove', (e) => {
      heroChars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        setters[i](d < 160 ? -(1 - d / 160) * 26 : 0);
      });
    });
    title.addEventListener('pointerleave', () => setters.forEach((s) => s(0)));
  }

  /* ---------- fumaça de tinta ---------- */
  const canvas = $('.hero__smoke');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const n = innerWidth < 768 ? 10 : 22;
    const mouse = { x: -999, y: -999 };
    let w = 0, h = 0, running = true;
    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const make = (init) => ({
      x: Math.random() * w, y: init ? h * (.3 + Math.random() * .8) : h + 80,
      r: 90 + Math.random() * 170, vx: (Math.random() - .5) * .25, vy: .22 + Math.random() * .4,
      t: init ? Math.random() * 500 : 0, life: 700 + Math.random() * 700, seed: Math.random() * 100,
    });
    resize();
    const ps = Array.from({ length: n }, () => make(true));
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.t++;
        p.x += p.vx + Math.sin((p.t + p.seed * 50) * .008) * .35;
        p.y -= p.vy;
        p.r += .12;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 220) { p.x += (dx / d) * 1.6; p.y += (dy / d) * .8; }
        const k = p.t / p.life;
        const a = Math.sin(Math.PI * Math.min(k, 1)) * .07;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(217,183,154,${a})`);
        g.addColorStop(1, 'rgba(217,183,154,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (k >= 1 || p.y + p.r < 0) Object.assign(p, make(false));
      }
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting; if (running && !was) requestAnimationFrame(draw); }).observe(canvas);
    requestAnimationFrame(draw);
  }

  /* ---------- nav, barra mobile e progresso ---------- */
  const nav = $('.nav');
  const progress = $('.progress');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      gsap.set(progress, { scaleX: self.progress });
      const y = self.scroll();
      nav.classList.toggle('is-hidden', self.direction === 1 && y > innerHeight * .4 && !menu.classList.contains('is-open'));
      mbar.classList.toggle('is-visible', y > innerHeight * 1.6 && self.progress < .97);
    },
  });

  /* ---------- faixas: velocidade reage ao scroll ---------- */
  const loops = [];
  $$('.ticker__track').forEach((track) => {
    const group = track.firstElementChild;
    track.appendChild(group.cloneNode(true));
    const dir = Number(track.closest('[data-dir]').dataset.dir);
    loops.push(dir === 1
      ? gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 })
      : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 }));
  });
  gsap.set('.ticker__row--a', { rotate: -3 });
  gsap.set('.ticker__row--b', { rotate: 2 });
  const skewers = $$('.ticker__row').map((r) => gsap.quickTo(r, 'skewX', { duration: .5, ease: 'power3.out' }));
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      const boost = 1 + Math.min(Math.abs(v) / 250, 6);
      loops.forEach((t) => gsap.to(t, { timeScale: boost * (v < 0 ? -1 : 1), duration: .2, overwrite: true }));
      skewers.forEach((s) => s(gsap.utils.clamp(-8, 8, v / -300)));
      clearTimeout(self._t);
      self._t = setTimeout(() => { loops.forEach((t) => gsap.to(t, { timeScale: 1, duration: .8, overwrite: true })); skewers.forEach((s) => s(0)); }, 120);
    },
  });

  /* ---------- texto que acende palavra por palavra ---------- */
  $$('.reveal-words').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(words, { opacity: .13 }, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
  });

  /* contadores */
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const o = { v: 0 };
    const fmt = (v) => v.toFixed(dec).replace('.', ',');
    el.textContent = fmt(0);
    gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onUpdate: () => (el.textContent = fmt(o.v)) });
  });
  gsap.from('.stat', { y: 40, autoAlpha: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });

  /* títulos e textos */
  $$('.title, .showcase__big span, .card--cta__title').forEach((h) =>
    gsap.from(h, { yPercent: 30, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } })
  );
  $$('.section .eyebrow, .lead, .filters, .score, .showcase__ctas, .visit address, .hours, .visit__ctas').forEach((el) =>
    gsap.from(el, { y: 24, autoAlpha: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
  );

  /* imagens que abrem por clip-path + parallax */
  const reveal = (el, r) => {
    gsap.fromTo(el, { clipPath: `inset(16% 8% 16% 8% round ${r})` }, { clipPath: `inset(0% 0% 0% 0% round ${r})`, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 40%', scrub: true } });
    const img = $('img', el);
    gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  };
  reveal($('.about__media'), '300px 300px 22px 22px');
  reveal($('.space__img'), '22px');

  /* ---------- portfólio ---------- */
  const mm = gsap.matchMedia();
  const rail = $('.catalog__rail');
  mm.add('(min-width: 960px)', () => {
    const dist = () => rail.scrollWidth - innerWidth;
    const tween = gsap.to(rail, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.catalog', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: .7, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(barEl, { scaleX: Math.max(.04, self.progress) });
          const n = visibleCards().length;
          countEl.textContent = String(Math.min(n, Math.max(1, Math.ceil(self.progress * (n + .4))))).padStart(2, '0');
        },
      },
    });
    cards.concat($('.card--cta')).forEach((card) => {
      const img = $('.card__media img', card);
      if (img) gsap.fromTo(img, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(card, { rotate: 4, yPercent: 8, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 60%', scrub: true } });
    });
  });
  mm.add('(max-width: 959px)', () => {
    gsap.from(cards.slice(0, 3), { x: 80, autoAlpha: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.catalog__cards', start: 'top 85%' } });
  });

  /* inclinação 3D nos cards */
  if (finePointer) {
    cards.forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 10);
        rx(-((e.clientY - r.top) / r.height - .5) * 10);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- vitrine: fileiras em loop ---------- */
  $$('.wall__row').forEach((r) => {
    const speed = Number(r.dataset.speed);
    const items = [...r.children];
    items.forEach((el) => r.appendChild(el.cloneNode(true)));
    const firstClone = r.children[items.length];
    const loop = gsap.timeline();
    const build = () => {
      const d = firstClone.offsetLeft - items[0].offsetLeft;
      const dur = d / (40 * Math.abs(speed));
      loop.clear().add(speed < 0
        ? gsap.fromTo(r, { x: 0 }, { x: -d, duration: dur, ease: 'none', repeat: -1 })
        : gsap.fromTo(r, { x: -d }, { x: 0, duration: dur, ease: 'none', repeat: -1 }));
    };
    build();
    ScrollTrigger.addEventListener('refreshInit', build);
    loops.push(loop);
    if (finePointer) {
      r.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: .15, duration: .6, overwrite: true }));
      r.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: .6, overwrite: true }));
    }
  });
  gsap.from('.wall .tile', { scale: .85, autoAlpha: 0, duration: .9, ease: 'power3.out', stagger: { each: .03, from: 'random' }, scrollTrigger: { trigger: '.wall', start: 'top 85%' } });

  /* ---------- estúdio ---------- */
  gsap.from('.perks li', { x: -30, autoAlpha: 0, stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.perks', start: 'top 85%' } });
  gsap.from('.sticker', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.space__media', start: 'top 70%' } });
  gsap.to('.sticker__ring', { rotate: 360, ease: 'none', scrollTrigger: { trigger: '.space', start: 'top bottom', end: 'bottom top', scrub: .5 } });

  /* ---------- avaliações ---------- */
  gsap.from('.quote', { y: 60, rotate: 2, autoAlpha: 0, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.quotes', start: 'top 85%' } });

  /* ---------- passos: a linha é desenhada e o ponto percorre ---------- */
  const path = $('.route__path');
  const dot = $('.route__dot');
  const svg = $('.route');
  if (path && dot) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    const heart = $('.step__heart');
    const pop = gsap.from(heart, { scale: 0, duration: .6, ease: 'back.out(2.4)', paused: true });
    const place = (p) => {
      path.style.strokeDashoffset = len * (1 - p);
      const pt = path.getPointAtLength(len * p);
      const sx = svg.clientWidth / 40, sy = svg.clientHeight / 600;
      gsap.set(dot, { x: (pt.x - 20) * sx, y: pt.y * sy });
      if (p > .95 && pop.progress() === 0) pop.play();
      else if (p < .88 && pop.progress() > 0) pop.reverse();
    };
    place(0);
    const o = { p: 0 };
    gsap.to(o, { p: 1, ease: 'none', onUpdate: () => place(o.p), scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 65%', scrub: .4, onRefresh: () => place(o.p) } });
  }
  $$('.step').forEach((s) => gsap.from(s, { y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%' } }));

  /* faq */
  gsap.from('.faq details', { y: 24, autoAlpha: 0, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 88%' } });

  /* mapa */
  gsap.fromTo('.visit__map', { clipPath: 'inset(14% 10% 14% 10% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: '.visit__map', start: 'top 95%', end: 'top 45%', scrub: true } });

  /* rodapé */
  gsap.from('.footer__big span', { yPercent: 100, autoAlpha: 0, ease: 'none', stagger: .06, scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'top 35%', scrub: true } });

  /* botões magnéticos e cursor */
  if (finePointer) {
    $$('.magnetic').forEach((b) => {
      const mx = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const my = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .3);
        my((e.clientY - r.top - r.height / 2) * .4);
      });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
    document.documentElement.classList.add('has-cursor');
    const cur = $('.cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3.out' });
    const cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => cur.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .card')));
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
