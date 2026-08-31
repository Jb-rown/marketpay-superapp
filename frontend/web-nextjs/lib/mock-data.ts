import type { NotificationItem, Order, Product, Transaction } from "./types";

export const products: Product[] = [
  { id: "P-1001", name: "Dry Maize", category: "Grain", vendor: "Wakulima Fresh", market: "Wakulima Market", distanceKm: 1.8, unit: "kg", price: 82, marketAverage: 89, stock: 420, rating: 4.8, featured: true, nutrition: { calories: 365, protein: "9.4g", carbs: "74g", fat: "4.7g" } },
  { id: "P-1002", name: "Pishori Rice", category: "Grain", vendor: "Mwea Direct", market: "Gikomba", distanceKm: 3.2, unit: "kg", price: 188, marketAverage: 195, stock: 260, rating: 4.7, nutrition: { calories: 360, protein: "7g", carbs: "79g", fat: "0.6g" } },
  { id: "P-1003", name: "Red Onions", category: "Vegetable", vendor: "Mama Mboga Hub", market: "Kawangware", distanceKm: 2.4, unit: "kg", price: 118, marketAverage: 132, stock: 85, rating: 4.9, featured: true },
  { id: "P-1004", name: "Tomatoes Grade A", category: "Vegetable", vendor: "Fresh Basket", market: "City Market", distanceKm: 4.7, unit: "kg", price: 96, marketAverage: 91, stock: 64, rating: 4.5 },
  { id: "P-1005", name: "Green Grams", category: "Protein", vendor: "Eastern Harvest", market: "Gikomba", distanceKm: 3.4, unit: "kg", price: 164, marketAverage: 176, stock: 190, rating: 4.6 },
  { id: "P-1006", name: "Avocado Hass", category: "Fruit", vendor: "Murang'a Select", market: "Ngara", distanceKm: 5.1, unit: "piece", price: 28, marketAverage: 35, stock: 520, rating: 4.9 },
  { id: "P-1007", name: "Fresh Milk", category: "Dairy", vendor: "DairyLink", market: "Kilimani", distanceKm: 2.9, unit: "litre", price: 72, marketAverage: 75, stock: 110, rating: 4.8 },
  { id: "P-1008", name: "Irish Potatoes", category: "Vegetable", vendor: "Nyandarua Foods", market: "Kangemi", distanceKm: 6.3, unit: "kg", price: 74, marketAverage: 79, stock: 0, rating: 4.4 }
];

export const transactions: Transaction[] = [
  { id: "TX-42001", type: "Top up", counterparty: "M-Pesa", amount: 5000, direction: "in", date: "Today, 09:18", reference: "QHI2MKT41" },
  { id: "TX-42002", type: "Order payment", counterparty: "Wakulima Fresh", amount: 1460, direction: "out", date: "Yesterday, 18:42", reference: "MP-ORD-1048" },
  { id: "TX-42003", type: "Transfer", counterparty: "Amina K.", amount: 650, direction: "out", date: "29 Aug, 13:12", reference: "MP-P2P-9121" },
  { id: "TX-42004", type: "Escrow release", counterparty: "MarketPay Escrow", amount: 920, direction: "in", date: "28 Aug, 16:05", reference: "MP-ORD-1032" },
  { id: "TX-42005", type: "Withdrawal", counterparty: "M-Pesa", amount: 1200, direction: "out", date: "27 Aug, 10:22", reference: "QHF6MKT02" }
];

export const consumerOrders: Order[] = [
  { id: "MP-ORD-1057", vendor: "Wakulima Fresh", status: "IN_DELIVERY", total: 2140, items: 4, eta: "18 min", createdAt: "Today, 11:04", rider: "David Mwangi" },
  { id: "MP-ORD-1048", vendor: "Mama Mboga Hub", status: "COMPLETED", total: 1460, items: 7, eta: "Delivered", createdAt: "Yesterday, 17:55", rider: "Mary Atieno" },
  { id: "MP-ORD-1039", vendor: "Mwea Direct", status: "COMPLETED", total: 3260, items: 3, eta: "Delivered", createdAt: "27 Aug, 14:12", rider: "Kevin Kimani" },
  { id: "MP-ORD-1028", vendor: "Fresh Basket", status: "DISPUTED", total: 870, items: 2, eta: "Under review", createdAt: "24 Aug, 09:33", rider: "John Kibet" }
];

export const notifications: NotificationItem[] = [
  { id: "N-1", title: "Rider almost there", body: "David is less than 500m away with order MP-ORD-1057.", type: "order", read: false, createdAt: "2 min ago" },
  { id: "N-2", title: "Maize price dropped 8%", body: "Dry maize is now KES 82/kg at Wakulima Market.", type: "price", read: false, createdAt: "24 min ago" },
  { id: "N-3", title: "Wallet top-up successful", body: "KES 5,000 was added via M-Pesa. New balance KES 12,840.", type: "wallet", read: true, createdAt: "2 hr ago" },
  { id: "N-4", title: "Security check completed", body: "Your recent sign-in from this device was verified.", type: "security", read: true, createdAt: "Yesterday" }
];

export const priceSeries = [82, 86, 84, 91, 89, 87, 85, 88, 92, 90, 84, 82];
export const volumeSeries = [52, 61, 58, 73, 68, 84, 79, 93, 88, 101, 96, 114];

export const vendorOrders = [
  { id: "MP-ORD-1059", customer: "A. Njeri", amount: 3280, status: "NEW", items: 8, age: "4 min" },
  { id: "MP-ORD-1058", customer: "S. Kamau", amount: 1840, status: "PREPARING", items: 5, age: "17 min" },
  { id: "MP-ORD-1057", customer: "P. Otieno", amount: 2140, status: "RIDER_ASSIGNED", items: 4, age: "31 min" },
  { id: "MP-ORD-1052", customer: "C. Wanjiku", amount: 960, status: "COMPLETED", items: 3, age: "2 hr" }
];

export const riders = [
  { name: "David Mwangi", rating: 4.91, distance: 1.2, vehicle: "Motorbike", status: "AVAILABLE" },
  { name: "Mary Atieno", rating: 4.87, distance: 1.8, vehicle: "Motorbike", status: "AVAILABLE" },
  { name: "Kevin Kimani", rating: 4.80, distance: 2.4, vehicle: "Bicycle", status: "ON_DELIVERY" }
];

export const marketRows = [
  { market: "Wakulima", maize: 82, rice: 188, tomatoes: 96, onions: 118, signal: "Stable" },
  { market: "Gikomba", maize: 86, rice: 181, tomatoes: 91, onions: 125, signal: "Watch" },
  { market: "Kawangware", maize: 89, rice: 196, tomatoes: 88, onions: 121, signal: "Stable" },
  { market: "Kangemi", maize: 94, rice: 202, tomatoes: 105, onions: 136, signal: "Elevated" },
  { market: "Ngara", maize: 84, rice: 192, tomatoes: 93, onions: 117, signal: "Stable" }
];

export const systemServices = [
  { name: "API Gateway", status: "UP", latency: 138, error: 0.4 },
  { name: "Wallet Service", status: "UP", latency: 112, error: 0.2 },
  { name: "Marketplace Service", status: "UP", latency: 168, error: 0.8 },
  { name: "Logistics Service", status: "DEGRADED", latency: 486, error: 4.9 },
  { name: "AI Service", status: "UP", latency: 742, error: 1.2 },
  { name: "Notification Service", status: "UP", latency: 96, error: 0.3 }
];
