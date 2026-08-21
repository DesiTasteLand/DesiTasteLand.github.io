/* ==========================================================================
   DESI TASTE LAND - Master Application JavaScript Logic
   ========================================================================== */

// 1. HONEY CATEGORIES (4 Varieties with Uploaded Images & Exact Prices)
const HONEY_CATEGORIES = [
  {
    id: 'honey-wild-big',
    name: 'WILD HONEY BIG BEE',
    tag: 'Wild Harvest',
    image: 'assets/images/honey_wild_big.jpg',
    description: '100% pure wild Sidr honey collected from wild big bees in natural forests.',
    variants: [
      { weight: '200g', price: 560 },
      { weight: '500g', price: 1400, isDefault: true },
      { weight: '1000g', price: 2800 }
    ],
    selectedWeightIndex: 1
  },
  {
    id: 'honey-wild-small',
    name: 'WILD HONEY SMALL BEE',
    tag: 'Rare & Precious',
    image: 'assets/images/honey_wild_small.jpg',
    description: 'Rare wild small bee honey collected from mountain flora. Supreme health and immunity booster.',
    variants: [
      { weight: '200g', price: 1080 },
      { weight: '500g', price: 2700, isDefault: true },
      { weight: '1000g', price: 5400 }
    ],
    selectedWeightIndex: 1
  },
  {
    id: 'honey-farmy-big',
    name: 'FARMY HONEY BIG BEE',
    tag: 'Farm Fresh',
    image: 'assets/images/honey_farmy_big.jpg',
    description: 'Pure farm-harvested big bee honey from certified floral blossom fields.',
    variants: [
      { weight: '200g', price: 360 },
      { weight: '500g', price: 900, isDefault: true },
      { weight: '1000g', price: 1800 }
    ],
    selectedWeightIndex: 1
  },
  {
    id: 'honey-farmy-small',
    name: 'FARMY HONEY SMALL BEE',
    tag: 'Farm Premium',
    image: 'assets/images/honey_farmy_small.jpg',
    description: 'Exquisite farm small bee honey, amber in color with delicate floral aroma.',
    variants: [
      { weight: '200g', price: 800 },
      { weight: '500g', price: 2000, isDefault: true },
      { weight: '1000g', price: 4000 }
    ],
    selectedWeightIndex: 1
  }
];

// 2. TOP SELLING PRODUCTS DATABASE (3 Signature Items)
const TOP_SELLING_PRODUCTS = [
  {
    id: 'top-honey',
    name: 'PURE HONEY (4 VARIETIES)',
    isHoney: true,
    rating: 5.0,
    reviewsCount: 450,
    image: 'assets/images/honey_wild_big.jpg',
    description: '100% pure raw honey available in 4 certified varieties: Wild Big Bee, Wild Small Bee, Farmy Big Bee & Farmy Small Bee.',
    variants: [
      { weight: '200g', price: 560 },
      { weight: '500g', price: 1400, isDefault: true },
      { weight: '1000g', price: 2800 }
    ],
    selectedWeightIndex: 1,
    benefits: ['100% Raw & Unprocessed', 'Zero Sugar Adulteration Guarantee']
  },
  {
    id: 'top-ghee',
    name: 'DESI GHEE',
    rating: 5.0,
    reviewsCount: 620,
    image: 'assets/images/all_ghee.jpg',
    description: 'Prepared using traditional hand-churned Bilona method from grass-fed cow milk. Golden granular texture.',
    variants: [
      { weight: '500g', price: 1600 },
      { weight: '1000g', price: 3200, isDefault: true }
    ],
    selectedWeightIndex: 1,
    benefits: ['Traditional hand-churned Bilona method', 'Chemical-free & zero preservatives']
  },
  {
    id: 'top-olive',
    name: 'OLIVE OIL',
    rating: 5.0,
    reviewsCount: 310,
    image: 'assets/images/all_olive_oil.jpg',
    description: 'Cold-pressed extra virgin olive oil packed with natural anti-oxidants and healthy fats.',
    variants: [
      { weight: '112ml', price: 600, isDefault: true }
    ],
    selectedWeightIndex: 0,
    benefits: ['First cold press, zero chemical additives', 'Heart-healthy Omega-9']
  }
];

