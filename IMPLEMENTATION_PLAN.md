# 📋 خطة تنفيذ النظام الكامل
## Implementation Roadmap

---

## 🎯 ما تم إنجازه بالفعل

### ✅ المرحلة الأولى - البنية الأساسية
- [x] تصميم واجهة المستخدم (UI/UX)
- [x] صفحات العملاء (Frontend)
  - index.html
  - products.html
  - product-details.html
  - cart.html
  - checkout.html
  - login.html
  - register.html
  - about.html
  - contact.html
- [x] التصميم الأساسي (CSS)
- [x] دعم Firebase
- [x] إدارة المنتجات الأساسية (admin.html)

### ✅ المرحلة الثانية - هيكل قاعدة البيانات
- [x] تصميم Database Schema الكامل
- [x] تحديد العلاقات بين الجداول
- [x] إنشاء ملف firebase-system.js بجميع الدوال

---

## 🚧 المطلوب للإكمال

### المرحلة الثالثة - لوحات التحكم

#### 1️⃣ لوحة التحكم الرئيسية (dashboard.html)

**المحتوى المطلوب:**
```html
<!-- الإحصائيات الرئيسية -->
<div class="stats-grid">
  <div class="stat-card">
    <h3>إجمالي المبيعات اليوم</h3>
    <p class="stat-value">15,000 ريال</p>
  </div>
  
  <div class="stat-card">
    <h3>الطلبات الجديدة</h3>
    <p class="stat-value">12 طلب</p>
  </div>
  
  <div class="stat-card">
    <h3>المنتجات نفذت</h3>
    <p class="stat-value warning">5 منتجات</p>
  </div>
  
  <div class="stat-card">
    <h3>الفواتير المعلقة</h3>
    <p class="stat-value">8 فواتير</p>
  </div>
</div>

<!-- رسم بياني للمبيعات -->
<div class="chart-container">
  <canvas id="salesChart"></canvas>
</div>

<!-- آخر الطلبات -->
<div class="recent-orders">
  <h2>آخر الطلبات</h2>
  <table id="recentOrdersTable"></table>
</div>

<!-- تنبيهات المخزون -->
<div class="low-stock-alerts">
  <h2>⚠️ تنبيهات المخزون</h2>
  <div id="lowStockList"></div>
</div>
```

**JavaScript المطلوب:**
```javascript
// تحميل الإحصائيات
async function loadDashboardStats() {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const stats = await getSalesReport(today.getTime(), Date.now());
  
  document.getElementById('todaySales').textContent = stats.totalSales;
  document.getElementById('newOrders').textContent = stats.totalOrders;
  
  // تحميل تنبيهات المخزون
  const lowStock = await checkLowStock();
  displayLowStockAlerts(lowStock);
  
  // تحميل آخر الطلبات
  const orders = await getAllOrders();
  displayRecentOrders(orders.slice(0, 10));
}
```

---

#### 2️⃣ صفحة إدارة الطلبات (dashboard-orders.html)

**الميزات المطلوبة:**
1. جدول بجميع الطلبات
2. فلترة حسب:
   - الحالة (pending, paid, shipped, completed, cancelled)
   - التاريخ
   - العميل
3. البحث برقم الطلب
4. تعديل حالة الطلب
5. عرض تفاصيل الطلب
6. طباعة الطلب

**مثال على الكود:**
```html
<!-- الفلاتر -->
<div class="filters">
  <select id="statusFilter" onchange="filterOrders()">
    <option value="all">كل الحالات</option>
    <option value="pending">قيد الانتظار</option>
    <option value="paid">مدفوع</option>
    <option value="shipped">تم الشحن</option>
    <option value="completed">مكتمل</option>
    <option value="cancelled">ملغي</option>
  </select>
  
  <input type="date" id="startDate" onchange="filterOrders()">
  <input type="date" id="endDate" onchange="filterOrders()">
  
  <input type="text" id="searchOrder" placeholder="بحث برقم الطلب" onkeyup="searchOrders()">
</div>

<!-- جدول الطلبات -->
<table class="orders-table">
  <thead>
    <tr>
      <th>رقم الطلب</th>
      <th>العميل</th>
      <th>التاريخ</th>
      <th>المبلغ</th>
      <th>الحالة</th>
      <th>الإجراءات</th>
    </tr>
  </thead>
  <tbody id="ordersTableBody"></tbody>
</table>
```

