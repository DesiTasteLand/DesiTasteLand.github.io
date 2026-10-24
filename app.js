/* ==========================================================================
   DESI TASTE LAND - Master Application JavaScript
   ========================================================================== */

const FREE_SHIPPING_THRESHOLD = 5000;

// 1. HONEY CATEGORIES (4 Varieties - Exact Prices)
const HONEY_CATEGORIES = [
  {
    id: 'honey-wild-big',
    name: 'WILD HONEY BIG BEE',
    urduName: 'جنگلی شہد (بڑی مکھی)',
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
    urduName: 'جنگلی شہد (چھوٹی مکھی)',
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
    urduName: 'فارمی شہد (بڑی مکھی)',
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
    urduName: 'فارمی شہد (چھوٹی مکھی)',
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
    urduName: 'خالص شہد',
    isHoney: true,
    image: 'assets/images/prod_honey_new.png',
    rating: 5.0,
    reviewsCount: 450
  },
  {
    id: 'top-ghee',
    name: 'DESI GHEE',
    urduName: 'دیسی گھی',
    image: 'assets/images/prod_ghee_new.jpg',
    rating: 5.0,
    reviewsCount: 620,
    defaultVariant: { weight: '500g', price: 1600 }
  },
  {
    id: 'top-olive',
    name: 'OLIVE OIL',
    urduName: 'زیتون کا تیل',
    image: 'assets/images/prod_olive_new.png',
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
    urduName: 'خالص شہد',
    isHoney: true,
    rating: 5.0,
    reviewsCount: 480,
    image: 'assets/images/prod_honey_new.png',
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
    name: 'COW DESI GHEE',
    urduName: 'گائے کا دیسی گھی',
    rating: 5.0,
    reviewsCount: 610,
    image: 'assets/images/prod_ghee_new.jpg',
    description: 'Traditional Bilona Cow Desi Ghee prepared from pure grass-fed cow milk.',
    variants: [
      { weight: '500g', price: 1600 },
      { weight: '1000g', price: 3200, isDefault: true }
    ],
    selectedWeightIndex: 1,
    benefits: ['Hand-Churned Bilona', 'Rich Aroma & Granular Texture']
  },
  {
    id: 'prod-buffalo-ghee',
    name: 'BUFFALO DESI GHEE',
    urduName: 'بھینس کا دیسی گھی',
    rating: 5.0,
    reviewsCount: 320,
    image: 'assets/images/prod_buffalo_ghee.jpg',
    description: '100% pure authentic traditional Bilona Buffalo Desi Ghee with rich natural aroma and granular texture.',
    variants: [
      { weight: '500g', price: 1800, isDefault: true },
      { weight: '1000g', price: 3500 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Hand-Churned Bilona', 'Rich Aroma & Granular Texture']
  },
  {
    id: 'prod-imli',
    name: 'IMLI CHUTNEY',
    urduName: 'املی آلو بخارا چٹنی',
    rating: 4.9,
    reviewsCount: 310,
    image: 'assets/images/prod_imli_new.jpg',
    description: 'Handcrafted authentic tangy and sweet Imli Chutney prepared with traditional natural spices.',
    variants: [
      { weight: '500g', price: 700, isDefault: true },
      { weight: '1000g', price: 1400 }
    ],
    selectedWeightIndex: 0,
    benefits: ['Handmade Recipe', 'No Synthetic Colors']
  },
  {
    id: 'prod-talbina',
    name: 'TALBINA',
    urduName: 'تلبینہ',
    rating: 4.9,
    reviewsCount: 340,
    image: 'assets/images/prod_talbina_new.jpg',
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
    urduName: 'زیتون کا تیل',
    rating: 5.0,
    reviewsCount: 290,
    image: 'assets/images/prod_olive_new.png',
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
    urduName: 'سلاجیت',
    rating: 5.0,
    reviewsCount: 190,
    image: 'assets/images/prod_shilajit_new.png',
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
    urduName: 'مکس اچار',
    rating: 4.9,
    reviewsCount: 280,
    image: 'assets/images/prod_mix_pickle_new.jpg',
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
    urduName: 'چائے کی پتی',
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
  },
  {
    id: 'prod-saffron',
    name: 'SAFFRON',
    urduName: 'زعفران',
    rating: 5.0,
    reviewsCount: 240,
    image: 'assets/images/prod_saffron_new.jpg',
    description: '100% pure royal Kashmiri Mongra Saffron with rich aroma, deep vibrant color and health benefits.',
    variants: [
      { weight: '1g', price: 1200, isDefault: true },
      { weight: '2g', price: 2400 },
      { weight: '3g', price: 3600 }
    ],
    selectedWeightIndex: 0,
    benefits: ['100% Pure Mongra Saffron', 'Rich Aroma & Natural Health Booster']
  }
];

// 4. STATE
let cart = JSON.parse(localStorage.getItem('dtl_cart')) || [];
let myOrders = JSON.parse(localStorage.getItem('dtl_orders')) || [];
let favorites = JSON.parse(localStorage.getItem('dtl_favorites')) || [];
let currentUser = JSON.parse(localStorage.getItem('dtl_user')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('dtl_registered_users')) || [];
let currentSlideIndex = 0;
let slideInterval;

// 4b. VALIDATION HELPERS
function isValidPakistaniPhone(phone) {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s\-\(\)]/g, '');
  return /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(clean);
}

function normalizePhone(phone) {
  if (!phone) return '';
  let clean = String(phone).replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+92')) clean = '0' + clean.slice(3);
  else if (clean.startsWith('0092')) clean = '0' + clean.slice(4);
  else if (clean.startsWith('92') && clean.length === 12) clean = '0' + clean.slice(2);
  else if (clean.startsWith('3') && clean.length === 10) clean = '0' + clean;
  return clean;
}

function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

// 4c. ASSET PATH RESOLVER (Fixes image paths on subfolder routes like /honeycollection/)
function resolveImagePath(imgSrc) {
  if (!imgSrc) return '';
  if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('data:')) return imgSrc;
  const cleanPath = imgSrc.replace(/^\.\.\//, '').replace(/^\.\//, '');
  const pathname = window.location.pathname || '';
  const isSubfolder = pathname.includes('/honeycollection') || 
                      pathname.includes('/product') || 
                      pathname.includes('/deal') || 
                      pathname.includes('/admin');
  return isSubfolder ? `../${cleanPath}` : cleanPath;
}

// 5. INIT
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeSplash();
  initNavbarScrollBehavior();
  initScrollUrlSpy();
  syncStoreDataFromCloud();
  renderTopSellingProducts();
  renderAllProducts();
  renderDedicatedHoneyPage();
  updateCartUI();
  updateFavoritesUI();
  updateAuthUI();
  renderOrdersDrawer();
  initHeroTouchSlider();
  initScrollRevealObserver();
  initEventListeners();
  initProductDetailPage();
});

// 5b. WELCOME SPLASH SCREEN (Shows only once per visit)
function initWelcomeSplash() {
  const splash = document.getElementById('welcomeSplash');
  if (!splash) return;

  if (sessionStorage.getItem('welcomeSplashShown')) {
    if (splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
    document.body.style.overflow = '';
    return;
  }

  sessionStorage.setItem('welcomeSplashShown', 'true');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    splash.classList.add('splash-hide');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (splash && splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 900);
  }, 3000);
}

// 5c. NAVBAR HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
function initNavbarScrollBehavior() {
  const header = document.getElementById('mainHeader');
  if (!header) return;
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY <= 60) {
          // At or near the top: always show navbar
          header.classList.remove('header-hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down: hide navbar
          header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up: show navbar
          header.classList.remove('header-hidden');
        }

        lastScrollY = Math.max(0, currentScrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 5d. DYNAMIC SCROLL URL SPY (Updates URL as user scrolls through sections)
function initScrollUrlSpy() {
  if (document.getElementById('honeyPageGrid')) return;

  const sections = [
    { id: 'hero', path: '/' },
    { id: 'topSelling', path: '/topselling' },
    { id: 'allProductsSection', path: '/allproduct' },
    { id: 'specialDeal', path: '/deal' },
    { id: 'aboutSection', path: '/about' },
    { id: 'reviewsSection', path: '/reviews' },
    { id: 'contactSection', path: '/contact' }
  ];

  let currentActivePath = window.location.pathname || '/';
  let isTicking = false;

  function onScrollSpy() {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(() => {
      isTicking = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const viewportMid = scrollY + (window.innerHeight * 0.35);

      let activeSection = sections[0];

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMid >= top && viewportMid < (top + height)) {
            activeSection = sections[i];
            break;
          } else if (viewportMid >= top) {
            activeSection = sections[i];
          }
        }
      }

      if (scrollY <= 90) {
        activeSection = sections[0];
      }

      if (currentActivePath !== activeSection.path) {
        currentActivePath = activeSection.path;
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', activeSection.path);
        }
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  }
}

// 5d. SCROLL TO PRODUCT (Used by Hero Slider Banners)
function scrollToProduct(productId) {
  if (productId === 'prod-honey') {
    window.location.href = 'honey.html';
    return;
  }
  const card = document.getElementById(`allcard-${productId}`);
  if (card) {
    const parentSection = card.closest('.reveal-section');
    if (parentSection) {
      parentSection.classList.add('visible');
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('highlight-pulse');
    void card.offsetWidth; // Trigger DOM reflow to restart CSS animation
    card.classList.add('highlight-pulse');
    setTimeout(() => card.classList.remove('highlight-pulse'), 2500);
  } else {
    document.getElementById('allProductsSection')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// 6. HERO SLIDER (With gesture detection & precise product routing)
function initHeroTouchSlider() {
  const sliderContainer = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progressFill = document.getElementById('goldenProgressFill');
  if (!sliderContainer || slides.length === 0) return;

  let startX = 0, currentX = 0, isDragging = false, hasSwiped = false;

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

  sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    hasSwiped = false;
    startX = e.touches[0].clientX;
    currentX = startX;
  }, { passive: true });

  sliderContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    if (Math.abs(startX - currentX) > 10) {
      hasSwiped = true;
    }
  }, { passive: true });

  sliderContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (hasSwiped && Math.abs(startX - currentX) > 35) {
      startX - currentX > 0 ? showSlide(currentSlideIndex + 1) : showSlide(currentSlideIndex - 1);
      resetSlideTimer();
    }
    setTimeout(() => { hasSwiped = false; }, 120);
  });

  sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasSwiped = false;
    startX = e.clientX;
    currentX = startX;
  });

  sliderContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    if (Math.abs(startX - currentX) > 10) {
      hasSwiped = true;
    }
  });

  sliderContainer.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (hasSwiped && Math.abs(startX - currentX) > 35) {
      startX - currentX > 0 ? showSlide(currentSlideIndex + 1) : showSlide(currentSlideIndex - 1);
      resetSlideTimer();
    }
    setTimeout(() => { hasSwiped = false; }, 120);
  });

  // Slide click routing
  slides.forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (hasSwiped) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const isHoney = slide.getAttribute('data-is-honey') === 'true';
      const prodId = slide.getAttribute('data-product');
      if (isHoney || prodId === 'prod-honey') {
        window.location.href = 'honeycollection/';
      } else if (prodId) {
        scrollToProduct(prodId);
      }
    });
  });

  dots.forEach(dot => dot.addEventListener('click', (e) => {
    showSlide(parseInt(e.target.getAttribute('data-index')));
    resetSlideTimer();
  }));

  function startSlideTimer() {
    resetProgressBar();
    slideInterval = setInterval(() => showSlide(currentSlideIndex + 1), 3000);
  }
  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }
  startSlideTimer();
}

// 7. SCROLL REVEAL (Reveals smoothly once without jitter or layout shifts)
function initScrollRevealObserver() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal-section').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
}

// Modal State for Product Variant & Quantity Selection
let currentModalProduct = null;
let modalSelectedVariantIndex = 0;
let modalQuantity = 1;

