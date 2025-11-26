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

// Mobile hamburger menu toggle
const menuOverlay = document.getElementById('mobile-menu');
const menuOpenBtn = document.querySelector('.mobile-icons-row .icon-button');
const menuCloseBtn = document.getElementById('menu-close');

function toggleMenu(show) {
  if (!menuOverlay) return;
  menuOverlay.classList.toggle('open', show);
}

menuOpenBtn?.addEventListener('click', () => toggleMenu(true));
menuCloseBtn?.addEventListener('click', () => toggleMenu(false));

// Accordion behavior (only one open per group)
const accordions = Array.from(document.querySelectorAll('.box-accordion'));

const syncAccordion = (acc, open) => {
  const toggleEl = acc.querySelector('.box-accordion__toggle');
  const listEl = acc.querySelector('.box-accordion__list');
  if (!toggleEl || !listEl) return;
  acc.classList.toggle('open', open);
  toggleEl.setAttribute('aria-expanded', String(open));
  listEl.hidden = !open;
};

// Ensure only one is open per data-group on load
const openSeen = new Set();
accordions.forEach((acc) => {
  const group = acc.dataset.group || 'global';
  if (acc.classList.contains('open')) {
    if (openSeen.has(group)) {
      acc.classList.remove('open');
    } else {
      openSeen.add(group);
    }
  }
  syncAccordion(acc, acc.classList.contains('open'));
});

accordions.forEach((acc) => {
  const toggleEl = acc.querySelector('.box-accordion__toggle');
  if (!toggleEl) return;

  toggleEl.addEventListener('click', () => {
    const group = acc.dataset.group || 'global';
    const isOpen = acc.classList.contains('open');

    // close others in the same group before opening this one
    if (!isOpen) {
      accordions.forEach((other) => {
        if (other !== acc && (other.dataset.group || 'global') === group) {
          syncAccordion(other, false);
        }
      });
    }

    syncAccordion(acc, !isOpen);
  });
});

// Build Your Own Box selection logic
const builderOptions = [
  { id: 'box5', label: 'Box Of 5 At ₹ 1400', slots: 5, price: 1400 },
  { id: 'box4', label: 'Box Of 4 At ₹ 1200', slots: 4, price: 1200 },
  { id: 'mini4', label: 'Box Of 4 Mini At ₹ 499', slots: 4, price: 499 },
  { id: 'hair3', label: '3 Hair Products At ₹ 1099', slots: 3, price: 1099 },
  { id: 'gift4', label: 'Gift Box Of 4 At ₹ 1300', slots: 4, price: 1300 },
];

const builderProducts = [
  { id: 'apple-cider', name: 'Apple Cider Efferv', note: 'Hair & scalp' },
  { id: 'lcarnitine', name: 'L-Carnitine ACV', note: 'Performance' },
  { id: 'garcinia', name: 'Garcinia Cambogia', note: 'Weight' },
  { id: 'acv-multi', name: 'ACV Multi Power', note: 'Daily wellness' },
  { id: 'grow-buddy', name: 'Grow Buddy Powermix', note: 'Kids' },
  { id: 'super-tots', name: 'SuperTots Multivitamin', note: 'Kids' },
  { id: 'immuno-fizz', name: 'Immuno Fizz', note: 'Immunity' },
  { id: 'chyawan', name: 'ChyawanBoost Gummies', note: 'Nutrition' },
  { id: 'guava-serum', name: 'Mini Guava Glow Duo', note: 'Skin' },
  { id: 'pineapple', name: 'Mini Pineapple Serum', note: 'Skin' },
];

const optionButtons = Array.from(document.querySelectorAll('.box-option-button'));
const productsContainer = document.getElementById('builder-products');
const slotsContainer = document.getElementById('builder-slots');
const totalEl = document.getElementById('builder-total');
const titleEl = document.getElementById('builder-title');
const noteEl = document.getElementById('builder-note');
const statusEl = document.getElementById('builder-status');
const addToCartBtn = document.getElementById('builder-add-to-cart');
const builderModal = document.getElementById('builder-modal');
const builderCloseBtn = document.getElementById('builder-close');
const modalBackdrop = document.querySelector('.builder-modal__backdrop');

const builderState = {
  option: null,
  slots: [],
};

const formatCurrency = (value) => `₹ ${value}`;

