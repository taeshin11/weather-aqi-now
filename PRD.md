# WeatherAQINow — PRD
# Weather, AQI & Allergy in One View

---

## Overview

**Service Name:** WeatherAQINow  
**Tagline:** Weather, Air Quality & Allergy Index — One Dashboard, Any City  
**Domain suggestion:** weatheraqinow.com (or Vercel subdomain for dev)  
**Folder:** `C:\MakingApps\260413\weather-aqi-now\`  
**GitHub Repo:** `taeshin11/weather-aqi-now` (create via `gh repo create`)  
**Deploy:** Vercel (`npx vercel --prod`)  
**Backend (if needed):** Railway free tier (for caching API responses)  

WeatherAQINow combines three datasets that users currently have to check on three separate sites: current weather, air quality index (AQI), and allergy/pollen levels. It targets health-conscious users, parents, outdoor athletes, and allergy sufferers who want a single-page view before going outside. Programmatic SEO generates pages per city, per ZIP code, and per state. All data sources are free-tier APIs with high limits.

---

## Target Users & Pain Points

| User Segment | Pain Point |
|---|---|
| Allergy sufferers | Must check 3 apps (weather, AQI, pollen) before going outside |
| Parents of asthmatic children | Want instant "is it safe to go outside?" answer |
| Outdoor runners/cyclists | Need both weather AND AQI before a morning run |
| Elderly users with respiratory issues | Poor AQI is invisible — no warning before going out |
| Pet owners | Walk timing depends on weather + pollen + heat index |

**Core user intent:** "What is the AQI in Denver today?" / "Is the air quality good in Los Angeles?" / "Pollen count Chicago today"

---

## Core Features

| ID | Feature | Priority | Status |
|---|---|---|---|
| F01 | City dashboard `/cities/[city-state]` — weather + AQI + pollen | P0 | TODO |
| F02 | ZIP code lookup `/zip/[zipcode]` — same dashboard by ZIP | P0 | TODO |
| F03 | State overview `/states/[state]` — list of cities + state-level summary | P0 | TODO |
| F04 | Homepage with IP-based geolocation suggestion + search | P0 | TODO |
| F05 | City search (client-side, from city list JSON) | P0 | TODO |
| F06 | 7-day weather forecast (Open-Meteo) | P0 | TODO |
| F07 | Hourly forecast chart (Chart.js, temp + AQI + pollen) | P1 | TODO |
| F08 | AQI color scale display (EPA standard: Good/Moderate/USG/Unhealthy/etc.) | P0 | TODO |
| F09 | Pollen level display (seasonal static data per region or Ambee free tier) | P0 | TODO |
| F10 | Health advisory text based on AQI level | P0 | TODO |
| F11 | "Outdoor Safety Score" — composite 0-100 from weather + AQI + pollen | P1 | TODO |
| F12 | Visitor counter (today + total) in footer | P0 | TODO |
| F13 | i18n (8 languages) via next-intl | P0 | TODO |
| F14 | Google Sheets webhook on every user interaction | P0 | TODO |
| F15 | Adsterra ad placements (Social Bar, Native Banner, Display) | P0 | TODO |
| F16 | Schema.org JSON-LD (WebApplication, FAQPage, BreadcrumbList) | P0 | TODO |
| F17 | Sitemap.xml + robots.txt auto-generated | P0 | TODO |
| F18 | hreflang tags for all 8 language variants | P0 | TODO |
| F19 | research_history/ folder with milestone logs | P0 | TODO |
| F20 | ISR revalidation every 1 hour for city pages | P0 | TODO |
| F21 | Wind speed, humidity, UV index, visibility display | P1 | TODO |
| F22 | Sunrise/sunset times | P1 | TODO |

---

## Tech Stack

```
Framework:        Next.js 14 (App Router, ISR — revalidate: 3600 for city pages)
Styling:          Tailwind CSS v3
Charts:           Chart.js + react-chartjs-2
i18n:             next-intl
Data - Weather:   Open-Meteo API (100% free, no key required)
Data - AQI:       OpenAQ API v3 (free, no key for basic queries)
Data - Pollen:    Ambee API free tier (500 calls/month) OR static seasonal data
Data - Geocoding: Open-Meteo geocoding API (free, no key)
Data - ZIP:       Static ZIP→city mapping JSON (free, from public datasets)
Icons:            Lucide React + custom weather SVG icons
Deployment:       Vercel (npx vercel --prod)
Repo:             GitHub (gh repo create taeshin11/weather-aqi-now --public)
Analytics:        Vercel Analytics (free)
Cache:            ISR (Next.js built-in) + Railway for extended caching if needed
```

### Environment Variables (`.env.local`)
```
NEXT_PUBLIC_GS_WEBHOOK_URL=          # Google Apps Script webhook URL
AMBEE_API_KEY=                       # Ambee pollen API (free tier, 500/month)
NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR=     # TODO: add when received
NEXT_PUBLIC_ADSTERRA_NATIVE=         # TODO: add when received
NEXT_PUBLIC_ADSTERRA_DISPLAY=        # TODO: add when received
```

---

## Data Sources (Free Only)

### 1. Open-Meteo (Weather — Completely Free, No Key)
```
Base URL: https://api.open-meteo.com/v1/forecast

