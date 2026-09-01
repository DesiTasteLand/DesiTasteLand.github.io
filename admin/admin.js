/* ==========================================================================
   DESI TASTE LAND - Master Owner/Admin Portal Engine (admin.js v1.0)
   Secure Cryptographic Authentication + Full Store Management
   ========================================================================== */

'use strict';

const OWNER_EMAIL = "zaibbabar54@gmail.com";
const AUTH_SALT = "DTL_ADMIN_SECURE_SALT_2026_DESITASTELAND";
const EXPECTED_HASH = "fdf19eb7092c92b92bde00023a2d41a6cf1fb31c88e8721cd269b94a519ad68f";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

const DEFAULT_PRODUCTS = [
  { id: 'prod-honey', name: 'PURE HONEY (Sidr)', urduName: 'خالص بیری کا شہد', image: '../assets/images/prod_honey_new.png', price: 1400, weight: '500g', stock: 'in_stock', desc: '100% pure wild & farmy Sidr honey varieties.' },
  { id: 'prod-ghee', name: 'COW DESI GHEE', urduName: 'گائے کا دیسی گھی', image: '../assets/images/prod_buffalo_ghee.jpg', price: 1600, weight: '500g', stock: 'in_stock', desc: 'Hand-churned Bilona Cow Desi Ghee.' },
  { id: 'prod-buffalo-ghee', name: 'BUFFALO DESI GHEE', urduName: 'بھینس کا دیسی گھی', image: '../assets/images/prod_ghee_new.jpg', price: 1800, weight: '500g', stock: 'in_stock', desc: 'Traditional granular rich aroma buffalo ghee.' },
  { id: 'prod-olive', name: 'PURE OLIVE OIL', urduName: 'زیتون کا تیل', image: '../assets/images/prod_olive_new.png', price: 600, weight: '112ml', stock: 'in_stock', desc: 'Cold pressed extra virgin olive oil.' },
  { id: 'prod-imli', name: 'IMLI CHUTNEY', urduName: 'املی آلو بخارا چٹنی', image: '../assets/images/prod_imli_new.jpg', price: 700, weight: '500g', stock: 'in_stock', desc: 'Traditional handcrafted tangy and sweet chutney.' },
  { id: 'prod-talbina', name: 'TALBINA', urduName: 'تلبینہ', image: '../assets/images/prod_talbina_new.jpg', price: 500, weight: '170g', stock: 'in_stock', desc: 'Sunnah barley porridge blended with nuts and dates.' },
  { id: 'prod-shilajit', name: 'SHILAJIT', urduName: 'سلاجیت', image: '../assets/images/prod_shilajit_new.png', price: 1000, weight: '1 Tola', stock: 'in_stock', desc: 'Purified natural Himalayan resin.' },
  { id: 'prod-pickle', name: 'MIX PICKLE (Achar)', urduName: 'مکس اچار', image: '../assets/images/prod_mix_pickle_new.jpg', price: 350, weight: '500g', stock: 'in_stock', desc: 'Traditional mustard oil aromatic mix pickle.' },
  { id: 'prod-tea', name: 'PREMIUM TEA (Patti)', urduName: 'چائے کی پتی', image: '../assets/images/all_tea.jpg', price: 400, weight: '200g', stock: 'in_stock', desc: 'Rich brisk color authentic top leaves tea.' },
  { id: 'prod-saffron', name: 'KASHMIRI SAFFRON', urduName: 'کشمیری زعفران', image: '../assets/images/prod_saffron_new.jpg', price: 1200, weight: '1g', stock: 'in_stock', desc: '100% pure royal Kashmiri Mongra Saffron.' }
];

let storeOrders = [];
let storeCustomers = [];
let customProducts = [];
let activeOrderForModal = null;
let currentView = 'dashboard';

// ========== CRYPTOGRAPHIC AUTH ==========

async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

function isAuthenticated() {
  try {
    const sess = JSON.parse(sessionStorage.getItem('dtl_admin_session') || 'null');
    return sess && sess.email === OWNER_EMAIL && sess.role === 'OWNER_ADMIN';
  } catch { return false; }
}

