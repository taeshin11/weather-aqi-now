"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  locale: string;
  messages: Record<string, string>;
}

const locales = ["en", "ko", "ja", "zh", "es", "fr", "de", "pt"];
const localeLabels: Record<string, string> = {
  en: "EN", ko: "한국어", ja: "日本語", zh: "中文", es: "ES", fr: "FR", de: "DE", pt: "PT",
};

export default function Navbar({ locale, messages }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const localePath = (path: string) => `/${locale}${path}`;

  const getLocalePath = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  const navLinks = [
    { href: "", label: messages["nav.home"] || "Home" },
    { href: "/cities", label: messages["nav.cities"] || "Cities" },
    { href: "/states", label: messages["nav.states"] || "States" },
    { href: "/aqi-guide", label: messages["nav.aqiGuide"] || "AQI Guide" },
    { href: "/unhealthy", label: messages["nav.unhealthy"] || "Unhealthy Air" },
    { href: "/allergy", label: messages["nav.allergy"] || "Allergy" },
  ];

  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={localePath("")} className="flex items-center gap-2 font-bold text-sky-700 text-lg">
            <Wind className="w-6 h-6 text-sky-500" />
            <span>WeatherAQINow</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 hover:text-sky-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="relative ml-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 border border-sky-200"
              >
                {localeLabels[locale] || locale.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-sky-100 rounded-lg shadow-lg py-1 z-50">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={getLocalePath(l)}
                      className={`block px-4 py-2 text-sm hover:bg-sky-50 ${l === locale ? "text-sky-600 font-semibold" : "text-sky-800"}`}
                      onClick={() => setLangOpen(false)}
                    >
                      {localeLabels[l]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-sky-700 hover:bg-sky-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2 flex flex-wrap gap-2">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={getLocalePath(l)}
                  className={`px-3 py-1 rounded text-xs border ${l === locale ? "bg-sky-600 text-white border-sky-600" : "text-sky-700 border-sky-200 hover:bg-sky-50"}`}
                >
                  {localeLabels[l]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
