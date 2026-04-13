import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type Locale = "en" | "ko" | "ja" | "zh" | "es" | "fr" | "de" | "pt";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar locale={locale} messages={messages as Record<string, string>} />
      <main className="flex-1 min-h-screen" style={{ backgroundColor: "#f0f9ff" }}>
        {children}
      </main>
      <Footer messages={messages as Record<string, string>} />
    </NextIntlClientProvider>
  );
}
