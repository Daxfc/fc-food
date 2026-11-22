import Navbar from "@/components/Navbar";
import FavoritesList from "@/components/FavoritesList";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-1">
        <FavoritesList />
      </div>
      <Footer />
    </div>
  );
}