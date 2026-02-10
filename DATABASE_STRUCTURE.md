# 🗄️ Firebase Database Structure - E-Commerce System

## 📊 Database Schema

```json
{
  "products": {
    "product_id_1": {
      "product_id": "product_id_1",
      "name": "اسم المنتج",
      "description": "وصف المنتج",
      "price": 1000,
      "discount_price": 850,
      "status": "active",
      "category_id": "cat_1",
      "icon": "💻",
      "imageUrl": "https://...",
      "features": ["ميزة 1", "ميزة 2"],
      "created_at": 1234567890,
      "updated_at": 1234567890
    }
  },
  
  "categories": {
    "cat_1": {
      "category_id": "cat_1",
      "name": "إلكترونيات",
      "name_en": "electronics",
      "parent_id": null,
      "icon": "💻",
      "created_at": 1234567890
    },
    "cat_2": {
      "category_id": "cat_2",
      "name": "ملابس رجالية",
      "name_en": "fashion",
      "parent_id": "cat_parent",
      "icon": "👔",
      "created_at": 1234567890
    }
  },
  
  "stock": {
    "product_id_1": {
      "product_id": "product_id_1",
      "quantity_available": 100,
      "quantity_reserved": 5,
      "min_stock_alert": 10,
      "last_updated": 1234567890
    }
  },
  
  "carts": {
    "cart_id_1": {
      "cart_id": "cart_id_1",
      "user_id": "user_123",
      "session_id": "guest_session_xyz",
      "created_at": 1234567890,
      "updated_at": 1234567890,
      "items": {
        "cart_item_1": {
          "cart_item_id": "cart_item_1",
          "product_id": "product_id_1",
          "quantity": 2,
          "unit_price": 1000,
          "added_at": 1234567890
        }
      }
    }
  },
  
  "customers": {
    "customer_id_1": {
      "customer_id": "customer_id_1",
      "name": "أحمد محمد",
      "phone": "0501234567",
      "email": "ahmed@example.com",
      "address": "الرياض، حي العليا، شارع الملك فهد",
      "city": "الرياض",
      "created_at": 1234567890,
      "total_purchases": 5,
      "total_spent": 15000,
      "customer_type": "regular"
    }
  },
  
  "orders": {
    "order_id_1": {
      "order_id": "order_id_1",
      "order_number": "ORD-2024-001",
      "customer_id": "customer_id_1",
      "order_status": "paid",
      "total_amount": 2000,
      "discount_amount": 100,
      "shipping_fee": 50,
      "final_amount": 1950,
      "payment_method": "cash",
      "shipping_address": "الرياض، حي العليا",
      "notes": "ملاحظات الطلب",
      "created_at": 1234567890,
      "updated_at": 1234567890,
      "items": {
        "order_item_1": {
          "order_item_id": "order_item_1",
          "product_id": "product_id_1",
          "product_name": "لابتوب Dell",
          "quantity": 2,
          "price": 1000,
          "discount": 50,
          "total": 1950
        }
      }
    }
  },
  
  "invoices": {
    "invoice_id_1": {
      "invoice_id": "invoice_id_1",
      "invoice_number": "INV-2024-001",
      "order_id": "order_id_1",
      "customer_id": "customer_id_1",
      "invoice_date": 1234567890,
      "due_date": 1234567890,
      "total_amount": 1950,
      "paid_amount": 1950,
      "remaining_amount": 0,
      "invoice_status": "paid",
      "tax_amount": 0,
      "notes": "",
      "created_at": 1234567890,
      "updated_at": 1234567890
    }
  },
  
  "payments": {
    "payment_id_1": {
      "payment_id": "payment_id_1",
      "payment_number": "PAY-2024-001",
      "order_id": "order_id_1",
      "invoice_id": "invoice_id_1",
      "customer_id": "customer_id_1",
      "payment_method": "cash",
      "amount": 1950,
      "payment_status": "confirmed",
      "payment_date": 1234567890,
      "account_id": "acc_cash",
      "reference_number": "",
      "notes": "",
      "created_at": 1234567890
    }
  },
  
  "accounts": {
    "acc_cash": {
      "account_id": "acc_cash",
      "account_name": "الصندوق - نقدي",
      "account_type": "cash",
      "balance": 50000,
      "currency": "SAR",
      "is_active": true,
      "created_at": 1234567890,
      "last_transaction": 1234567890
    },
    "acc_bank": {
      "account_id": "acc_bank",
      "account_name": "البنك الأهلي",
      "account_type": "bank",
      "balance": 100000,
      "currency": "SAR",
      "account_number": "1234567890",
      "is_active": true,
      "created_at": 1234567890
    },
    "acc_receivable": {
      "account_id": "acc_receivable",
      "account_name": "الذمم المدينة",
      "account_type": "receivable",
      "balance": 25000,
      "currency": "SAR",
      "is_active": true,
      "created_at": 1234567890
    }
  },
  
  "transactions": {
    "trans_id_1": {
      "transaction_id": "trans_id_1",
      "transaction_type": "payment",
      "account_id": "acc_cash",
      "amount": 1950,
      "balance_before": 48050,
      "balance_after": 50000,
      "reference_type": "payment",
      "reference_id": "payment_id_1",
      "description": "دفعة من العميل أحمد محمد",
      "created_at": 1234567890
    }
  },
  
  "settings": {
    "general": {
      "store_name": "متجري الإلكتروني",
      "currency": "SAR",
      "tax_rate": 0.15,
      "shipping_fee": 50,
      "free_shipping_threshold": 500,
      "low_stock_threshold": 10
    },
    "order_counter": 1,
    "invoice_counter": 1,
    "payment_counter": 1
  }
}
```

