// المنتجات - سيتم تحميلها من Firebase
let products = [];

// السلة
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحميل المنتجات من Firebase عند بدء التشغيل
let isFirebaseEnabled = false;

// التحقق من وجود Firebase
if (typeof firebase !== 'undefined') {
    isFirebaseEnabled = true;
    console.log('Firebase متصل ✓');
} else {
    console.warn('Firebase غير متصل - سيتم استخدام المنتجات الافتراضية');
}

// تهيئة المنتجات
async function initializeProducts() {
    if (isFirebaseEnabled) {
        // جلب المنتجات من Firebase
        products = await getProductsFromFirebase();
        console.log(`تم تحميل ${products.length} منتج من Firebase`);
        
        // إذا لم توجد منتجات في Firebase، استخدم المنتجات الافتراضية
        if (products.length === 0) {
            products = getDefaultProducts();
            console.log('لا توجد منتجات في Firebase - استخدام المنتجات الافتراضية');
        }
    } else {
        // استخدام المنتجات الافتراضية
        products = getDefaultProducts();
    }
    
    // عرض المنتجات إذا كنا في صفحة المنتجات
    if (window.location.pathname.includes('products.html') || 
        window.location.pathname.includes('index.html')) {
        displayProducts(products);
    }
}

// المنتجات الافتراضية (للاستخدام عند عدم وجود Firebase)
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'لابتوب عالي الأداء',
            price: 3500,
            category: 'electronics',
            description: 'لابتوب بمواصفات احترافية مثالي للعمل والألعاب',
            icon: '💻',
            rating: 4.5,
            imageUrl: '',
            features: [
                'معالج Intel Core i7 الجيل الحادي عشر',
                'ذاكرة RAM 16GB',
                'هارد SSD 512GB',
                'شاشة 15.6 بوصة Full HD',
                'كرت شاشة NVIDIA GTX'
            ]
        },
        {
            id: 2,
            name: 'هاتف ذكي',
            price: 2500,
            category: 'electronics',
            description: 'أحدث إصدار بكاميرا متطورة وأداء سريع',
            icon: '📱',
            rating: 5,
            imageUrl: '',
            features: [
                'كاميرا خلفية 108 ميجابكسل',
                'شاشة AMOLED 6.7 بوصة',
                'بطارية 5000mAh',
                'شحن سريع 65W',
                'ذاكرة داخلية 256GB'
            ]
        },
        {
            id: 3,
            name: 'سماعات لاسلكية',
            price: 450,
            category: 'electronics',
            description: 'جودة صوت عالية وعزل للضوضاء',
            icon: '🎧',
            rating: 4,
            imageUrl: '',
            features: [
                'عزل نشط للضوضاء',
                'عمر بطارية 30 ساعة',
                'صوت Hi-Fi فائق الجودة',
                'مقاومة للماء',
                'اتصال Bluetooth 5.0'
            ]
        },
        {
            id: 4,
            name: 'ساعة ذكية',
            price: 1200,
            category: 'electronics',
            description: 'تتبع اللياقة والإشعارات والمكالمات',
            icon: '⌚',
            rating: 4.5,
            imageUrl: '',
            features: [
                'مراقبة معدل ضربات القلب',
                'تتبع النوم والخطوات',
                'مقاومة للماء حتى 50م',
                'شاشة AMOLED',
                'عمر بطارية 7 أيام'
            ]
        },
        {
            id: 5,
            name: 'قميص رجالي',
            price: 150,
            category: 'fashion',
            description: 'قطن 100% عالي الجودة ومريح',
            icon: '👔',
            rating: 4,
            imageUrl: '',
            features: [
                'قطن طبيعي 100%',
                'تصميم عصري أنيق',
                'مقاسات متعددة',
                'ألوان متنوعة',
                'سهل الكي والعناية'
            ]
        },
        {
            id: 6,
            name: 'فستان أنيق',
            price: 350,
            category: 'fashion',
            description: 'تصميم عصري ومريح لجميع المناسبات',
            icon: '👗',
            rating: 5,
            imageUrl: '',
            features: [
                'قماش فاخر ومريح',
                'تصميم عصري جذاب',
                'مناسب لكل المناسبات',
                'مقاسات من S إلى XL',
                'سهل الغسيل'
            ]
        },
        {
            id: 7,
            name: 'حذاء رياضي',
            price: 450,
            category: 'sports',
            description: 'مثالي للجري والتمارين الرياضية',
            icon: '👟',
            rating: 4.5,
            imageUrl: '',
            features: [
                'نعل مرن ومريح',
                'دعم القوس والكاحل',
                'تهوية ممتازة',
                'خفيف الوزن',
                'مقاوم للماء'
            ]
        },
        {
            id: 8,
            name: 'حقيبة يد',
            price: 280,
            category: 'fashion',
            description: 'جلد طبيعي فاخر وتصميم أنيق',
            icon: '👜',
            rating: 4,
            imageUrl: '',
            features: [
                'جلد طبيعي 100%',
                'جيوب متعددة',
                'حجم مثالي',
                'سحاب قوي',
                'تصميم عصري'
            ]
        }
    ];
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// إضافة منتج للسلة
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        showNotification('⚠️ المنتج غير موجود');
        return;
    }
    
    const existingItem = cart.find(item => item.id == productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('تمت الإضافة للسلة بنجاح! ✓');
}

// حذف منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    showNotification('تم حذف المنتج من السلة');
}

// تحديث كمية المنتج
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        }
    }
}

