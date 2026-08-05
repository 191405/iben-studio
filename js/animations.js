/**
 * GSAP Animations & Interactions
 */

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initLenis();
  initCursor();
  initTextAnimations();
  initParallax();
});

function initPreloader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  const counter = document.getElementById("loader-counter");
  const paths = document.querySelectorAll(".loader-logo .logo-path");

  let progress = { value: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      // Allow scroll
      document.body.style.overflow = "auto";
    }
  });

  // Lock scroll
  document.body.style.overflow = "hidden";

  // 1. Draw SVG Logo
  if (paths.length > 0) {
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.1
    }, 0);
  }

  // 2. Counter animation
  if (counter) {
    tl.to(progress, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        counter.innerText = Math.round(progress.value) + "%";
      }
    }, 0);
  }

  // 3. Sweep up loader
  tl.to(loader, {
    yPercent: -100,
    duration: 1.2,
    ease: "power4.inOut",
    delay: 0.2
  });
}

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 0);
}

function initCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  const cursorState = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouseState = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener('mousemove', (e) => {
    mouseState.x = e.clientX;
    mouseState.y = e.clientY;
  });

  // GSAP ticker for smooth follow
  gsap.ticker.add(() => {
    // Lerp
    cursorState.x += (mouseState.x - cursorState.x) * 0.15;
    cursorState.y += (mouseState.y - cursorState.y) * 0.15;
    gsap.set(cursor, { x: cursorState.x, y: cursorState.y });
  });

  // Hover states
  const interactables = document.querySelectorAll('a, button, .discipline-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

function initTextAnimations() {
  const splitTextElements = document.querySelectorAll('.hero-headline, .section-label');
  
  splitTextElements.forEach(el => {
    // SplitType splits text into chars/words
    const text = new SplitType(el, { types: 'words, chars' });
    
    // Animate characters
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      },
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "power3.out"
    });
  });
}

function initParallax() {
  // 1. Process Section Horizontal Scroll
  const processSection = document.querySelector('.process-grid');
  const processSteps = document.querySelector('.process-steps');

  if (processSection && processSteps) {
    gsap.to(processSteps, {
      x: () => -(processSteps.scrollWidth - window.innerWidth + 200),
      ease: "none",
      scrollTrigger: {
        trigger: processSection,
        start: "top center",
        end: () => "+=" + processSteps.scrollWidth,
        scrub: true,
        pin: false
      }
    });
  }

  // 2. Process Visual Parallax
  const processVisual = document.querySelector('.process-visual');
  if (processVisual) {
    gsap.to(processVisual, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: ".process",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // 3. Image Parallax (data-speed)
  const parallaxImages = document.querySelectorAll('[data-speed]');
  parallaxImages.forEach(img => {
    const speed = img.getAttribute('data-speed') || 0.1;
    gsap.to(img, {
      y: () => (window.innerHeight - img.getBoundingClientRect().top) * speed,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 4. Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.nav-cta');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power3.out" });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  });
}
