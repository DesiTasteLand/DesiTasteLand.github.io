/* ==========================================================================
   DESI TASTE LAND - Master Application JavaScript
   ========================================================================== */

const FREE_SHIPPING_THRESHOLD = 5000;

// 1. HONEY CATEGORIES (4 Varieties - Exact Prices)
const HONEY_CATEGORIES = [
  {
    id: 'honey-wild-big',
    name: 'WILD HONEY BIG BEE',
    tag: 'Wild Harvest',
    image: 'assets/images/honey_wild_big.jpg',
    description: '100% pure wild Sidr honey collected from wild big bees in natural forests.',
    variants: [
      { weight: '250g', price: 700 },
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
      { weight: '250g', price: 1400 },
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
      { weight: '250g', price: 500 },
      { weight: '500g', price: 1000, isDefault: true },
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
      { weight: '250g', price: 1000 },
      { weight: '500g', price: 2000, isDefault: true },
      { weight: '1000g', price: 4000 }
    ],
    selectedWeightIndex: 1
  }
];

// 2. TOP SELLING PRODUCTS - Only name, image, simple BUY NOW (no price/qty display)
const TOP_SELLING_PRODUCTS = [
  {
    id: 'top-honey',
    name: 'PURE HONEY',
    isHoney: true,
    image: 'assets/images/honey_wild_big.jpg',
    rating: 5.0,
    reviewsCount: 450
  },
  {
    id: 'top-ghee',
    name: 'DESI GHEE',
    image: 'assets/images/all_ghee.jpg',
    rating: 5.0,
    reviewsCount: 620,
    defaultVariant: { weight: '500g', price: 1600 }
  },
  {
    id: 'top-olive',
    name: 'OLIVE OIL',
    image: 'assets/images/all_olive_oil.jpg',
    rating: 5.0,
    reviewsCount: 310,
    defaultVariant: { weight: '112ml', price: 600 }
  }
];

// 3. ALL PRODUCTS
const ALL_PRODUCTS = [
  {
    id: 'prod-honey',
    name: 'PURE HONEY',
    isHoney: true,
    rating: 5.0,
    reviewsCount: 480,
    image: 'assets/images/honey_wild_big.jpg',
    description: 'Select your preferred honey variety from 4 natural choices.',
    variants: [
      { weight: '250g', price: 700 },
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
    benefits: ['Nutritious Sunnah Food', 'Eases Digestive Stress']
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
    benefits: ['100% Pure Resin', 'Boosts Natural Energy']
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

// 4. STATE
let cart = JSON.parse(localStorage.getItem('dtl_cart')) || [];
let myOrders = JSON.parse(localStorage.getItem('dtl_orders')) || [];
let currentUser = JSON.parse(localStorage.getItem('dtl_user')) || null;
let currentSlideIndex = 0;
let slideInterval;
let isHoneyAccordionOpen = false;

// 5. INIT
document.addEventListener('DOMContentLoaded', () => {
  renderTopSellingProducts();
  renderAllProductsWithHoneyAccordion();
  updateCartUI();
  updateAuthUI();
  renderOrdersDrawer();
  initHeroTouchSlider();
  initScrollRevealObserver();
  initEventListeners();
});

// 6. HERO SLIDER
function initHeroTouchSlider() {
  const sliderContainer = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progressFill = document.getElementById('goldenProgressFill');
  if (!sliderContainer || slides.length === 0) return;

  let startX = 0, currentX = 0, isDragging = false;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
    resetProgressBar();
  }

  function resetProgressBar() {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth;
    progressFill.style.transition = 'width 3s linear';
    progressFill.style.width = '100%';
  }

  sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; startX = e.touches[0].clientX; }, { passive: true });
  sliderContainer.addEventListener('touchmove', (e) => { if (!isDragging) return; currentX = e.touches[0].clientX; }, { passive: true });
  sliderContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(startX - currentX) > 35) { startX - currentX > 0 ? showSlide(currentSlideIndex + 1) : showSlide(currentSlideIndex - 1); resetSlideTimer(); }
  });
  sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; });
  sliderContainer.addEventListener('mousemove', (e) => { if (!isDragging) return; currentX = e.clientX; });
  sliderContainer.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(startX - currentX) > 35) { startX - currentX > 0 ? showSlide(currentSlideIndex + 1) : showSlide(currentSlideIndex - 1); resetSlideTimer(); }
  });

  dots.forEach(dot => dot.addEventListener('click', (e) => { showSlide(parseInt(e.target.getAttribute('data-index'))); resetSlideTimer(); }));

  function startSlideTimer() { resetProgressBar(); slideInterval = setInterval(() => showSlide(currentSlideIndex + 1), 3000); }
  function resetSlideTimer() { clearInterval(slideInterval); startSlideTimer(); }
  startSlideTimer();
}

