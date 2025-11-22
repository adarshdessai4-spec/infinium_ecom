document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');

  if (!track) return;

  const getStep = () => {
    const card = track.querySelector('.product-card');
    return card ? card.getBoundingClientRect().width + 16 : 260;
  };

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next?.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });
});

// Mobile pill toggle: switch between main and kids sections
const toggles = document.querySelectorAll('.pill-toggle[data-target]');
const mobileSections = {
  main: document.getElementById('mobile-main'),
  kids: document.getElementById('mobile-kids'),
};

function setMobileSection(target) {
  Object.keys(mobileSections).forEach((key) => {
    const section = mobileSections[key];
    if (!section) return;
    section.classList.toggle('active', key === target);
  });

  toggles.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });
}

toggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    setMobileSection(btn.dataset.target === 'kids' ? 'kids' : 'main');
  });
});

// initialize to current active toggle
const initialActive = Array.from(toggles).find((btn) => btn.classList.contains('active'));
setMobileSection(initialActive?.dataset.target === 'kids' ? 'kids' : 'main');
