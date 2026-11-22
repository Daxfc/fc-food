import { FoodCategoryKey, Meal } from "@/data/meals";

interface RawMealDBItem {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
}

interface MealSeed {
  query: string;
  filterCategory: Exclude<FoodCategoryKey, "all">;
  priceEgp: number;
  arCategory: string;
  enCategory: string;
}

const mealSeeds: MealSeed[] = [
  {
    query: "Koshari",
    filterCategory: "vegan",
    priceEgp: 110,
    arCategory: "نباتي",
    enCategory: "Vegan",
  },
  {
    query: "Falafel",
    filterCategory: "vegan",
    priceEgp: 95,
    arCategory: "نباتي",
    enCategory: "Vegan",
  },
  {
    query: "Chickpea",
    filterCategory: "vegan",
    priceEgp: 120,
    arCategory: "نباتي",
    enCategory: "Vegan",
  },
  {
    query: "Lasagne",
    filterCategory: "pasta",
    priceEgp: 210,
    arCategory: "مكرونات",
    enCategory: "Pasta",
  },
  {
    query: "Spaghetti Bolognese",
    filterCategory: "pasta",
    priceEgp: 175,
    arCategory: "مكرونات",
    enCategory: "Pasta",
  },
  {
    query: "Fettuccine Alfredo",
    filterCategory: "pasta",
    priceEgp: 185,
    arCategory: "مكرونات",
    enCategory: "Pasta",
  },
  {
    query: "Cassava Pizza",
    filterCategory: "pizza",
    priceEgp: 230,
    arCategory: "بيتزا",
    enCategory: "Pizza",
  },
  {
    query: "Pizza Express Margherita",
    filterCategory: "pizza",
    priceEgp: 195,
    arCategory: "بيتزا",
    enCategory: "Pizza",
  },
  {
    query: "Shawarma",
    filterCategory: "chicken",
    priceEgp: 165,
    arCategory: "فراخ",
    enCategory: "Chicken",
  },
  {
    query: "Grilled Chicken",
    filterCategory: "chicken",
    priceEgp: 190,
    arCategory: "فراخ",
    enCategory: "Chicken",
  },
  {
    query: "Tandoori chicken",
    filterCategory: "chicken",
    priceEgp: 205,
    arCategory: "فراخ",
    enCategory: "Chicken",
  },
  {
    query: "Big Mac",
    filterCategory: "beef",
    priceEgp: 220,
    arCategory: "لحم",
    enCategory: "Beef",
  },
  {
    query: "Beef Stroganoff",
    filterCategory: "beef",
    priceEgp: 255,
    arCategory: "لحم",
    enCategory: "Beef",
  },
  {
    query: "Beef Brisket Pot Roast",
    filterCategory: "beef",
    priceEgp: 270,
    arCategory: "لحم",
    enCategory: "Beef",
  },
];

async function translateToArabic(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return text;

    const data = await res.json();
    if (Array.isArray(data?.[0])) {
      return data[0].map((chunk: [string]) => chunk[0]).join("");
    }
    return text;
  } catch {
    return text;
  }
}

function buildShortSummary(instructions: string): string {
  const cleaned = instructions
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= 140) return cleaned;
  return `${cleaned.slice(0, 137).trim()}...`;
}

function cleanArabicHaramText(text: string): string {
  return text
    .replace(/لحم خنزير\s*(المقدد\s*)?(أو\s*الكوريزو)?/g, "بيبروني أو فطر")
    .replace(/لحم الخنزير\s*(المقدد\s*)?(أو\s*الكوريزو)?/g, "بيبروني أو فطر")
    .replace(/لحم خنزير/g, "")
    .replace(/خنزير/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanEnglishHaramText(text: string): string {
  return text
    .replace(/\b(pork|bacon|ham|chorizo)\b/gi, "pepperoni")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function getLiveMeals(): Promise<Meal[]> {
  const seenIds = new Set<string>();

  const results = await Promise.all(
    mealSeeds.map(async (seed) => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            seed.query
          )}`,
          { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;

        const data = await res.json();
        const raw: RawMealDBItem | undefined = data?.meals?.[0];
        if (!raw) return null;

        const enSummary = cleanEnglishHaramText(
          buildShortSummary(raw.strInstructions)
        );
        const arTitleRaw = await translateToArabic(raw.strMeal);
        const arDescriptionRaw = await translateToArabic(enSummary);

        return {
          id: raw.idMeal,
          priceEgp: seed.priceEgp,
          filterCategory: seed.filterCategory,
          title: {
            ar: cleanArabicHaramText(arTitleRaw),
            en: cleanEnglishHaramText(raw.strMeal),
          },
          description: {
            ar: cleanArabicHaramText(arDescriptionRaw),
            en: enSummary,
          },
          category: {
            ar: seed.arCategory,
            en: seed.enCategory,
          },
          image: raw.strMealThumb,
        } satisfies Meal;
      } catch {
        return null;
      }
    })
  );

  return results.filter((meal): meal is Meal => {
    if (!meal) return false;
    if (seenIds.has(meal.id)) return false;
    seenIds.add(meal.id);
    return true;
  });
}