function renderProducts() {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  builderProducts.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'builder-product-card';

    const title = document.createElement('h5');
    title.textContent = product.name;

    const note = document.createElement('p');
    note.className = 'subtle';
    note.textContent = product.note;

    const button = document.createElement('button');
    button.className = 'pill ghost';
    button.type = 'button';
    button.textContent = '+ Add';
    button.addEventListener('click', () => handleAddProduct(product));

    card.appendChild(title);
    card.appendChild(note);
    card.appendChild(button);
    productsContainer.appendChild(card);
  });
}

function updateSummary() {
  const filled = builderState.slots.filter(Boolean).length;
  const totalSlots = builderState.slots.length;
  if (titleEl) {
    titleEl.textContent = builderState.option ? builderState.option.label : 'Pick an option to begin';
  }
  if (noteEl) {
    if (!builderState.option) {
      noteEl.textContent = 'Choose a box above to set how many items you can add.';
    } else {
      noteEl.textContent = `Add ${builderState.option.slots} item(s) to your box. ${filled}/${totalSlots} selected.`;
    }
  }
  if (totalEl) {
    totalEl.textContent = builderState.option ? formatCurrency(builderState.option.price) : formatCurrency(0);
  }
  if (statusEl) {
    if (!builderState.option) {
      statusEl.textContent = 'Select a box option to start adding items.';
    } else if (filled < totalSlots) {
      statusEl.textContent = `${filled}/${totalSlots} items added.`;
    } else {
      statusEl.textContent = 'Ready to add to cart.';
    }
  }
  if (addToCartBtn) {
    addToCartBtn.disabled = !builderState.option || filled !== totalSlots || totalSlots === 0;
    addToCartBtn.textContent = builderState.option ? `Add To Cart (${filled}/${totalSlots})` : 'Add To Cart';
  }
}

function renderSlots() {
  if (!slotsContainer) return;
  slotsContainer.innerHTML = '';
  builderState.slots.forEach((slot, index) => {
    const slotEl = document.createElement('div');
    slotEl.className = `slot${slot ? ' filled' : ''}`;

    const label = document.createElement('div');
    label.className = 'slot-name';
    label.textContent = slot ? slot.name : `Item ${index + 1}`;
    slotEl.appendChild(label);

    if (slot) {
      const meta = document.createElement('div');
      meta.className = 'subtle';
      meta.textContent = slot.note;
      slotEl.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'slot-actions';
      const removeBtn = document.createElement('button');
      removeBtn.className = 'pill ghost';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeSlot(index));
      actions.appendChild(removeBtn);
      slotEl.appendChild(actions);
    }

    slotsContainer.appendChild(slotEl);
  });
  updateSummary();
}

function setOption(optionId) {
  const option = builderOptions.find((opt) => opt.id === optionId);
  if (!option) return;
  builderState.option = option;
  builderState.slots = Array.from({ length: option.slots }, () => null);

  optionButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.option === optionId);
  });

  renderSlots();
}

function handleAddProduct(product) {
  if (!builderState.option) {
    if (statusEl) statusEl.textContent = 'Select a box option first.';
    return;
  }
  const emptyIndex = builderState.slots.findIndex((slot) => slot === null);
  if (emptyIndex === -1) {
    if (statusEl) statusEl.textContent = 'All slots are filled. Remove one to swap.';
    return;
  }
  builderState.slots[emptyIndex] = product;
  renderSlots();
}

function removeSlot(index) {
  builderState.slots[index] = null;
  renderSlots();
}

function initBuilder() {
  if (!productsContainer || !slotsContainer) return;
  renderProducts();

  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setOption(btn.dataset.option);
      openBuilder();
    });
  });

  // default to the first option for a quicker start
  if (builderOptions[0]) {
    setOption(builderOptions[0].id);
  } else {
    updateSummary();
  }

  addToCartBtn?.addEventListener('click', () => {
    const filled = builderState.slots.filter(Boolean).length;
    if (statusEl) statusEl.textContent = filled === builderState.slots.length ? 'Items added to cart placeholder.' : 'Please fill your box before adding to cart.';
  });

  builderCloseBtn?.addEventListener('click', closeBuilder);
  modalBackdrop?.addEventListener('click', closeBuilder);
}

initBuilder();

function openBuilder() {
  if (!builderModal) return;
  builderModal.classList.add('open');
  builderModal.setAttribute('aria-hidden', 'false');
}

function closeBuilder() {
  if (!builderModal) return;
  builderModal.classList.remove('open');
  builderModal.setAttribute('aria-hidden', 'true');
}