Required params:
  latitude, longitude
  current=temperature_2m,relative_humidity_2m,apparent_temperature,
           precipitation,weather_code,wind_speed_10m,wind_direction_10m,
           uv_index,surface_pressure,visibility
  hourly=temperature_2m,precipitation_probability,weather_code,
         wind_speed_10m,uv_index
  daily=weather_code,temperature_2m_max,temperature_2m_min,
        precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max
  timezone=auto
  forecast_days=7

Rate limits: 10,000 API calls/day — sufficient for ISR with caching
```

**Weather code mapping:** Open-Meteo uses WMO weather codes (0-99). Create `lib/weatherCodes.ts` mapping codes to: description, icon name, background style.

### 2. OpenAQ API v3 (AQI — Free, 60 req/min)
```
Base URL: https://api.openaq.org/v3

Endpoints:
  GET /v3/locations?coordinates={lat},{lon}&radius=25000&limit=5&order_by=distance
    → Find nearest monitoring station
  GET /v3/measurements?location_id={id}&parameter=pm25&limit=1&sort=desc
    → Get latest PM2.5 reading
  GET /v3/measurements?location_id={id}&parameter=pm10&limit=1&sort=desc
    → Get latest PM10 reading
  GET /v3/measurements?location_id={id}&parameter=o3&limit=1&sort=desc
    → Ozone

AQI Calculation (EPA formula):
  Compute AQI from PM2.5, PM10, O3 readings
  Use EPA breakpoints in lib/aqiCalc.ts
  Color coding: 0-50 Green, 51-100 Yellow, 101-150 Orange, 151-200 Red, 201-300 Purple, 300+ Maroon
```

### 3. Ambee Pollen API (Free Tier: 500 calls/month)
```
Base URL: https://api.ambeedata.com/latest/pollen/by-lat-lng
Headers: x-api-key: ${AMBEE_API_KEY}
Params: lat, lng

Returns: tree_pollen, grass_pollen, weed_pollen (Low/Moderate/High/Very High)

FALLBACK (if Ambee quota exceeded):
  Use data/pollen-seasonal.json — static seasonal pollen levels by
  US region (Northeast, Southeast, Midwest, Southwest, West, Pacific Northwest)
  keyed by month. Accurate enough for informational use.
