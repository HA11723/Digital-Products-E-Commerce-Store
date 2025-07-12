import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  digital_file_url: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      setItems(response.data.items);
      setTotal(parseFloat(response.data.total));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await axios.post('/api/cart/add', { productId, quantity });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await axios.put(`/api/cart/update/${productId}`, { quantity });
      await fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
      setItems([]);
      setTotal(0);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to clear cart');
    }
  };

  const value = {
    items,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 