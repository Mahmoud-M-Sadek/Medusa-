
// FIX: Import createContext from react to resolve 'Cannot find name' error.
import React, { createContext, useState } from 'react';
import type { Product, MainCategory, Subcategory, Order, AppContextType, CartItem, OrderStatus } from '../types';

export const AppContext = createContext<AppContextType | null>(null);

const initialMainCategories: MainCategory[] = [
    { id: '1', name: 'ملابس', image: 'https://picsum.photos/seed/cat1/600/400' },
    { id: '2', name: 'شنط', image: 'https://picsum.photos/seed/cat2/600/400' },
    { id: '3', name: 'أحذية', image: 'https://picsum.photos/seed/cat3/600/400' },
    { id: '4', name: 'إكسسوارات', image: 'https://picsum.photos/seed/cat4/600/400' },
];

const initialSubcategories: Subcategory[] = [
    { id: 's1', name: 'تيشيرتات', mainCategoryId: '1' },
    { id: 's2', name: 'فساتين', mainCategoryId: '1' },
    { id: 's3', name: 'شنط ظهر', mainCategoryId: '2' },
    { id: 's4', name: 'أحذية رياضية', mainCategoryId: '3' },
    { id: 's5', name: 'ساعات', mainCategoryId: '4' },
    { id: 's6', name: 'نظارات شمسية', mainCategoryId: '4' },
];


const initialProducts: Product[] = [
    {
        id: '1',
        name: 'تيشيرت عصري',
        description: 'تيشيرت قطني 100% بتصميم فريد وعصري، مناسب لجميع الأوقات.',
        price: 350,
        subCategoryId: 's1',
        isAvailable: true,
        isBestSeller: true,
        isFeatured: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p1black1/800/1000', 'https://picsum.photos/seed/p1black2/800/1000', 'https://picsum.photos/seed/p1black3/800/1000'] },
            { name: 'أبيض', colorCode: '#FFFFFF', images: ['https://picsum.photos/seed/p1white1/800/1000', 'https://picsum.photos/seed/p1white2/800/1000'] },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
    },
    {
        id: '2',
        name: 'حقيبة ظهر جلدية',
        description: 'حقيبة ظهر من الجلد الطبيعي، تصميم أنيق وعملي.',
        price: 800,
        subCategoryId: 's3',
        isAvailable: true,
        isBestSeller: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p2black1/800/1000', 'https://picsum.photos/seed/p2black2/800/1000'] },
        ],
        sizes: ['مقاس واحد'],
    },
    {
        id: '3',
        name: 'حذاء رياضي',
        description: 'حذاء رياضي مريح مصمم للمشي والركض.',
        price: 1200,
        subCategoryId: 's4',
        isAvailable: true,
        isBestSeller: true,
        isFeatured: true,
        originalPrice: 1500,
        colorVariants: [
            { name: 'أبيض', colorCode: '#FFFFFF', images: ['https://picsum.photos/seed/p3white1/800/1000', 'https://picsum.photos/seed/p3white2/800/1000'] },
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p3black1/800/1000'] },
        ],
        sizes: ['42', '43', '44', '45'],
    },
    {
        id: '4',
        name: 'ساعة يد كلاسيكية',
        description: 'ساعة يد بتصميم كلاسيكي فاخر.',
        price: 2500,
        subCategoryId: 's5',
        isAvailable: false,
        isBestSeller: false,
        colorVariants: [
            { name: 'فضي', colorCode: '#C0C0C0', images: ['https://picsum.photos/seed/p4silver1/800/1000'] },
        ],
        sizes: ['مقاس واحد'],
    },
    {
        id: '5',
        name: 'فستان سهرة',
        description: 'فستان أنيق ومميز للمناسبات الخاصة.',
        price: 1800,
        subCategoryId: 's2',
        isAvailable: true,
        isFeatured: true,
        originalPrice: 2200,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p5black1/800/1000'] },
        ],
        sizes: ['M', 'L'],
    },
     {
        id: '6',
        name: 'نظارة شمسية',
        description: 'نظارة شمسية عصرية لحماية عينيك بأناقة.',
        price: 600,
        subCategoryId: 's6',
        isAvailable: true,
        isBestSeller: true,
        isFeatured: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p6black1/800/1000'] },
        ],
        sizes: ['مقاس واحد'],
    }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State is now managed by useState and will reset on every page load.
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>(initialMainCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);


  const login = (password: string) => {
    if (password === 'admin123456') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
    const newOrder: Order = {
        ...orderData,
        id: `MODESSA-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'تحت المراجعة',
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

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

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
      setCart(prevCart => {
          if (quantity <= 0) {
              return prevCart.filter(item => item.id !== itemId);
          }
          return prevCart.map(item => item.id === itemId ? { ...item, quantity } : item);
      })
  };

  const clearCart = () => {
    setCart([]);
  };


  return (
    <AppContext.Provider value={{ products, setProducts, mainCategories, setMainCategories, subcategories, setSubcategories, orders, addOrder, updateOrderStatus, isLoggedIn, login, logout, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart }}>
      {children}
    </AppContext.Provider>
  );
};
