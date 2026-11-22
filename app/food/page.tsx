import Navbar from "@/components/Navbar";
import FoodCatalog from "@/components/FoodCatalog";
import Footer from "@/components/Footer";
import { getLiveMeals } from "@/lib/mealsApi";

export default async function FoodPage() {
  const meals = await getLiveMeals();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-1">
        <FoodCatalog meals={meals} />
      </div>
      <Footer />
    </div>
  );
}