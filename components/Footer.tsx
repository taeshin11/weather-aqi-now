"use client";

import { Wind } from "lucide-react";

interface FooterProps {
  messages: Record<string, string>;
}

export default function Footer({ messages }: FooterProps) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="bg-white border-t border-sky-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-sky-700 text-lg mb-3">
              <Wind className="w-5 h-5 text-sky-500" />
              <span>WeatherAQINow</span>
            </div>
            <p className="text-sm text-slate-500">
              Weather, Air Quality & Allergy Index in one dashboard. Stay informed, stay healthy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sky-700 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/en/cities" className="hover:text-sky-600 transition-colors">All Cities</a></li>
              <li><a href="/en/states" className="hover:text-sky-600 transition-colors">States</a></li>
              <li><a href="/en/aqi-guide" className="hover:text-sky-600 transition-colors">AQI Guide</a></li>
              <li><a href="/en/unhealthy" className="hover:text-sky-600 transition-colors">Unhealthy Air Cities</a></li>
              <li><a href="/en/allergy" className="hover:text-sky-600 transition-colors">Worst Allergy Cities</a></li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="font-semibold text-sky-700 mb-3">Info</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/en/about" className="hover:text-sky-600 transition-colors">About</a></li>
              <li><a href="/en/how-to-use" className="hover:text-sky-600 transition-colors">How to Use</a></li>
              <li><a href="/en/privacy" className="hover:text-sky-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/en/terms" className="hover:text-sky-600 transition-colors">Terms of Use</a></li>
            </ul>
          </div>

          {/* Visitor counter & info */}
          <div>
            <h3 className="font-semibold text-sky-700 mb-3">Site Info</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                <span>{messages["footer.lastUpdated"] || "Last updated"}: {today}</span>
              </div>
              <p className="text-xs mt-4">{messages["footer.disclaimer"] || "Weather and AQI data provided for informational purposes only."}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sky-50 text-center text-xs text-slate-400 space-y-1">
          <p>© {new Date().getFullYear()} WeatherAQINow. All rights reserved. Data sources: Open-Meteo, OpenAQ.</p>
          <p>
            Built by{' '}
            <a
              href="http://spinai.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500 transition-colors hover:underline underline-offset-2"
            >
              SPINAI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
