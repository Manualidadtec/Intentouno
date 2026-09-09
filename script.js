const products = [
  {
    id: 'oat',
    name: 'Ribbed Oat Crew',
    badge: 'ORGANIC COTTON',
    category: 'crew',
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'midnight',
    name: 'Midnight Heather',
    badge: 'SEAMLESS TOE',
    category: 'crew',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Stripe',
    badge: 'NEW PATTERN',
    category: 'new',
    image: 'https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'forest',
    name: 'Forest Moss Wool',
    badge: 'MERINO WOOL',
    category: 'merino',
    image: 'https://images.unsplash.com/photo-1610398752800-146f269dfcc8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'colorblock',
    name: 'Vintage Colorblock',
    badge: 'NEW PATTERN',
    category: 'new',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'snow',
    name: 'Classic Snow White',
    badge: 'REINFORCED HEEL',
    category: 'crew',
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'sand',
    name: 'Soft Sand No-Show',
    badge: 'NO-SHOW',
    category: 'ankle',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'clay',
    name: 'Clay Ankle Rib',
    badge: 'SEAMLESS TOE',
    category: 'ankle',
    image: 'https://images.unsplash.com/photo-1610398752800-146f269dfcc8?auto=format&fit=crop&w=700&q=85',
  },
];

const tiers = {
  5: 65,
  6: 75,
  9: 105,
};

