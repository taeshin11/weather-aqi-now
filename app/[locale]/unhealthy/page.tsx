import { getMessages } from "next-intl/server";
import { getUnhealthyCities, getCitiesSortedByAQI } from "../../../lib/cities";
import CityTable from "../../../components/CityTable";
import HealthAlert from "../../../components/HealthAlert";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cities with Unhealthy Air Today | WeatherAQINow",
  description: "Cities currently experiencing unhealthy air quality. AQI above 100 — check before going outside.",
};

export default async function UnhealthyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;
  const unhealthyCities = getUnhealthyCities();
  const worstCities = getCitiesSortedByAQI().slice(0, 15);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-red-900 mb-2">
          ⚠️ {messages["unhealthy.title"] || "Cities with Unhealthy Air Today"}
        </h1>
        <p className="text-red-600">
          {messages["unhealthy.subtitle"] || "Cities currently experiencing poor air quality conditions"}
        </p>
      </div>

      {unhealthyCities.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold text-sky-900 mb-4">
            Cities with AQI above 100 ({unhealthyCities.length} cities)
          </h2>
          <div className="mb-6">
            <HealthAlert aqi={unhealthyCities[0]?.aqi || 110} messages={messages} />
          </div>
          <CityTable cities={unhealthyCities} locale={locale} showRank={true} />
        </section>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Great news! No unhealthy cities today.</h2>
          <p className="text-green-600">All tracked cities have AQI below 100. Enjoy the fresh air!</p>
        </div>
      )}

      {/* Worst AQI cities (even if below 100) */}
      <section>
        <h2 className="text-xl font-bold text-sky-900 mb-4">Cities with Highest AQI Today</h2>
        <CityTable cities={worstCities} locale={locale} showRank={true} />
      </section>

      {/* Tips */}
      <section className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-sky-900 mb-4">How to Protect Yourself</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "🏠", title: "Stay Indoors", desc: "When AQI is above 150, stay inside with windows closed." },
            { icon: "😷", title: "Wear N95 Mask", desc: "N95 masks filter out PM2.5 particles effectively." },
            { icon: "💨", title: "Use Air Purifier", desc: "HEPA air purifiers can significantly improve indoor air quality." },
            { icon: "🏃", title: "Avoid Exercise", desc: "Avoid strenuous outdoor activities when AQI is high." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3 p-4 bg-sky-50 rounded-xl">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <div className="font-semibold text-sky-800 text-sm">{tip.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
