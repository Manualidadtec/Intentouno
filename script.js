const products = [
  {
    id: "oat",
    name: "Ribbed Oat Crew",
    badge: "ORGANIC COTTON",
    category: "crew",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "midnight",
    name: "Midnight Heather",
    badge: "SEAMLESS TOE",
    category: "crew",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "terracotta",
    name: "Terracotta Stripe",
    badge: "NEW PATTERN",
    category: "new",
    image: "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "forest",
    name: "Forest Moss Wool",
    badge: "MERINO WOOL",
    category: "merino",
    image: "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "colorblock",
    name: "Vintage Colorblock",
    badge: "NEW PATTERN",
    category: "new",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "snow",
    name: "Classic Snow White",
    badge: "REINFORCED HEEL",
    category: "crew",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "sand",
    name: "Soft Sand No-Show",
    badge: "NO-SHOW",
    category: "ankle",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "clay",
    name: "Clay Ankle Rib",
    badge: "SEAMLESS TOE",
    category: "ankle",
    image: "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?auto=format&fit=crop&w=700&q=85"
  }
];

const tiers = {
  5: 65,
  6: 75,
  9: 105
};

let selectedTier = 5;
let box = [];
let activeFilter = "all";

const productGrid = document.querySelector("#productGrid");
const boxSlots = document.querySelector("#boxSlots");
const liveRegion = document.querySelector("#liveRegion");

function renderProducts() {
  const visibleProducts = products.filter((product) => {
    return activeFilter === "all" || product.category === activeFilter;
  });

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span class="product-price">$16 / pair</span>
          <button
            class="add-button"
            type="button"
            data-product="${product.id}"
            aria-label="Add ${product.name} to your box"
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderBox() {
  const count = box.length;
  const percent = Math.min((count / selectedTier) * 100, 100);
  const isComplete = count === selectedTier;

  document.querySelector("#progressText").textContent =
    `${count} of ${selectedTier} pairs added`;

  document.querySelector("#progressPercent").textContent =
    `${Math.round(percent)}%`;

  document.querySelector("#progressBar").style.width = `${percent}%`;
  document.querySelector("#headerCount").textContent = count;
  document.querySelector("#mobileCount").textContent = `${count}/${selectedTier}`;

  document.querySelector("#checkoutPrice").textContent =
    `$${tiers[selectedTier].toFixed(2)}`;

  document.querySelector("#bundleNote").textContent = isComplete
    ? "Your box is complete. You are ready to check out!"
    : `Add ${selectedTier - count} more pair${selectedTier - count === 1 ? "" : "s"} to unlock checkout.`;

  document.querySelector("#checkoutButton").disabled = !isComplete;

  boxSlots.innerHTML = Array.from({ length: selectedTier }, (_, index) => {
    const product = box[index];

    if (!product) {
      return `<div class="box-slot" aria-label="Empty pair slot">+ Add pair</div>`;
    }

    return `
      <div class="box-slot filled">
        <img src="${product.image}" alt="${product.name}">
        <button
          class="remove-slot"
          type="button"
          data-remove="${index}"
          aria-label="Remove ${product.name}"
        >×</button>
      </div>
    `;
  }).join("");
}

function addProduct(productId) {
  if (box.length >= selectedTier) {
    announce(`Your ${selectedTier}-pair box is full.`);
    return;
  }

  const product = products.find((item) => item.id === productId);
  box.push(product);
  renderBox();
  announce(`${product.name} added to your box.`);
}

function removeProduct(index) {
  const removed = box.splice(index, 1)[0];
  renderBox();
  announce(`${removed.name} removed from your box.`);
}

function changeTier(newTier) {
  selectedTier = Number(newTier);

  document.querySelectorAll(".tier").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.tier) === selectedTier);
  });

  if (box.length > selectedTier) {
    box = box.slice(0, selectedTier);
    announce(`Box changed to ${selectedTier} pairs. Extra pairs were removed.`);
  }

  renderBox();
}

function announce(message) {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 30);
}

function openCheckout() {
  if (box.length !== selectedTier) return;

  const grouped = box.reduce((result, product) => {
    result[product.name] = (result[product.name] || 0) + 1;
    return result;
  }, {});

  document.querySelector("#summaryTier").textContent =
    `${selectedTier}-pair custom box`;

  document.querySelector("#summaryTotal").textContent =
    `$${tiers[selectedTier].toFixed(2)}`;

  document.querySelector("#formButtonTotal").textContent =
    `$${tiers[selectedTier].toFixed(2)}`;

  document.querySelector("#formTier").value =
    `${selectedTier}-pair custom box`;

  document.querySelector("#formTotal").value =
    `$${tiers[selectedTier].toFixed(2)}`;

  document.querySelector("#formBreakdown").value =
    Object.entries(grouped)
      .map(([name, quantity]) => `${name} × ${quantity}`)
      .join(", ");

  document.querySelector("#summaryItems").innerHTML =
    Object.entries(grouped)
      .map(([name, quantity]) => `
        <div class="summary-item">
          <span>${name} × ${quantity}</span>
          <strong>$${quantity * 16}.00</strong>
        </div>
      `)
      .join("");

  document.querySelector("#checkoutModal").hidden = false;
  document.querySelector("body").style.overflow = "hidden";
  document.querySelector("#modalClose").focus();
}

function closeCheckout() {
  document.querySelector("#checkoutModal").hidden = true;
  document.querySelector("body").style.overflow = "";
}

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (button) addProduct(button.dataset.product);
});

boxSlots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) removeProduct(Number(button.dataset.remove));
});

document.querySelectorAll(".tier").forEach((button) => {
  button.addEventListener("click", () => changeTier(button.dataset.tier));
});

document.querySelector("#clearButton").addEventListener("click", () => {
  box = [];
  renderBox();
  announce("Your box has been cleared.");
});

document.querySelector("#checkoutButton").addEventListener("click", openCheckout);
document.querySelector("#modalClose").addEventListener("click", closeCheckout);

document.querySelector("#checkoutModal").addEventListener("click", (event) => {
  if (event.target.id === "checkoutModal") closeCheckout();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#checkoutModal").hidden) {
    closeCheckout();
  }
});

document.querySelector("#mobileProgressButton").addEventListener("click", () => {
  document.querySelector("#bundleCard").classList.toggle("open");
});

document.querySelector("#orderForm").addEventListener("submit", (event) => {
  const address = [
    document.querySelector("#street").value,
    document.querySelector("#city").value,
    document.querySelector("#state").value,
    document.querySelector("#zip").value
  ].join(", ");

  document.querySelector("#formFullAddress").value = address;

  /*
    FormSubmit normally redirects away after submission. This handler keeps
    the confirmation state visible for the customer, while the form still
    submits to the configured email endpoint.
  */
  event.preventDefault();

  const form = event.currentTarget;
  const payload = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: payload,
    headers: { Accept: "application/json" }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Order submission failed");

      document.querySelector("#checkoutView").hidden = true;
      document.querySelector("#successView").hidden = false;
    })
    .catch(() => {
      alert("We could not submit the order. Please try again.");
    });
});

document.querySelector("#successClose").addEventListener("click", () => {
  closeCheckout();
  document.querySelector("#checkoutView").hidden = false;
  document.querySelector("#successView").hidden = true;
  document.querySelector("#orderForm").reset();
  box = [];
  renderBox();
});

renderProducts();
renderBox();
