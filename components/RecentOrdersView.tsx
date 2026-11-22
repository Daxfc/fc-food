"use client";

import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  Receipt,
  UtensilsCrossed,
  Trash2,
  Sparkles,
} from "lucide-react";
import { uiContent } from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

function formatOrderDate(isoString: string, lang: "ar" | "en"): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RecentOrdersView() {
  const { lang, isRtl, orders, clearOrders, setSelectedMeal } = useLanguage();

  const totalSpentEgp = orders.reduce((sum, order) => sum + order.totalEgp, 0);

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {uiContent.ordersPageTitle[lang]}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {uiContent.ordersPageSubtitle[lang]}
          </p>
        </div>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={clearOrders}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50/70 transition-all active:scale-98"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{uiContent.clearHistoryLabel[lang]}</span>
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-3xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-1.5">
            {uiContent.emptyOrdersTitle[lang]}
          </h2>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            {uiContent.emptyOrdersSubtitle[lang]}
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <div className="bg-gradient-to-br from-orange-50/90 via-white to-white border border-orange-100 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500 truncate">
                  {uiContent.totalOrdersCountLabel[lang]}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                  {orders.length}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50/70 via-white to-white border border-orange-100 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500 truncate">
                  {uiContent.totalSpentLabel[lang]}
                </p>
                <p
                  dir="ltr"
                  className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mt-0.5 truncate"
                >
                  {totalSpentEgp} {uiContent.currency[lang]}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order, index) => {
              const itemsQuantity = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <article
                  key={order.id}
                  className="bg-white border border-gray-200/90 rounded-3xl p-4 sm:p-6 shadow-2xs hover:border-orange-200/90 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span
                        dir="ltr"
                        className="px-3 py-1 rounded-xl bg-gray-900 text-white text-xs sm:text-sm font-extrabold tracking-wide"
                      >
                        #{order.id}
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200/70">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{uiContent.orderStatusConfirmed[lang]}</span>
                      </span>

                      {index === 0 && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-extrabold">
                          {lang === "ar" ? "الأحدث" : "Latest"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{formatOrderDate(order.createdAt, lang)}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map(({ meal, quantity }) => (
                      <div
                        key={`${order.id}-${meal.id}`}
                        onClick={() => setSelectedMeal(meal)}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3.5 cursor-pointer group rounded-2xl hover:bg-orange-50/40 px-2 -mx-2 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70">
                            <Image
                              src={meal.image}
                              alt={meal.title[lang]}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                              {meal.title[lang]}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-semibold">
                              <span>{meal.category[lang]}</span>
                              <span className="text-gray-300">•</span>
                              <span dir="ltr">x{quantity}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          dir="ltr"
                          className="shrink-0 text-sm sm:text-base font-extrabold text-gray-800"
                        >
                          {meal.priceEgp * quantity}{" "}
                          {uiContent.currency[lang]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/70 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-3.5 rounded-b-3xl">
                    <span className="text-xs sm:text-sm font-bold text-gray-500">
                      {itemsQuantity} {uiContent.itemsCountLabel[lang]}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs sm:text-sm font-extrabold text-gray-700">
                        {uiContent.totalLabel[lang]}:
                      </span>
                      <span
                        dir="ltr"
                        className="text-base sm:text-lg font-extrabold text-orange-600"
                      >
                        {order.totalEgp} {uiContent.currency[lang]}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}