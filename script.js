/* ============================================
   INNOVA GROUP — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── MOBILE NAVIGATION ──────────────────────────

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // ── NAV SCROLL STATE ───────────────────────────

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.style.boxShadow = '0 1px 12px rgba(0,0,0,0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────────

  const sections = document.querySelectorAll('section[id], div[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function setActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    allNavLinks.forEach(function (link) {
      link.style.color = '';
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.style.color = '#1a1a1a';
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);

  // ── CONTACT FORM ───────────────────────────────

  window.handleSubmit = function (e) {
    e.preventDefault();
    const btn     = e.target.querySelector('button[type="submit"]');
    const success = document.getElementById('form-success');

    btn.disabled    = true;
    btn.textContent = 'Sending…';

    // Simulate async submission
    setTimeout(function () {
      e.target.reset();
      btn.style.display = 'none';
      if (success) {
        success.style.display = 'flex';
      }
    }, 1200);
  };

  // ── SCROLL-IN ANIMATIONS ───────────────────────

  if ('IntersectionObserver' in window) {
    const animateEls = document.querySelectorAll(
      '.service-card, .project-card, .team-card, .value-card, .process-step, .stat-item'
    );

    animateEls.forEach(function (el) {
      el.style.opacity  = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── STATS COUNTER ANIMATION ────────────────────

  function animateCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(function (el) {
      const original = el.textContent;
      const numMatch = original.match(/[\d.]+/);
      if (!numMatch) return;

      const target   = parseFloat(numMatch[0]);
      const prefix   = original.slice(0, original.indexOf(numMatch[0]));
      const suffix   = original.slice(original.indexOf(numMatch[0]) + numMatch[0].length);
      const isDecimal = numMatch[0].includes('.');
      const duration = 1400;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  if ('IntersectionObserver' in window) {
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      const statsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      }, { threshold: 0.5 });
      statsObserver.observe(statsBar);
    }
  }

});
