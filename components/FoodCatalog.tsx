"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Zap, SearchX, Check } from "lucide-react";
import {
  categoryTabs,
  featuredMeals,
  FoodCategoryKey,
  Meal,
  uiContent,
} from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

interface FoodCatalogProps {
  meals?: Meal[];
}

export default function FoodCatalog({ meals }: FoodCatalogProps) {
  const {
    lang,
    isRtl,
    searchQuery,
    setSearchQuery,
    setMealsCatalog,
    setSelectedMeal,
    addToCart,
    favoriteIds,
    toggleFavorite,
  } = useLanguage();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategoryKey>("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const sourceMeals = meals && meals.length > 0 ? meals : featuredMeals;

  useEffect(() => {
    setMealsCatalog(sourceMeals);
  }, [sourceMeals, setMealsCatalog]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [pathname, setSearchQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMeals = sourceMeals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "all" || meal.filterCategory === selectedCategory;

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    return (
      meal.title.ar.toLowerCase().includes(normalizedQuery) ||
      meal.title.en.toLowerCase().includes(normalizedQuery) ||
      meal.category.ar.toLowerCase().includes(normalizedQuery) ||
      meal.category.en.toLowerCase().includes(normalizedQuery) ||
      meal.description.ar.toLowerCase().includes(normalizedQuery) ||
      meal.description.en.toLowerCase().includes(normalizedQuery)
    );
  });

  function handleAddToCart(e: React.MouseEvent, meal: Meal) {
    e.stopPropagation();
    addToCart(meal);
    setAddedId(meal.id);
    setTimeout(() => {
      setAddedId((current) => (current === meal.id ? null : current));
    }, 1100);
  }

  function handleOrderNow(e: React.MouseEvent, meal: Meal) {
    e.stopPropagation();
    addToCart(meal);
    navigateWithLoader("/cart");
  }

  function handleToggleFav(e: React.MouseEvent, meal: Meal) {
    e.stopPropagation();
    toggleFavorite(meal);
  }

  return (
    <main
      id="food-section"
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
    >
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {uiContent.foodPageTitle[lang]}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {uiContent.foodPageSubtitle[lang]}
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  active
                    ? "bg-gradient-to-r from-orange-400 to-red-600 text-white border-transparent shadow-sm shadow-orange-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-gray-900"
                }`}
              >
                {tab.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-2xl">
          <SearchX className="w-10 h-10 text-gray-400 mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {uiContent.noResultsTitle[lang]}
          </h2>
          <p className="text-sm text-gray-500">
            {uiContent.noResultsSubtitle[lang]}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => {
            const isFav = favoriteIds.includes(meal.id);
            const isJustAdded = addedId === meal.id;

            return (
              <article
                key={meal.id}
                onClick={() => setSelectedMeal(meal)}
                className="group cursor-pointer bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={meal.image}
                      alt={meal.title[lang]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span
                      className={`absolute top-3 ${
                        isRtl ? "right-3" : "left-3"
                      } bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs`}
                    >
                      {meal.category[lang]}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFav(e, meal)}
                      aria-label={uiContent.navFavorite[lang]}
                      className={`absolute top-3 ${
                        isRtl ? "left-3" : "right-3"
                      } w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFav
                            ? "fill-red-600 text-red-600"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-lg font-extrabold text-gray-900 leading-snug">
                        {meal.title[lang]}
                      </h2>
                      <span
                        dir="ltr"
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-sm font-extrabold"
                      >
                        {meal.priceEgp} {uiContent.currency[lang]}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {meal.description[lang]}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 flex items-center gap-2.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, meal)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold transition-all active:scale-98 ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{uiContent.addedToCart[lang]}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 shrink-0" />
                        <span>{uiContent.addToCart[lang]}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleOrderNow(e, meal)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 shadow-xs shadow-orange-200 transition-all active:scale-98"
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>{uiContent.buyNow[lang]}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}