function setSession() {
  sessionStorage.setItem('dtl_admin_session', JSON.stringify({
    email: OWNER_EMAIL,
    role: 'OWNER_ADMIN',
    token: 'dtl_' + Math.random().toString(36).substring(2) + Date.now(),
    loginTime: Date.now()
  }));
}

function clearSession() {
  sessionStorage.removeItem('dtl_admin_session');
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  setupAllEventListeners();
  if (isAuthenticated()) { showDashboard(); } else { showLoginScreen(); checkLockout(); }
});

function initLiveClock() {
  const update = () => {
    const el = document.getElementById('liveClockText');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: true });
  };
  update();
  setInterval(update, 1000);
}

function showLoginScreen() {
  document.getElementById('loginWrapper').style.display = 'flex';
  document.getElementById('dashboardLayout').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginWrapper').style.display = 'none';
  document.getElementById('dashboardLayout').style.display = 'flex';
  refreshStoreData();
  switchView('dashboard');
}

function refreshStoreData() {
  storeOrders = JSON.parse(localStorage.getItem('dtl_orders') || '[]');
  storeCustomers = JSON.parse(localStorage.getItem('dtl_registered_users') || '[]');
  customProducts = JSON.parse(localStorage.getItem('dtl_custom_products') || '[]');
  updateDashboardKPIs();
  renderRecentOrdersTable();
  renderOrdersMasterTable();
  renderCustomersMasterTable();
  renderProductsGrid();
  populateManualOrderProductSelect();
}

// ========== EVENT LISTENERS ==========

function setupAllEventListeners() {
  // Login
  document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (checkLockout()) return;
    const email = (document.getElementById('adminEmail')?.value || '').trim().toLowerCase();
    const password = document.getElementById('adminPassword')?.value || '';
    const computedHash = await sha256(password + ':' + AUTH_SALT);
    if (email === OWNER_EMAIL && computedHash === EXPECTED_HASH) {
      resetFailedAttempts();
      setSession();
      showToast('<i class="fa-solid fa-circle-check text-forest"></i> Authentication Successful! Welcome Zaib Babar.');
      showDashboard();
    } else {
      recordFailedAttempt();
      const left = MAX_FAILED_ATTEMPTS - parseInt(sessionStorage.getItem('dtl_admin_failed_attempts') || '0', 10);
      showToast('<i class="fa-solid fa-circle-xmark text-red"></i> Invalid credentials. Access denied.' + (left > 0 ? ' (' + left + ' attempts left)' : ''));
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

  // Sidebar nav
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) { switchView(view); closeMobileSidebar(); }
    });
  });

  // Mobile sidebar
  document.getElementById('sidebarToggleBtn')?.addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearSession();
    showToast('Logged out securely.');
    showLoginScreen();
  });

  // Orders
  document.getElementById('orderSearchInput')?.addEventListener('input', renderOrdersMasterTable);
  document.getElementById('orderStatusFilterSelect')?.addEventListener('change', (e) => {
    syncOrderStatusTabs(e.target.value); renderOrdersMasterTable();
  });
  document.getElementById('orderSortSelect')?.addEventListener('change', renderOrdersMasterTable);
  document.querySelectorAll('#orderStatusTabs .status-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const st = tab.getAttribute('data-status');
      const sel = document.getElementById('orderStatusFilterSelect');
      if (sel) sel.value = st;
      syncOrderStatusTabs(st);
      renderOrdersMasterTable();
    });
  });

  // Customers
  document.getElementById('customerSearchInput')?.addEventListener('input', renderCustomersMasterTable);

  // Products
  document.getElementById('productSearchInput')?.addEventListener('input', renderProductsGrid);

  // Forms
  document.getElementById('productForm')?.addEventListener('submit', handleProductFormSubmit);
  document.getElementById('manualOrderForm')?.addEventListener('submit', handleManualOrderSubmit);

  // Modal overlay close
  ['orderDetailModal', 'productModal', 'manualOrderModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      if (e.target.id === id) {
        if (id === 'orderDetailModal') closeOrderDetailModal();
        else if (id === 'productModal') closeProductModal();
        else closeManualOrderModal();
      }
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