## 🔗 Relationships

### Product → Category
```
products/product_id_1/category_id → categories/cat_1
```

### Product → Stock (1:1)
```
products/product_id_1 ↔ stock/product_id_1
```

### Order → Customer (N:1)
```
orders/order_id_1/customer_id → customers/customer_id_1
```

### Order → OrderItems (1:N)
```
orders/order_id_1/items/{item_id}
```

### Order → Invoice (1:1)
```
orders/order_id_1/order_id ↔ invoices/invoice_id_1/order_id
```

### Invoice → Payments (1:N)
```
invoices/invoice_id_1/invoice_id ← payments/payment_id_1/invoice_id
```

### Payment → Account (N:1)
```
payments/payment_id_1/account_id → accounts/acc_cash
```

## 📋 Indexes (for queries)

```json
{
  "rules": {
    "orders": {
      ".indexOn": ["customer_id", "order_status", "created_at"]
    },
    "invoices": {
      ".indexOn": ["customer_id", "invoice_status", "invoice_date"]
    },
    "payments": {
      ".indexOn": ["order_id", "invoice_id", "payment_date"]
    },
    "products": {
      ".indexOn": ["category_id", "status", "created_at"]
    },
    "stock": {
      ".indexOn": ["quantity_available"]
    }
  }
}
```

## 🔄 Workflow

### 1. Product Management
```
Create Product → Set Category → Initialize Stock
```

### 2. Order Flow
```
Add to Cart → Create Order → Generate Invoice → Process Payment → Update Stock → Update Accounts
```

### 3. Payment Flow
```
Receive Payment → Update Invoice Status → Update Account Balance → Create Transaction Record
```

### 4. Stock Management
```
Order Paid → Reduce Stock → Check Low Stock Alert
Order Cancelled → Restore Stock
```

## 💡 Business Logic Rules

### Stock Updates
```javascript
// When order status = "paid"
stock.quantity_available -= order_item.quantity

// When order status = "cancelled"
stock.quantity_available += order_item.quantity
```

### Invoice Status
```javascript
if (invoice.paid_amount === 0) {
  invoice_status = "unpaid"
} else if (invoice.paid_amount < invoice.total_amount) {
  invoice_status = "partially_paid"
} else {
  invoice_status = "paid"
}
```

### Order Total
```javascript
subtotal = SUM(items.quantity * items.price)
discount = discount_amount
shipping = shipping_fee
final_amount = subtotal - discount + shipping
```

### Account Balance
```javascript
// On payment received
account.balance += payment.amount

// On refund
account.balance -= refund.amount
```

## 🎯 Status Values

### Product Status
- `active` - نشط ومتاح للبيع
- `inactive` - غير نشط
- `hidden` - مخفي من العرض

### Order Status
- `pending` - قيد الانتظار
- `paid` - تم الدفع
- `shipped` - تم الشحن
- `completed` - مكتمل
- `cancelled` - ملغي

### Invoice Status
- `unpaid` - غير مدفوع
- `partially_paid` - مدفوع جزئياً
- `paid` - مدفوع بالكامل

### Payment Status
- `pending` - قيد الانتظار
- `confirmed` - مؤكد

### Payment Methods
- `cash` - نقدي
- `bank_transfer` - تحويل بنكي
- `online_gateway` - بوابة إلكترونية
- `card` - بطاقة ائتمان

### Account Types
- `cash` - نقدية
- `bank` - بنك
- `receivable` - ذمم مدينة