```

### 4. Open-Meteo Geocoding (Free, No Key)
```
URL: https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en
→ Returns lat/lon for city search
```

### 5. Static City Data (`data/cities.json`)
```json
{
  "cities": [
    {
      "slug": "new-york-ny",
      "name": "New York",
      "state": "New York",
      "state_slug": "new-york",
      "abbreviation": "NY",
      "lat": 40.7128,
      "lon": -74.0060,
      "population": 8336817,
      "timezone": "America/New_York"
    }
  ]
}
```
Include top 500+ US cities. Source: simplemaps.com/data/us-cities (free tier).

### 6. ZIP Code Mapping (`data/zip-to-city.json`)
```json
{
  "10001": { "city": "New York", "state": "NY", "lat": 40.7484, "lon": -73.9967 },
  "90001": { "city": "Los Angeles", "state": "CA", "lat": 33.9731, "lon": -118.2479 }
}
```
Source: Free ZIP code database (simplemaps or US Census ZCTA data). Include top 5,000 ZIPs.

### 7. Seasonal Pollen Fallback (`data/pollen-seasonal.json`)
```json
{
  "regions": {
    "northeast": {
      "months": {
        "1": { "tree": "Low", "grass": "Low", "weed": "Low" },
        "4": { "tree": "High", "grass": "Moderate", "weed": "Low" },
        "5": { "tree": "Very High", "grass": "High", "weed": "Moderate" },
        "6": { "tree": "Moderate", "grass": "Very High", "weed": "Moderate" },
        "9": { "tree": "Low", "grass": "Low", "weed": "High" }
      }
    }
  }
}
```

---

## Page Structure & SEO

### Routes

| Route | Purpose | Primary Keywords |
|---|---|---|
| `/` | Homepage + geolocation suggestion + search | "weather AQI today", "air quality near me" |
| `/cities` | City index by state | "air quality by city" |
| `/cities/[city-state]` | City dashboard | "[city] AQI today", "[city] air quality", "[city] pollen count" |
| `/zip/[zipcode]` | ZIP dashboard (redirects to city) | "[zipcode] air quality", "[zipcode] weather AQI" |
| `/states` | All states index | "air quality by state" |
| `/states/[state]` | State overview — cities + summary | "[state] air quality today" |
| `/aqi-guide` | AQI levels explained | "what is AQI", "AQI meaning" |
| `/pollen-guide` | Pollen levels guide | "pollen count meaning", "tree grass weed pollen" |
| `/sitemap.xml` | Auto-generated | — |
| `/robots.txt` | Allow all | — |

### SEO Implementation
```tsx
// generateMetadata for /cities/[city-state]:
export async function generateMetadata({ params }) {
  const city = getCityBySlug(params['city-state']);
  return {
    title: `${city.name}, ${city.abbreviation} Air Quality & Weather Today | WeatherAQINow`,
    description: `Current weather, AQI, and pollen count for ${city.name}, ${city.state}. Real-time air quality data, 7-day forecast, and health advisories.`,
    keywords: `${city.name} AQI, ${city.name} air quality, ${city.name} pollen count, ${city.name} weather today`,
    alternates: {
      canonical: `https://weatheraqinow.com/cities/${params['city-state']}`,
      languages: {
        'en': `/en/cities/${params['city-state']}`,
        'ko': `/ko/cities/${params['city-state']}`,
        'ja': `/ja/cities/${params['city-state']}`,
        'zh': `/zh/cities/${params['city-state']}`,
        'es': `/es/cities/${params['city-state']}`,
        'fr': `/fr/cities/${params['city-state']}`,
        'de': `/de/cities/${params['city-state']}`,
        'pt': `/pt/cities/${params['city-state']}`,
      }
    }
  }
}
```

### Schema.org JSON-LD
```json
// City pages — Dataset + WebPage:
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Denver, CO Air Quality Data",
  "description": "Current AQI, PM2.5, PM10, and weather conditions for Denver, Colorado",
  "url": "https://weatheraqinow.com/cities/denver-co",
  "temporalCoverage": "2025",
  "spatialCoverage": {
    "@type": "Place",
    "name": "Denver, Colorado",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "39.7392",
      "longitude": "-104.9903"
    }
  },
  "provider": {
    "@type": "Organization",
    "name": "WeatherAQINow"
  }
}

