/* ==========================================================================
   DESI TASTE LAND - High Interactivity JavaScript Application Logic
   ========================================================================== */

// 1. PRODUCTS DATABASE
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Organic Sidr Honey',
    urdu: 'خالص سدر شہد (بیری کا شہد)',
    category: 'honey-spices',
    price: 2450,
    oldPrice: 3200,
    unit: '500 grams jar',
    rating: 5.0,
    reviewsCount: 342,
    badge: 'Bestseller',
    badgeClass: 'badge-gold',
    image: 'assets/images/sidr_honey.jpg',
    isTopSelling: true,
    description: '100% pure, unpasteurized, cold-extracted Sidr honey collected directly from Karak & Wild Sidr forests. Renowned for its rich caramel texture and immune-boosting properties.',
    benefits: [
      'Zero sugar adulteration guarantee',
      'Rich in antioxidants & natural enzymes',
      'Natural remedy for cough, throat & immunity'
    ]
  },
  {
    id: 'p2',
    name: 'Pure Desi Ghee',
    urdu: 'لکڑی کا کوہلو خالص دیسی گھی',
    category: 'ghee-oils',
    price: 3200,
    oldPrice: 3800,
    unit: '1 kg glass jar',
    rating: 4.9,
    reviewsCount: 518,
    badge: '100% Pure',
    badgeClass: '',
    image: 'assets/images/desi_ghee.jpg',
    isTopSelling: true,
    description: 'Prepared using traditional Bilona method from grass-fed cow milk. Golden granular texture, rich traditional aroma, and chemical-free preparation.',
    benefits: [
      'Traditional hand-churned Bilona method',
      'High smoke point perfect for cooking & sweets',
      'Rich in Vitamin A, D, E & healthy fatty acids'
    ]
  },
  {
    id: 'p3',
    name: 'Royal Kashmiri Saffron',
    urdu: 'شاہی کشمیری زعفران',
    category: 'honey-spices',
    price: 1850,
    oldPrice: 2400,
    unit: '1 gram luxury crystal vial',
    rating: 5.0,
    reviewsCount: 189,
    badge: 'Royal Grade',
    badgeClass: 'badge-gold',
    image: 'assets/images/kashmiri_saffron.jpg',
    isTopSelling: true,
    description: 'Authentic Mongra grade Kashmiri Saffron with deep crimson threads, hand-harvested from Pampore Kashmir fields. Unmatched aroma and golden dye potency.',
    benefits: [
      'Grade-1 Mongra full-crimson threads',
      'Boosts mood, skin radiance & memory',
      'Perfect for milk, kehwa & royal dishes'
    ]
  },
  {
    id: 'p4',
    name: 'Cold-Pressed Mustard Oil',
    urdu: 'کچی گھانی سرسوں کا تیل',
    category: 'ghee-oils',
    price: 1250,
    oldPrice: 1600,
    unit: '1 Litre bottle',
    rating: 4.8,
    reviewsCount: 210,
    badge: 'Wood-Pressed',
    badgeClass: '',
    image: 'assets/images/mustard_oil.jpg',
    isTopSelling: true,
    description: 'Cold wood-pressed mustard oil extracted at low temperature to retain natural pungency, Omega-3 fatty acids, and essential vitamins.',
    benefits: [
      'Unrefined & chemical-free extraction',
      'Promotes heart health & hair nourishment',
      'Authentic pungent Desi aroma'
    ]
  },
  {
    id: 'p5',
    name: 'Handcrafted Mixed Pickle',
    urdu: 'گھر کا بنا لذیذ مکس اچار',
    category: 'wellness',
    price: 850,
    oldPrice: 1100,
    unit: '1 kg traditional glass jar',
    rating: 4.9,
    reviewsCount: 145,
    badge: 'Homemade Taste',
    badgeClass: '',
    image: 'assets/images/mixed_pickle.jpg',
    isTopSelling: false,
    description: 'Prepared with fresh green mangoes, lemons, green chilies, and pure mustard oil infused with authentic heirloom spices.',
    benefits: [
      'No synthetic vinegar or chemical preservatives',
      'Slow sun-cured traditional recipe',
      'Mouth-watering tangy & spicy flavor'
    ]
  },
  {
    id: 'p6',
    name: 'Organic Turmeric Powder',
    urdu: 'خالص آرگینک ہلدی پاؤڈر',
    category: 'honey-spices',
    price: 650,
    oldPrice: 850,
    unit: '250 grams pack',
    rating: 4.9,
    reviewsCount: 290,
    badge: 'High Curcumin',
    badgeClass: '',
    image: 'assets/images/hero.jpg',
    isTopSelling: false,
    description: 'Pure whole turmeric roots ground fresh without starch or artificial color. High natural Curcumin content for healing.',
    benefits: [
      'High active Curcumin content',
      'Powerful natural anti-inflammatory',
      'Vibrant golden color & earthy aroma'
    ]
  }
];

