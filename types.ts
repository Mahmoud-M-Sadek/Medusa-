// FIX: Import Dispatch and SetStateAction to be used in type definitions.
import type { Dispatch, SetStateAction } from 'react';

export interface ColorVariant {
  name: string;
  colorCode: string;
  images: string[]; // Array of base64 strings
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For sales
  subCategoryId: string;
  isAvailable: boolean;
  colorVariants: ColorVariant[];
  sizes: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export interface MainCategory {
  id:string;
  name: string;
  image: string;
}

export interface Subcategory {
    id: string;
    name: string;
    mainCategoryId: string;
}

export interface CartItem {
  id: string; // Unique identifier for the cart item, e.g., `${productId}-${color}-${size}`
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor: ColorVariant;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
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
  products: Product[];
  // FIX: Replaced React.Dispatch and React.SetStateAction with imported types.
  setProducts: Dispatch<SetStateAction<Product[]>>;
  mainCategories: MainCategory[];
  // FIX: Replaced React.Dispatch and React.SetStateAction with imported types.
  setMainCategories: Dispatch<SetStateAction<MainCategory[]>>;
  subcategories: Subcategory[];
  // FIX: Replaced React.Dispatch and React.SetStateAction with imported types.
  setSubcategories: Dispatch<SetStateAction<Subcategory[]>>;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}