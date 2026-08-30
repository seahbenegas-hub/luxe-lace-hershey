export interface Dress {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string[];
  color: string;
  occasion: string;
  image: string;
  available: boolean;
  category: string;
  featured?: boolean;
}

export interface Booking {
  id: string;
  dressId: string;
  dressName: string;
  userEmail: string;
  userName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  qrCode?: string;
  paymentReceipt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface FilterOptions {
  size?: string;
  color?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}