function switchView(viewName) {
  if (!isAuthenticated()) { clearSession(); showLoginScreen(); return; }
  currentView = viewName;
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view' + viewName.charAt(0).toUpperCase() + viewName.slice(1))?.classList.add('active');
  document.querySelector('.sidebar-nav .nav-item[data-view="' + viewName + '"]')?.classList.add('active');
  const titles = { dashboard: 'Dashboard Overview', orders: 'Orders Management', customers: 'Customers & Registered Users', products: 'Product Catalog Management', settings: 'Store Settings & Data Backup' };
  const titleEl = document.getElementById('currentViewTitle');
  if (titleEl) titleEl.textContent = titles[viewName] || 'Dashboard';
  refreshStoreData();
}

function switchViewToOrdersWithFilter(status) {
  switchView('orders');
  const sel = document.getElementById('orderStatusFilterSelect');
  if (sel) sel.value = status;
  syncOrderStatusTabs(status);
  renderOrdersMasterTable();
}

function syncOrderStatusTabs(status) {
  document.querySelectorAll('#orderStatusTabs .status-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-status') === status);
  });
}

// ========== KPI DASHBOARD ==========

function updateDashboardKPIs() {
  const totalSales = storeOrders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + (o.total || 0) : sum, 0);
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('kpiTotalSales', 'Rs. ' + totalSales.toLocaleString());
  setEl('kpiTotalOrders', storeOrders.length);
  setEl('kpiTotalCustomers', storeCustomers.length);
  setEl('kpiTotalProducts', getAllProductsCombined().length);
  const pending = storeOrders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
  const confirmed = storeOrders.filter(o => o.status === 'Confirmed').length;
  const shipped = storeOrders.filter(o => o.status === 'Shipped').length;
  const delivered = storeOrders.filter(o => o.status === 'Delivered').length;
  const cancelled = storeOrders.filter(o => o.status === 'Cancelled').length;
  setEl('countPending', pending); setEl('countConfirmed', confirmed);
  setEl('countShipped', shipped); setEl('countDelivered', delivered); setEl('countCancelled', cancelled);
  setEl('kpiOrdersSubtext', pending + ' processing');
  setEl('tabCountAll', storeOrders.length); setEl('tabCountProcessing', pending);
  setEl('tabCountConfirmed', confirmed); setEl('tabCountShipped', shipped);
  setEl('tabCountDelivered', delivered); setEl('tabCountCancelled', cancelled);
  const badge = document.getElementById('pendingOrdersBadge');
  if (badge) { badge.textContent = pending; badge.style.display = pending > 0 ? 'inline-block' : 'none'; }
}

// ========== HELPERS ==========

