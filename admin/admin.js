/* ==========================================================================
   DESI TASTE LAND - Master Owner/Admin Portal Engine (admin.js v2.0)
   Full Store Management • Multi-Role Security • Inventory • Coupons • Analytics
   ========================================================================== */

'use strict';

const OWNER_EMAIL = "zaibbabar54@gmail.com";
const AUTH_SALT = "DTL_ADMIN_SECURE_SALT_2026_DESITASTELAND";
const DEFAULT_OWNER_HASH = "fdf19eb7092c92b92bde00023a2d41a6cf1fb31c88e8721cd269b94a519ad68f";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

// Default catalog products
const DEFAULT_PRODUCTS = [
  { id: 'prod-honey', name: 'PURE HONEY (Sidr)', urduName: 'خالص بیری کا شہد', category: 'Honey', image: '../assets/images/prod_honey_new.png', price: 1400, weight: '500g', stock: 'in_stock', desc: '100% pure wild & farmy Sidr honey varieties.' },
  { id: 'prod-ghee', name: 'COW DESI GHEE', urduName: 'گائے کا دیسی گھی', category: 'Ghee', image: '../assets/images/prod_buffalo_ghee.jpg', price: 1600, weight: '500g', stock: 'in_stock', desc: 'Hand-churned Bilona Cow Desi Ghee.' },
  { id: 'prod-buffalo-ghee', name: 'BUFFALO DESI GHEE', urduName: 'بھینس کا دیسی گھی', category: 'Ghee', image: '../assets/images/prod_ghee_new.jpg', price: 1800, weight: '500g', stock: 'in_stock', desc: 'Traditional granular rich aroma buffalo ghee.' },
  { id: 'prod-olive', name: 'PURE OLIVE OIL', urduName: 'زیتون کا تیل', category: 'Oil', image: '../assets/images/prod_olive_new.png', price: 600, weight: '112ml', stock: 'in_stock', desc: 'Cold pressed extra virgin olive oil.' },
  { id: 'prod-imli', name: 'IMLI CHUTNEY', urduName: 'املی آلو بخارا چٹنی', category: 'Pantry', image: '../assets/images/prod_imli_new.jpg', price: 700, weight: '500g', stock: 'in_stock', desc: 'Traditional handcrafted tangy and sweet chutney.' },
  { id: 'prod-talbina', name: 'TALBINA', urduName: 'تلبینہ', category: 'Herbal', image: '../assets/images/prod_talbina_new.jpg', price: 500, weight: '170g', stock: 'in_stock', desc: 'Sunnah barley porridge blended with nuts and dates.' },
  { id: 'prod-shilajit', name: 'SHILAJIT', urduName: 'سلاجیت', category: 'Herbal', image: '../assets/images/prod_shilajit_new.png', price: 1000, weight: '1 Tola', stock: 'in_stock', desc: 'Purified natural Himalayan resin.' },
  { id: 'prod-pickle', name: 'MIX PICKLE (Achar)', urduName: 'مکس اچار', category: 'Pantry', image: '../assets/images/prod_mix_pickle_new.jpg', price: 350, weight: '500g', stock: 'in_stock', desc: 'Traditional mustard oil aromatic mix pickle.' },
  { id: 'prod-tea', name: 'PREMIUM TEA (Patti)', urduName: 'چائے کی پتی', category: 'Pantry', image: '../assets/images/all_tea.jpg', price: 400, weight: '200g', stock: 'in_stock', desc: 'Rich brisk color authentic top leaves tea.' },
  { id: 'prod-saffron', name: 'KASHMIRI SAFFRON', urduName: 'کشمیری زعفران', category: 'Saffron', image: '../assets/images/prod_saffron_new.jpg', price: 1200, weight: '1g', stock: 'in_stock', desc: '100% pure royal Kashmiri Mongra Saffron.' }
];

// App State
let storeOrders = [];
let storeCustomers = [];
let customProducts = [];
let storeInventory = {};
let storeCoupons = [];
let storeReviews = [];
let storeAdminUsers = [];
let storeActivityLogs = [];
let storeNotifications = [];
let storeSettings = {};
let stockDeductedOrders = [];

let activeOrderForModal = null;
let currentView = 'dashboard';
let currentAdminSession = null;

// ========== 1. CRYPTOGRAPHIC AUTH & ROLES ==========

async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function initAdminUsersDirectory() {
  let users = JSON.parse(localStorage.getItem('dtl_admin_users') || 'null');
  if (!users || !Array.isArray(users) || users.length === 0) {
    users = [
      {
        id: 'adm_owner_zaib',
        name: 'Zaib Babar',
        email: OWNER_EMAIL,
        role: 'SUPER_ADMIN',
        passwordHash: DEFAULT_OWNER_HASH,
        status: 'active',
        createdAt: Date.now()
      }
    ];
    localStorage.setItem('dtl_admin_users', JSON.stringify(users));
  }
  storeAdminUsers = users;
}

function checkLockout() {
  const lockoutUntil = parseInt(sessionStorage.getItem('dtl_admin_lockout_until') || '0', 10);
  if (lockoutUntil > Date.now()) {
    const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
    showLockoutBanner(secs);
    startLockoutCountdown();
    return true;
  }
  hideLockoutBanner();
  return false;
}

function showLockoutBanner(seconds) {
  const el = document.getElementById('lockoutNotice');
  const text = document.getElementById('lockoutText');
  const btn = document.getElementById('loginSubmitBtn');
  if (el) el.style.display = 'flex';
  if (text) text.textContent = 'Security Lockout: Too many failed attempts. Try again in ' + seconds + 's.';
  if (btn) btn.disabled = true;
}

function hideLockoutBanner() {
  const el = document.getElementById('lockoutNotice');
  const btn = document.getElementById('loginSubmitBtn');
  if (el) el.style.display = 'none';
  if (btn) btn.disabled = false;
}

function startLockoutCountdown() {
  const interval = setInterval(() => {
    const lockoutUntil = parseInt(sessionStorage.getItem('dtl_admin_lockout_until') || '0', 10);
    if (lockoutUntil <= Date.now()) {
      clearInterval(interval);
      hideLockoutBanner();
      sessionStorage.removeItem('dtl_admin_lockout_until');
      sessionStorage.removeItem('dtl_admin_failed_attempts');
    } else {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      const text = document.getElementById('lockoutText');
      if (text) text.textContent = 'Security Lockout: Too many failed attempts. Try again in ' + remaining + 's.';
    }
  }, 1000);
}

function recordFailedAttempt() {
  const attempts = parseInt(sessionStorage.getItem('dtl_admin_failed_attempts') || '0', 10) + 1;
  sessionStorage.setItem('dtl_admin_failed_attempts', attempts);
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    sessionStorage.setItem('dtl_admin_lockout_until', Date.now() + LOCKOUT_DURATION_MS);
    checkLockout();
  }
}

function resetFailedAttempts() {
  sessionStorage.removeItem('dtl_admin_failed_attempts');
  sessionStorage.removeItem('dtl_admin_lockout_until');
}

function getActiveSession() {
  try {
    return JSON.parse(sessionStorage.getItem('dtl_admin_session') || 'null');
  } catch { return null; }
}

function isAuthenticated() {
  const sess = getActiveSession();
  return sess && sess.email && sess.token;
}

function checkPermission(viewName) {
  const sess = getActiveSession();
  if (!sess) return false;
  if (sess.role === 'SUPER_ADMIN') return true;

  const orderManagerViews = ['dashboard', 'orders', 'customers', 'notifications', 'activity-logs', 'security'];
  const productManagerViews = ['dashboard', 'products', 'inventory', 'notifications', 'activity-logs', 'security'];
  const marketingManagerViews = ['dashboard', 'coupons', 'reviews', 'content', 'notifications', 'activity-logs', 'security'];

  if (sess.role === 'ORDER_MANAGER') return orderManagerViews.includes(viewName);
  if (sess.role === 'PRODUCT_MANAGER') return productManagerViews.includes(viewName);
  if (sess.role === 'MARKETING_MANAGER') return marketingManagerViews.includes(viewName);
  return false;
}

// ========== 2. ACTIVITY LOGGING & NOTIFICATIONS ==========

function logActivity(action, details, category = 'SETTINGS') {
  const sess = getActiveSession();
  const logEntry = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
    adminName: sess ? sess.name : 'System',
    adminRole: sess ? sess.role : 'SUPER_ADMIN',
    category: category,
    action: action,
    details: details
  };

  storeActivityLogs = JSON.parse(localStorage.getItem('dtl_activity_logs') || '[]');
  storeActivityLogs.unshift(logEntry);
  if (storeActivityLogs.length > 500) storeActivityLogs = storeActivityLogs.slice(0, 500);
  localStorage.setItem('dtl_activity_logs', JSON.stringify(storeActivityLogs));
}

function addNotification(type, title, message, linkView = 'orders', linkId = null) {
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
  const exists = storeNotifications.some(n => n.title === title && (Date.now() - n.timestamp < 30000));
  if (exists) return;

  const notif = {
    id: 'ntf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: Date.now(),
    type: type, // 'ORDER', 'STOCK', 'REVIEW', 'CANCEL'
    title: title,
    message: message,
    linkView: linkView,
    linkId: linkId,
    read: false
  };

  storeNotifications.unshift(notif);
  if (storeNotifications.length > 100) storeNotifications = storeNotifications.slice(0, 100);
  localStorage.setItem('dtl_notifications', JSON.stringify(storeNotifications));
  updateNotificationBadges();
}

function updateNotificationBadges() {
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
  const unreadCount = storeNotifications.filter(n => !n.read).length;

  const topBadge = document.getElementById('topbarNotifBadge');
  const navBadge = document.getElementById('navNotificationBadge');

  if (topBadge) {
    topBadge.textContent = unreadCount;
    topBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }
  if (navBadge) {
    navBadge.textContent = unreadCount;
    navBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }

  // Populate dropdown
  const list = document.getElementById('notifDropdownList');
  if (list) {
    if (storeNotifications.length === 0) {
      list.innerHTML = '<p class="text-muted text-center" style="padding:16px;">No notifications yet.</p>';
    } else {
      list.innerHTML = storeNotifications.slice(0, 6).map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="handleNotificationClick('${n.id}', '${n.linkView}')">
          <div class="notif-icon-box icon-${(n.type||'order').toLowerCase()}">
            <i class="fa-solid ${getNotifIcon(n.type)}"></i>
          </div>
          <div class="notif-feed-content">
            <strong>${escapeHtml(n.title)}</strong>
            <p style="margin:2px 0 0 0; color:var(--text-muted); font-size:0.78rem;">${escapeHtml(n.message)}</p>
            <span class="notif-feed-time">${formatTimeAgo(n.timestamp)}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

function getNotifIcon(type) {
  if (type === 'STOCK') return 'fa-warehouse';
  if (type === 'REVIEW') return 'fa-star';
  if (type === 'CANCEL') return 'fa-ban';
  return 'fa-box-open';
}

function markAllNotificationsRead() {
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
  storeNotifications.forEach(n => n.read = true);
  localStorage.setItem('dtl_notifications', JSON.stringify(storeNotifications));
  updateNotificationBadges();
  renderNotificationsFeed();
  showToast('<i class="fa-solid fa-check text-forest"></i> All notifications marked as read.');
}

function clearAllNotifications() {
  if (!confirm('Clear all notifications?')) return;
  storeNotifications = [];
  localStorage.setItem('dtl_notifications', '[]');
  updateNotificationBadges();
  renderNotificationsFeed();
  showToast('<i class="fa-solid fa-trash text-red"></i> Notifications cleared.');
}

function handleNotificationClick(id, linkView) {
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
  const notif = storeNotifications.find(n => n.id === id);
  if (notif) notif.read = true;
  localStorage.setItem('dtl_notifications', JSON.stringify(storeNotifications));
  updateNotificationBadges();
  document.getElementById('notifDropdown')?.classList.remove('active');
  if (linkView && checkPermission(linkView)) {
    switchView(linkView);
  }
}

// ========== 3. INITIALIZATION & REFRESH ==========

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initAdminUsersDirectory();
  initDefaultDataStores();
  setupAllEventListeners();

  if (isAuthenticated()) {
    showDashboard();
  } else {
    showLoginScreen();
    checkLockout();
  }
});

function initLiveClock() {
  const update = () => {
    const el = document.getElementById('liveClockText');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: true });
  };
  update();
  setInterval(update, 1000);
}

