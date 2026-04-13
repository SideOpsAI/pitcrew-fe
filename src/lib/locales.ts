import { notFound } from "next/navigation";

import type { Locale } from "@/types/content";

export const locales = [
  "en",
  "es",
  "pt-BR",
  "it",
  "zh-CN",
  "de",
] as const satisfies readonly Locale[];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  "pt-BR": "Português (Brasil)",
  it: "Italiano",
  "zh-CN": "简体中文",
  de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function assertLocale(value: string): asserts value is Locale {
  if (!isLocale(value)) {
    notFound();
  }
}