// AQI guide — FAQPage
// Homepage — WebApplication
```

### Sitemap
```ts
// Covers:
// - All city slugs (500+)
// - All ZIP codes with dedicated pages (top 1000)
// - All 50 state pages
// - Static pages: /, /aqi-guide, /pollen-guide, /cities, /states
// - All × 8 locales
// Priority: city pages = 0.8, state pages = 0.7, static = 0.9
```

---

## UI/UX Guidelines

### Color Palette (Soft Pastel — Sky/Atmosphere)
```css
--bg-primary:       #f0f9ff;   /* pale sky blue */
--bg-card:          #ffffff;
--bg-accent:        #e0f2fe;   /* light blue */
--aqi-good:         #bbf7d0;   /* green — AQI 0-50 */
--aqi-moderate:     #fef9c3;   /* yellow — AQI 51-100 */
--aqi-usg:          #fed7aa;   /* orange — AQI 101-150 */
--aqi-unhealthy:    #fecaca;   /* red — AQI 151-200 */
--aqi-very-bad:     #e9d5ff;   /* purple — AQI 201-300 */
--aqi-hazardous:    #fca5a5;   /* maroon-ish — AQI 300+ */
--pollen-low:       #d1fae5;
--pollen-mod:       #fef3c7;
--pollen-high:      #fed7aa;
--pollen-vhigh:     #fecaca;
--text-primary:     #0c4a6e;
--text-secondary:   #64748b;
```

### Dashboard Layout (City Page)
```
┌─────────────────────────────────────────┐
│  Nav: Logo | Search | Cities | States | Lang
├─────────────────────────────────────────┤
│  [City, State] — [Date] [Time]          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ WEATHER  │ │  AQI     │ │  POLLEN  ││
│  │ 72°F ☀️  │ │  42 Good │ │ Tree: Low││
│  │ Feels 70 │ │ PM2.5:8  │ │Grass: Mod││
│  │ Humidity │ │ PM10: 15 │ │Weed: Low ││
│  └──────────┘ └──────────┘ └──────────┘│
│  [Outdoor Safety Score: 85/100 ✓]       │
├─────────────────────────────────────────┤
│  [AD: Adsterra Native Banner]           │
├─────────────────────────────────────────┤
│  7-Day Forecast (mini cards)            │
│  Mon Tue Wed Thu Fri Sat Sun            │
├─────────────────────────────────────────┤
│  [Hourly Chart — temp + AQI trend]      │
├─────────────────────────────────────────┤
│  Health Advisory (based on AQI level)   │
├─────────────────────────────────────────┤
│  [AD: Adsterra Display Banner]          │
├─────────────────────────────────────────┤
│  Wind | UV | Humidity | Sunrise/Sunset  │
├─────────────────────────────────────────┤
│  Nearby Cities                          │
├─────────────────────────────────────────┤
│  Footer: Visitor counter | Disclaimer   │
└─────────────────────────────────────────┘
```

### Key UX Details
- **AQI card background color** changes dynamically based on AQI level (green→red gradient)
- **Outdoor Safety Score:** Simple composite: ((50 - AQI) / 50 × 40) + (weather_score × 40) + (pollen_score × 20) — cap at 100, min 0
- **Health advisory text:** Auto-generated from AQI level: "Good: Air quality is satisfactory. Perfect for outdoor activities." / "Unhealthy: Limit prolonged outdoor exertion. Sensitive groups should avoid outdoor activity."
- **Search bar** on homepage: type city name, show autocomplete from cities.json (client-side Fuse.js fuzzy search)
- **Weather icons:** Use SVG icons mapped from Open-Meteo WMO codes (include a comprehensive SVG sprite or use emoji as fallback)
- **Temperature toggle:** °F / °C (user preference stored in localStorage)

### Components
```
components/
  WeatherCard.tsx           — current conditions card
  AQICard.tsx               — AQI display with color background
  PollenCard.tsx            — pollen level display
  OutdoorSafetyScore.tsx    — composite score widget
  ForecastStrip.tsx         — 7-day mini forecast cards
  HourlyChart.tsx           — Chart.js hourly temperature + AQI
  HealthAdvisory.tsx        — conditional advisory text block
  WeatherDetails.tsx        — wind, UV, humidity, visibility, sunrise/sunset
  CitySearch.tsx            — Fuse.js powered search bar
  NearbyCities.tsx          — list of nearby cities with their AQI
  AQIColorScale.tsx         — visual AQI scale legend (0-500)
  PollenCalendar.tsx        — seasonal pollen calendar (monthly view)
  TemperatureToggle.tsx     — °F / °C switcher
  VisitorCounter.tsx
  LanguageSwitcher.tsx
  Breadcrumb.tsx
  SchemaLD.tsx
  AdPlaceholder.tsx
```

---

## i18n Requirements

**Languages:** en, ko, ja, zh, es, fr, de, pt

### Translation Keys
```json
{
  "nav.home": "Home",
  "nav.cities": "Cities",
  "nav.states": "States",
  "nav.aqiGuide": "AQI Guide",
  "nav.pollenGuide": "Pollen Guide",
  "hero.title": "Weather, AQI & Allergy — One View",
  "hero.searchPlaceholder": "Search city or ZIP code...",
  "hero.detectLocation": "Use My Location",
  "card.weather": "Weather",
  "card.aqi": "Air Quality Index",
  "card.pollen": "Pollen Count",
  "aqi.good": "Good",
  "aqi.moderate": "Moderate",
  "aqi.unhealthySensitive": "Unhealthy for Sensitive Groups",
  "aqi.unhealthy": "Unhealthy",
  "aqi.veryUnhealthy": "Very Unhealthy",
  "aqi.hazardous": "Hazardous",
  "pollen.low": "Low",
  "pollen.moderate": "Moderate",
  "pollen.high": "High",
  "pollen.veryHigh": "Very High",
  "pollen.tree": "Tree Pollen",
  "pollen.grass": "Grass Pollen",
  "pollen.weed": "Weed Pollen",
  "score.outdoorSafety": "Outdoor Safety Score",
  "forecast.7day": "7-Day Forecast",
  "forecast.hourly": "Hourly Forecast",
  "health.advisory": "Health Advisory",
  "weather.feelsLike": "Feels Like",
  "weather.humidity": "Humidity",
  "weather.windSpeed": "Wind Speed",
  "weather.uvIndex": "UV Index",
  "weather.visibility": "Visibility",
  "weather.sunrise": "Sunrise",
  "weather.sunset": "Sunset",
  "weather.precipitation": "Precipitation",
  "temp.fahrenheit": "°F",
  "temp.celsius": "°C",
  "footer.visitorToday": "Visitors today",
  "footer.visitorTotal": "Total visitors",
  "footer.disclaimer": "Weather and AQI data provided by Open-Meteo and OpenAQ. For health emergencies, consult official sources.",
  "footer.lastUpdated": "Last updated"
}
```

---

## Ad Integration (Adsterra)

```jsx
// app/[locale]/layout.tsx — Social Bar in <head>
// TODO: Add when key received
// <Script src={process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR} strategy="afterInteractive" />

