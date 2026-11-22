import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/components/LanguageProvider";
import MealDetailModal from "@/components/MealDetailModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "FC FOOD",
  description: "Discover and order delicious halal dishes.",
  icons: {
    icon: [
      {
        url: "/fc.png",
        type: "image/png",
      },
    ],
    shortcut: "/fc.png",
    apple: "/fc.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-white text-gray-900">
        <NextTopLoader color="#f97316" showSpinner={false} />
        <LanguageProvider>
          {children}
          <MealDetailModal />
        </LanguageProvider>
      </body>
    </html>
  );
}