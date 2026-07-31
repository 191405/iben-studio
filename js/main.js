/* ============================================================
   IBEN STUDIO — Interactive Behaviors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Page Loader
  initLoader();

  // Scroll Reveal Animations
  initScrollReveal();

  // Header scroll behavior
  initHeaderScroll();

  // Mobile navigation
  initMobileNav();

  // Smooth anchor scrolling
  initSmoothScroll();

  // Counter animation for discipline numbers
  initCounterAnimation();

  // Enterprise Backend API & Sizing integrations
  initApiHealthCheck();
  initSolarCalculator();
  initPortfolioGallery();
  initInquiryForm();

  // Figma-grade interactive micro-animations & responsive parallax
  initFigmaInteractions();
});

/* ===== PAGE LOADER ===== */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      // Enable scroll animations after loader hides
      document.body.classList.add('loaded');
    }, 800);
  });

  // Fallback: force hide after 3 seconds
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.classList.add('loaded');
  }, 3000);
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ===== HEADER SCROLL ===== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ===== MOBILE NAVIGATION ===== */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
}

/* ===== COUNTER ANIMATION ===== */
function initCounterAnimation() {
  const numbers = document.querySelectorAll('.discipline-number');
  if (!numbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.number, 10);
        animateNumber(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => observer.observe(el));
}

function animateNumber(el, target) {
  let current = 0;
  const duration = 800;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    current = Math.round(eased * target);
    el.textContent = String(current).padStart(2, '0');

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ============================================================================
   ENTERPRISE BACKEND API & INTERACTIVE FIGMA UI LOGIC
   ============================================================================ */

/* 1. LIVE API HEALTH CHECK */
async function initApiHealthCheck() {
  const badgeText = document.getElementById('api-status-text');
  const badgeDot = document.querySelector('.api-status-dot');
  if (!badgeText) return;

  try {
    const health = await window.ibenAPI.checkHealth();
    if (health && health.status === 'OK') {
      badgeText.textContent = `API ONLINE (${health.version || 'v1.0.0'})`;
      if (badgeDot) badgeDot.style.backgroundColor = '#2E7D32';
    } else {
      badgeText.textContent = 'LOCAL ENGINE';
      if (badgeDot) badgeDot.style.backgroundColor = '#DFB76C';
    }
  } catch (err) {
    badgeText.textContent = 'LOCAL ENGINE';
    if (badgeDot) badgeDot.style.backgroundColor = '#DFB76C';
  }
}

/* 2. SOLAR ENGINEERING SIZING & ROI ESTIMATOR */
function initSolarCalculator() {
  const sliderKwh = document.getElementById('slider-kwh');
  const sliderKw = document.getElementById('slider-kw');
  const sliderHours = document.getElementById('slider-hours');

  if (!sliderKwh || !sliderKw || !sliderHours) return;

  const valKwh = document.getElementById('val-kwh');
  const valKw = document.getElementById('val-kw');
  const valHours = document.getElementById('val-hours');

  const outKva = document.getElementById('out-kva');
  const outBattery = document.getElementById('out-battery');
  const outSolar = document.getElementById('out-solar');
  const outPanels = document.getElementById('out-panels');
  const outCapex = document.getElementById('out-capex');
  const outPayback = document.getElementById('out-payback');
  const btnQuote = document.getElementById('btn-request-quote');

  const updateCalculation = async () => {
    const dailyKwh = parseFloat(sliderKwh.value);
    const peakKw = parseFloat(sliderKw.value);
    const backupHours = parseFloat(sliderHours.value);

    valKwh.textContent = `${dailyKwh} kWh`;
    valKw.textContent = `${peakKw} kW`;
    valHours.textContent = `${backupHours} Hours`;

    if (dailyKwh === 0 && peakKw === 0 && backupHours === 0) {
      if (outKva) outKva.textContent = '0 kVA';
      if (outBattery) outBattery.textContent = '0 kWh';
      if (outSolar) outSolar.textContent = '0 kWp';
      if (outPanels) outPanels.textContent = '0 Panels';
      if (outCapex) outCapex.textContent = '₦0';
      if (outPayback) outPayback.textContent = 'Est. Payback: Awaiting Input';
      return;
    }

    try {
      // Use Live API calculation or fallback to client SDK local math
      const res = await window.ibenAPI.calculateSolar({ dailyKwh, peakKw, backupHours });
      if (res && res.inverterKva) {
        outKva.textContent = `${res.inverterKva} kVA`;
        outBattery.textContent = `${res.batteryKwh} kWh`;
        outSolar.textContent = `${res.solarKwp} kWp`;
        outPanels.textContent = `${res.panelCount550W} Panels`;
        outCapex.textContent = `₦${Number(res.estimatedCapexNGN).toLocaleString()}`;
        outPayback.textContent = `Est. Payback: ${res.paybackYears} Years vs Diesel Generation`;
      }
    } catch (e) {
      console.error('Solar Sizing calculation error:', e);
    }
  };

  sliderKwh.addEventListener('input', updateCalculation);
  sliderKw.addEventListener('input', updateCalculation);
  sliderHours.addEventListener('input', updateCalculation);

  if (btnQuote) {
    btnQuote.addEventListener('click', () => {
      const contactSection = document.getElementById('intake-portal');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const disciplineSelect = document.getElementById('inq-discipline');
        const msgText = document.getElementById('inq-message');
        if (disciplineSelect) disciplineSelect.value = 'solar-engineering';
        if (msgText) {
          msgText.value = `Requesting bespoken Solar quote for ${sliderKwh.value} kWh daily consumption, ${sliderKw.value} kW peak load, with ${sliderHours.value} hours night backup duration.`;
        }
      }
    });
  }

  // Perform initial calculation
  updateCalculation();
}

