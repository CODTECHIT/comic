import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem } from '../types';

interface AppContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (comic: CartItem) => void;
  removeFromCart: (comicId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  comics: any[];
  setComics: React.Dispatch<React.SetStateAction<any[]>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  plans: any[];
  setPlans: React.Dispatch<React.SetStateAction<any[]>>;
  loadingStoreData: boolean;
  setLoadingStoreData: React.Dispatch<React.SetStateAction<boolean>>;
  authLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  
  const [comics, setComics] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingStoreData, setLoadingStoreData] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Load profile from token/localStorage on mount and validate
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Validate token by fetching latest profile
      fetch('http://localhost:5000/api/v1/users/profile', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then(data => {
          // Store token in React state so it's accessible to API calls
          const updatedProfile = { ...data, token };
          setProfile(updatedProfile);
          // Keep localStorage separated
          localStorage.setItem('user', JSON.stringify(data));
          setAuthLoading(false);
        })
        .catch(() => {
          // Token is invalid or expired
          setProfile(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const addToCart = (comic: CartItem) => {
    if (!cart.some(c => c._id === comic._id || c.id === comic.id)) {
      setCart([...cart, comic]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (comicId: string) => {
    setCart(cart.filter(c => c._id !== comicId && c.id !== comicId));
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        profile,
        setProfile,
        logout,
        comics,
        setComics,
        categories,
        setCategories,
        plans,
        setPlans,
        loadingStoreData,
        setLoadingStoreData,
        authLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
