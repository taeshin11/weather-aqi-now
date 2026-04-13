import { getAQILevel } from "../lib/aqiUtils";
import type { ForecastDay } from "../lib/cities";

interface ForecastRowProps {
  forecast: ForecastDay[];
}

function conditionEmoji(condition: string): string {
  const map: Record<string, string> = {
    Sunny: "☀️",
    "Partly Cloudy": "⛅",
    Cloudy: "☁️",
    Rainy: "🌧️",
    Snowy: "❄️",
    Foggy: "🌫️",
    Windy: "💨",
    Stormy: "⛈️",
  };
  return map[condition] || "🌤️";
}

export default function ForecastRow({ forecast }: ForecastRowProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {forecast.map((day) => {
        const aqiLevel = getAQILevel(day.aqi);
        return (
          <div
            key={day.day}
            className="flex flex-col items-center gap-1 bg-white rounded-xl border border-sky-100 p-3 text-center"
          >
            <span className="text-xs font-semibold text-sky-700">{day.day}</span>
            <span className="text-2xl">{conditionEmoji(day.condition)}</span>
            <div className="text-xs text-slate-700">
              <span className="font-bold">{day.high}°</span>
              <span className="text-slate-400"> / {day.low}°</span>
            </div>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: aqiLevel.bgColor, color: aqiLevel.textColor }}
            >
              {day.aqi}
            </span>
          </div>
        );
      })}
    </div>
  );
}