**JavaScript:**
```javascript
async function loadOrders() {
  const orders = await getAllOrders();
  displayOrdersTable(orders);
}

function displayOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>${order.order_number}</td>
      <td>${order.customer_name}</td>
      <td>${formatDate(order.created_at)}</td>
      <td>${order.final_amount} ريال</td>
      <td>
        <span class="status-badge ${order.order_status}">
          ${getStatusText(order.order_status)}
        </span>
      </td>
      <td>
        <button onclick="viewOrder('${order.order_id}')">عرض</button>
        <button onclick="editOrderStatus('${order.order_id}')">تعديل الحالة</button>
        <button onclick="printOrder('${order.order_id}')">طباعة</button>
      </td>
    </tr>
  `).join('');
}

async function editOrderStatus(orderId) {
  const newStatus = prompt('أدخل الحالة الجديدة:\npending\npaid\nshipped\ncompleted\ncancelled');
  
  if (newStatus) {
    await updateOrderStatus(orderId, newStatus);
    loadOrders(); // إعادة تحميل الجدول
  }
}
```

---

#### 3️⃣ صفحة إدارة العملاء (dashboard-customers.html)

**الميزات:**
1. قائمة بجميع العملاء
2. إضافة عميل جديد
3. تعديل بيانات العميل
4. عرض سجل طلبات العميل
5. إحصائيات العميل

**مثال:**
```html
<!-- زر إضافة عميل -->
<button class="btn" onclick="showAddCustomerModal()">➕ إضافة عميل جديد</button>

<!-- جدول العملاء -->
<table class="customers-table">
  <thead>
    <tr>
      <th>الاسم</th>
      <th>الهاتف</th>
      <th>البريد</th>
      <th>المدينة</th>
      <th>عدد الطلبات</th>
      <th>إجمالي الإنفاق</th>
      <th>الإجراءات</th>
    </tr>
  </thead>
  <tbody id="customersTableBody"></tbody>
</table>

<!-- نافذة منبثقة لإضافة عميل -->
<div class="modal" id="addCustomerModal">
  <div class="modal-content">
    <h2>إضافة عميل جديد</h2>
    <form id="customerForm">
      <input type="text" name="name" placeholder="الاسم" required>
      <input type="tel" name="phone" placeholder="الهاتف" required>
      <input type="email" name="email" placeholder="البريد الإلكتروني">
      <textarea name="address" placeholder="العنوان" required></textarea>
      <input type="text" name="city" placeholder="المدينة">
      <button type="submit">حفظ</button>
    </form>
  </div>
</div>
```

---

#### 4️⃣ صفحة الفواتير (dashboard-invoices.html)

**الميزات:**
1. عرض جميع الفواتير
2. فلترة حسب الحالة (مدفوع/غير مدفوع/جزئي)
3. البحث بالفاتورة أو العميل
4. عرض تفاصيل الفاتورة
5. طباعة الفاتورة
6. تسجيل دفعة جديدة

**مثال:**
```javascript
async function loadInvoices() {
  const invoices = await getAllInvoices();
  displayInvoicesTable(invoices);
  
  // إحصائيات الفواتير
  const summary = await getInvoicesSummary();
  displayInvoicesSummary(summary);
}

function displayInvoicesTable(invoices) {
  // عرض الجدول
}

