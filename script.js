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
    section.classList.remove('animate');
  });

  toggles.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });

  const activeSection = mobileSections[target];
  if (activeSection) {
    // trigger animation
    void activeSection.offsetWidth; // reflow to restart animation
    activeSection.classList.add('animate');
  }
}

toggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    setMobileSection(btn.dataset.target === 'kids' ? 'kids' : 'main');
  });
});

// initialize to current active toggle
const initialActive = Array.from(toggles).find((btn) => btn.classList.contains('active'));
setMobileSection(initialActive?.dataset.target === 'kids' ? 'kids' : 'main');

// Typing effect for mobile search placeholders
const typingPhrases = [
  'Search for skin products',
  'Search for hair products',
  'Search for nutrition',
  'Search for personal care',
];

function startTyping(el, phrases, speed = 70, hold = 1400) {
  let phraseIndex = 0;
  let charIndex = 0;

  function typeNext() {
    const current = phrases[phraseIndex];
    el.placeholder = current.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex <= current.length) {
      setTimeout(typeNext, speed);
    } else {
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        typeNext();
      }, hold);
    }
  }

  typeNext();
}

document.querySelectorAll('.mobile-search input').forEach((input) => {
  startTyping(input, typingPhrases);
});