function initDefaultDataStores() {
  // Inventory
  if (!localStorage.getItem('dtl_inventory')) {
    const inv = {};
    DEFAULT_PRODUCTS.forEach(p => {
      inv[p.id] = { stock: 50, threshold: 8, lastUpdated: Date.now() };
    });
    localStorage.setItem('dtl_inventory', JSON.stringify(inv));
  }

  // Stock Deducted Orders Set
  if (!localStorage.getItem('dtl_stock_deducted_orders')) {
    localStorage.setItem('dtl_stock_deducted_orders', JSON.stringify([]));
  }

  // Coupons
  if (!localStorage.getItem('dtl_coupons')) {
    const initialCoupons = [
      {
        id: 'cpn_welcome10',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrder: 2000,
        usageLimit: 500,
        usedCount: 0,
        expiryDate: '2026-12-31',
        status: 'active',
        createdAt: Date.now()
      },
      {
        id: 'cpn_desi500',
        code: 'DESI500',
        type: 'fixed',
        value: 500,
        minOrder: 5000,
        usageLimit: 200,
        usedCount: 0,
        expiryDate: '2026-12-31',
        status: 'active',
        createdAt: Date.now()
      }
    ];
    localStorage.setItem('dtl_coupons', JSON.stringify(initialCoupons));
  }

  // Reviews
  if (!localStorage.getItem('dtl_reviews')) {
    const initialReviews = [
      {
        id: 'rev_seed_1',
        name: 'Mian Tariq',
        city: 'Lahore',
        comment: 'Alhamdulillah 100% pure Bilona Cow Desi Ghee! Khushboo bilkul gaanv jaisi hai. Zabardast quality!',
        rating: 5,
        product: 'COW DESI GHEE',
        date: '2026-08-20',
        status: 'approved',
        featured: true
      },
      {
        id: 'rev_seed_2',
        name: 'Dr. Ayesha Malik',
        city: 'Islamabad',
        comment: 'Wild Sidr Honey is completely raw and genuine. Packing and delivery standard is unmatched.',
        rating: 5,
        product: 'PURE HONEY (Sidr)',
        date: '2026-08-22',
        status: 'approved',
        featured: true
      },
      {
        id: 'rev_seed_3',
        name: 'Kamran Siddiqui',
        city: 'Karachi',
        comment: 'Kashmiri Mongra Saffron color and aroma is 100% royal. Very satisfied with Desi Taste Land!',
        rating: 5,
        product: 'KASHMIRI SAFFRON',
        date: '2026-08-25',
        status: 'approved',
        featured: false
      }
    ];
    localStorage.setItem('dtl_reviews', JSON.stringify(initialReviews));
  }

  // Site Content
  if (!localStorage.getItem('dtl_site_content')) {
    const defaultContent = {
      noticeText: 'Free Nationwide Delivery on all orders above Rs. 5,000 via Cash on Delivery!',
      heroHeadline: '100% PURE & ORGANIC DELICACIES',
      heroSubtitle: 'Sourced directly from pristine floral fields and traditional churns across Pakistan.',
      phone: '+92 307 0016113',
      email: 'desitasteland@gmail.com',
      address: 'Aqua Market Phool Nagar, Bhai Pheru, Pakistan 55260',
      hours: 'Mon - Sat: 9:00 AM - 9:00 PM',
      whatsapp: 'https://wa.me/923070016113',
      facebook: 'https://www.facebook.com/profile.php?id=61584915339912',
      instagram: 'https://www.instagram.com/desitasteland'
    };
    localStorage.setItem('dtl_site_content', JSON.stringify(defaultContent));
  }

  // Store Settings
  if (!localStorage.getItem('dtl_store_settings')) {
    const defaultSettings = {
      storeName: 'DESI TASTE LAND',
      storePhone: '+92 307 0016113',
      storeEmail: 'desitasteland@gmail.com',
      notifyEmail: 'zaibbabar54@gmail.com',
      storeAddress: 'Aqua Market Phool Nagar, Bhai Pheru, Pakistan 55260',
      shippingFee: 250,
      freeShippingThreshold: 5000
    };
    localStorage.setItem('dtl_store_settings', JSON.stringify(defaultSettings));
  }
}

function showLoginScreen() {
  document.getElementById('loginWrapper').style.display = 'flex';
  document.getElementById('dashboardLayout').style.display = 'none';
}

function showDashboard() {
  const sess = getActiveSession();
  currentAdminSession = sess;

  // Update user info across UI
  if (sess) {
    document.getElementById('sidebarAdminName').textContent = sess.name || 'Admin';
    document.getElementById('sidebarAdminEmail').textContent = sess.email || '';
    document.getElementById('sidebarUserRoleLabel').innerHTML = `<i class="fa-solid fa-circle text-forest"></i> ${formatRoleName(sess.role)}`;
    document.getElementById('topbarRoleText').textContent = formatRoleName(sess.role);
    document.getElementById('secCurrentAdminEmail').textContent = sess.email || '';
    document.getElementById('secCurrentAdminRole').textContent = formatRoleName(sess.role);
    document.getElementById('secCurrentLoginTime').textContent = new Date(sess.loginTime).toLocaleTimeString();

    // Enforce role visibility on sidebar
    applySidebarPermissions(sess.role);
  }

  document.getElementById('loginWrapper').style.display = 'none';
  document.getElementById('dashboardLayout').style.display = 'flex';
  refreshStoreData();
  switchView('dashboard');
}

function formatRoleName(role) {
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  if (role === 'ORDER_MANAGER') return 'Order Manager';
  if (role === 'PRODUCT_MANAGER') return 'Product Manager';
  if (role === 'MARKETING_MANAGER') return 'Marketing Manager';
  return role || 'Admin';
}

