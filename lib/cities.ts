import citiesData from "../data/cities-fallback.json";
import statesData from "../data/states-fallback.json";

export interface City {
  slug: string;
  name: string;
  state: string;
  abbreviation: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  visibility: number;
  condition: string;
  aqi: number;
  aqiCategory: string;
  pm25: number;
  pm10: number;
  o3: number;
  pollen: string;
  uvIndex: number;
  pressure: number;
  dewpoint: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  aqi: number;
}

export interface State {
  name: string;
  abbreviation: string;
  slug: string;
  avgTemp: number;
  avgAqi: number;
  topCity: string;
  condition: string;
  pollen: string;
}

export function getAllCities(): City[] {
  return citiesData.cities as City[];
}

export function getCityBySlug(slug: string): City | undefined {
  return (citiesData.cities as City[]).find((c) => c.slug === slug);
}

export function getCitiesByState(stateName: string): City[] {
  return (citiesData.cities as City[]).filter(
    (c) =>
      c.state.toLowerCase() === stateName.toLowerCase() ||
      c.abbreviation.toLowerCase() === stateName.toLowerCase()
  );
}

export function getCitiesSortedByAQI(): City[] {
  return [...(citiesData.cities as City[])].sort((a, b) => b.aqi - a.aqi);
}

export function getUnhealthyCities(): City[] {
  return (citiesData.cities as City[])
    .filter((c) => c.aqi > 100)
    .sort((a, b) => b.aqi - a.aqi);
}

export function getWorstAQICities(limit = 10): City[] {
  return getCitiesSortedByAQI().slice(0, limit);
}

export function getWorstAllergyCities(limit = 10): City[] {
  const pollenOrder: Record<string, number> = {
    VeryHigh: 4,
    High: 3,
    Moderate: 2,
    Low: 1,
  };
  return [...(citiesData.cities as City[])]
    .sort((a, b) => (pollenOrder[b.pollen] ?? 0) - (pollenOrder[a.pollen] ?? 0))
    .slice(0, limit);
}

export function getAllStates(): State[] {
  return statesData.states as State[];
}

export function getStateBySlug(slug: string): State | undefined {
  return (statesData.states as State[]).find((s) => s.slug === slug);
}