let selectedTier = 5;
let box = [];
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.querySelector('#productGrid');
  const boxSlots = document.querySelector('#boxSlots');
  const liveRegion = document.querySelector('#liveRegion');
  const checkoutModal = document.querySelector('#checkoutModal');
  const modalClose = document.querySelector('#modalClose');
  const checkoutButton = document.querySelector('#checkoutButton');
  const clearButton = document.querySelector('#clearButton');
  const mobileProgressButton = document.querySelector('#mobileProgressButton');
  const orderForm = document.querySelector('#orderForm');
  const filters = document.querySelector('#filters');

  function renderProducts() {
    if (!productGrid) return;
    const visibleProducts = products.filter(product => {
      return activeFilter === 'all' || product.category === activeFilter;
    });

    productGrid.innerHTML = visibleProducts
      .map(product => {
        return `
          <article class="product-card">
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
              <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-info">
              <h3>${product.name}</h3>
              <div class="product-meta">
                <span class="product-price">$16 / pair</span>
                <button class="add-button" type="button" data-product="${product.id}" aria-label="Add ${product.name} to your box">
                  + Add
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderBox() {
    const count = box.length;
    const percent = Math.min((count / selectedTier) * 100, 100);
    const isComplete = count === selectedTier;

    const progressText = document.querySelector('#progressText');
    const progressPercent = document.querySelector('#progressPercent');
    const progressBar = document.querySelector('#progressBar');
    const headerCount = document.querySelector('#headerCount');
    const mobileCount = document.querySelector('#mobileCount');
    const checkoutPrice = document.querySelector('#checkoutPrice');
    const bundleNote = document.querySelector('#bundleNote');

    if (progressText) progressText.textContent = `${count} of ${selectedTier} pairs added`;
    if (progressPercent) progressPercent.textContent = Math.round(percent);
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (headerCount) headerCount.textContent = count;
    if (mobileCount) mobileCount.textContent = `${count}/${selectedTier}`;
    if (checkoutPrice) checkoutPrice.textContent = `$${tiers[selectedTier].toFixed(2)}`;

    if (bundleNote) {
      bundleNote.textContent = isComplete
        ? 'Your box is complete. You are ready to check out!'
        : `Add ${selectedTier - count} more pair${selectedTier - count > 1 ? 's' : ''} to unlock checkout.`;
    }

    if (checkoutButton) checkoutButton.disabled = !isComplete;

    if (boxSlots) {
      boxSlots.innerHTML = Array.from({ length: selectedTier }, (_, index) => {
        const product = box[index];
        if (!product) {
          return '<div class="box-slot" aria-label="Empty pair slot">+ Add pair</div>';
        }
        return `
          <div class="box-slot filled">
            <img src="${product.image}" alt="${product.name}" />
            <button class="remove-slot" type="button" data-remove="${index}" aria-label="Remove ${product.name}">&times;</button>
          </div>
        `;
      }).join('');
    }
  }

  function addProduct(productId) {
    if (box.length >= selectedTier) {
      announce(`Your ${selectedTier}-pair box is full.`);
      return;
    }
    const product = products.find(item => item.id === productId);
    if (product) {
      box.push(product);
      renderBox();
      announce(`${product.name} added to your box.`);
    }
  }

  function removeProduct(index) {
    const removed = box.splice(index, 1)[0];
    renderBox();
    if (removed) announce(`${removed.name} removed from your box.`);
  }

  function changeTier(newTier) {
    selectedTier = Number(newTier);
    document.querySelectorAll('.tier').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.tier) === selectedTier);
    });

    if (box.length > selectedTier) {
      box = box.slice(0, selectedTier);
      announce(`Box changed to ${selectedTier} pairs. Extra pairs were removed.`);
    }
    renderBox();
  }

  function announce(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  }

  function openCheckout() {
    if (box.length !== selectedTier || !checkoutModal) return;

    const grouped = box.reduce((result, product) => {
      result[product.name] = (result[product.name] || 0) + 1;
      return result;
    }, {});

    const summaryTier = document.querySelector('#summaryTier');
    const summaryTotal = document.querySelector('#summaryTotal');
    const formButtonTotal = document.querySelector('#formButtonTotal');
    const formTier = document.querySelector('#formTier');
    const formTotal = document.querySelector('#formTotal');
    const formBreakdown = document.querySelector('#formBreakdown');
    const summaryItems = document.querySelector('#summaryItems');

    if (summaryTier) summaryTier.textContent = `${selectedTier}-pair custom box`;
    if (summaryTotal) summaryTotal.textContent = `$${tiers[selectedTier].toFixed(2)}`;
    if (formButtonTotal) formButtonTotal.textContent = `$${tiers[selectedTier].toFixed(2)}`;
    if (formTier) formTier.value = `${selectedTier}-pair custom box`;
    if (formTotal) formTotal.value = `$${tiers[selectedTier].toFixed(2)}`;
    if (formBreakdown) {
      formBreakdown.value = Object.entries(grouped)
        .map(([name, quantity]) => `${name} (x${quantity})`)
        .join(', ');
    }

    if (summaryItems) {
      summaryItems.innerHTML = Object.entries(grouped)
        .map(([name, quantity]) => {
          return `
            <div class="summary-item">
              <span>${name} × ${quantity}</span>
              <strong>$${(quantity * 16).toFixed(2)}</strong>
            </div>
          `;
        })
        .join('');
    }

    checkoutModal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.hidden = true;
    document.body.style.overflow = '';
  }

  // Filter Buttons
  filters?.addEventListener('click', event => {
    const button = event.target.closest('.filter');
    if (!button) return;
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(filter => {
      filter.classList.toggle('active', filter === button);
    });
    renderProducts();
  });

  // Product Add Button Delegation
  productGrid?.addEventListener('click', event => {
    const button = event.target.closest('[data-product]');
    if (button) addProduct(button.dataset.product);
  });

  // Slot Remove Button Delegation
  boxSlots?.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (button) removeProduct(Number(button.dataset.remove));
  });

  // Tier Tabs
  document.querySelectorAll('.tier').forEach(button => {
    button.addEventListener('click', () => changeTier(button.dataset.tier));
  });

  // Clear Box Button
  clearButton?.addEventListener('click', () => {
    box = [];
    renderBox();
    announce('Your box has been cleared.');
  });

  // Open Checkout Modal
  checkoutButton?.addEventListener('click', openCheckout);

  // Close Checkout Modal Listeners
  modalClose?.addEventListener('click', closeCheckout);

  // Backdrop click listener (closing when clicking outside modal dialog)
  checkoutModal?.addEventListener('click', event => {
    if (event.target === checkoutModal || event.target.hasAttribute('data-close-modal')) {
      closeCheckout();
    }
  });

  // Escape key listener
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && checkoutModal && !checkoutModal.hidden) {
      closeCheckout();
    }
  });

  // Mobile Drawer Toggle
  mobileProgressButton?.addEventListener('click', () => {
    document.querySelector('#bundleCard')?.classList.toggle('open');
  });

  // Form Submission
  orderForm?.addEventListener('submit', event => {
    const street = document.querySelector('#street')?.value || '';
    const city = document.querySelector('#city')?.value || '';
    const state = document.querySelector('#state')?.value || '';
    const zip = document.querySelector('#zip')?.value || '';
    const formFullAddress = document.querySelector('#formFullAddress');
    
    if (formFullAddress) {
      formFullAddress.value = `${street}, ${city}, ${state} ${zip}`;
    }

    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Order submission failed');
        const checkoutView = document.querySelector('#checkoutView');
        const successView = document.querySelector('#successView');
        if (checkoutView) checkoutView.hidden = true;
        if (successView) successView.hidden = false;
      })
      .catch(() => {
        alert('We could not submit the order. Please try again.');
      });
  });

  // Success view close listener
  document.querySelector('#successClose')?.addEventListener('click', () => {
    closeCheckout();
    const checkoutView = document.querySelector('#checkoutView');
    const successView = document.querySelector('#successView');
    if (checkoutView) checkoutView.hidden = false;
    if (successView) successView.hidden = true;
    orderForm?.reset();
    box = [];
    renderBox();
    renderProducts();
  });

  // Initial render calls
  renderProducts();
  renderBox();
});
