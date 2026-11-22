"use client";

import Link from "next/link";
import { uiContent } from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { lang, isRtl } = useLanguage();

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full bg-white border-t border-gray-200 mt-auto"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-start gap-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-orange-400">{uiContent.brandFirst[lang]}</span>
          <span className="text-red-600">{uiContent.brandSecond[lang]}</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-sm text-gray-500">
          <span>{uiContent.footerRights[lang]}</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="font-semibold text-gray-400">
            {uiContent.footerAuthor[lang]}
          </span>
        </div>
      </div>
    </footer>
  );
}