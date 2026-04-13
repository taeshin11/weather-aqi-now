"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface City {
  slug: string;
  name: string;
  state: string;
  abbreviation: string;
}

interface CitySearchProps {
  cities: City[];
  locale: string;
  placeholder?: string;
}

export default function CitySearch({ cities, locale, placeholder }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = cities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.abbreviation.toLowerCase().includes(q)
      )
      .slice(0, 8);
    setResults(filtered);
  }, [query, cities]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setQuery("");
    setResults([]);
    setFocused(false);
    router.push(`/${locale}/cities/${slug}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center bg-white border-2 border-sky-200 rounded-2xl px-4 py-3 shadow-md focus-within:border-sky-400 transition-colors">
        <Search className="w-5 h-5 text-sky-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder || "Search city..."}
          className="flex-1 ml-3 text-sky-900 placeholder-sky-300 bg-transparent outline-none text-base"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white border border-sky-100 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          {results.map((city) => (
            <button
              key={city.slug}
              onClick={() => handleSelect(city.slug)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-sky-50 transition-colors text-left"
            >
              <span className="font-medium text-sky-900">{city.name}</span>
              <span className="text-sm text-sky-500">{city.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
