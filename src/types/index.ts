export interface ICategory {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  createdAt: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  description_en: string;
  story: string;
  story_en: string;
  inspiration: string;
  inspiration_en: string;
  materials: string;
  materials_en: string;
  dimensions: string;
  year: number | null;
  edition: string;
  edition_en: string;
  creationTime: string;
  creationTime_en: string;
  uniqueTraits: string[];
  uniqueTraits_en: string[];
  price: number | null;
  images: string[];
  category: ICategory | string;
  featured: boolean;
  active: boolean;
  stock: number;
  showStock: boolean;
  createdAt: string;
}

export interface IOrderItem {
  product: IProduct | string;
  name: string;
  image: string;
  price: number | null;
  quantity: number;
}

export interface IOrder {
  id: string;
  items: IOrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    message?: string;
  };
  status: "pending" | "contacted" | "completed" | "cancelled";
  createdAt: string;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
