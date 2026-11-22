import Navbar from "@/components/Navbar";
import CartView from "@/components/CartView";
import Footer from "@/components/Footer";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-1">
        <CartView />
      </div>
      <Footer />
    </div>
  );
}