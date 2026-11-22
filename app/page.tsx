import Navbar from "@/components/Navbar";
import MealsFeed from "@/components/MealsFeed";
import Footer from "@/components/Footer";
import { getLiveMeals } from "@/lib/mealsApi";

export default async function HomePage() {
  const meals = await getLiveMeals();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-1">
        <MealsFeed meals={meals} />
      </div>
      <Footer />
    </div>
  );
}