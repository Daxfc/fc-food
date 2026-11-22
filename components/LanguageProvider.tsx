"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { featuredMeals, Language, Meal } from "@/data/meals";

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalEgp: number;
}

interface LanguageContextValue {
  lang: Language;
  setLang: (nextLang: Language) => void;
  isRtl: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mealsCatalog: Meal[];
  setMealsCatalog: (meals: Meal[]) => void;
  selectedMeal: Meal | null;
  setSelectedMeal: (meal: Meal | null) => void;
  cartItems: CartItem[];
  cartCount: number;
  favoriteIds: string[];
  favoriteMeals: Meal[];
  orders: OrderRecord[];
  addToCart: (meal: Meal) => void;
  updateCartQuantity: (mealId: string, delta: number) => void;
  removeFromCart: (mealId: string) => void;
  clearCart: () => void;
  buyNow: (meal: Meal) => void;
  placeCartOrder: (deliveryFeeEgp: number) => OrderRecord | null;
  clearOrders: () => void;
  toggleFavorite: (meal: Meal) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ar",
  setLang: () => {},
  isRtl: true,
  searchQuery: "",
  setSearchQuery: () => {},
  mealsCatalog: featuredMeals,
  setMealsCatalog: () => {},
  selectedMeal: null,
  setSelectedMeal: () => {},
  cartItems: [],
  cartCount: 0,
  favoriteIds: [],
  favoriteMeals: [],
  orders: [],
  addToCart: () => {},
  updateCartQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  buyNow: () => {},
  placeCartOrder: () => null,
  clearOrders: () => {},
  toggleFavorite: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");
  const [searchQuery, setSearchQuery] = useState("");
  const [mealsCatalog, setMealsCatalog] = useState<Meal[]>(featuredMeals);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const savedLang = window.localStorage.getItem("fc_food_lang");
    if (savedLang === "en" || savedLang === "ar") {
      setLangState(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    }

    try {
      const savedCart = window.localStorage.getItem("fc_food_cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) setCartItems(parsedCart);
      }

      const savedFavMeals = window.localStorage.getItem("fc_food_favorite_meals");
      if (savedFavMeals) {
        const parsedFavs = JSON.parse(savedFavMeals);
        if (Array.isArray(parsedFavs)) setFavoriteMeals(parsedFavs);
      }

      const savedOrders = window.localStorage.getItem("fc_food_orders");
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) setOrders(parsedOrders);
      }
    } catch {
      return;
    }
  }, []);

  function syncCartStorage(next: CartItem[]) {
    try {
      window.localStorage.setItem("fc_food_cart", JSON.stringify(next));
    } catch {
      return;
    }
  }

  function syncOrdersStorage(next: OrderRecord[]) {
    try {
      window.localStorage.setItem("fc_food_orders", JSON.stringify(next));
    } catch {
      return;
    }
  }

  function setLang(nextLang: Language) {
    setLangState(nextLang);
    window.localStorage.setItem("fc_food_lang", nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
  }

  function addToCart(meal: Meal) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.meal.id === meal.id);
      const next = existing
        ? prev.map((item) =>
            item.meal.id === meal.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { meal, quantity: 1 }];
      syncCartStorage(next);
      return next;
    });
  }

  function updateCartQuantity(mealId: string, delta: number) {
    setCartItems((prev) => {
      const next = prev
        .map((item) =>
          item.meal.id === mealId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);
      syncCartStorage(next);
      return next;
    });
  }

  function removeFromCart(mealId: string) {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.meal.id !== mealId);
      syncCartStorage(next);
      return next;
    });
  }

  function clearCart() {
    setCartItems([]);
    syncCartStorage([]);
  }

  function buyNow(meal: Meal) {
    const newOrder: OrderRecord = {
      id: `FC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      items: [{ meal, quantity: 1 }],
      totalEgp: meal.priceEgp,
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      syncOrdersStorage(next);
      return next;
    });
  }

  function placeCartOrder(deliveryFeeEgp: number): OrderRecord | null {
    if (cartItems.length === 0) return null;

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.meal.priceEgp * item.quantity,
      0
    );

    const newOrder: OrderRecord = {
      id: `FC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      items: cartItems,
      totalEgp: subtotal + deliveryFeeEgp,
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      syncOrdersStorage(next);
      return next;
    });

    setCartItems([]);
    syncCartStorage([]);
    return newOrder;
  }

  function clearOrders() {
    setOrders([]);
    syncOrdersStorage([]);
  }

  function toggleFavorite(meal: Meal) {
    setFavoriteMeals((prev) => {
      const exists = prev.some((item) => item.id === meal.id);
      const next = exists
        ? prev.filter((item) => item.id !== meal.id)
        : [...prev, meal];
      try {
        window.localStorage.setItem(
          "fc_food_favorite_meals",
          JSON.stringify(next)
        );
      } catch {
        return next;
      }
      return next;
    });
  }

  const favoriteIds = favoriteMeals.map((meal) => meal.id);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        isRtl: lang === "ar",
        searchQuery,
        setSearchQuery,
        mealsCatalog,
        setMealsCatalog,
        selectedMeal,
        setSelectedMeal,
        cartItems,
        cartCount,
        favoriteIds,
        favoriteMeals,
        orders,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        buyNow,
        placeCartOrder,
        clearOrders,
        toggleFavorite,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}