// 8. TOP SELLING - Only BUY NOW button
function renderTopSellingProducts() {
  const container = document.getElementById('topSellingGrid');
  if (!container) return;

  container.innerHTML = TOP_SELLING_PRODUCTS.map(product => {
    const targetProdId = product.id === 'top-ghee' ? 'prod-ghee' : product.id === 'top-olive' ? 'prod-olive' : product.id === 'top-honey' ? 'prod-honey' : product.id;
    return `
      <div class="product-card ts-card" id="card-${product.id}">
        <div class="product-img-box ts-img-box" style="position:relative;">
          <button class="card-view-btn" onclick="openProductQuickView('${targetProdId}')" title="Quick View Product Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          <img src="${resolveImagePath(product.image)}" alt="${product.name}" loading="lazy" style="cursor:pointer;" onclick="openProductQuickView('${targetProdId}')">
        </div>
        <div class="product-content ts-content">
          <h3 class="product-title">
            <span class="product-title-en">${product.name}</span>
            <span class="product-title-ur">${product.urduName || ''}</span>
          </h3>
          <div class="rating-row">
            <div class="stars">
              <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span>${product.rating} (${product.reviewsCount}+)</span>
          </div>
          <button class="btn btn-red buy-now-btn" onclick="${product.isHoney ? "window.location.href='honeycollection/'" : `openProductSelectionModal('${targetProdId}')`}">
            <i class="fa-solid fa-bag-shopping"></i> BUY NOW
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 8b. DYNAMIC STORE PRODUCTS (Merges Admin edits, custom products, and stock status)
function getLiveProducts() {
  const custom = JSON.parse(localStorage.getItem('dtl_custom_products') || '[]');
  const inventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');

  const products = ALL_PRODUCTS.map(orig => {
    const p = { ...orig, variants: orig.variants ? orig.variants.map(v => ({ ...v })) : [] };
    const edited = custom.find(c => c.id === p.id);
    if (edited) {
      if (edited.name) p.name = edited.name;
      if (edited.urduName) p.urduName = edited.urduName;
      if (edited.image) p.image = edited.image;
      if (edited.price && p.variants && p.variants.length > 0) {
        p.variants[0].price = edited.price;
      }
      if (edited.weight && p.variants && p.variants.length > 0) {
        p.variants[0].weight = edited.weight;
      }
      if (edited.stock) p.stock = edited.stock;
    }
    if (inventory[p.id] && inventory[p.id].stock === 0) {
      p.stock = 'out_of_stock';
    }
    return p;
  });

  // Append new custom products created from Admin
  custom.forEach(c => {
    if (!products.some(p => p.id === c.id)) {
      const invStock = inventory[c.id] ? inventory[c.id].stock : 50;
      products.push({
        id: c.id,
        name: c.name,
        urduName: c.urduName || '',
        image: c.image || 'assets/images/prod_honey_new.png',
        rating: 5.0,
        reviewsCount: 25,
        stock: (invStock === 0 || c.stock === 'out_of_stock') ? 'out_of_stock' : 'in_stock',
        variants: [{ weight: c.weight || '500g', price: c.price || 1000, isDefault: true }],
        selectedWeightIndex: 0
      });
    }
  });

  return products;
}

// Cloud Synchronization: Loads master store data on any device
async function syncStoreDataFromCloud() {
  try {
    const isSub = window.location.pathname.includes('/allproduct') || window.location.pathname.includes('/honeycollection') || window.location.pathname.includes('/topselling') || window.location.pathname.includes('/deal') || window.location.pathname.includes('/about') || window.location.pathname.includes('/contact') || window.location.pathname.includes('/reviews') || window.location.pathname.includes('/product');
    const path = isSub ? '../data/store_data.json?v=' + Date.now() : 'data/store_data.json?v=' + Date.now();
    const res = await fetch(path);
    if (!res.ok) return;
    const cloud = await res.json();
    if (!cloud || !cloud.lastUpdated) return;

    const localLast = parseInt(localStorage.getItem('dtl_last_cloud_sync') || '0', 10);
    const hasLocalProducts = localStorage.getItem('dtl_custom_products');

    if (!hasLocalProducts || cloud.lastUpdated > localLast) {
      if (cloud.products && Array.isArray(cloud.products)) {
        localStorage.setItem('dtl_custom_products', JSON.stringify(cloud.products));
      }
      if (cloud.inventory) {
        localStorage.setItem('dtl_inventory', JSON.stringify(cloud.inventory));
      }
      if (cloud.coupons) {
        localStorage.setItem('dtl_coupons', JSON.stringify(cloud.coupons));
      }
      if (cloud.reviews) {
        localStorage.setItem('dtl_reviews', JSON.stringify(cloud.reviews));
      }
      if (cloud.siteContent) {
        localStorage.setItem('dtl_site_content', JSON.stringify(cloud.siteContent));
      }
      if (cloud.settings) {
        localStorage.setItem('dtl_store_settings', JSON.stringify(cloud.settings));
      }
      localStorage.setItem('dtl_last_cloud_sync', cloud.lastUpdated.toString());

      // Re-render UI with new product data
      renderTopSellingProducts();
      renderAllProducts();
    }
  } catch(e) {}
}

// 9. ALL PRODUCTS - Top-left view icon, Cart icon next to BUY NOW (Synchronized with Admin)
function renderAllProducts() {
  const container = document.getElementById('allProductsGrid');
  if (!container) return;

  const liveList = getLiveProducts();
  let html = '';
  liveList.forEach((product) => {
    const activeVar = (product.variants && product.variants[product.selectedWeightIndex || 0]) || (product.variants && product.variants[0]) || { weight: '500g', price: 1000 };
    const isOut = product.stock === 'out_of_stock';
    const priceDisplay = (product.variants && product.variants.length > 1)
      ? `Rs. ${product.variants[0].price.toLocaleString()}`
      : `Rs. ${activeVar.price.toLocaleString()}`;

    html += `
      <div class="product-card" id="allcard-${product.id}">
        <div class="product-img-box" style="position:relative;">
          <button class="card-view-btn" onclick="openProductQuickView('${product.id}')" title="Quick View Product Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="fav-btn ${isFavorite(product.id) ? 'active' : ''}" onclick="toggleFavorite('${product.id}', event)" title="Add to Favorites">
            <i class="${isFavorite(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <img src="${resolveImagePath(product.image)}" alt="${product.name}" loading="lazy" id="allimg-${product.id}" style="cursor:pointer;" onclick="openProductQuickView('${product.id}')">
          ${isOut ? '<span style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:#D32F2F;color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;letter-spacing:0.5px;box-shadow:0 4px 10px rgba(0,0,0,0.5);">OUT OF STOCK</span>' : ''}
        </div>
        <div class="product-content">
          <h3 class="product-title" style="cursor:pointer;" onclick="openProductQuickView('${product.id}')">
            <span class="product-title-en">${product.name}</span>
            <span class="product-title-ur">${product.urduName || ''}</span>
          </h3>
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
            ${(product.variants && product.variants.length > 1) ? `<span style="font-size:0.78rem;color:var(--text-muted);font-weight:700;">(${product.variants.length} Sizes)</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn btn-cart-action" onclick="${isOut ? "showToast('Item is currently out of stock')" : (product.isHoney ? "window.location.href='honeycollection/'" : `addProductToCartDirect('${product.id}')`)}" title="${isOut ? 'Out of Stock' : 'Add to Cart'}" ${isOut ? 'style="opacity:0.5;cursor:not-allowed;"' : ''}>
              <i class="fa-solid fa-cart-shopping"></i>
            </button>
            <button class="btn btn-red buy-now-btn" onclick="${isOut ? "showToast('Item is currently out of stock')" : (product.isHoney ? "window.location.href='honeycollection/'" : `openProductSelectionModal('${product.id}')`)}" ${isOut ? 'style="opacity:0.5;cursor:not-allowed;"' : ''}>
              <i class="fa-solid fa-bag-shopping"></i> ${isOut ? 'OUT OF STOCK' : 'BUY NOW'}
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function addProductToCartDirect(productId) {
  let product = getLiveProducts().find(p => p.id === productId);
  if (!product) {
    product = HONEY_CATEGORIES.find(c => c.id === productId);
  }
  if (!product) return;

  if (product.isHoney) {
    window.location.href = 'honeycollection/';
    return;
  }

  const variantIndex = product.selectedWeightIndex !== undefined ? product.selectedWeightIndex : 0;
  const variant = (product.variants && product.variants[variantIndex]) || (product.variants && product.variants[0]);
  if (!variant) return;

  const itemId = `${product.id}-${variant.weight.replace(/\s+/g, '')}`;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: itemId,
      name: `${product.name} (${variant.weight})`,
      price: variant.price,
      image: product.image,
      qty: 1
    });
  }
  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-red"></i> <strong>${product.name} (${variant.weight})</strong> added to cart!`);
  openCartDrawer();
}

// 9b. DEDICATED HONEY PAGE (honey.html) - Strictly 4 varieties with heart icon
function renderDedicatedHoneyPage() {
  const container = document.getElementById('honeyPageGrid');
  if (!container) return;

  container.innerHTML = HONEY_CATEGORIES.map(category => {
    const activeVar = category.variants[category.selectedWeightIndex || 0];
    return `
      <div class="honey-page-card" id="hpcard-${category.id}">
        <span class="honey-page-badge">${category.tag}</span>
        <div class="honey-page-img-box">
          <button class="card-view-btn" onclick="openProductQuickView('${category.id}')" title="Quick View Product Details">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="fav-btn ${isFavorite(category.id) ? 'active' : ''}" onclick="toggleFavorite('${category.id}', event)" title="Add to Favorites">
            <i class="${isFavorite(category.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <a href="../product/?id=${category.id}" style="display:block;height:100%;text-decoration:none;">
            <img src="${resolveImagePath(category.image)}" alt="${category.name}" loading="lazy">
          </a>
        </div>
        <div class="honey-page-body">
          <h3 class="honey-page-title" style="cursor:pointer;" onclick="openProductQuickView('${category.id}')">
            <span class="product-title-en">${category.name}</span>
            <span class="product-title-ur">${category.urduName || ''}</span>
          </h3>
          <p class="honey-page-desc">${category.description}</p>
          <div class="weight-selector-box">
            <span class="weight-selector-label">Select Weight:</span>
            <div class="honey-weights-row">
              ${category.variants.map((v, idx) => `
                <button type="button" class="honey-w-btn ${idx === (category.selectedWeightIndex || 0) ? 'active' : ''}"
                        onclick="selectDedicatedHoneyWeight('${category.id}', ${idx})">
                  ${v.weight}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="honey-card-price-row">
            <span class="honey-price-val" id="hpprice-${category.id}">Rs. ${activeVar.price.toLocaleString()}</span>
            <span class="honey-unit-label">per ${activeVar.weight}</span>
          </div>
          <button class="btn btn-red btn-block buy-now-btn" onclick="openProductSelectionModal('${category.id}')">
            <i class="fa-solid fa-bag-shopping"></i> BUY NOW
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectDedicatedHoneyWeight(categoryId, weightIndex) {
  const category = HONEY_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;
  category.selectedWeightIndex = weightIndex;
  renderDedicatedHoneyPage();
}

// 9c. FAVORITES / WISHLIST MANAGEMENT
function isFavorite(productId) {
  return favorites.includes(productId);
}

function toggleFavorite(productId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const idx = favorites.indexOf(productId);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast('<i class="fa-regular fa-heart"></i> Removed from Favorites');
  } else {
    favorites.push(productId);
    showToast('<i class="fa-solid fa-heart text-red"></i> Added to Favorites!');
  }
  localStorage.setItem('dtl_favorites', JSON.stringify(favorites));
  updateFavoritesUI();
  renderTopSellingProducts();
  renderAllProducts();
  renderDedicatedHoneyPage();
}

function updateFavoritesUI() {
  const badge = document.getElementById('favCountBadge');
  const title = document.getElementById('wishlistCountTitle');
  if (badge) badge.textContent = favorites.length;
  if (title) title.textContent = favorites.length;
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding:40px 0;color:var(--text-muted);">
        <i class="fa-regular fa-heart" style="font-size:3rem;color:var(--border-gold);margin-bottom:16px;"></i>
        <p>Your favorites list is empty.</p>
        <button onclick="closeWishlistDrawer()" class="btn btn-red-outline btn-sm" style="margin-top:16px;">Explore Products</button>
      </div>
    `;
    return;
  }

  const allItems = [...ALL_PRODUCTS, ...HONEY_CATEGORIES, ...TOP_SELLING_PRODUCTS];
  const uniqueFavs = [...new Set(favorites)];

  container.innerHTML = uniqueFavs.map(id => {
    const item = allItems.find(p => p.id === id);
    if (!item) return '';
    const activeVar = item.variants ? item.variants[item.selectedWeightIndex || 0] : item.defaultVariant;
    const priceText = activeVar ? `Rs. ${activeVar.price.toLocaleString()}` : 'Rs. 1,000';
    const isHoney = item.isHoney;

    return `
      <div class="wishlist-item">
        <img src="${resolveImagePath(item.image)}" alt="${item.name}" class="wishlist-item-img">
        <div class="wishlist-item-info">
          <div>
            <h4 class="wishlist-item-title">${item.name}</h4>
            <div class="wishlist-item-price">${priceText}</div>
          </div>
          <div class="wishlist-item-actions">
            <button class="btn btn-red btn-sm wishlist-buy-btn" onclick="${isHoney ? "window.location.href='honeycollection/'" : `closeWishlistDrawer(); openProductSelectionModal('${item.id}')`}">
              <i class="fa-solid fa-bag-shopping"></i> BUY NOW
            </button>
            <button class="wishlist-remove-btn" onclick="toggleFavorite('${item.id}', event)" title="Remove">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openWishlistDrawer() {
  renderWishlistDrawer();
  document.getElementById('wishlistDrawer')?.classList.add('active');
  document.getElementById('wishlistOverlay')?.classList.add('active');
}

function closeWishlistDrawer() {
  document.getElementById('wishlistDrawer')?.classList.remove('active');
  document.getElementById('wishlistOverlay')?.classList.remove('active');
}

// 10. PRODUCT VARIANT & QUANTITY SELECTION MODAL
function openProductSelectionModal(productId) {
  let product = getLiveProducts().find(p => p.id === productId);
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
        <img src="${resolveImagePath(product.image)}" alt="${product.name}" class="prod-modal-img">
        <div class="prod-modal-info">
          ${product.tag ? `<span class="prod-modal-tag">${product.tag}</span>` : `<span class="prod-modal-tag">100% Pure & Authentic</span>`}
          <h3 class="prod-modal-title">
            <span class="product-title-en">${product.name}</span>
            ${product.urduName ? `<span class="product-title-ur">${product.urduName}</span>` : ''}
          </h3>
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
  const cartBadge = document.getElementById('cartCountBadge');
  const cartTitle = document.getElementById('cartCountTitle');
  if (cartBadge) cartBadge.textContent = totalItems;
  if (cartTitle) cartTitle.textContent = totalItems;

  const deliveryCharge = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : 250;
  const grandTotal = subtotal + deliveryCharge;

  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryChargeEl = document.getElementById('deliveryChargeText');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
  if (deliveryChargeEl) deliveryChargeEl.textContent = deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`;
  if (grandTotalEl) grandTotalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;

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
        <img src="${resolveImagePath(item.image)}" alt="${item.name}" class="cart-item-img">
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

  // Send Email Notification to Owner Zaib on cancellation
  const itemsSummary = order.items ? order.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'N/A';
  fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `⚠️ ORDER CANCELLED: ${order.id} - DESI TASTE LAND`,
      Order_Reference: order.id,
      Event_Type: 'ORDER CANCELLED BY CUSTOMER',
      Customer_Name: order.name || 'Customer',
      Customer_Phone: order.phone || 'N/A',
      Shipping_Address: order.address || 'N/A',
      Items_Cancelled: itemsSummary,
      Total_Amount_PKR: order.total || 0,
      Cancellation_Timestamp: new Date().toLocaleString()
    })
  }).catch(() => {});

  renderOrdersDrawer();
  showToast(`Order ${orderId} cancelled.`);
}

// 12. AUTH
function updateAuthUI() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loggedState = document.getElementById('userLoggedInState');

  // Verify customer is not disabled or deleted by admin
  if (currentUser) {
    const currentRegistered = JSON.parse(localStorage.getItem('dtl_registered_users')) || [];
    const validAccount = currentRegistered.find(u => 
      (u.phone && currentUser.phone && normalizePhone(u.phone) === normalizePhone(currentUser.phone)) ||
      (u.email && currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (!validAccount || validAccount.status === 'disabled') {
      currentUser = null;
      localStorage.removeItem('dtl_user');
      showToast('<i class="fa-solid fa-ban text-red"></i> Aapka account deactivate kar diya gaya hai.');
    }
  }

  if (currentUser) {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'none';
    if (loggedState) {
      loggedState.style.display = 'block';
      document.getElementById('loggedInUserName').textContent = currentUser.name;
      document.getElementById('loggedInUserEmail').textContent = currentUser.email || currentUser.phone || 'Verified User';
    }
  } else {
    if (loggedState) loggedState.style.display = 'none';
    const isSignup = document.getElementById('signupTabBtn')?.classList.contains('active');
    if (isSignup) {
      if (signupForm) signupForm.style.display = 'flex';
      if (loginForm) loginForm.style.display = 'none';
    } else {
      if (loginForm) loginForm.style.display = 'flex';
      if (signupForm) signupForm.style.display = 'none';
    }
  }
}

// 13. MODALS & DRAWERS
function openCartDrawer() { document.getElementById('cartDrawer')?.classList.add('active'); document.getElementById('cartOverlay')?.classList.add('active'); }
function closeCartDrawer() { document.getElementById('cartDrawer')?.classList.remove('active'); document.getElementById('cartOverlay')?.classList.remove('active'); }
function openOrdersDrawer() { renderOrdersDrawer(); document.getElementById('ordersDrawer')?.classList.add('active'); document.getElementById('ordersOverlay')?.classList.add('active'); }
function closeOrdersDrawer() { document.getElementById('ordersDrawer')?.classList.remove('active'); document.getElementById('ordersOverlay')?.classList.remove('active'); }
function closeQuickView() { document.getElementById('quickViewModal')?.classList.remove('active'); }

function openProductQuickView(productId) {
  let targetId = productId;
  if (productId === 'prod-honey' || productId === 'top-honey') {
    targetId = 'honey-wild-big';
  }
  const pathname = window.location.pathname || '';
  const isSub = pathname.includes('/honeycollection') || 
                pathname.includes('/allproduct') || 
                pathname.includes('/topselling') || 
                pathname.includes('/deal') || 
                pathname.includes('/about') || 
                pathname.includes('/contact') || 
                pathname.includes('/reviews') || 
                pathname.includes('/product');
  const targetUrl = isSub ? `../product/?id=${targetId}` : `product/?id=${targetId}`;
  window.location.href = targetUrl;
}

function openCheckoutModal() {
  if (cart.length === 0) { showToast('Cart is empty!'); return; }
  closeCartDrawer();
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const itemsTotalEl = document.getElementById('checkoutItemsTotal');
  const shippingFeeEl = document.getElementById('checkoutShippingFee');
  const finalTotalEl = document.getElementById('checkoutFinalTotal');
  if (itemsTotalEl) itemsTotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
  if (shippingFeeEl) shippingFeeEl.textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping}`;
  if (finalTotalEl) finalTotalEl.textContent = `Rs. ${(subtotal + shipping).toLocaleString()}`;
  document.getElementById('checkoutModal')?.classList.add('active');
}
function closeCheckoutModal() { document.getElementById('checkoutModal')?.classList.remove('active'); }

// 14. EVENT LISTENERS
function initEventListeners() {
  document.getElementById('myOrdersDrawerBtn')?.addEventListener('click', openOrdersDrawer);
  document.getElementById('closeOrdersBtn')?.addEventListener('click', closeOrdersDrawer);
  document.getElementById('ordersOverlay')?.addEventListener('click', closeOrdersDrawer);

  document.getElementById('wishlistToggleBtn')?.addEventListener('click', openWishlistDrawer);
  document.getElementById('closeWishlistBtn')?.addEventListener('click', closeWishlistDrawer);
  document.getElementById('wishlistOverlay')?.addEventListener('click', closeWishlistDrawer);

  document.getElementById('cartToggleBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);
  document.getElementById('userAccountBtn')?.addEventListener('click', () => document.getElementById('authSection')?.scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeQuickView);
  document.getElementById('quickViewModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'quickViewModal') closeQuickView();
  });
  document.getElementById('closeProductModalBtn')?.addEventListener('click', closeProductSelectionModal);
  document.getElementById('productSelectionModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productSelectionModal') closeProductSelectionModal();
  });

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


  // LOGIN FORM
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!input) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter your phone number or email.');
      return;
    }
    if (!password) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter your password.');
      return;
    }

    const isPhone = isValidPakistaniPhone(input);
    const isEmail = isValidEmail(input);

    if (!isPhone && !isEmail) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter a valid Pakistani phone number (e.g. 03070016113) or email.');
      return;
    }

    const cleanPhoneVal = isPhone ? normalizePhone(input) : '';
    const cleanEmailVal = isEmail ? input.toLowerCase() : '';

    const matchedUser = registeredUsers.find(u => {
      if (cleanPhoneVal && u.phone && normalizePhone(u.phone) === cleanPhoneVal) return true;
      if (cleanEmailVal && u.email && u.email.toLowerCase() === cleanEmailVal) return true;
      return false;
    });

    if (!matchedUser) {
      showToast('<i class="fa-solid fa-circle-xmark text-red"></i> Account not found! Please create a new account first.');
      setTimeout(() => {
        signupTabBtn?.click();
        if (isPhone) {
          const phoneField = document.getElementById('signupPhone');
          if (phoneField) phoneField.value = input;
        } else if (isEmail) {
          const emailField = document.getElementById('signupEmail');
          if (emailField) emailField.value = input;
        }
      }, 1500);
      return;
    }

    if (matchedUser.status === 'disabled') {
      showToast('<i class="fa-solid fa-ban text-red"></i> This account has been deactivated. Please contact support.');
      return;
    }

    if (matchedUser.password && matchedUser.password !== password) {
      showToast('<i class="fa-solid fa-triangle-exclamation text-red"></i> Incorrect password! Please try again.');
      return;
    }

    currentUser = { name: matchedUser.name, email: matchedUser.email || '', phone: matchedUser.phone || '' };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Welcome back, ${matchedUser.name}!`);
  });

  // SIGNUP FORM
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName')?.value.trim();
    const phone = document.getElementById('signupPhone')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;

    if (!name || name.length < 2) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter your full name.');
      return;
    }

    if (!isValidPakistaniPhone(phone)) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Invalid phone number! Please enter a valid Pakistani mobile number (e.g. 03070016113).');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Password must be at least 6 characters long.');
      return;
    }

    const normPhone = normalizePhone(phone);
    const normEmail = email.toLowerCase();

    const alreadyByPhone = registeredUsers.find(u => u.phone && normalizePhone(u.phone) === normPhone);
    const alreadyByEmail = registeredUsers.find(u => u.email && u.email.toLowerCase() === normEmail);

    if (alreadyByPhone || alreadyByEmail) {
      const conflictField = alreadyByPhone ? 'phone number' : 'email address';
      showToast(`<i class="fa-solid fa-circle-info text-gold"></i> This ${conflictField} is already registered! Please Login instead.`);
      setTimeout(() => {
        loginTabBtn?.click();
        const loginField = document.getElementById('loginEmail');
        if (loginField) loginField.value = alreadyByPhone ? phone : email;
      }, 1500);
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      phone: normPhone,
      email: normEmail,
      password: password
    };

    registeredUsers.push(newUser);
    localStorage.setItem('dtl_registered_users', JSON.stringify(registeredUsers));

    currentUser = { name: newUser.name, phone: newUser.phone, email: newUser.email };
    localStorage.setItem('dtl_user', JSON.stringify(currentUser));
    updateAuthUI();
    showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Account created successfully! Welcome, ${newUser.name}!`);
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('dtl_user');
    updateAuthUI();
    showToast('Logged out successfully');
  });

  document.getElementById('submitReviewForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value;
    const city = document.getElementById('revCity').value;
    const comment = document.getElementById('revComment').value;
    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ Type: 'REVIEW', Customer_Name: name, City: city, Review_Text: comment }) }).catch(() => {});
    
    // Sync review to admin management
    try {
      const revs = JSON.parse(localStorage.getItem('dtl_reviews') || '[]');
      revs.unshift({
        id: 'rev_' + Date.now(),
        name: name,
        city: city,
        comment: comment,
        rating: 5,
        product: 'Customer Review',
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
        featured: false
      });
      localStorage.setItem('dtl_reviews', JSON.stringify(revs));

      const notifs = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
      notifs.unshift({
        id: 'ntf_' + Date.now(),
        timestamp: Date.now(),
        type: 'REVIEW',
        title: 'New Customer Review',
        message: `${name} from ${city} submitted a review awaiting approval.`,
        linkView: 'reviews',
        read: false
      });
      localStorage.setItem('dtl_notifications', JSON.stringify(notifs));
    } catch(err) {}

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
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!isValidPakistaniPhone(phone)) {
      showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Ghalat number! Barahe karam sahi Pakistani phone number darj karein (e.g. 03070016113).');
      return;
    }

    const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
    const grandTotal = subtotal + shipping;
    const itemsSummary = cart.map(i => `${i.name} (${i.qty}x) = Rs.${i.price * i.qty}`).join(', ');
    fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ _subject: `New Order ${refId} - DESI TASTE LAND`, Order_Reference: refId, Customer_Name: name, Customer_Phone: phone, Customer_City: city, Shipping_Address: address, Items_Ordered: itemsSummary, Total_Amount_PKR: grandTotal }) }).catch(() => {});
    const newOrder = {
      id: refId,
      timestamp: Date.now(),
      name,
      phone,
      address: `${address}, ${city}`,
      items: [...cart],
      total: grandTotal,
      status: 'Pending',
      statusHistory: [{ status: 'Pending', timestamp: Date.now(), by: 'Customer Checkout', note: 'Order placed online' }]
    };
    myOrders.unshift(newOrder);
    localStorage.setItem('dtl_orders', JSON.stringify(myOrders));

    // Admin notifications & activity log sync
    try {
      const notifs = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
      notifs.unshift({
        id: 'ntf_' + Date.now(),
        timestamp: Date.now(),
        type: 'ORDER',
        title: `New Online Order: ${refId}`,
        message: `${name} placed an order for Rs. ${grandTotal.toLocaleString()}`,
        linkView: 'orders',
        read: false
      });
      localStorage.setItem('dtl_notifications', JSON.stringify(notifs));

      const acts = JSON.parse(localStorage.getItem('dtl_activity_logs') || '[]');
      acts.unshift({
        id: 'act_' + Date.now(),
        timestamp: Date.now(),
        adminName: 'Online Customer',
        adminRole: 'Customer',
        category: 'ORDERS',
        action: 'Order Placed',
        details: `Order ${refId} submitted by ${name} (Rs. ${grandTotal.toLocaleString()})`
      });
      localStorage.setItem('dtl_activity_logs', JSON.stringify(acts));
    } catch(err) {}

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

