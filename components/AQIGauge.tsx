import { getAQILevel } from "../lib/aqiUtils";

interface AQIGaugeProps {
  aqi: number;
  size?: "sm" | "md" | "lg";
}

export default function AQIGauge({ aqi, size = "md" }: AQIGaugeProps) {
  const level = getAQILevel(aqi);

  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const percentage = (clampedAqi / 500) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={level.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${textSizes[size]}`} style={{ color: level.color }}>
            {aqi}
          </span>
          <span className="text-xs text-slate-500">AQI</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: level.bgColor, color: level.textColor }}
      >
        {level.category}
      </span>
    </div>
  );
}
