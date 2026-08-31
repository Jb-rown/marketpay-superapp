export type Role = "consumer" | "vendor" | "wholesaler" | "rider" | "government" | "admin";

export type ProductCategory = "Grain" | "Vegetable" | "Fruit" | "Protein" | "Dairy" | "General";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  vendor: string;
  market: string;
  distanceKm: number;
  unit: string;
  price: number;
  marketAverage: number;
  stock: number;
  rating: number;
  featured?: boolean;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  type: "Top up" | "Transfer" | "Order payment" | "Escrow release" | "Withdrawal" | "Delivery fee";
  counterparty: string;
  amount: number;
  direction: "in" | "out";
  date: string;
  reference: string;
}

export interface Order {
  id: string;
  vendor: string;
  status: "CONFIRMED" | "PREPARING" | "IN_DELIVERY" | "DELIVERED" | "COMPLETED" | "DISPUTED";
  total: number;
  items: number;
  eta: string;
  createdAt: string;
  rider?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "order" | "wallet" | "price" | "security" | "system";
  read: boolean;
  createdAt: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
