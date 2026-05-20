import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return locale === "id"
    ? {
        title: "ScamLens - Cek Dulu Sebelum Kena Tipu",
        description:
          "Aplikasi deteksi penipuan dan scam bertenaga AI untuk masyarakat Indonesia",
      }
    : {
        title: "ScamLens - Check Before You Get Scammed",
        description:
          "AI-powered scam and fraud detection app for everyone in Indonesia",
      };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "id" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
