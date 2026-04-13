import { getMessages } from "next-intl/server";
import { getAllStates } from "../../../lib/cities";
import { getAQILevel, getPollenColor, getPollenLabel } from "../../../lib/aqiUtils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Air Quality by State | WeatherAQINow",
  description: "Browse weather and air quality index (AQI) data for all 50 US states.",
};

export default async function StatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;
  const states = getAllStates();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          {messages["states.title"] || "Air Quality by State"}
        </h1>
        <p className="text-sky-600">{messages["states.subtitle"] || "Browse weather and AQI data by state"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {states.map((state) => {
          const aqiLevel = getAQILevel(state.avgAqi);
          const pollenColors = getPollenColor(state.pollen);

          return (
            <Link
              key={state.slug}
              href={`/${locale}/states/${state.slug}`}
              className="block bg-white rounded-2xl border border-sky-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sky-900">{state.name}</h3>
                  <p className="text-xs text-slate-400">{state.abbreviation} · {state.topCity}</p>
                </div>
                <span
                  className="text-2xl font-bold px-3 py-1 rounded-lg"
                  style={{ backgroundColor: aqiLevel.bgColor, color: aqiLevel.textColor }}
                >
                  {state.avgAqi}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Avg Temp</span>
                  <span className="font-semibold text-sky-800">{state.avgTemp}°F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">AQI</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: aqiLevel.bgColor, color: aqiLevel.textColor }}
                  >
                    {aqiLevel.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pollen</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: pollenColors.bg, color: pollenColors.text }}
                  >
                    {getPollenLabel(state.pollen)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Condition</span>
                  <span className="text-xs text-slate-600">{state.condition}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