function getStatusClass(s) {
  if (!s) return 'processing';
  const v = s.toLowerCase();
  if (v.includes('process') || v.includes('pend')) return 'processing';
  if (v.includes('confirm')) return 'confirmed';
  if (v.includes('ship')) return 'shipped';
  if (v.includes('deliver')) return 'delivered';
  if (v.includes('cancel')) return 'cancelled';
  return 'processing';
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ========== RECENT ORDERS ==========

function renderRecentOrdersTable() {
  const tbody = document.getElementById('dashboardRecentOrdersBody');
  if (!tbody) return;
  if (storeOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No customer orders placed yet.</td></tr>';
    return;
  }
  tbody.innerHTML = storeOrders.slice(0, 5).map(o => {
    const cnt = o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 1;
    return '<tr><td><strong>' + escapeHtml(o.id) + '</strong></td><td>' + escapeHtml(o.name || 'Anonymous') + '<br><small class="text-muted">' + escapeHtml(o.phone || '') + '</small></td><td>' + cnt + ' item(s)</td><td><strong class="text-forest">Rs. ' + (o.total || 0).toLocaleString() + '</strong></td><td><span class="status-badge ' + getStatusClass(o.status) + '">' + escapeHtml(o.status || 'Processing') + '</span></td><td><button class="btn btn-outline-gold btn-xs" onclick="openOrderDetailModal(\'' + escapeHtml(o.id) + '\')"><i class="fa-solid fa-eye"></i> View</button></td></tr>';
  }).join('');
}

// ========== ORDERS MANAGEMENT ==========

function renderOrdersMasterTable() {
  const tbody = document.getElementById('ordersMasterBody');
  if (!tbody) return;
  const q = (document.getElementById('orderSearchInput')?.value || '').trim().toLowerCase();
  const sf = document.getElementById('orderStatusFilterSelect')?.value || 'ALL';
  const so = document.getElementById('orderSortSelect')?.value || 'newest';
  let filtered = [...storeOrders];
  if (sf !== 'ALL') filtered = filtered.filter(o => sf === 'Processing' ? (o.status === 'Processing' || o.status === 'Pending') : o.status === sf);
  if (q) filtered = filtered.filter(o => (o.id && o.id.toLowerCase().includes(q)) || (o.name && o.name.toLowerCase().includes(q)) || (o.phone && o.phone.toLowerCase().includes(q)) || (o.address && o.address.toLowerCase().includes(q)));
  if (so === 'newest') filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  else if (so === 'oldest') filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  else if (so === 'highest') filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
  else if (so === 'lowest') filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
  if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:32px;">No orders found matching criteria.</td></tr>'; return; }
  tbody.innerHTML = filtered.map(o => {
    const d = o.timestamp ? new Date(o.timestamp).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
    const it = o.items ? o.items.map(i => i.name + ' x' + i.qty).join(', ') : 'Order';
    const cp = (o.address || '').split(',');
    const city = cp.length > 1 ? cp[cp.length-1].trim() : (o.address || 'PK');
    const wa = 'https://wa.me/92' + (o.phone || '').replace(/^0/,'').replace(/\s+/g,'');
    const sel = ['Processing','Confirmed','Shipped','Delivered','Cancelled'].map(s => '<option value="' + s + '"' + (o.status === s || (s === 'Processing' && o.status === 'Pending') ? ' selected' : '') + '>' + s + '</option>').join('');
    return '<tr><td><strong style="color:var(--gold-primary);">' + escapeHtml(o.id) + '</strong></td><td><small>' + d + '</small></td><td><strong>' + escapeHtml(o.name || 'Anonymous') + '</strong></td><td><a href="' + wa + '" target="_blank" class="text-gold" style="text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> ' + escapeHtml(o.phone || 'N/A') + '</a></td><td>' + escapeHtml(city) + '</td><td><span title="' + escapeHtml(it) + '" style="max-width:160px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(it) + '</span></td><td><strong class="text-forest">Rs. ' + (o.total || 0).toLocaleString() + '</strong></td><td><select onchange="quickUpdateOrderStatus(\'' + escapeHtml(o.id) + '\',this.value)" class="status-quick-select" style="font-size:0.75rem;padding:4px 8px;">' + sel + '</select></td><td><button class="btn btn-outline-gold btn-xs" onclick="openOrderDetailModal(\'' + escapeHtml(o.id) + '\')"><i class="fa-solid fa-eye"></i> Details</button></td></tr>';
  }).join('');
}

function quickUpdateOrderStatus(orderId, newStatus) {
  const order = storeOrders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  localStorage.setItem('dtl_orders', JSON.stringify(storeOrders));
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Order <strong>' + orderId + '</strong> updated to: <strong>' + newStatus + '</strong>');
  refreshStoreData();
}

function openOrderDetailModal(orderId) {
  const o = storeOrders.find(x => x.id === orderId);
  if (!o) return;
  activeOrderForModal = o;
  document.getElementById('modalOrderRefTitle').textContent = 'Order ' + o.id;
  document.getElementById('modalOrderTimestampText').textContent = 'Placed on: ' + (o.timestamp ? new Date(o.timestamp).toLocaleString() : 'N/A');
  document.getElementById('modalStatusSelect').value = o.status || 'Processing';
  const items = o.items || [];
  const subtotal = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const shipping = o.total > subtotal ? o.total - subtotal : (subtotal >= 5000 ? 0 : 250);
  const itemRows = items.map(i => '<tr><td><strong>' + escapeHtml(i.name) + '</strong></td><td style="text-align:center;">' + i.qty + '</td><td style="text-align:right;">Rs. ' + (i.price || 0).toLocaleString() + '</td><td style="text-align:right;"><strong>Rs. ' + ((i.price || 0) * (i.qty || 1)).toLocaleString() + '</strong></td></tr>').join('');
  document.getElementById('orderModalBodyContent').innerHTML = '<div class="invoice-brand-row"><div><h2 style="font-size:1.3rem;color:var(--gold-primary);font-weight:900;">DESI TASTE LAND</h2><p style="font-size:0.8rem;color:var(--text-muted);">100% Pure Organic Goodness | Cash on Delivery</p></div><div style="text-align:right;"><h3 style="font-size:1.1rem;font-weight:800;">INVOICE SLIP</h3><p style="font-size:0.82rem;font-weight:700;">Ref: <span style="color:var(--red-primary);">' + escapeHtml(o.id) + '</span></p></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;"><div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-color);"><h4 style="font-size:0.82rem;color:var(--gold-primary);margin-bottom:6px;"><i class="fa-solid fa-user"></i> Customer Info</h4><p style="font-size:0.85rem;"><strong>Name:</strong> ' + escapeHtml(o.name || 'N/A') + '</p><p style="font-size:0.85rem;"><strong>Phone:</strong> ' + escapeHtml(o.phone || 'N/A') + '</p><p style="font-size:0.85rem;"><strong>Payment:</strong> Cash on Delivery</p></div><div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-color);"><h4 style="font-size:0.82rem;color:var(--gold-primary);margin-bottom:6px;"><i class="fa-solid fa-location-dot"></i> Shipping Address</h4><p style="font-size:0.85rem;">' + escapeHtml(o.address || 'Not provided') + '</p></div></div><table class="invoice-items-table"><thead><tr><th>Product</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Total</th></tr></thead><tbody>' + itemRows + '</tbody></table><div style="margin-left:auto;width:260px;text-align:right;font-size:0.88rem;margin-top:12px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Subtotal:</span><strong>Rs. ' + subtotal.toLocaleString() + '</strong></div><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Delivery:</span><span>' + (shipping === 0 ? '<span style="color:var(--forest-primary);">FREE</span>' : 'Rs. ' + shipping.toLocaleString()) + '</span></div><div style="display:flex;justify-content:space-between;border-top:2px solid var(--border-gold);padding-top:8px;font-size:1.05rem;"><span style="font-weight:800;">Grand Total:</span><strong class="text-forest">Rs. ' + (o.total || 0).toLocaleString() + '</strong></div></div>';
  document.getElementById('orderDetailModal')?.classList.add('active');
}

function closeOrderDetailModal() {
  document.getElementById('orderDetailModal')?.classList.remove('active');
  activeOrderForModal = null;
}

function saveModalOrderStatus() {
  if (!activeOrderForModal) return;
  const newStatus = document.getElementById('modalStatusSelect')?.value;
  if (newStatus) { quickUpdateOrderStatus(activeOrderForModal.id, newStatus); closeOrderDetailModal(); }
}

function printInvoice() { window.print(); }

// ========== MANUAL ORDER ==========

function populateManualOrderProductSelect() {
  const sel = document.getElementById('mProductSelect');
  if (!sel) return;
  sel.innerHTML = getAllProductsCombined().map(p => '<option value="' + p.id + '" data-price="' + p.price + '" data-name="' + escapeHtml(p.name + ' (' + p.weight + ')') + '">' + p.name + ' (' + p.weight + ') - Rs. ' + p.price.toLocaleString() + '</option>').join('');
}

function openManualOrderModal() { populateManualOrderProductSelect(); calcManualTotal(); document.getElementById('manualOrderModal')?.classList.add('active'); }
function closeManualOrderModal() { document.getElementById('manualOrderModal')?.classList.remove('active'); document.getElementById('manualOrderForm')?.reset(); }
function handleManualProductChange() { calcManualTotal(); }

function calcManualTotal() {
  const sel = document.getElementById('mProductSelect');
  const qty = parseInt(document.getElementById('mProductQty')?.value || '1', 10);
  const displayEl = document.getElementById('mTotalDisplay');
  if (!sel || !displayEl) return;
  const price = sel.options[sel.selectedIndex] ? parseInt(sel.options[sel.selectedIndex].getAttribute('data-price') || '0', 10) : 0;
  const subtotal = price * qty;
  const shipping = subtotal >= 5000 ? 0 : 250;
  displayEl.value = 'Rs. ' + (subtotal + shipping).toLocaleString() + (shipping > 0 ? ' (+Rs. ' + shipping + ' delivery)' : ' (FREE delivery)');
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
  storeOrders.unshift({ id: refId, timestamp: Date.now(), name, phone, address: address + ', ' + city, items: [{ id: sel.value, name: prodName, price: prodPrice, qty }], total: subtotal + shipping, status: 'Confirmed', source: 'manual' });
  localStorage.setItem('dtl_orders', JSON.stringify(storeOrders));
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Manual Order <strong>' + refId + '</strong> created!');
  closeManualOrderModal();
  refreshStoreData();
}

// ========== CUSTOMERS ==========

function renderCustomersMasterTable() {
  const tbody = document.getElementById('customersMasterBody');
  if (!tbody) return;
  const q = (document.getElementById('customerSearchInput')?.value || '').trim().toLowerCase();
  let filtered = q ? storeCustomers.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.toLowerCase().includes(q))) : [...storeCustomers];
  if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:32px;">No registered customers in database.</td></tr>'; return; }
  tbody.innerHTML = filtered.map(c => {
    const regDate = c.registeredAt ? new Date(c.registeredAt).toLocaleDateString() : 'Active Buyer';
    const totalUserOrders = storeOrders.filter(o => (c.phone && o.phone && o.phone.replace(/\s+/g,'') === c.phone.replace(/\s+/g,'')) || (c.email && o.email && o.email.toLowerCase() === c.email.toLowerCase())).length;
    const isDisabled = c.status === 'disabled';
    return '<tr><td><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:var(--gold-glow);border:1px solid var(--border-gold);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--gold-primary);">' + (c.name || 'U').charAt(0).toUpperCase() + '</div><strong>' + escapeHtml(c.name || 'Unknown') + '</strong></div></td><td>' + escapeHtml(c.phone || 'N/A') + '</td><td>' + escapeHtml(c.email || 'N/A') + '</td><td><small>' + regDate + '</small></td><td><strong class="text-gold">' + totalUserOrders + ' Orders</strong></td><td><span class="status-badge ' + (isDisabled ? 'disabled-user' : 'active-user') + '">' + (isDisabled ? 'Disabled' : 'Active') + '</span></td><td><div style="display:flex;gap:6px;"><button class="btn ' + (isDisabled ? 'btn-outline-forest' : 'btn-outline-gold') + ' btn-xs" onclick="toggleCustomerStatus(\'' + escapeHtml(c.id) + '\')">' + (isDisabled ? 'Enable' : 'Disable') + '</button><button class="btn btn-outline-red btn-xs" onclick="deleteCustomerAccount(\'' + escapeHtml(c.id) + '\')"><i class="fa-solid fa-trash"></i> Delete</button></div></td></tr>';
  }).join('');
}

