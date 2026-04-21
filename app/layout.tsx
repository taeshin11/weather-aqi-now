import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://weather-aqi-now.vercel.app";
const locales = ["en", "ko", "ja", "zh", "es", "fr", "de", "pt"];

export const metadata: Metadata = {
  verification: {
    google: "WddgcbVJsL2BGHNAje5m6DK56IcR0Mw5UOqozI2Xtrc",
  },
  title: "Live Weather & Air Quality Index by City | WeatherAQINow",
  description:
    "Check current weather conditions and Air Quality Index (AQI) for any US city. Real-time temperature, humidity, wind speed, and pollution levels.",
  keywords: [
    "AQI",
    "air quality index",
    "weather today",
    "air quality near me",
    "AQI map",
    "pollution levels",
    "weather and air quality",
  ],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${BASE_URL}/${locale}`])
    ),
  },
  openGraph: {
    title: "Live Weather & Air Quality Index by City | WeatherAQINow",
    description:
      "Check current weather conditions and Air Quality Index (AQI) for any US city. Real-time temperature, humidity, wind speed, and pollution levels.",
    url: BASE_URL,
    siteName: "WeatherAQINow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Weather & Air Quality Index by City | WeatherAQINow",
    description:
      "Check current weather conditions and Air Quality Index (AQI) for any US city. Real-time temperature, humidity, wind speed, and pollution levels.",
    site: "@WeatherAQINow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-7098271335538021",
  },
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
