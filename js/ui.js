// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Generic reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Build stems as SVG (height driven by data-height 0..1)
document.querySelectorAll('.stem').forEach(stem => {
  const h = parseFloat(stem.dataset.height || '0.6');
  const name = stem.dataset.name || '';
  const maxH = 90;
  const stemH = maxH * h;
  const svgH = maxH + 20;
  stem.innerHTML = `
    <svg width="40" height="${svgH}" viewBox="0 0 40 ${svgH}">
      <path class="stem-path" d="M20 ${svgH} L20 ${svgH - stemH}" />
      <circle class="leaf" cx="20" cy="${svgH - stemH}" r="7"/>
    </svg>
    <div class="stem-name">${name}</div>
  `;
});

// Grow stems on scroll-into-view
const stemObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('grown');
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stem').forEach(el => stemObserver.observe(el));
