import Link from "next/link";
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from "lucide-react";
import { getAQILevel, getPollenColor, getPollenLabel, calculateOutdoorSafetyScore } from "../lib/aqiUtils";
import type { City } from "../lib/cities";

interface CityWeatherCardProps {
  city: City;
  locale: string;
}

function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const cls = className || "w-8 h-8";
  switch (condition) {
    case "Sunny": return <Sun className={`${cls} text-yellow-400`} />;
    case "Rainy": return <CloudRain className={`${cls} text-blue-400`} />;
    case "Windy": return <Wind className={`${cls} text-slate-400`} />;
    default: return <Cloud className={`${cls} text-slate-300`} />;
  }
}

export default function CityWeatherCard({ city, locale }: CityWeatherCardProps) {
  const aqiLevel = getAQILevel(city.aqi);
  const pollenColors = getPollenColor(city.pollen);
  const safetyScore = calculateOutdoorSafetyScore(city.aqi, city.condition, city.pollen);

  return (
    <Link
      href={`/${locale}/cities/${city.slug}`}
      className="block bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3 border-b border-sky-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sky-900">{city.name}</h3>
            <p className="text-xs text-sky-600">{city.state}</p>
          </div>
          <WeatherIcon condition={city.condition} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Weather row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-sky-900">{city.temp}°F</span>
            <span className="text-sm text-slate-400 ml-2">{city.condition}</span>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="flex items-center gap-1 justify-end">
              <Droplets className="w-3 h-3" />
              <span>{city.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Wind className="w-3 h-3" />
              <span>{city.wind} mph</span>
            </div>
          </div>
        </div>

        {/* AQI badge */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{ backgroundColor: aqiLevel.bgColor }}
        >
          <div>
            <span className="text-xs font-medium" style={{ color: aqiLevel.textColor }}>AQI</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold" style={{ color: aqiLevel.textColor }}>{city.aqi}</span>
              <span className="text-xs" style={{ color: aqiLevel.textColor }}>{aqiLevel.category}</span>
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: aqiLevel.textColor }}>
            <div>PM2.5: {city.pm25}</div>
            <div>PM10: {city.pm10}</div>
          </div>
        </div>

        {/* Pollen badge */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
          style={{ backgroundColor: pollenColors.bg }}
        >
          <span className="font-medium" style={{ color: pollenColors.text }}>Pollen</span>
          <span className="font-bold" style={{ color: pollenColors.text }}>
            {getPollenLabel(city.pollen)}
          </span>
        </div>

        {/* Safety score */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Outdoor Safety</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${safetyScore}%`,
                  backgroundColor: safetyScore >= 70 ? "#22c55e" : safetyScore >= 40 ? "#eab308" : "#ef4444",
                }}
              />
            </div>
            <span className="font-semibold text-sky-700">{safetyScore}/100</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
