import { getMessages } from "next-intl/server";
import aqiGuide from "../../../data/aqi-guide-fallback.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AQI Guide — Air Quality Index Explained | WeatherAQINow",
  description: "Learn what AQI means, how it's calculated, and what each level means for your health. Complete guide to the Air Quality Index.",
};

export default async function AQIGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await getMessages()) as Record<string, string>;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: aqiGuide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-sky-900 mb-2">
            {messages["aqiGuide.title"] || "AQI Guide — Air Quality Explained"}
          </h1>
          <p className="text-sky-600">
            {messages["aqiGuide.subtitle"] || "Understanding the Air Quality Index and what it means for your health"}
          </p>
        </div>

        {/* AQI Levels */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">AQI Levels & Health Implications</h2>
          <div className="space-y-4">
            {aqiGuide.levels.map((level) => (
              <div
                key={level.category}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: level.color, borderColor: level.color }}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-2xl font-bold px-3 py-1 rounded-lg bg-white/50"
                        style={{ color: level.textColor }}
                      >
                        {level.range}
                      </span>
                      <h3 className="text-xl font-bold" style={{ color: level.textColor }}>
                        {level.category}
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: level.textColor }}>
                      {level.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/40 rounded-xl p-3">
                    <div className="text-xs font-semibold mb-1" style={{ color: level.textColor }}>Health Implications</div>
                    <p className="text-xs" style={{ color: level.textColor }}>{level.healthImplications}</p>
                  </div>
                  <div className="bg-white/40 rounded-xl p-3">
                    <div className="text-xs font-semibold mb-1" style={{ color: level.textColor }}>Outdoor Activity</div>
                    <p className="text-xs" style={{ color: level.textColor }}>{level.outdoorActivity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pollutants */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">Key Air Pollutants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aqiGuide.pollutants.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-sky-600">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.unit}</span>
                </div>
                <h3 className="font-semibold text-sky-800 mb-2">{p.fullName}</h3>
                <p className="text-xs text-slate-500 mb-3">{p.description}</p>
                <div className="text-xs">
                  <div className="mb-1">
                    <span className="font-medium text-slate-600">Sources: </span>
                    <span className="text-slate-400">{p.sources}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Health effects: </span>
                    <span className="text-slate-400">{p.healthEffects}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {aqiGuide.faq.map((item) => (
              <div key={item.question} className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
                <h3 className="font-semibold text-sky-800 mb-2">{item.question}</h3>
                <p className="text-sm text-slate-500">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