// عرض المنتجات
function displayProducts(productsToShow, containerId = 'productsGrid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="icon">🔍</div>
                <h2>لم يتم العثور على منتجات</h2>
                <p>جرب البحث عن شيء آخر</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = productsToShow.map(product => {
        const imageDisplay = product.imageUrl 
            ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : product.icon;
            
        return `
            <a href="product-details.html?id=${product.id}" class="product-card">
                <div class="product-image">${imageDisplay}</div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                    <div class="product-price">${product.price} ريال</div>
                    <button class="btn" onclick="event.preventDefault(); addToCart('${product.id}')">
                        🛒 أضف للسلة
                    </button>
                </div>
            </a>
        `;
    }).join('');
}

// فلترة المنتجات
async function filterProducts(category) {
    let filtered;
    
    if (isFirebaseEnabled && category !== 'all') {
        // جلب من Firebase حسب الفئة
        filtered = await getProductsByCategory(category);
    } else {
        filtered = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
    }
    
    displayProducts(filtered);

    // تحديث الأزرار النشطة
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// البحث عن المنتجات
async function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    let filtered;
    if (isFirebaseEnabled) {
        filtered = await searchProducts(searchTerm);
    } else {
        filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
}

// عرض منتجات السلة
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSummary = document.querySelector('.cart-summary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">🛒</div>
                <h2>سلة التسوق فارغة</h2>
                <p>لم تقم بإضافة أي منتجات بعد</p>
                <a href="products.html" class="btn">تصفح المنتجات</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartSummary) cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => {
        const imageDisplay = item.imageUrl 
            ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` 
            : item.icon;
            
        return `
            <div class="cart-item">
                <div class="cart-item-image">${imageDisplay}</div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="cart-item-price">${item.price} ريال</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">حذف</button>
            </div>
        `;
    }).join('');

    updateCartSummary();
}

// تحديث ملخص السلة
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 50 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = subtotal + ' ريال';
    if (shippingEl) shippingEl.textContent = shipping + ' ريال';
    if (totalEl) totalEl.textContent = total + ' ريال';
}

// عرض تفاصيل المنتج
async function displayProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    let product;
    if (isFirebaseEnabled) {
        product = await getProductById(productId);
    } else {
        product = products.find(p => p.id == productId);
    }

    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    const imageDisplay = product.imageUrl 
        ? `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` 
        : `<div class="icon">${product.icon}</div>`;

    document.getElementById('productIcon').innerHTML = imageDisplay;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price + ' ريال';
    document.getElementById('productRating').innerHTML = '⭐'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    document.getElementById('productDescription').textContent = product.description;

    const featuresList = document.getElementById('productFeatures');
    if (featuresList && product.features) {
        featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    }

    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => addToCart(product.id);
    }
}

// عرض ملخص الطلب في صفحة الدفع
function displayOrderSummary() {
    const orderSummaryContainer = document.getElementById('orderSummaryContainer');
    if (!orderSummaryContainer) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    orderSummaryContainer.innerHTML = `
        ${cart.map(item => `
            <div class="summary-row">
                <span>${item.name} × ${item.quantity}</span>
                <span>${item.price * item.quantity} ريال</span>
            </div>
        `).join('')}
        <div class="summary-row">
            <span>المجموع الفرعي</span>
            <span>${subtotal} ريال</span>
        </div>
        <div class="summary-row">
            <span>الشحن</span>
            <span>${shipping} ريال</span>
        </div>
        <div class="summary-total">
            <span>المجموع الكلي</span>
            <span>${total} ريال</span>
        </div>
    `;
}

// اختيار طريقة الدفع
function selectPayment(element) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

// تأكيد الطلب
function confirmOrder() {
    const selectedPayment = document.querySelector('.payment-method.selected');
    
    if (!selectedPayment) {
        showNotification('⚠️ الرجاء اختيار طريقة الدفع');
        return;
    }

    const requiredInputs = document.querySelectorAll('.checkout-section input[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        showNotification('⚠️ الرجاء ملء جميع الحقول المطلوبة');
        return;
    }

    showNotification('تم تأكيد طلبك بنجاح! 🎉 سنتواصل معك قريباً');
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    showNotification('تم تسجيل الدخول بنجاح! ✓');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// معالجة التسجيل
function handleRegister(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('⚠️ كلمات المرور غير متطابقة');
        return;
    }

    showNotification('تم إنشاء الحساب بنجاح! ✓');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// معالجة نموذج الاتصال
function handleContact(event) {
    event.preventDefault();
    showNotification('تم إرسال رسالتك بنجاح! ✓ سنتواصل معك قريباً');
    event.target.reset();
}

// عرض الإشعارات
function showNotification(message) {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// تحديد الصفحة النشطة في القائمة
function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async function() {
    updateCartCount();
    setActivePage();
    
    // تحميل المنتجات
    await initializeProducts();

    // صفحة المنتجات
    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && category !== 'all') {
            await filterProducts(category);
        }
    }

    // صفحة الرئيسية - عرض 4 منتجات عشوائية
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const grid = document.getElementById('productsGrid');
        if (grid && products.length > 0) {
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            displayProducts(shuffled.slice(0, 4));
        }
    }

    // صفحة تفاصيل المنتج
    if (window.location.pathname.includes('product-details.html')) {
        await displayProductDetails();
    }

    // صفحة السلة
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }

    // صفحة الدفع
    if (window.location.pathname.includes('checkout.html')) {
        if (cart.length === 0) {
            window.location.href = 'cart.html';
        } else {
            displayOrderSummary();
        }
    }

    // إضافة مستمع البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchProducts);
    }
});
