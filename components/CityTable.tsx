import Link from "next/link";
import { getAQILevel, getPollenColor, getPollenLabel } from "../lib/aqiUtils";
import type { City } from "../lib/cities";

interface CityTableProps {
  cities: City[];
  locale: string;
  showRank?: boolean;
}

export default function CityTable({ cities, locale, showRank = false }: CityTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-sky-700">
            {showRank && <th className="px-4 py-3 text-left font-semibold w-10">#</th>}
            <th className="px-4 py-3 text-left font-semibold">City</th>
            <th className="px-4 py-3 text-left font-semibold">State</th>
            <th className="px-4 py-3 text-center font-semibold">Temp</th>
            <th className="px-4 py-3 text-center font-semibold">AQI</th>
            <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">PM2.5</th>
            <th className="px-4 py-3 text-center font-semibold hidden md:table-cell">Pollen</th>
            <th className="px-4 py-3 text-center font-semibold hidden lg:table-cell">UV</th>
            <th className="px-4 py-3 text-center font-semibold">Condition</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50">
          {cities.map((city, idx) => {
            const aqiLevel = getAQILevel(city.aqi);
            const pollenColors = getPollenColor(city.pollen);
            return (
              <tr key={city.slug} className="hover:bg-sky-50/50 transition-colors">
                {showRank && (
                  <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                )}
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/cities/${city.slug}`}
                    className="font-semibold text-sky-700 hover:text-sky-500 transition-colors"
                  >
                    {city.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">{city.abbreviation}</td>
                <td className="px-4 py-3 text-center font-semibold text-sky-900">{city.temp}°F</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: aqiLevel.bgColor, color: aqiLevel.textColor }}
                  >
                    {city.aqi} {aqiLevel.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{city.pm25}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: pollenColors.bg, color: pollenColors.text }}
                  >
                    {getPollenLabel(city.pollen)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-500 hidden lg:table-cell">{city.uvIndex}</td>
                <td className="px-4 py-3 text-center text-slate-500">{city.condition}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
