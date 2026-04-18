"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BookNowButton } from "@/components/booking/book-now-button";
import { locales } from "@/lib/locales";
import type { Locale, TranslationSchema } from "@/types/content";

type SiteHeaderProps = {
  locale: Locale;
  labels: TranslationSchema["nav"];
};

type LocaleCard = {
  countryName: string;
  primaryLanguage: string;
  flagSrc: string;
};

const localeFlags: Record<Locale, string> = {
  en: "/flags/us.svg",
  es: "/flags/co.svg",
  "pt-BR": "/flags/br.svg",
  it: "/flags/it.svg",
  "zh-CN": "/flags/cn.svg",
  de: "/flags/de.svg",
};

const localeCardsByUiLocale: Record<Locale, Record<Locale, Omit<LocaleCard, "flagSrc">>> = {
  en: {
    en: { countryName: "United States", primaryLanguage: "English" },
    es: { countryName: "Colombia", primaryLanguage: "Español" },
    "pt-BR": { countryName: "Brazil", primaryLanguage: "Portugues" },
    it: { countryName: "Italy", primaryLanguage: "Italiano" },
    "zh-CN": { countryName: "China", primaryLanguage: "Chinese" },
    de: { countryName: "Germany", primaryLanguage: "Deutsch" },
  },
  es: {
    en: { countryName: "Estados Unidos", primaryLanguage: "Ingles" },
    es: { countryName: "Colombia", primaryLanguage: "Español" },
    "pt-BR": { countryName: "Brasil", primaryLanguage: "Portugues" },
    it: { countryName: "Italia", primaryLanguage: "Italiano" },
    "zh-CN": { countryName: "China", primaryLanguage: "Chino" },
    de: { countryName: "Alemania", primaryLanguage: "Aleman" },
  },
  "pt-BR": {
    en: { countryName: "Estados Unidos", primaryLanguage: "Ingles" },
    es: { countryName: "Colombia", primaryLanguage: "Español" },
    "pt-BR": { countryName: "Brasil", primaryLanguage: "Portugues" },
    it: { countryName: "Italia", primaryLanguage: "Italiano" },
    "zh-CN": { countryName: "China", primaryLanguage: "Chines" },
    de: { countryName: "Alemanha", primaryLanguage: "Alemao" },
  },
  it: {
    en: { countryName: "Stati Uniti", primaryLanguage: "Inglese" },
    es: { countryName: "Colombia", primaryLanguage: "Spagnolo" },
    "pt-BR": { countryName: "Brasile", primaryLanguage: "Portoghese" },
    it: { countryName: "Italia", primaryLanguage: "Italiano" },
    "zh-CN": { countryName: "Cina", primaryLanguage: "Cinese" },
    de: { countryName: "Germania", primaryLanguage: "Tedesco" },
  },
  "zh-CN": {
    en: { countryName: "Meiguo", primaryLanguage: "Yingyu" },
    es: { countryName: "Gelunbiya", primaryLanguage: "Xibanyayu" },
    "pt-BR": { countryName: "Baxi", primaryLanguage: "Putaoyaoyu" },
    it: { countryName: "Yidali", primaryLanguage: "Yidaliyu" },
    "zh-CN": { countryName: "Zhongguo", primaryLanguage: "Zhongwen" },
    de: { countryName: "Deguo", primaryLanguage: "Deyu" },
  },
  de: {
    en: { countryName: "Vereinigte Staaten", primaryLanguage: "Englisch" },
    es: { countryName: "Kolumbien", primaryLanguage: "Spanisch" },
    "pt-BR": { countryName: "Brasilien", primaryLanguage: "Portugiesisch" },
    it: { countryName: "Italien", primaryLanguage: "Italienisch" },
    "zh-CN": { countryName: "China", primaryLanguage: "Chinesisch" },
    de: { countryName: "Deutschland", primaryLanguage: "Deutsch" },
  },
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === `/${pathname.split("/")[1]}`) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type LocalePickerProps = {
  locale: Locale;
  id: string;
  mobile?: boolean;
  onSelect: (nextLocale: string) => void;
  onAfterSelect?: () => void;
};

function LocalePicker({
  locale,
  id,
  mobile = false,
  onSelect,
  onAfterSelect,
}: LocalePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = {
    ...localeCardsByUiLocale[locale][locale],
    flagSrc: localeFlags[locale],
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`group w-full rounded-lg border border-white/20 bg-black/90 px-3 text-left outline-none ring-accent transition hover:border-white/35 focus:ring-2 ${
          mobile ? "h-12" : "h-10 min-w-[220px]"
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-4 w-6 overflow-hidden rounded-sm border border-white/25">
              <Image src={selected.flagSrc} alt={selected.countryName} width={24} height={16} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-medium text-violet-300">
                {selected.countryName}
              </span>
              <span className="block truncate text-sm font-semibold text-white">
                {selected.primaryLanguage}
              </span>
            </span>
          </span>
          <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 shrink-0 text-white/75 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-labelledby={id}
          className={`absolute z-[70] mt-2 overflow-hidden rounded-xl border border-white/15 bg-[#05070c] shadow-2xl ${
            mobile ? "left-0 right-0" : "right-0 w-[320px]"
          }`}
        >
          {locales.map((item) => {
            const option = {
              ...localeCardsByUiLocale[locale][item],
              flagSrc: localeFlags[item],
            };
            const active = item === locale;

            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                  onAfterSelect?.();
                }}
                className={`flex w-full items-start gap-3 border-b border-white/10 px-4 py-3 text-left transition last:border-b-0 ${
                  active ? "bg-accent/10" : "hover:bg-white/5"
                }`}
              >
                <span className="mt-0.5 inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-sm border border-white/25">
                  <Image src={option.flagSrc} alt={option.countryName} width={24} height={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium text-violet-300">
                    {option.countryName}
                  </span>
                  <span className={`mt-0.5 block text-sm font-semibold ${active ? "text-accent" : "text-white"}`}>
                    {option.primaryLanguage}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader({ locale, labels }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { href: `/${locale}`, label: labels.home },
      { href: `/${locale}/services`, label: labels.services },
    ],
    [labels.home, labels.services, locale],
  );

  const switchLocale = (nextLocale: string) => {
    if (!pathname) {
      router.push(`/${nextLocale}`);
      return;
    }

    const chunks = pathname.split("/").filter(Boolean);

    if (chunks.length === 0) {
      router.push(`/${nextLocale}`);
      return;
    }

    chunks[0] = nextLocale;
    router.push(`/${chunks.join("/")}`);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-lg">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center" prefetch>
          <Image
            src="/pitcrew-logo.jpeg"
            alt="Pit Crew Mobile Auto Detailing"
            width={260}
            height={68}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold uppercase tracking-wider transition ${
                  active ? "text-accent" : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocalePicker id="locale-switcher" locale={locale} onSelect={switchLocale} />
          <BookNowButton
            label={labels.bookNow}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-black transition hover:bg-white"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="font-heading text-lg">{menuOpen ? "X" : "="}</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-black/95 lg:hidden">
          <div className="section-shell flex flex-col gap-3 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid gap-3">
              <LocalePicker
                id="locale-switcher-mobile"
                locale={locale}
                mobile
                onSelect={switchLocale}
                onAfterSelect={() => setMenuOpen(false)}
              />
              <BookNowButton
                label={labels.bookNow}
                className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white"
                onOpen={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