// ==========================================================================
// 16. DEDICATED PRODUCT DETAIL PAGE (PDP) SYSTEM
// ==========================================================================

const PRODUCT_DETAILS_DATA = {
  'honey-wild-big': {
    id: 'honey-wild-big',
    name: 'Wild Honey Big Bee – 100% Pure & Lab-Tested',
    urduName: 'جنگلی شہد بڑی مکھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/honey_wild_big.jpg',
    rating: 4.84,
    reviewsCount: 179,
    starsCount: { 5: 158, 4: 17, 3: 2, 2: 0, 1: 2 },
    variants: [
      { weight: '250g', price: 700, originalPrice: 900 },
      { weight: '500g', price: 1400, originalPrice: 1700, isDefault: true },
      { weight: '1kg', price: 2800, originalPrice: 3300 }
    ],
    selectedVariantIndex: 1,
    aboutHtml: `
      <h2>Wild Honey Big Bee – 100% Pure & Lab-Tested (جنگلی شہد بڑی مکھی)</h2>
      <p>Experience the rich taste and natural goodness of <strong>100% Pure Wild Honey Big Bee by DESI TASTE LAND</strong>. Sourced from wild beehives and lab-tested for quality, this honey offers distinctive flavor, a rich aroma, and natural sweetness in every spoonful.</p>
      
      <h2>Benefits of Wild Honey Big Bee</h2>
      <ul>
        <li><strong>100% Pure Honey:</strong> Natural sweetness without added refined sugar.</li>
        <li><strong>Lab-Tested Quality:</strong> Tested to help ensure quality and purity.</li>
        <li><strong>Natural Energy:</strong> Contains naturally occurring sugars that provide energy.</li>
        <li><strong>Rich Taste & Aroma:</strong> Enjoy its distinctive flavor in your daily routine.</li>
        <li><strong>Versatile Use:</strong> Perfect for milk, tea, breakfast, desserts, and everyday recipes.</li>
      </ul>
      
      <h2>How to Use Wild Honey?</h2>
      <p>Enjoy a spoonful on its own, mix it into warm milk or tea, or drizzle it over yogurt, toast, and breakfast meals. Store in a cool, dry place and keep the lid tightly closed.</p>
      
      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we bring you 100% pure, lab-tested Wild Honey Big Bee with a focus on quality, authenticity, and natural taste. Add the goodness of wild honey to your daily routine and enjoy its distinctive flavor with confidence.</p>
    `,
    reviews: [
      { name: "Muhammad Rashid", city: "Lahore", date: "2026-09-18", rating: 5, comment: "MashAllah bohot lazeez aur khalis honey hai. Taste aur aroma se hi pata chal jata hai k jungle ki baddi makhi ka khalis shahad hai. Highly recommended!" },
      { name: "Hafiz Usman", city: "Faisalabad", date: "2026-09-14", rating: 5, comment: "100% pure and lab-tested quality. Packing bohot zabardast thi. Subah neem garam doodh mein rozana use kar raha hoon, energy level behtar rehta hai." },
      { name: "Dr. Bilal Aslam", city: "Islamabad", date: "2026-09-10", rating: 5, comment: "DESI TASTE LAND ki quality per poora aetamad hai. Original wild big bee honey in Pakistan. Delivery bhi 2 din mein mil gayi." },
      { name: "Zubair Ahmed", city: "Rawalpindi", date: "2026-09-02", rating: 5, comment: "Pure organic taste, bilkul natural ghana shahad. Bachon ko bhi pasand aya. Zaroor dobara order karunga." },
      { name: "Tariq Mehmood", city: "Multan", date: "2026-08-28", rating: 5, comment: "DESI TASTE LAND ki packaging aur quality standard unmatchable hai. Asal jungli shahad." }
    ]
  },
  'honey-wild-small': {
    id: 'honey-wild-small',
    name: 'Wild Honey Small Bee – 100% Pure & Lab-Tested',
    urduName: 'جنگلی شہد چھوٹی مکھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/honey_wild_small.jpg',
    rating: 4.92,
    reviewsCount: 215,
    starsCount: { 5: 198, 4: 14, 3: 2, 2: 0, 1: 1 },
    variants: [
      { weight: '250g', price: 1400, originalPrice: 1750 },
      { weight: '500g', price: 2700, originalPrice: 3300, isDefault: true },
      { weight: '1kg', price: 5400, originalPrice: 6200 }
    ],
    selectedVariantIndex: 1,
    aboutHtml: `
      <h2>Wild Honey Small Bee – 100% Pure & Lab-Tested (جنگلی شہد چھوٹی مکھی)</h2>
      <p>Discover the natural taste of <strong>100% Pure Wild Honey Small Bee by DESI TASTE LAND</strong>. Sourced from wild beehives and lab-tested for quality and purity, this honey offers a distinctive flavor, natural sweetness, and a unique taste of wild honey.</p>
      
      <h2>Benefits of Wild Honey Small Bee</h2>
      <ul>
        <li><strong>100% Pure Honey:</strong> Enjoy natural sweetness without added refined sugar.</li>
        <li><strong>Lab-Tested Quality:</strong> Quality and purity tested for greater confidence.</li>
        <li><strong>Natural Energy:</strong> Contains naturally occurring sugars to help fuel your day.</li>
        <li><strong>Distinctive Flavor:</strong> Experience the unique taste and aroma of wild honey.</li>
        <li><strong>Everyday Versatility:</strong> Perfect for milk, tea, yogurt, breakfast, and your favorite recipes.</li>
      </ul>
      
      <h2>How to Use Wild Honey?</h2>
      <p>Enjoy a spoonful on its own, mix it into warm milk or tea, or drizzle it over breakfast and desserts. Store in a cool, dry place and keep the lid tightly closed.</p>
      
      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we are committed to offering 100% pure, lab-tested wild honey with a focus on quality, authenticity, and natural taste. Bring home Wild Honey Small Bee and enjoy the distinctive sweetness of nature in your daily routine.</p>
    `,
    reviews: [
      { name: "Sikandar Hayat", city: "Islamabad", date: "2026-09-20", rating: 5, comment: "Chhoti makhi ka jungli shahad bohot naayab hota hai aur DESI TASTE LAND ne bilkul shafaf aur genuine cheez di hai. Shandar zaaiqa!" },
      { name: "Shahid Nadeem", city: "Lahore", date: "2026-09-17", rating: 5, comment: "Outstanding purity! Khansi aur immunity k liye best medicine hai. Purity lab tested waqai 100% feel hoti hai." },
      { name: "Abdul Wahab", city: "Peshawar", date: "2026-09-12", rating: 5, comment: "Top class honey. Bottle packing bhi food-grade glass jar hai. Bohat maza aya, shukriya DESI TASTE LAND." },
      { name: "Qasim Ali", city: "Karachi", date: "2026-09-05", rating: 5, comment: "Rare wild small bee honey at very genuine price. Will order 1kg next time inshAllah." }
    ]
  },
  'honey-farmy-big': {
    id: 'honey-farmy-big',
    name: 'Farmy Honey Big Bee – 100% Pure & Lab-Tested',
    urduName: 'فارمی شہد بڑی مکھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/honey_farmy_big.jpg',
    rating: 4.86,
    reviewsCount: 145,
    starsCount: { 5: 128, 4: 14, 3: 2, 2: 0, 1: 1 },
    variants: [
      { weight: '250g', price: 500, originalPrice: 650 },
      { weight: '500g', price: 1000, originalPrice: 1250, isDefault: true },
      { weight: '1kg', price: 1800, originalPrice: 2200 }
    ],
    selectedVariantIndex: 1,
    aboutHtml: `
      <h2>Farmy Honey Big Bee – 100% Pure & Lab-Tested (فارمی شہد بڑی مکھی)</h2>
      <p>Experience the natural sweetness of <strong>100% Pure Farmy Honey Big Bee by DESI TASTE LAND</strong>. Produced by farm-raised honeybees that collect nectar from flowering plants, this honey offers a naturally sweet taste and rich flavor. Lab-tested for quality and purity, it is a delightful addition to your everyday routine.</p>
      
      <h2>Benefits of Farmy Honey Big Bee</h2>
      <ul>
        <li><strong>100% Pure Honey:</strong> Enjoy its natural sweetness without added refined sugar.</li>
        <li><strong>Lab-Tested Quality:</strong> Tested for quality and purity for greater confidence.</li>
        <li><strong>Natural Energy:</strong> Contains naturally occurring sugars to help fuel your day.</li>
        <li><strong>Rich Natural Flavor:</strong> A delicious sweetener for everyday enjoyment.</li>
        <li><strong>Versatile Use:</strong> Perfect for tea, milk, yogurt, breakfast, desserts, and recipes.</li>
      </ul>
      
      <h2>How to Use Farmy Honey?</h2>
      <p>Enjoy a spoonful on its own, stir it into your favorite warm drink, drizzle it over toast or yogurt, or use it as a natural sweetener in your recipes. Store in a cool, dry place with the lid tightly closed.</p>
      
      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we focus on quality, purity, and authentic taste. Our Farmy Honey Big Bee is lab-tested for quality and purity, bringing natural sweetness to your table for everyday enjoyment.</p>
    `,
    reviews: [
      { name: "Noman Farooq", city: "Gujranwala", date: "2026-09-19", rating: 5, comment: "Daily use chai aur toast k liye behtareen honey hai. Price bhi bohot munasib hai aur purity bilkul clear hai." },
      { name: "Farhan Saeed", city: "Lahore", date: "2026-09-15", rating: 5, comment: "Zero sugar adulteration guarantee 100% sach hai. Bohat saaf suthra aur fresh shahad hai." },
      { name: "Mrs. Rehan", city: "Sialkot", date: "2026-09-08", rating: 5, comment: "Kids love it on pancakes and warm milk. Safe, pure and sweet. Excellent service by DESI TASTE LAND." }
    ]
  },
  'honey-farmy-small': {
    id: 'honey-farmy-small',
    name: 'Farmy Honey Small Bee – 100% Pure & Lab-Tested',
    urduName: 'فارمی شہد چھوٹی مکھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/honey_farmy_small.jpg',
    rating: 4.89,
    reviewsCount: 162,
    starsCount: { 5: 146, 4: 13, 3: 2, 2: 0, 1: 1 },
    variants: [
      { weight: '250g', price: 1000, originalPrice: 1250 },
      { weight: '500g', price: 2000, originalPrice: 2450, isDefault: true },
      { weight: '1kg', price: 4000, originalPrice: 4800 }
    ],
    selectedVariantIndex: 1,
    aboutHtml: `
      <h2>Farmy Honey Small Bee – 100% Pure & Lab-Tested (فارمی شہد چھوٹی مکھی)</h2>
      <p>Discover the natural sweetness of <strong>100% Pure Farmy Honey Small Bee by DESI TASTE LAND</strong>. Produced by farm-raised small honeybees, this honey offers a distinctive natural flavor and sweetness. Lab-tested for quality and purity, it is a delicious addition to your daily routine.</p>
      
      <h2>Benefits of Farmy Honey Small Bee</h2>
      <ul>
        <li><strong>100% Pure Honey:</strong> Enjoy natural sweetness without added refined sugar.</li>
        <li><strong>Lab-Tested Quality:</strong> Tested for quality and purity.</li>
        <li><strong>Natural Energy:</strong> Contains naturally occurring sugars to help fuel your day.</li>
        <li><strong>Distinctive Taste:</strong> Enjoy the unique flavor of farm-produced honey.</li>
        <li><strong>Versatile Use:</strong> Perfect for tea, milk, yogurt, breakfast, desserts, and everyday recipes.</li>
      </ul>
      
      <h2>How to Use Farmy Honey?</h2>
      <p>Add a spoonful to your favorite drink, drizzle it over toast or yogurt, or use it as a natural sweetener in your recipes. Store in a cool, dry place and keep the lid tightly closed.</p>
      
      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value quality, purity, and customer trust. Our Farmy Honey Small Bee is lab-tested for quality and purity, offering natural sweetness for your everyday enjoyment.</p>
    `,
    reviews: [
      { name: "Dr. Hamza Tariq", city: "Karachi", date: "2026-09-22", rating: 5, comment: "Farmy small bee honey has such a light amber color and delicate floral taste. Truly impressed by DESI TASTE LAND's authenticity!" },
      { name: "Imran Khan", city: "Rawalpindi", date: "2026-09-16", rating: 5, comment: "Shandar product. Original honey with nice packing. Quick delivery via COD." },
      { name: "Waqas Butt", city: "Gujrat", date: "2026-09-11", rating: 5, comment: "Purity guaranteed. Meri family ko bohot pasand aya. Regular customer ban chuka hoon." }
    ]
  },

  // 2. COW DESI GHEE
  'prod-ghee': {
    id: 'prod-ghee',
    name: 'Cow Desi Ghee – Traditional Taste & Rich Aroma',
    urduName: 'گائے کا دیسی گھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_ghee_new.jpg',
    rating: 5.0,
    reviewsCount: 610,
    starsCount: { 5: 580, 4: 25, 3: 3, 2: 1, 1: 1 },
    variants: [
      { weight: '500g', price: 1600, originalPrice: 1950 },
      { weight: '1kg', price: 3200, originalPrice: 3800, isDefault: true }
    ],
    selectedVariantIndex: 1,
    aboutHtml: `
      <h2>Cow Desi Ghee – Traditional Taste & Rich Aroma (گائے کا دیسی گھی)</h2>
      <p>Experience the rich aroma and authentic taste of <strong>Cow Desi Ghee by DESI TASTE LAND</strong>. Made from cow's milk, this traditional ghee brings rich flavor and a delightful aroma to your everyday meals. Perfect for those who appreciate the taste of authentic Pakistani cuisine, it adds a special touch to both simple dishes and festive favorites.</p>

      <h2>Benefits of Cow Desi Ghee</h2>
      <ul>
        <li><strong>Rich Traditional Flavor:</strong> Enhances the taste of your favorite meals.</li>
        <li><strong>Source of Energy:</strong> Contains fats that provide energy for daily activities.</li>
        <li><strong>Naturally Occurring Vitamins:</strong> Milk fat can contain fat-soluble vitamins, including vitamins A, D, E, and K.</li>
        <li><strong>Versatile Cooking:</strong> Ideal for parathas, daal, karahi, halwa, and traditional desserts.</li>
        <li><strong>Everyday Essential:</strong> A flavorful addition to your kitchen.</li>
      </ul>

      <h2>How to Use Cow Desi Ghee?</h2>
      <p>Use it for cooking, preparing traditional dishes, frying, or adding extra flavor to roti and daal. Store in a clean, dry, tightly sealed container, away from direct sunlight and moisture.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value authentic taste, quality, and customer satisfaction. Our Cow Desi Ghee brings the warmth of traditional cooking to your kitchen, helping you make everyday meals more flavorful and memorable.</p>

      <p><strong>Bring home Cow Desi Ghee by DESI TASTE LAND and enjoy the timeless taste of tradition.</strong></p>
    `,
    reviews: [
      { name: "Chaudhry Akram", city: "Lahore", date: "2026-09-24", rating: 5, comment: "Bohot hi aala khushboo aur danedar texture hai. Bilkul gaon ka asli bilona cow ghee yaad dila diya. Parathas per zabardast swaad aata hai." },
      { name: "Mrs. Shahid", city: "Karachi", date: "2026-09-19", rating: 5, comment: "Pehli dafa order kiya tha aur bilkul satisfied hoon. Light golden color aur original ghee ka zaaiqa. DESI TASTE LAND ka shukriya!" },
      { name: "Hassan Raza", city: "Islamabad", date: "2026-09-12", rating: 5, comment: "Top quality cow ghee. Halwa aur daal tarka mein use kiya, ghar walon ko bohot pasand aya. Highly recommended!" },
      { name: "Kamran Bashir", city: "Faisalabad", date: "2026-08-30", rating: 5, comment: "100% pure cow ghee. Packaging leak-proof thi aur delivery time per mil gayi. Bar bar order karunga." }
    ]
  },

  // 3. BUFFALO DESI GHEE
  'prod-buffalo-ghee': {
    id: 'prod-buffalo-ghee',
    name: 'Buffalo Desi Ghee – Rich Taste & Traditional Goodness',
    urduName: 'بھینس کا دیسی گھی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_buffalo_ghee.jpg',
    rating: 5.0,
    reviewsCount: 320,
    starsCount: { 5: 300, 4: 16, 3: 3, 2: 0, 1: 1 },
    variants: [
      { weight: '500g', price: 1800, originalPrice: 2200, isDefault: true },
      { weight: '1kg', price: 3500, originalPrice: 4200 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Buffalo Desi Ghee – Rich Taste & Traditional Goodness (بھینس کا دیسی گھی)</h2>
      <p>Experience the rich taste and distinctive aroma of <strong>Buffalo Desi Ghee by DESI TASTE LAND</strong>. Made from buffalo milk, this traditional ghee is known for its rich flavor and creamy character. It brings authentic desi taste to everyday meals and traditional Pakistani cuisine, making every dish more enjoyable.</p>

      <h2>Benefits of Buffalo Desi Ghee</h2>
      <ul>
        <li><strong>Rich Flavor:</strong> Adds a delicious, traditional taste to your favorite dishes.</li>
        <li><strong>Source of Energy:</strong> Contains fats that provide energy for daily activities.</li>
        <li><strong>Naturally Occurring Nutrients:</strong> Milk fat can contain fat-soluble vitamins.</li>
        <li><strong>Perfect for Desi Cooking:</strong> Ideal for parathas, daal, karahi, halwa, and traditional desserts.</li>
        <li><strong>Versatile Kitchen Essential:</strong> Suitable for a variety of everyday cooking needs.</li>
      </ul>

      <h2>How to Use Buffalo Desi Ghee?</h2>
      <p>Use it to prepare traditional Pakistani dishes, cook vegetables, fry foods, or add a rich touch to roti, daal, and homemade desserts. Store in a clean, dry container with the lid tightly closed, away from direct sunlight and moisture.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value traditional taste, quality, and customer satisfaction. Our Buffalo Desi Ghee brings the richness of buffalo milk to your kitchen, helping you enjoy the authentic flavor of desi cooking.</p>

      <p><strong>Bring home Buffalo Desi Ghee by DESI TASTE LAND and add rich, traditional flavor to your everyday meals.</strong></p>
    `,
    reviews: [
      { name: "Malik Naveed", city: "Rawalpindi", date: "2026-09-21", rating: 5, comment: "Asli bhains ka bilona desi ghee! Khushboo pore kitchen mein phail jati hai. Roti per lagao to maza aa jata hai." },
      { name: "Imran Sadiq", city: "Gujranwala", date: "2026-09-15", rating: 5, comment: "Rich and thick creamy consistency. Perfect for karahi and halwa. 1kg jar was very well packaged." },
      { name: "Zia Ur Rehman", city: "Peshawar", date: "2026-09-08", rating: 5, comment: "No adulteration, pure natural ghee. Fast delivery and cooperative seller. 5 stars from me." }
    ]
  },

  // 4. IMLI CHUTNEY
  'prod-imli': {
    id: 'prod-imli',
    name: 'Imli Aloo Bukhara Chutney – Sweet, Tangy & Delicious',
    urduName: 'املی آلو بخارا چٹنی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_imli_new.jpg',
    rating: 4.9,
    reviewsCount: 310,
    starsCount: { 5: 285, 4: 20, 3: 3, 2: 1, 1: 1 },
    variants: [
      { weight: '500g', price: 700, originalPrice: 900, isDefault: true },
      { weight: '1kg', price: 1400, originalPrice: 1750 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Imli Aloo Bukhara Chutney – Sweet, Tangy & Delicious</h2>
      <p>Add a burst of sweet and tangy flavor to your meals with <strong>Imli Aloo Bukhara Chutney by DESI TASTE LAND</strong>. Made with the delightful taste of tamarind and plum, this chutney brings the perfect balance of fruity sweetness and tangy goodness to your favorite snacks and traditional Pakistani dishes.</p>

      <h2>What Makes Our Chutney Special?</h2>
      <ul>
        <li><strong>Sweet & Tangy Taste:</strong> A delicious combination of tamarind and plum flavors.</li>
        <li><strong>Traditional Flavor:</strong> Inspired by the classic taste of desi chutneys.</li>
        <li><strong>Versatile Pairing:</strong> Complements a variety of snacks and meals.</li>
        <li><strong>Delicious Addition:</strong> Adds extra flavor to every bite.</li>
      </ul>

      <h2>How to Enjoy Imli Aloo Bukhara Chutney?</h2>
      <p>Serve it with samosas, pakoras, rolls, chaat, and kebabs, or enjoy it alongside your favorite homemade meals. It also makes a delicious dip for snacks and appetizers.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we bring traditional flavors to your table with products made for everyday enjoyment. Our Imli Aloo Bukhara Chutney adds a delicious sweet-and-tangy touch to family meals, gatherings, and special occasions.</p>

      <p><strong>Bring home DESI TASTE LAND Imli Aloo Bukhara Chutney and make every bite more flavorful!</strong></p>
    `,
    reviews: [
      { name: "Fatima Noor", city: "Lahore", date: "2026-09-22", rating: 5, comment: "Khatay meethey taste ka zabardast combination! Samosay aur chaat k sath maza dobala ho gya. Maghaz aur aloo bukhara ka taste bilkul authentic hai." },
      { name: "Saad Sheikh", city: "Karachi", date: "2026-09-17", rating: 5, comment: "Homemade taste jaisa koi chemical ka feeling nahi. Very fresh and tasty chutney by DESI TASTE LAND." },
      { name: "Amina Tariq", city: "Multan", date: "2026-09-09", rating: 5, comment: "Ramadan or daily snack time dono k liye best. Jar quality is also solid glass. Loved it!" }
    ]
  },

  // 5. TALBINA
  'prod-talbina': {
    id: 'prod-talbina',
    name: 'Talbina – A Traditional Sunnah-Inspired Food',
    urduName: 'تلبینہ',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_talbina_new.jpg',
    rating: 4.9,
    reviewsCount: 340,
    starsCount: { 5: 310, 4: 25, 3: 3, 2: 1, 1: 1 },
    variants: [
      { weight: '170g', price: 500, originalPrice: 650, isDefault: true },
      { weight: '450g', price: 1300, originalPrice: 1600 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Talbina – A Traditional Sunnah-Inspired Food (تلبینہ)</h2>
      <p>Discover the comfort of <strong>Talbina by DESI TASTE LAND</strong>, a traditional barley-based food known in Islamic tradition and associated with the Sunnah. Made with nourishing barley, Talbina is a simple and comforting addition to your daily food routine, bringing together traditional taste and wholesome ingredients.</p>

      <h2>What Makes Talbina Special?</h2>
      <ul>
        <li><strong>Sunnah-Inspired Tradition:</strong> A food with a special place in Islamic tradition.</li>
        <li><strong>Barley Goodness:</strong> Barley naturally provides dietary fiber and other nutrients.</li>
        <li><strong>Comforting & Nourishing:</strong> A warm, soothing meal to enjoy as part of your daily diet.</li>
        <li><strong>Simple & Versatile:</strong> Easy to prepare and customize according to your taste.</li>
      </ul>

      <h2>How to Prepare Talbina?</h2>
      <p>Mix Talbina with milk or water and cook gently until it reaches your preferred consistency. You can add honey, dates, or other toppings for extra sweetness and flavor. Follow the product packaging for specific preparation instructions.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value traditional foods and authentic flavors. Our Talbina brings a meaningful part of Islamic food tradition into your home, making it easy to enjoy this classic barley-based dish with your family.</p>

      <p><strong>Bring home DESI TASTE LAND Talbina and enjoy a traditional food inspired by the Sunnah.</strong></p>
    `,
    reviews: [
      { name: "Maulana Abdul Qadir", city: "Faisalabad", date: "2026-09-23", rating: 5, comment: "SubhanAllah Sunnah food hai aur preparation bohot asaan hai. Doodh aur honey k sath subah nashte mein behtareen ghiza hai." },
      { name: "Zainab Bibi", city: "Islamabad", date: "2026-09-18", rating: 5, comment: "Stomach k liye bohot light aur sukoon dene wali cheez hai. Fresh barley flour with high quality packaging." },
      { name: "Usman Ghani", city: "Sialkot", date: "2026-09-10", rating: 5, comment: "Nutritious and comforting meal. Whole family drinks it daily now. Shukriya DESI TASTE LAND." }
    ]
  },

  // 6. OLIVE OIL
  'prod-olive': {
    id: 'prod-olive',
    name: 'Olive Oil – Natural Goodness & Everyday Quality',
    urduName: 'زیتون کا تیل',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_olive_new.png',
    rating: 5.0,
    reviewsCount: 290,
    starsCount: { 5: 275, 4: 12, 3: 2, 2: 0, 1: 1 },
    variants: [
      { weight: '112ml', price: 600, originalPrice: 750, isDefault: true }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Olive Oil – Natural Goodness & Everyday Quality (زیتون کا تیل)</h2>
      <p>Discover the distinctive taste of <strong>Olive Oil by DESI TASTE LAND</strong>. Known for its rich flavor and versatility, olive oil is a popular choice for everyday cooking, salad dressings, and a variety of delicious recipes. Bring the goodness of olives to your kitchen and enjoy a flavorful addition to your daily meals.</p>

      <h2>Benefits of Olive Oil</h2>
      <ul>
        <li><strong>Rich in Healthy Fats:</strong> Olive oil contains monounsaturated fats as part of a balanced diet.</li>
        <li><strong>Antioxidant Compounds:</strong> Depending on its type, olive oil can contain naturally occurring antioxidant compounds.</li>
        <li><strong>Versatile Cooking:</strong> Suitable for salads, dressings, sautéing, and many recipes.</li>
        <li><strong>Distinctive Flavor:</strong> Adds a delicious touch to vegetables, dips, and other dishes.</li>
        <li><strong>Everyday Kitchen Essential:</strong> A convenient ingredient for a variety of meals.</li>
      </ul>

      <h2>How to Use Olive Oil?</h2>
      <p>Drizzle it over salads, use it in dressings, add it to vegetables, or use it for cooking according to the oil's variety and label instructions. Store in a tightly sealed bottle away from direct sunlight and heat.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value quality, taste, and customer satisfaction. Our Olive Oil is a versatile choice for your kitchen, helping you prepare delicious meals with the distinctive flavor of olives.</p>

      <p><strong>Bring home Olive Oil by DESI TASTE LAND and add a flavorful touch to your everyday cooking!</strong></p>
    `,
    reviews: [
      { name: "Dr. Farooq", city: "Lahore", date: "2026-09-20", rating: 5, comment: "Extra virgin cold pressed olive oil. Very pure aroma and gentle grassy taste. Salads per perfect result deta hai." },
      { name: "Salma Begum", city: "Karachi", date: "2026-09-14", rating: 5, comment: "Bottle packing secure thi aur oil bilkul authentic hai. Daily health routine k liye recommended." }
    ]
  },

  // 7. SHILAJIT
  'prod-shilajit': {
    id: 'prod-shilajit',
    name: 'Shilajit – Nature’s Mineral-Rich Treasure',
    urduName: 'سلاجیت',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_shilajit_new.png',
    rating: 5.0,
    reviewsCount: 190,
    starsCount: { 5: 180, 4: 8, 3: 1, 2: 0, 1: 1 },
    variants: [
      { weight: '1 Tola', price: 1000, originalPrice: 1300, isDefault: true },
      { weight: '2 Tola', price: 2000, originalPrice: 2500 },
      { weight: '3 Tola', price: 3000, originalPrice: 3800 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Shilajit – Nature’s Mineral-Rich Treasure (سلاجیت)</h2>
      <p>Discover <strong>Shilajit by DESI TASTE LAND</strong>, a naturally occurring substance traditionally found in mountainous regions. Known for its long history in traditional wellness practices, Shilajit is valued for its distinctive composition and natural origin.</p>

      <h2>What Makes Shilajit Special?</h2>
      <ul>
        <li><strong>Mountain-Origin Substance:</strong> Naturally develops in mountainous environments over long periods.</li>
        <li><strong>Traditional Wellness Heritage:</strong> Has a long history of use in traditional wellness practices.</li>
        <li><strong>Distinctive Composition:</strong> Contains organic compounds and minerals, with composition varying by source and processing.</li>
        <li><strong>Quality Matters:</strong> Proper testing is important to check purity and screen for contaminants such as heavy metals.</li>
      </ul>

      <h2>How to Choose Shilajit?</h2>
      <p>Choose a product with clear ingredient information and reliable laboratory testing. Follow the product label and consult a qualified healthcare professional before using it, especially if you take medication or have an existing health condition.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value product quality, transparency, and customer trust. We aim to provide clear product information so customers can make informed choices.</p>

      <p><strong>Explore Shilajit by DESI TASTE LAND and learn more about this traditional mountain-origin substance.</strong></p>
    `,
    reviews: [
      { name: "Junaid Akhtar", city: "Gilgit", date: "2026-09-22", rating: 5, comment: "Original resin form shilajit. Dissolves completely in warm water and milk without any grit. Pure mountain quality!" },
      { name: "Muhammad Asif", city: "Rawalpindi", date: "2026-09-16", rating: 5, comment: "Feel the difference in stamina and energy after one week. Authentic packaging and purity." },
      { name: "Rizwan Shah", city: "Islamabad", date: "2026-09-07", rating: 5, comment: "100% genuine Himalayan shilajit. Very satisfied with DESI TASTE LAND products." }
    ]
  },

  // 8. MIX PICKLE
  'prod-pickle': {
    id: 'prod-pickle',
    name: 'Mix Pickle – Traditional Desi Flavor',
    urduName: 'مکس اچار',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_mix_pickle_new.jpg',
    rating: 4.9,
    reviewsCount: 280,
    starsCount: { 5: 255, 4: 20, 3: 3, 2: 1, 1: 1 },
    variants: [
      { weight: '500g', price: 350, originalPrice: 450, isDefault: true },
      { weight: '1kg', price: 700, originalPrice: 900 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Mix Pickle – Traditional Desi Flavor (مکس اچار)</h2>
      <p>Bring home the authentic taste of Pakistani cuisine with <strong>Mix Pickle by DESI TASTE LAND</strong>. Packed with a delicious blend of mixed vegetables, fruits, and traditional spices, this pickle adds a tangy, spicy, and flavorful touch to your everyday meals. Enjoy the classic desi taste that makes every meal more exciting.</p>

      <h2>What Makes Our Mix Pickle Special?</h2>
      <ul>
        <li><strong>Rich Desi Flavor:</strong> A delightful balance of tanginess and spice.</li>
        <li><strong>Traditional Taste:</strong> Inspired by the classic flavors of homemade Pakistani achar.</li>
        <li><strong>Flavorful Ingredients:</strong> A combination of ingredients and spices for a distinctive taste.</li>
        <li><strong>Perfect Meal Companion:</strong> Adds extra flavor to everyday dishes.</li>
      </ul>

      <h2>How to Enjoy Mix Pickle?</h2>
      <p>Serve it with parathas, daal, rice, roti, biryani, or your favorite traditional meals. A small serving adds a delicious tangy and spicy kick to your plate.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we celebrate traditional desi flavors and the joy of sharing delicious food with family. Our Mix Pickle is a flavorful addition to your dining table, perfect for everyday meals and special occasions.</p>

      <p><strong>Bring home DESI TASTE LAND Mix Pickle and enjoy the taste of tradition with every bite!</strong></p>
    `,
    reviews: [
      { name: "Babar Azam", city: "Lahore", date: "2026-09-24", rating: 5, comment: "Karelay, aam, lassan aur mirch ka asli desi achar! Sarson k tail ki zabardast khushboo hai. Daal chawal k sath la jawab lagta hai." },
      { name: "Nasreen Akhtar", city: "Faisalabad", date: "2026-09-17", rating: 5, comment: "Bilkul nani dadi k hath ka bana achar jaisa zaaiqa. Spices bilkul balanced hain." },
      { name: "Waqas Butt", city: "Gujrat", date: "2026-09-11", rating: 5, comment: "Achar lover hoon aur ye achar best nikla. Jar leak nahi tha, packaging bohot solid thi." }
    ]
  },

  // 9. TEA (PATTI)
  'prod-tea': {
    id: 'prod-tea',
    name: 'Tea Patti – Rich Aroma & Refreshing Taste',
    urduName: 'چائے کی پتی',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/all_tea.jpg',
    rating: 4.9,
    reviewsCount: 380,
    starsCount: { 5: 350, 4: 24, 3: 4, 2: 1, 1: 1 },
    variants: [
      { weight: '200g', price: 400, originalPrice: 500, isDefault: true },
      { weight: '900g', price: 1800, originalPrice: 2200 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Tea Patti – Rich Aroma & Refreshing Taste (چائے کی پتی)</h2>
      <p>Enjoy the comforting tradition of tea with <strong>Tea Patti by DESI TASTE LAND</strong>. With its inviting aroma, rich color, and satisfying taste, our tea patti is perfect for preparing a refreshing cup of chai. Whether you're starting your morning or enjoying an evening break with family, make every cup a special moment.</p>

      <h2>What Makes Our Tea Patti Special?</h2>
      <ul>
        <li><strong>Rich Aroma:</strong> Fills your cup with the familiar fragrance of traditional chai.</li>
        <li><strong>Full-Bodied Taste:</strong> Delivers a satisfying tea flavor for everyday enjoyment.</li>
        <li><strong>Perfect Daily Companion:</strong> Ideal for morning tea, afternoon breaks, and evening gatherings.</li>
        <li><strong>Traditional Chai Experience:</strong> Enjoy it with milk, sugar, or your preferred tea recipe.</li>
      </ul>

      <h2>How to Prepare Tea?</h2>
      <p>Boil water with tea patti, add milk and sugar according to your preference, and simmer until the tea reaches your desired strength. Strain into a cup and enjoy it hot.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we bring everyday essentials to your home with a focus on taste and customer satisfaction. Our Tea Patti is a wonderful choice for enjoying the warmth and comfort of traditional chai with family and friends.</p>

      <p><strong>Bring home DESI TASTE LAND Tea Patti and make every cup of chai a delightful experience!</strong></p>
    `,
    reviews: [
      { name: "Sheikh Haroon", city: "Karachi", date: "2026-09-21", rating: 5, comment: "Karak kadak dhoodh patti banti hai! Rang bhi rich red amber aata hai aur aroma bohot taza hai. Daily tea lovers k liye must-try." },
      { name: "Hamid Mir", city: "Rawalpindi", date: "2026-09-15", rating: 5, comment: "Top quality blend. Kam patti mein bhi acha strong cup banta hai. Very economical and tasty." },
      { name: "Ayesha Siddiqua", city: "Lahore", date: "2026-09-08", rating: 5, comment: "Subah ki chai DESI TASTE LAND ki patti k baghair ab adhuri lagti hai. Shandar quality!" }
    ]
  },

  // 10. SAFFRON
  'prod-saffron': {
    id: 'prod-saffron',
    name: 'Saffron – The Golden Spice of Luxury',
    urduName: 'زعفران',
    brand: 'DESI TASTE LAND',
    image: 'assets/images/prod_saffron_new.jpg',
    rating: 5.0,
    reviewsCount: 240,
    starsCount: { 5: 230, 4: 8, 3: 1, 2: 0, 1: 1 },
    variants: [
      { weight: '1g', price: 1200, originalPrice: 1500, isDefault: true },
      { weight: '2g', price: 2400, originalPrice: 3000 },
      { weight: '3g', price: 3600, originalPrice: 4500 }
    ],
    selectedVariantIndex: 0,
    aboutHtml: `
      <h2>Saffron – The Golden Spice of Luxury (زعفران)</h2>
      <p>Experience the exquisite aroma, vibrant golden color, and distinctive flavor of <strong>Saffron by DESI TASTE LAND</strong>. Known as one of the world's most precious spices, saffron adds elegance and a unique fragrance to traditional dishes, desserts, and beverages. A small amount is enough to bring beautiful color and a delicate flavor to your favorite recipes.</p>

      <h2>What Makes Saffron Special?</h2>
      <ul>
        <li><strong>Distinctive Aroma:</strong> Adds a delicate, luxurious fragrance to food.</li>
        <li><strong>Beautiful Golden Color:</strong> Enhances the appearance of rice dishes and desserts.</li>
        <li><strong>Unique Flavor:</strong> Brings a subtle, memorable taste to your recipes.</li>
        <li><strong>Versatile Culinary Use:</strong> Perfect for biryani, zarda, kheer, desserts, and saffron milk.</li>
        <li><strong>A Timeless Spice:</strong> Valued in culinary traditions around the world.</li>
      </ul>

      <h2>How to Use Saffron?</h2>
      <p>Soak a few saffron strands in a little warm water or milk for several minutes to release their color and aroma. Add the infused liquid to biryani, rice, kheer, desserts, or your favorite beverage.</p>

      <h2>Why Choose DESI TASTE LAND?</h2>
      <p>At <strong>DESI TASTE LAND</strong>, we value authentic flavors and quality ingredients. Our Saffron brings a touch of elegance to your kitchen, helping you create memorable meals and special treats for family and guests.</p>

      <p><strong>Bring home DESI TASTE LAND Saffron and add a golden touch of flavor and fragrance to every special occasion!</strong></p>
    `,
    reviews: [
      { name: "Syed Mohsin Ali", city: "Islamabad", date: "2026-09-22", rating: 5, comment: "Asli Kashmiri Mongra Zafran hai! Sirf 4 se 5 strands garam doodh mein daale to deep golden color aur sweet floral aroma aa gaya. Pure luxury quality." },
      { name: "Dr. Samina", city: "Lahore", date: "2026-09-18", rating: 5, comment: "Biryani aur kheer mein use kiya, royal restaurant wala look aur khushboo ayi. Sealed glass vial packing is perfect." },
      { name: "Fawad Chaudhry", city: "Karachi", date: "2026-09-12", rating: 5, comment: "100% authentic saffron. Color release test bhi pass ho gya, natural slow saffron release. Highly satisfied." }
    ]
  }
};

// Aliases for user-friendly routes / IDs
PRODUCT_DETAILS_DATA['cow-desi-ghee'] = PRODUCT_DETAILS_DATA['prod-ghee'];
PRODUCT_DETAILS_DATA['buffalo-desi-ghee'] = PRODUCT_DETAILS_DATA['prod-buffalo-ghee'];
PRODUCT_DETAILS_DATA['imli-chutney'] = PRODUCT_DETAILS_DATA['prod-imli'];
PRODUCT_DETAILS_DATA['talbina'] = PRODUCT_DETAILS_DATA['prod-talbina'];
PRODUCT_DETAILS_DATA['olive-oil'] = PRODUCT_DETAILS_DATA['prod-olive'];
PRODUCT_DETAILS_DATA['shilajit'] = PRODUCT_DETAILS_DATA['prod-shilajit'];
PRODUCT_DETAILS_DATA['mix-pickle'] = PRODUCT_DETAILS_DATA['prod-pickle'];
PRODUCT_DETAILS_DATA['tea-patti'] = PRODUCT_DETAILS_DATA['prod-tea'];
PRODUCT_DETAILS_DATA['saffron'] = PRODUCT_DETAILS_DATA['prod-saffron'];

let pdpCurrentProduct = null;
let pdpSelectedVariantIdx = 0;
let pdpCurrentQty = 1;
let pdpSelectedReviewStars = 5;

function initProductDetailPage() {
  const heroContainer = document.getElementById('pdpHeroSection');
  if (!heroContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  let prodId = urlParams.get('id');
  if (!prodId || prodId === 'prod-honey' || prodId === 'top-honey') {
    prodId = 'honey-wild-big';
  } else if (prodId === 'top-ghee') {
    prodId = 'prod-ghee';
  } else if (prodId === 'top-olive') {
    prodId = 'prod-olive';
  }

  let prodData = PRODUCT_DETAILS_DATA[prodId];
  if (!prodData) {
    let found = HONEY_CATEGORIES.find(c => c.id === prodId) || getLiveProducts().find(p => p.id === prodId);
    if (found) {
      prodData = {
        id: found.id,
        name: found.name,
        urduName: found.urduName || '',
        brand: 'DESI TASTE LAND',
        image: found.image,
        rating: found.rating || 5.0,
        reviewsCount: found.reviewsCount || 150,
        starsCount: { 5: 130, 4: 15, 3: 3, 2: 1, 1: 1 },
        variants: found.variants ? found.variants.map((v, i) => ({
          weight: v.weight,
          price: v.price,
          originalPrice: Math.round(v.price * 1.25),
          isDefault: i === 0
        })) : [{ weight: 'Standard', price: 1000, originalPrice: 1250, isDefault: true }],
        selectedVariantIndex: 0,
        aboutHtml: `
          <h2>${found.name} – 100% Pure & Authentic ${found.urduName ? `(${found.urduName})` : ''}</h2>
          <p>${found.description || '100% pure organic desi goodness crafted with utmost care and quality standards.'}</p>
          <h2>Key Benefits</h2>
          <ul>
            <li><strong>100% Pure & Natural:</strong> Prepared with traditional organic authenticity.</li>
            <li><strong>Premium Quality:</strong> Thoroughly tested to preserve natural aroma and nutrients.</li>
            <li><strong>Rich Goodness:</strong> Perfect for healthy daily nutrition.</li>
          </ul>
        `,
        reviews: [
          { name: "Mian Tariq", city: "Lahore", date: "2026-09-10", rating: 5, comment: "Zabardast quality, packaging aur delivery time bilkul perfect. Highly recommended!" },
          { name: "Dr. Ayesha Malik", city: "Islamabad", date: "2026-09-05", rating: 5, comment: "100% genuine and authentic. Bohot pasand aya!" }
        ]
      };
    } else {
      prodData = PRODUCT_DETAILS_DATA['honey-wild-big'];
    }
  }

  pdpCurrentProduct = prodData;
  pdpSelectedVariantIdx = prodData.selectedVariantIndex !== undefined ? prodData.selectedVariantIndex : 0;
  pdpCurrentQty = 1;

  document.title = `${prodData.name} | DESI TASTE LAND`;
  const metaTitle = document.getElementById('pdpMetaTitle');
  if (metaTitle) metaTitle.textContent = `${prodData.name} | DESI TASTE LAND`;
  const bcTitle = document.getElementById('pdpBreadcrumbTitle');
  if (bcTitle) bcTitle.textContent = prodData.name;

  const storedCustomReviews = JSON.parse(localStorage.getItem(`dtl_custom_reviews_${prodData.id}`) || '[]');
  const allReviews = [...storedCustomReviews, ...prodData.reviews];

  renderPdpHero(prodData);

  const descContainer = document.getElementById('pdpDescSection');
  if (descContainer) {
    descContainer.innerHTML = `
      <div class="pdp-desc-card">
        ${prodData.aboutHtml}
      </div>
    `;
  }

  renderPdpReviews(prodData, allReviews);
}

function renderPdpHero(product) {
  const container = document.getElementById('pdpHeroSection');
  if (!container) return;

  const currentVar = product.variants[pdpSelectedVariantIdx] || product.variants[0];

  container.innerHTML = `
    <div class="pdp-hero-grid">
      <div class="pdp-gallery-panel">
        <span class="pdp-sale-badge">Sale</span>
        <div class="pdp-main-img-box">
          <img src="${resolveImagePath(product.image)}" alt="${product.name}" class="pdp-main-img" id="pdpMainImg">
        </div>
      </div>

      <div class="pdp-details-panel">
        <h1 class="pdp-product-title">
          ${product.name}
          ${product.urduName ? `<span class="pdp-urdu-part">${product.urduName}</span>` : ''}
        </h1>

        <div class="pdp-rating-summary">
          <div class="pdp-stars-green">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <span class="pdp-reviews-count-text">${product.reviewsCount} reviews</span>
        </div>

        <div class="pdp-price-row">
          <span class="pdp-original-price" id="pdpOriginalPrice">${currentVar.originalPrice ? 'Rs.' + currentVar.originalPrice.toLocaleString() + '.00' : ''}</span>
          <span class="pdp-sale-price" id="pdpSalePrice">Rs.${currentVar.price.toLocaleString()}.00</span>
        </div>

        <div class="pdp-size-picker">
          <span class="pdp-size-label">Size: <strong id="pdpSelectedSizeLabel">${currentVar.weight}</strong></span>
          <div class="pdp-size-buttons">
            ${product.variants.map((v, idx) => `
              <button type="button" class="pdp-size-btn ${idx === pdpSelectedVariantIdx ? 'active' : ''}" onclick="changePdpVariant(${idx})">
                ${v.weight}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pdp-qty-section">
          <span class="pdp-qty-label">Quantity:</span>
          <div class="pdp-actions-row">
            <div class="pdp-qty-selector">
              <button type="button" class="pdp-qty-btn" onclick="updatePdpQty(-1)"><i class="fa-solid fa-minus"></i></button>
              <input type="text" class="pdp-qty-val" id="pdpQtyInput" value="${pdpCurrentQty}" readonly>
              <button type="button" class="pdp-qty-btn" onclick="updatePdpQty(1)"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button type="button" class="pdp-btn-add-cart" onclick="addPdpToCart()">
              <i class="fa-solid fa-cart-shopping"></i> ADD TO CART
            </button>
          </div>
        </div>

        <button type="button" class="pdp-btn-buy-now" onclick="buyPdpNow()">
          Buy it now
        </button>

        <a href="#" id="pdpWhatsAppBtn" class="pdp-btn-whatsapp" target="_blank">
          <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
        </a>


      </div>
    </div>
  `;

  updatePdpWhatsAppLink();
}

function changePdpVariant(idx) {
  pdpSelectedVariantIdx = idx;
  const currentVar = pdpCurrentProduct.variants[idx];
  const sizeLabel = document.getElementById('pdpSelectedSizeLabel');
  if (sizeLabel) sizeLabel.textContent = currentVar.weight;
  const origPriceEl = document.getElementById('pdpOriginalPrice');
  if (origPriceEl) origPriceEl.textContent = currentVar.originalPrice ? `Rs.${currentVar.originalPrice.toLocaleString()}.00` : '';
  const salePriceEl = document.getElementById('pdpSalePrice');
  if (salePriceEl) salePriceEl.textContent = `Rs.${currentVar.price.toLocaleString()}.00`;

  const buttons = document.querySelectorAll('.pdp-size-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });

  updatePdpWhatsAppLink();
}

function updatePdpQty(change) {
  pdpCurrentQty = Math.max(1, pdpCurrentQty + change);
  const input = document.getElementById('pdpQtyInput');
  if (input) input.value = pdpCurrentQty;
  updatePdpWhatsAppLink();
}

function updatePdpWhatsAppLink() {
  const btn = document.getElementById('pdpWhatsAppBtn');
  if (!btn || !pdpCurrentProduct) return;
  const currentVar = pdpCurrentProduct.variants[pdpSelectedVariantIdx] || pdpCurrentProduct.variants[0];
  const total = currentVar.price * pdpCurrentQty;
  const msg = `Hello Desi Taste Land, I want to order ${pdpCurrentProduct.name} (${currentVar.weight}) - Qty: ${pdpCurrentQty} - Total: Rs.${total.toLocaleString()}`;
  btn.href = `https://wa.me/923070016113?text=${encodeURIComponent(msg)}`;
}

function addPdpToCart() {
  if (!pdpCurrentProduct) return;
  const currentVar = pdpCurrentProduct.variants[pdpSelectedVariantIdx] || pdpCurrentProduct.variants[0];
  const itemId = `${pdpCurrentProduct.id}-${currentVar.weight.replace(/\s+/g, '')}`;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty += pdpCurrentQty;
  } else {
    cart.push({
      id: itemId,
      name: `${pdpCurrentProduct.name} (${currentVar.weight})`,
      price: currentVar.price,
      image: pdpCurrentProduct.image,
      qty: pdpCurrentQty
    });
  }
  saveCart();
  updateCartUI();
  showToast(`<i class="fa-solid fa-circle-check text-forest"></i> <strong>${pdpCurrentProduct.name} (${currentVar.weight})</strong> x ${pdpCurrentQty} added to cart!`);
  openCartDrawer();
}

function buyPdpNow() {
  addPdpToCart();
  closeCartDrawer();
  openCheckoutModal();
}

function renderPdpReviews(product, reviewsList) {
  const container = document.getElementById('pdpReviewsSection');
  if (!container) return;

  const totalReviews = product.reviewsCount || reviewsList.length;
  const ratingScore = product.rating || 4.84;
  const starsCount = product.starsCount || { 5: 158, 4: 17, 3: 2, 2: 0, 1: 2 };

  container.innerHTML = `
    <div class="pdp-reviews-card">
      <h2 class="pdp-reviews-title">Customer Reviews</h2>

      <div class="pdp-reviews-summary-grid">
        <div class="pdp-summary-score-col">
          <div class="pdp-score-stars">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <div class="pdp-score-num">${ratingScore} out of 5</div>
          <div class="pdp-score-based">Based on ${totalReviews} reviews <i class="fa-solid fa-circle-check pdp-check-icon"></i></div>
        </div>

        <div class="pdp-bars-col">
          ${[5, 4, 3, 2, 1].map(stars => {
            const count = starsCount[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return `
              <div class="pdp-bar-item">
                <div class="pdp-bar-stars-label">
                  ${Array(stars).fill('<i class="fa-solid fa-star"></i>').join('')}
                  ${Array(5 - stars).fill('<i class="fa-regular fa-star"></i>').join('')}
                </div>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct}%;"></div>
                </div>
                <div class="pdp-bar-count-label">${count}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pdp-write-btn-col">
          <button type="button" class="pdp-btn-write-review" onclick="togglePdpReviewForm()">
            Write a review
          </button>
        </div>
      </div>

      <div class="pdp-review-form-wrap" id="pdpReviewFormWrap">
        <h3 class="pdp-review-form-title">Write Your Review</h3>
        <form id="pdpReviewForm" onsubmit="handlePdpReviewSubmit(event)">
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 700; font-size: 0.9rem; color: #374151; display: block; margin-bottom: 6px;">Your Rating *</label>
            <div class="pdp-star-input-group" id="pdpStarInputGroup">
              <i class="fa-solid fa-star active" data-rating="1" onclick="setPdpReviewStars(1)"></i>
              <i class="fa-solid fa-star active" data-rating="2" onclick="setPdpReviewStars(2)"></i>
              <i class="fa-solid fa-star active" data-rating="3" onclick="setPdpReviewStars(3)"></i>
              <i class="fa-solid fa-star active" data-rating="4" onclick="setPdpReviewStars(4)"></i>
              <i class="fa-solid fa-star active" data-rating="5" onclick="setPdpReviewStars(5)"></i>
            </div>
          </div>
          <div class="pdp-review-form-grid">
            <div class="form-group">
              <label>Your Name *</label>
              <input type="text" id="pdpRevName" placeholder="e.g. Asad Mehmood" required>
            </div>
            <div class="form-group">
              <label>City / Location *</label>
              <input type="text" id="pdpRevCity" placeholder="e.g. Lahore" required>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Review Comment *</label>
            <textarea id="pdpRevComment" rows="3" placeholder="Share your experience with this honey (taste, aroma, purity, delivery)..." required></textarea>
          </div>
          <button type="submit" class="btn btn-red" style="font-weight: 800; padding: 12px 28px;">
            <i class="fa-solid fa-paper-plane"></i> Submit Review
          </button>
        </form>
      </div>

      <div class="pdp-reviews-list" id="pdpReviewsList">
        ${reviewsList.map(r => `
          <div class="pdp-review-card">
            <div class="pdp-rc-top">
              <span class="pdp-rc-author">
                ${r.name} <span style="font-weight: normal; color: #6B7280; font-size: 0.82rem;">(${r.city || 'Verified Customer'})</span>
                <span class="pdp-rc-badge"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>
              </span>
            </div>
            <div class="pdp-rc-stars">
              ${Array(r.rating || 5).fill('<i class="fa-solid fa-star"></i>').join('')}
              ${Array(5 - (r.rating || 5)).fill('<i class="fa-regular fa-star"></i>').join('')}
            </div>
            <p class="pdp-rc-comment">${r.comment}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function togglePdpReviewForm() {
  const formWrap = document.getElementById('pdpReviewFormWrap');
  if (formWrap) {
    formWrap.classList.toggle('active');
    if (formWrap.classList.contains('active')) {
      formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function setPdpReviewStars(stars) {
  pdpSelectedReviewStars = stars;
  const starIcons = document.querySelectorAll('#pdpStarInputGroup i');
  starIcons.forEach(icon => {
    const r = parseInt(icon.getAttribute('data-rating'), 10);
    icon.classList.toggle('active', r <= stars);
  });
}

function handlePdpReviewSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('pdpRevName')?.value.trim();
  const city = document.getElementById('pdpRevCity')?.value.trim();
  const comment = document.getElementById('pdpRevComment')?.value.trim();

  if (!name || !comment) return;

  const newRev = {
    id: 'rev_' + Date.now(),
    name: name,
    city: city || 'Pakistan',
    rating: pdpSelectedReviewStars,
    comment: comment,
    date: new Date().toISOString().slice(0, 10)
  };

  const stored = JSON.parse(localStorage.getItem(`dtl_custom_reviews_${pdpCurrentProduct.id}`) || '[]');
  stored.unshift(newRev);
  localStorage.setItem(`dtl_custom_reviews_${pdpCurrentProduct.id}`, JSON.stringify(stored));

  const list = document.getElementById('pdpReviewsList');
  if (list) {
    const card = document.createElement('div');
    card.className = 'pdp-review-card';
    card.innerHTML = `
      <div class="pdp-rc-top">
        <span class="pdp-rc-author">
          ${newRev.name} <span style="font-weight: normal; color: #6B7280; font-size: 0.82rem;">(${newRev.city})</span>
          <span class="pdp-rc-badge"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>
        </span>
      </div>
      <div class="pdp-rc-stars">
        ${Array(newRev.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
        ${Array(5 - newRev.rating).fill('<i class="fa-regular fa-star"></i>').join('')}
      </div>
      <p class="pdp-rc-comment">${newRev.comment}</p>
    `;
    list.prepend(card);
  }

  fetch('https://formsubmit.co/ajax/zaibbabar54@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      Type: 'PRODUCT_REVIEW',
      Product: pdpCurrentProduct.name,
      Customer_Name: name,
      City: city,
      Rating: pdpSelectedReviewStars,
      Review_Text: comment
    })
  }).catch(() => {});

  document.getElementById('pdpReviewForm')?.reset();
  togglePdpReviewForm();
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Shukriya! Aapka review kamyabi se submit ho gaya hai.');
}