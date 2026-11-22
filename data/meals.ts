export type Language = "ar" | "en";

export type FoodCategoryKey =
  | "all"
  | "pasta"
  | "pizza"
  | "chicken"
  | "beef"
  | "vegan";

export interface BilingualText {
  ar: string;
  en: string;
}

export interface Meal {
  id: string;
  priceEgp: number;
  filterCategory: Exclude<FoodCategoryKey, "all">;
  title: BilingualText;
  description: BilingualText;
  category: BilingualText;
  image: string;
}

export const categoryTabs: { key: FoodCategoryKey; label: BilingualText }[] = [
  {
    key: "all",
    label: { ar: "الكل", en: "All" },
  },
  {
    key: "pasta",
    label: { ar: "مكرونات", en: "Pasta" },
  },
  {
    key: "pizza",
    label: { ar: "بيتزا", en: "Pizza" },
  },
  {
    key: "chicken",
    label: { ar: "فراخ", en: "Chicken" },
  },
  {
    key: "beef",
    label: { ar: "لحم", en: "Beef" },
  },
  {
    key: "vegan",
    label: { ar: "نباتي", en: "Vegan" },
  },
];

export const uiContent = {
  brandFirst: {
    ar: "اف سي ",
    en: "FC ",
  },
  brandSecond: {
    ar: "فود",
    en: "FOOD",
  },
  menuLabel: {
    ar: "القائمة",
    en: "Menu",
  },
  closeMenuLabel: {
    ar: "إغلاق القائمة",
    en: "Close menu",
  },
  navHome: {
    ar: "الرئيسية",
    en: "Home",
  },
  navFood: {
    ar: "الأكلات",
    en: "Food",
  },
  navFavorite: {
    ar: "المفضلة",
    en: "Favorite",
  },
  navCart: {
    ar: "السلة",
    en: "Cart",
  },
  navRecentOrders: {
    ar: "طلباتي السابقة",
    en: "Recent Orders",
  },
  drawerTagline: {
    ar: "اكتشف أشهى الأطباق واطلبها بسهولة",
    en: "Discover & order delicious dishes",
  },
  searchPlaceholder: {
    ar: "ابحث عن أكلة أو وصفة...",
    en: "Search for a dish or recipe...",
  },
  searchMore: {
    ar: "المزيد...",
    en: "More...",
  },
  noResultsTitle: {
    ar: "لا توجد نتائج مطابقة",
    en: "No matching dishes found",
  },
  noResultsSubtitle: {
    ar: "جرب البحث باسم أكلة أخرى أو اختر صنفاً مختلفاً.",
    en: "Try searching for another dish or switch to another category.",
  },
  emptyFavoritesTitle: {
    ar: "قائمة المفضلة فارغة",
    en: "Your favorites list is empty",
  },
  emptyFavoritesSubtitle: {
    ar: "اضغط على أيقونة القلب على أي أكلة لإضافتها هنا.",
    en: "Tap the heart icon on any dish to save it here.",
  },
  cartPageTitle: {
    ar: "سلة الطلبات",
    en: "Your Cart",
  },
  cartPageSubtitle: {
    ar: "راجع الكميات وأكمل طلبك ليصلك طازجاً.",
    en: "Review your item quantities and complete your order.",
  },
  emptyCartTitle: {
    ar: "السلة فارغة حالياً",
    en: "Your cart is currently empty",
  },
  emptyCartSubtitle: {
    ar: "أضف أطباقك المفضلة من صفحة الأكلات للبدء.",
    en: "Add your favorite dishes from the food menu to get started.",
  },
  browseFood: {
    ar: "تصفح الأكلات",
    en: "Browse Food",
  },
  orderSummaryTitle: {
    ar: "ملخص الطلب",
    en: "Order Summary",
  },
  subtotalLabel: {
    ar: "المجموع الفرعي",
    en: "Subtotal",
  },
  deliveryLabel: {
    ar: "رسوم التوصيل",
    en: "Delivery Fee",
  },
  totalLabel: {
    ar: "الإجمالي الكلي",
    en: "Total",
  },
  placingOrder: {
    ar: "جاري تأكيد الطلب...",
    en: "Placing Order...",
  },
  orderSuccessTitle: {
    ar: "تم تأكيد طلبك بنجاح!",
    en: "Order Placed Successfully!",
  },
  orderSuccessSubtitle: {
    ar: "نجهز أطباقك الآن وسيصلك تحديث قريباً.",
    en: "We are preparing your dishes now and will have them on the way shortly.",
  },
  viewRecentOrders: {
    ar: "عرض طلباتي السابقة",
    en: "View Recent Orders",
  },
  ordersPageTitle: {
    ar: "طلباتي السابقة",
    en: "Recent Orders",
  },
  ordersPageSubtitle: {
    ar: "تابع سجل طلباتك السابقة وتفاصيل الأطباق والأسعار بسهولة.",
    en: "Track your past orders, dish details, and totals at a glance.",
  },
  emptyOrdersTitle: {
    ar: "لا توجد طلبات سابقة بعد",
    en: "No recent orders yet",
  },
  emptyOrdersSubtitle: {
    ar: "عند إتمام أول طلب لك سيظهر هنا بكل تفاصيله.",
    en: "Once you place an order, its full receipt will show up here.",
  },
  orderStatusConfirmed: {
    ar: "تم التأكيد",
    en: "Confirmed",
  },
  totalOrdersCountLabel: {
    ar: "إجمالي الطلبات",
    en: "Total Orders",
  },
  totalSpentLabel: {
    ar: "إجمالي المدفوعات",
    en: "Total Spent",
  },
  clearHistoryLabel: {
    ar: "مسح السجل",
    en: "Clear History",
  },
  itemsCountLabel: {
    ar: "أصناف",
    en: "items",
  },
  sectionTitle: {
    ar: "أشهر الأكلات",
    en: "Popular Dishes",
  },
  sectionSubtitle: {
    ar: "تصفح تشكيلتنا المختارة من أشهى الوصفات مع طريقة التحضير والمكونات.",
    en: "Browse our curated selection of delicious recipes with preparation steps and ingredients.",
  },
  foodPageTitle: {
    ar: "منيو الأكلات",
    en: "Food Menu",
  },
  foodPageSubtitle: {
    ar: "اختر من بين مكرونات، بيتزا، فراخ، لحم، وأطباق نباتية جاهزة للطلب.",
    en: "Pick from pasta, pizza, chicken, beef, and vegan dishes ready to order.",
  },
  favoritesPageTitle: {
    ar: "المفضلة",
    en: "Favorites",
  },
  favoritesPageSubtitle: {
    ar: "أكلاتك المحفوظة للوصول إليها والطلب منها في أي وقت.",
    en: "Your saved dishes ready to view and order anytime.",
  },
  addToCart: {
    ar: "أضف للسلة",
    en: "Add to Cart",
  },
  addedToCart: {
    ar: "تمت الإضافة",
    en: "Added",
  },
  buyNow: {
    ar: "اطلب الآن",
    en: "Order Now",
  },
  currency: {
    ar: "ج.م",
    en: "EGP",
  },
  footerRights: {
    ar: "© 2026 اف سي فود. جميع الحقوق محفوظة.",
    en: "© 2026 FC FOOD. All rights reserved.",
  },
  footerAuthor: {
    ar: "بواسطة مازن",
    en: "By Mazen",
  },
};

