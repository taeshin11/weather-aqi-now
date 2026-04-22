// lib/weather.ts — Open-Meteo live weather + air quality (no API key required)
// Weather: https://api.open-meteo.com/v1/forecast
// Air Quality: https://air-quality-api.open-meteo.com/v1/air-quality

export interface LiveWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  condition: string;
  aqi: number;
  aqiCategory: string;
  pm25: number;
  pm10: number;
  uvIndex: number;
  forecast: { day: string; high: number; low: number; condition: string; aqi: number }[];
  source: 'live' | 'fallback';
}

const WMO_CONDITIONS: Record<number, string> = {
  0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rainy', 63: 'Rainy', 65: 'Rainy', 71: 'Snowy', 73: 'Snowy', 75: 'Snowy',
  80: 'Showers', 81: 'Showers', 82: 'Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

const AQI_CATEGORY: Record<string, string> = {};
function aqiCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function fetchCityWeather(lat: number, lon: number): Promise<LiveWeather | null> {
  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,uv_index` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
          `&wind_speed_unit=mph&temperature_unit=fahrenheit&timezone=auto&forecast_days=5`,
        { next: { revalidate: 3600 } } // refresh hourly
      ),
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
          `&current=pm2_5,pm10,us_aqi&timezone=auto`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!weatherRes.ok || !aqiRes.ok) return null;

    const [wData, aData] = await Promise.all([weatherRes.json(), aqiRes.json()]);
    const cur = wData.current ?? {};
    const daily = wData.daily ?? {};
    const acur = aData.current ?? {};

    const aqi = Math.round(acur.us_aqi ?? 50);
    const forecast = (daily.time ?? []).slice(0, 5).map((dateStr: string, i: number) => {
      const d = new Date(dateStr + 'T12:00:00');
      return {
        day: DAYS[d.getDay()],
        high: Math.round(daily.temperature_2m_max?.[i] ?? 70),
        low: Math.round(daily.temperature_2m_min?.[i] ?? 55),
        condition: WMO_CONDITIONS[daily.weather_code?.[i] ?? 0] ?? 'Clear',
        aqi,
      };
    });

    return {
      temp: Math.round(cur.temperature_2m ?? 65),
      feelsLike: Math.round(cur.apparent_temperature ?? 65),
      humidity: Math.round(cur.relative_humidity_2m ?? 60),
      wind: Math.round(cur.wind_speed_10m ?? 10),
      condition: WMO_CONDITIONS[cur.weather_code ?? 0] ?? 'Clear',
      aqi,
      aqiCategory: aqiCategory(aqi),
      pm25: Math.round((acur.pm2_5 ?? 10) * 10) / 10,
      pm10: Math.round((acur.pm10 ?? 15) * 10) / 10,
      uvIndex: Math.round(cur.uv_index ?? 3),
      forecast,
      source: 'live',
    };
  } catch {
    return null;
  }
}
