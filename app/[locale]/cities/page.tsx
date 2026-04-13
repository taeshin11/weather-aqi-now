import { getMessages } from "next-intl/server";
import { getAllCities } from "../../../lib/cities";
import CityTable from "../../../components/CityTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Air Quality Rankings — All US Cities | WeatherAQINow",
  description: "Browse air quality index (AQI), weather, and pollen data for 60+ US cities ranked by current AQI level.",
};

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;
  const cities = getAllCities().sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          {messages["cities.title"] || "Air Quality Rankings — All Cities"}
        </h1>
        <p className="text-sky-600">
          {messages["cities.subtitle"] || "Cities ranked by current AQI level"}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Cities", value: cities.length },
          { label: "Good AQI (0-50)", value: cities.filter(c => c.aqi <= 50).length, color: "#16a34a" },
          { label: "Moderate (51-100)", value: cities.filter(c => c.aqi > 50 && c.aqi <= 100).length, color: "#ca8a04" },
          { label: "Unhealthy (101+)", value: cities.filter(c => c.aqi > 100).length, color: "#dc2626" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-sky-100 p-4 text-center shadow-sm">
            <div
              className="text-3xl font-bold"
              style={{ color: stat.color || "#0284c7" }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <CityTable cities={cities} locale={locale} showRank={true} />
    </div>
  );
}