function applySidebarPermissions(role) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const perm = item.getAttribute('data-perm');
    if (role === 'SUPER_ADMIN') {
      item.style.display = 'flex';
    } else if (perm === 'all') {
      item.style.display = 'flex';
    } else if (perm === 'orders' && role === 'ORDER_MANAGER') {
      item.style.display = 'flex';
    } else if (perm === 'products' && role === 'PRODUCT_MANAGER') {
      item.style.display = 'flex';
    } else if (perm === 'marketing' && role === 'MARKETING_MANAGER') {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function refreshStoreData() {
  storeOrders = JSON.parse(localStorage.getItem('dtl_orders') || '[]');
  storeCustomers = JSON.parse(localStorage.getItem('dtl_registered_users') || '[]');
  customProducts = JSON.parse(localStorage.getItem('dtl_custom_products') || '[]');
  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  storeCoupons = JSON.parse(localStorage.getItem('dtl_coupons') || '[]');
  storeReviews = JSON.parse(localStorage.getItem('dtl_reviews') || '[]');
  storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');
  storeActivityLogs = JSON.parse(localStorage.getItem('dtl_activity_logs') || '[]');
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');
  storeSettings = JSON.parse(localStorage.getItem('dtl_store_settings') || '{}');
  stockDeductedOrders = JSON.parse(localStorage.getItem('dtl_stock_deducted_orders') || '[]');

  // Check inventory health & generate stock notifications
  checkInventoryAlerts();

  // Render active views
  updateDashboardKPIs();
  renderRecentOrdersTable();
  renderOrdersMasterTable();
  renderProductsGrid();
  renderInventoryMasterTable();
  renderCustomersMasterTable();
  renderCouponsMasterTable();
  renderReviewsMasterTable();
  renderAnalyticsDashboard();
  renderNotificationsFeed();
  renderAdminUsersMasterTable();
  renderActivityLogsMasterTable();
  populateContentForm();
  populateSettingsForm();
  populateManualOrderProductSelect();
  updateNotificationBadges();
}

// ========== 4. DASHBOARD KPIS & STATS ==========

function updateDashboardKPIs() {
  const allOrders = storeOrders;
  const grossSales = allOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Returned' && o.status !== 'Refunded')
                              .reduce((sum, o) => sum + (o.total || 0), 0);

  // Today's Sales
  const startOfToday = new Date().setHours(0,0,0,0);
  const todayOrders = allOrders.filter(o => o.timestamp >= startOfToday);
  const todaySales = todayOrders.filter(o => o.status !== 'Cancelled')
                                .reduce((sum, o) => sum + (o.total || 0), 0);

  // Status counts
  const countPending = allOrders.filter(o => o.status === 'Pending').length;
  const countConfirmed = allOrders.filter(o => o.status === 'Confirmed').length;
  const countProcessing = allOrders.filter(o => o.status === 'Processing').length;
  const countShipped = allOrders.filter(o => o.status === 'Shipped').length;
  const countDelivered = allOrders.filter(o => o.status === 'Delivered').length;
  const countCancelled = allOrders.filter(o => o.status === 'Cancelled').length;
  const countReturned = allOrders.filter(o => o.status === 'Returned').length;
  const countRefunded = allOrders.filter(o => o.status === 'Refunded').length;

  const validOrdersCount = allOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded').length;
  const aov = validOrdersCount > 0 ? Math.round(grossSales / validOrdersCount) : 0;

  // Inventory warnings
  let lowStockCount = 0;
  let outOfStockCount = 0;
  getAllProductsCombined().forEach(p => {
    const inv = storeInventory[p.id] || { stock: 50, threshold: 8 };
    if (inv.stock === 0) outOfStockCount++;
    else if (inv.stock <= inv.threshold) lowStockCount++;
  });

  // Update DOM KPI elements
  setElemText('kpiTotalSales', 'Rs. ' + grossSales.toLocaleString());
  setElemText('kpiTodaySales', 'Rs. ' + todaySales.toLocaleString());
  setElemText('kpiTodayOrdersCount', `${todayOrders.length} order(s) today`);
  setElemText('kpiTotalOrders', allOrders.length);
  setElemText('kpiOrdersSubtext', `${countProcessing + countPending} awaiting dispatch`);
  setElemText('kpiAOV', 'Rs. ' + aov.toLocaleString());
  setElemText('kpiTotalCustomers', storeCustomers.length);
  setElemText('kpiDeliveredOrders', countDelivered);
  setElemText('kpiCancelledOrders', countCancelled + countReturned);
  setElemText('kpiLowStockCount', lowStockCount + outOfStockCount);
  setElemText('kpiOutOfStockSubtext', `${outOfStockCount} out of stock`);

  // Update status bar counts
  setElemText('countPending', countPending);
  setElemText('countConfirmed', countConfirmed);
  setElemText('countProcessing', countProcessing);
  setElemText('countShipped', countShipped);
  setElemText('countDelivered', countDelivered);
  setElemText('countCancelled', countCancelled);
  setElemText('countReturned', countReturned);
  setElemText('countRefunded', countRefunded);

  // Update nav badge
  const pendingBadge = document.getElementById('pendingOrdersBadge');
  if (pendingBadge) {
    pendingBadge.textContent = countPending + countProcessing;
    pendingBadge.style.display = (countPending + countProcessing) > 0 ? 'inline-block' : 'none';
  }

  // Update inventory nav badge
  const lowStockBadge = document.getElementById('lowStockBadge');
  if (lowStockBadge) {
    const totalWarn = lowStockCount + outOfStockCount;
    lowStockBadge.textContent = totalWarn;
    lowStockBadge.style.display = totalWarn > 0 ? 'inline-block' : 'none';
  }

  // Update reviews nav badge
  const pendingReviewsBadge = document.getElementById('pendingReviewsBadge');
  if (pendingReviewsBadge) {
    const pRev = storeReviews.filter(r => r.status === 'pending').length;
    pendingReviewsBadge.textContent = pRev;
    pendingReviewsBadge.style.display = pRev > 0 ? 'inline-block' : 'none';
  }

  // Render Best Sellers Widget on Dashboard
  renderDashboardBestSellers();
}

function setElemText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderDashboardBestSellers() {
  const listEl = document.getElementById('dashboardBestSellersList');
  if (!listEl) return;

  const productTotals = {};
  storeOrders.forEach(o => {
    if (o.status === 'Cancelled' || o.status === 'Refunded') return;
    (o.items || []).forEach(item => {
      const name = item.name || 'Product';
      if (!productTotals[name]) productTotals[name] = { qty: 0, revenue: 0 };
      productTotals[name].qty += (item.qty || 1);
      productTotals[name].revenue += ((item.price || 0) * (item.qty || 1));
    });
  });

  const sorted = Object.entries(productTotals).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
  if (sorted.length === 0) {
    listEl.innerHTML = '<p class="text-muted text-center" style="padding:14px;">No product sales recorded yet.</p>';
    return;
  }

  listEl.innerHTML = sorted.map((entry, idx) => `
    <div class="best-seller-item">
      <div style="display:flex; align-items:center;">
        <span class="bs-rank">#${idx + 1}</span>
        <strong>${escapeHtml(entry[0])}</strong>
      </div>
      <div style="text-align:right;">
        <span class="text-gold" style="font-weight:700;">${entry[1].qty} sold</span>
        <small class="text-muted" style="display:block;">Rs. ${entry[1].revenue.toLocaleString()}</small>
      </div>
    </div>
  `).join('');
}

function renderRecentOrdersTable() {
  const tbody = document.getElementById('dashboardRecentOrdersBody');
  if (!tbody) return;
  const recents = storeOrders.slice(0, 6);
  if (recents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No customer orders placed yet.</td></tr>';
    return;
  }

  tbody.innerHTML = recents.map(o => {
    const it = o.items ? o.items.map(i => `${i.name} x${i.qty}`).join(', ') : 'Order items';
    return `
      <tr>
        <td><strong style="color:var(--gold-primary);">${escapeHtml(o.id)}</strong></td>
        <td><strong>${escapeHtml(o.name || 'Anonymous')}</strong></td>
        <td><span title="${escapeHtml(it)}" style="max-width:140px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(it)}</span></td>
        <td><strong class="text-forest">Rs. ${(o.total || 0).toLocaleString()}</strong></td>
        <td><span class="status-badge status-${(o.status || 'pending').toLowerCase()}">${escapeHtml(o.status || 'Pending')}</span></td>
        <td><button class="btn btn-outline-gold btn-xs" onclick="openOrderDetailModal('${escapeHtml(o.id)}')"><i class="fa-solid fa-eye"></i> Details</button></td>
      </tr>
    `;
  }).join('');
}

// ========== 5. ORDERS ENGINE (8 STATUSES + TIMELINE + NOTES) ==========

function renderOrdersMasterTable() {
  const tbody = document.getElementById('ordersMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('orderSearchInput')?.value || '').trim().toLowerCase();
  const sf = document.getElementById('orderStatusFilterSelect')?.value || 'ALL';
  const so = document.getElementById('orderSortSelect')?.value || 'newest';

  // Update tab counts
  updateOrderStatusTabCounts();

  let filtered = [...storeOrders];
  if (sf !== 'ALL') {
    filtered = filtered.filter(o => o.status === sf);
  }
  if (q) {
    filtered = filtered.filter(o =>
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  }

  if (so === 'newest') filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  else if (so === 'oldest') filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  else if (so === 'highest') filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
  else if (so === 'lowest') filtered.sort((a, b) => (a.total || 0) - (b.total || 0));

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted" style="padding:32px;">No orders found matching criteria.</td></tr>';
    return;
  }

  const allStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];

  tbody.innerHTML = filtered.map(o => {
    const d = o.timestamp ? new Date(o.timestamp).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
    const it = o.items ? o.items.map(i => `${i.name} x${i.qty}`).join(', ') : 'Order';
    const cp = (o.address || '').split(',');
    const city = cp.length > 1 ? cp[cp.length - 1].trim() : (o.address || 'PK');
    const wa = 'https://wa.me/92' + (o.phone || '').replace(/^0/, '').replace(/\s+/g, '');
    const notesCount = (o.adminNotes || []).length;

    const statusOptions = allStatuses.map(s =>
      `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    return `
      <tr>
        <td><strong style="color:var(--gold-primary);">${escapeHtml(o.id)}</strong></td>
        <td><small>${d}</small></td>
        <td><strong>${escapeHtml(o.name || 'Anonymous')}</strong></td>
        <td><a href="${wa}" target="_blank" class="text-gold" style="text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> ${escapeHtml(o.phone || 'N/A')}</a></td>
        <td>${escapeHtml(city)}</td>
        <td><span title="${escapeHtml(it)}" style="max-width:140px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(it)}</span></td>
        <td><strong class="text-forest">Rs. ${(o.total || 0).toLocaleString()}</strong></td>
        <td>
          <select onchange="updateOrderStatus('${escapeHtml(o.id)}', this.value)" class="status-quick-select status-badge status-${(o.status || 'pending').toLowerCase()}" style="font-size:0.75rem; padding:4px 6px;">
            ${statusOptions}
          </select>
        </td>
        <td>
          ${notesCount > 0
            ? `<span class="badge-gold" style="padding:2px 6px; border-radius:4px; font-size:0.72rem; cursor:pointer;" onclick="openOrderDetailModal('${escapeHtml(o.id)}')"><i class="fa-solid fa-note-sticky"></i> ${notesCount}</span>`
            : '<small class="text-muted">--</small>'}
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-outline-gold btn-xs" onclick="openOrderDetailModal('${escapeHtml(o.id)}')"><i class="fa-solid fa-eye"></i> Details</button>
            ${o.status !== 'Cancelled' ? `<button class="btn btn-outline-red btn-xs" onclick="cancelOrderPrompt('${escapeHtml(o.id)}')"><i class="fa-solid fa-ban"></i></button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatusTabCounts() {
  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];
  setElemText('tabCountAll', storeOrders.length);
  statuses.forEach(s => {
    const c = storeOrders.filter(o => o.status === s).length;
    setElemText('tabCount' + s, c);
  });
}

function updateOrderStatus(orderId, newStatus, optionalNote = '') {
  const order = storeOrders.find(o => o.id === orderId);
  if (!order) return;
  const prevStatus = order.status;
  if (prevStatus === newStatus) return;

  const sess = getActiveSession();
  const authorName = sess ? sess.name : 'Zaib Babar';

  order.status = newStatus;
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.unshift({
    status: newStatus,
    timestamp: Date.now(),
    by: authorName,
    note: optionalNote || `Status changed from ${prevStatus} to ${newStatus}`
  });

  // Deduct stock if order is confirmed/processing/delivered (once only!)
  if (['Confirmed', 'Processing', 'Delivered'].includes(newStatus)) {
    deductStockForOrder(order);
  }

  localStorage.setItem('dtl_orders', JSON.stringify(storeOrders));
  logActivity(`Order Status Changed`, `Order ${orderId} updated to ${newStatus} by ${authorName}`, 'ORDERS');

  if (newStatus === 'Cancelled') {
    addNotification('CANCEL', `Order Cancelled: ${orderId}`, `Order for ${order.name || 'Customer'} was cancelled.`, 'orders', orderId);
  }

  showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Order <strong>${orderId}</strong> set to <strong>${newStatus}</strong>`);
  refreshStoreData();
}

function cancelOrderPrompt(orderId) {
  const order = storeOrders.find(o => o.id === orderId);
  if (!order) return;
  if (!confirm(`Are you sure you want to cancel order ${orderId} for ${order.name || 'Customer'}?`)) return;
  updateOrderStatus(orderId, 'Cancelled', 'Cancelled manually by Admin');
}

// Order Detail Modal
function openOrderDetailModal(orderId) {
  const o = storeOrders.find(x => x.id === orderId);
  if (!o) return;
  activeOrderForModal = o;

  document.getElementById('modalOrderRefTitle').textContent = `Order ${o.id}`;
  document.getElementById('modalOrderTimestampText').textContent = `Placed on: ${o.timestamp ? new Date(o.timestamp).toLocaleString('en-PK') : 'N/A'}`;
  document.getElementById('modalStatusSelect').value = o.status || 'Pending';

  renderOrderInvoiceSlip(o);
  renderOrderTimelineList(o);
  renderOrderAdminNotesList(o);

  switchOrderModalTab('invoice');
  document.getElementById('orderDetailModal')?.classList.add('active');
}

function closeOrderDetailModal() {
  document.getElementById('orderDetailModal')?.classList.remove('active');
  activeOrderForModal = null;
}

function switchOrderModalTab(tab) {
  document.querySelectorAll('.order-subnav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-sub') === tab);
  });
  document.querySelectorAll('.order-modal-tab-content').forEach(c => {
    c.style.display = 'none';
  });

  if (tab === 'invoice') document.getElementById('orderModalTabInvoice').style.display = 'block';
  if (tab === 'timeline') document.getElementById('orderModalTabTimeline').style.display = 'block';
  if (tab === 'notes') document.getElementById('orderModalTabNotes').style.display = 'block';
}

function renderOrderInvoiceSlip(o) {
  const container = document.getElementById('orderModalTabInvoice');
  if (!container) return;

  const items = o.items || [];
  const subtotal = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const shipping = o.total > subtotal ? o.total - subtotal : (subtotal >= 5000 ? 0 : 250);

  const itemRows = items.map(i => `
    <tr>
      <td><strong>${escapeHtml(i.name)}</strong></td>
      <td style="text-align:center;">${i.qty}</td>
      <td style="text-align:right;">Rs. ${(i.price || 0).toLocaleString()}</td>
      <td style="text-align:right;"><strong>Rs. ${((i.price || 0) * (i.qty || 1)).toLocaleString()}</strong></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="invoice-brand-row">
      <div>
        <h2 style="font-size:1.3rem;color:var(--gold-primary);font-weight:900;">DESI TASTE LAND</h2>
        <p style="font-size:0.8rem;color:var(--text-muted);">100% Pure Organic Goodness | Cash on Delivery</p>
      </div>
      <div style="text-align:right;">
        <h3 style="font-size:1.1rem;font-weight:800;">INVOICE SLIP</h3>
        <p style="font-size:0.82rem;font-weight:700;">Ref: <span style="color:var(--red-primary);">${escapeHtml(o.id)}</span></p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
        <h4 style="font-size:0.82rem;color:var(--gold-primary);margin-bottom:6px;"><i class="fa-solid fa-user"></i> Customer Info</h4>
        <p style="font-size:0.85rem;"><strong>Name:</strong> ${escapeHtml(o.name || 'N/A')}</p>
        <p style="font-size:0.85rem;"><strong>Phone:</strong> ${escapeHtml(o.phone || 'N/A')}</p>
        <p style="font-size:0.85rem;"><strong>Payment:</strong> Cash on Delivery (COD)</p>
      </div>
      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
        <h4 style="font-size:0.82rem;color:var(--gold-primary);margin-bottom:6px;"><i class="fa-solid fa-location-dot"></i> Shipping Destination</h4>
        <p style="font-size:0.85rem;">${escapeHtml(o.address || 'Not provided')}</p>
      </div>
    </div>

    <table class="invoice-items-table">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="margin-left:auto;width:260px;text-align:right;font-size:0.88rem;margin-top:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Subtotal:</span><strong>Rs. ${subtotal.toLocaleString()}</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Delivery Charges:</span><span>${shipping === 0 ? '<span style="color:var(--forest-primary);font-weight:700;">FREE</span>' : 'Rs. ' + shipping.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;border-top:2px solid var(--border-gold);padding-top:8px;font-size:1.05rem;"><span style="font-weight:800;">Grand Total:</span><strong class="text-forest">Rs. ${(o.total || 0).toLocaleString()}</strong></div>
    </div>
  `;
}

function renderOrderTimelineList(o) {
  const container = document.getElementById('orderModalTimelineList');
  if (!container) return;

  const history = o.statusHistory || [
    { status: o.status || 'Pending', timestamp: o.timestamp || Date.now(), by: 'Customer Checkout', note: 'Order placed online' }
  ];

  container.innerHTML = history.map(h => `
    <div class="timeline-step">
      <div class="timeline-step-title text-gold">${escapeHtml(h.status)}</div>
      <div class="timeline-step-meta">Updated by <strong>${escapeHtml(h.by || 'Admin')}</strong> on ${new Date(h.timestamp).toLocaleString()}</div>
      ${h.note ? `<div class="timeline-step-note">${escapeHtml(h.note)}</div>` : ''}
    </div>
  `).join('');
}

function renderOrderAdminNotesList(o) {
  const container = document.getElementById('modalAdminNotesList');
  const countEl = document.getElementById('modalNotesCount');
  if (!container) return;

  const notes = o.adminNotes || [];
  if (countEl) countEl.textContent = notes.length;

  if (notes.length === 0) {
    container.innerHTML = '<p class="text-muted text-center" style="padding:16px;">No private admin notes added yet.</p>';
    return;
  }

  container.innerHTML = notes.map(n => `
    <div class="note-card">
      <div class="note-header">
        <span class="note-author"><i class="fa-solid fa-user-pen"></i> ${escapeHtml(n.by || 'Admin')}</span>
        <span>${new Date(n.timestamp).toLocaleString()}</span>
      </div>
      <div class="note-text">${escapeHtml(n.text)}</div>
    </div>
  `).join('');
}

function saveAdminNoteForOrder() {
  if (!activeOrderForModal) return;
  const input = document.getElementById('modalNewAdminNoteInput');
  const text = (input?.value || '').trim();
  if (!text) {
    showToast('Please type a note first.');
    return;
  }

  const sess = getActiveSession();
  if (!activeOrderForModal.adminNotes) activeOrderForModal.adminNotes = [];
  activeOrderForModal.adminNotes.unshift({
    text: text,
    timestamp: Date.now(),
    by: sess ? sess.name : 'Zaib Babar'
  });

  localStorage.setItem('dtl_orders', JSON.stringify(storeOrders));
  logActivity(`Added Admin Note`, `Note on Order ${activeOrderForModal.id}: "${text.substring(0, 30)}..."`, 'ORDERS');
  input.value = '';
  renderOrderAdminNotesList(activeOrderForModal);
  renderOrdersMasterTable();
  showToast('<i class="fa-solid fa-note-sticky text-gold"></i> Admin note saved!');
}

function saveModalOrderStatus() {
  if (!activeOrderForModal) return;
  const newStatus = document.getElementById('modalStatusSelect')?.value;
  if (newStatus) {
    updateOrderStatus(activeOrderForModal.id, newStatus);
    closeOrderDetailModal();
  }
}

function cancelCurrentModalOrder() {
  if (!activeOrderForModal) return;
  cancelOrderPrompt(activeOrderForModal.id);
  closeOrderDetailModal();
}

function printInvoice() { window.print(); }

// ========== 6. INVENTORY MANAGEMENT (NO DOUBLE DEDUCTION) ==========

function renderInventoryMasterTable() {
  const tbody = document.getElementById('inventoryMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('inventorySearchInput')?.value || '').trim().toLowerCase();
  const filterTab = document.querySelector('#inventoryFilterTabs .status-tab.active')?.getAttribute('data-filter') || 'ALL';

  const products = getAllProductsCombined();

  // Counts for tabs
  let inStockCount = 0, lowStockCount = 0, outStockCount = 0;
  products.forEach(p => {
    const inv = storeInventory[p.id] || { stock: 50, threshold: 8 };
    if (inv.stock === 0) outStockCount++;
    else if (inv.stock <= inv.threshold) lowStockCount++;
    else inStockCount++;
  });

  setElemText('invCountAll', products.length);
  setElemText('invCountInStock', inStockCount);
  setElemText('invCountLow', lowStockCount);
  setElemText('invCountOut', outStockCount);

  let filtered = products.filter(p => {
    const inv = storeInventory[p.id] || { stock: 50, threshold: 8 };
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.urduName && p.urduName.includes(q));
    if (!matchesQuery) return false;

    if (filterTab === 'IN_STOCK') return inv.stock > inv.threshold;
    if (filterTab === 'LOW_STOCK') return inv.stock > 0 && inv.stock <= inv.threshold;
    if (filterTab === 'OUT_OF_STOCK') return inv.stock === 0;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:32px;">No products match inventory filter.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const inv = storeInventory[p.id] || { stock: 50, threshold: 8, lastUpdated: Date.now() };
    const isOut = inv.stock === 0;
    const isLow = inv.stock > 0 && inv.stock <= inv.threshold;
    const badgeClass = isOut ? 'out-stock' : isLow ? 'low-stock' : 'in-stock';
    const badgeText = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock';
    const d = inv.lastUpdated ? new Date(inv.lastUpdated).toLocaleDateString() : 'N/A';

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:36px;height:36px;border-radius:4px;object-fit:cover;border:1px solid var(--border-color);">
            <div>
              <strong>${escapeHtml(p.name)}</strong>
              <small class="text-muted" style="display:block;">${escapeHtml(p.weight || '500g')}</small>
            </div>
          </div>
        </td>
        <td><span class="badge-gold" style="padding:3px 8px;border-radius:4px;font-size:0.75rem;">${escapeHtml(p.category || 'General')}</span></td>
        <td>
          <div class="stock-adjust-group">
            <button class="btn-qty-mini" onclick="adjustProductStock('${p.id}', -1)">-</button>
            <input type="number" value="${inv.stock}" min="0" style="width:60px; text-align:center; background:var(--bg-input); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:3px;" onchange="setExactProductStock('${p.id}', this.value)">
            <button class="btn-qty-mini" onclick="adjustProductStock('${p.id}', 1)">+</button>
          </div>
        </td>
        <td><span class="stock-badge ${badgeClass}"><i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> ${badgeText}</span></td>
        <td>
          <input type="number" value="${inv.threshold}" min="1" style="width:50px; text-align:center; background:var(--bg-input); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:3px;" onchange="setProductThreshold('${p.id}', this.value)">
        </td>
        <td><small class="text-muted">${d}</small></td>
        <td>
          <button class="btn btn-outline-forest btn-xs" onclick="adjustProductStock('${p.id}', 10)">+10 Units</button>
        </td>
      </tr>
    `;
  }).join('');
}

function adjustProductStock(prodId, delta) {
  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  if (!storeInventory[prodId]) storeInventory[prodId] = { stock: 50, threshold: 8, lastUpdated: Date.now() };

  storeInventory[prodId].stock = Math.max(0, (storeInventory[prodId].stock || 0) + delta);
  storeInventory[prodId].lastUpdated = Date.now();
  localStorage.setItem('dtl_inventory', JSON.stringify(storeInventory));

  logActivity('Stock Quantity Adjusted', `Adjusted stock for product ${prodId} by ${delta} (Now: ${storeInventory[prodId].stock})`, 'INVENTORY');
  refreshStoreData();
}

function setExactProductStock(prodId, value) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) return;
  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  if (!storeInventory[prodId]) storeInventory[prodId] = { stock: 50, threshold: 8, lastUpdated: Date.now() };

  storeInventory[prodId].stock = num;
  storeInventory[prodId].lastUpdated = Date.now();
  localStorage.setItem('dtl_inventory', JSON.stringify(storeInventory));

  logActivity('Stock Set Manually', `Stock for product ${prodId} set to ${num}`, 'INVENTORY');
  refreshStoreData();
}

function setProductThreshold(prodId, value) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 1) return;
  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  if (!storeInventory[prodId]) storeInventory[prodId] = { stock: 50, threshold: 8, lastUpdated: Date.now() };

  storeInventory[prodId].threshold = num;
  storeInventory[prodId].lastUpdated = Date.now();
  localStorage.setItem('dtl_inventory', JSON.stringify(storeInventory));
  showToast('Low stock threshold updated to ' + num);
  refreshStoreData();
}

// Crucial: Auto-deduct inventory for orders WITHOUT double deduction
function deductStockForOrder(order) {
  if (!order || !order.id || !order.items) return;
  stockDeductedOrders = JSON.parse(localStorage.getItem('dtl_stock_deducted_orders') || '[]');

  // Check if this order has ALREADY had its stock deducted
  if (stockDeductedOrders.includes(order.id)) {
    return; // NEVER deduct twice!
  }

  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  let deductedAny = false;

  order.items.forEach(item => {
    const pId = item.id;
    if (pId) {
      if (!storeInventory[pId]) storeInventory[pId] = { stock: 50, threshold: 8, lastUpdated: Date.now() };
      const deductQty = item.qty || 1;
      storeInventory[pId].stock = Math.max(0, storeInventory[pId].stock - deductQty);
      storeInventory[pId].lastUpdated = Date.now();
      deductedAny = true;
    }
  });

  if (deductedAny) {
    stockDeductedOrders.push(order.id);
    localStorage.setItem('dtl_stock_deducted_orders', JSON.stringify(stockDeductedOrders));
    localStorage.setItem('dtl_inventory', JSON.stringify(storeInventory));
    logActivity('Stock Deducted for Order', `Stock decremented for Order ${order.id}`, 'INVENTORY');
  }
}

function checkInventoryAlerts() {
  const products = getAllProductsCombined();
  products.forEach(p => {
    const inv = storeInventory[p.id] || { stock: 50, threshold: 8 };
    if (inv.stock === 0) {
      addNotification('STOCK', `Out of Stock: ${p.name}`, `Product is completely out of stock. Please replenish!`, 'inventory', p.id);
    } else if (inv.stock <= inv.threshold) {
      addNotification('STOCK', `Low Stock Alert: ${p.name}`, `Only ${inv.stock} units remaining (Threshold: ${inv.threshold}).`, 'inventory', p.id);
    }
  });
}

function exportInventoryCSV() {
  const products = getAllProductsCombined();
  const csv = [
    'Product ID,Name,Category,Weight,Base Price,Stock Quantity,Threshold,Status',
    ...products.map(p => {
      const inv = storeInventory[p.id] || { stock: 50, threshold: 8 };
      const status = inv.stock === 0 ? 'Out of Stock' : inv.stock <= inv.threshold ? 'Low Stock' : 'In Stock';
      return `"${p.id}","${p.name}","${p.category || 'General'}","${p.weight || ''}",${p.price || 0},${inv.stock},${inv.threshold},"${status}"`;
    })
  ].join('\n');

  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `DTL_INVENTORY_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('<i class="fa-solid fa-file-csv text-forest"></i> Inventory CSV exported!');
}

// ========== 7. CUSTOMERS & CUSTOMER PROFILE DOSSIER ==========

function renderCustomersMasterTable() {
  const tbody = document.getElementById('customersMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('customerSearchInput')?.value || '').trim().toLowerCase();
  const statusFilter = document.getElementById('customerStatusFilter')?.value || 'ALL';

  // Ensure all customers have unique IDs
  let needsSave = false;
  storeCustomers.forEach((c, i) => {
    if (!c.id) {
      c.id = 'usr_' + Date.now() + '_' + i;
      needsSave = true;
    }
  });
  if (needsSave) localStorage.setItem('dtl_registered_users', JSON.stringify(storeCustomers));

  let filtered = storeCustomers.filter(c => {
    const matchesQ = !q ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q));
    if (!matchesQ) return false;

    if (statusFilter === 'active') return c.status !== 'disabled';
    if (statusFilter === 'disabled') return c.status === 'disabled';
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:32px;">No registered customers in database.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const safeId = escapeHtml(c.id);
    const regDate = c.registeredAt ? new Date(c.registeredAt).toLocaleDateString() : 'Active Buyer';
    const custOrders = getOrdersForCustomer(c);
    const totalOrders = custOrders.length;
    const totalSpent = custOrders.filter(o => o.status !== 'Cancelled')
                                .reduce((s, o) => s + (o.total || 0), 0);
    const lastOrder = custOrders.length > 0 ? new Date(custOrders[0].timestamp).toLocaleDateString() : 'None';
    const isDisabled = c.status === 'disabled';

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:34px;height:34px;border-radius:50%;background:var(--gold-glow);border:1px solid var(--border-gold);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--gold-primary);">
              ${(c.name || 'U').charAt(0).toUpperCase()}
            </div>
            <strong>${escapeHtml(c.name || 'Unknown')}</strong>
          </div>
        </td>
        <td>${escapeHtml(c.phone || 'N/A')}</td>
        <td>${escapeHtml(c.email || 'N/A')}</td>
        <td><small>${regDate}</small></td>
        <td>
          <button class="btn btn-outline-gold btn-xs" onclick="openCustomerProfileModal('${safeId}')" title="View Customer Dossier">
            <i class="fa-solid fa-box"></i> ${totalOrders} Orders
          </button>
        </td>
        <td><strong class="text-forest">Rs. ${totalSpent.toLocaleString()}</strong></td>
        <td><small>${lastOrder}</small></td>
        <td>
          <span class="status-badge ${isDisabled ? 'disabled-user' : 'active-user'}">
            ${isDisabled ? 'Disabled' : 'Active'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-outline-gold btn-xs" onclick="openCustomerProfileModal('${safeId}')" title="Dossier"><i class="fa-solid fa-id-card"></i></button>
            <button class="btn ${isDisabled ? 'btn-outline-forest' : 'btn-outline-gold'} btn-xs" onclick="toggleCustomerStatus('${safeId}')">${isDisabled ? 'Enable' : 'Disable'}</button>
            <button class="btn btn-outline-red btn-xs" onclick="deleteCustomerAccount('${safeId}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getOrdersForCustomer(cust) {
  if (!cust) return [];
  const pClean = (cust.phone || '').replace(/\s+/g, '');
  const eClean = (cust.email || '').toLowerCase().trim();

  return storeOrders.filter(o => {
    const oPhone = (o.phone || '').replace(/\s+/g, '');
    const oEmail = (o.email || '').toLowerCase().trim();
    return (pClean && oPhone && oPhone === pClean) || (eClean && oEmail && oEmail === eClean);
  });
}

function openCustomerProfileModal(userId) {
  const cust = storeCustomers.find(c => c.id === userId);
  if (!cust) return;

  const orders = getOrdersForCustomer(cust);
  const totalSpent = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const aov = orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;
  const isDis = cust.status === 'disabled';

  setElemText('custProfName', cust.name || 'Customer Dossier');
  setElemText('custProfJoined', `Registered: ${cust.registeredAt ? new Date(cust.registeredAt).toLocaleDateString() : 'Active Buyer'}`);
  setElemText('custProfTotalOrders', orders.length);
  setElemText('custProfTotalSpend', 'Rs. ' + totalSpent.toLocaleString());
  setElemText('custProfAOV', 'Rs. ' + aov.toLocaleString());
  setElemText('custProfStatus', isDis ? 'Disabled / Blocked' : 'Active');
  setElemText('custProfPhone', cust.phone || 'None');
  setElemText('custProfEmail', cust.email || 'None');

  const ordersBody = document.getElementById('custProfOrdersBody');
  if (ordersBody) {
    if (orders.length === 0) {
      ordersBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No purchase orders placed by this customer yet.</td></tr>';
    } else {
      ordersBody.innerHTML = orders.map(o => `
        <tr>
          <td><strong style="color:var(--gold-primary);">${escapeHtml(o.id)}</strong></td>
          <td><small>${new Date(o.timestamp).toLocaleDateString()}</small></td>
          <td>${(o.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}</td>
          <td><strong class="text-forest">Rs. ${(o.total||0).toLocaleString()}</strong></td>
          <td><span class="status-badge status-${(o.status||'pending').toLowerCase()}">${escapeHtml(o.status||'Pending')}</span></td>
          <td><button class="btn btn-outline-gold btn-xs" onclick="openOrderDetailModal('${escapeHtml(o.id)}')"><i class="fa-solid fa-eye"></i> Details</button></td>
        </tr>
      `).join('');
    }
  }

  const actControls = document.getElementById('custProfActionControls');
  if (actControls) {
    actControls.innerHTML = `
      <button class="btn ${isDis ? 'btn-outline-forest' : 'btn-outline-gold'} btn-sm" onclick="toggleCustomerStatus('${cust.id}'); closeCustomerProfileModal();">
        ${isDis ? '<i class=\"fa-solid fa-user-check\"></i> Enable Account' : '<i class=\"fa-solid fa-ban\"></i> Disable Account'}
      </button>
      <button class="btn btn-outline-red btn-sm" style="margin-left:8px;" onclick="deleteCustomerAccount('${cust.id}'); closeCustomerProfileModal();">
        <i class="fa-solid fa-trash"></i> Delete Account
      </button>
    `;
  }

  document.getElementById('customerProfileModal')?.classList.add('active');
}

function closeCustomerProfileModal() {
  document.getElementById('customerProfileModal')?.classList.remove('active');
}

function toggleCustomerStatus(userId) {
  const cust = storeCustomers.find(c => c.id === userId);
  if (!cust) return;
  cust.status = cust.status === 'disabled' ? 'active' : 'disabled';
  localStorage.setItem('dtl_registered_users', JSON.stringify(storeCustomers));
  logActivity('Customer Status Changed', `Customer ${cust.name} set to ${cust.status.toUpperCase()}`, 'SETTINGS');
  showToast(`Customer <strong>${cust.name}</strong> is now <strong>${cust.status.toUpperCase()}</strong>`);
  refreshStoreData();
}

function deleteCustomerAccount(userId) {
  const cust = storeCustomers.find(c => c.id === userId);
  if (!cust) return;
  if (!confirm(`Are you sure you want to permanently delete "${cust.name}"? They will be removed from the store and logged out immediately.`)) return;

  storeCustomers = storeCustomers.filter(c => c.id !== userId);

  // Clear session if customer is currently logged in on storefront
  try {
    const activeU = JSON.parse(localStorage.getItem('dtl_user') || 'null');
    if (activeU && (activeU.phone === cust.phone || activeU.email === cust.email)) {
      localStorage.removeItem('dtl_user');
    }
  } catch(e) {}

  localStorage.setItem('dtl_registered_users', JSON.stringify(storeCustomers));
  logActivity('Customer Account Deleted', `Permanently deleted customer account: ${cust.name}`, 'SETTINGS');
  showToast(`<i class="fa-solid fa-trash text-red"></i> Customer <strong>${cust.name}</strong> permanently deleted.`);
  refreshStoreData();
}

function exportCustomersCSV() {
  if (storeCustomers.length === 0) { showToast('No customers to export.'); return; }
  const csv = [
    'Customer ID,Name,Phone,Email,Total Orders,Total Spent,Status',
    ...storeCustomers.map(c => {
      const orders = getOrdersForCustomer(c);
      const spent = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0);
      return `"${c.id}","${c.name || ''}","${c.phone || ''}","${c.email || ''}",${orders.length},${spent},"${c.status || 'active'}"`;
    })
  ].join('\n');

  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `DTL_CUSTOMERS_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('<i class="fa-solid fa-file-csv text-forest"></i> Customers CSV exported!');
}

// ========== 8. COUPONS & DISCOUNTS ==========

function renderCouponsMasterTable() {
  const tbody = document.getElementById('couponsMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('couponSearchInput')?.value || '').trim().toUpperCase();
  const sf = document.getElementById('couponStatusFilter')?.value || 'ALL';

  let filtered = storeCoupons.filter(c => {
    const matchesQ = !q || c.code.toUpperCase().includes(q);
    if (!matchesQ) return false;
    if (sf === 'active') return c.status === 'active';
    if (sf === 'inactive') return c.status === 'inactive';
    if (sf === 'expired') return isCouponExpired(c);
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:32px;">No discount coupons found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const isExp = isCouponExpired(c);
    const discStr = c.type === 'percentage' ? `${c.value}% OFF` : `Rs. ${c.value} OFF`;
    const usageStr = c.usageLimit > 0 ? `${c.usedCount || 0} / ${c.usageLimit}` : `${c.usedCount || 0} / ∞`;
    const statusLabel = isExp ? 'Expired' : (c.status === 'active' ? 'Active' : 'Inactive');
    const statusClass = isExp ? 'status-cancelled' : (c.status === 'active' ? 'status-delivered' : 'status-pending');

    return `
      <tr>
        <td><span class="coupon-code-pill">${escapeHtml(c.code)}</span></td>
        <td><strong class="text-gold">${discStr}</strong></td>
        <td><small style="text-transform:capitalize;">${c.type}</small></td>
        <td>${c.minOrder > 0 ? 'Rs. ' + c.minOrder.toLocaleString() : 'No min.'}</td>
        <td><strong>${usageStr}</strong></td>
        <td><small>${c.expiryDate || 'Never'}</small></td>
        <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-outline-gold btn-xs" onclick="toggleCouponStatus('${c.id}')">${c.status === 'active' ? 'Deactivate' : 'Activate'}</button>
            <button class="btn btn-outline-red btn-xs" onclick="deleteCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function isCouponExpired(c) {
  if (!c.expiryDate) return false;
  return new Date(c.expiryDate).setHours(23,59,59,999) < Date.now();
}

function openCouponModal() {
  document.getElementById('couponForm')?.reset();
  document.getElementById('couponFormId').value = '';
  document.getElementById('couponModalTitle').textContent = 'Create Discount Coupon';
  document.getElementById('couponModal')?.classList.add('active');
}

function closeCouponModal() {
  document.getElementById('couponModal')?.classList.remove('active');
}

function handleCouponTypeChange() {
  const type = document.getElementById('cFormType')?.value;
  const lbl = document.getElementById('cFormValueLabel');
  const val = document.getElementById('cFormValue');
  if (type === 'percentage') {
    if (lbl) lbl.textContent = 'Discount Percentage (%) *';
    if (val) { val.max = '100'; val.placeholder = '10'; }
  } else {
    if (lbl) lbl.textContent = 'Discount Amount (PKR) *';
    if (val) { val.removeAttribute('max'); val.placeholder = '500'; }
  }
}

function handleCouponFormSubmit(e) {
  e.preventDefault();
  const code = (document.getElementById('cFormCode')?.value || '').trim().toUpperCase();
  const type = document.getElementById('cFormType')?.value;
  const value = parseInt(document.getElementById('cFormValue')?.value || '0', 10);
  const minOrder = parseInt(document.getElementById('cFormMinOrder')?.value || '0', 10);
  const usageLimit = parseInt(document.getElementById('cFormUsageLimit')?.value || '0', 10);
  const expiryDate = document.getElementById('cFormExpiry')?.value || '';
  const status = document.getElementById('cFormStatus')?.value || 'active';

  if (!code || value <= 0) {
    showToast('Please enter a valid coupon code and discount value.');
    return;
  }

  storeCoupons = JSON.parse(localStorage.getItem('dtl_coupons') || '[]');
  const existingIdx = storeCoupons.findIndex(c => c.code.toUpperCase() === code);

  const couponObj = {
    id: 'cpn_' + Date.now(),
    code: code,
    type: type,
    value: value,
    minOrder: minOrder,
    usageLimit: usageLimit,
    usedCount: 0,
    expiryDate: expiryDate,
    status: status,
    createdAt: Date.now()
  };

  if (existingIdx >= 0) {
    couponObj.id = storeCoupons[existingIdx].id;
    couponObj.usedCount = storeCoupons[existingIdx].usedCount || 0;
    storeCoupons[existingIdx] = couponObj;
    showToast(`Coupon <strong>${code}</strong> updated!`);
  } else {
    storeCoupons.unshift(couponObj);
    showToast(`New Coupon <strong>${code}</strong> created!`);
  }

  localStorage.setItem('dtl_coupons', JSON.stringify(storeCoupons));
  logActivity('Coupon Saved', `Coupon ${code} (${type}: ${value}) created/updated`, 'COUPONS');
  closeCouponModal();
  refreshStoreData();
}

function toggleCouponStatus(id) {
  storeCoupons = JSON.parse(localStorage.getItem('dtl_coupons') || '[]');
  const c = storeCoupons.find(x => x.id === id);
  if (!c) return;
  c.status = c.status === 'active' ? 'inactive' : 'active';
  localStorage.setItem('dtl_coupons', JSON.stringify(storeCoupons));
  logActivity('Coupon Status Toggle', `Coupon ${c.code} status toggled to ${c.status}`, 'COUPONS');
  showToast(`Coupon <strong>${c.code}</strong> is now <strong>${c.status.toUpperCase()}</strong>`);
  refreshStoreData();
}

function deleteCoupon(id) {
  storeCoupons = JSON.parse(localStorage.getItem('dtl_coupons') || '[]');
  const c = storeCoupons.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`Permanently delete coupon "${c.code}"?`)) return;

  storeCoupons = storeCoupons.filter(x => x.id !== id);
  localStorage.setItem('dtl_coupons', JSON.stringify(storeCoupons));
  logActivity('Coupon Deleted', `Deleted coupon ${c.code}`, 'COUPONS');
  showToast(`<i class="fa-solid fa-trash text-red"></i> Coupon <strong>${c.code}</strong> deleted.`);
  refreshStoreData();
}

// ========== 9. REVIEWS MANAGEMENT ==========

function renderReviewsMasterTable() {
  const tbody = document.getElementById('reviewsMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('reviewSearchInput')?.value || '').trim().toLowerCase();
  const rf = document.getElementById('reviewRatingFilter')?.value || 'ALL';
  const filterTab = document.querySelector('#reviewStatusTabs .status-tab.active')?.getAttribute('data-status') || 'ALL';

  // Counts
  setElemText('revCountAll', storeReviews.length);
  setElemText('revCountPending', storeReviews.filter(r => r.status === 'pending').length);
  setElemText('revCountApproved', storeReviews.filter(r => r.status === 'approved').length);
  setElemText('revCountHidden', storeReviews.filter(r => r.status === 'hidden').length);

  let filtered = storeReviews.filter(r => {
    const matchesQ = !q ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q)) ||
      (r.comment && r.comment.toLowerCase().includes(q));
    if (!matchesQ) return false;

    if (rf !== 'ALL' && parseInt(rf, 10) !== r.rating) return false;
    if (filterTab !== 'ALL' && r.status !== filterTab) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:32px;">No customer reviews match filter criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
    const statusClass = r.status === 'approved' ? 'status-delivered' : r.status === 'pending' ? 'status-pending' : 'status-cancelled';

    return `
      <tr>
        <td>
          <strong>${escapeHtml(r.name || 'Anonymous')}</strong>
          <small class="text-muted" style="display:block;">${escapeHtml(r.city || 'Pakistan')}</small>
        </td>
        <td><span class="rating-stars-gold">${stars}</span></td>
        <td style="max-width:240px;"><p style="margin:0;font-size:0.85rem;line-height:1.4;">"${escapeHtml(r.comment || '')}"</p></td>
        <td><small class="badge-gold" style="padding:2px 6px;border-radius:4px;">${escapeHtml(r.product || 'General')}</small></td>
        <td><small>${r.date || 'Recent'}</small></td>
        <td><span class="status-badge ${statusClass}">${escapeHtml((r.status||'pending').toUpperCase())}</span></td>
        <td>
          <button class="btn-text-gold" onclick="toggleReviewFeatured('${r.id}')" title="Toggle Featured">
            <i class="fa-${r.featured ? 'solid' : 'regular'} fa-star ${r.featured ? 'text-gold' : 'text-muted'}"></i>
          </button>
        </td>
        <td>
          <div style="display:flex;gap:4px;">
            ${r.status !== 'approved' ? `<button class="btn btn-outline-forest btn-xs" onclick="setReviewStatus('${r.id}', 'approved')"><i class="fa-solid fa-check"></i> Approve</button>` : ''}
            ${r.status !== 'hidden' ? `<button class="btn btn-outline-gold btn-xs" onclick="setReviewStatus('${r.id}', 'hidden')"><i class="fa-solid fa-eye-slash"></i> Hide</button>` : ''}
            <button class="btn btn-outline-red btn-xs" onclick="deleteReview('${r.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function setReviewStatus(id, newStatus) {
  storeReviews = JSON.parse(localStorage.getItem('dtl_reviews') || '[]');
  const r = storeReviews.find(x => x.id === id);
  if (!r) return;
  r.status = newStatus;
  localStorage.setItem('dtl_reviews', JSON.stringify(storeReviews));
  logActivity('Review Status Changed', `Review from ${r.name} marked as ${newStatus}`, 'REVIEWS');
  showToast(`Review status updated to <strong>${newStatus.toUpperCase()}</strong>`);
  refreshStoreData();
}

function toggleReviewFeatured(id) {
  storeReviews = JSON.parse(localStorage.getItem('dtl_reviews') || '[]');
  const r = storeReviews.find(x => x.id === id);
  if (!r) return;
  r.featured = !r.featured;
  localStorage.setItem('dtl_reviews', JSON.stringify(storeReviews));
  showToast(r.featured ? `Review from <strong>${r.name}</strong> marked as Featured!` : 'Removed from Featured');
  refreshStoreData();
}

function deleteReview(id) {
  storeReviews = JSON.parse(localStorage.getItem('dtl_reviews') || '[]');
  const r = storeReviews.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`Delete review from "${r.name}"?`)) return;

  storeReviews = storeReviews.filter(x => x.id !== id);
  localStorage.setItem('dtl_reviews', JSON.stringify(storeReviews));
  logActivity('Review Deleted', `Deleted review from ${r.name}`, 'REVIEWS');
  showToast('<i class="fa-solid fa-trash text-red"></i> Review deleted.');
  refreshStoreData();
}

// ========== 10. WEBSITE CONTENT CONTROL ==========

function populateContentForm() {
  const content = JSON.parse(localStorage.getItem('dtl_site_content') || '{}');
  setInputValue('cntNoticeText', content.noticeText || '');
  setInputValue('cntHeroHeadline', content.heroHeadline || '');
  setInputValue('cntHeroSubtitle', content.heroSubtitle || '');
  setInputValue('cntPhone', content.phone || '');
  setInputValue('cntEmail', content.email || '');
  setInputValue('cntAddress', content.address || '');
  setInputValue('cntHours', content.hours || '');
  setInputValue('cntSocialWhatsApp', content.whatsapp || '');
  setInputValue('cntSocialFacebook', content.facebook || '');
  setInputValue('cntSocialInstagram', content.instagram || '');
}

function saveSiteContent() {
  const content = {
    noticeText: document.getElementById('cntNoticeText')?.value || '',
    heroHeadline: document.getElementById('cntHeroHeadline')?.value || '',
    heroSubtitle: document.getElementById('cntHeroSubtitle')?.value || '',
    phone: document.getElementById('cntPhone')?.value || '',
    email: document.getElementById('cntEmail')?.value || '',
    address: document.getElementById('cntAddress')?.value || '',
    hours: document.getElementById('cntHours')?.value || '',
    whatsapp: document.getElementById('cntSocialWhatsApp')?.value || '',
    facebook: document.getElementById('cntSocialFacebook')?.value || '',
    instagram: document.getElementById('cntSocialInstagram')?.value || ''
  };

  localStorage.setItem('dtl_site_content', JSON.stringify(content));
  logActivity('Website Content Updated', 'Live storefront text and announcements updated', 'SETTINGS');
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Website content saved! Changes reflected live.');
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

// ========== 11. ANALYTICS & REPORTS ==========

function renderAnalyticsDashboard() {
  const range = document.getElementById('analyticsDateRangeSelect')?.value || 'all';
  const now = Date.now();
  let startTime = 0;

  if (range === 'today') startTime = new Date().setHours(0,0,0,0);
  else if (range === '7days') startTime = now - (7 * 86400000);
  else if (range === '30days') startTime = now - (30 * 86400000);
  else if (range === 'this_month') startTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  else if (range === 'this_year') startTime = new Date(new Date().getFullYear(), 0, 1).getTime();

  const filteredOrders = storeOrders.filter(o => o.timestamp >= startTime);
  const validOrders = filteredOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded');

  const grossRev = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const aov = validOrders.length > 0 ? Math.round(grossRev / validOrders.length) : 0;

  let unitsSold = 0;
  const productSalesMap = {};
  const categorySalesMap = {};

  validOrders.forEach(o => {
    (o.items || []).forEach(it => {
      const q = it.qty || 1;
      const rev = (it.price || 0) * q;
      unitsSold += q;

      const pName = it.name || 'Product';
      if (!productSalesMap[pName]) productSalesMap[pName] = { units: 0, revenue: 0 };
      productSalesMap[pName].units += q;
      productSalesMap[pName].revenue += rev;

      // Category detection
      const cat = guessProductCategory(pName);
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + rev;
    });
  });

  setElemText('anaRevenue', 'Rs. ' + grossRev.toLocaleString());
  setElemText('anaOrders', filteredOrders.length);
  setElemText('anaAOV', 'Rs. ' + aov.toLocaleString());
  setElemText('anaUnitsSold', unitsSold);

  // Render Product Sales ranking
  const tableBody = document.getElementById('analyticsProductSalesBody');
  if (tableBody) {
    const sortedProds = Object.entries(productSalesMap).sort((a, b) => b[1].revenue - a[1].revenue);
    if (sortedProds.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:20px;">No sales in selected period.</td></tr>';
    } else {
      tableBody.innerHTML = sortedProds.map((p, idx) => `
        <tr>
          <td><strong class="text-gold">#${idx + 1}</strong></td>
          <td><strong>${escapeHtml(p[0])}</strong></td>
          <td>${p[1].units} units</td>
          <td><strong class="text-forest">Rs. ${p[1].revenue.toLocaleString()}</strong></td>
        </tr>
      `).join('');
    }
  }

  // Render Category breakdown
  const catList = document.getElementById('analyticsCategoryList');
  if (catList) {
    const entries = Object.entries(categorySalesMap).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      catList.innerHTML = '<p class="text-muted text-center" style="padding:14px;">No category sales data.</p>';
    } else {
      catList.innerHTML = entries.map(e => {
        const pct = grossRev > 0 ? Math.round((e[1] / grossRev) * 100) : 0;
        return `
          <div class="cat-bar-item">
            <div class="cat-bar-header">
              <span><strong>${escapeHtml(e[0])}</strong></span>
              <span class="text-gold">${pct}% (Rs. ${e[1].toLocaleString()})</span>
            </div>
            <div class="cat-bar-bg"><div class="cat-bar-fill" style="width:${pct}%;"></div></div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Time breakdown table
  const timeBody = document.getElementById('analyticsTimeBreakdownTable');
  if (timeBody) {
    const buckets = {};
    validOrders.forEach(o => {
      const d = new Date(o.timestamp).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
      if (!buckets[d]) buckets[d] = { count: 0, total: 0 };
      buckets[d].count += 1;
      buckets[d].total += (o.total || 0);
    });

    const rows = Object.entries(buckets).slice(0, 10).map(b => `
      <tr>
        <td><strong>${b[0]}</strong></td>
        <td>${b[1].count} order(s)</td>
        <td><strong class="text-forest">Rs. ${b[1].total.toLocaleString()}</strong></td>
      </tr>
    `).join('');

    const tb = document.getElementById('analyticsTimeBreakdownBody');
    if (tb) {
      tb.innerHTML = rows || '<tr><td colspan="3" class="text-center text-muted">No period data.</td></tr>';
    }
  }
}

function guessProductCategory(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('honey')) return 'Honey Collection';
  if (n.includes('ghee')) return 'Desi Ghee';
  if (n.includes('olive')) return 'Pure Olive Oil';
  if (n.includes('saffron')) return 'Kashmiri Saffron';
  if (n.includes('shilajit') || n.includes('talbina')) return 'Herbal & Wellness';
  if (n.includes('tea') || n.includes('pickle') || n.includes('chutney')) return 'Desi Pantry';
  return 'Organic Desi';
}

function exportAnalyticsCSV() {
  const csv = [
    'Period,Total Orders,Total Revenue (PKR)',
    `"All Time",${storeOrders.length},${storeOrders.reduce((s,o)=>s+(o.total||0),0)}`
  ].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `DTL_ANALYTICS_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('<i class="fa-solid fa-file-excel text-forest"></i> Analytics report exported!');
}

// ========== 12. NOTIFICATIONS FEED VIEW ==========

function renderNotificationsFeed() {
  const container = document.getElementById('notificationsFeedList');
  if (!container) return;

  const filterTab = document.querySelector('#notifFilterTabs .status-tab.active')?.getAttribute('data-filter') || 'ALL';
  storeNotifications = JSON.parse(localStorage.getItem('dtl_notifications') || '[]');

  let filtered = storeNotifications;
  if (filterTab !== 'ALL') {
    filtered = filtered.filter(n => n.type === filterTab);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted text-center" style="padding:32px;">No notifications in this category.</p>';
    return;
  }

  container.innerHTML = filtered.map(n => `
    <div class="notif-feed-item ${n.read ? '' : 'unread'}">
      <div class="notif-icon-box icon-${(n.type||'order').toLowerCase()}">
        <i class="fa-solid ${getNotifIcon(n.type)}"></i>
      </div>
      <div class="notif-feed-content">
        <div class="flex-between">
          <strong>${escapeHtml(n.title)}</strong>
          ${n.read ? '<small class="text-muted">Read</small>' : '<span class="nav-badge badge-gold" style="font-size:0.65rem;">NEW</span>'}
        </div>
        <p style="margin:4px 0 0 0; color:var(--text-main); font-size:0.85rem;">${escapeHtml(n.message)}</p>
        <div class="flex-between margin-top-12">
          <span class="notif-feed-time"><i class="fa-solid fa-clock"></i> ${formatTimeAgo(n.timestamp)}</span>
          ${n.linkView ? `<button class="btn btn-outline-gold btn-xs" onclick="switchView('${n.linkView}')">View Details &rarr;</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function formatTimeAgo(ts) {
  if (!ts) return 'just now';
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

// ========== 13. ADMIN USERS & PERMISSIONS ==========

function renderAdminUsersMasterTable() {
  const tbody = document.getElementById('adminUsersMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('adminUserSearchInput')?.value || '').trim().toLowerCase();
  storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');

  let filtered = storeAdminUsers.filter(u =>
    !q || (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q))
  );

  tbody.innerHTML = filtered.map(u => {
    const isOwner = u.email === OWNER_EMAIL;
    return `
      <tr>
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td>${escapeHtml(u.email)}</td>
        <td><span class="badge-gold" style="padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;"><i class="fa-solid fa-shield"></i> ${formatRoleName(u.role)}</span></td>
        <td><span class="status-badge active-user">${u.status || 'Active'}</span></td>
        <td><small>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Original'}</small></td>
        <td>
          ${!isOwner ? `<button class="btn btn-outline-red btn-xs" onclick="deleteAdminUser('${u.id}')"><i class="fa-solid fa-trash"></i> Delete</button>` : '<span class="text-muted"><i class="fa-solid fa-lock"></i> Master Owner</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function openAdminUserModal() {
  document.getElementById('adminUserForm')?.reset();
  document.getElementById('adminUserModalTitle').textContent = 'Add Admin User';
  document.getElementById('adminUserModal')?.classList.add('active');
}

function closeAdminUserModal() {
  document.getElementById('adminUserModal')?.classList.remove('active');
}

async function handleAdminUserFormSubmit(e) {
  e.preventDefault();
  const name = (document.getElementById('auFormName')?.value || '').trim();
  const email = (document.getElementById('auFormEmail')?.value || '').trim().toLowerCase();
  const role = document.getElementById('auFormRole')?.value;
  const password = document.getElementById('auFormPassword')?.value;

  if (!name || !email || !password || password.length < 6) {
    showToast('Please fill all fields properly (password min 6 characters).');
    return;
  }

  storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');
  if (storeAdminUsers.some(u => u.email.toLowerCase() === email)) {
    showToast('An admin user with this email address already exists!');
    return;
  }

  const hash = await sha256(password + ':' + AUTH_SALT);
  const newAdmin = {
    id: 'adm_' + Date.now(),
    name: name,
    email: email,
    role: role,
    passwordHash: hash,
    status: 'active',
    createdAt: Date.now()
  };

  storeAdminUsers.push(newAdmin);
  localStorage.setItem('dtl_admin_users', JSON.stringify(storeAdminUsers));
  logActivity('Created Admin User', `Created new admin: ${name} (${formatRoleName(role)})`, 'SECURITY');
  closeAdminUserModal();
  showToast(`<i class="fa-solid fa-user-check text-forest"></i> Admin account for <strong>${name}</strong> created!`);
  refreshStoreData();
}

function deleteAdminUser(id) {
  storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');
  const u = storeAdminUsers.find(x => x.id === id);
  if (!u) return;
  if (u.email === OWNER_EMAIL) {
    showToast('Cannot delete master owner account!');
    return;
  }
  if (!confirm(`Delete admin user account "${u.name}"?`)) return;

  storeAdminUsers = storeAdminUsers.filter(x => x.id !== id);
  localStorage.setItem('dtl_admin_users', JSON.stringify(storeAdminUsers));
  logActivity('Deleted Admin User', `Deleted admin account: ${u.name}`, 'SECURITY');
  showToast('<i class="fa-solid fa-trash text-red"></i> Admin user deleted.');
  refreshStoreData();
}

// ========== 14. ACTIVITY LOGS ==========

function renderActivityLogsMasterTable() {
  const tbody = document.getElementById('activityLogsMasterBody');
  if (!tbody) return;

  const q = (document.getElementById('activitySearchInput')?.value || '').trim().toLowerCase();
  const cat = document.getElementById('activityCategoryFilter')?.value || 'ALL';

  storeActivityLogs = JSON.parse(localStorage.getItem('dtl_activity_logs') || '[]');

  let filtered = storeActivityLogs.filter(log => {
    const matchesQ = !q ||
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      (log.adminName && log.adminName.toLowerCase().includes(q));
    if (!matchesQ) return false;
    if (cat !== 'ALL' && log.category !== cat) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:32px;">No activity logs recorded matching criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.slice(0, 100).map(log => `
    <tr>
      <td><small>${new Date(log.timestamp).toLocaleString()}</small></td>
      <td><strong>${escapeHtml(log.adminName || 'Admin')}</strong></td>
      <td><small class="text-gold">${formatRoleName(log.adminRole)}</small></td>
      <td><span class="log-cat-badge cat-${log.category || 'SETTINGS'}">${log.category || 'SETTINGS'}</span></td>
      <td>
        <strong>${escapeHtml(log.action)}</strong>
        <small class="text-muted" style="display:block;">${escapeHtml(log.details)}</small>
      </td>
    </tr>
  `).join('');
}

function exportActivityLogsCSV() {
  storeActivityLogs = JSON.parse(localStorage.getItem('dtl_activity_logs') || '[]');
  const csv = [
    'Timestamp,Admin,Role,Category,Action,Details',
    ...storeActivityLogs.map(l => `"${new Date(l.timestamp).toISOString()}","${l.adminName}","${l.adminRole}","${l.category}","${l.action}","${l.details.replace(/"/g, '""')}"`)
  ].join('\n');

  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `DTL_AUDIT_LOGS_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('<i class="fa-solid fa-file-csv text-forest"></i> Audit logs exported!');
}

// ========== 15. SETTINGS & SECURITY ==========

function populateSettingsForm() {
  const set = JSON.parse(localStorage.getItem('dtl_store_settings') || '{}');
  setInputValue('setStoreName', set.storeName || 'DESI TASTE LAND');
  setInputValue('setStorePhone', set.storePhone || '+92 307 0016113');
  setInputValue('setStoreEmail', set.storeEmail || 'desitasteland@gmail.com');
  setInputValue('setNotifyEmail', set.notifyEmail || 'zaibbabar54@gmail.com');
  setInputValue('setStoreAddress', set.storeAddress || 'Aqua Market Phool Nagar, Bhai Pheru, Pakistan 55260');
  setInputValue('setShippingFee', set.shippingFee || 250);
  setInputValue('setFreeShippingThreshold', set.freeShippingThreshold || 5000);
}

function saveStoreSettings(e) {
  e.preventDefault();
  storeSettings = JSON.parse(localStorage.getItem('dtl_store_settings') || '{}');
  storeSettings.storeName = document.getElementById('setStoreName')?.value || 'DESI TASTE LAND';
  storeSettings.storePhone = document.getElementById('setStorePhone')?.value || '+92 307 0016113';
  storeSettings.storeEmail = document.getElementById('setStoreEmail')?.value || 'desitasteland@gmail.com';
  storeSettings.notifyEmail = document.getElementById('setNotifyEmail')?.value || 'zaibbabar54@gmail.com';
  storeSettings.storeAddress = document.getElementById('setStoreAddress')?.value || '';

  localStorage.setItem('dtl_store_settings', JSON.stringify(storeSettings));
  logActivity('Store Settings Updated', 'General business parameters updated', 'SETTINGS');
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Store settings saved!');
}

function saveShippingSettings(e) {
  e.preventDefault();
  storeSettings = JSON.parse(localStorage.getItem('dtl_store_settings') || '{}');
  storeSettings.shippingFee = parseInt(document.getElementById('setShippingFee')?.value || '250', 10);
  storeSettings.freeShippingThreshold = parseInt(document.getElementById('setFreeShippingThreshold')?.value || '5000', 10);

  localStorage.setItem('dtl_store_settings', JSON.stringify(storeSettings));
  logActivity('Shipping Rates Updated', `Delivery: Rs.${storeSettings.shippingFee}, Free threshold: Rs.${storeSettings.freeShippingThreshold}`, 'SETTINGS');
  showToast('<i class="fa-solid fa-truck text-forest"></i> Shipping rates updated!');
}

async function handlePasswordChange(e) {
  e.preventDefault();
  const cur = document.getElementById('pwdCurrent')?.value || '';
  const newPwd = document.getElementById('pwdNew')?.value || '';
  const cnf = document.getElementById('pwdConfirm')?.value || '';

  if (newPwd !== cnf) {
    showToast('<i class="fa-solid fa-triangle-exclamation text-red"></i> New passwords do not match!');
    return;
  }
  if (newPwd.length < 6) {
    showToast('<i class="fa-solid fa-triangle-exclamation text-red"></i> Password must be at least 6 characters.');
    return;
  }

  const sess = getActiveSession();
  if (!sess) return;

  storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');
  const adminAcc = storeAdminUsers.find(u => u.email.toLowerCase() === sess.email.toLowerCase());
  if (!adminAcc) return;

  const curHash = await sha256(cur + ':' + AUTH_SALT);
  if (curHash !== adminAcc.passwordHash) {
    showToast('<i class="fa-solid fa-circle-xmark text-red"></i> Incorrect current password!');
    return;
  }

  const newHash = await sha256(newPwd + ':' + AUTH_SALT);
  adminAcc.passwordHash = newHash;
  localStorage.setItem('dtl_admin_users', JSON.stringify(storeAdminUsers));

  logActivity('Password Changed', `Admin password changed for ${adminAcc.name}`, 'SECURITY');
  document.getElementById('changePasswordForm')?.reset();
  showToast('<i class="fa-solid fa-shield-check text-forest"></i> Password successfully updated!');
}

// ========== 16. PRODUCTS (CRUD & CATALOG) ==========

function getAllProductsCombined() {
  const map = new Map();
  DEFAULT_PRODUCTS.forEach(p => map.set(p.id, { ...p }));
  customProducts.forEach(p => map.set(p.id, { ...p }));
  return Array.from(map.values());
}

function renderProductsGrid() {
  const grid = document.getElementById('productsAdminGrid');
  if (!grid) return;

  const q = (document.getElementById('productSearchInput')?.value || '').trim().toLowerCase();
  const cat = document.getElementById('productCategoryFilter')?.value || 'ALL';

  const products = getAllProductsCombined().filter(p => {
    const matchesQ = !q || p.name.toLowerCase().includes(q) || (p.urduName && p.urduName.toLowerCase().includes(q));
    if (!matchesQ) return false;
    if (cat !== 'ALL' && p.category !== cat) return false;
    return true;
  });

  if (products.length === 0) {
    grid.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;padding:40px;">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(p => {
    const isCustom = customProducts.some(c => c.id === p.id);
    const inv = storeInventory[p.id] || { stock: 50 };
    return `
      <div class="product-admin-card">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" class="prod-card-img" onerror="this.src='../assets/images/prod_honey_new.png'">
        <div class="prod-card-details">
          <div class="flex-between">
            <h4 class="prod-title">${escapeHtml(p.name)}</h4>
            <span class="badge-gold" style="font-size:0.7rem;padding:2px 6px;border-radius:4px;">${escapeHtml(p.category || 'Organic')}</span>
          </div>
          <p class="prod-urdu" style="font-family:'Noto Nastaliq Urdu';">${escapeHtml(p.urduName || '')}</p>
          <div class="prod-meta-row">
            <span class="prod-price">Rs. ${(p.price || 0).toLocaleString()}</span>
            <span class="prod-weight">${escapeHtml(p.weight || '500g')}</span>
          </div>
          <div class="flex-between margin-top-12">
            <span class="stock-badge ${inv.stock > 0 ? 'in-stock' : 'out-stock'}"><i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> ${inv.stock} Units</span>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-outline-gold btn-xs" onclick="openEditProductModal('${escapeHtml(p.id)}')"><i class="fa-solid fa-pen"></i> Edit</button>
              ${isCustom ? `<button class="btn btn-outline-red btn-xs" onclick="deleteCustomProduct('${escapeHtml(p.id)}')"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddProductModal() {
  document.getElementById('productForm')?.reset();
  document.getElementById('prodFormId').value = '';
  document.getElementById('productModalTitle').textContent = 'Add Custom Product';
  document.getElementById('productModal')?.classList.add('active');
}

function openEditProductModal(productId) {
  const prod = getAllProductsCombined().find(p => p.id === productId);
  if (!prod) return;
  const inv = storeInventory[productId] || { stock: 50 };

  document.getElementById('prodFormId').value = prod.id;
  document.getElementById('prodFormName').value = prod.name || '';
  document.getElementById('prodFormUrduName').value = prod.urduName || '';
  document.getElementById('prodFormCategory').value = prod.category || 'Honey';
  document.getElementById('prodFormImage').value = prod.image || '';
  document.getElementById('prodFormPrice').value = prod.price || 0;
  document.getElementById('prodFormWeight').value = prod.weight || '';
  document.getElementById('prodFormStock').value = prod.stock || 'in_stock';
  document.getElementById('prodFormQty').value = inv.stock || 50;
  document.getElementById('prodFormDesc').value = prod.desc || '';

  document.getElementById('productModalTitle').textContent = 'Edit Product Details';
  document.getElementById('productModal')?.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('active');
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('prodFormId').value || ('cust-prod-' + Date.now());
  const name = document.getElementById('prodFormName').value.trim();
  const urduName = document.getElementById('prodFormUrduName').value.trim();
  const category = document.getElementById('prodFormCategory').value;
  const image = document.getElementById('prodFormImage').value.trim();
  const price = parseInt(document.getElementById('prodFormPrice').value, 10);
  const weight = document.getElementById('prodFormWeight').value.trim();
  const stock = document.getElementById('prodFormStock').value;
  const qty = parseInt(document.getElementById('prodFormQty').value || '50', 10);
  const desc = document.getElementById('prodFormDesc').value.trim();

  const prodObj = { id, name, urduName, category, image, price, weight, stock, desc };

  customProducts = JSON.parse(localStorage.getItem('dtl_custom_products') || '[]');
  const idx = customProducts.findIndex(p => p.id === id);
  if (idx >= 0) customProducts[idx] = prodObj;
  else customProducts.push(prodObj);

  localStorage.setItem('dtl_custom_products', JSON.stringify(customProducts));

  // Update inventory record
  storeInventory = JSON.parse(localStorage.getItem('dtl_inventory') || '{}');
  storeInventory[id] = { stock: qty, threshold: 8, lastUpdated: Date.now() };
  localStorage.setItem('dtl_inventory', JSON.stringify(storeInventory));

  logActivity('Product Saved', `Product ${name} (Rs.${price}) saved/updated`, 'PRODUCTS');
  closeProductModal();
  showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Product <strong>${name}</strong> saved!`);
  refreshStoreData();
}

function deleteCustomProduct(productId) {
  const prod = customProducts.find(p => p.id === productId);
  if (!prod) return;
  if (!confirm(`Delete product "${prod.name}" permanently?`)) return;

  customProducts = customProducts.filter(p => p.id !== productId);
  localStorage.setItem('dtl_custom_products', JSON.stringify(customProducts));
  logActivity('Product Deleted', `Deleted product ${prod.name}`, 'PRODUCTS');
  showToast(`<i class="fa-solid fa-trash text-red"></i> Product <strong>${prod.name}</strong> deleted.`);
  refreshStoreData();
}

// ========== 17. MANUAL / WHATSAPP ORDERS ==========

function populateManualOrderProductSelect() {
  const sel = document.getElementById('mProductSelect');
  if (!sel) return;
  const products = getAllProductsCombined();
  sel.innerHTML = products.map(p =>
    `<option value="${p.id}" data-price="${p.price}" data-name="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${p.weight}) - Rs. ${(p.price || 0).toLocaleString()}</option>`
  ).join('');
  calcManualTotal();
}

function openManualOrderModal() {
  populateManualOrderProductSelect();
  calcManualTotal();
  document.getElementById('manualOrderModal')?.classList.add('active');
}

function closeManualOrderModal() {
  document.getElementById('manualOrderModal')?.classList.remove('active');
}

function handleManualProductChange() { calcManualTotal(); }

function calcManualTotal() {
  const sel = document.getElementById('mProductSelect');
  const qty = parseInt(document.getElementById('mProductQty')?.value || '1', 10);
  const opt = sel?.options[sel.selectedIndex];
  const price = parseInt(opt?.getAttribute('data-price') || '0', 10);
  const subtotal = price * qty;
  const shipping = subtotal >= 5000 ? 0 : 250;
  const display = document.getElementById('mTotalDisplay');
  if (display) display.value = 'Rs. ' + (subtotal + shipping).toLocaleString() + (shipping === 0 ? ' (FREE Shipping)' : ' (+ Rs. 250 Delivery)');
}

function handleManualOrderSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('mCustName').value.trim();
  const phone = document.getElementById('mCustPhone').value.trim();
  const city = document.getElementById('mCustCity').value.trim();
  const address = document.getElementById('mCustAddress').value.trim();
  const sel = document.getElementById('mProductSelect');
  const qty = parseInt(document.getElementById('mProductQty').value || '1', 10);
  const opt = sel.options[sel.selectedIndex];
  const prodName = opt.getAttribute('data-name');
  const prodPrice = parseInt(opt.getAttribute('data-price') || '0', 10);
  const subtotal = prodPrice * qty;
  const shipping = subtotal >= 5000 ? 0 : 250;
  const refId = '#DTL-' + Math.floor(10000 + Math.random() * 90000);

  const newOrder = {
    id: refId,
    timestamp: Date.now(),
    name: name,
    phone: phone,
    address: `${address}, ${city}`,
    items: [{ id: sel.value, name: prodName, price: prodPrice, qty: qty }],
    total: subtotal + shipping,
    status: 'Confirmed',
    source: 'manual',
    statusHistory: [{ status: 'Confirmed', timestamp: Date.now(), by: 'Admin Manual Order', note: 'Created via Phone/WhatsApp' }]
  };

  storeOrders.unshift(newOrder);
  localStorage.setItem('dtl_orders', JSON.stringify(storeOrders));

  // Deduct inventory
  deductStockForOrder(newOrder);

  logActivity('Created Manual Order', `Manual order ${refId} for ${name} (Rs.${newOrder.total})`, 'ORDERS');
  addNotification('ORDER', `New Order ${refId}`, `Manual order for ${name} created.`, 'orders', refId);

  showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Manual Order <strong>${refId}</strong> created!`);
  closeManualOrderModal();
  refreshStoreData();
}

// ========== 18. DATA BACKUP & EXPORTS ==========

function exportDataJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    store: 'DESI TASTE LAND',
    orders: storeOrders,
    customers: storeCustomers,
    products: customProducts,
    inventory: storeInventory,
    coupons: storeCoupons,
    reviews: storeReviews,
    activityLogs: storeActivityLogs,
    settings: storeSettings
  };

  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `DTL_STORE_BACKUP_${new Date().toISOString().slice(0,10)}.json`);
  showToast('<i class="fa-solid fa-file-code text-forest"></i> Complete Store Database (JSON) Exported!');
}

function exportOrdersCSV() {
  if (storeOrders.length === 0) { showToast('No orders to export.'); return; }
  const csv = [
    'Order ID,Date,Customer Name,Phone,Address,Items,Total (PKR),Status',
    ...storeOrders.map(o => `"${o.id}","${new Date(o.timestamp).toLocaleString()}","${o.name || ''}","${o.phone || ''}","${(o.address || '').replace(/"/g, '""')}","${(o.items || []).map(i => `${i.name} x${i.qty}`).join('; ')}",${o.total || 0},"${o.status || 'Pending'}"`)
  ].join('\n');

  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `DTL_ORDERS_${new Date().toISOString().slice(0,10)}.csv`);
  showToast('<i class="fa-solid fa-file-excel text-forest"></i> Orders CSV exported!');
}

function handleDataImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (Array.isArray(data.orders)) localStorage.setItem('dtl_orders', JSON.stringify(data.orders));
      if (Array.isArray(data.customers)) localStorage.setItem('dtl_registered_users', JSON.stringify(data.customers));
      if (Array.isArray(data.products)) localStorage.setItem('dtl_custom_products', JSON.stringify(data.products));
      if (data.inventory) localStorage.setItem('dtl_inventory', JSON.stringify(data.inventory));
      if (Array.isArray(data.coupons)) localStorage.setItem('dtl_coupons', JSON.stringify(data.coupons));
      if (Array.isArray(data.reviews)) localStorage.setItem('dtl_reviews', JSON.stringify(data.reviews));
      if (data.settings) localStorage.setItem('dtl_store_settings', JSON.stringify(data.settings));

      logActivity('Restored Store Backup', `Restored database from ${file.name}`, 'SETTINGS');
      showToast('<i class="fa-solid fa-circle-check text-forest"></i> Database successfully restored!');
      refreshStoreData();
    } catch(err) {
      showToast('<i class="fa-solid fa-triangle-exclamation text-red"></i> Invalid backup JSON format!');
    }
  };
  reader.readAsText(file);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========== 19. VIEW NAVIGATION & EVENT LISTENERS ==========

