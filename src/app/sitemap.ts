import type { MetadataRoute } from "next";

import { translations } from "@/content/translations";
import { defaultLocale, locales } from "@/lib/locales";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const pages = locales.flatMap((locale) => {
    const basePages = [
      `/${locale}`,
      `/${locale}/services`,
      `/${locale}/contact`,
    ];

    const servicePages = translations[defaultLocale].services.map(
      (service) => `/${locale}/services/${service.slug}`,
    );

    return [...basePages, ...servicePages];
  });

  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path.endsWith("contact") ? 0.8 : 0.9,
  }));
}
