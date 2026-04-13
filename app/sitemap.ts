import type { MetadataRoute } from "next";
import { getAllCities, getAllStates } from "../lib/cities";

const BASE_URL = "https://weather-aqi-now.vercel.app";
const locales = ["en", "ko", "ja", "zh", "es", "fr", "de", "pt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getAllCities();
  const states = getAllStates();

  const staticPages = ["", "/cities", "/states", "/aqi-guide", "/unhealthy", "/allergy"];

  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page === "" ? 1.0 : 0.9,
    }))
  );

  const cityEntries = locales.flatMap((locale) =>
    cities.map((city) => ({
      url: `${BASE_URL}/${locale}/cities/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    }))
  );

  const stateEntries = locales.flatMap((locale) =>
    states.map((state) => ({
      url: `${BASE_URL}/${locale}/states/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...cityEntries, ...stateEntries];
}