function switchView(viewName) {
  if (!checkPermission(viewName)) {
    showToast('<i class="fa-solid fa-ban text-red"></i> Access Denied: Your assigned role cannot access this section.');
    return;
  }

  currentView = viewName;

  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-view') === viewName);
  });

  const target = document.getElementById('view' + capitalizeFirst(viewName));
  if (target) target.classList.add('active');

  const titles = {
    dashboard: 'Dashboard Overview',
    orders: 'Orders Management',
    products: 'Product Catalog',
    inventory: 'Inventory & Stock Management',
    customers: 'Customer Directory & Dossier',
    coupons: 'Coupons & Discounts',
    reviews: 'Customer Reviews Moderation',
    content: 'Website Content Control',
    analytics: 'Analytics & Sales Reports',
    notifications: 'Notifications Feed',
    'admin-users': 'Admin Users & Permissions',
    'activity-logs': 'Activity Logs & Audit Trail',
    settings: 'Store & Business Settings',
    security: 'Security & Access Guard'
  };

  const titleEl = document.getElementById('currentViewTitle');
  if (titleEl) titleEl.textContent = titles[viewName] || 'Management Control';
}

function switchViewToOrdersWithFilter(status) {
  switchView('orders');
  const sel = document.getElementById('orderStatusFilterSelect');
  if (sel) { sel.value = status; }
  document.querySelectorAll('#orderStatusTabs .status-tab').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-status') === status);
  });
  renderOrdersMasterTable();
}

