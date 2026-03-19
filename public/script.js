/* ============================================================
   Ice Cap Labs — script.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initScrollReveal();
  initWordReveal();
  initNav();
  initContactForm();
  initFooterYear();
  initTileStrip();
  initPixelTitle();
  initProcessTimeline();
  initBlogCarousel();
  initYetiReveal();
  initServiceColumns();
  initServiceCards();
});


/* ── Parallax ─────────────────────────────────────────────── */
function initParallax() {
  const layers = document.querySelectorAll('[data-speed]');
  if (!layers.length) return;

  // Trim main height to account for parallax compression.
  const main = document.querySelector('main');
  const hero = document.getElementById('hero');

  function trimMain() {
    if (!main || !hero) return;
    // Temporarily remove fixed height so we can measure true scrollHeight
    main.style.height = '';
    const contentBelow = main.scrollHeight - hero.offsetHeight;
    const trimmed = hero.offsetHeight + contentBelow * 0.55;
    main.style.height = trimmed + 'px';
    main.style.overflow = 'hidden';
  }

  trimMain();
  window.addEventListener('hashchange', trimMain);

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    for (let i = 0; i < layers.length; i++) {
      const speed = +layers[i].dataset.speed;
      if (speed) layers[i].style.transform = `translate3d(0, ${-(y * speed) | 0}px, 0)`;
    }
  }, { passive: true });
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  items.forEach((el) => {
    const isCard = el.classList.contains('service-card');
    const dist = isCard ? '80px' : '40px';
    const dur  = isCard ? '1.2s' : '0.75s';
    el.style.opacity   = '0';
    el.style.transform = `translateY(${dist})`;
    const delay = el.dataset.delay || '0';
    el.style.transition = [
      `opacity ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      `transform ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    ].join(', ');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:   0.1,
    rootMargin:  '0px 0px -60px 0px',
  });

  items.forEach((el) => observer.observe(el));
}

/* ── Word Reveal ──────────────────────────────────────────── */
function initWordReveal() {
  const headings = document.querySelectorAll('.word-reveal');
  if (!headings.length) return;

  headings.forEach((el) => {
    const text      = el.textContent.trim();
    const words     = text.split(/\s+/);
    const baseDelay = parseFloat(el.dataset.delay || '0');

    el.innerHTML = words.map((word, i) => `\
<span style="overflow:hidden;display:inline-block;margin-right:0.28em;line-height:1.15">\
<span class="word-inner" style="\
display:inline-block;\
transform:translateY(115%);\
transition:transform 0.65s cubic-bezier(0.16,1,0.3,1) ${(baseDelay + i * 0.07).toFixed(3)}s">\
${word}\
</span>\
</span>`).join('');

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.word-inner').forEach((w) => {
          w.style.transform = 'translateY(0%)';
        });
        observer.unobserve(el);
      }
    }, {
      threshold:  0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    observer.observe(el);
  });
}

/* ── Navigation ───────────────────────────────────────────── */
function initNav() {
  const nav    = document.getElementById('site-nav');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-mobile-menu');
  if (!nav || !burger || !menu) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    nav.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── Contact form ─────────────────────────────────────────── */
function initContactForm() {
  // Contact form is now handled by the inline script in ContactCard.astro
  // which submits via the /api/contact endpoint.
}

/* ── Tile strip ──────────────────────────────────────────── */
function initTileStrip() {
  const grids = document.querySelectorAll('.tile-grid');
  if (!grids.length) return;

  grids.forEach(function(grid) {
    const symbols = ['×', '○', 'W', '>', '✳', '⊕'];
    const cellSize = 40;
    const gap = 4;
    let cols = 0;
    let rows = 0;
    let tiles = [];

    function build() {
      grid.innerHTML = '';
      const rect = grid.getBoundingClientRect();
      cols = Math.floor((rect.width + gap) / (cellSize + gap));
      rows = Math.floor((rect.height + gap) / (cellSize + gap));
      tiles = [];

      for (let i = 0; i < cols * rows; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        tile.innerHTML =
          '<div class="tile-inner">' +
            '<div class="tile-front"></div>' +
            '<div class="tile-back">' + symbol + '</div>' +
          '</div>';
        tile.dataset.index = i;
        grid.appendChild(tile);
        tiles.push(tile);
      }
    }

    function flipTile(tile, delay) {
      if (tile.classList.contains('flipped')) return;
      setTimeout(() => {
        tile.classList.add('flipped');
        setTimeout(() => {
          tile.classList.remove('flipped');
        }, 800 + delay);
      }, delay);
    }

    function getNeighbors(idx) {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const neighbors = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            neighbors.push(nr * cols + nc);
          }
        }
      }
      return neighbors;
    }

    grid.addEventListener('mouseover', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      const idx = +tile.dataset.index;

      flipTile(tile, 0);

      const neighbors = getNeighbors(idx);
      neighbors.forEach((ni) => {
        flipTile(tiles[ni], 60 + Math.random() * 80);
      });
    });

    build();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });
  });
}

