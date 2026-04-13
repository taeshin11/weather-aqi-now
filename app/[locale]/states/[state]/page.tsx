import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { getAllStates, getStateBySlug, getCitiesByState } from "../../../../lib/cities";
import { getAQILevel, getPollenColor, getPollenLabel } from "../../../../lib/aqiUtils";
import CityTable from "../../../../components/CityTable";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const states = getAllStates();
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};
  return {
    title: `${stateData.name} Air Quality Today | WeatherAQINow`,
    description: `Current weather, AQI ${stateData.avgAqi}, and pollen data for ${stateData.name}. Browse cities in ${stateData.name}.`,
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ locale: string; state: string }>;
}) {
  const { locale, state } = await params;
  const stateData = getStateBySlug(state);

  if (!stateData) notFound();

  const messages = (await getMessages()) as Record<string, string>;
  const aqiLevel = getAQILevel(stateData.avgAqi);
  const pollenColors = getPollenColor(stateData.pollen);

  // Get cities in this state by state name
  const cities = getCitiesByState(stateData.name);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-sky-500">
        <a href={`/${locale}`} className="hover:text-sky-700">Home</a>
        <span className="mx-2">/</span>
        <a href={`/${locale}/states`} className="hover:text-sky-700">States</a>
        <span className="mx-2">/</span>
        <span className="text-sky-900 font-medium">{stateData.name}</span>
      </nav>

      {/* State header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-900">{stateData.name}</h1>
            <p className="text-sky-600">{stateData.abbreviation} · Largest city: {stateData.topCity}</p>
          </div>
          <div className="flex gap-3">
            <div
              className="text-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: aqiLevel.bgColor }}
            >
              <div className="text-2xl font-bold" style={{ color: aqiLevel.textColor }}>{stateData.avgAqi}</div>
              <div className="text-xs" style={{ color: aqiLevel.textColor }}>AQI</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-sky-50">
              <div className="text-2xl font-bold text-sky-800">{stateData.avgTemp}°F</div>
              <div className="text-xs text-sky-500">Avg Temp</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-sky-50 rounded-xl">
            <div className="text-sm font-semibold text-sky-800">{stateData.condition}</div>
            <div className="text-xs text-slate-400">Condition</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: pollenColors.bg }}>
            <div className="text-sm font-semibold" style={{ color: pollenColors.text }}>{getPollenLabel(stateData.pollen)}</div>
            <div className="text-xs" style={{ color: pollenColors.text, opacity: 0.7 }}>Pollen Level</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: aqiLevel.bgColor }}>
            <div className="text-sm font-semibold" style={{ color: aqiLevel.textColor }}>{aqiLevel.category}</div>
            <div className="text-xs" style={{ color: aqiLevel.textColor, opacity: 0.7 }}>AQI Category</div>
          </div>
          <div className="text-center p-3 bg-sky-50 rounded-xl">
            <div className="text-sm font-semibold text-sky-800">{cities.length}</div>
            <div className="text-xs text-slate-400">Cities Tracked</div>
          </div>
        </div>
      </div>

      {/* Cities in state */}
      {cities.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold text-sky-900 mb-4">Cities in {stateData.name}</h2>
          <CityTable cities={cities} locale={locale} showRank={false} />
        </section>
      ) : (
        <div className="bg-white rounded-2xl border border-sky-100 p-8 text-center">
          <p className="text-slate-500">No city data available for {stateData.name} yet.</p>
          <a href={`/${locale}/cities`} className="text-sky-600 hover:underline text-sm mt-2 block">
            Browse all cities
          </a>
        </div>
      )}
    </div>
  );
}
