import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WeatherAQINow — Real-Time Weather & AQI for US Cities",
  description:
    "Learn about WeatherAQINow: real-time weather conditions and Air Quality Index data for cities across the USA. Data sourced from OpenWeatherMap and EPA AirNow.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const features = [
    {
      icon: "🌡️",
      title: "Temperature",
      desc: "Current temperature in Fahrenheit and Celsius, with daily high/low ranges for every city.",
    },
    {
      icon: "💧",
      title: "Humidity",
      desc: "Relative humidity percentage helping you understand how the air feels and its effect on comfort.",
    },
    {
      icon: "💨",
      title: "Wind Speed & Direction",
      desc: "Real-time wind data including speed in mph and compass direction so you know what's blowing in.",
    },
    {
      icon: "🌫️",
      title: "Air Quality Index (AQI)",
      desc: "EPA-standard AQI scores updated frequently, covering PM2.5, PM10, ozone, NO₂, SO₂, and CO.",
    },
    {
      icon: "🩺",
      title: "Health Advisories",
      desc: "Color-coded health recommendations based on current AQI levels — from Good to Hazardous.",
    },
    {
      icon: "🌿",
      title: "Allergy & Pollen Index",
      desc: "Tree, grass, and weed pollen levels alongside air quality so allergy sufferers can plan ahead.",
    },
  ];

  const dataSources = [
    {
      name: "OpenWeatherMap",
      desc: "Provides current temperature, humidity, wind speed, and general weather conditions updated every hour.",
    },
    {
      name: "EPA AirNow",
      desc: "The US Environmental Protection Agency's official AQI data feed, reporting on six major pollutants across thousands of monitoring stations nationwide.",
    },
    {
      name: "Open-Meteo",
      desc: "Open-source weather API offering high-resolution forecasts as a supplemental data source for weather conditions.",
    },
    {
      name: "OpenAQ",
      desc: "Global open air quality data platform aggregating real-time readings from government and research-grade monitoring sensors.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-sky-900 mb-3">
          About WeatherAQINow
        </h1>
        <p className="text-sky-600 text-lg leading-relaxed">
          Real-time weather conditions and Air Quality Index data for cities
          across the United States — all in one clean, easy-to-read dashboard.
        </p>
      </div>

      {/* Mission */}
      <section className="card">
        <h2 className="text-2xl font-bold text-sky-900 mb-4">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          WeatherAQINow was built with one goal: make it simple for anyone to
          check both the weather and air quality for their city — or any city
          they are planning to visit — without digging through multiple apps or
          government websites.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Air quality is just as important as temperature when deciding whether
          to go for a morning run, let your kids play outside, or open the
          windows at home. We bring that information front and center alongside
          traditional weather data.
        </p>
      </section>

      {/* Why AQI Matters */}
      <section>
        <h2 className="text-2xl font-bold text-sky-900 mb-6">
          Why Air Quality Index (AQI) Matters
        </h2>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-sky-800 mb-2">
              AQI and Your Health
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Air Quality Index is a standardized scale developed by the US
              EPA to communicate how clean or polluted the outdoor air is. AQI
              values range from 0 to 500. The higher the number, the greater
              the level of air pollution and the greater the health concern.
              Prolonged exposure to poor air quality has been linked to
              respiratory illness, cardiovascular disease, and reduced lung
              function.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-sky-800 mb-2">
              Who Is Most at Risk?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Children, the elderly, pregnant women, and people with asthma,
              heart disease, or other respiratory conditions are particularly
              sensitive to air pollution. Even healthy adults can experience
              irritation of the eyes, nose, and throat when AQI levels are
              elevated. Knowing the AQI before you head outdoors helps you make
              informed decisions about when and where to exercise or spend time
              outside.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-sky-800 mb-2">
              Pollutants We Track
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our AQI readings cover the six criteria pollutants defined by the
              EPA: fine particulate matter (PM2.5), coarse particulate matter
              (PM10), ground-level ozone (O₃), nitrogen dioxide (NO₂), sulfur
              dioxide (SO₂), and carbon monoxide (CO). The overall AQI shown
              for a city reflects whichever pollutant is at its highest level
              at that moment.
            </p>
          </div>
        </div>
      </section>

      {/* What the Site Offers */}
      <section>
        <h2 className="text-2xl font-bold text-sky-900 mb-6">
          What WeatherAQINow Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card flex gap-4 items-start">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-sky-800 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section>
        <h2 className="text-2xl font-bold text-sky-900 mb-6">Our Data Sources</h2>
        <div className="space-y-4">
          {dataSources.map((s) => (
            <div key={s.name} className="card">
              <h3 className="font-semibold text-sky-800 mb-1">{s.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">Coverage</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          WeatherAQINow currently covers 60+ cities across the United States,
          spanning all major metropolitan areas and regions. We are continuously
          expanding our city list. Data is refreshed frequently to ensure you
          always see current conditions. All times are displayed in the local
          time zone of the selected city.
        </p>
      </section>
    </div>
  );
}