// City/ZIP page — Native Banner (after the 3 main cards, before 7-day forecast)
<section className="container mx-auto px-4 my-6">
  <div id="adsterra-native">
    {/* TODO: Replace with Adsterra Native Banner when key received */}
    <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 text-center text-sky-300 text-sm bg-sky-50">
      [Adsterra Native Banner — weather context]
    </div>
  </div>
</section>

// Between hourly chart and health advisory — Display Banner
<div id="adsterra-display" className="my-8 flex justify-center">
  {/* TODO: Add Adsterra Display Banner when key received */}
  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-300 w-full max-w-3xl text-sm">
    [Adsterra Display — 728×90 / 320×50]
  </div>
</div>
```

---

## Google Sheets Webhook

### Tracked Events
- `page_view` — every route load (include city slug in detail)
- `city_search` — user searches for a city
- `location_detected` — geolocation used
- `temperature_toggle` — °F/°C switched
- `zip_lookup` — ZIP code page loaded
- `forecast_tab` — hourly vs daily tab toggled
- `aqi_guide_click` — AQI guide link clicked
- `language_switch`

---

## Visitor Counter

```ts
// lib/visitorCounter.ts — localStorage + Vercel KV
export async function trackVisitor(): Promise<{ today: number; total: number }> {
  if (typeof window === 'undefined') return { today: 0, total: 0 };
  const dateKey = new Date().toISOString().slice(0, 10);
  const stored = JSON.parse(localStorage.getItem('waqn_v') || '{}');
  const today = stored.date === dateKey ? stored.count + 1 : 1;
  localStorage.setItem('waqn_v', JSON.stringify({ date: dateKey, count: today }));
  const res = await fetch('/api/visitor', { method: 'POST' }).catch(() => null);
  const total = res ? (await res.json()).total : 0;
  return { today, total };
}
```

---

## Milestones

### M1 — Project Scaffold (Day 1)
**Tasks:**
- [ ] `gh repo create taeshin11/weather-aqi-now --public --clone`
- [ ] `npx create-next-app@latest . --typescript --tailwind --app`
- [ ] `npm install chart.js react-chartjs-2 next-intl lucide-react fuse.js`
- [ ] Create `feature_list.json`, `claude-progress.txt`, `init.sh`
- [ ] Create `research_history/` + `M1-scaffold.md`
- [ ] Configure Tailwind with sky blue pastel palette
- [ ] Create base `app/layout.tsx`
- [ ] Create `.env.local.example`

**Commit:** `M1: scaffold — Next.js 14, Tailwind sky palette, next-intl, fuse.js`
```bash
git add -A && git commit -m "M1: scaffold — Next.js 14, Tailwind sky palette, next-intl, fuse.js" && git push origin main
```

---

### M2 — Data Layer & API Integration (Day 2)
**Tasks:**
- [ ] Create `data/cities.json` — 500+ US cities with lat/lon
- [ ] Create `data/zip-to-city.json` — top 5,000 ZIP codes
- [ ] Create `data/pollen-seasonal.json` — regional seasonal pollen by month
- [ ] Create `lib/openmeteo.ts` — weather fetch with ISR caching
- [ ] Create `lib/openaq.ts` — AQI fetch with nearest station logic
- [ ] Create `lib/pollen.ts` — Ambee fetch with seasonal fallback
- [ ] Create `lib/weatherCodes.ts` — WMO code → description + icon mapping
- [ ] Create `lib/aqiCalc.ts` — EPA AQI calculation from raw pollutants
- [ ] Create `lib/safetyScore.ts` — composite outdoor safety score
- [ ] Create `app/api/weather/route.ts` — serves combined data
- [ ] Create `app/api/visitor/route.ts`
- [ ] Write TypeScript types: `types/weather.ts`, `types/aqi.ts`, `types/pollen.ts`
- [ ] Log to `research_history/M2-data-layer.md`

**Commit:** `M2: data layer — Open-Meteo, OpenAQ, pollen, AQI calculator, city data`
```bash
git add -A && git commit -m "M2: data layer — Open-Meteo, OpenAQ, pollen, AQI calculator, city data" && git push origin main
```

---

### M3 — City Dashboard (Day 3)
**Tasks:**
- [ ] Build `app/[locale]/cities/[city-state]/page.tsx` — city dashboard
- [ ] Build `WeatherCard.tsx`, `AQICard.tsx`, `PollenCard.tsx`
- [ ] Build `OutdoorSafetyScore.tsx`
- [ ] Build `ForecastStrip.tsx` — 7-day forecast
- [ ] Build `HourlyChart.tsx` — Chart.js temp + AQI hourly
- [ ] Build `HealthAdvisory.tsx` — dynamic text per AQI level
- [ ] Build `WeatherDetails.tsx` — secondary weather metrics
- [ ] Build `TemperatureToggle.tsx`
- [ ] Create all 8 locale message files
- [ ] Implement `LanguageSwitcher.tsx`, `VisitorCounter.tsx`
- [ ] Add Adsterra placeholder divs
- [ ] Wire Google Sheets webhook
- [ ] Log to `research_history/M3-city-dashboard.md`

**Commit:** `M3: city dashboard — weather/AQI/pollen cards, forecast, health advisory`
```bash
git add -A && git commit -m "M3: city dashboard — weather/AQI/pollen cards, forecast, health advisory" && git push origin main
```

---

### M4 — Homepage, Search & ZIP (Day 4)
**Tasks:**
- [ ] Build homepage `app/[locale]/page.tsx` with city search
- [ ] Build `CitySearch.tsx` — Fuse.js fuzzy search over cities.json
- [ ] Add IP geolocation hint (via `x-forwarded-for` header on server or `navigator.geolocation` on client)
- [ ] Build `app/[locale]/zip/[zipcode]/page.tsx` — ZIP lookup with redirect to city
- [ ] Build `NearbyCities.tsx` — list nearby cities with AQI badges
- [ ] Log to `research_history/M4-homepage-search.md`

**Commit:** `M4: homepage, city search, ZIP lookup, geolocation suggestion`
```bash
git add -A && git commit -m "M4: homepage, city search, ZIP lookup, geolocation suggestion" && git push origin main
```

---

### M5 — Programmatic SEO Pages (Day 5)
**Tasks:**
- [ ] Build `/cities` index page — all cities grouped by state
- [ ] Build `/states` index page
- [ ] Build `/states/[state]` — state overview with city list + avg AQI
- [ ] Build `/aqi-guide` — AQI levels explained
- [ ] Build `/pollen-guide` — pollen types + seasonal calendar
- [ ] Add `generateMetadata()` + hreflang to all pages
- [ ] Add Schema.org JSON-LD (Dataset, FAQPage, BreadcrumbList)
- [ ] Generate `app/sitemap.ts` + `app/robots.ts`
- [ ] Log to `research_history/M5-seo-pages.md`

**Commit:** `M5: programmatic SEO — states, guides, sitemap, schema, hreflang`
```bash
git add -A && git commit -m "M5: programmatic SEO — states, guides, sitemap, schema, hreflang" && git push origin main
```

---

### M6 — Deploy & QA (Day 6)
**Tasks:**
- [ ] `npx vercel --prod`
- [ ] Verify Open-Meteo data loads on city pages (ISR working)
- [ ] Verify OpenAQ data loads (may show "data unavailable" if no station nearby)
- [ ] Verify pollen fallback works when Ambee quota exceeded
- [ ] Test city search on homepage
- [ ] Verify ZIP lookup redirects correctly
- [ ] Verify sitemap.xml (500+ city URLs)
- [ ] Validate Schema.org
- [ ] Test all 8 locales
- [ ] Verify visitor counter + Google Sheets webhook
- [ ] Lighthouse audit: aim > 80 (ISR data may affect LCP)
- [ ] Log to `research_history/M6-deploy.md`

**Commit:** `M6: production deploy — Vercel ISR, QA complete`
```bash
git add -A && git commit -m "M6: production deploy — Vercel ISR, QA complete" && git push origin main
```

---

## File Structure

```
weather-aqi-now/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Homepage + search
│   │   ├── cities/
│   │   │   ├── page.tsx                # Cities index
│   │   │   └── [city-state]/
│   │   │       └── page.tsx            # City dashboard (ISR: revalidate 3600)
│   │   ├── zip/
│   │   │   └── [zipcode]/
│   │   │       └── page.tsx            # ZIP lookup → redirect or display
│   │   ├── states/
│   │   │   ├── page.tsx
│   │   │   └── [state]/
│   │   │       └── page.tsx
│   │   ├── aqi-guide/
│   │   │   └── page.tsx
│   │   └── pollen-guide/
│   │       └── page.tsx
│   ├── api/
│   │   ├── weather/
│   │   │   └── route.ts               # Combined weather+AQI+pollen
│   │   └── visitor/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── WeatherCard.tsx
│   ├── AQICard.tsx
│   ├── PollenCard.tsx
│   ├── OutdoorSafetyScore.tsx
│   ├── ForecastStrip.tsx
│   ├── HourlyChart.tsx
│   ├── HealthAdvisory.tsx
│   ├── WeatherDetails.tsx
│   ├── CitySearch.tsx
│   ├── NearbyCities.tsx
│   ├── AQIColorScale.tsx
│   ├── PollenCalendar.tsx
│   ├── TemperatureToggle.tsx
│   ├── VisitorCounter.tsx
│   ├── LanguageSwitcher.tsx
│   ├── Breadcrumb.tsx
│   ├── SchemaLD.tsx
│   └── ads/
│       ├── AdsterraSocialBar.tsx
│       ├── AdsterraNativeBanner.tsx
│       └── AdsterraDisplay.tsx
├── lib/
│   ├── openmeteo.ts
│   ├── openaq.ts
│   ├── pollen.ts
│   ├── weatherCodes.ts
│   ├── aqiCalc.ts
│   ├── safetyScore.ts
│   ├── geoUtils.ts                    # haversine distance, nearby city finder
│   ├── analytics.ts
│   └── visitorCounter.ts
├── types/
│   ├── weather.ts
│   ├── aqi.ts
│   └── pollen.ts
├── data/
│   ├── cities.json
│   ├── zip-to-city.json
│   └── pollen-seasonal.json
├── messages/
│   ├── en.json
│   ├── ko.json
│   ├── ja.json
│   ├── zh.json
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   └── pt.json
├── public/
│   └── weather-icons/                 # SVG weather icons
├── research_history/
│   ├── M1-scaffold.md
│   ├── M2-data-layer.md
│   ├── M3-city-dashboard.md
│   ├── M4-homepage-search.md
│   ├── M5-seo-pages.md
│   └── M6-deploy.md
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Harness Files Spec

