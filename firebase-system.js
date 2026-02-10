// ========================================
// FIREBASE DATABASE FUNCTIONS - FULL SYSTEM
// ========================================

// المراجع الأساسية
const productsRef = database.ref('products');
const categoriesRef = database.ref('categories');
const stockRef = database.ref('stock');
const cartsRef = database.ref('carts');
const customersRef = database.ref('customers');
const ordersRef = database.ref('orders');
const invoicesRef = database.ref('invoices');
const paymentsRef = database.ref('payments');
const accountsRef = database.ref('accounts');
const transactionsRef = database.ref('transactions');
const settingsRef = database.ref('settings');

// ========================================
// 1️⃣ PRODUCT MANAGEMENT
// ========================================

// جلب جميع المنتجات
async function getAllProducts() {
    try {
        const snapshot = await productsRef.once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key],
            product_id: key
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// إضافة منتج جديد
async function addProduct(productData) {
    try {
        const newProductRef = productsRef.push();
        const productId = newProductRef.key;
        
        const product = {
            product_id: productId,
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            discount_price: productData.discount_price ? parseFloat(productData.discount_price) : null,
            status: productData.status || 'active',
            category_id: productData.category_id,
            icon: productData.icon || '📦',
            imageUrl: productData.imageUrl || '',
            features: productData.features || [],
            created_at: firebase.database.ServerValue.TIMESTAMP,
            updated_at: firebase.database.ServerValue.TIMESTAMP
        };
        
        // حفظ المنتج
        await newProductRef.set(product);
        
        // تهيئة المخزون
        await stockRef.child(productId).set({
            product_id: productId,
            quantity_available: parseInt(productData.stock) || 0,
            quantity_reserved: 0,
            min_stock_alert: 10,
            last_updated: firebase.database.ServerValue.TIMESTAMP
        });
        
        showNotification('✓ تم إضافة المنتج بنجاح!');
        return productId;
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('⚠️ حدث خطأ في إضافة المنتج');
        return null;
    }
}

// تحديث منتج
async function updateProduct(productId, updates) {
    try {
        updates.updated_at = firebase.database.ServerValue.TIMESTAMP;
        await productsRef.child(productId).update(updates);
        
        if (updates.stock !== undefined) {
            await stockRef.child(productId).update({
                quantity_available: parseInt(updates.stock),
                last_updated: firebase.database.ServerValue.TIMESTAMP
            });
        }
        
        showNotification('✓ تم تحديث المنتج بنجاح!');
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        showNotification('⚠️ حدث خطأ في التحديث');
        return false;
    }
}

// ========================================
// 2️⃣ CATEGORY MANAGEMENT
// ========================================

async function getAllCategories() {
    try {
        const snapshot = await categoriesRef.once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function addCategory(categoryData) {
    try {
        const newCatRef = categoriesRef.push();
        await newCatRef.set({
            category_id: newCatRef.key,
            name: categoryData.name,
            name_en: categoryData.name_en,
            parent_id: categoryData.parent_id || null,
            icon: categoryData.icon || '📁',
            created_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        showNotification('✓ تم إضافة الفئة بنجاح!');
        return newCatRef.key;
    } catch (error) {
        console.error('Error adding category:', error);
        showNotification('⚠️ حدث خطأ في إضافة الفئة');
        return null;
    }
}

// ========================================
// 3️⃣ STOCK MANAGEMENT
// ========================================

async function getProductStock(productId) {
    try {
        const snapshot = await stockRef.child(productId).once('value');
        return snapshot.val();
    } catch (error) {
        console.error('Error fetching stock:', error);
        return null;
    }
}

async function updateStock(productId, quantity, operation = 'set') {
    try {
        const stockData = await getProductStock(productId);
        
        let newQuantity;
        if (operation === 'increase') {
            newQuantity = (stockData?.quantity_available || 0) + quantity;
        } else if (operation === 'decrease') {
            newQuantity = Math.max(0, (stockData?.quantity_available || 0) - quantity);
        } else {
            newQuantity = quantity;
        }
        
        await stockRef.child(productId).update({
            quantity_available: newQuantity,
            last_updated: firebase.database.ServerValue.TIMESTAMP
        });
        
        return true;
    } catch (error) {
        console.error('Error updating stock:', error);
        return false;
    }
}

async function checkLowStock() {
    try {
        const snapshot = await stockRef.once('value');
        const stocks = snapshot.val();
        const lowStockProducts = [];
        
        for (let productId in stocks) {
            const stock = stocks[productId];
            if (stock.quantity_available <= stock.min_stock_alert) {
                const product = await getProductById(productId);
                lowStockProducts.push({
                    ...product,
                    current_stock: stock.quantity_available
                });
            }
        }
        
        return lowStockProducts;
    } catch (error) {
        console.error('Error checking low stock:', error);
        return [];
    }
}

// ========================================
// 4️⃣ CUSTOMER MANAGEMENT
// ========================================

async function getAllCustomers() {
    try {
        const snapshot = await customersRef.once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        }));
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
}

async function addCustomer(customerData) {
    try {
        const newCustomerRef = customersRef.push();
        await newCustomerRef.set({
            customer_id: newCustomerRef.key,
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email || null,
            address: customerData.address,
            city: customerData.city || '',
            created_at: firebase.database.ServerValue.TIMESTAMP,
            total_purchases: 0,
            total_spent: 0,
            customer_type: 'regular'
        });
        
        showNotification('✓ تم إضافة العميل بنجاح!');
        return newCustomerRef.key;
    } catch (error) {
        console.error('Error adding customer:', error);
        showNotification('⚠️ حدث خطأ في إضافة العميل');
        return null;
    }
}

async function updateCustomerStats(customerId, orderAmount) {
    try {
        const snapshot = await customersRef.child(customerId).once('value');
        const customer = snapshot.val();
        
        await customersRef.child(customerId).update({
            total_purchases: (customer.total_purchases || 0) + 1,
            total_spent: (customer.total_spent || 0) + orderAmount
        });
        
        return true;
    } catch (error) {
        console.error('Error updating customer stats:', error);
        return false;
    }
}

// ========================================
// 5️⃣ ORDER MANAGEMENT
// ========================================

async function getAllOrders() {
    try {
        const snapshot = await ordersRef.orderByChild('created_at').once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        })).reverse(); // الأحدث أولاً
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function createOrder(orderData) {
    try {
        // الحصول على رقم الطلب التالي
        const counterSnapshot = await settingsRef.child('order_counter').once('value');
        const orderNumber = (counterSnapshot.val() || 0) + 1;
        
        const newOrderRef = ordersRef.push();
        const orderId = newOrderRef.key;
        
        const order = {
            order_id: orderId,
            order_number: `ORD-${new Date().getFullYear()}-${String(orderNumber).padStart(4, '0')}`,
            customer_id: orderData.customer_id,
            order_status: 'pending',
            total_amount: orderData.total_amount,
            discount_amount: orderData.discount_amount || 0,
            shipping_fee: orderData.shipping_fee || 0,
            final_amount: orderData.final_amount,
            payment_method: orderData.payment_method,
            shipping_address: orderData.shipping_address,
            notes: orderData.notes || '',
            created_at: firebase.database.ServerValue.TIMESTAMP,
            updated_at: firebase.database.ServerValue.TIMESTAMP,
            items: orderData.items
        };
        
        await newOrderRef.set(order);
        await settingsRef.child('order_counter').set(orderNumber);
        
        // إنشاء الفاتورة تلقائياً
        await createInvoice(orderId, orderData.customer_id, orderData.final_amount);
        
        showNotification('✓ تم إنشاء الطلب بنجاح!');
        return orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        showNotification('⚠️ حدث خطأ في إنشاء الطلب');
        return null;
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const snapshot = await ordersRef.child(orderId).once('value');
        const order = snapshot.val();
        
        // إذا تم تغيير الحالة إلى "مدفوع"، قلل المخزون
        if (newStatus === 'paid' && order.order_status !== 'paid') {
            for (let itemId in order.items) {
                const item = order.items[itemId];
                await updateStock(item.product_id, item.quantity, 'decrease');
            }
            
            // تحديث إحصائيات العميل
            await updateCustomerStats(order.customer_id, order.final_amount);
        }
        
        // إذا تم إلغاء الطلب بعد الدفع، أرجع المخزون
        if (newStatus === 'cancelled' && order.order_status === 'paid') {
            for (let itemId in order.items) {
                const item = order.items[itemId];
                await updateStock(item.product_id, item.quantity, 'increase');
            }
        }
        
        await ordersRef.child(orderId).update({
            order_status: newStatus,
            updated_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        showNotification('✓ تم تحديث حالة الطلب بنجاح!');
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('⚠️ حدث خطأ في تحديث الحالة');
        return false;
    }
}

// ========================================
// 6️⃣ INVOICE MANAGEMENT
// ========================================

async function getAllInvoices() {
    try {
        const snapshot = await invoicesRef.orderByChild('invoice_date').once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        })).reverse();
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
}

async function createInvoice(orderId, customerId, totalAmount) {
    try {
        const counterSnapshot = await settingsRef.child('invoice_counter').once('value');
        const invoiceNumber = (counterSnapshot.val() || 0) + 1;
        
        const newInvoiceRef = invoicesRef.push();
        const invoice = {
            invoice_id: newInvoiceRef.key,
            invoice_number: `INV-${new Date().getFullYear()}-${String(invoiceNumber).padStart(4, '0')}`,
            order_id: orderId,
            customer_id: customerId,
            invoice_date: firebase.database.ServerValue.TIMESTAMP,
            due_date: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 يوم
            total_amount: totalAmount,
            paid_amount: 0,
            remaining_amount: totalAmount,
            invoice_status: 'unpaid',
            tax_amount: 0,
            notes: '',
            created_at: firebase.database.ServerValue.TIMESTAMP,
            updated_at: firebase.database.ServerValue.TIMESTAMP
        };
        
        await newInvoiceRef.set(invoice);
        await settingsRef.child('invoice_counter').set(invoiceNumber);
        
        return newInvoiceRef.key;
    } catch (error) {
        console.error('Error creating invoice:', error);
        return null;
    }
}

async function updateInvoiceStatus(invoiceId) {
    try {
        const snapshot = await invoicesRef.child(invoiceId).once('value');
        const invoice = snapshot.val();
        
        let newStatus;
        if (invoice.paid_amount === 0) {
            newStatus = 'unpaid';
        } else if (invoice.paid_amount < invoice.total_amount) {
            newStatus = 'partially_paid';
        } else {
            newStatus = 'paid';
        }
        
        const remaining = invoice.total_amount - invoice.paid_amount;
        
        await invoicesRef.child(invoiceId).update({
            invoice_status: newStatus,
            remaining_amount: remaining,
            updated_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        return true;
    } catch (error) {
        console.error('Error updating invoice status:', error);
        return false;
    }
}

// ========================================
// 7️⃣ PAYMENT MANAGEMENT
// ========================================

async function getAllPayments() {
    try {
        const snapshot = await paymentsRef.orderByChild('payment_date').once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        })).reverse();
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
}

async function processPayment(paymentData) {
    try {
        const counterSnapshot = await settingsRef.child('payment_counter').once('value');
        const paymentNumber = (counterSnapshot.val() || 0) + 1;
        
        const newPaymentRef = paymentsRef.push();
        const payment = {
            payment_id: newPaymentRef.key,
            payment_number: `PAY-${new Date().getFullYear()}-${String(paymentNumber).padStart(4, '0')}`,
            order_id: paymentData.order_id,
            invoice_id: paymentData.invoice_id,
            customer_id: paymentData.customer_id,
            payment_method: paymentData.payment_method,
            amount: parseFloat(paymentData.amount),
            payment_status: 'confirmed',
            payment_date: firebase.database.ServerValue.TIMESTAMP,
            account_id: paymentData.account_id,
            reference_number: paymentData.reference_number || '',
            notes: paymentData.notes || '',
            created_at: firebase.database.ServerValue.TIMESTAMP
        };
        
        await newPaymentRef.set(payment);
        await settingsRef.child('payment_counter').set(paymentNumber);
        
        // تحديث الفاتورة
        const invoiceSnapshot = await invoicesRef.child(paymentData.invoice_id).once('value');
        const invoice = invoiceSnapshot.val();
        const newPaidAmount = (invoice.paid_amount || 0) + payment.amount;
        
        await invoicesRef.child(paymentData.invoice_id).update({
            paid_amount: newPaidAmount
        });
        
        await updateInvoiceStatus(paymentData.invoice_id);
        
        // تحديث الطلب إلى "مدفوع" إذا تم دفع الفاتورة بالكامل
        if (newPaidAmount >= invoice.total_amount) {
            await updateOrderStatus(paymentData.order_id, 'paid');
        }
        
        // تحديث رصيد الحساب
        await updateAccountBalance(paymentData.account_id, payment.amount, 'increase');
        
        // إنشاء سجل معاملة
        await createTransaction({
            transaction_type: 'payment',
            account_id: paymentData.account_id,
            amount: payment.amount,
            reference_type: 'payment',
            reference_id: newPaymentRef.key,
            description: `دفعة من العميل - ${paymentData.payment_method}`
        });
        
        showNotification('✓ تم تسجيل الدفعة بنجاح!');
        return newPaymentRef.key;
    } catch (error) {
        console.error('Error processing payment:', error);
        showNotification('⚠️ حدث خطأ في تسجيل الدفعة');
        return null;
    }
}

// ========================================
// 8️⃣ ACCOUNT MANAGEMENT
// ========================================

async function getAllAccounts() {
    try {
        const snapshot = await accountsRef.once('value');
        const data = snapshot.val();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            ...data[key]
        }));
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return [];
    }
}

