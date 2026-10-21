const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.mobile-nav a');

if (menuToggle && mobileMenu) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(button => {
      const active = button === btn;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.tags.split(' ').includes(filter);
      card.hidden = !matches;
    });
  });
});

const copyButton = document.getElementById('copy-email');
const toast = document.getElementById('toast');
let toastTimeout;
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      document.getElementById('copy-label').textContent = 'Email copied!';
      toast.textContent = 'Email copied to clipboard';
      toast.classList.add('show');
      window.clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => {
        document.getElementById('copy-label').textContent = email;
        toast.classList.remove('show');
      }, 2400);
    } catch {
      window.location.href = 'mailto:' + email;
    }
  });
}

const year = document.getElementById('copyright-year');
if (year) year.textContent = new Date().getFullYear();
const progress = document.getElementById('scroll-progress');
if (progress) {
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      scheduled = false;
    });
  }, { passive: true });
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09 });
  document.querySelectorAll('.project-card, .skill-panel, .timeline-entry, .stat').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
