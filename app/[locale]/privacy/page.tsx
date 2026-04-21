import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WeatherAQINow",
  description:
    "WeatherAQINow privacy policy: learn how we handle location data, analytics, and advertising on our weather and AQI platform.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Location / City Search Data",
          text: 'When you type a city name into the search bar, that search term is used solely to retrieve weather and AQI data from our third-party data providers. We do not store your search queries on our servers, and we do not associate city searches with your identity or IP address in any persistent way.',
        },
        {
          subtitle: "Device & Browser Information",
          text: "Standard web server logs may temporarily capture your IP address, browser type, operating system, referring URL, and pages visited. These logs are used for security monitoring and diagnosing technical issues and are not retained beyond 30 days.",
        },
        {
          subtitle: "Cookies",
          text: "We use cookies to remember your language preference (set via our locale selector) and to support our analytics and advertising partners as described below. You can disable cookies in your browser settings, though this may affect the functionality of certain features.",
        },
      ],
    },
    {
      title: "Analytics — Google Analytics",
      content: [
        {
          subtitle: "",
          text: "We use Google Analytics to understand how visitors interact with WeatherAQINow in aggregate. Google Analytics collects anonymized data such as pages viewed, session duration, geographic region (country/city level), and device type. This information helps us improve the site. Google Analytics data is processed under Google's privacy policies, and we have enabled IP anonymization. You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on available at tools.google.com/dlpage/gaoptout.",
        },
      ],
    },
    {
      title: "Advertising — Google AdSense",
      content: [
        {
          subtitle: "",
          text: "WeatherAQINow displays advertisements served by Google AdSense. Google may use cookies and similar technologies to serve ads based on your prior visits to this site and other sites on the internet. You can opt out of personalized advertising by visiting Google's Ad Settings at adssettings.google.com, or by visiting aboutads.info. Our AdSense publisher ID is ca-pub-7098271335538021.",
        },
      ],
    },
    {
      title: "Third-Party Data Providers",
      content: [
        {
          subtitle: "",
          text: "To display weather and AQI data, we make server-side requests to OpenWeatherMap, EPA AirNow, Open-Meteo, and OpenAQ. These requests include a city or geographic coordinate query and are subject to those providers' own privacy and terms of service policies. We do not share any personally identifiable information with these providers.",
        },
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        {
          subtitle: "",
          text: "WeatherAQINow is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information through our site, please contact us so we can delete it.",
        },
      ],
    },
    {
      title: "Data Retention & Security",
      content: [
        {
          subtitle: "",
          text: "We retain server log data for no more than 30 days. Analytics data retained by Google is governed by Google's own data retention policies. We implement reasonable technical measures to protect our website from unauthorized access, though no internet transmission is completely secure.",
        },
      ],
    },
    {
      title: "Your Rights",
      content: [
        {
          subtitle: "",
          text: "Depending on your jurisdiction, you may have the right to access, correct, or delete personal data we hold about you. Because we collect very little personally identifiable information, most requests can be fulfilled by clearing your browser cookies and opting out of Google Analytics and AdSense personalization as described above.",
        },
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        {
          subtitle: "",
          text: "We may update this Privacy Policy from time to time. The date at the top of the page will reflect the most recent revision. Continued use of WeatherAQINow after changes are posted constitutes your acceptance of those changes.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-sky-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Last updated: April 13, 2026</p>
        <p className="text-sky-600 mt-3 leading-relaxed">
          WeatherAQINow ("we", "our", or "us") is committed to protecting your
          privacy. This policy explains what information we collect when you
          visit weather-aqi-now.vercel.app, how we use it, and what choices you
          have.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title} className="card space-y-4">
          <h2 className="text-xl font-bold text-sky-900">{section.title}</h2>
          {section.content.map((item, i) => (
            <div key={i}>
              {item.subtitle && (
                <h3 className="font-semibold text-sky-800 mb-1">{item.subtitle}</h3>
              )}
              <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>
      ))}

      {/* Contact */}
      <section className="card">
        <h2 className="text-xl font-bold text-sky-900 mb-3">Contact</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          If you have questions about this Privacy Policy, please reach out
          through the contact information listed on our site. We will do our
          best to respond within a reasonable timeframe.
        </p>
      </section>
    </div>
  );
}
