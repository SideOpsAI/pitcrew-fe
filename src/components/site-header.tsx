"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BookNowButton } from "@/components/booking/book-now-button";
import { localeLabels, locales } from "@/lib/locales";
import type { Locale, TranslationSchema } from "@/types/content";

type SiteHeaderProps = {
  locale: Locale;
  labels: TranslationSchema["nav"];
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === `/${pathname.split("/")[1]}`) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-lg">
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
          <label className="sr-only" htmlFor="locale-switcher">
            Language
          </label>
          <select
            id="locale-switcher"
            value={locale}
            onChange={(event) => switchLocale(event.target.value)}
            className="rounded-lg border border-white/20 bg-black px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white outline-none ring-accent transition focus:ring-2"
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeLabels[item]}
              </option>
            ))}
          </select>
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
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="locale-switcher-mobile">
                Language
              </label>
              <select
                id="locale-switcher-mobile"
                value={locale}
                onChange={(event) => {
                  switchLocale(event.target.value);
                  setMenuOpen(false);
                }}
                className="w-full rounded-lg border border-white/20 bg-black px-3 py-3 text-xs font-semibold uppercase tracking-wide text-white"
              >
                {locales.map((item) => (
                  <option key={item} value={item}>
                    {localeLabels[item]}
                  </option>
                ))}
              </select>
              <BookNowButton
                label={labels.bookNow}
                className="rounded-lg bg-accent px-4 py-3 text-xs font-bold uppercase tracking-wide text-black"
                onOpen={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
