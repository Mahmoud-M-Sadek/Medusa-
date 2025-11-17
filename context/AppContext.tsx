import React, { createContext, useState, useEffect } from 'react';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';

// This is a helper hook for cart and login state that still needs persistence on the client.
function useClientSideLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


export const AppContext = createContext<AppContextType | null>(null);

const API_BASE_URL = '/api'; // Vercel rewrites will handle this

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isLoggedIn, setIsLoggedIn] = useClientSideLocalStorage<boolean>('isLoggedIn', false);
  const [cart, setCart] = useClientSideLocalStorage<CartItem[]>('cart', []);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const [productsRes, mainCatsRes, subCatsRes, ordersRes] = await Promise.all([
            fetch(`${API_BASE_URL}/products`),
            fetch(`${API_BASE_URL}/categories/main`),
            fetch(`${API_BASE_URL}/categories/sub`),
            fetch(`${API_BASE_URL}/orders`),
        ]);

        if (!productsRes.ok || !mainCatsRes.ok || !subCatsRes.ok || !ordersRes.ok) {
            throw new Error('فشل تحميل البيانات من الخادم.');
        }

        const productsData = await productsRes.json();
        const mainCatsData = await mainCatsRes.json();
        const subCatsData = await subCatsRes.json();
        const ordersData = await ordersRes.json();

        setProducts(productsData);
        setMainCategories(mainCatsData);
        setSubcategories(subCatsData);
        setOrders(ordersData);

    } catch (err: any) {
        setError(err.message || 'حدث خطأ غير متوقع.');
    } finally {
        setIsLoading(false);
    }
  };
  
  // Generic helper for API calls
  const apiCall = async (url: string, method: string, body?: any) => {
    const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'فشل تنفيذ العملية' }));
        throw new Error(errorData.message);
    }
    return response.status !== 204 ? response.json() : null;
  };

  // Products
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct = await apiCall(`${API_BASE_URL}/products`, 'POST', productData);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (productData: Product) => {
    const updatedProduct = await apiCall(`${API_BASE_URL}/products/${productData.id}`, 'PUT', productData);
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = async (productId: number) => {
    await apiCall(`${API_BASE_URL}/products/${productId}`, 'DELETE');
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  // Categories
  const addMainCategory = async (catData: Omit<MainCategory, 'id'>) => {
    const newCat = await apiCall(`${API_BASE_URL}/categories/main`, 'POST', catData);
    setMainCategories(prev => [...prev, newCat]);
  };

  const updateMainCategory = async (catData: MainCategory) => {
    const updatedCat = await apiCall(`${API_BASE_URL}/categories/main/${catData.id}`, 'PUT', catData);
    setMainCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
  };

  const deleteMainCategory = async (catId: number) => {
    await apiCall(`${API_BASE_URL}/categories/main/${catId}`, 'DELETE');
    // We need to refetch data to reflect cascading deletes on subcats and products
    fetchInitialData();
  };

  // Subcategories
  const addSubcategory = async (subCatData: Omit<Subcategory, 'id'>) => {
    const newSubCat = await apiCall(`${API_BASE_URL}/categories/sub`, 'POST', subCatData);
    setSubcategories(prev => [...prev, newSubCat]);
  };

  const updateSubcategory = async (subCatData: Subcategory) => {
    const updatedSubCat = await apiCall(`${API_BASE_URL}/categories/sub/${subCatData.id}`, 'PUT', subCatData);
    setSubcategories(prev => prev.map(sc => sc.id === updatedSubCat.id ? updatedSubCat : sc));
  };

  const deleteSubcategory = async (subCatId: number) => {
    await apiCall(`${API_BASE_URL}/categories/sub/${subCatId}`, 'DELETE');
    // Refetch to reflect cascading product deletes
    fetchInitialData();
  };

  // Orders
  const addOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Promise<Order | null> => {
    try {
        const newOrder = await apiCall(`${API_BASE_URL}/orders`, 'POST', orderData);
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    } catch (err) {
        console.error(err);
        return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await apiCall(`${API_BASE_URL}/orders/${orderId}`, 'PUT', { status });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Auth
  const login = async (password: string): Promise<boolean> => {
    try {
        await apiCall(`${API_BASE_URL}/auth/login`, 'POST', { password });
        setIsLoggedIn(true);
        return true;
    } catch (err) {
        return false;
    }
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
    addProduct, updateProduct, deleteProduct,
    addMainCategory, updateMainCategory, deleteMainCategory,
    addSubcategory, updateSubcategory, deleteSubcategory,
    addOrder, updateOrderStatus,
    fetchInitialData,
    login, logout,
    addToCart, removeFromCart, updateCartItemQuantity, clearCart
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};