function toggleCustomerStatus(userId) {
  const cust = storeCustomers.find(c => c.id === userId);
  if (!cust) return;
  cust.status = cust.status === 'disabled' ? 'active' : 'disabled';
  localStorage.setItem('dtl_registered_users', JSON.stringify(storeCustomers));
  showToast('Customer <strong>' + cust.name + '</strong> is now <strong>' + cust.status.toUpperCase() + '</strong> (Updated on main website)');
  renderCustomersMasterTable();
}

function deleteCustomerAccount(userId) {
  const cust = storeCustomers.find(c => c.id === userId);
  if (!cust) return;
  if (!confirm(`Are you sure you want to permanently delete customer account "${cust.name}"? They will be removed from the store and logged out immediately.`)) return;

  storeCustomers = storeCustomers.filter(c => c.id !== userId);
  localStorage.setItem('dtl_registered_users', JSON.stringify(storeCustomers));
  showToast('<i class="fa-solid fa-trash text-red"></i> Customer <strong>' + cust.name + '</strong> has been permanently removed.');
  refreshStoreData();
}

// ========== PRODUCTS ==========

function getAllProductsCombined() {
  const map = new Map();
  DEFAULT_PRODUCTS.forEach(p => map.set(p.id, { ...p }));
  customProducts.forEach(p => map.set(p.id, { ...p }));
  return Array.from(map.values());
}

