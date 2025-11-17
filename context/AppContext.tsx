
import React, { createContext, useState, useEffect } from 'react';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';

export const AppContext = createContext<AppContextType | null>(null);

// NOTE: All data is now intended to be fetched from a backend API.
// The state is initialized as empty and populated via an API call.

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth & Cart States (Cart remains client-side for now)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch initial data from the backend on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be API endpoints, e.g., /api/products
        // For now, we simulate a fetch with the previous hardcoded data.
        // Replace these with actual fetch() calls to your backend.
        const initialMainCategories: MainCategory[] = [
            { id: '1', name: 'ملابس', image: 'https://picsum.photos/seed/cat1/600/400' },
            { id: '2', name: 'شنط', image: 'https://picsum.photos/seed/cat2/600/400' },
        ];
        const initialSubcategories: Subcategory[] = [
            { id: 's1', name: 'تيشيرتات', mainCategoryId: '1' },
            { id: 's2', name: 'فساتين', mainCategoryId: '1' },
        ];
        const initialProducts: Product[] = [
            {
                id: '1', name: 'تيشيرت عصري', description: 'تيشيرت قطني 100%.', price: 350,
                subCategoryId: 's1', isAvailable: true, isBestSeller: true, isFeatured: true,
                colorVariants: [{ name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p1black1/800/1000'] }],
                sizes: ['S', 'M', 'L', 'XL'],
            },
        ];
        
        // Simulate API delay
        await new Promise(res => setTimeout(res, 500)); 

        setProducts(initialProducts);
        setMainCategories(initialMainCategories);
        setSubcategories(initialSubcategories);
        setOrders([]); // Orders would be fetched for the admin dashboard
        
        setError(null);
      } catch (err) {
        setError('فشل في تحميل البيانات من الخادم.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- API-driven Functions (to be implemented with fetch) ---
  
  // Products
  const addProduct = async (productData: Omit<Product, 'id'>) => { console.log('API CALL: Add Product', productData); /* TODO: POST /api/products */ };
  const updateProduct = async (productData: Product) => { console.log('API CALL: Update Product', productData); /* TODO: PUT /api/products/:id */ };
  const deleteProduct = async (productId: string) => { console.log('API CALL: Delete Product', productId); /* TODO: DELETE /api/products/:id */ };
  
  // Categories
  const addMainCategory = async (catData: Omit<MainCategory, 'id'>) => { console.log('API CALL: Add Main Category', catData); /* TODO: POST /api/categories */ };
  const updateMainCategory = async (catData: MainCategory) => { console.log('API CALL: Update Main Category', catData); /* TODO: PUT /api/categories/:id */ };
  const deleteMainCategory = async (catId: string) => { console.log('API CALL: Delete Main Category', catId); /* TODO: DELETE /api/categories/:id */ };

  // Subcategories
  const addSubcategory = async (subCatData: Omit<Subcategory, 'id'>) => { console.log('API CALL: Add Subcategory', subCatData); /* TODO: POST /api/subcategories */ };
  const updateSubcategory = async (subCatData: Subcategory) => { console.log('API CALL: Update Subcategory', subCatData); /* TODO: PUT /api/subcategories/:id */ };
  const deleteSubcategory = async (subCatId: string) => { console.log('API CALL: Delete Subcategory', subCatId); /* TODO: DELETE /api/subcategories/:id */ };


  // --- Auth & Orders ---
  const login = (password: string) => {
    // This should be an API call that returns a token
    if (password === 'admin123456') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  const addOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
    // This should POST the order to the backend and return the created order
    const newOrder: Order = {
        ...orderData,
        id: `MEDUSA-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'تحت المراجعة',
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    console.log('API CALL: Add Order', newOrder); // TODO: POST /api/orders
    return newOrder;
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));
    console.log('API CALL: Update Order Status', { orderId, status }); // TODO: PUT /api/orders/:id/status
  };

  // --- Client-side Cart Management ---
  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const cartItemId = `${item.productId}-${item.selectedColor.name}-${item.selectedSize}`;
    setCart(prevCart => {
        const existingItem = prevCart.find(i => i.id === cartItemId);
        if (existingItem) {
            return prevCart.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            return [...prevCart, { ...item, id: cartItemId, quantity: 1 }];
        }
    });
  };

  const removeFromCart = (itemId: string) => setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
      setCart(prevCart => {
          if (quantity <= 0) {
              return prevCart.filter(item => item.id !== itemId);
          }
          return prevCart.map(item => item.id === itemId ? { ...item, quantity } : item);
      })
  };

  const clearCart = () => setCart([]);

  const value: AppContextType = {
    products, setProducts, // Keep setProducts for now for optimistic updates in admin panel
    mainCategories, setMainCategories,
    subcategories, setSubcategories,
    orders, addOrder, updateOrderStatus,
    isLoggedIn, login, logout,
    cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart
  };

  // A simple loading/error state for the whole app
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>جاري تحميل البيانات...</p></div>;
  }
  if (error) {
     return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
