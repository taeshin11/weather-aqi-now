export interface AQILevel {
  category: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  healthAdvice: string;
  activityKey: string;
}

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) {
    return {
      category: "Good",
      color: "#16a34a",
      bgColor: "#bbf7d0",
      textColor: "#166534",
      borderColor: "#86efac",
      description: "Air quality is satisfactory. Perfect for outdoor activities.",
      healthAdvice: "Air quality is great! Enjoy your outdoor activities.",
      activityKey: "activity.great",
    };
  } else if (aqi <= 100) {
    return {
      category: "Moderate",
      color: "#ca8a04",
      bgColor: "#fef9c3",
      textColor: "#854d0e",
      borderColor: "#fde047",
      description: "Air quality is acceptable. Unusually sensitive people should limit outdoor exertion.",
      healthAdvice: "Generally safe for outdoor activities. Sensitive individuals should be cautious.",
      activityKey: "activity.moderate",
    };
  } else if (aqi <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      color: "#ea580c",
      bgColor: "#fed7aa",
      textColor: "#9a3412",
      borderColor: "#fdba74",
      description: "Members of sensitive groups may experience health effects.",
      healthAdvice: "Sensitive groups (children, elderly, those with respiratory issues) should limit time outdoors.",
      activityKey: "activity.sensitive",
    };
  } else if (aqi <= 200) {
    return {
      category: "Unhealthy",
      color: "#dc2626",
      bgColor: "#fecaca",
      textColor: "#991b1b",
      borderColor: "#fca5a5",
      description: "Everyone may begin to experience health effects.",
      healthAdvice: "Avoid prolonged outdoor exertion. Move activities indoors if possible.",
      activityKey: "activity.avoid",
    };
  } else if (aqi <= 300) {
    return {
      category: "Very Unhealthy",
      color: "#7c3aed",
      bgColor: "#e9d5ff",
      textColor: "#6b21a8",
      borderColor: "#c4b5fd",
      description: "Health alert: everyone may experience serious health effects.",
      healthAdvice: "Stay indoors. Avoid all outdoor activities. Use air purifier if available.",
      activityKey: "activity.stayIndoors",
    };
  } else {
    return {
      category: "Hazardous",
      color: "#9f1239",
      bgColor: "#fecdd3",
      textColor: "#881337",
      borderColor: "#fda4af",
      description: "Health warning of emergency conditions.",
      healthAdvice: "Emergency conditions. Everyone should stay indoors with windows closed.",
      activityKey: "activity.emergency",
    };
  }
}

export function getPollenColor(level: string): { bg: string; text: string } {
  switch (level) {
    case "Low":
      return { bg: "#d1fae5", text: "#065f46" };
    case "Moderate":
      return { bg: "#fef3c7", text: "#92400e" };
    case "High":
      return { bg: "#fed7aa", text: "#9a3412" };
    case "VeryHigh":
      return { bg: "#fecaca", text: "#991b1b" };
    default:
      return { bg: "#f1f5f9", text: "#475569" };
  }
}

export function getPollenLabel(level: string): string {
  if (level === "VeryHigh") return "Very High";
  return level;
}

export function calculateOutdoorSafetyScore(
  aqi: number,
  condition: string,
  pollen: string
): number {
  // AQI score (40% weight) — lower AQI is better
  const aqiScore = Math.max(0, Math.min(40, ((150 - aqi) / 150) * 40));

  // Weather score (40% weight)
  const weatherScores: Record<string, number> = {
    Sunny: 40,
    "Partly Cloudy": 38,
    Cloudy: 32,
    Foggy: 28,
    Windy: 25,
    Rainy: 15,
    Snowy: 10,
    Stormy: 5,
  };
  const weatherScore = weatherScores[condition] ?? 30;

  // Pollen score (20% weight)
  const pollenScores: Record<string, number> = {
    Low: 20,
    Moderate: 15,
    High: 8,
    VeryHigh: 3,
  };
  const pollenScore = pollenScores[pollen] ?? 10;

  return Math.round(Math.min(100, Math.max(0, aqiScore + weatherScore + pollenScore)));
}

export function getUVLabel(uvIndex: number): string {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
}
