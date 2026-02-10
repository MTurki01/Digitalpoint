// ملف إعداد Firebase
// استبدل هذه القيم بقيمك الخاصة من Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBicx1hLOaoHymb5gwNcO_RYYBif3GJ6kU",
  authDomain: "ebaastore-f91bf.firebaseapp.com",
  databaseURL: "https://ebaastore-f91bf-default-rtdb.firebaseio.com",
  projectId: "ebaastore-f91bf",
  storageBucket: "ebaastore-f91bf.firebasestorage.app",
  messagingSenderId: "1022801327374",
  appId: "1:1022801327374:web:7b3d25f1fc998e6471935f",
  measurementId: "G-NZHWBS58HG"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع قاعدة البيانات
const database = firebase.database();

// مرجع المنتجات
const productsRef = database.ref('products');

// دالة لجلب جميع المنتجات
async function getProductsFromFirebase() {
    try {
        const snapshot = await productsRef.once('value');
        const productsData = snapshot.val();
        
        if (productsData) {
            // تحويل الكائن إلى مصفوفة
            return Object.keys(productsData).map(key => ({
                id: key,
                ...productsData[key]
            }));
        }
        return [];
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        showNotification('⚠️ حدث خطأ في تحميل المنتجات');
        return [];
    }
}

// دالة لإضافة منتج جديد
async function addProductToFirebase(product) {
    try {
        const newProductRef = productsRef.push();
        await newProductRef.set({
            name: product.name,
            price: parseFloat(product.price),
            category: product.category,
            description: product.description,
            icon: product.icon || '📦',
            rating: parseFloat(product.rating) || 4.0,
            features: product.features || [],
            imageUrl: product.imageUrl || '',
            stock: parseInt(product.stock) || 0,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        
        showNotification('✓ تمت إضافة المنتج بنجاح!');
        return newProductRef.key;
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        showNotification('⚠️ حدث خطأ في إضافة المنتج');
        return null;
    }
}

// دالة لتحديث منتج
async function updateProductInFirebase(productId, updates) {
    try {
        await productsRef.child(productId).update(updates);
        showNotification('✓ تم تحديث المنتج بنجاح!');
        return true;
    } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        showNotification('⚠️ حدث خطأ في تحديث المنتج');
        return false;
    }
}

// دالة لحذف منتج
async function deleteProductFromFirebase(productId) {
    try {
        await productsRef.child(productId).remove();
        showNotification('✓ تم حذف المنتج بنجاح!');
        return true;
    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        showNotification('⚠️ حدث خطأ في حذف المنتج');
        return false;
    }
}

// دالة للاستماع للتغييرات في الوقت الفعلي
function listenToProductsChanges(callback) {
    productsRef.on('value', (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
            const productsArray = Object.keys(productsData).map(key => ({
                id: key,
                ...productsData[key]
            }));
            callback(productsArray);
        } else {
            callback([]);
        }
    });
}

// دالة لإيقاف الاستماع
function stopListeningToProducts() {
    productsRef.off();
}

// دالة لرفع صورة إلى Firebase Storage (اختياري)
async function uploadProductImage(file, productId) {
    try {
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`products/${productId}/${file.name}`);
        
        // رفع الصورة
        const snapshot = await imageRef.put(file);
        
        // الحصول على رابط الصورة
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return downloadURL;
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        showNotification('⚠️ حدث خطأ في رفع الصورة');
        return null;
    }
}

// دالة لجلب منتج واحد حسب ID
async function getProductById(productId) {
    try {
        const snapshot = await productsRef.child(productId).once('value');
        const productData = snapshot.val();
        
        if (productData) {
            return {
                id: productId,
                ...productData
            };
        }
        return null;
    } catch (error) {
        console.error('خطأ في جلب المنتج:', error);
        return null;
    }
}

// دالة لجلب المنتجات حسب الفئة
async function getProductsByCategory(category) {
    try {
        const snapshot = await productsRef
            .orderByChild('category')
            .equalTo(category)
            .once('value');
        
        const productsData = snapshot.val();
        
        if (productsData) {
            return Object.keys(productsData).map(key => ({
                id: key,
                ...productsData[key]
            }));
        }
        return [];
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return [];
    }
}

// دالة للبحث في المنتجات
async function searchProducts(searchTerm) {
    try {
        const allProducts = await getProductsFromFirebase();
        const searchLower = searchTerm.toLowerCase();
        
        return allProducts.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
    } catch (error) {
        console.error('خطأ في البحث:', error);
        return [];
    }
}
