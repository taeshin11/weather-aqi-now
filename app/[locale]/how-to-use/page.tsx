import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use WeatherAQINow — AQI Scale & FAQ",
  description:
    "Learn how to use WeatherAQINow to check weather and AQI for any US city. Understand the AQI scale from Good to Hazardous, and find answers to common air quality questions.",
};

const aqiLevels = [
  {
    range: "0–50",
    label: "Good",
    bg: "#bbf7d0",
    text: "#166534",
    desc: "Air quality is satisfactory and poses little or no health risk. Enjoy outdoor activities.",
  },
  {
    range: "51–100",
    label: "Moderate",
    bg: "#fef9c3",
    text: "#854d0e",
    desc: "Air quality is acceptable. Unusually sensitive individuals may experience minor symptoms.",
  },
  {
    range: "101–150",
    label: "Unhealthy for Sensitive Groups",
    bg: "#fed7aa",
    text: "#9a3412",
    desc: "Children, elderly, and people with respiratory or heart conditions should limit prolonged outdoor exertion.",
  },
  {
    range: "151–200",
    label: "Unhealthy",
    bg: "#fecaca",
    text: "#991b1b",
    desc: "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion.",
  },
  {
    range: "201–300",
    label: "Very Unhealthy",
    bg: "#e9d5ff",
    text: "#6b21a8",
    desc: "Health alert: everyone may experience more serious health effects. Avoid prolonged outdoor activity.",
  },
  {
    range: "301+",
    label: "Hazardous",
    bg: "#fecdd3",
    text: "#881337",
    desc: "Health warnings of emergency conditions. The entire population is likely to be affected. Stay indoors.",
  },
];

const faqs = [
  {
    q: "What is AQI?",
    a: "The Air Quality Index (AQI) is a standardized scale developed by the US Environmental Protection Agency (EPA) to report daily air quality. It tells you how clean or polluted the air is and what associated health effects might be of concern. The AQI runs from 0 to 500; higher values mean more pollution and greater health risk.",
  },
  {
    q: "What pollutants affect AQI?",
    a: "The AQI is calculated based on six key pollutants regulated by the Clean Air Act: ground-level ozone (O₃), fine particulate matter (PM2.5), coarse particulate matter (PM10), carbon monoxide (CO), sulfur dioxide (SO₂), and nitrogen dioxide (NO₂). The overall AQI displayed for a city reflects the highest individual pollutant AQI at that time.",
  },
  {
    q: "Is AQI updated in real-time?",
    a: "Our AQI data is updated frequently — typically every hour — pulling from official monitoring networks including EPA AirNow sensors located across the United States. Readings may have a short propagation delay from the time they are measured at the sensor to when they appear on our site.",
  },
  {
    q: "What should I do on high AQI days?",
    a: "On days with AQI above 100, sensitive groups should reduce outdoor activity. When AQI exceeds 150, everyone should limit prolonged outdoor exertion. Above 200, stay indoors with windows closed if possible and use air purifiers. Always follow guidance issued by your local health department during air quality alerts.",
  },
  {
    q: "What weather data do you show?",
    a: "For each city we display current temperature (°F/°C), relative humidity (%), wind speed (mph) and direction, and a general weather condition description. These readings come from OpenWeatherMap and Open-Meteo APIs.",
  },
  {
    q: "How accurate is the data?",
    a: "Weather and AQI data accuracy depends on the quality and proximity of monitoring stations to the city center. In densely monitored areas like major US cities, readings are generally very accurate. In less monitored regions, figures may be interpolated from the nearest station. We always display data as sourced from our providers without modification.",
  },
  {
    q: "Can I get alerts for bad air quality?",
    a: "WeatherAQINow does not currently offer push alerts. For official air quality alerts, we recommend signing up for AirNow email notifications at airnow.gov, or enabling air quality notifications in your device's native weather or health app.",
  },
  {
    q: "What causes high AQI in cities?",
    a: "Urban AQI is elevated by a combination of factors: vehicle exhaust and traffic congestion, industrial emissions, power plant output, construction dust, wildfire smoke, and weather conditions like temperature inversions that trap pollutants close to the ground. Summer heat and stagnant air can worsen ozone levels, while wildfires dramatically spike particulate matter readings.",
  },
];

export default async function HowToUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-sky-900 mb-3">
            How to Use WeatherAQINow
          </h1>
          <p className="text-sky-600 text-lg leading-relaxed">
            Everything you need to check weather and air quality for any US
            city — and understand what the numbers mean for your health.
          </p>
        </div>

        {/* Step-by-step */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            Getting Started
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Search for Your City",
                desc: 'Use the search bar at the top of the homepage to type the name of any US city. Results appear instantly as you type. Click on a city to open its full weather and AQI dashboard.',
              },
              {
                step: "2",
                title: "Read the AQI Score",
                desc: 'The AQI number and color badge shows at a glance how clean or polluted the air is right now. Green means Good, yellow Moderate, orange Unhealthy for Sensitive Groups, red Unhealthy, purple Very Unhealthy, and maroon Hazardous.',
              },
              {
                step: "3",
                title: "Check the Health Advisory",
                desc: 'Below the AQI score you will see a plain-English health recommendation — for example "Sensitive groups should limit outdoor activity." Use this to decide whether to adjust your plans.',
              },
              {
                step: "4",
                title: "Review Weather Conditions",
                desc: 'Temperature, humidity, and wind data sit alongside the AQI so you can see the full picture. High humidity combined with high AQI can amplify discomfort, especially for respiratory conditions.',
              },
              {
                step: "5",
                title: "Browse by State",
                desc: 'Use the States page to quickly see all tracked cities within a state, useful for travellers or people managing health conditions who want to compare conditions across a region.',
              },
            ].map((item) => (
              <div key={item.step} className="card flex gap-5 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-600 text-white font-bold text-lg flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-sky-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AQI Scale */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            AQI Scale — What Each Level Means
          </h2>
          <div className="space-y-3">
            {aqiLevels.map((level) => (
              <div
                key={level.label}
                className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ backgroundColor: level.bg, borderColor: level.bg }}
              >
                <div
                  className="flex-shrink-0 text-sm font-bold px-3 py-1 rounded-lg bg-white/50 w-fit"
                  style={{ color: level.text }}
                >
                  {level.range}
                </div>
                <div className="flex-shrink-0 font-bold text-base" style={{ color: level.text }}>
                  {level.label}
                </div>
                <p className="text-sm" style={{ color: level.text }}>
                  {level.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card">
                <h3 className="font-semibold text-sky-800 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
