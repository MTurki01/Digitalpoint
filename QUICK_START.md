# 🚀 دليل البدء السريع - Firebase

## ⚡ في 5 دقائق فقط!

### 📝 الخطوات الأساسية

#### 1️⃣ إنشاء مشروع Firebase (دقيقتان)
1. اذهب إلى: https://console.firebase.google.com/
2. انقر "Add project" → أدخل اسم المشروع
3. أكمل الإعداد

#### 2️⃣ تفعيل Realtime Database (دقيقة)
1. من القائمة الجانبية → "Realtime Database"
2. "Create Database" → اختر موقع قريب منك
3. "Start in test mode" → "Enable"

#### 3️⃣ نسخ بيانات المشروع (30 ثانية)
1. ⚙️ Settings → Project Settings
2. مرر للأسفل → ستجد "firebaseConfig"
3. انسخ البيانات

#### 4️⃣ تحديث الموقع (دقيقة)
1. افتح `js/firebase-config.js`
2. استبدل السطور:
```javascript
apiKey: "YOUR_API_KEY",           // استبدلها
authDomain: "YOUR_PROJECT...",    // استبدلها
databaseURL: "https://YOUR...",   // استبدلها - مهم جداً!
projectId: "YOUR_PROJECT_ID",     // استبدلها
```

#### 5️⃣ تحديث ملفات HTML (30 ثانية)
في الملفات التالية:
- index.html
- products.html
- product-details.html  
- cart.html
- checkout.html

**استبدل:**
```html
<script src="js/main.js"></script>
```

**بـ:**
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/main-firebase.js"></script>
```

#### 6️⃣ إضافة منتجات
**الطريقة السهلة:**
1. افتح `admin.html` في المتصفح
2. أضف منتجاتك عبر النموذج

**الطريقة السريعة:**
1. في Firebase Console → Realtime Database
2. ⋮ → "Import JSON"
3. ارفع ملف `sample-products.json`

---

## ✅ اختبار الموقع

1. افتح `index.html` في المتصفح
2. يجب أن ترى المنتجات
3. جرب الإضافة للسلة
4. جرب صفحة `admin.html` لإدارة المنتجات

---

## 🆘 مشاكل شائعة

**المنتجات لا تظهر؟**
→ افتح Console (F12) وابحث عن أخطاء

**"Firebase is not defined"?**
→ تأكد من إضافة سكريبتات Firebase في HTML

**"Permission denied"?**
→ تحقق من قواعد Database في Firebase Console

---

## 📖 للمزيد

راجع `FIREBASE_GUIDE.md` للدليل الكامل المفصل.

---

**🎉 انتهيت! موقعك الآن متصل بـ Firebase!**
