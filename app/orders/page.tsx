import Navbar from "@/components/Navbar";
import RecentOrdersView from "@/components/RecentOrdersView";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-1">
        <RecentOrdersView />
      </div>
      <Footer />
    </div>
  );
}