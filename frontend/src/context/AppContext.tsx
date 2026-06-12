"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

interface Laptop {
  id: number;
  title: string;
  slug: string;
  base_price: string;
  image: string | null;
  brand?: { name: string; slug: string };
}

export interface ActionModalData {
  title: string;
  description?: string;
  code?: string;
  link: string;
  isDeal: boolean;
  brandName?: string;
}

interface AppContextType {
  wishlist: Laptop[];
  compareList: Laptop[];
  addToWishlist: (laptop: Laptop) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  addToCompare: (laptop: Laptop) => void;
  removeFromCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
  actionModal: {
    isOpen: boolean;
    data: ActionModalData | null;
  };
  openActionModal: (data: ActionModalData) => void;
  closeActionModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Laptop[]>([]);
  const [compareList, setCompareList] = useState<Laptop[]>([]);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    data: ActionModalData | null;
  }>({ isOpen: false, data: null });

  // Load from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    const savedCompare = localStorage.getItem("compare");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlist(parsed);
      } catch (e) {}
    }
    if (savedCompare) {
      try {
        const parsed = JSON.parse(savedCompare);
        if (Array.isArray(parsed)) setCompareList(parsed);
      } catch (e) {}
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareList));
  }, [compareList]);

  const addToWishlist = useCallback((laptop: Laptop) => {
    setWishlist(prev => {
      if (!prev.find((p) => p.id === laptop.id)) {
        return [...prev, laptop];
      }
      return prev;
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.filter((p) => p.id !== id));
  }, []);

  const isInWishlist = useCallback((id: number) => wishlist.some((p) => p.id === id), [wishlist]);

  const addToCompare = useCallback((laptop: Laptop) => {
    setCompareList(prev => {
      if (prev.length >= 4) {
        alert("You can only compare up to 4 mobiles at once.");
        return prev;
      }
      if (!prev.find((p) => p.id === laptop.id)) {
        return [...prev, laptop];
      }
      return prev;
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareList(prev => prev.filter((p) => p.id !== id));
  }, []);

  const isInCompare = useCallback((id: number) => compareList.some((p) => p.id === id), [compareList]);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const openActionModal = useCallback((data: ActionModalData) => {
    setActionModal({ isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setActionModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const value = useMemo(() => ({
    wishlist,
    compareList,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    actionModal,
    openActionModal,
    closeActionModal: closeModal,
  }), [wishlist, compareList, addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, clearCompare, actionModal, openActionModal, closeModal]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
