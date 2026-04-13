import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { getAQILevel } from "../lib/aqiUtils";

interface HealthAlertProps {
  aqi: number;
  messages?: Record<string, string>;
}

export default function HealthAlert({ aqi, messages }: HealthAlertProps) {
  const level = getAQILevel(aqi);

  const icons = {
    "Good": <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    "Moderate": <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    "Unhealthy for Sensitive Groups": <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    "Unhealthy": <XCircle className="w-5 h-5 flex-shrink-0" />,
    "Very Unhealthy": <XCircle className="w-5 h-5 flex-shrink-0" />,
    "Hazardous": <XCircle className="w-5 h-5 flex-shrink-0" />,
  };

  const icon = icons[level.category as keyof typeof icons] || <AlertCircle className="w-5 h-5 flex-shrink-0" />;

  return (
    <div
      className="flex gap-3 p-4 rounded-xl border"
      style={{
        backgroundColor: level.bgColor,
        borderColor: level.borderColor,
        color: level.textColor,
      }}
    >
      {icon}
      <div>
        <p className="font-semibold text-sm">{level.category}</p>
        <p className="text-sm mt-0.5">{level.healthAdvice}</p>
        <p className="text-xs mt-1 opacity-80">{level.description}</p>
      </div>
    </div>
  );
}