### `feature_list.json`
```json
{
  "project": "weather-aqi-now",
  "version": "1.0.0",
  "features": [
    { "id": "F01", "name": "City dashboard", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F02", "name": "ZIP code lookup", "priority": "P0", "status": "TODO", "milestone": "M4" },
    { "id": "F03", "name": "State overview pages", "priority": "P0", "status": "TODO", "milestone": "M5" },
    { "id": "F04", "name": "Homepage with search", "priority": "P0", "status": "TODO", "milestone": "M4" },
    { "id": "F05", "name": "City search (Fuse.js)", "priority": "P0", "status": "TODO", "milestone": "M4" },
    { "id": "F06", "name": "7-day forecast", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F07", "name": "Hourly forecast chart", "priority": "P1", "status": "TODO", "milestone": "M3" },
    { "id": "F08", "name": "AQI color scale", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F09", "name": "Pollen display", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F10", "name": "Health advisory text", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F11", "name": "Outdoor Safety Score", "priority": "P1", "status": "TODO", "milestone": "M3" },
    { "id": "F12", "name": "Visitor counter", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F13", "name": "i18n 8 languages", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F14", "name": "Google Sheets webhook", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F15", "name": "Adsterra ads", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F16", "name": "Schema.org JSON-LD", "priority": "P0", "status": "TODO", "milestone": "M5" },
    { "id": "F17", "name": "Sitemap + robots.txt", "priority": "P0", "status": "TODO", "milestone": "M5" },
    { "id": "F18", "name": "hreflang tags", "priority": "P0", "status": "TODO", "milestone": "M5" },
    { "id": "F19", "name": "research_history logs", "priority": "P0", "status": "TODO", "milestone": "M1" },
    { "id": "F20", "name": "ISR revalidation 1hr", "priority": "P0", "status": "TODO", "milestone": "M3" },
    { "id": "F21", "name": "Wind/UV/humidity/visibility", "priority": "P1", "status": "TODO", "milestone": "M3" },
    { "id": "F22", "name": "Sunrise/sunset", "priority": "P1", "status": "TODO", "milestone": "M3" }
  ]
}
```

