import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/lib/pricing";

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  paperType: string;
  quantity: number;
  doubleSided: boolean;
  express: boolean;
  fileName?: string;
  notes?: string;
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.length;
  const cartTotal = items.reduce((sum, i) => sum + i.total, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