// 7. SCROLL REVEAL
function initScrollRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
}

// Modal State for Product Variant & Quantity Selection
let currentModalProduct = null;
let modalSelectedVariantIndex = 0;
let modalQuantity = 1;

// 8. TOP SELLING - Clean simple cards: just image, name, rating, BUY NOW
function renderTopSellingProducts() {
  const container = document.getElementById('topSellingGrid');
  if (!container) return;

  container.innerHTML = TOP_SELLING_PRODUCTS.map(product => `
    <div class="product-card ts-card" id="card-${product.id}">
      <div class="product-img-box ts-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-content ts-content">
        <h3 class="product-title">${product.name}</h3>
        <div class="rating-row">
          <div class="stars">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span>${product.rating} (${product.reviewsCount}+)</span>
        </div>
        <button class="btn btn-red btn-block ts-buy-btn" onclick="${product.isHoney ? "scrollToAllProducts()" : `openProductSelectionModal('${product.id === 'top-ghee' ? 'prod-ghee' : product.id === 'top-olive' ? 'prod-olive' : product.id}')`}">
          <i class="fa-solid fa-bag-shopping"></i> BUY NOW
        </button>
      </div>
    </div>
  `).join('');
}

function scrollToAllProducts() {
  const sec = document.getElementById('allProductsSection');
  if (sec) sec.scrollIntoView({ behavior: 'smooth' });
}