// 2. STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('dtl_cart')) || [];

// 3. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  renderTopSellingProducts();
  renderAllNaturalProducts('all');
  updateCartUI();
  initCountdownTimer();
  initEventListeners();
});

// 4. RENDER FUNCTIONS
function renderTopSellingProducts() {
  const container = document.getElementById('topSellingGrid');
  if (!container) return;

  const topProducts = PRODUCTS.filter(p => p.isTopSelling);
  container.innerHTML = topProducts.map(product => createProductCardHTML(product)).join('');
}

function renderAllNaturalProducts(category) {
  const container = document.getElementById('allNaturalGrid');
  if (!container) return;

  const filtered = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(product => createProductCardHTML(product)).join('');
}

function createProductCardHTML(product) {
  return `
    <div class="product-card">
      <span class="product-badge ${product.badgeClass}">${product.badge}</span>
      
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="btn btn-glass btn-sm quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
          <i class="fa-solid fa-eye text-gold"></i> Quick View
        </button>
      </div>

      <div class="product-content">
        <span class="product-category">${product.unit}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-urdu">${product.urdu}</div>

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

        <div class="price-row">
          <span class="price-current">Rs. ${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `<span class="price-old">Rs. ${product.oldPrice.toLocaleString()}</span>` : ''}
        </div>

        <div class="card-actions">
          <button class="btn btn-gold btn-block" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add To Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// 5. CART OPERATIONS
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-gold"></i> Added <strong>${product.name}</strong> to your cart!`);
  openCartDrawer();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
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
  const freeShippingThreshold = 3000;

  // Badges & Counters
  document.getElementById('cartCountBadge').textContent = totalItems;
  document.getElementById('cartCountTitle').textContent = totalItems;

  // Subtotal & Grand Total
  const deliveryCharge = (subtotal >= freeShippingThreshold || subtotal === 0) ? 0 : 250;
  const grandTotal = subtotal + deliveryCharge;

  document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('deliveryChargeText').textContent = deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`;
  document.getElementById('cartGrandTotal').textContent = `Rs. ${grandTotal.toLocaleString()}`;

  // Free shipping progress
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const fillBar = document.getElementById('shippingProgressFill');
  const textBar = document.getElementById('shippingText');

  if (fillBar) fillBar.style.width = `${progressPercent}%`;
  if (textBar) {
    if (subtotal >= freeShippingThreshold) {
      textBar.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-crown text-gold"></i> Congratulations! You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      const needed = freeShippingThreshold - subtotal;
      textBar.innerHTML = `Add <strong>Rs. ${needed.toLocaleString()}</strong> more to get <strong>FREE Delivery</strong>!`;
    }
  }

  // Cart items HTML
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--border-gold); margin-bottom: 16px;"></i>
        <p>Your shopping cart is empty.</p>
        <a href="#topSelling" onclick="closeCartDrawer()" class="btn btn-gold-outline btn-sm" style="margin-top: 16px;">Explore Products</a>
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

// 6. MODALS & DRAWER LISTENERS
function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('quickViewContent');
  if (!content) return;

  content.innerHTML = `
    <div class="qv-img-box">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="qv-info">
      <span class="product-badge ${product.badgeClass}">${product.badge}</span>
      <h2>${product.name}</h2>
      <div class="qv-urdu">${product.urdu}</div>
      <p class="qv-desc">${product.description}</p>

      <ul class="qv-benefits">
        ${product.benefits.map(b => `<li><i class="fa-solid fa-circle-check text-gold"></i> ${b}</li>`).join('')}
      </ul>

      <div class="price-row" style="margin-bottom: 24px;">
        <span class="price-current" style="font-size: 1.8rem;">Rs. ${product.price.toLocaleString()}</span>
        ${product.oldPrice ? `<span class="price-old" style="font-size: 1.1rem;">Rs. ${product.oldPrice.toLocaleString()}</span>` : ''}
      </div>

      <button class="btn btn-gold btn-lg btn-block shadow-gold" onclick="addToCart('${product.id}'); closeQuickView();">
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
  const shipping = subtotal >= 3000 ? 0 : 250;
  const finalTotal = subtotal + shipping;

  document.getElementById('checkoutItemsTotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('checkoutShippingFee').textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping}`;
  document.getElementById('checkoutFinalTotal').textContent = `Rs. ${finalTotal.toLocaleString()}`;

  document.getElementById('checkoutModal')?.classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.remove('active');
}

