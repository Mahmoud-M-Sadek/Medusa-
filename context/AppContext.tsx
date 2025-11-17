import React, { createContext } from 'react';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialProducts, initialMainCategories, initialSubcategories, initialOrders } from '../utils/demoData';

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data States using Local Storage for persistence
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [mainCategories, setMainCategories] = useLocalStorage<MainCategory[]>('mainCategories', initialMainCategories);
  const [subcategories, setSubcategories] = useLocalStorage<Subcategory[]>('subcategories', initialSubcategories);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', initialOrders);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  // CRUD Operations (Synchronous, local)

  // Products
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = { ...productData, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productData: Product) => {
    setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  // Main Categories
  const addMainCategory = (catData: Omit<MainCategory, 'id'>) => {
    const newCategory = { ...catData, id: Date.now() };
    setMainCategories(prev => [...prev, newCategory]);
  };

  const updateMainCategory = (catData: MainCategory) => {
    setMainCategories(prev => prev.map(c => c.id === catData.id ? catData : c));
  };
  
  const deleteMainCategory = (catId: number) => {
     // Also delete related subcategories and products
     const relatedSubIds = subcategories.filter(sc => sc.mainCategoryId === catId).map(sc => sc.id);
     setSubcategories(prev => prev.filter(sc => sc.mainCategoryId !== catId));
     setProducts(prev => prev.filter(p => !relatedSubIds.includes(p.subCategoryId)));
     setMainCategories(prev => prev.filter(c => c.id !== catId));
  };

  // Subcategories
  const addSubcategory = (subCatData: Omit<Subcategory, 'id'>) => {
     const newSubCategory = { ...subCatData, id: Date.now() };
     setSubcategories(prev => [...prev, newSubCategory]);
  };

  const updateSubcategory = (subCatData: Subcategory) => {
     setSubcategories(prev => prev.map(sc => sc.id === subCatData.id ? subCatData : sc));
  };

  const deleteSubcategory = (subCatId: number) => {
     // Also delete related products
     setProducts(prev => prev.filter(p => p.subCategoryId !== subCatId));
     setSubcategories(prev => prev.filter(sc => sc.id !== subCatId));
  };

  // Orders
  const addOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
    const newOrder: Order = {
        ...orderData,
        id: `MEDUSA-${Math.floor(Math.random() * 900000) + 100000}`,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'تحت المراجعة'
    }
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Auth
  const login = (password: string): boolean => {
    // Simple hardcoded password check
    if (password === 'admin123') {
        setIsLoggedIn(true);
        return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };
  
  // Cart (remains client-side)
  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const cartItemId = `${item.productId}-${item.selectedColor.name}-${item.selectedSize}`;
    const existingItem = cart.find(i => i.id === cartItemId);

    if (existingItem) {
        updateCartItemQuantity(cartItemId, existingItem.quantity + 1);
    } else {
        const newItem: CartItem = { ...item, id: cartItemId, quantity: 1 };
        setCart(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
        removeFromCart(itemId);
        return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const contextValue: AppContextType = {
    products, mainCategories, subcategories, orders, isLoggedIn, cart,
    addProduct, updateProduct, deleteProduct,
    addMainCategory, updateMainCategory, deleteMainCategory,
    addSubcategory, updateSubcategory, deleteSubcategory,
    addOrder, updateOrderStatus,
    login, logout,
    addToCart, removeFromCart, updateCartItemQuantity, clearCart
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};