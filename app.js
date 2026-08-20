/* ==========================================================================
   DESI TASTE LAND - Master JavaScript Application Logic
   ========================================================================== */

// 1. TOP SELLING PRODUCTS DATABASE (3 Items Only - NO BADGES & NO PRICES DISPLAYED)
const TOP_SELLING_PRODUCTS = [
  {
    id: 'top-1',
    name: 'PURE HONEY',
    urdu: 'خالص سدر بیری کا شہد',
    unit: '500g Luxury Jar',
    rating: 5.0,
    reviewsCount: 450,
    price: 1800,
    image: 'assets/images/all_honey.jpg',
    description: '100% pure, unpasteurized, cold-extracted Sidr honey collected directly from wild Sidr flower blossoms. Boosts immunity and natural vitality.',
    benefits: [
      'Zero sugar adulteration guarantee',
      'Rich in natural enzymes & minerals',
      'Natural remedy for cough & digestive health'
    ]
  },
  {
    id: 'top-2',
    name: 'DESI GHEE',
    urdu: 'خالص کوہلو دیسی گھی',
    unit: '1000g Glass Jar',
    rating: 5.0,
    reviewsCount: 620,
    price: 3200,
    image: 'assets/images/all_ghee.jpg',
    description: 'Prepared using traditional Bilona method from grass-fed cow milk. Golden granular texture and authentic traditional aroma.',
    benefits: [
      'Traditional hand-churned Bilona method',
      'Rich in Vitamin A, D, E & Healthy Fatty Acids',
      'Chemical-free & zero preservatives'
    ]
  },
  {
    id: 'top-3',
    name: 'OLIVE OIL',
    urdu: 'خالص کولڈ پریسڈ زیتون کا تیل',
    unit: '1000ml Glass Bottle',
    rating: 5.0,
    reviewsCount: 310,
    price: 4800,
    image: 'assets/images/all_olive_oil.jpg',
    description: 'Cold-pressed extra virgin olive oil packed with natural anti-oxidants and healthy fats. Perfect for cooking, salad dressing, and daily wellness.',
    benefits: [
      'First cold press, zero chemical additives',
      'Rich in heart-healthy Omega-9 & polyphenols',
      'Ideal for healthy cooking & glowing skin'
    ]
  }
];

// 2. ALL PRODUCTS DATABASE (5 Items with Prices & Full Details)
const ALL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'PURE HONEY',
    urdu: 'خالص آرگینک شہد',
    category: 'honey-spices',
    price: 1800,
    unit: '500g Glass Jar',
    rating: 5.0,
    reviewsCount: 420,
    badge: '100% Pure',
    badgeClass: 'badge-red',
    image: 'assets/images/all_honey.jpg',
    description: '100% raw and pure Sidr honey collected directly from natural flower blossoms.',
    benefits: ['100% Raw & Unprocessed', 'Zero Sugar Adulteration Guarantee']
  },
  {
    id: 'prod-2',
    name: 'TEA',
    urdu: 'پریمیم چائے پتی',
    category: 'honey-spices',
    price: 400,
    unit: '200g Pack',
    rating: 4.9,
    reviewsCount: 380,
    badge: 'Rich Aroma',
    badgeClass: '',
    image: 'assets/images/all_tea.jpg',
    description: 'Selected top tea leaves for a rich aroma, strong color, and refreshing taste.',
    benefits: ['Strong Rich Color', 'Natural Aroma']
  },
  {
    id: 'prod-3',
    name: 'OLIVE OIL',
    urdu: 'خالص زیتون کا تیل',
    category: 'ghee-oils',
    price: 4800,
    unit: '1000ml Glass Bottle',
    rating: 5.0,
    reviewsCount: 290,
    badge: 'Cold Pressed',
    badgeClass: 'badge-red',
    image: 'assets/images/all_olive_oil.jpg',
    description: 'Cold-pressed extra virgin olive oil packed with healthy nutrients.',
    benefits: ['First Cold Press', 'Heart Healthy']
  },
  {
    id: 'prod-4',
    name: 'DESI GHEE',
    urdu: 'کوہلو دیسی گھی',
    category: 'ghee-oils',
    price: 3200,
    unit: '1000g Glass Jar',
    rating: 5.0,
    reviewsCount: 610,
    badge: 'Bilona Ghee',
    badgeClass: 'badge-red',
    image: 'assets/images/all_ghee.jpg',
    description: 'Traditional Bilona Desi Ghee prepared from pure grass-fed cow milk.',
    benefits: ['Hand-Churned Bilona', 'Rich Aroma']
  },
  {
    id: 'prod-5',
    name: 'IMLI CHUTNEY',
    urdu: 'لذیذ املی چٹنی',
    category: 'wellness',
    price: 800,
    unit: '500g Glass Jar',
    rating: 4.9,
    reviewsCount: 310,
    badge: 'Homemade Taste',
    badgeClass: '',
    image: 'assets/images/all_imli_chutney.jpg',
    description: 'Handcrafted authentic tangy and sweet Imli Chutney prepared with natural spices.',
    benefits: ['Handmade Recipe', 'No Synthetic Color']
  }
];

