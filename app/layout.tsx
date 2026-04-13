import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeatherAQINow — Weather, AQI & Allergy in One Dashboard",
  description: "Real-time weather, air quality index (AQI), and allergy/pollen data for 60+ US cities. Stay healthy with instant outdoor safety scores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
