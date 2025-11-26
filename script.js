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
const desktopMenuBtn = document.querySelector('.top-bar .icon-button');
const menuCloseBtn = document.getElementById('menu-close');

function toggleMenu(show) {
  if (!menuOverlay) return;
  menuOverlay.classList.toggle('open', show);
}

menuOpenBtn?.addEventListener('click', () => toggleMenu(true));
desktopMenuBtn?.addEventListener('click', () => toggleMenu(true));
menuCloseBtn?.addEventListener('click', () => toggleMenu(false));
menuOverlay?.addEventListener('click', (e) => {
  if (e.target === menuOverlay) toggleMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

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
  { id: 'box5', label: '5 In 1 Gift Box', slots: 5, price: 1400 },
  { id: 'box4', label: 'Box Of 4 At ₹ 1200', slots: 4, price: 1200 },
  { id: 'mini4', label: 'Box Of 4 Mini At ₹ 499', slots: 4, price: 499 },
  { id: 'hair3', label: '3 Hair Products At ₹ 1099', slots: 3, price: 1099 },
  { id: 'gift4', label: 'Gift Box Of 4 At ₹ 1300', slots: 4, price: 1300 },
];

const builderProducts = [
  { id: 'apple-cider', name: 'Apple Cider Vinegar', note: 'Skin', price: 310, rating: 5.0, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' },
  { id: 'watermelon', name: 'Watermelon Glowy Skin', note: 'Skin', price: 575, rating: 5.0, image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=80' },
  { id: 'pineapple-serum', name: 'Pineapple Face Wash & Serum', note: 'Skin', price: 699, rating: 5.0, image: 'https://images.unsplash.com/photo-1585238341267-1cfec2041459?auto=format&fit=crop&w=600&q=80' },
  { id: 'jamun-serum', name: 'Jamun Facewash & Serum', note: 'Skin', price: 649, rating: 5.0, image: 'https://images.unsplash.com/photo-1585238341654-637d9fa18b1b?auto=format&fit=crop&w=600&q=80' },
  { id: 'pineapple-kit', name: 'Pineapple De-Pigmentation Kit', note: 'Skin', price: 999, rating: 5.0, image: 'https://images.unsplash.com/photo-1585238342026-78d387f4a707?auto=format&fit=crop&w=600&q=80' },
  { id: 'flaxseed', name: 'Flaxseed Ultra Smooth Duo', note: 'Hair', price: 699, rating: 5.0, image: 'https://images.unsplash.com/photo-1585238342026-78d387f4a707?auto=format&fit=crop&w=600&q=80' },
  { id: 'rosemary-serum', name: 'Rosemary Hair Growth Serum', note: 'Hair', price: 699, rating: 5.0, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80' },
  { id: 'neem-shampoo', name: 'Neem Anti-Dandruff Shampoo', note: 'Hair', price: 355, rating: 5.0, image: 'https://images.unsplash.com/photo-1619596101816-4ae9f8d6d59f?auto=format&fit=crop&w=600&q=80' },
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

    if (product.image) {
      const img = document.createElement('div');
      img.className = 'builder-product-img';
      img.style.backgroundImage = `url('${product.image}')`;

      if (product.rating) {
        const badge = document.createElement('span');
        badge.className = 'badge-star';
        badge.textContent = `★ ${product.rating.toFixed(1)}`;
        img.appendChild(badge);
      }
      card.appendChild(img);
    }

    const title = document.createElement('h5');
    title.textContent = product.name;

    const meta = document.createElement('p');
    meta.className = 'product-meta';
    meta.textContent = `${product.note}`;

    const priceRow = document.createElement('div');
    priceRow.className = 'builder-price-row';
    const priceEl = document.createElement('span');
    priceEl.className = 'price';
    priceEl.textContent = `₹${product.price}`;
    const learn = document.createElement('a');
    learn.href = '#';
    learn.textContent = 'Learn';
    learn.className = 'learn-link';
    priceRow.appendChild(priceEl);
    priceRow.appendChild(learn);

    const button = document.createElement('button');
    button.className = 'pill ghost builder-add';
    button.type = 'button';
    button.textContent = '+ ADD TO BOX';
    button.addEventListener('click', () => handleAddProduct(product));

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(priceRow);
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
    addToCartBtn.textContent = builderState.option ? 'Update Box' : 'Add To Cart';
    addToCartBtn.classList.add('secondary');
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

// Desktop Infinium / Infinium kids toggle
const brandSwitchButtons = document.querySelectorAll('.brand-switch button[data-target]');

brandSwitchButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    brandSwitchButtons.forEach((b) => b.classList.toggle('active', b === btn));

    if (target === 'kids') {
      const kidsSection = document.getElementById('kids-products') || document.getElementById('kids-hero') || document.getElementById('kids');
      kidsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

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