function renderProductsGrid() {
  const container = document.getElementById('productsAdminGrid');
  if (!container) return;
  const q = (document.getElementById('productSearchInput')?.value || '').trim().toLowerCase();
  let products = getAllProductsCombined();
  if (q) products = products.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.urduName && p.urduName.includes(q)));
  if (products.length === 0) { container.innerHTML = '<p class="text-center text-muted" style="padding:40px;">No products found.</p>'; return; }
  container.innerHTML = products.map(p => {
    const isOut = p.stock === 'out_of_stock';
    return '<div class="admin-prod-card"><div class="admin-prod-img-box"><img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.src=\'../assets/images/brand_logo.jpg\'"><span class="admin-prod-stock-tag ' + (isOut ? 'tag-out-of-stock' : 'tag-in-stock') + '">' + (isOut ? 'Out of Stock' : 'In Stock') + '</span></div><div class="admin-prod-content"><h4 class="admin-prod-title">' + escapeHtml(p.name) + ' (' + escapeHtml(p.weight) + ')</h4><div class="admin-prod-urdu">' + escapeHtml(p.urduName || '') + '</div><div class="admin-prod-price">Rs. ' + (p.price || 0).toLocaleString() + '</div><p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:12px;line-height:1.4;">' + escapeHtml(p.desc || '') + '</p><div class="admin-prod-actions"><button class="btn btn-outline-gold btn-xs" style="flex:1;" onclick="openEditProductModal(\'' + p.id + '\')"><i class="fa-solid fa-pen"></i> Edit</button><button class="btn ' + (isOut ? 'btn-outline-forest' : 'btn-outline-red') + ' btn-xs" onclick="toggleProductStock(\'' + p.id + '\')">' + (isOut ? 'Mark In-Stock' : 'Mark Out') + '</button></div></div></div>';
  }).join('');
}

function openAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'Add Custom Product';
  document.getElementById('prodFormId').value = 'custom_' + Date.now();
  document.getElementById('productForm')?.reset();
  document.getElementById('productModal')?.classList.add('active');
}

function openEditProductModal(productId) {
  const p = getAllProductsCombined().find(item => item.id === productId);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = 'Edit: ' + p.name;
  document.getElementById('prodFormId').value = p.id;
  document.getElementById('prodFormName').value = p.name;
  document.getElementById('prodFormUrduName').value = p.urduName || '';
  document.getElementById('prodFormImage').value = p.image;
  document.getElementById('prodFormPrice').value = p.price;
  document.getElementById('prodFormWeight').value = p.weight;
  document.getElementById('prodFormStock').value = p.stock || 'in_stock';
  document.getElementById('prodFormDesc').value = p.desc || '';
  document.getElementById('productModal')?.classList.add('active');
}

function closeProductModal() { document.getElementById('productModal')?.classList.remove('active'); }

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('prodFormId').value;
  const name = document.getElementById('prodFormName').value.trim();
  const urduName = document.getElementById('prodFormUrduName').value.trim();
  const image = document.getElementById('prodFormImage').value.trim();
  const price = parseInt(document.getElementById('prodFormPrice').value, 10);
  const weight = document.getElementById('prodFormWeight').value.trim();
  const stock = document.getElementById('prodFormStock').value;
  const desc = document.getElementById('prodFormDesc').value.trim();
  if (!name || !image || !price || !weight) { showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please fill all required fields.'); return; }
  const obj = { id, name, urduName, image, price, weight, stock, desc };
  const idx = customProducts.findIndex(p => p.id === id);
  if (idx >= 0) customProducts[idx] = obj; else customProducts.push(obj);
  localStorage.setItem('dtl_custom_products', JSON.stringify(customProducts));
  showToast('<i class="fa-solid fa-circle-check text-forest"></i> Product <strong>' + name + '</strong> saved!');
  closeProductModal();
  renderProductsGrid();
  populateManualOrderProductSelect();
}

