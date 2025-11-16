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

export interface Order {
    id: string;
    productName: string;
    color: string;
    size: string;
    price: number;
    timestamp: string;
}

export interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  mainCategories: MainCategory[];
  setMainCategories: React.Dispatch<React.SetStateAction<MainCategory[]>>;
  subcategories: Subcategory[];
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}