"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Check,
  Search,
  X,
  Home,
  UtensilsCrossed,
  Heart,
  ShoppingBag,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Language, Meal, uiContent } from "@/data/meals";
import { useLanguage } from "@/components/LanguageProvider";
import { navigateWithLoader } from "@/lib/routeLoader";

const languageOptions: {
  code: Language;
  shortLabel: string;
  fullName: string;
  flag: string;
}[] = [
  {
    code: "ar",
    shortLabel: "AR",
    fullName: "العربية",
    flag: "/arFlag.png",
  },
  {
    code: "en",
    shortLabel: "EN",
    fullName: "English",
    flag: "/enFlag.png",
  },
];

export default function Navbar() {
  const {
    lang,
    setLang,
    isRtl,
    searchQuery,
    setSearchQuery,
    mealsCatalog,
    setSelectedMeal,
    cartCount,
  } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const currentLang =
    languageOptions.find((item) => item.code === lang) || languageOptions[0];

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingMeals = trimmedQuery
    ? mealsCatalog.filter(
        (meal) =>
          meal.title.ar.toLowerCase().includes(trimmedQuery) ||
          meal.title.en.toLowerCase().includes(trimmedQuery) ||
          meal.category.ar.toLowerCase().includes(trimmedQuery) ||
          meal.category.en.toLowerCase().includes(trimmedQuery) ||
          meal.description.ar.toLowerCase().includes(trimmedQuery) ||
          meal.description.en.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const showHomeDropdown =
    isHomePage && searchFocused && trimmedQuery.length > 0;

  const navItems = [
    {
      key: "home",
      href: "/",
      label: uiContent.navHome[lang],
      icon: Home,
      badge: 0,
    },
    {
      key: "food",
      href: "/food",
      label: uiContent.navFood[lang],
      icon: UtensilsCrossed,
      badge: 0,
    },
    {
      key: "favorite",
      href: "/favorites",
      label: uiContent.navFavorite[lang],
      icon: Heart,
      badge: 0,
    },
    {
      key: "cart",
      href: "/cart",
      label: uiContent.navCart[lang],
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      key: "orders",
      href: "/orders",
      label: uiContent.navRecentOrders[lang],
      icon: Clock,
      badge: 0,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
      const insideDesktopSearch =
        desktopSearchRef.current && desktopSearchRef.current.contains(target);
      const insideMobileSearch =
        mobileSearchRef.current && mobileSearchRef.current.contains(target);
      if (!insideDesktopSearch && !insideMobileSearch) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setLangDropdownOpen(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function handleSelectLanguage(selected: Language) {
    setLangDropdownOpen(false);
    setLang(selected);
  }

  function goToFoodWithSearch(queryValue: string) {
    const clean = queryValue.trim();
    setSearchFocused(false);
    if (clean) {
      navigateWithLoader(`/food?q=${encodeURIComponent(clean)}`);
    } else {
      navigateWithLoader("/food");
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isHomePage) {
      e.preventDefault();
      goToFoodWithSearch(searchQuery);
    }
  }

  function handleSelectDropdownMeal(meal: Meal) {
    setSearchFocused(false);
    setSelectedMeal(meal);
  }

  function renderDropdownMenu() {
    if (!showHomeDropdown) return null;

    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="absolute top-full mt-2 w-full bg-white border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150"
      >
        {matchingMeals.length === 0 ? (
          <div className="px-4 py-5 text-center text-sm text-gray-500">
            {uiContent.noResultsTitle[lang]}
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {matchingMeals.slice(0, 4).map((meal) => (
              <button
                key={meal.id}
                type="button"
                onClick={() => handleSelectDropdownMeal(meal)}
                className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-start hover:bg-orange-50/70 transition-colors"
              >
                <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70">
                  <Image
                    src={meal.image}
                    alt={meal.title[lang]}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-gray-900 truncate">
                    {meal.title[lang]}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-gray-500">
                      {meal.category[lang]}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span
                      dir="ltr"
                      className="text-xs font-extrabold text-orange-600"
                    >
                      {meal.priceEgp} {uiContent.currency[lang]}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => goToFoodWithSearch(searchQuery)}
          className="w-full py-2.5 px-4 bg-gray-50 hover:bg-orange-50 text-orange-600 text-sm font-extrabold text-center border-t border-gray-100 transition-colors"
        >
          {uiContent.searchMore[lang]}
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8 shrink-0">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-orange-400">
                {uiContent.brandFirst[lang]}
              </span>
              <span className="text-red-600">
                {uiContent.brandSecond[lang]}
              </span>
            </Link>

            <nav
              aria-label="Primary"
              className="hidden md:flex items-center gap-1 lg:gap-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[11px] font-bold leading-none rounded-full bg-red-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              ref={desktopSearchRef}
              className="hidden md:flex items-center relative w-60 lg:w-72"
            >
              <Search
                className={`w-4 h-4 text-gray-400 absolute pointer-events-none ${
                  isRtl ? "right-3.5" : "left-3.5"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={uiContent.searchPlaceholder[lang]}
                className={`w-full py-1.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${
                  isRtl ? "pr-10 pl-8" : "pl-10 pr-8"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className={`absolute p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 transition-colors ${
                    isRtl ? "left-2.5" : "right-2.5"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {renderDropdownMenu()}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-800 text-sm font-semibold transition-all shadow-2xs"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src={currentLang.flag}
                    alt={currentLang.fullName}
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </div>
                <span dir="ltr" className="tracking-wide">
                  {currentLang.shortLabel}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    langDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div
                  role="listbox"
                  className={`absolute mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 ${
                    isRtl ? "left-0" : "right-0"
                  }`}
                >
                  {languageOptions.map((option) => {
                    const isSelected = option.code === lang;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectLanguage(option.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors ${
                          isSelected
                            ? "bg-orange-50/80 text-orange-600 font-bold"
                            : "text-gray-700 hover:bg-gray-50 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-200">
                            <Image
                              src={option.flag}
                              alt={option.fullName}
                              fill
                              sizes="20px"
                              className="object-cover"
                            />
                          </div>
                          <span>{option.fullName}</span>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-orange-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={uiContent.menuLabel[lang]}
              aria-expanded={drawerOpen}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {pathname !== "/favorites" && (
        <div
          ref={mobileSearchRef}
          dir={isRtl ? "rtl" : "ltr"}
          className="md:hidden w-full bg-white px-4 pt-3 pb-1 relative z-30"
        >
          <div className="relative flex items-center w-full">
            <Search
              className={`w-4 h-4 text-gray-400 absolute pointer-events-none ${
                isRtl ? "right-3.5" : "left-3.5"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={uiContent.searchPlaceholder[lang]}
              className={`w-full py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${
                isRtl ? "pr-10 pl-9" : "pl-10 pr-9"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className={`absolute p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 transition-colors ${
                  isRtl ? "left-2.5" : "right-2.5"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {renderDropdownMenu()}
          </div>
        </div>
      )}

      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`fixed inset-0 bg-gray-950/45 backdrop-blur-xs transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          dir={isRtl ? "rtl" : "ltr"}
          className={`fixed top-0 bottom-0 ${
            isRtl ? "left-0 rounded-r-3xl" : "right-0 rounded-l-3xl"
          } w-80 max-w-[85vw] bg-white shadow-2xl border-gray-100 flex flex-col justify-between transition-all duration-300 ease-out ${
            drawerOpen
              ? "translate-x-0 opacity-100"
              : isRtl
              ? "-translate-x-full opacity-0"
              : "translate-x-full opacity-0"
          }`}
        >
          <div>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="text-2xl font-extrabold tracking-tight block"
                >
                  <span className="text-orange-400">
                    {uiContent.brandFirst[lang]}
                  </span>
                  <span className="text-red-600">
                    {uiContent.brandSecond[lang]}
                  </span>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {uiContent.drawerTagline[lang]}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={uiContent.closeMenuLabel[lang]}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {uiContent.menuLabel[lang]}
              </span>
            </div>

            <nav className="px-4 pb-4 pt-1 flex flex-col gap-1.5">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href;
                const DirectionArrow = isRtl ? ChevronLeft : ChevronRight;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      transitionDelay: drawerOpen ? `${index * 45}ms` : "0ms",
                    }}
                    className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-300 ${
                      drawerOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-orange-50 to-red-50/70 text-orange-600 font-bold shadow-2xs"
                        : "text-gray-700 hover:bg-gray-50 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                            : "bg-gray-100 text-gray-500 group-hover:bg-orange-100/80 group-hover:text-orange-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-base">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
                          {item.badge}
                        </span>
                      )}
                      <DirectionArrow
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive
                            ? "text-orange-500"
                            : "text-gray-300 group-hover:text-gray-500"
                        } ${
                          isRtl
                            ? "group-hover:-translate-x-0.5"
                            : "group-hover:translate-x-0.5"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-red-50/60 border border-orange-100">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-sm font-extrabold text-gray-800">
                  {lang === "ar"
                    ? "وصفات مختارة بعناية"
                    : "Curated Halal Kitchen"}
                </p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {lang === "ar"
                  ? "أطباق شهية من مختلف المطابخ جاهزة للتصفح والطلب السريع في أي وقت."
                  : "Delicious dishes from diverse kitchens ready for quick browsing and ordering anytime."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}