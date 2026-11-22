"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Zap,
  Loader2,
  CheckCircle2,
  UtensilsCrossed,
  Clock,
} from "lucide-react";
import { uiContent } from "@/data/meals";
import { OrderRecord, useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

const DELIVERY_FEE_EGP = 35;

export default function CartView() {
  const {
    lang,
    isRtl,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    placeCartOrder,
  } = useLanguage();

  const [isOrdering, setIsOrdering] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );
  const orderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (orderTimerRef.current) {
        clearTimeout(orderTimerRef.current);
      }
    };
  }, []);

  const subtotalEgp = cartItems.reduce(
    (sum, item) => sum + item.meal.priceEgp * item.quantity,
    0
  );
  const totalEgp = cartItems.length > 0 ? subtotalEgp + DELIVERY_FEE_EGP : 0;

  function handleOrderNow() {
    if (cartItems.length === 0 || isOrdering) return;

    setIsOrdering(true);
    orderTimerRef.current = setTimeout(() => {
      const created = placeCartOrder(DELIVERY_FEE_EGP);
      setIsOrdering(false);
      if (created) {
        setConfirmedOrder(created);
      }
    }, 2000);
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          {uiContent.cartPageTitle[lang]}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {uiContent.cartPageSubtitle[lang]}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-3xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-1.5">
            {uiContent.emptyCartTitle[lang]}
          </h2>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            {uiContent.emptyCartSubtitle[lang]}
          </p>
          <button
            type="button"
            onClick={() => navigateWithLoader("/food")}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 shadow-sm shadow-orange-200 transition-all active:scale-98"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{uiContent.browseFood[lang]}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 bg-white border border-gray-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
            <div className="max-h-[430px] sm:max-h-[520px] overflow-y-auto space-y-3.5 pe-1">
              {cartItems.map(({ meal, quantity }) => {
                const itemTotal = meal.priceEgp * quantity;

                return (
                  <div
                    key={meal.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-orange-200/80 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70">
                        <Image
                          src={meal.image}
                          alt={meal.title[lang]}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100/80 text-orange-700 mb-1">
                          {meal.category[lang]}
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-gray-900 truncate">
                          {meal.title[lang]}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            dir="ltr"
                            className="text-xs sm:text-sm font-semibold text-gray-500"
                          >
                            {meal.priceEgp} {uiContent.currency[lang]}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span
                            dir="ltr"
                            className="text-sm font-extrabold text-orange-600"
                          >
                            {itemTotal} {uiContent.currency[lang]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
                      <div
                        dir="ltr"
                        className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(meal.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 active:scale-90 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-9 text-center text-sm font-extrabold text-gray-900">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateCartQuantity(meal.id, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 active:scale-90 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(meal.id)}
                        aria-label="Remove item"
                        className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/70 flex items-center justify-center transition-all active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              {uiContent.orderSummaryTitle[lang]}
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-semibold">
                  {uiContent.subtotalLabel[lang]}
                </span>
                <span dir="ltr" className="font-bold text-gray-800">
                  {subtotalEgp} {uiContent.currency[lang]}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span className="font-semibold">
                  {uiContent.deliveryLabel[lang]}
                </span>
                <span dir="ltr" className="font-bold text-gray-800">
                  {DELIVERY_FEE_EGP} {uiContent.currency[lang]}
                </span>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-base font-extrabold text-gray-900">
                  {uiContent.totalLabel[lang]}
                </span>
                <span
                  dir="ltr"
                  className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
                >
                  {totalEgp} {uiContent.currency[lang]}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isOrdering}
              onClick={handleOrderNow}
              className="mt-6 w-full py-3.5 px-5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 disabled:opacity-75 shadow-md shadow-orange-200/80 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {isOrdering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>{uiContent.placingOrder[lang]}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 shrink-0" />
                  <span>{uiContent.buyNow[lang]}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {confirmedOrder && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-950/55 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-orange-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <CheckCircle2 className="w-9 h-9 text-orange-600" />
            </div>

            <span
              dir="ltr"
              className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-extrabold mb-2"
            >
              #{confirmedOrder.id}
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1.5">
              {uiContent.orderSuccessTitle[lang]}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {uiContent.orderSuccessSubtitle[lang]}
            </p>

            <div className="bg-gray-50 rounded-2xl p-3.5 mb-6 flex items-center justify-between text-sm border border-gray-100">
              <span className="font-bold text-gray-600">
                {uiContent.totalLabel[lang]}
              </span>
              <span dir="ltr" className="font-extrabold text-orange-600">
                {confirmedOrder.totalEgp} {uiContent.currency[lang]}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  navigateWithLoader("/orders");
                }}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 shadow-sm shadow-orange-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>{uiContent.viewRecentOrders[lang]}</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
              >
                {uiContent.closeMenuLabel[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}