async function updateAccountBalance(accountId, amount, operation) {
    try {
        const snapshot = await accountsRef.child(accountId).once('value');
        const account = snapshot.val();
        
        const balanceBefore = account.balance || 0;
        let balanceAfter;
        
        if (operation === 'increase') {
            balanceAfter = balanceBefore + amount;
        } else {
            balanceAfter = balanceBefore - amount;
        }
        
        await accountsRef.child(accountId).update({
            balance: balanceAfter,
            last_transaction: firebase.database.ServerValue.TIMESTAMP
        });
        
        return { balanceBefore, balanceAfter };
    } catch (error) {
        console.error('Error updating account balance:', error);
        return null;
    }
}

async function createTransaction(transData) {
    try {
        const account = await accountsRef.child(transData.account_id).once('value');
        const accountData = account.val();
        
        const newTransRef = transactionsRef.push();
        await newTransRef.set({
            transaction_id: newTransRef.key,
            transaction_type: transData.transaction_type,
            account_id: transData.account_id,
            amount: transData.amount,
            balance_before: accountData.balance - transData.amount,
            balance_after: accountData.balance,
            reference_type: transData.reference_type,
            reference_id: transData.reference_id,
            description: transData.description,
            created_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        return newTransRef.key;
    } catch (error) {
        console.error('Error creating transaction:', error);
        return null;
    }
}

// ========================================
// 9️⃣ REPORTING FUNCTIONS
// ========================================

async function getSalesReport(startDate, endDate) {
    try {
        const snapshot = await ordersRef.once('value');
        const orders = snapshot.val();
        
        let totalSales = 0;
        let totalOrders = 0;
        let paidOrders = 0;
        let pendingOrders = 0;
        let cancelledOrders = 0;
        
        for (let orderId in orders) {
            const order = orders[orderId];
            const orderDate = order.created_at;
            
            if (orderDate >= startDate && orderDate <= endDate) {
                totalOrders++;
                
                if (order.order_status !== 'cancelled') {
                    totalSales += order.final_amount;
                }
                
                if (order.order_status === 'paid' || order.order_status === 'completed') {
                    paidOrders++;
                } else if (order.order_status === 'pending') {
                    pendingOrders++;
                } else if (order.order_status === 'cancelled') {
                    cancelledOrders++;
                }
            }
        }
        
        return {
            totalSales,
            totalOrders,
            paidOrders,
            pendingOrders,
            cancelledOrders,
            averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
        };
    } catch (error) {
        console.error('Error generating sales report:', error);
        return null;
    }
}

async function getTopProducts(limit = 10) {
    try {
        const ordersSnapshot = await ordersRef.once('value');
        const orders = ordersSnapshot.val();
        
        const productSales = {};
        
        for (let orderId in orders) {
            const order = orders[orderId];
            if (order.order_status !== 'cancelled' && order.items) {
                for (let itemId in order.items) {
                    const item = order.items[itemId];
                    if (!productSales[item.product_id]) {
                        productSales[item.product_id] = {
                            product_id: item.product_id,
                            product_name: item.product_name,
                            quantity_sold: 0,
                            total_revenue: 0
                        };
                    }
                    productSales[item.product_id].quantity_sold += item.quantity;
                    productSales[item.product_id].total_revenue += item.total;
                }
            }
        }
        
        return Object.values(productSales)
            .sort((a, b) => b.quantity_sold - a.quantity_sold)
            .slice(0, limit);
    } catch (error) {
        console.error('Error getting top products:', error);
        return [];
    }
}

async function getCustomerPurchaseSummary(customerId) {
    try {
        const ordersSnapshot = await ordersRef.orderByChild('customer_id').equalTo(customerId).once('value');
        const orders = ordersSnapshot.val();
        
        let totalOrders = 0;
        let totalSpent = 0;
        let paidOrders = 0;
        let pendingOrders = 0;
        
        for (let orderId in orders) {
            const order = orders[orderId];
            totalOrders++;
            
            if (order.order_status !== 'cancelled') {
                totalSpent += order.final_amount;
            }
            
            if (order.order_status === 'paid' || order.order_status === 'completed') {
                paidOrders++;
            } else if (order.order_status === 'pending') {
                pendingOrders++;
            }
        }
        
        return {
            totalOrders,
            totalSpent,
            paidOrders,
            pendingOrders,
            averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0
        };
    } catch (error) {
        console.error('Error getting customer summary:', error);
        return null;
    }
}

async function getInvoicesSummary() {
    try {
        const snapshot = await invoicesRef.once('value');
        const invoices = snapshot.val();
        
        let totalInvoices = 0;
        let totalAmount = 0;
        let totalPaid = 0;
        let totalUnpaid = 0;
        let paidCount = 0;
        let unpaidCount = 0;
        let partiallyPaidCount = 0;
        
        for (let invoiceId in invoices) {
            const invoice = invoices[invoiceId];
            totalInvoices++;
            totalAmount += invoice.total_amount;
            totalPaid += invoice.paid_amount;
            totalUnpaid += invoice.remaining_amount;
            
            if (invoice.invoice_status === 'paid') paidCount++;
            else if (invoice.invoice_status === 'unpaid') unpaidCount++;
            else if (invoice.invoice_status === 'partially_paid') partiallyPaidCount++;
        }
        
        return {
            totalInvoices,
            totalAmount,
            totalPaid,
            totalUnpaid,
            paidCount,
            unpaidCount,
            partiallyPaidCount
        };
    } catch (error) {
        console.error('Error getting invoices summary:', error);
        return null;
    }
}
