export interface ICategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  inspiration: string;
  materials: string;
  dimensions: string;
  year: number | null;
  edition: string;
  creationTime: string;
  uniqueTraits: string[];
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