// 3. ALL PRODUCTS DATABASE (With Exact Requested Prices & Weight Variants)
const ALL_PRODUCTS = [
  {
    id: 'prod-honey',
    name: 'PURE HONEY',
    isHoney: true,
    rating: 5.0,
    reviewsCount: 480,
    image: 'assets/images/honey_wild_big.jpg',
    description: 'Select your preferred honey variety from 4 natural choices (Wild/Farmy Big/Small Bee).',
    variants: [
      { weight: '200g', price: 560 },
      { weight: '500g', price: 1400, isDefault: true },
      { weight: '1000g', price: 2800 }
    ],
    selectedWeightIndex: 1,
    benefits: ['100% Raw & Unprocessed', 'Zero Sugar Adulteration Guarantee']
  },
  {
    id: 'prod-ghee',
    name: 'DESI GHEE',
    rating: 5.0,
    reviewsCount: 610,
    image: 'assets/images/all_ghee.jpg',
    description: 'Traditional Bilona Desi Ghee prepared from pure grass-fed cow milk.',
    variants: [
      { weight: '500g', price: 1600 },
      { weight: '1000g', price: 3200, isDefault: true }
    ],
    selectedWeightIndex: 1,
    benefits: ['Hand-Churned Bilona', 'Rich Aroma & Granular Texture']
  },
  {
    id: 'prod-imli',
    name: 'IMLI CHUTNEY',
    rating: 4.9,
    reviewsCount: 310,
    image: 'assets/images/prod_imli_chutney.jpg',
    description: 'Handcrafted authentic tangy and sweet Imli Chutney prepared with traditional natural spices.',
    variants: [
      { weight: '500g', price: 800, isDefault: true },
      { weight: '1000g', price: 1600 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Handmade Recipe', 'No Synthetic Colors']
  },
  {
    id: 'prod-talbina',
    name: 'TALBINA',
    rating: 4.9,
    reviewsCount: 340,
    image: 'assets/images/prod_talbina.jpg',
    description: 'Traditional Sunnah barley porridge blended with nuts, dates, and pure natural honey goodness.',
    variants: [
      { weight: '170g', price: 500, isDefault: true },
      { weight: '450g', price: 1300 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Nutritious Sunnah Food', 'Eases Digestive Stress & Boosts Energy']
  },
  {
    id: 'prod-olive',
    name: 'OLIVE OIL',
    rating: 5.0,
    reviewsCount: 290,
    image: 'assets/images/all_olive_oil.jpg',
    description: 'Cold-pressed extra virgin olive oil packed with healthy nutrients and antioxidants.',
    variants: [
      { weight: '112ml', price: 600, isDefault: true }
    ],
    selectedWeightIndex: 0,
    benefits: ['First Cold Press', 'Heart Healthy Nutrition']
  },
  {
    id: 'prod-shilajit',
    name: 'SHILAJIT',
    rating: 5.0,
    reviewsCount: 190,
    image: 'assets/images/prod_shilajit.jpg',
    description: '100% authentic purified Himalayan resin Shilajit. Rich in fulvic acid and natural minerals.',
    variants: [
      { weight: '1 Tola', price: 1000, isDefault: true },
      { weight: '2 Tola', price: 2000 },
      { weight: '3 Tola', price: 3000 }
    ],
    selectedWeightIndex: 0,
    benefits: ['100% Pure Resin', 'Boosts Natural Energy & Vitality']
  },
  {
    id: 'prod-pickle',
    name: 'MIX PICKLE',
    rating: 4.9,
    reviewsCount: 280,
    image: 'assets/images/prod_mix_pickle2.jpg',
    description: 'Handcrafted authentic mixed mustard oil pickle infused with traditional aromatic spices.',
    variants: [
      { weight: '500g', price: 350, isDefault: true },
      { weight: '1000g', price: 700 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Traditional Recipe', 'Pure Mustard Oil Base']
  },
  {
    id: 'prod-tea',
    name: 'TEA (PATTI)',
    rating: 4.9,
    reviewsCount: 380,
    image: 'assets/images/all_tea.jpg',
    description: 'Selected top tea leaves for a rich aroma, strong brisk color, and refreshing taste.',
    variants: [
      { weight: '200g', price: 400, isDefault: true },
      { weight: '900g', price: 1800 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Strong Rich Color', 'Natural Fresh Aroma']
  }
];

// 4. STATE MANAGEMENT & FREE SHIPPING THRESHOLD (Rs. 5000)
const FREE_SHIPPING_THRESHOLD = 5000;
let cart = JSON.parse(localStorage.getItem('dtl_cart')) || [];
let myOrders = JSON.parse(localStorage.getItem('dtl_orders')) || [];
let currentUser = JSON.parse(localStorage.getItem('dtl_user')) || null;
let currentSlideIndex = 0;
let slideInterval;

// 5. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  renderTopSellingProducts();
  renderAllProducts();
  renderHoneyShowcase();
  renderHoneyModal();
  updateCartUI();
  updateAuthUI();
  renderOrdersDrawer();
  initHeroTouchSlider();
  initScrollRevealObserver();
  initEventListeners();
});

// 6. HERO SLIDER LOGIC (Touch Swipe + Drag, NO Side Buttons)
function initHeroTouchSlider() {
  const sliderContainer = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progressFill = document.getElementById('goldenProgressFill');

  if (!sliderContainer || slides.length === 0) return;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlideIndex = (index + slides.length) % slides.length;

    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');

    resetProgressBar();
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  function resetProgressBar() {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth;
    progressFill.style.transition = 'width 3s linear';
    progressFill.style.width = '100%';
  }

  // Touch Controls
  sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  sliderContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  sliderContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 35) {
      if (diffX > 0) nextSlide();
      else prevSlide();
      resetSlideTimer();
    }
  });

  // Mouse Drag Controls
  sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  sliderContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  sliderContainer.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 35) {
      if (diffX > 0) nextSlide();
      else prevSlide();
      resetSlideTimer();
    }
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      showSlide(idx);
      resetSlideTimer();
    });
  });

  function startSlideTimer() {
    resetProgressBar();
    slideInterval = setInterval(() => {
      nextSlide();
    }, 3000);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  startSlideTimer();
}

