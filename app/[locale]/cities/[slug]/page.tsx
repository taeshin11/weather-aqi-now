import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { getAllCities, getCityBySlug } from "../../../../lib/cities";
import { getAQILevel, getPollenColor, getPollenLabel, calculateOutdoorSafetyScore, getUVLabel } from "../../../../lib/aqiUtils";
import AQIGauge from "../../../../components/AQIGauge";
import ForecastRow from "../../../../components/ForecastRow";
import HealthAlert from "../../../../components/HealthAlert";
import AllergyBadge from "../../../../components/AllergyBadge";
import CityWeatherCard from "../../../../components/CityWeatherCard";
import { Droplets, Wind, Eye, Gauge, Thermometer, Sun } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  return {
    title: `${city.name}, ${city.abbreviation} Air Quality & Weather Today | WeatherAQINow`,
    description: `Current AQI ${city.aqi} (${city.aqiCategory}), weather ${city.temp}°F, and pollen ${city.pollen} for ${city.name}, ${city.state}. Real-time air quality data, 7-day forecast, and health advisories.`,
    keywords: `${city.name} AQI, ${city.name} air quality, ${city.name} pollen count, ${city.name} weather today`,
    alternates: {
      canonical: `https://weather-aqi-now.vercel.app/en/cities/${slug}`,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) notFound();

  const messages = (await getMessages()) as Record<string, string>;
  const aqiLevel = getAQILevel(city.aqi);
  const pollenColors = getPollenColor(city.pollen);
  const safetyScore = calculateOutdoorSafetyScore(city.aqi, city.condition, city.pollen);
  const uvLabel = getUVLabel(city.uvIndex);

  // Get nearby cities (same state or close AQI)
  const allCities = getAllCities();
  const nearbyCities = allCities
    .filter((c) => c.state === city.state && c.slug !== city.slug)
    .slice(0, 3);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${city.name}, ${city.abbreviation} Air Quality Data`,
    description: `Current AQI, PM2.5, PM10, and weather conditions for ${city.name}, ${city.state}`,
    url: `https://weather-aqi-now.vercel.app/${locale}/cities/${slug}`,
    temporalCoverage: "2025",
    spatialCoverage: {
      "@type": "Place",
      name: `${city.name}, ${city.state}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.lat,
        longitude: city.lon,
      },
    },
    provider: { "@type": "Organization", name: "WeatherAQINow" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-sky-500">
          <a href={`/${locale}`} className="hover:text-sky-700">Home</a>
          <span className="mx-2">/</span>
          <a href={`/${locale}/cities`} className="hover:text-sky-700">Cities</a>
          <span className="mx-2">/</span>
          <span className="text-sky-900 font-medium">{city.name}</span>
        </nav>

        {/* City header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-sky-900">{city.name}</h1>
            <p className="text-sky-600 text-lg">{city.state} · {city.abbreviation}</p>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          {/* Safety score badge */}
          <div className="flex flex-col items-center bg-white rounded-2xl border border-sky-100 px-6 py-4 shadow-sm">
            <span className="text-xs text-slate-500 mb-1">{messages["score.outdoorSafety"] || "Outdoor Safety Score"}</span>
            <span
              className="text-4xl font-bold"
              style={{ color: safetyScore >= 70 ? "#16a34a" : safetyScore >= 40 ? "#ca8a04" : "#dc2626" }}
            >
              {safetyScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Three main cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weather card */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
            <h2 className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-4">
              {messages["card.weather"] || "Weather"}
            </h2>
            <div className="text-5xl font-bold text-sky-900 mb-2">{city.temp}°F</div>
            <div className="text-sky-600 mb-4">{city.condition}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{messages["weather.feelsLike"] || "Feels Like"}</span>
                <span className="font-medium text-sky-800">{city.feelsLike}°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{messages["weather.humidity"] || "Humidity"}</span>
                <span className="font-medium text-sky-800">{city.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{messages["weather.windSpeed"] || "Wind Speed"}</span>
                <span className="font-medium text-sky-800">{city.wind} mph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{messages["weather.visibility"] || "Visibility"}</span>
                <span className="font-medium text-sky-800">{city.visibility} mi</span>
              </div>
            </div>
          </div>

          {/* AQI card */}
          <div
            className="rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: aqiLevel.bgColor, borderColor: aqiLevel.borderColor }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: aqiLevel.textColor }}>
              {messages["card.aqi"] || "Air Quality Index"}
            </h2>
            <div className="flex flex-col items-center gap-3 mb-4">
              <AQIGauge aqi={city.aqi} size="lg" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: aqiLevel.textColor, opacity: 0.7 }}>PM2.5</span>
                <span className="font-bold" style={{ color: aqiLevel.textColor }}>{city.pm25} μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: aqiLevel.textColor, opacity: 0.7 }}>PM10</span>
                <span className="font-bold" style={{ color: aqiLevel.textColor }}>{city.pm10} μg/m³</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: aqiLevel.textColor, opacity: 0.7 }}>O₃ (Ozone)</span>
                <span className="font-bold" style={{ color: aqiLevel.textColor }}>{city.o3} ppb</span>
              </div>
            </div>
          </div>

          {/* Pollen card */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
            <h2 className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-4">
              {messages["card.pollen"] || "Pollen Count"}
            </h2>
            <div className="flex flex-col items-center mb-4">
              <span
                className="text-4xl font-bold px-4 py-2 rounded-xl"
                style={{ backgroundColor: pollenColors.bg, color: pollenColors.text }}
              >
                {getPollenLabel(city.pollen)}
              </span>
              <span className="text-xs text-slate-400 mt-1">Overall Pollen Level</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{messages["pollen.tree"] || "Tree Pollen"}</span>
                <AllergyBadge level={city.pollen} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{messages["pollen.grass"] || "Grass Pollen"}</span>
                <AllergyBadge level="Moderate" size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{messages["pollen.weed"] || "Weed Pollen"}</span>
                <AllergyBadge level="Low" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Health Advisory */}
        <section>
          <h2 className="text-xl font-bold text-sky-900 mb-3">
            {messages["health.advisory"] || "Health Advisory"}
          </h2>
          <HealthAlert aqi={city.aqi} messages={messages} />
        </section>

        {/* 7-day Forecast */}
        <section>
          <h2 className="text-xl font-bold text-sky-900 mb-4">
            {messages["forecast.7day"] || "7-Day Forecast"}
          </h2>
          <ForecastRow forecast={city.forecast} />
        </section>

        {/* Weather Details */}
        <section className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-sky-900 mb-4">Weather Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Thermometer className="w-5 h-5 text-sky-500" />, label: messages["weather.dewpoint"] || "Dewpoint", value: `${city.dewpoint}°F` },
              { icon: <Gauge className="w-5 h-5 text-sky-500" />, label: messages["weather.pressure"] || "Pressure", value: `${city.pressure} hPa` },
              { icon: <Wind className="w-5 h-5 text-sky-500" />, label: messages["weather.windSpeed"] || "Wind", value: `${city.wind} mph` },
              { icon: <Droplets className="w-5 h-5 text-sky-500" />, label: messages["weather.humidity"] || "Humidity", value: `${city.humidity}%` },
              { icon: <Eye className="w-5 h-5 text-sky-500" />, label: messages["weather.visibility"] || "Visibility", value: `${city.visibility} mi` },
              { icon: <Sun className="w-5 h-5 text-yellow-500" />, label: messages["weather.uvIndex"] || "UV Index", value: `${city.uvIndex} (${uvLabel})` },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-3 rounded-xl bg-sky-50">
                {item.icon}
                <span className="text-xs text-slate-400 mt-1">{item.label}</span>
                <span className="text-sm font-semibold text-sky-800 mt-0.5">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-sky-900 mb-4">Nearby Cities in {city.state}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {nearbyCities.map((c) => (
                <CityWeatherCard key={c.slug} city={c} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