export const featuredMeals: Meal[] = [
  {
    id: "1",
    priceEgp: 110,
    filterCategory: "vegan",
    title: {
      ar: "كشري مصري أصيل",
      en: "Authentic Egyptian Koshary",
    },
    description: {
      ar: "مزيج رائع من الأرز والمكرونة والعدس الأسود مع صلصة الطماطم المتبلة بالثوم والخل، مغطى بالبصل المقرمش والحمص.",
      en: "A rich blend of rice, pasta, and black lentils topped with spiced garlic-vinegar tomato sauce, crispy onions, and chickpeas.",
    },
    category: {
      ar: "نباتي",
      en: "Vegan",
    },
    image: "https://www.themealdb.com/images/media/meals/4er7mj1598733193.jpg",
  },
  {
    id: "2",
    priceEgp: 165,
    filterCategory: "chicken",
    title: {
      ar: "شاورما دجاج سوري",
      en: "Syrian Chicken Shawarma",
    },
    description: {
      ar: "شرائح دجاج متبلة بالبهارات الشرقية والزبادي، مشوية بعناية وتقدم مع الثومية والمخلل في خبز الصاج المحمص.",
      en: "Chicken slices marinated in Levantine spices and yogurt, roasted and served with garlic sauce and pickles in toasted saj bread.",
    },
    category: {
      ar: "فراخ",
      en: "Chicken",
    },
    image: "https://www.themealdb.com/images/media/meals/kcv6hj1598733479.jpg",
  },
  {
    id: "3",
    priceEgp: 220,
    filterCategory: "beef",
    title: {
      ar: "بيج ماك لحم",
      en: "Classic Beef Burger",
    },
    description: {
      ar: "طبقات لحم بقري مشوية مع صوص خاص وخس طازج وجبن ذائب داخل خبز محمص طري.",
      en: "Grilled beef patties layered with signature sauce, crisp lettuce, and melted cheese in soft toasted buns.",
    },
    category: {
      ar: "لحم",
      en: "Beef",
    },
    image: "https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg",
  },
];