// 7. SCROLL REVEAL OBSERVER
function initScrollRevealObserver() {
  const revealElements = document.querySelectorAll('.reveal-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

// 8. RENDER TOP SELLING PRODUCTS
function renderTopSellingProducts() {
  const container = document.getElementById('topSellingGrid');
  if (!container) return;

  container.innerHTML = TOP_SELLING_PRODUCTS.map(product => {
    const activeVar = product.variants[product.selectedWeightIndex];
    return `
      <div class="product-card" id="card-${product.id}">
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy" id="img-${product.id}">
          <button class="btn btn-glass btn-sm quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
            <i class="fa-solid fa-eye text-red"></i> Quick View
          </button>
        </div>

        <div class="product-content">
          <span class="product-category">${activeVar.weight}</span>
          <h3 class="product-title">${product.name}</h3>

          <div class="rating-row">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span>${product.rating} (${product.reviewsCount})</span>
          </div>

          ${product.variants.length > 1 ? `
            <div class="weight-selector-box">
              <span class="weight-selector-label">Select Quantity:</span>
              <div class="weight-options-row">
                ${product.variants.map((v, idx) => `
                  <button class="weight-btn ${idx === product.selectedWeightIndex ? 'active' : ''}" 
                          onclick="selectProductWeight('${product.id}', ${idx}, true)">
                    ${v.weight}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="price-row">
            <span class="price-current" id="price-${product.id}">Rs. ${activeVar.price.toLocaleString()}</span>
          </div>

          <div class="card-actions">
            ${product.isHoney ? `
              <button class="btn btn-red btn-block" onclick="openHoneyModal()">
                <i class="fa-solid fa-jar-wheat"></i> Choose Honey Variety
              </button>
            ` : `
              <button class="btn btn-red btn-block" onclick="addProductToCart('${product.id}', true)">
                <i class="fa-solid fa-bag-shopping"></i> Add To Cart
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 9. RENDER ALL PRODUCTS (8 Items with Live Weight Variant Selectors)
function renderAllProducts() {
  const container = document.getElementById('allProductsGrid');
  if (!container) return;

  container.innerHTML = ALL_PRODUCTS.map(product => {
    const activeVar = product.variants[product.selectedWeightIndex];
    return `
      <div class="product-card" id="allcard-${product.id}">
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy" id="allimg-${product.id}">
          <button class="btn btn-glass btn-sm quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
            <i class="fa-solid fa-eye text-red"></i> Quick View
          </button>
        </div>

        <div class="product-content">
          <span class="product-category">${activeVar.weight}</span>
          <h3 class="product-title">${product.name}</h3>

          <div class="rating-row">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span>${product.rating} (${product.reviewsCount})</span>
          </div>

          ${product.variants.length > 1 ? `
            <div class="weight-selector-box">
              <span class="weight-selector-label">Select Quantity / Weight:</span>
              <div class="weight-options-row">
                ${product.variants.map((v, idx) => `
                  <button class="weight-btn ${idx === product.selectedWeightIndex ? 'active' : ''}" 
                          onclick="selectProductWeight('${product.id}', ${idx}, false)">
                    ${v.weight}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="weight-selector-box">
              <span class="weight-selector-label">Standard Size:</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--forest-primary);">${activeVar.weight} Bottle</span>
            </div>
          `}

          <div class="price-row">
            <span class="price-current" id="allprice-${product.id}">Rs. ${activeVar.price.toLocaleString()}</span>
          </div>

          <div class="card-actions">
            ${product.isHoney ? `
              <button class="btn btn-red btn-block" onclick="openHoneyModal()">
                <i class="fa-solid fa-jar-wheat"></i> Select Honey Variety
              </button>
            ` : `
              <button class="btn btn-red btn-block" onclick="addProductToCart('${product.id}', false)">
                <i class="fa-solid fa-bag-shopping"></i> Add To Cart
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 10. RENDER HONEY VARIETIES SHOWCASE (4 Images, 4 Varieties)
function renderHoneyShowcase() {
  const container = document.getElementById('honeyShowcaseGrid');
  if (!container) return;

  container.innerHTML = HONEY_CATEGORIES.map(category => {
    const activeVar = category.variants[category.selectedWeightIndex];
    return `
      <div class="honey-card" id="hcard-${category.id}">
        <span class="honey-card-badge">${category.tag}</span>
        <div class="honey-card-img-box">
          <img src="${category.image}" alt="${category.name}" loading="lazy">
        </div>

        <div class="honey-card-body">
          <h3 class="honey-card-title">${category.name}</h3>

          <div class="weight-selector-box">
            <span class="weight-selector-label">Select Weight:</span>
            <div class="honey-weights-row">
              ${category.variants.map((v, idx) => `
                <button class="honey-w-btn ${idx === category.selectedWeightIndex ? 'active' : ''}" 
                        onclick="selectHoneyCategoryWeight('${category.id}', ${idx})">
                  ${v.weight}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="honey-card-price-row">
            <span class="honey-price-val" id="hprice-${category.id}">Rs. ${activeVar.price.toLocaleString()}</span>
            <span class="honey-unit-label">per ${activeVar.weight}</span>
          </div>

          <button class="btn btn-red btn-block btn-sm" onclick="addHoneyCategoryToCart('${category.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add To Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 11. RENDER HONEY SELECTION MODAL
function renderHoneyModal() {
  const container = document.getElementById('honeyModalGrid');
  if (!container) return;

  container.innerHTML = HONEY_CATEGORIES.map(category => {
    const activeVar = category.variants[category.selectedWeightIndex];
    return `
      <div class="honey-modal-item">
        <img src="${category.image}" alt="${category.name}" class="honey-modal-img">
        <div class="honey-modal-details">
          <div class="honey-modal-title">${category.name}</div>

          <div class="honey-modal-weights">
            ${category.variants.map((v, idx) => `
              <button class="honey-modal-w-btn ${idx === category.selectedWeightIndex ? 'active' : ''}" 
                      onclick="selectHoneyModalWeight('${category.id}', ${idx})">
                ${v.weight}
              </button>
            `).join('')}
          </div>

          <div class="honey-modal-foot">
            <span class="honey-modal-price" id="hmodal-price-${category.id}">Rs. ${activeVar.price.toLocaleString()}</span>
            <button class="btn btn-red btn-sm" onclick="addHoneyCategoryToCart('${category.id}'); closeHoneyModal();">
              <i class="fa-solid fa-bag-shopping"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 12. WEIGHT SELECTOR INTERACTION HANDLERS
function selectProductWeight(productId, weightIndex, isTopSelling) {
  const list = isTopSelling ? TOP_SELLING_PRODUCTS : ALL_PRODUCTS;
  const product = list.find(p => p.id === productId);
  if (!product) return;

  product.selectedWeightIndex = weightIndex;
  const selectedVariant = product.variants[weightIndex];

  const topPriceElem = document.getElementById(`price-${productId}`);
  if (topPriceElem) topPriceElem.textContent = `Rs. ${selectedVariant.price.toLocaleString()}`;

  const allPriceElem = document.getElementById(`allprice-${productId}`);
  if (allPriceElem) allPriceElem.textContent = `Rs. ${selectedVariant.price.toLocaleString()}`;

  if (isTopSelling) renderTopSellingProducts();
  else renderAllProducts();
}

function selectHoneyCategoryWeight(categoryId, weightIndex) {
  const category = HONEY_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  category.selectedWeightIndex = weightIndex;
  renderHoneyShowcase();
  renderHoneyModal();
}

function selectHoneyModalWeight(categoryId, weightIndex) {
  const category = HONEY_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  category.selectedWeightIndex = weightIndex;
  renderHoneyModal();
  renderHoneyShowcase();
}

// 13. CART OPERATIONS (Free delivery above Rs. 5000)
function addProductToCart(productId, isTopSelling) {
  const list = isTopSelling ? TOP_SELLING_PRODUCTS : ALL_PRODUCTS;
  const product = list.find(p => p.id === productId);
  if (!product) return;

  const variant = product.variants[product.selectedWeightIndex];
  const itemUniqueId = `${product.id}-${variant.weight.replace(/\\s+/g, '')}`;

  const existing = cart.find(item => item.id === itemUniqueId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: itemUniqueId,
      name: `${product.name} (${variant.weight})`,
      price: variant.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> Added <strong>${product.name} (${variant.weight})</strong> to cart!`);
  openCartDrawer();
}

function addHoneyCategoryToCart(categoryId) {
  const category = HONEY_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  const variant = category.variants[category.selectedWeightIndex];
  const itemUniqueId = `${category.id}-${variant.weight.replace(/\\s+/g, '')}`;

  const existing = cart.find(item => item.id === itemUniqueId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: itemUniqueId,
      name: `${category.name} (${variant.weight})`,
      price: variant.price,
      image: category.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> Added <strong>${category.name} (${variant.weight})</strong> to cart!`);
  openCartDrawer();
}

function updateCartQty(itemUniqueId, delta) {
  const item = cart.find(i => i.id === itemUniqueId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== itemUniqueId);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(itemUniqueId) {
  cart = cart.filter(i => i.id !== itemUniqueId);
  saveCart();
  updateCartUI();
  showToast('Item removed from cart');
}

function saveCart() {
  localStorage.setItem('dtl_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  document.getElementById('cartCountBadge').textContent = totalItems;
  document.getElementById('cartCountTitle').textContent = totalItems;

  const deliveryCharge = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : 250;
  const grandTotal = subtotal + deliveryCharge;

  document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('deliveryChargeText').textContent = deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`;
  document.getElementById('cartGrandTotal').textContent = `Rs. ${grandTotal.toLocaleString()}`;

  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const fillBar = document.getElementById('shippingProgressFill');
  const textBar = document.getElementById('shippingText');

  if (fillBar) fillBar.style.width = `${progressPercent}%`;
  if (textBar) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      textBar.innerHTML = `<span class="text-forest"><i class="fa-solid fa-crown text-red"></i> You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      const needed = FREE_SHIPPING_THRESHOLD - subtotal;
      textBar.innerHTML = `Add <strong>Rs. ${needed.toLocaleString()}</strong> more to get <strong>FREE Delivery</strong>!`;
    }
  }

  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--border-gold); margin-bottom: 16px;"></i>
        <p>Your shopping cart is empty.</p>
        <button onclick="closeCartDrawer()" class="btn btn-red-outline btn-sm" style="margin-top: 16px;">Explore Products</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-actions">
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// 14. MY ORDERS & 24-HOUR CANCELLATION SYSTEM
function renderOrdersDrawer() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  if (myOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--border-gold); margin-bottom: 16px;"></i>
        <p>You haven't placed any orders yet.</p>
      </div>
    `;
    return;
  }

  const now = Date.now();
  const twentyFourHours = 24 * 3600 * 1000;

  container.innerHTML = myOrders.map(order => {
    const timeElapsed = now - order.timestamp;
    const canCancel = (timeElapsed <= twentyFourHours) && (order.status !== 'Cancelled');
    const orderDateStr = new Date(order.timestamp).toLocaleString();

    return `
      <div class="order-card-item">
        <div class="order-card-header">
          <span class="order-ref-code">${order.id}</span>
          <span class="order-status-badge ${order.status === 'Cancelled' ? 'cancelled' : ''}">${order.status}</span>
        </div>
        <div class="order-items-list">
          ${order.items.map(i => `<div>â€¢ ${i.name} (x${i.qty}) = Rs. ${i.price * i.qty}</div>`).join('')}
        </div>
        <div class="summary-line" style="margin-top: 4px;">
          <strong>Total: Rs. ${order.total.toLocaleString()}</strong>
        </div>
        <div class="order-time-text">Placed on: ${orderDateStr}</div>

        ${canCancel ? `
          <button class="cancel-order-btn" onclick="cancelOrder('${order.id}')">
            <i class="fa-solid fa-ban"></i> Cancel Order (Within 24h)
          </button>
        ` : (order.status !== 'Cancelled' ? `<small style="color: var(--text-muted);">Order processing locked (24h passed)</small>` : '')}
      </div>
    `;
  }).join('');
}

function cancelOrder(orderId) {
  const order = myOrders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'Cancelled';
  localStorage.setItem('dtl_orders', JSON.stringify(myOrders));
  renderOrdersDrawer();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> Order ${orderId} has been cancelled.`);
}

// 15. AUTH UI
function updateAuthUI() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loggedState = document.getElementById('userLoggedInState');

  if (currentUser) {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'none';
    if (loggedState) {
      loggedState.style.display = 'block';
      document.getElementById('loggedInUserName').textContent = currentUser.name;
      document.getElementById('loggedInUserEmail').textContent = currentUser.email;
    }
  } else {
    if (loggedState) loggedState.style.display = 'none';
    if (loginForm) loginForm.style.display = 'flex';
  }
}

// 16. MODAL & DRAWER TOGGLES
function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function openOrdersDrawer() {
  renderOrdersDrawer();
  document.getElementById('ordersDrawer')?.classList.add('active');
  document.getElementById('ordersOverlay')?.classList.add('active');
}

function closeOrdersDrawer() {
  document.getElementById('ordersDrawer')?.classList.remove('active');
  document.getElementById('ordersOverlay')?.classList.remove('active');
}

function openHoneyModal() {
  renderHoneyModal();
  document.getElementById('honeyCategoryModal')?.classList.add('active');
}

function closeHoneyModal() {
  document.getElementById('honeyCategoryModal')?.classList.remove('active');
}

function openQuickView(productId) {
  let product = TOP_SELLING_PRODUCTS.find(p => p.id === productId) || ALL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const variant = product.variants[product.selectedWeightIndex];
  const content = document.getElementById('quickViewContent');
  if (!content) return;

  content.innerHTML = `
    <div class="qv-img-box">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="qv-info">
      <h2>${product.name}</h2>
      <p class="qv-desc">${product.description}</p>

      <ul class="qv-benefits">
        ${product.benefits.map(b => `<li><i class="fa-solid fa-circle-check text-red"></i> ${b}</li>`).join('')}
      </ul>

      <div class="price-row" style="margin-bottom: 20px;">
        <span class="price-current" style="font-size: 1.5rem;">Rs. ${variant.price.toLocaleString()} (${variant.weight})</span>
      </div>

      <button class="btn btn-red btn-lg btn-block shadow-red" onclick="addProductToCart('${product.id}', false); closeQuickView();">
        <i class="fa-solid fa-bag-shopping"></i> Add To Cart Now
      </button>
    </div>
  `;

  document.getElementById('quickViewModal')?.classList.add('active');
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('active');
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty! Add products first.');
    return;
  }
  closeCartDrawer();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const finalTotal = subtotal + shipping;

  document.getElementById('checkoutItemsTotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('checkoutShippingFee').textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping}`;
  document.getElementById('checkoutFinalTotal').textContent = `Rs. ${finalTotal.toLocaleString()}`;

  document.getElementById('checkoutModal')?.classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.remove('active');
}

// 17. EVENT LISTENERS
function initEventListeners() {
  // Orders Drawer
  document.getElementById('myOrdersDrawerBtn')?.addEventListener('click', openOrdersDrawer);
  document.getElementById('closeOrdersBtn')?.addEventListener('click', closeOrdersDrawer);
  document.getElementById('ordersOverlay')?.addEventListener('click', closeOrdersDrawer);

  // Cart Toggles
  document.getElementById('cartToggleBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);

  // Honey Modal
  document.getElementById('closeHoneyModalBtn')?.addEventListener('click', closeHoneyModal);

  // Account Button
  document.getElementById('userAccountBtn')?.addEventListener('click', () => {
    const authSection = document.getElementById('authSection');
    if (authSection) authSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Quick View Close
  document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeQuickView);

  // In-Place Auth Tabs
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTabBtn?.addEventListener('click', () => {
    loginTabBtn.classList.add('active');
    signupTabBtn?.classList.remove('active');
    if (loginForm) loginForm.style.display = 'flex';
    if (signupForm) signupForm.style.display = 'none';
  });

  signupTabBtn?.addEventListener('click', () => {
    signupTabBtn.classList.add('active');
    loginTabBtn?.classList.remove('active');
    if (signupForm) signupForm.style.display = 'flex';
    if (loginForm) loginForm.style.display = 'none';
  });

  // Login Submit
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    currentUser = { name: email.split('@')[0], email: email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('<i class="fa-solid fa-circle-check text-red"></i> Welcome back to Desi Taste Land!');
  });

  // Sign Up Submit
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    currentUser = { name: name, email: email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('<i class="fa-solid fa-circle-check text-red"></i> Account created successfully!');
  });

  // Logout Button
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('dtl_user');
    updateAuthUI();
    showToast('Logged out successfully');
  });

  // Submit Review Form
  document.getElementById('submitReviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value;
    const city = document.getElementById('revCity').value;
    const comment = document.getElementById('revComment').value;

    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        Type: 'CUSTOMER REVIEW SUBMISSION',
        Customer_Name: name,
        City: city,
        Review_Text: comment
      })
    }).catch(err => console.log(err));

    const reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid) {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-top">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>
        </div>
        <p class="review-text">"${comment}"</p>
        <div class="reviewer-meta">
          <div class="reviewer-initial">${name.charAt(0).toUpperCase()}</div>
          <div class="reviewer-info">
            <strong>${name}</strong>
            <small>${city}, Pakistan</small>
          </div>
        </div>
      `;
      reviewsGrid.prepend(card);
    }

    document.getElementById('submitReviewForm').reset();
    showToast('<i class="fa-solid fa-circle-check text-red"></i> Shukriya! Your review has been submitted.');
  });

  // Checkout Triggers
  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', closeCheckoutModal);

  // Special Deal Claim Button
  document.getElementById('claimDealBtn')?.addEventListener('click', () => {
    const dealItem = {
      id: 'deal-ghee-saffron',
      name: 'DESI GHEE (500g) + ROYAL KASHMIRI SAFFRON (1g) COMBO',
      price: 2750,
      qty: 1,
      image: 'assets/images/deal_banner.jpg'
    };

    const existing = cart.find(i => i.id === dealItem.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(dealItem);
    }
    saveCart();
    updateCartUI();
    showToast('<i class="fa-solid fa-crown text-red"></i> Special Mega Deal added to cart!');
    openCartDrawer();
  });

  // Checkout Form Submission
  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const city = document.getElementById('custCity').value;
    const address = document.getElementById('custAddress').value;
    const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
    const grandTotal = subtotal + shipping;

    const itemsSummary = cart.map(i => `${i.name} (${i.qty}x) = Rs. ${i.price * i.qty}`).join(', ');

    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Order Received (${refId}) - DESI TASTE LAND`,
        Order_Reference: refId,
        Customer_Name: name,
        Customer_Phone: phone,
        Customer_City: city,
        Shipping_Address: address,
        Items_Ordered: itemsSummary,
        Subtotal_PKR: subtotal,
        Shipping_PKR: shipping,
        Total_Amount_PKR: grandTotal
      })
    }).catch(err => console.log('Order notification background sent', err));

    const newOrder = {
      id: refId,
      timestamp: Date.now(),
      name: name,
      phone: phone,
      address: `${address}, ${city}`,
      items: [...cart],
      total: grandTotal,
      status: 'Processing'
    };
    myOrders.unshift(newOrder);
    localStorage.setItem('dtl_orders', JSON.stringify(myOrders));

    document.getElementById('orderRefId').textContent = refId;
    closeCheckoutModal();

    cart = [];
    saveCart();
    updateCartUI();

    document.getElementById('orderSuccessModal')?.classList.add('active');
  });

  document.getElementById('closeSuccessBtn')?.addEventListener('click', () => {
    document.getElementById('orderSuccessModal')?.classList.remove('active');
  });
}

// 18. TOAST NOTIFICATIONS
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}