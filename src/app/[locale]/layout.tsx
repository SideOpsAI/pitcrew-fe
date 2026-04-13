import type { Metadata } from "next";

import { BookingProvider } from "@/components/booking/booking-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocaleFromParams } from "@/lib/content";
import { locales } from "@/lib/locales";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  const languages = Object.fromEntries(
    locales.map((code) => [code, `/${code}`]),
  ) as Record<string, string>;

  return {
    title: dict.meta.siteName,
    description: dict.meta.description,
    alternates: {
      canonical: `/${safeLocale}`,
      languages,
    },
    openGraph: {
      title: dict.meta.siteName,
      description: dict.meta.description,
      locale: safeLocale,
      type: "website",
      url: `/${safeLocale}`,
      siteName: dict.meta.siteName,
      images: [
        {
          url: "/pitcrew-logo.jpeg",
          width: 1280,
          height: 672,
          alt: dict.meta.siteName,
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="pointer-events-none absolute inset-0 bg-pit-grid bg-grid opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent-deep/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <BookingProvider
          locale={safeLocale}
          labels={dict.bookingModal}
          services={dict.services}
        >
          <SiteHeader locale={safeLocale} labels={dict.nav} />
          <main className="flex-1" lang={safeLocale}>
            {children}
          </main>
          <SiteFooter
            locale={safeLocale}
            nav={dict.nav}
            footer={dict.footer}
            siteName={dict.meta.siteName}
          />
        </BookingProvider>
      </div>
    </div>
  );
}
