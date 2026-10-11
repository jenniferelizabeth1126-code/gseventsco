/* ============================================================
   GS Events: main.js
   Navigation, Animations, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------- Sticky Navigation ------- */
  const nav = document.querySelector('.nav');
  const scrollThreshold = 60;

  function updateNav() {
    // Nav is always white: just add shadow on scroll for depth
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

  function openMenu() {
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle?.setAttribute('aria-expanded', 'true');
    (closeBtn || overlayLinks[0])?.focus();
  }

  function closeMenu(returnFocus) {
    if (!overlay?.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    toggle?.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle?.focus();
  }

  toggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', () => closeMenu(true));
  overlayLinks.forEach(link => link.addEventListener('click', () => closeMenu(false)));

  /* Keyboard: Escape closes the menu, Tab stays inside it while open */
  document.addEventListener('keydown', (e) => {
    if (!overlay?.classList.contains('open')) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    if (e.key === 'Tab') {
      const items = [closeBtn, ...overlayLinks].filter(Boolean);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

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


  /* ------- Contact forms -------
     Posts to whatever URL is in the form's action attribute, so the
     provider can be swapped by editing the HTML only. ------- */
  document.querySelectorAll('form.js-contact-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var label  = button ? button.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) { status.className = 'form-status'; status.textContent = ''; }
      if (button) { button.disabled = true; button.innerHTML = 'Sending\u2026'; }

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        form.reset();
        if (status) {
          status.className = 'form-status form-status--ok';
          status.textContent = form.getAttribute('data-success') || 'Thank you. Your inquiry has been sent \u2014 I will be in touch within one business day.';
        }
      })
      .catch(function () {
        if (status) {
          status.className = 'form-status form-status--err';
          status.innerHTML = 'Something went wrong. Please email me directly at <a href="mailto:jennifer@gseventsco.com">jennifer@gseventsco.com</a>.';
        }
      })
      .finally(function () {
        if (button) { button.disabled = false; button.innerHTML = label; }
      });
    });
  });

});
