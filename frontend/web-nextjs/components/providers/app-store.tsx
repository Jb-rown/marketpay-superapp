"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { notifications as seedNotifications } from "@/lib/mock-data";
import type { CartItem, NotificationItem, Product } from "@/lib/types";

type AppStore = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (value: boolean) => void;
};

const StoreContext = createContext<AppStore | null>(null);

const CART_KEY = "marketpay.demo.cart";
const NOTIFICATIONS_KEY = "marketpay.demo.notifications";
const PREFERENCES_KEY = "marketpay.demo.notification-preferences";

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [notificationsHydrated,setNotificationsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setCart(parsed); }
    } catch {
      // Demo mode tolerates unavailable local storage.
    } finally { setCartHydrated(true); }
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // Demo mode tolerates unavailable local storage.
    }
  }, [cart, cartHydrated]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) { const parsed=JSON.parse(stored); if(Array.isArray(parsed)) setNotifications(parsed); }
      const prefs=localStorage.getItem(PREFERENCES_KEY);
      if(prefs!==null) setPushNotificationsEnabled(prefs==="true");
    } catch { /* Local storage can be unavailable in restricted browsers. */ }
    finally { setNotificationsHydrated(true); }
  }, []);
  useEffect(() => {
    if(!notificationsHydrated)return;
    try { localStorage.setItem(NOTIFICATIONS_KEY,JSON.stringify(notifications)); localStorage.setItem(PREFERENCES_KEY,String(pushNotificationsEnabled)); }
    catch { /* Local storage can be unavailable. */ }
  },[notifications,notificationsHydrated,pushNotificationsEnabled]);

  const value = useMemo<AppStore>(() => ({
    cart,
    addToCart(product) {
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        return existing
          ? current.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(product.stock, 1)) } : item)
          : [...current, { ...product, quantity: 1 }];
      });
    },
    setQuantity(productId, quantity) {
      setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(item.stock, 1))) } : item));
    },
    removeFromCart(productId) {
      setCart((current) => current.filter((item) => item.id !== productId));
    },
    clearCart() { setCart([]); },
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    markAllRead() {
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    },
    markRead(id) { setNotifications(current=>current.map(item=>item.id===id?{...item,read:true}:item)); },
    pushNotificationsEnabled,
    setPushNotificationsEnabled
  }), [cart, notifications, pushNotificationsEnabled]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useAppStore must be used inside AppStoreProvider");
  return value;
}
