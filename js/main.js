/* ============================================================
   GS Events — main.js
   Navigation, Animations, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------- Sticky Navigation ------- */
  const nav = document.querySelector('.nav');
  const scrollThreshold = 60;

  function updateNav() {
    // Nav is always white — just add shadow on scroll for depth
    if (window.scrollY > scrollThreshold) {
      nav?.classList.add('nav--scrolled');
      nav?.classList.remove('nav--top');
    } else {
      nav?.classList.remove('nav--scrolled');
      nav?.classList.add('nav--top');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ------- Mobile Menu ------- */
  const toggle = document.querySelector('.nav__toggle');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-overlay__close');
  const overlayLinks = document.querySelectorAll('.nav-overlay__link');

  toggle?.addEventListener('click', () => {
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeMenu);
  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ------- Scroll Animations ------- */
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* ------- Active Nav Link ------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------- Smooth Scroll for Anchors ------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ------- Contact Form ------- */
  const contactForm = document.querySelector('.contact-form form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send (replace with real form handler: Formspree, Netlify Forms, etc.)
    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#3d6e5c';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    }, 1200);
  });

  /* ------- Counter Animation (Stats) ------- */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);

      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ------- Subtle hero photo parallax ------- */
  const heroPhoto = document.querySelector('.hero__photo img');
  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${scrolled * 0.12}px)`;
      }
    }, { passive: true });
  }

});