### `claude-progress.txt`
```
# WeatherAQINow — Claude Progress Log
# Format: [TIMESTAMP] [MILESTONE] [STATUS] [NOTES]
# Statuses: STARTED | IN_PROGRESS | COMPLETE | BLOCKED

[START] Project initialized
```

### `init.sh`
```bash
#!/usr/bin/env bash
set -e

echo "=== WeatherAQINow Init Script ==="

gh repo create taeshin11/weather-aqi-now --public --clone || echo "Repo may already exist"
npm install
cp .env.local.example .env.local || true
mkdir -p research_history data public/weather-icons

git add -A
git commit -m "M1: scaffold — Next.js 14, Tailwind sky palette, next-intl, fuse.js" || true
git push origin main || true

echo "=== Init complete ==="
echo "Steps:"
echo "  1. Register at ambeedata.com for free pollen API key (optional)"
echo "  2. Deploy Google Apps Script webhook, add URL to .env.local"
echo "  3. Run: npx vercel --prod"
```

---

## Additional Notes for Claude Code

1. **Open-Meteo WMO code mapping (critical — must include all codes):**
   ```ts
   const WMO_CODES: Record<number, { label: string; icon: string; bg: string }> = {
     0: { label: 'Clear sky', icon: 'sun', bg: '#fef9c3' },
     1: { label: 'Mainly clear', icon: 'sun-cloud', bg: '#fef9c3' },
     2: { label: 'Partly cloudy', icon: 'cloud-sun', bg: '#f0f9ff' },
     3: { label: 'Overcast', icon: 'cloud', bg: '#f1f5f9' },
     45: { label: 'Foggy', icon: 'cloud-fog', bg: '#f8fafc' },
     51: { label: 'Light drizzle', icon: 'cloud-drizzle', bg: '#dbeafe' },
     61: { label: 'Slight rain', icon: 'cloud-rain', bg: '#dbeafe' },
     71: { label: 'Slight snow', icon: 'cloud-snow', bg: '#eff6ff' },
     80: { label: 'Rain showers', icon: 'cloud-rain', bg: '#dbeafe' },
     95: { label: 'Thunderstorm', icon: 'cloud-lightning', bg: '#e0e7ff' },
   };
   // Add all relevant codes 0-99
   ```

