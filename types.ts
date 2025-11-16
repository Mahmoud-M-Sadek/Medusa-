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

export interface Order {
    id: string;
    timestamp: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    totalPrice: number;
}


export interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  mainCategories: MainCategory[];
  setMainCategories: React.Dispatch<React.SetStateAction<MainCategory[]>>;
  subcategories: Subcategory[];
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'timestamp'>) => void;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}