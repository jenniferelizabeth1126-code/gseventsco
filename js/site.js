/* ============================================================
   Gold Standard Events Consultancy: shared motion for inner pages
   (Event Rescue, FAQ, Contact). The home page carries its own copy.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Buttons that preselect the contact form */
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('service');
      if (sel) sel.value = a.getAttribute('data-service');
    });
  });

  /* Hero slideshow */
  var slides = document.querySelectorAll('.hero-lux__slides img'), si = 0, timer = null;
  var hero = document.querySelector('.hero-lux'), pauseBtn = document.querySelector('.hero-lux__pause');
  function play() {
    timer = setInterval(function () {
      slides[si].classList.remove('is-on');
      si = (si + 1) % slides.length;
      slides[si].classList.add('is-on');
    }, 6000);
  }
  if (slides.length > 1 && !reduce) { play(); } else if (pauseBtn) { pauseBtn.hidden = true; }
  if (pauseBtn) pauseBtn.addEventListener('click', function () {
    var paused = pauseBtn.getAttribute('aria-pressed') === 'true';
    if (paused) { play(); } else { clearInterval(timer); }
    pauseBtn.setAttribute('aria-pressed', String(!paused));
    pauseBtn.querySelector('span').textContent = paused ? 'Pause slideshow' : 'Play slideshow';
    hero.classList.toggle('is-paused', !paused);
  });

  /* FAQ: one answer open at a time */
  document.querySelectorAll('.qa details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      document.querySelectorAll('.qa details[open]').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* FAQ: highlight the category in view */
  var catLinks = document.querySelectorAll('.qa-index a');
  if (catLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    catLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        catLinks.forEach(function (a) { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        var a = map[e.target.id]; if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('.qa-group').forEach(function (g) { cio.observe(g); });
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');

  /* Split headings into words that slide up */
  document.querySelectorAll('.split').forEach(function (h) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('span'); i.textContent = part; i.style.setProperty('--d', n++);
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') { walk(c); }
      });
    })(h);
  });

  /* Staggered children */
  document.querySelectorAll('[data-stagger]').forEach(function (p) {
    Array.prototype.forEach.call(p.children, function (c, i) { c.classList.add('rise'); c.style.setProperty('--i', i); });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains('rule') ? 'is-drawn' : 'is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.split, .eyebrow, .rule, .rise').forEach(function (el) { io.observe(el); });

  /* Gentle parallax on framed photos */
  var par = document.querySelectorAll('[data-parallax]'), ticking = false;
  function update() {
    var vh = window.innerHeight;
    par.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (c * -parseFloat(el.getAttribute('data-parallax'))) + '%,0) scale(1.12)';
    });
    ticking = false;
  }
  if (par.length) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