// 9. ALL PRODUCTS WITH INLINE HONEY ACCORDION
function renderAllProductsWithHoneyAccordion() {
  const container = document.getElementById('allProductsGrid');
  if (!container) return;

  let html = '';
  ALL_PRODUCTS.forEach((product) => {
    const activeVar = product.variants[product.selectedWeightIndex || 0];
    const priceDisplay = product.variants.length > 1 
      ? `Rs. ${product.variants[0].price.toLocaleString()}`
      : `Rs. ${activeVar.price.toLocaleString()}`;

    html += `
      <div class="product-card" id="allcard-${product.id}">
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy" id="allimg-${product.id}">
        </div>
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="rating-row">
            <div class="stars">
              <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span>${product.rating} (${product.reviewsCount})</span>
          </div>
          <div class="price-row">
            <span class="price-current" id="allprice-${product.id}">${priceDisplay}</span>
            ${product.variants.length > 1 ? `<span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">(${product.variants.length} Sizes)</span>` : ''}
          </div>
          <button class="btn btn-red btn-block buy-now-btn" onclick="${product.isHoney ? "toggleHoneyAccordion()" : `openProductSelectionModal('${product.id}')`}">
            <i class="fa-solid fa-bag-shopping"></i> ${product.isHoney ? 'Choose Honey' : 'BUY NOW'}
          </button>
        </div>
      </div>
    `;

    if (product.id === 'prod-honey') {
      html += `
        <div class="honey-inline-accordion ${isHoneyAccordionOpen ? 'active' : ''}" id="honeyInlineAccordion">
          <div class="honey-inline-header">
            <div>
              <span class="section-subtitle"><i class="fa-solid fa-jar-wheat text-red"></i> 100% Pure & Raw</span>
              <h3>Select Honey Variety & Weight</h3>
            </div>
            <button class="honey-close-btn" onclick="toggleHoneyAccordion()">&times;</button>
          </div>
          <div class="honey-inline-grid">
            ${HONEY_CATEGORIES.map(category => {
              const catVar = category.variants[category.selectedWeightIndex || 0];
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
                          <button class="honey-w-btn ${idx === (category.selectedWeightIndex || 0) ? 'active' : ''}"
                                  onclick="selectHoneyCategoryWeight('${category.id}', ${idx})">
                            ${v.weight}
                          </button>
                        `).join('')}
                      </div>
                    </div>
                    <div class="honey-card-price-row">
                      <span class="honey-price-val" id="hprice-${category.id}">Rs. ${catVar.price.toLocaleString()}</span>
                      <span class="honey-unit-label">per ${catVar.weight}</span>
                    </div>
                    <button class="btn btn-red btn-block btn-sm" onclick="openProductSelectionModal('${category.id}')">
                      <i class="fa-solid fa-bag-shopping"></i> BUY NOW
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

function toggleHoneyAccordion() {
  isHoneyAccordionOpen = !isHoneyAccordionOpen;
  renderAllProductsWithHoneyAccordion();
  if (isHoneyAccordionOpen) {
    const accordion = document.getElementById('honeyInlineAccordion');
    if (accordion) accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function selectHoneyCategoryWeight(categoryId, weightIndex) {
  const category = HONEY_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;
  category.selectedWeightIndex = weightIndex;
  renderAllProductsWithHoneyAccordion();
}

// 10. PRODUCT VARIANT & QUANTITY SELECTION MODAL
function openProductSelectionModal(productId) {
  let product = ALL_PRODUCTS.find(p => p.id === productId);
  if (!product) {
    product = HONEY_CATEGORIES.find(c => c.id === productId);
  }
  if (!product) return;

  currentModalProduct = product;
  modalSelectedVariantIndex = product.selectedWeightIndex !== undefined ? product.selectedWeightIndex : 0;
  modalQuantity = 1;

  renderProductSelectionModal();
  document.getElementById('productSelectionModal')?.classList.add('active');
}

function closeProductSelectionModal() {
  document.getElementById('productSelectionModal')?.classList.remove('active');
}

function setModalVariant(idx) {
  modalSelectedVariantIndex = idx;
  if (currentModalProduct) {
    currentModalProduct.selectedWeightIndex = idx;
  }
  renderProductSelectionModal();
}

function updateModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  renderProductSelectionModal();
}

function renderProductSelectionModal() {
  const container = document.getElementById('productModalContent');
  if (!container || !currentModalProduct) return;

  const product = currentModalProduct;
  const variant = product.variants[modalSelectedVariantIndex] || product.variants[0];
  const itemTotal = variant.price * modalQuantity;

  container.innerHTML = `
    <div class="prod-modal-card-content">
      <div class="prod-modal-header">
        <img src="${product.image}" alt="${product.name}" class="prod-modal-img">
        <div class="prod-modal-info">
          ${product.tag ? `<span class="prod-modal-tag">${product.tag}</span>` : `<span class="prod-modal-tag">100% Pure & Authentic</span>`}
          <h3 class="prod-modal-title">${product.name}</h3>
          <div class="prod-modal-price-highlight">Rs. ${variant.price.toLocaleString()} <span style="font-size:0.75rem;font-weight:600;color:var(--text-muted);">/ ${variant.weight}</span></div>
        </div>
      </div>

      ${product.variants && product.variants.length > 1 ? `
        <div class="prod-modal-section">
          <label class="prod-modal-label"><i class="fa-solid fa-weight-scale text-red"></i> Select Size / Weight:</label>
          <div class="prod-modal-variants">
            ${product.variants.map((v, idx) => `
              <button type="button" class="pm-variant-btn ${idx === modalSelectedVariantIndex ? 'active' : ''}" onclick="setModalVariant(${idx})">
                <span class="pm-variant-weight">${v.weight}</span>
                <span class="pm-variant-price">Rs. ${v.price.toLocaleString()}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="prod-modal-section">
          <label class="prod-modal-label"><i class="fa-solid fa-weight-scale text-red"></i> Size / Weight:</label>
          <div class="prod-modal-variants">
            <button type="button" class="pm-variant-btn active" style="cursor:default;">
              <span class="pm-variant-weight">${variant.weight}</span>
              <span class="pm-variant-price">Rs. ${variant.price.toLocaleString()}</span>
            </button>
          </div>
        </div>
      `}

      <div class="prod-modal-section">
        <label class="prod-modal-label"><i class="fa-solid fa-calculator text-red"></i> Select Quantity:</label>
        <div class="prod-modal-qty-control">
          <div class="pm-qty-box">
            <button type="button" class="pm-qty-btn" onclick="updateModalQty(-1)">-</button>
            <span class="pm-qty-num">${modalQuantity}</span>
            <button type="button" class="pm-qty-btn" onclick="updateModalQty(1)">+</button>
          </div>
          <span style="font-size:0.85rem;color:var(--text-muted);font-weight:600;">Jar(s) / Pack(s)</span>
        </div>
      </div>

      <div class="prod-modal-total-bar">
        <div>
          <span class="pm-total-label">Total Amount:</span>
          <small class="pm-total-calc">${variant.weight} × ${modalQuantity} item(s)</small>
        </div>
        <div class="pm-total-amount">Rs. ${itemTotal.toLocaleString()}</div>
      </div>

      <div class="prod-modal-actions">
        <button class="btn btn-red btn-block shadow-red" onclick="proceedDirectOrderFromModal()">
          <i class="fa-solid fa-bolt"></i> Order Now (COD)
        </button>
        <button class="btn btn-red-outline btn-block" onclick="addToCartFromModal()">
          <i class="fa-solid fa-bag-shopping"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function addToCartFromModal() {
  if (!currentModalProduct) return;
  const product = currentModalProduct;
  const variant = product.variants[modalSelectedVariantIndex] || product.variants[0];
  const itemId = `${product.id}-${variant.weight.replace(/\s+/g,'')}`;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty += modalQuantity;
  } else {
    cart.push({
      id: itemId,
      name: `${product.name} (${variant.weight})`,
      price: variant.price,
      image: product.image,
      qty: modalQuantity
    });
  }
  saveCart();
  updateCartUI();
  closeProductSelectionModal();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> <strong>${modalQuantity}x ${product.name} (${variant.weight})</strong> added to cart!`);
  openCartDrawer();
}

function proceedDirectOrderFromModal() {
  if (!currentModalProduct) return;
  const product = currentModalProduct;
  const variant = product.variants[modalSelectedVariantIndex] || product.variants[0];
  const itemId = `${product.id}-${variant.weight.replace(/\s+/g,'')}`;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty += modalQuantity;
  } else {
    cart.push({
      id: itemId,
      name: `${product.name} (${variant.weight})`,
      price: variant.price,
      image: product.image,
      qty: modalQuantity
    });
  }
  saveCart();
  updateCartUI();
  closeProductSelectionModal();
  openCheckoutModal();
}

// 11. CART

function updateCartQty(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== itemId);
  saveCart(); updateCartUI();
}

function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  saveCart(); updateCartUI();
  showToast('Item removed from cart');
}

function saveCart() { localStorage.setItem('dtl_cart', JSON.stringify(cart)); }

function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  document.getElementById('cartCountBadge').textContent = totalItems;
  document.getElementById('cartCountTitle').textContent = totalItems;

  const deliveryCharge = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : 250;
  const grandTotal = subtotal + deliveryCharge;

  document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('deliveryChargeText').textContent = deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`;
  document.getElementById('cartGrandTotal').textContent = `Rs. ${grandTotal.toLocaleString()}`;

  const fillBar = document.getElementById('shippingProgressFill');
  const textBar = document.getElementById('shippingText');
  if (fillBar) fillBar.style.width = `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`;
  if (textBar) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      textBar.innerHTML = `<span class="text-forest"><i class="fa-solid fa-crown text-red"></i> You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      textBar.innerHTML = `Add <strong>Rs. ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}</strong> more to get <strong>FREE Delivery</strong>!`;
    }
  }

  const container = document.getElementById('cartItemsContainer');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="text-center" style="padding:40px 0;color:var(--text-muted);">
      <i class="fa-solid fa-basket-shopping" style="font-size:3rem;color:var(--border-gold);margin-bottom:16px;"></i>
      <p>Your shopping cart is empty.</p>
      <button onclick="closeCartDrawer()" class="btn btn-red-outline btn-sm" style="margin-top:16px;">Explore Products</button>
    </div>`;
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
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// 11. ORDERS
function renderOrdersDrawer() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;
  if (myOrders.length === 0) {
    container.innerHTML = `<div class="text-center" style="padding:40px 0;color:var(--text-muted);">
      <i class="fa-solid fa-box-open" style="font-size:3rem;color:var(--border-gold);margin-bottom:16px;"></i>
      <p>You haven't placed any orders yet.</p>
    </div>`;
    return;
  }
  const now = Date.now();
  const twoFourH = 24 * 3600 * 1000;
  container.innerHTML = myOrders.map(order => {
    const canCancel = ((now - order.timestamp) <= twoFourH) && (order.status !== 'Cancelled');
    return `
      <div class="order-card-item">
        <div class="order-card-header">
          <span class="order-ref-code">${order.id}</span>
          <span class="order-status-badge ${order.status === 'Cancelled' ? 'cancelled' : ''}">${order.status}</span>
        </div>
        <div class="order-items-list">${order.items.map(i => `<div>- ${i.name} x${i.qty} = Rs. ${i.price * i.qty}</div>`).join('')}</div>
        <div class="summary-line" style="margin-top:4px;"><strong>Total: Rs. ${order.total.toLocaleString()}</strong></div>
        <div class="order-time-text">Placed: ${new Date(order.timestamp).toLocaleString()}</div>
        ${canCancel ? `<button class="cancel-order-btn" onclick="cancelOrder('${order.id}')"><i class="fa-solid fa-ban"></i> Cancel Order (Within 24h)</button>` : ''}
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
  showToast(`Order ${orderId} cancelled.`);
}