/* ── Pixel title (service pages) ──────────────────────────── */
function initPixelTitle() {
  const hero = document.querySelector('.pixel-hero');
  const grid = document.getElementById('pixel-title-grid');
  if (!hero || !grid) return;

  const titleEl = hero.querySelector('.pixel-hero-title');
  const titleText = titleEl ? titleEl.textContent.trim() : 'DESIGN';

  const cellSize = 8;
  const gap = 2;
  const step = cellSize + gap;
  let cols = 0;
  let rows = 0;
  let tileMap = {};  // key: "col,row" → tile element
  function build() {
    grid.innerHTML = '';
    tileMap = {};

    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    cols = Math.floor(w / step);
    rows = Math.floor(h / step);

    // Offscreen canvas to sample text shape
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Draw text matching the CSS title — scale font to fit viewport width
    const padding = w * 0.08; // 4% each side
    const words = titleText.split(' ');
    const multiLine = words.length > 1;
    let fontSize = Math.min(w * 0.18, 320);

    if (multiLine) {
      // Size to the longest word so each line fits
      const longest = words.reduce((a, b) => a.length > b.length ? a : b);
      ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
      let measured = ctx.measureText(longest).width;
      if (measured > w - padding) {
        fontSize *= (w - padding) / measured;
      }
      ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      const lineHeight = fontSize * 1.1;
      const totalHeight = lineHeight * words.length;
      const startY = (h - totalHeight) / 2 + lineHeight / 2;
      words.forEach((word, i) => {
        ctx.fillText(word, w / 2, startY + i * lineHeight);
      });
    } else {
      ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
      let measured = ctx.measureText(titleText).width;
      if (measured > w - padding) {
        fontSize *= (w - padding) / measured;
      }
      ctx.font = `700 ${fontSize}px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(titleText, w / 2, h / 2);
    }

    const imageData = ctx.getImageData(0, 0, w, h).data;

    grid.style.setProperty('--cell', cellSize + 'px');

    // Create tiles only where text pixels exist
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * step + Math.floor(step / 2);
        const py = r * step + Math.floor(step / 2);
        const idx = (py * w + px) * 4;
        const alpha = imageData[idx + 3];

        if (alpha > 128) {
          const tile = document.createElement('div');
          tile.className = 'ptile';
          tile.style.left = (c * step) + 'px';
          tile.style.top = (r * step) + 'px';
          tile.innerHTML =
            '<div class="ptile-inner">' +
              '<div class="ptile-front"></div>' +
              '<div class="ptile-back"></div>' +
            '</div>';
          tile.dataset.col = c;
          tile.dataset.row = r;
          grid.appendChild(tile);
          tileMap[c + ',' + r] = tile;
        }
      }
    }

    // Sync CSS title font size so the fallback text matches before grid appears
    if (titleEl) titleEl.style.fontSize = fontSize + 'px';

    hero.classList.add('pixels-active');
  }

  function flipTile(tile, delay) {
    if (!tile || tile.classList.contains('flipped')) return;
    setTimeout(() => {
      tile.classList.add('flipped');
      setTimeout(() => {
        tile.classList.remove('flipped');
      }, 900 + delay);
    }, delay);
  }

  function flipAt(c, r, delay) {
    const tile = tileMap[c + ',' + r];
    if (tile) flipTile(tile, delay);
  }

  // Track mouse position and flip tiles under cursor + neighbors
  grid.addEventListener('mousemove', (e) => {
    const rect = grid.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const c = Math.floor(mx / step);
    const r = Math.floor(my / step);

    // Flip hovered tile
    flipAt(c, r, 0);

    // Flip neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        flipAt(c + dc, r + dr, 40 + Math.random() * 60);
      }
    }
  });

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}


/* ── Process timeline (looping line fill animation) ────────── */
function initProcessTimeline() {
  const stepsWrap = document.getElementById('process-steps');
  const lineFill = document.getElementById('process-line-fill');
  const ctaWrap = document.querySelector('.process-cta-wrap');
  if (!stepsWrap || !lineFill) return;

  const steps = stepsWrap.querySelectorAll('.process-step');
  const thresholds = [0.05, 0.3, 0.55, 0.8];
  const duration = 4000; // ms to fill the line
  const pauseAtEnd = 1500; // ms to hold at 100% before resetting
  let animId = null;
  let startTime = null;

  // CTA always visible
  if (ctaWrap) ctaWrap.classList.add('visible');

  function updateVisuals(progress) {
    const clipRight = Math.max(0, 100 - progress * 100);
    lineFill.style.clipPath = `inset(0 ${clipRight}% 0 0)`;

    steps.forEach((step, i) => {
      if (progress >= thresholds[i]) {
        step.classList.add('reached');
      } else {
        step.classList.remove('reached');
      }
    });
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const totalCycle = duration + pauseAtEnd;
    const cyclePos = elapsed % totalCycle;

    let progress;
    if (cyclePos < duration) {
      progress = cyclePos / duration;
    } else {
      progress = 1; // hold at full
    }

    updateVisuals(progress);
    animId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animId) return;
    startTime = null;
    animId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Only animate when the section is visible
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      startAnimation();
    } else {
      stopAnimation();
      updateVisuals(0);
    }
  }, { threshold: 0.1 });
  observer.observe(stepsWrap);
}

/* ── Blog coverflow (3D thumb-through) ────────────────────── */
function initBlogCarousel() {
  const carousel = document.getElementById('blog-carousel');
  if (!carousel) return;

  const realCards = Array.from(carousel.querySelectorAll('.blog-card'));
  const prevBtn = document.querySelector('.blog-arrow--prev');
  const nextBtn = document.querySelector('.blog-arrow--next');
  const totalReal = realCards.length;

  // Build a managed array of all items in DOM order.
  // We keep PAD dummies on each side of the "active" real card at all times.
  const PAD = 8;
  const items = []; // { el, type: 'real'|'dummy' }

  function createDummy() {
    const d = document.createElement('div');
    d.className = 'blog-card-dummy';
    return d;
  }

  // Initial build: PAD dummies, then real cards, then PAD dummies
  for (let i = 0; i < PAD; i++) {
    const d = createDummy();
    carousel.insertBefore(d, carousel.firstChild);
  }
  for (let i = 0; i < PAD; i++) {
    const d = createDummy();
    carousel.appendChild(d);
  }

  function rebuildItems() {
    items.length = 0;
    Array.from(carousel.children).forEach((el) => {
      items.push({
        el,
        type: el.classList.contains('blog-card') ? 'real' : 'dummy',
      });
    });
  }
  rebuildItems();

  // Track which real card index (0-based into realCards) is active
  let activeIndex = 0;

  // Layout constants
  const ANGLE = 55;
  const SPACING = 40;
  const ACTIVE_GAP = 210;
  const Z_STEP = -30;

  function findActiveItemIndex() {
    // Find the position of the active real card in the items array
    let count = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === 'real') {
        if (count === activeIndex) return i;
        count++;
      }
    }
    return 0;
  }

  function layout() {
    const center = findActiveItemIndex();

    items.forEach((item, i) => {
      const offset = i - center;
      const el = item.el;
      const isActive = offset === 0;

      if (isActive) {
        el.style.transform = 'translateX(0) translateZ(0) rotateY(0deg)';
        el.style.opacity = '1';
        el.style.zIndex = 10;
        el.classList.add('active');
      } else {
        const side = offset < 0 ? -1 : 1;
        const dist = Math.abs(offset);
        const tx = side * (ACTIVE_GAP + (dist - 1) * SPACING);
        const ry = -side * ANGLE;
        const tz = Z_STEP * dist;
        const op = Math.max(0, 1 - dist * 0.05);

        el.style.transform =
          `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg)`;
        el.style.opacity = op;
        el.style.zIndex = Math.max(0, 10 - dist);
        el.classList.remove('active');
      }
    });

    // Never disable arrows — infinite scroll
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  function navigate(dir) {
    // dir: +1 = next, -1 = prev
    // Loop the real card index
    activeIndex = ((activeIndex + dir) % totalReal + totalReal) % totalReal;

    // Move a dummy from the trailing side to the leading side
    if (dir > 0) {
      // Going right: take a dummy from the left, add to the right
      const first = carousel.firstElementChild;
      if (first && first.classList.contains('blog-card-dummy')) {
        carousel.removeChild(first);
        carousel.appendChild(first);
      }
    } else {
      // Going left: take a dummy from the right, add to the left
      const last = carousel.lastElementChild;
      if (last && last.classList.contains('blog-card-dummy')) {
        carousel.removeChild(last);
        carousel.insertBefore(last, carousel.firstChild);
      }
    }

    rebuildItems();
    layout();
  }

  // Click real cards to jump to them
  realCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i === activeIndex) return;
      const diff = i - activeIndex;
      // Navigate step by step for smooth transition
      navigate(diff > 0 ? 1 : -1);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigate(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(1));
  }

  document.addEventListener('keydown', (e) => {
    const rect = carousel.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  layout();
}

/* ── Yeti reveal ─────────────────────────────────────────── */
function initYetiReveal() {
  const wraps = document.querySelectorAll('.contact-card-wrap');
  if (!wraps.length) return;

  wraps.forEach(wrap => {
    const card = wrap.querySelector('.contact-card');
    if (!card) return;

    // Show the yeti once the card scrolls into view, with a delay
    // so the card's reveal animation plays first
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          wrap.classList.add('yeti-entered');
        }, 750);
        observer.unobserve(card);
      }
    }, { threshold: 0.3 });

    observer.observe(card);
  });
}

/* ── Service columns scroll reveal ───────────────────────── */
function initServiceColumns() {
  const section = document.getElementById('svc-columns');
  if (!section) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));

    section.classList.toggle('phase-titles', progress > 0.3);
    section.classList.toggle('phase-list', progress > 0.6);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Footer year ──────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Service cards mobile flip ────────────────────────────── */
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  // Only apply mobile behavior on touch devices or small screens
  const isMobileDevice = ('ontouchstart' in window) || window.innerWidth <= 768;
  if (!isMobileDevice) return;

  cards.forEach((card) => {
    const url = card.dataset.cardUrl;
    const learnMoreBtn = card.querySelector('.card-learn-more');

    // Prevent default navigation on card click
    card.addEventListener('click', (e) => {
      // If clicking the "Learn More" button, allow navigation
      if (e.target.classList.contains('card-learn-more')) {
        return; // Let the link navigate
      }

      // Otherwise, prevent navigation and flip the card
      e.preventDefault();
      
      // Close other flipped cards
      cards.forEach(c => {
        if (c !== card) c.classList.remove('flipped');
      });

      // Toggle this card
      card.classList.toggle('flipped');
    });

    // Make Learn More button navigate
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger card flip
        window.location.href = url;
      });
    }
  });

  // Close flipped cards when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.service-card')) {
      cards.forEach(c => c.classList.remove('flipped'));
    }
  });
}