async function recordPaymentForInvoice(invoiceId) {
  // فتح نافذة تسجيل الدفع
  const invoice = await getInvoiceById(invoiceId);
  
  const paymentAmount = prompt(
    `المبلغ الإجمالي: ${invoice.total_amount} ريال\n` +
    `المدفوع: ${invoice.paid_amount} ريال\n` +
    `المتبقي: ${invoice.remaining_amount} ريال\n\n` +
    `أدخل مبلغ الدفع:`
  );
  
  if (paymentAmount) {
    await processPayment({
      invoice_id: invoiceId,
      order_id: invoice.order_id,
      customer_id: invoice.customer_id,
      amount: parseFloat(paymentAmount),
      payment_method: 'cash', // أو من اختيار المستخدم
      account_id: 'acc_cash'
    });
  }
}
```

---

#### 5️⃣ صفحة المدفوعات (dashboard-payments.html)

**الميزات:**
1. سجل جميع المدفوعات
2. تسجيل دفعة جديدة
3. ربط الدفعة بالفاتورة
4. اختيار الحساب المستلم
5. فلترة حسب التاريخ وطريقة الدفع

---

#### 6️⃣ صفحة الحسابات (dashboard-accounts.html)

**المحتوى:**
```html
<!-- عرض الحسابات -->
<div class="accounts-grid">
  <div class="account-card cash">
    <h3>💵 الصندوق النقدي</h3>
    <p class="balance">50,000 ريال</p>
    <button onclick="viewTransactions('acc_cash')">عرض المعاملات</button>
  </div>
  
  <div class="account-card bank">
    <h3>🏦 الحساب البنكي</h3>
    <p class="balance">150,000 ريال</p>
    <button onclick="viewTransactions('acc_bank')">عرض المعاملات</button>
  </div>
  
  <div class="account-card receivable">
    <h3>📋 الذمم المدينة</h3>
    <p class="balance">25,000 ريال</p>
    <button onclick="viewUnpaidInvoices()">الفواتير المعلقة</button>
  </div>
</div>

<!-- سجل المعاملات -->
<div class="transactions-list">
  <h2>آخر المعاملات</h2>
  <table id="transactionsTable"></table>
</div>
```

---

#### 7️⃣ صفحة التقارير (dashboard-reports.html)

**التقارير المطلوبة:**

```html
<!-- اختيار نوع التقرير -->
<div class="report-selector">
  <button onclick="showSalesReport()">📊 تقرير المبيعات</button>
  <button onclick="showProductsReport()">📦 تقرير المنتجات</button>
  <button onclick="showCustomersReport()">👥 تقرير العملاء</button>
  <button onclick="showFinancialReport()">💰 تقرير مالي</button>
</div>

<!-- فلاتر التاريخ -->
<div class="date-filters">
  <input type="date" id="reportStartDate">
  <input type="date" id="reportEndDate">
  <button onclick="generateReport()">إنشاء التقرير</button>
</div>

<!-- منطقة عرض التقرير -->
<div id="reportDisplay">
  <!-- سيتم ملؤها بالتقرير المطلوب -->
</div>
```

**مثال تقرير المبيعات:**
```javascript
async function showSalesReport() {
  const startDate = document.getElementById('reportStartDate').value;
  const endDate = document.getElementById('reportEndDate').value;
  
  const report = await getSalesReport(
    new Date(startDate).getTime(),
    new Date(endDate).getTime()
  );
  
  const html = `
    <div class="sales-report">
      <h2>تقرير المبيعات</h2>
      <p>من ${startDate} إلى ${endDate}</p>
      
      <div class="report-stats">
        <div class="stat">
          <label>إجمالي المبيعات:</label>
          <value>${report.totalSales.toFixed(2)} ريال</value>
        </div>
        
        <div class="stat">
          <label>عدد الطلبات:</label>
          <value>${report.totalOrders}</value>
        </div>
        
        <div class="stat">
          <label>متوسط قيمة الطلب:</label>
          <value>${report.averageOrderValue.toFixed(2)} ريال</value>
        </div>
        
        <div class="stat">
          <label>الطلبات المدفوعة:</label>
          <value>${report.paidOrders}</value>
        </div>
        
        <div class="stat">
          <label>الطلبات المعلقة:</label>
          <value>${report.pendingOrders}</value>
        </div>
      </div>
      
      <button onclick="printReport()">🖨️ طباعة التقرير</button>
      <button onclick="exportReportToExcel()">📥 تصدير Excel</button>
    </div>
  `;
  
  document.getElementById('reportDisplay').innerHTML = html;
}
```

---

#### 8️⃣ صفحة المخزون (dashboard-stock.html)

**الميزات:**
1. عرض المخزون الحالي لكل منتج
2. تنبيهات المنتجات النافذة
3. تعديل الكميات
4. سجل حركة المخزون

```javascript
async function loadStockView() {
  const products = await getAllProducts();
  const stocks = [];
  
  for (let product of products) {
    const stock = await getProductStock(product.product_id);
    stocks.push({
      ...product,
      stock: stock?.quantity_available || 0,
      min_alert: stock?.min_stock_alert || 10
    });
  }
  
  displayStockTable(stocks);
}
```

---

## 🎨 CSS المطلوب للوحات التحكم

إنشاء ملف `css/dashboard.css`:

```css
/* لوحة التحكم */
.dashboard-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