2. **AQI calculation (EPA linear interpolation formula):**
   ```ts
   function calcAQI(Cp: number, breakpoints: AQIBreakpoint[]): number {
     const bp = breakpoints.find(b => Cp >= b.Clo && Cp <= b.Chi);
     if (!bp) return 500;
     return Math.round(((bp.Ihi - bp.Ilo) / (bp.Chi - bp.Clo)) * (Cp - bp.Clo) + bp.Ilo);
   }
   // PM2.5 breakpoints (24-hr avg): 0-12 (Good), 12.1-35.4 (Moderate), 35.5-55.4 (USG), 55.5-150.4 (Unhealthy), 150.5-250.4 (Very Unhealthy), 250.5+ (Hazardous)
   ```

3. **ISR configuration for city pages:**
   ```ts
   export const revalidate = 3600; // Revalidate every hour
   // In Next.js App Router, add this export to each city page
   ```

4. **OpenAQ data may be sparse for some cities.** Always implement a graceful fallback: if no station found within 25km, show "AQI data unavailable for this location" with a link to EPA AirNow.

5. **Nearby cities algorithm:**
   ```ts
   // Use haversine formula to find cities within 100km of the current city
   // Sort by distance, return top 5
   function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
     const R = 3959; // miles
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLon = (lon2 - lon1) * Math.PI / 180;
     const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
     return 2 * R * Math.asin(Math.sqrt(a));
   }
   ```

6. **City slug format:** `{city-name}-{state-abbreviation}` all lowercase, spaces→hyphens. E.g., `new-york-ny`, `los-angeles-ca`, `salt-lake-city-ut`.

7. **Temperature display:** Default to °F for US users (detect from browser locale). Store preference in localStorage. Toggle button must be accessible (keyboard navigable).
