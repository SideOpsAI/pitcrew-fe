import { notFound } from "next/navigation";

import { translations } from "@/content/translations";
import { assertLocale, defaultLocale, locales } from "@/lib/locales";
import { getSiteUrl } from "@/lib/site";
import type { Locale, ServiceItem, TranslationSchema } from "@/types/content";

export function getDictionary(locale: Locale): TranslationSchema {
  return translations[locale];
}

export function getServiceBySlug(locale: Locale, slug: string): ServiceItem {
  const service = translations[locale].services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return service;
}

export function getLocaleFromParams(locale: string): Locale {
  assertLocale(locale);
  return locale;
}

export function getServiceSlugs(): string[] {
  return translations[defaultLocale].services.map((service) => service.slug);
}

export function getLocalizedUrl(locale: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}/${locale}${normalized === "/" ? "" : normalized}`;
}

export function getAlternates(path = ""): Record<Locale, string> {
  return locales.reduce(
    (acc, locale) => {
      acc[locale] = getLocalizedUrl(locale, path);
      return acc;
    },
    {} as Record<Locale, string>,
  );
}