/* القائمة الجانبية */
.sidebar {
  background: linear-gradient(180deg, #3d0000, #1a0000);
  padding: 2rem 1rem;
}

.sidebar-menu {
  list-style: none;
}

.sidebar-menu li {
  margin-bottom: 1rem;
}

.sidebar-menu a {
  color: #fff;
  text-decoration: none;
  padding: 1rem;
  display: block;
  border-radius: 8px;
  transition: all 0.3s;
}

.sidebar-menu a:hover,
.sidebar-menu a.active {
  background: rgba(255,107,107,0.2);
  color: var(--light-red);
}

/* بطاقات الإحصائيات */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: linear-gradient(145deg, rgba(61,0,0,0.8), rgba(26,0,0,0.9));
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-color);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  color: var(--light-red);
  font-weight: bold;
  margin-top: 1rem;
}

.stat-value.warning {
  color: #ff9800;
}

/* الجداول */
.data-table {
  width: 100%;
  background: linear-gradient(145deg, rgba(61,0,0,0.8), rgba(26,0,0,0.9));
  border-radius: 15px;
  overflow: hidden;
}

.data-table th {
  background: rgba(139,0,0,0.5);
  padding: 1rem;
  text-align: right;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

/* شارات الحالة */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.status-badge.pending {
  background: rgba(255,193,7,0.2);
  color: #ffc107;
}

.status-badge.paid {
  background: rgba(76,175,80,0.2);
  color: #4caf50;
}

.status-badge.shipped {
  background: rgba(33,150,243,0.2);
  color: #2196f3;
}

.status-badge.completed {
  background: rgba(76,175,80,0.2);
  color: #4caf50;
}

.status-badge.cancelled {
  background: rgba(244,67,54,0.2);
  color: #f44336;
}
```

---

## 📊 مكتبات إضافية موصى بها

### للرسوم البيانية:
```html
<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**استخدام:**
```javascript
// رسم بياني للمبيعات
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل'],
    datasets: [{
      label: 'المبيعات',
      data: [12000, 19000, 15000, 25000],
      borderColor: '#ff6b6b',
      backgroundColor: 'rgba(255,107,107,0.1)'
    }]
  }
});
```

### للطباعة:
```html
<!-- Print.js -->
<script src="https://printjs.crabbly.com/print.min.js"></script>
```

### لتصدير Excel:
```html
<!-- SheetJS -->
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
```

---

## ✅ قائمة المراجعة النهائية

### البنية التحتية
- [x] Firebase Setup
- [x] Database Schema
- [x] System Functions
- [x] Authentication (اختياري)

### الواجهات الأمامية
- [x] صفحات العملاء
- [ ] لوحة التحكم الرئيسية
- [ ] إدارة الطلبات
- [ ] إدارة العملاء
- [ ] إدارة الفواتير
- [ ] إدارة المدفوعات
- [ ] إدارة الحسابات
- [ ] التقارير
- [ ] إدارة المخزون

### الوظائف
- [x] CRUD المنتجات
- [x] إدارة المخزون
- [x] إنشاء الطلبات
- [x] إنشاء الفواتير
- [x] معالجة المدفوعات
- [x] تحديث الحسابات
- [x] التقارير الأساسية

### التحسينات
- [ ] نظام المصادقة (Login للمدراء)
- [ ] الإشعارات
- [ ] النسخ الاحتياطي التلقائي
- [ ] تصدير البيانات
- [ ] الطباعة
- [ ] متعدد العملات (اختياري)
- [ ] متعدد اللغات (اختياري)

---

## 🎯 الخلاصة

**ما لديك الآن:**
1. ✅ البنية الأساسية الكاملة
2. ✅ قاعدة بيانات محكمة
3. ✅ جميع الدوال اللازمة
4. ✅ التوثيق الشامل

**ما تحتاج لإنجازه:**
1. إنشاء صفحات الإدارة (HTML)
2. ربطها بالدوال الموجودة
3. إضافة التصميم (CSS)
4. اختبار السيناريوهات المختلفة

**تقدير الوقت:**
- كل صفحة إدارة: 2-3 ساعات
- الإجمالي: 15-25 ساعة عمل
- مع الاختبار: 30-40 ساعة

---

**🎊 لديك الآن نظام احترافي قابل للتطوير!**