// 7. EVENT LISTENERS SETUP
function initEventListeners() {
  // Mobile Nav Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  mobileBtn?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    mobileOverlay?.classList.toggle('active');
  });

  mobileOverlay?.addEventListener('click', () => {
    navMenu?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
  });

  // Header scroll sticky effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Cart Toggles
  document.getElementById('cartToggleBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);

  // Quick View Close
  document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeQuickView);

  // Category Tabs Filter
  const tabs = document.querySelectorAll('.filter-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-category');
      renderAllNaturalProducts(cat);
    });
  });

  // Checkout Triggers
  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', closeCheckoutModal);

  // Special Deal Claim Button
  document.getElementById('claimDealBtn')?.addEventListener('click', () => {
    // Add special deal items to cart
    const dealItem = {
      id: 'deal-royal-combo',
      name: 'ROYAL DESI HEALTH & TASTE COMBO',
      urdu: 'شاہی دیسی ہیلتھ اینڈ ٹیسٹ کمبو',
      price: 5999,
      qty: 1,
      image: 'assets/images/hero.jpg'
    };

    const existing = cart.find(i => i.id === dealItem.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(dealItem);
    }
    saveCart();
    updateCartUI();
    showToast('<i class="fa-solid fa-crown text-gold"></i> Special Mega Deal added to your cart!');
    openCartDrawer();
  });

  // Checkout Form Submission
  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);

    document.getElementById('orderRefId').textContent = refId;
    closeCheckoutModal();

    // Clear Cart
    cart = [];
    saveCart();
    updateCartUI();

    // Open Success Modal
    document.getElementById('orderSuccessModal')?.classList.add('active');
  });

  document.getElementById('closeSuccessBtn')?.addEventListener('click', () => {
    document.getElementById('orderSuccessModal')?.classList.remove('active');
  });
}

// 8. COUNTDOWN TIMER LOGIC
function initCountdownTimer() {
  let hours = 8;
  let mins = 42;
  let secs = 19;

  setInterval(() => {
    if (secs > 0) {
      secs--;
    } else {
      secs = 59;
      if (mins > 0) {
        mins--;
      } else {
        mins = 59;
        if (hours > 0) {
          hours--;
        } else {
          hours = 12; // Reset cycle
        }
      }
    }

    const hElem = document.getElementById('hoursVal');
    const mElem = document.getElementById('minsVal');
    const sElem = document.getElementById('secsVal');

    if (hElem) hElem.textContent = String(hours).padStart(2, '0');
    if (mElem) mElem.textContent = String(mins).padStart(2, '0');
    if (sElem) sElem.textContent = String(secs).padStart(2, '0');
  }, 1000);
}

// 9. TOAST NOTIFICATIONS
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
