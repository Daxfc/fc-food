"use client";

import { useEffect } from "react";
import Image from "next/image";
import { featuredMeals, Meal, uiContent } from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

interface MealsFeedProps {
  meals?: Meal[];
}

export default function MealsFeed({ meals }: MealsFeedProps) {
  const { lang, isRtl, setMealsCatalog } = useLanguage();
  const displayMeals = meals && meals.length > 0 ? meals : featuredMeals;

  useEffect(() => {
    setMealsCatalog(displayMeals);
  }, [displayMeals, setMealsCatalog]);

  return (
    <main
      id="food-section"
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-6xl mx-auto px-4 py-10 scroll-mt-20"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {uiContent.sectionTitle[lang]}
        </h2>
        <p className="text-gray-600">{uiContent.sectionSubtitle[lang]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMeals.map((meal) => (
          <article
            key={meal.id}
            onClick={() => navigateWithLoader("/food")}
            className="cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-56 w-full bg-gray-100">
              <Image
                src={meal.image}
                alt={meal.title[lang]}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <span
                className={`absolute top-3 ${
                  isRtl ? "right-3" : "left-3"
                } bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {meal.category[lang]}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{meal.title[lang]}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {meal.description[lang]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}