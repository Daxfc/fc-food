"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Heart, ShoppingCart, Zap, Check } from "lucide-react";
import { uiContent } from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

export default function MealDetailModal() {
  const {
    lang,
    isRtl,
    selectedMeal,
    setSelectedMeal,
    addToCart,
    favoriteIds,
    toggleFavorite,
  } = useLanguage();

  const [renderedMeal, setRenderedMeal] = useState(selectedMeal);
  const [visible, setVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (selectedMeal) {
      setRenderedMeal(selectedMeal);
      let secondFrame = 0;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      return () => {
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
      };
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setRenderedMeal(null);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [selectedMeal]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedMeal(null);
      }
    }
    if (selectedMeal) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMeal, setSelectedMeal]);

  if (!renderedMeal) return null;

  const isFav = favoriteIds.includes(renderedMeal.id);

  function handleAdd() {
    if (!renderedMeal) return;
    addToCart(renderedMeal);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  }

  function handleOrderNow() {
    if (!renderedMeal) return;
    addToCart(renderedMeal);
    setSelectedMeal(null);
    navigateWithLoader("/cart");
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[60] transition-opacity duration-400 ease-out ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={() => setSelectedMeal(null)}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className={`fixed inset-0 bg-gray-950/55 backdrop-blur-xs transition-opacity duration-400 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="md:hidden fixed inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
        <div
          dir={isRtl ? "rtl" : "ltr"}
          onClick={(e) => e.stopPropagation()}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          className={`pointer-events-auto relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-350 ${
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <button
            type="button"
            onClick={() => setSelectedMeal(null)}
            aria-label={uiContent.closeMenuLabel[lang]}
            className={`absolute top-3.5 z-20 w-9 h-9 rounded-full bg-white/95 text-gray-800 shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-600 active:scale-90 transition-all ${
              isRtl ? "left-3.5" : "right-3.5"
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative h-60 w-full bg-gray-100">
            <Image
              src={renderedMeal.image}
              alt={renderedMeal.title[lang]}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <span
              className={`absolute bottom-3 ${
                isRtl ? "right-3" : "left-3"
              } bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs`}
            >
              {renderedMeal.category[lang]}
            </span>
            <button
              type="button"
              onClick={() => toggleFavorite(renderedMeal)}
              aria-label={uiContent.navFavorite[lang]}
              className={`absolute bottom-3 ${
                isRtl ? "left-3" : "right-3"
              } w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-2xs active:scale-95 transition-transform`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? "fill-red-600 text-red-600" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-xl font-extrabold text-gray-900">
                {renderedMeal.title[lang]}
              </h2>
              <span
                dir="ltr"
                className="shrink-0 px-3 py-1 rounded-xl bg-orange-50 text-orange-600 text-sm font-extrabold"
              >
                {renderedMeal.priceEgp} {uiContent.currency[lang]}
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              {renderedMeal.description[lang]}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-sm font-bold transition-all active:scale-98 ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {justAdded ? (
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
                onClick={handleOrderNow}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 shadow-sm shadow-orange-200 transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>{uiContent.buyNow[lang]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside
        dir={isRtl ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className={`hidden md:flex fixed top-0 bottom-0 z-10 w-[440px] max-w-[92vw] bg-white shadow-2xl flex-col justify-between overflow-y-auto will-change-transform transition-all duration-420 ${
          lang === "ar"
            ? `left-0 rounded-r-3xl ${
                visible
                  ? "translate-x-0 scale-100 opacity-100"
                  : "-translate-x-full scale-[0.985] opacity-0"
              }`
            : `right-0 rounded-l-3xl ${
                visible
                  ? "translate-x-0 scale-100 opacity-100"
                  : "translate-x-full scale-[0.985] opacity-0"
              }`
        }`}
      >
        <div>
          <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
            <Image
              src={renderedMeal.image}
              alt={renderedMeal.title[lang]}
              fill
              sizes="440px"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              className={`object-cover transition-transform duration-600 ${
                visible ? "scale-100" : "scale-108"
              }`}
            />

            <button
              type="button"
              onClick={() => setSelectedMeal(null)}
              aria-label={uiContent.closeMenuLabel[lang]}
              className={`absolute top-4 z-20 w-10 h-10 rounded-full bg-white/95 text-gray-800 shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-600 active:scale-90 transition-all ${
                lang === "ar" ? "right-4" : "left-4"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <span
              className={`absolute bottom-4 ${
                isRtl ? "right-4" : "left-4"
              } bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs`}
            >
              {renderedMeal.category[lang]}
            </span>

            <button
              type="button"
              onClick={() => toggleFavorite(renderedMeal)}
              aria-label={uiContent.navFavorite[lang]}
              className={`absolute bottom-4 ${
                isRtl ? "left-4" : "right-4"
              } w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all`}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFav ? "fill-red-600 text-red-600" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <div
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            className={`p-6 transition-all duration-450 delay-75 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
                {renderedMeal.title[lang]}
              </h2>
              <span
                dir="ltr"
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-base font-extrabold"
              >
                {renderedMeal.priceEgp} {uiContent.currency[lang]}
              </span>
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {renderedMeal.description[lang]}
            </p>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all active:scale-98 ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-100"
            }`}
          >
            {justAdded ? (
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
            onClick={handleOrderNow}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 shadow-sm shadow-orange-200 transition-all active:scale-98"
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>{uiContent.buyNow[lang]}</span>
          </button>
        </div>
      </aside>
    </div>
  );
}