function capitalizeFirst(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function setupAllEventListeners() {
  // Admin Login
  document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (checkLockout()) return;

    const email = (document.getElementById('adminEmail')?.value || '').trim().toLowerCase();
    const password = document.getElementById('adminPassword')?.value || '';
    const computedHash = await sha256(password + ':' + AUTH_SALT);

    storeAdminUsers = JSON.parse(localStorage.getItem('dtl_admin_users') || '[]');
    const matched = storeAdminUsers.find(u => u.email.toLowerCase() === email && u.status === 'active');

    if (matched && matched.passwordHash === computedHash) {
      resetFailedAttempts();
      sessionStorage.setItem('dtl_admin_session', JSON.stringify({
        name: matched.name,
        email: matched.email,
        role: matched.role,
        token: 'dtl_' + Math.random().toString(36).substring(2) + Date.now(),
        loginTime: Date.now()
      }));

      logActivity('Admin Logged In', `${matched.name} (${formatRoleName(matched.role)}) signed in`, 'SECURITY');
      showToast(`<i class="fa-solid fa-circle-check text-forest"></i> Welcome ${matched.name}!`);
      showDashboard();
    } else {
      recordFailedAttempt();
      const left = MAX_FAILED_ATTEMPTS - parseInt(sessionStorage.getItem('dtl_admin_failed_attempts') || '0', 10);
      showToast('<i class="fa-solid fa-circle-xmark text-red"></i> Invalid credentials. Access denied.' + (left > 0 ? ` (${left} attempts remaining)` : ''));
    }
  });

  // Password toggle
  document.getElementById('togglePasswordBtn')?.addEventListener('click', () => {
    const input = document.getElementById('adminPassword');
    const icon = document.getElementById('togglePwdIcon');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    if (icon) icon.className = input.type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
  });

  // Sidebar navigation
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-view');
      if (v) {
        switchView(v);
        closeMobileSidebar();
      }
    });
  });

  // Mobile sidebar toggle
  document.getElementById('sidebarToggleBtn')?.addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);

  // Topbar notification bell popover
  document.getElementById('notifBellBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifDropdown')?.classList.toggle('active');
  });
  document.addEventListener('click', () => {
    document.getElementById('notifDropdown')?.classList.remove('active');
  });
  document.getElementById('notifDropdown')?.addEventListener('click', (e) => e.stopPropagation());

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    const sess = getActiveSession();
    if (sess) logActivity('Admin Logged Out', `${sess.name} signed out`, 'SECURITY');
    sessionStorage.removeItem('dtl_admin_session');
    showLoginScreen();
    showToast('Logged out securely.');
  });

  // Filters & search listeners
  document.getElementById('orderSearchInput')?.addEventListener('input', renderOrdersMasterTable);
  document.getElementById('orderStatusFilterSelect')?.addEventListener('change', renderOrdersMasterTable);
  document.getElementById('orderSortSelect')?.addEventListener('change', renderOrdersMasterTable);
  document.querySelectorAll('#orderStatusTabs .status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#orderStatusTabs .status-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const st = btn.getAttribute('data-status');
      const sel = document.getElementById('orderStatusFilterSelect');
      if (sel) sel.value = st;
      renderOrdersMasterTable();
    });
  });

  document.getElementById('productSearchInput')?.addEventListener('input', renderProductsGrid);
  document.getElementById('productCategoryFilter')?.addEventListener('change', renderProductsGrid);

  document.getElementById('inventorySearchInput')?.addEventListener('input', renderInventoryMasterTable);
  document.querySelectorAll('#inventoryFilterTabs .status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#inventoryFilterTabs .status-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderInventoryMasterTable();
    });
  });

  document.getElementById('customerSearchInput')?.addEventListener('input', renderCustomersMasterTable);
  document.getElementById('customerStatusFilter')?.addEventListener('change', renderCustomersMasterTable);

  document.getElementById('couponSearchInput')?.addEventListener('input', renderCouponsMasterTable);
  document.getElementById('couponStatusFilter')?.addEventListener('change', renderCouponsMasterTable);

  document.getElementById('reviewSearchInput')?.addEventListener('input', renderReviewsMasterTable);
  document.getElementById('reviewRatingFilter')?.addEventListener('change', renderReviewsMasterTable);
  document.querySelectorAll('#reviewStatusTabs .status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reviewStatusTabs .status-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderReviewsMasterTable();
    });
  });

  document.querySelectorAll('#notifFilterTabs .status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#notifFilterTabs .status-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderNotificationsFeed();
    });
  });

  document.getElementById('adminUserSearchInput')?.addEventListener('input', renderAdminUsersMasterTable);
  document.getElementById('activitySearchInput')?.addEventListener('input', renderActivityLogsMasterTable);
  document.getElementById('activityCategoryFilter')?.addEventListener('change', renderActivityLogsMasterTable);

  // Settings subtabs
  document.querySelectorAll('#settingsTabNav .settings-subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#settingsTabNav .settings-subtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.settings-tab-content').forEach(c => c.style.display = 'none');
      if (tab === 'store') document.getElementById('tabStoreDetails').style.display = 'block';
      if (tab === 'shipping') document.getElementById('tabShippingDetails').style.display = 'block';
      if (tab === 'payment') document.getElementById('tabPaymentDetails').style.display = 'block';
      if (tab === 'backup') document.getElementById('tabBackupDetails').style.display = 'block';
    });
  });
}

function toggleMobileSidebar() {
  document.getElementById('adminSidebar')?.classList.toggle('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.toggle('active');
}

function closeMobileSidebar() {
  document.getElementById('adminSidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
}

// ========== 20. TOAST NOTIFICATIONS & SANITIZATION ==========

function showToast(message) {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
