import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | WeatherAQINow",
  description:
    "Terms of use for WeatherAQINow. Weather and AQI data is provided for informational purposes only and is not a substitute for official weather or health advisories.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-sky-900 mb-3">Terms of Use</h1>
        <p className="text-sm text-slate-400">Last updated: April 13, 2026</p>
        <p className="text-sky-600 mt-3 leading-relaxed">
          By accessing or using WeatherAQINow at weather-aqi-now.vercel.app
          ("the Site"), you agree to the following terms. Please read them
          carefully before using the Site.
        </p>
      </div>

      {/* Informational Purpose Only */}
      <section className="card border-l-4 border-sky-400">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Informational Purposes Only
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          All weather, Air Quality Index (AQI), and related environmental data
          displayed on WeatherAQINow is provided <strong>for informational
          purposes only</strong>. The information on this Site is aggregated from
          third-party sources including OpenWeatherMap, EPA AirNow, Open-Meteo,
          and OpenAQ, and is presented as received without independent
          verification.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          WeatherAQINow is <strong>not a substitute</strong> for official
          weather forecasts, government air quality alerts, or professional
          medical, environmental, or safety advice. Data may be delayed,
          incomplete, or inaccurate due to sensor failures, network issues, or
          other technical factors outside our control.
        </p>
      </section>

      {/* Official Alerts */}
      <section className="card border-l-4 border-amber-400">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Always Follow Official Emergency Alerts
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          During severe weather events, wildfire smoke events, air quality
          emergencies, or any public health emergency, you must always follow
          guidance issued by official government authorities, including:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-3">
          <li>The National Weather Service (weather.gov)</li>
          <li>The US Environmental Protection Agency AirNow (airnow.gov)</li>
          <li>Your state and local emergency management agencies</li>
          <li>Local public health departments</li>
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed">
          Do not rely solely on WeatherAQINow data to make evacuation, shelter,
          or emergency health decisions. Official alerts are always authoritative.
        </p>
      </section>

      {/* No Health Advice */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Not Medical Advice
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The health advisories and recommendations displayed on WeatherAQINow
          are general guidelines derived from EPA AQI categories. They are not
          personalized medical advice and are not intended to diagnose, treat,
          cure, or prevent any health condition. Individuals with respiratory
          illnesses, heart disease, allergies, or other health conditions should
          consult their physician regarding appropriate precautions on high AQI
          or adverse weather days.
        </p>
      </section>

      {/* No Liability */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Limitation of Liability
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          To the fullest extent permitted by applicable law, WeatherAQINow and
          its operators shall not be liable for any direct, indirect, incidental,
          special, consequential, or punitive damages arising from:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 mb-3">
          <li>Your use of or reliance on data displayed on this Site</li>
          <li>Any health decisions made based on AQI or weather data from this Site</li>
          <li>Inaccurate, outdated, or incomplete data from our providers</li>
          <li>Site downtime, errors, or unavailability</li>
        </ul>
        <p className="text-sm text-slate-500 leading-relaxed">
          Use of this Site is entirely at your own risk. You acknowledge that
          environmental and weather conditions can change rapidly and that no
          data service can guarantee real-time accuracy at all times.
        </p>
      </section>

      {/* Intellectual Property */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Intellectual Property
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The design, layout, and original content of WeatherAQINow are the
          property of its operators. Environmental data displayed on the Site
          belongs to its respective data providers. You may not reproduce,
          redistribute, or commercially exploit the Site's content without
          explicit written permission.
        </p>
      </section>

      {/* Third-Party Links */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Third-Party Services
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          WeatherAQINow uses third-party services including Google Analytics and
          Google AdSense. These services have their own terms of service and
          privacy policies, which govern their use of data. We are not
          responsible for the practices of these third-party services.
        </p>
      </section>

      {/* Changes */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">
          Changes to These Terms
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          We reserve the right to update these Terms of Use at any time. The
          date at the top of this page will be updated to reflect the most recent
          revision. Continued use of the Site after changes are posted
          constitutes your acceptance of the revised Terms.
        </p>
      </section>

      {/* Governing Law */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">Governing Law</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          These Terms of Use shall be governed by and construed in accordance
          with the laws of the United States. Any disputes arising from use of
          this Site shall be resolved through good-faith negotiation before
          pursuing other remedies.
        </p>
      </section>
    </div>
  );
}
