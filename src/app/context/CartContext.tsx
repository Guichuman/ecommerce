'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  gender: string;
  image: string;
  size: string;
  type: string;
  price: number;
  quantity: number;
  selectedQuantity: number; 
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, selectedQuantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, selectedQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { 
              ...item, 
              selectedQuantity: Math.min(selectedQuantity, item.quantity) 
            }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