// 12. AUTH
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

// 13. MODALS & DRAWERS
function openCartDrawer() { document.getElementById('cartDrawer')?.classList.add('active'); document.getElementById('cartOverlay')?.classList.add('active'); }
function closeCartDrawer() { document.getElementById('cartDrawer')?.classList.remove('active'); document.getElementById('cartOverlay')?.classList.remove('active'); }
function openOrdersDrawer() { renderOrdersDrawer(); document.getElementById('ordersDrawer')?.classList.add('active'); document.getElementById('ordersOverlay')?.classList.add('active'); }
function closeOrdersDrawer() { document.getElementById('ordersDrawer')?.classList.remove('active'); document.getElementById('ordersOverlay')?.classList.remove('active'); }
function closeQuickView() { document.getElementById('quickViewModal')?.classList.remove('active'); }

function openCheckoutModal() {
  if (cart.length === 0) { showToast('Cart is empty!'); return; }
  closeCartDrawer();
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  document.getElementById('checkoutItemsTotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('checkoutShippingFee').textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping}`;
  document.getElementById('checkoutFinalTotal').textContent = `Rs. ${(subtotal + shipping).toLocaleString()}`;
  document.getElementById('checkoutModal')?.classList.add('active');
}
function closeCheckoutModal() { document.getElementById('checkoutModal')?.classList.remove('active'); }

// 14. EVENT LISTENERS
function initEventListeners() {
  document.getElementById('myOrdersDrawerBtn')?.addEventListener('click', openOrdersDrawer);
  document.getElementById('closeOrdersBtn')?.addEventListener('click', closeOrdersDrawer);
  document.getElementById('ordersOverlay')?.addEventListener('click', closeOrdersDrawer);
  document.getElementById('cartToggleBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);
  document.getElementById('userAccountBtn')?.addEventListener('click', () => document.getElementById('authSection')?.scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeQuickView);
  document.getElementById('closeProductModalBtn')?.addEventListener('click', closeProductSelectionModal);
  document.getElementById('productSelectionModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productSelectionModal') closeProductSelectionModal();
  });

  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTabBtn?.addEventListener('click', () => { loginTabBtn.classList.add('active'); signupTabBtn?.classList.remove('active'); if (loginForm) loginForm.style.display = 'flex'; if (signupForm) signupForm.style.display = 'none'; });
  signupTabBtn?.addEventListener('click', () => { signupTabBtn.classList.add('active'); loginTabBtn?.classList.remove('active'); if (signupForm) signupForm.style.display = 'flex'; if (loginForm) loginForm.style.display = 'none'; });

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    currentUser = { name: email.split('@')[0], email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('Welcome back to Desi Taste Land!');
  });

  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    currentUser = { name, email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('Account created successfully!');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => { currentUser = null; localStorage.removeItem('dtl_user'); updateAuthUI(); showToast('Logged out'); });

  document.getElementById('submitReviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value;
    const city = document.getElementById('revCity').value;
    const comment = document.getElementById('revComment').value;
    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ Type: 'REVIEW', Customer_Name: name, City: city, Review_Text: comment }) }).catch(() => {});
    const grid = document.getElementById('reviewsGrid');
    if (grid) {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `<div class="review-top"><div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div><span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span></div><p class="review-text">"${comment}"</p><div class="reviewer-meta"><div class="reviewer-initial">${name.charAt(0).toUpperCase()}</div><div class="reviewer-info"><strong>${name}</strong><small>${city}</small></div><i class="fa-solid fa-quote-right quote-decor-gold"></i></div>`;
      grid.prepend(card);
    }
    document.getElementById('submitReviewForm').reset();
    showToast('Shukriya! Your review has been submitted.');
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', closeCheckoutModal);

  document.getElementById('claimDealBtn')?.addEventListener('click', () => {
    const existing = cart.find(i => i.id === 'deal-ghee-saffron');
    if (existing) { existing.qty += 1; } else { cart.push({ id: 'deal-ghee-saffron', name: 'DESI GHEE (500g) + KASHMIRI SAFFRON COMBO', price: 2750, qty: 1, image: 'assets/images/deal_banner.jpg' }); }
    saveCart(); updateCartUI();
    showToast('Mega Deal added to cart!');
    openCartDrawer();
  });

  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const city = document.getElementById('custCity').value;
    const address = document.getElementById('custAddress').value;
    const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
    const grandTotal = subtotal + shipping;
    const itemsSummary = cart.map(i => `${i.name} (${i.qty}x) = Rs.${i.price * i.qty}`).join(', ');
    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ _subject: `New Order ${refId} - DESI TASTE LAND`, Order_Reference: refId, Customer_Name: name, Customer_Phone: phone, Customer_City: city, Shipping_Address: address, Items_Ordered: itemsSummary, Total_Amount_PKR: grandTotal }) }).catch(() => {});
    const newOrder = { id: refId, timestamp: Date.now(), name, phone, address: `${address}, ${city}`, items: [...cart], total: grandTotal, status: 'Processing' };
    myOrders.unshift(newOrder);
    localStorage.setItem('dtl_orders', JSON.stringify(myOrders));
    document.getElementById('orderRefId').textContent = refId;
    closeCheckoutModal();
    cart = []; saveCart(); updateCartUI();
    document.getElementById('orderSuccessModal')?.classList.add('active');
  });

  document.getElementById('closeSuccessBtn')?.addEventListener('click', () => document.getElementById('orderSuccessModal')?.classList.remove('active'));
}

// 15. TOAST
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}