// 3. STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('dtl_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('dtl_user')) || null;
let currentSlideIndex = 0;
let slideInterval;

// 4. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  renderTopSellingProducts();
  renderAllProducts('all');
  updateCartUI();
  updateAuthUI();
  initHeroTouchSlider();
  initScrollRevealObserver();
  initCountdownTimer();
  initEventListeners();
});

// 5. HERO SLIDER LOGIC (Touch Swipe + 3s Auto-Slide + Golden Progress Line Bar)
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

    if (Math.abs(diffX) > 40) {
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

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) nextSlide();
      else prevSlide();
      resetSlideTimer();
    }
  });

  // Dots navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      showSlide(idx);
      resetSlideTimer();
    });
  });

  // Auto Slide Every 3 Seconds
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

// 6. SCROLL REVEAL ANIMATIONS
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

// 7. RENDER TOP SELLING PRODUCTS (3 Items Only - NO BADGES & NO PRICES)
function renderTopSellingProducts() {
  const container = document.getElementById('topSellingGrid');
  if (!container) return;

  container.innerHTML = TOP_SELLING_PRODUCTS.map(product => `
    <div class="product-card">
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="btn btn-glass btn-sm quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
          <i class="fa-solid fa-eye text-red"></i> Quick View
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

        <div class="card-actions">
          <button class="btn btn-red btn-block" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add To Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// 8. RENDER ALL PRODUCTS (5 Items with Prices)
function renderAllProducts(category) {
  const container = document.getElementById('allNaturalGrid');
  if (!container) return;

  const filtered = category === 'all' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      <span class="product-badge ${product.badgeClass}">${product.badge}</span>
      
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="btn btn-glass btn-sm quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
          <i class="fa-solid fa-eye text-red"></i> Quick View
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
        </div>

        <div class="card-actions">
          <button class="btn btn-red btn-block" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add To Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// 9. CART OPERATIONS
function addToCart(productId) {
  let product = TOP_SELLING_PRODUCTS.find(p => p.id === productId) || ALL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> Added <strong>${product.name}</strong> to cart!`);
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
      textBar.innerHTML = `<span class="text-forest"><i class="fa-solid fa-crown text-red"></i> Congratulations! You unlocked <strong>FREE Delivery</strong>!</span>`;
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
        <a href="#topSelling" onclick="closeCartDrawer()" class="btn btn-red-outline btn-sm" style="margin-top: 16px;">Explore Products</a>
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

// 10. AUTH & USER LOGIN STATE LOGIC
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

// 11. MODALS & DRAWER LISTENERS
function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function openQuickView(productId) {
  let product = TOP_SELLING_PRODUCTS.find(p => p.id === productId) || ALL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('quickViewContent');
  if (!content) return;

  content.innerHTML = `
    <div class="qv-img-box">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="qv-info">
      <h2>${product.name}</h2>
      <div class="qv-urdu">${product.urdu}</div>
      <p class="qv-desc">${product.description}</p>

      <ul class="qv-benefits">
        ${product.benefits.map(b => `<li><i class="fa-solid fa-circle-check text-red"></i> ${b}</li>`).join('')}
      </ul>

      <div class="price-row" style="margin-bottom: 20px;">
        <span class="price-current" style="font-size: 1.6rem;">Rs. ${product.price.toLocaleString()}</span>
      </div>

      <button class="btn btn-red btn-lg btn-block shadow-red" onclick="addToCart('${product.id}'); closeQuickView();">
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

  // Build hidden email order summary
  const itemsText = cart.map(i => `${i.name} (${i.qty}x) = Rs. ${i.price * i.qty}`).join('\n');
  const fullSummary = `ITEMS:\n${itemsText}\n\nSubtotal: Rs. ${subtotal}\nShipping: Rs. ${shipping}\nGrand Total: Rs. ${finalTotal}`;
  document.getElementById('emailOrderSummary').value = fullSummary;

  document.getElementById('checkoutModal')?.classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.remove('active');
}

// 12. EVENT LISTENERS SETUP
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

  // User Account Scroll / Modal Trigger
  document.getElementById('userAccountBtn')?.addEventListener('click', () => {
    const authSection = document.getElementById('authSection');
    if (authSection) authSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Quick View Close
  document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeQuickView);

  // Category Tabs Filter
  const tabs = document.querySelectorAll('.filter-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-category');
      renderAllProducts(cat);
    });
  });

  // Auth Tab Buttons Switch
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTabBtn?.addEventListener('click', () => {
    loginTabBtn.classList.add('active');
    signupTabBtn?.classList.remove('active');
    loginForm?.classList.add('active');
    signupForm?.classList.remove('active');
  });

  signupTabBtn?.addEventListener('click', () => {
    signupTabBtn.classList.add('active');
    loginTabBtn?.classList.remove('active');
    signupForm?.classList.add('active');
    loginForm?.classList.remove('active');
  });

  // Login Form Submit
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    currentUser = { name: email.split('@')[0], email: email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('<i class="fa-solid fa-circle-check text-red"></i> Welcome back to Desi Taste Land!');
  });

  // Sign Up Form Submit
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

  // Checkout Triggers
  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', closeCheckoutModal);

  // Special Deal Claim Button
  document.getElementById('claimDealBtn')?.addEventListener('click', () => {
    const dealItem = {
      id: 'deal-eid-offer',
      name: 'BARI EID GHEE & SAFFRON OFFER',
      urdu: 'بڑی عید خصوص پیشکش',
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
    showToast('<i class="fa-solid fa-crown text-red"></i> Bari Eid Deal added to your cart!');
    openCartDrawer();
  });

  // Checkout Form Submission (Posts to FormSubmit zaibbabar54@gmail.com & Opens WhatsApp)
  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const city = document.getElementById('custCity').value;
    const address = document.getElementById('custAddress').value;
    const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= 3000 ? 0 : 250;
    const grandTotal = subtotal + shipping;

    const itemsSummary = cart.map(i => `*${i.name}* x${i.qty} = Rs. ${i.price * i.qty}`).join('%0A');
    const waText = `*NEW ORDER RECEIVED (${refId})*%0A%0A*Customer Name:* ${name}%0A*Phone:* ${phone}%0A*City:* ${city}%0A*Address:* ${address}%0A%0A*ITEMS ORDERED:*%0A${itemsSummary}%0A%0A*Total Amount:* Rs. ${grandTotal} (COD)`;

    // Open WhatsApp order notification directly to store number +923070016113
    window.open(`https://wa.me/923070016113?text=${waText}`, '_blank');

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

// 13. COUNTDOWN TIMER LOGIC
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
          hours = 12;
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

// 14. TOAST NOTIFICATIONS
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
