import type { Dispatch, SetStateAction } from 'react';

export interface ColorVariant {
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

  // Sync Data Operations
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (productData: Product) => void;
  deleteProduct: (productId: number) => void;

  addMainCategory: (catData: Omit<MainCategory, 'id'>) => void;
  updateMainCategory: (catData: MainCategory) => void;
  deleteMainCategory: (catId: number) => void;

  addSubcategory: (subCatData: Omit<Subcategory, 'id'>) => void;
  updateSubcategory: (subCatData: Subcategory) => void;
  deleteSubcategory: (subCatId: number) => void;
  
  addOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Auth
  login: (password: string) => boolean;
  logout: () => void;
  
  // Cart
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}