function toggleProductStock(productId) {
  const p = getAllProductsCombined().find(i => i.id === productId);
  if (!p) return;
  const newStock = p.stock === 'out_of_stock' ? 'in_stock' : 'out_of_stock';
  const idx = customProducts.findIndex(i => i.id === productId);
  if (idx >= 0) customProducts[idx].stock = newStock; else customProducts.push({ ...p, stock: newStock });
  localStorage.setItem('dtl_custom_products', JSON.stringify(customProducts));
  showToast('Stock updated for <strong>' + p.name + '</strong>');
  renderProductsGrid();
}

// ========== DATA BACKUP ==========

function exportDataJSON() {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), store: 'DESI TASTE LAND', orders: storeOrders, customers: storeCustomers, customProducts }, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'DTL_BACKUP_' + new Date().toISOString().split('T')[0] + '.json');
  showToast('<i class="fa-solid fa-cloud-arrow-down text-forest"></i> JSON backup downloaded!');
}

function exportOrdersCSV() {
  if (storeOrders.length === 0) { showToast('No orders to export.'); return; }
  const csv = ['Order ID,Date,Customer Name,Phone,Address,Items,Total (PKR),Status', ...storeOrders.map(o => [o.id, o.timestamp ? new Date(o.timestamp).toLocaleString() : '', o.name || '', o.phone || '', (o.address || '').replace(/"/g,'""'), o.items ? o.items.map(i => i.name + ' x' + i.qty).join(' | ') : '', o.total || 0, o.status || ''].map(c => '"' + c + '"').join(','))].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'DTL_ORDERS_' + new Date().toISOString().split('T')[0] + '.csv');
  showToast('<i class="fa-solid fa-file-excel text-forest"></i> Orders CSV exported!');
}

function exportCustomersCSV() {
  if (storeCustomers.length === 0) { showToast('No customers to export.'); return; }
  const csv = ['ID,Name,Phone,Email,Registered At,Status', ...storeCustomers.map(c => [c.id || '', c.name || '', c.phone || '', c.email || '', c.registeredAt || '', c.status || 'active'].map(x => '"' + x + '"').join(','))].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'DTL_CUSTOMERS_' + new Date().toISOString().split('T')[0] + '.csv');
  showToast('<i class="fa-solid fa-file-csv text-forest"></i> Customers CSV exported!');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleDataImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      let n = 0;
      if (Array.isArray(data.orders)) { localStorage.setItem('dtl_orders', JSON.stringify(data.orders)); n++; }
      if (Array.isArray(data.customers)) { localStorage.setItem('dtl_registered_users', JSON.stringify(data.customers)); n++; }
      if (Array.isArray(data.customProducts)) { localStorage.setItem('dtl_custom_products', JSON.stringify(data.customProducts)); n++; }
      showToast(n > 0 ? '<i class="fa-solid fa-circle-check text-forest"></i> Database restored! (' + n + ' datasets)' : '<i class="fa-solid fa-triangle-exclamation text-red"></i> No valid data found.');
      if (n > 0) refreshStoreData();
    } catch { showToast('<i class="fa-solid fa-circle-xmark text-red"></i> Invalid backup JSON file.'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function saveCloudDbSettings() {
  const url = (document.getElementById('firebaseDbUrl')?.value || '').trim();
  if (url) { localStorage.setItem('dtl_firebase_url', url); showToast('<i class="fa-solid fa-cloud text-forest"></i> Firebase URL saved!'); }
  else showToast('<i class="fa-solid fa-circle-exclamation text-red"></i> Please enter a valid Firebase URL.');
}

// ========== TOAST ==========

function showToast(htmlMsg) {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = htmlMsg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
  }, 3800);
}
