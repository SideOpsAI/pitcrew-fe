import { notFound, redirect } from "next/navigation";

import { translations } from "@/content/translations";
import { assertLocale, defaultLocale, locales } from "@/lib/locales";
import { getSiteUrl } from "@/lib/site";
import type { Locale, PlanSlug, ServiceItem, TranslationSchema } from "@/types/content";

const legacyServiceSlugs = new Set([
  "total-vehicle-reset",
  "interior-reset",
  "exterior-reset",
  "motorcycle-detail",
  "gloss-enhancement",
  "headlight-restoration",
  "clay-bar-treatment",
  "scratch-removal",
  "engine-bay-cleaning",
  "trim-restoration",
]);

export function getDictionary(locale: Locale): TranslationSchema {
  return translations[locale];
}

export function getServiceBySlug(locale: Locale, slug: string): ServiceItem {
  const service = translations[locale].services.find((item) => item.slug === slug);

  if (!service) {
    if (legacyServiceSlugs.has(slug)) {
      redirect(`/${locale}/services`);
    }

    notFound();
  }

  return service;
}

export function getLocaleFromParams(locale: string): Locale {
  assertLocale(locale);
  return locale;
}

export function getServiceSlugs(): PlanSlug[] {
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
