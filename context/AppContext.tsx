import React, { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { demoProducts, demoMainCategories, demoSubcategories, demoOrders } from '../utils/demoData';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // This effect runs only once to set the initial data if it's the first visit.
    useEffect(() => {
        if (!localStorage.getItem('medusa_initialized')) {
            localStorage.setItem('medusa_products', JSON.stringify(demoProducts));
            localStorage.setItem('medusa_main_categories', JSON.stringify(demoMainCategories));
            localStorage.setItem('medusa_subcategories', JSON.stringify(demoSubcategories));
            localStorage.setItem('medusa_orders', JSON.stringify(demoOrders));
            localStorage.setItem('medusa_cart', JSON.stringify([]));
            localStorage.setItem('medusa_isLoggedIn', JSON.stringify(false));
            localStorage.setItem('medusa_initialized', 'true');
            // Force a reload to pick up the localStorage values
            window.location.reload();
        }
    }, []);

    const [products, setProducts] = useLocalStorage<Product[]>('medusa_products', []);
    const [mainCategories, setMainCategories] = useLocalStorage<MainCategory[]>('medusa_main_categories', []);
    const [subcategories, setSubcategories] = useLocalStorage<Subcategory[]>('medusa_subcategories', []);
    const [orders, setOrders] = useLocalStorage<Order[]>('medusa_orders', []);
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('medusa_isLoggedIn', false);
    const [cart, setCart] = useLocalStorage<CartItem[]>('medusa_cart', []);

    // Product CRUD
    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct: Product = { ...productData, id: newId };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (productData: Product) => {
        setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
    };

    const deleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    // Main Category CRUD
    const addMainCategory = (catData: Omit<MainCategory, 'id'>) => {
        const newId = mainCategories.length > 0 ? Math.max(...mainCategories.map(c => c.id)) + 1 : 1;
        const newCat: MainCategory = { ...catData, id: newId };
        setMainCategories(prev => [...prev, newCat]);
    };

    const updateMainCategory = (catData: MainCategory) => {
        setMainCategories(prev => prev.map(c => c.id === catData.id ? catData : c));
    };

    const deleteMainCategory = (catId: number) => {
        const subCatIdsToDelete = subcategories.filter(sc => sc.mainCategoryId === catId).map(sc => sc.id);
        setProducts(prev => prev.filter(p => !subCatIdsToDelete.includes(p.subCategoryId)));
        setSubcategories(prev => prev.filter(sc => sc.mainCategoryId !== catId));
        setMainCategories(prev => prev.filter(c => c.id !== catId));
    };

    // Subcategory CRUD
    const addSubcategory = (subCatData: Omit<Subcategory, 'id'>) => {
        const newId = subcategories.length > 0 ? Math.max(...subcategories.map(sc => sc.id)) + 1 : 1;
        const newSubCat: Subcategory = { ...subCatData, id: newId };
        setSubcategories(prev => [...prev, newSubCat]);
    };

    const updateSubcategory = (subCatData: Subcategory) => {
        setSubcategories(prev => prev.map(sc => sc.id === subCatData.id ? subCatData : sc));
    };

    const deleteSubcategory = (subCatId: number) => {
        setProducts(prev => prev.filter(p => p.subCategoryId !== subCatId));
        setSubcategories(prev => prev.filter(sc => sc.id !== subCatId));
    };

    // Order Management
    const addOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
        const newOrder: Order = {
            ...orderData,
            id: `MEDUSA-${Math.floor(Math.random() * 900000) + 100000}`,
            timestamp: new Date().toISOString(),
            status: 'تحت المراجعة',
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    // Auth
    const login = (password: string): boolean => {
        if (password === 'admin123') { // Simple password check
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    // Cart Management
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