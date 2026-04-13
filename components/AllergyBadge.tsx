import { getPollenColor, getPollenLabel } from "../lib/aqiUtils";

interface AllergyBadgeProps {
  level: string;
  type?: string;
  size?: "sm" | "md";
}

export default function AllergyBadge({ level, type, size = "md" }: AllergyBadgeProps) {
  const colors = getPollenColor(level);
  const label = getPollenLabel(level);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {type && <span className="opacity-70">{type}:</span>}
      {label}
    </span>
  );
}
