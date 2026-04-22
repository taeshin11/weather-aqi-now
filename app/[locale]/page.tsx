import { getMessages } from "next-intl/server";
import { getAllCities, getWorstAQICities, getWorstAllergyCities } from "../../lib/cities";
import { fetchCityWeather } from "../../lib/weather";
import CityWeatherCard from "../../components/CityWeatherCard";
import CityTable from "../../components/CityTable";
import CitySearch from "../../components/CitySearch";
import type { Metadata } from "next";

import { AdsterraNativeBanner } from '@/components/ads/AdsterraNativeBanner';
import { AdsterraDisplay } from '@/components/ads/AdsterraDisplay';

export const metadata: Metadata = {
  title: "WeatherAQINow — Weather, AQI & Allergy in One Dashboard",
  description: "Real-time weather, air quality index (AQI), and allergy/pollen data for 60+ US cities.",
  openGraph: {
    title: "WeatherAQINow — Weather, AQI & Allergy Dashboard",
    description: "Check weather, air quality, and pollen levels for any US city in one view.",
    url: "https://weather-aqi-now.vercel.app",
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;
  const allCities = getAllCities();
  const worstAQI = getWorstAQICities(10);
  const worstAllergy = getWorstAllergyCities(5);

  // Featured cities (first 6) — merge live Open-Meteo data on top of fallback
  const featuredCities = await Promise.all(
    allCities.slice(0, 6).map(async (city) => {
      const live = await fetchCityWeather(city.lat, city.lon);
      if (!live) return city;
      return {
        ...city,
        temp: live.temp,
        feelsLike: live.feelsLike,
        humidity: live.humidity,
        wind: live.wind,
        condition: live.condition,
        aqi: live.aqi,
        aqiCategory: live.aqiCategory,
        pm25: live.pm25,
        pm10: live.pm10,
        uvIndex: live.uvIndex,
        forecast: live.forecast,
      };
    })
  );

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WeatherAQINow",
    description: "Weather, Air Quality Index, and Allergy data in one dashboard",
    url: "https://weather-aqi-now.vercel.app",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero section */}
      <section className="bg-gradient-to-b from-sky-600 to-sky-400 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {messages["hero.title"] || "Weather, AQI & Allergy — One View"}
          </h1>
          <p className="text-sky-100 text-lg mb-8">
            {messages["hero.subtitle"] || "Real-time air quality, weather, and pollen data for 60+ US cities"}
          </p>
          <CitySearch
            cities={allCities}
            locale={locale}
            placeholder={messages["hero.searchPlaceholder"] || "Search city..."}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Featured cities */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            {messages["topCities.title"] || "Top Cities Dashboard"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCities.map((city) => (
              <CityWeatherCard key={city.slug} city={city} locale={locale} />
            ))}
          </div>
        </section>

        {/* Worst AQI Today */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            🏭 {messages["worstAqi.title"] || "Worst AQI Today"}
          </h2>
          <CityTable cities={worstAQI} locale={locale} showRank={true} />
        </section>

        {/* Worst Allergy Cities */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            🌿 {messages["allergy.title"] || "Worst Allergy Cities Today"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {worstAllergy.map((city) => (
              <CityWeatherCard key={city.slug} city={city} locale={locale} />
            ))}
          </div>
        </section>

        {/* AQI Color guide */}
        <section className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-sky-900 mb-4">AQI Color Scale</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Good", range: "0–50", bg: "#bbf7d0", text: "#166534" },
              { label: "Moderate", range: "51–100", bg: "#fef9c3", text: "#854d0e" },
              { label: "USG", range: "101–150", bg: "#fed7aa", text: "#9a3412" },
              { label: "Unhealthy", range: "151–200", bg: "#fecaca", text: "#991b1b" },
              { label: "Very Unhealthy", range: "201–300", bg: "#e9d5ff", text: "#6b21a8" },
              { label: "Hazardous", range: "301+", bg: "#fecdd3", text: "#881337" },
            ].map((level) => (
              <div
                key={level.label}
                className="flex flex-col items-center p-3 rounded-xl text-center"
                style={{ backgroundColor: level.bg }}
              >
                <span className="text-xs font-bold" style={{ color: level.text }}>{level.label}</span>
                <span className="text-xs mt-1" style={{ color: level.text }}>{level.range}</span>
              </div>
            ))}
          </div>
        </section>
      <AdsterraNativeBanner />
      <AdsterraDisplay />
      </div>
    </>
  );
}