/* 3. DYNAMIC PORTFOLIO GALLERY & CATEGORY FILTERS */
let portfolioItemsData = [];

async function initPortfolioGallery() {
  const gallery = document.getElementById('portfolio-gallery');
  const filters = document.getElementById('portfolio-filters');
  if (!gallery || !filters) return;

  try {
    const data = await window.ibenAPI.getPortfolio();
    if (data && data.data && data.data.length > 0) {
      portfolioItemsData = data.data;
      renderPortfolioCards('all');
    }
  } catch (err) {
    console.warn('Using static portfolio gallery fallback:', err);
  }

  // Filter tab click handlers
  const buttons = filters.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (portfolioItemsData.length > 0) {
        renderPortfolioCards(filter);
      } else {
        // Filter existing static DOM items
        const staticItems = gallery.querySelectorAll('.portfolio-item');
        staticItems.forEach(item => {
          if (filter === 'all' || item.dataset.cat === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });

  initPortfolioModal();
}

function renderPortfolioCards(category) {
  const gallery = document.getElementById('portfolio-gallery');
  if (!gallery || !portfolioItemsData) return;

  const filtered = category === 'all'
    ? portfolioItemsData
    : portfolioItemsData.filter(item => item.category === category);

  gallery.innerHTML = filtered.map((item, idx) => `
    <div class="portfolio-item reveal loaded" data-id="${item.id}" data-cat="${item.category}" style="cursor: pointer;">
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" onerror="this.src='assets/images/portfolio-editorial.png'">
      <div class="portfolio-item-overlay">
        <div class="portfolio-item-title">${item.title}</div>
        <div class="portfolio-item-cat">${item.discipline}</div>
      </div>
    </div>
  `).join('');

  // Attach modal click handlers
  gallery.querySelectorAll('.portfolio-item').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = card.dataset.id;
      openPortfolioModal(itemId);
    });
  });
}

function initPortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

async function openPortfolioModal(itemId) {
  const modal = document.getElementById('portfolio-modal');
  const container = document.getElementById('modal-content-container');
  if (!modal || !container) return;

  const item = portfolioItemsData.find(i => String(i.id) === String(itemId));
  if (!item) return;

  container.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #DFB76C; letter-spacing: 0.1em; text-transform: uppercase;">
      ${item.discipline} • ${item.year || '2026'}
    </div>
    <h3 style="font-family: var(--font-serif); font-size: var(--text-3xl); margin: var(--space-sm) 0;">
      ${item.title}
    </h3>
    <p style="font-family: var(--font-sans); color: var(--color-text-muted); line-height: 1.6; margin: var(--space-md) 0;">
      ${item.description}
    </p>
    <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-top: var(--space-lg);">
      ${(item.technologies || []).map(tech => `
        <span style="background: var(--color-bg-alt); border: 1px solid var(--color-border); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-family: var(--font-mono); font-size: var(--text-xs);">
          ${tech}
        </span>
      `).join('')}
    </div>
    <div style="margin-top: var(--space-xl);">
      <button class="nav-cta" onclick="document.getElementById('portfolio-modal').classList.remove('open'); document.getElementById('intake-portal').scrollIntoView({behavior:'smooth'});" style="width: 100%; justify-content:center;">
        Commission Similar Work
      </button>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

/* 4. ENTERPRISE CONTACT & PROJECT INTAKE FORM SUBMISSION */
function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  const statusMsg = document.getElementById('form-status-msg');
  const submitBtn = document.getElementById('btn-submit-inquiry');

  if (!form || !statusMsg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('inq-name');
    const emailInput = document.getElementById('inq-email');
    const phoneInput = document.getElementById('inq-phone');
    const disciplineInput = document.getElementById('inq-discipline');
    const messageInput = document.getElementById('inq-message');

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
      statusMsg.textContent = 'Please fill out all required fields marked with (*).';
      statusMsg.className = 'form-status-msg error';
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput ? phoneInput.value.trim() : '',
      discipline: disciplineInput.value,
      message: messageInput.value.trim(),
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Commission...';
    }

    try {
      const res = await window.ibenAPI.submitInquiry(payload);
      if (res && res.success) {
        statusMsg.textContent = `Thank you, ${payload.name}! Your commission (#INQ-${res.data.id}) has been recorded. Our Senior Lead Engineer will contact you within 24 hours.`;
        statusMsg.className = 'form-status-msg success';
        form.reset();
      } else {
        throw new Error(res.error || 'Submission failed');
      }
    } catch (err) {
      statusMsg.textContent = `Error submitting commission: ${err.message || 'Please try again'}`;
      statusMsg.className = 'form-status-msg error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Engineering Commission';
      }
    }
  });
}

/* ============================================================================
   FIGMA-GRADE INTERACTIVE MICRO-ANIMATIONS & RESPONSIVE PARALLAX
   ============================================================================ */
function initFigmaInteractions() {
  // 1. Interactive Card Spotlight Cursor Tracker
  const interactiveCards = document.querySelectorAll('.discipline-card, .portfolio-card, .service-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. Magnetic CTA Buttons (Desktop only for precision tactile feel)
  const buttons = document.querySelectorAll('.nav-cta, .hero-cta');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 1024) return; // Skip on touch/mobile viewports
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 1024) return;
      btn.style.transform = '';
    });
  });

  // 3. Smooth Parallax Depth on Hero Titles
  const heroTitle = document.querySelector('.page-hero-title, .hero-title');
  const heroLabel = document.querySelector('.page-hero-label, .hero-label');
  if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled <= 600) {
        heroTitle.style.transform = `translateY(${scrolled * 0.12}px)`;
        if (heroLabel) heroLabel.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    }, { passive: true });
  }
}


