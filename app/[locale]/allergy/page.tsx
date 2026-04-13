import { getMessages } from "next-intl/server";
import { getWorstAllergyCities, getAllCities } from "../../../lib/cities";
import { getPollenColor, getPollenLabel } from "../../../lib/aqiUtils";
import CityWeatherCard from "../../../components/CityWeatherCard";
import CityTable from "../../../components/CityTable";
import AllergyBadge from "../../../components/AllergyBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Worst Allergy Cities Today | WeatherAQINow",
  description: "Cities with the highest pollen counts today. Tree, grass, and weed pollen levels for all tracked US cities.",
};

export default async function AllergyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;
  const worstCities = getWorstAllergyCities(6);
  const allCities = getAllCities();

  // Sort all cities by pollen level
  const pollenOrder: Record<string, number> = { VeryHigh: 4, High: 3, Moderate: 2, Low: 1 };
  const citiesByPollen = [...allCities].sort(
    (a, b) => (pollenOrder[b.pollen] ?? 0) - (pollenOrder[a.pollen] ?? 0)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          🌿 {messages["allergy.title"] || "Worst Allergy Cities Today"}
        </h1>
        <p className="text-sky-600">
          {messages["allergy.subtitle"] || "Cities with highest pollen levels today"}
        </p>
      </div>

      {/* Pollen level legend */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
        <h2 className="font-bold text-sky-900 mb-3">Pollen Level Scale</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Low", "Moderate", "High", "VeryHigh"].map((level) => {
            const colors = getPollenColor(level);
            return (
              <div
                key={level}
                className="text-center p-3 rounded-xl"
                style={{ backgroundColor: colors.bg }}
              >
                <div className="text-lg font-bold" style={{ color: colors.text }}>
                  {getPollenLabel(level)}
                </div>
                <div className="text-xs mt-1" style={{ color: colors.text, opacity: 0.7 }}>
                  {level === "Low" && "Safe for most"}
                  {level === "Moderate" && "Some may react"}
                  {level === "High" && "Many affected"}
                  {level === "VeryHigh" && "Severe symptoms"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worst cities */}
      <section>
        <h2 className="text-xl font-bold text-sky-900 mb-4">Cities with Highest Pollen Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {worstCities.map((city) => (
            <CityWeatherCard key={city.slug} city={city} locale={locale} />
          ))}
        </div>
      </section>

      {/* All cities by pollen */}
      <section>
        <h2 className="text-xl font-bold text-sky-900 mb-4">All Cities by Pollen Level</h2>
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-50 text-sky-700">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">City</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-center font-semibold">Pollen Level</th>
                  <th className="px-4 py-3 text-center font-semibold">AQI</th>
                  <th className="px-4 py-3 text-center font-semibold">Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {citiesByPollen.map((city, idx) => {
                  const pollenColors = getPollenColor(city.pollen);
                  const pollenOrder2: Record<string, number> = { VeryHigh: 4, High: 3, Moderate: 2, Low: 1 };
                  return (
                    <tr key={city.slug} className="hover:bg-sky-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <a href={`/${locale}/cities/${city.slug}`} className="font-semibold text-sky-700 hover:text-sky-500">
                          {city.name}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{city.abbreviation}</td>
                      <td className="px-4 py-3 text-center">
                        <AllergyBadge level={city.pollen} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{city.aqi}</td>
                      <td className="px-4 py-3 text-center font-semibold text-sky-800">{city.temp}°F</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-sky-900 mb-4">Allergy Management Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "⏰", title: "Time Your Activities", desc: "Pollen counts are typically highest in the morning (5-10am). Exercise later in the day." },
            { icon: "🚿", title: "Shower After Outdoors", desc: "Rinse pollen off skin and hair before coming indoors." },
            { icon: "🪟", title: "Keep Windows Closed", desc: "On high pollen days, keep windows closed and use air conditioning." },
            { icon: "💊", title: "Check with Your Doctor", desc: "Antihistamines and nasal sprays can help manage allergy symptoms." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <div className="font-semibold text-green-800 text-sm">{tip.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
