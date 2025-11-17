import type { Dispatch, SetStateAction } from 'react';

export interface ColorVariant {
  id?: number; // Optional for new variants
  name: string;
  colorCode: string;
  images: string[]; // Array of image URLs
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For sales
  subCategoryId: number;
  isAvailable: boolean;
  colorVariants: ColorVariant[];
  sizes: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export interface MainCategory {
  id: number;
  name: string;
  image: string;
}

export interface Subcategory {
    id: number;
    name: string;
    mainCategoryId: number;
}

export interface CartItem {
  id: string; // Unique identifier for the cart item, e.g., `${productId}-${color}-${size}`
  productId: number;
  name: string;
  price: number;
  image: string;
  selectedColor: ColorVariant;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

export type OrderStatus = 'تحت المراجعة' | 'تم التأكيد' | 'تم الشحن' | 'تم التوصيل' | 'ملغي';

export interface Order {
    id: string;
    timestamp: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
}

export interface AppContextType {
  // State
  products: Product[];
  mainCategories: MainCategory[];
  subcategories: Subcategory[];
  orders: Order[];
  isLoggedIn: boolean;
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Async Data Operations
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productData: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;

  addMainCategory: (catData: Omit<MainCategory, 'id'>) => Promise<void>;
  updateMainCategory: (catData: MainCategory) => Promise<void>;
  deleteMainCategory: (catId: number) => Promise<void>;

  addSubcategory: (subCatData: Omit<Subcategory, 'id'>) => Promise<void>;
  updateSubcategory: (subCatData: Subcategory) => Promise<void>;
  deleteSubcategory: (subCatId: number) => Promise<void>;
  
  addOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  fetchInitialData: () => Promise<void>;

  // Auth
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  
  // Cart
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}