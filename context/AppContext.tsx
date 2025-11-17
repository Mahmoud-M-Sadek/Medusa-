import React, { createContext, useState, useEffect } from 'react';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // App States
  // FIX: Replaced useLocalStorage with useState and useEffect to handle localStorage persistence directly, as hooks/useLocalStorage.ts is not a module.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem('isLoggedIn');
      return item ? JSON.parse(item) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    } catch (error) {
      console.error(error);
    }
  }, [isLoggedIn]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const item = window.localStorage.getItem('cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error(error);
    }
  }, [cart]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching from API ---
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, mainCategoriesRes, subcategoriesRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories/main'),
        fetch('/api/categories/sub'),
        fetch('/api/orders')
      ]);

      if (!productsRes.ok || !mainCategoriesRes.ok || !subcategoriesRes.ok || !ordersRes.ok) {
        throw new Error('فشل تحميل البيانات من الخادم.');
      }
      
      const productsData = await productsRes.json();
      const mainCategoriesData = await mainCategoriesRes.json();
      const subcategoriesData = await subcategoriesRes.json();
      const ordersData = await ordersRes.json();

      setProducts(productsData);
      setMainCategories(mainCategoriesData);
      setSubcategories(subcategoriesData);
      setOrders(ordersData);

    } catch (e: any) {
        setError(e.message || "فشل تحميل البيانات.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  // --- CRUD Operations to API ---

  // Products
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to add product');
    await fetchInitialData(); // Refetch all data to stay in sync
    return response.json();
  };

  const updateProduct = async (productData: Product): Promise<Product> => {
    const response = await fetch(`/api/products/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    await fetchInitialData();
    return response.json();
  };

  const deleteProduct = async (productId: number): Promise<void> => {
    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete product');
    await fetchInitialData();
  };
  
  // Main Categories
  const addMainCategory = async (catData: Omit<MainCategory, 'id'>): Promise<MainCategory> => {
     const response = await fetch('/api/categories/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
    });
    if (!response.ok) throw new Error('Failed to add main category');
    await fetchInitialData();
    return response.json();
  };

  const updateMainCategory = async (catData: MainCategory): Promise<MainCategory> => {
    const response = await fetch(`/api/categories/main/${catData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
    });
    if (!response.ok) throw new Error('Failed to update main category');
    await fetchInitialData();
    return response.json();
  };
  
  const deleteMainCategory = async (catId: number): Promise<void> => {
    const response = await fetch(`/api/categories/main/${catId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete main category');
    await fetchInitialData();
  };

  // Subcategories
  const addSubcategory = async (subCatData: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
    const response = await fetch('/api/categories/sub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subCatData),
    });
    if (!response.ok) throw new Error('Failed to add subcategory');
    await fetchInitialData();
    return response.json();
  };

  const updateSubcategory = async (subCatData: Subcategory): Promise<Subcategory> => {
    const response = await fetch(`/api/categories/sub/${subCatData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subCatData),
    });
    if (!response.ok) throw new Error('Failed to update subcategory');
    await fetchInitialData();
    return response.json();
  };

  const deleteSubcategory = async (subCatId: number): Promise<void> => {
     const response = await fetch(`/api/categories/sub/${subCatId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete subcategory');
    await fetchInitialData();
  };

  // Orders
  const addOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Promise<Order> => {
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    const newOrder = await response.json();
    await fetchInitialData();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    await fetchInitialData();
  };

  // Auth
  const login = async (password: string): Promise<boolean> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    if (response.ok) {
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
    products, mainCategories, subcategories, orders, isLoggedIn, cart, isLoading, error,
    fetchInitialData, addProduct, updateProduct, deleteProduct,
    addMainCategory, updateMainCategory, deleteMainCategory,
    addSubcategory, updateSubcategory, deleteSubcategory,
    addOrder, updateOrderStatus,
    login, logout,
    addToCart, removeFromCart, updateCartItemQuantity, clearCart
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};