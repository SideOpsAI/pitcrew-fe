import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import { getLocaleFromParams } from "@/lib/content";
import type { Locale } from "@/types/content";

type HiddenLinksPageProps = {
  params: Promise<{ locale: string }>;
};

type HiddenLinksCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  bookingLabel: string;
};

const hiddenLinksCopy: Record<Locale, HiddenLinksCopy> = {
  en: {
    eyebrow: "Quick Access",
    title: "Pit Crew Links",
    subtitle: "Pick your channel and we will help you book your detailing fast.",
    bookingLabel: "Book On Website",
  },
  es: {
    eyebrow: "Acceso Rapido",
    title: "Enlaces Pit Crew",
    subtitle: "Elige tu canal y te ayudamos a reservar tu detailing rapido.",
    bookingLabel: "Reservar En La Web",
  },
  "pt-BR": {
    eyebrow: "Acesso Rapido",
    title: "Links Pit Crew",
    subtitle: "Escolha seu canal e ajudamos voce a agendar o detailing rapidamente.",
    bookingLabel: "Agendar No Site",
  },
  it: {
    eyebrow: "Accesso Rapido",
    title: "Link Pit Crew",
    subtitle: "Scegli il canale e ti aiutiamo a prenotare velocemente il detailing.",
    bookingLabel: "Prenota Sul Sito",
  },
  "zh-CN": {
    eyebrow: "Quick Access",
    title: "Pit Crew Links",
    subtitle: "Pick your channel and we will help you book your detailing fast.",
    bookingLabel: "Book On Website",
  },
  de: {
    eyebrow: "Schnellzugriff",
    title: "Pit Crew Links",
    subtitle: "Waehle deinen Kanal und wir helfen dir schnell bei der Buchung.",
    bookingLabel: "Auf Der Website Buchen",
  },
};

const socialLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  whatsapp: "https://wa.me/16032051026?text=Hola%2C%20quiero%20reservar%20un%20detailing.",
} as const;

function SocialIcon({ kind }: { kind: "facebook" | "instagram" | "whatsapp" }) {
  if (kind === "facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M22 12.07C22 6.506 17.523 2 12 2S2 6.506 2 12.07c0 5.026 3.657 9.191 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.49-3.912 3.774-3.912 1.094 0 2.238.197 2.238.197v2.474H15.19c-1.242 0-1.63.777-1.63 1.574v1.89h2.773l-.443 2.9H13.56V22c4.78-.739 8.44-4.904 8.44-9.93Z" />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.97 1.38a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M17.47 14.38c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.62.13-.18.27-.7.88-.85 1.06-.16.18-.31.2-.58.07-.27-.13-1.12-.41-2.14-1.32-.79-.7-1.33-1.58-1.49-1.84-.16-.27-.02-.41.12-.54.12-.11.27-.29.4-.43.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.26 0 1.33.98 2.61 1.11 2.79.13.18 1.91 2.91 4.62 4.08.65.28 1.15.45 1.54.57.65.2 1.24.17 1.71.1.52-.08 1.6-.65 1.83-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.31ZM12.03 2.03a9.98 9.98 0 0 0-8.49 15.24L2 22l4.9-1.53a9.97 9.97 0 0 0 5.13 1.41h.01c5.5 0 9.98-4.47 9.99-9.97.01-5.5-4.47-9.98-10-9.98Zm0 18.14h-.01a8.14 8.14 0 0 1-4.14-1.13l-.3-.18-2.91.91.95-2.83-.2-.29a8.2 8.2 0 1 1 6.61 3.52Z" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: HiddenLinksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);

  return {
    title: "Pit Crew Links",
    description: "Quick links for Pit Crew social channels and booking.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/${safeLocale}/pitcrew-links`,
    },
  };
}

export default async function HiddenLinksPage({ params }: HiddenLinksPageProps) {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const copy = hiddenLinksCopy[safeLocale];

  return (
    <section className="section-shell relative py-14 md:py-20">
      <div className="mx-auto w-full max-w-xl">
        <div className="panel overflow-hidden border-white/15">
          <div className="relative h-44 border-b border-white/10 md:h-52">
            <Image
              src="/hero-sportscar-black.jpg"
              alt=""
              fill
              className="object-cover object-right opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/65" />
            <div className="absolute inset-0 p-2 md:p-3">
              <Image
                src="/pitcrew-logo.jpeg"
                alt="Pit Crew"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-3xl uppercase tracking-wider text-white">
              {copy.title}
            </h1>
            <p className="mt-3 text-sm text-white/75">{copy.subtitle}</p>

            <div className="mt-7 space-y-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 transition hover:border-accent/60 hover:bg-accent/10"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/85 transition group-hover:text-accent">
                    <SocialIcon kind="facebook" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wide text-white">
                    Facebook
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
                  Open
                </span>
              </a>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 transition hover:border-accent/60 hover:bg-accent/10"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/85 transition group-hover:text-accent">
                    <SocialIcon kind="instagram" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wide text-white">
                    Instagram
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
                  Open
                </span>
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 transition hover:border-accent/60 hover:bg-accent/10"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/85 transition group-hover:text-accent">
                    <SocialIcon kind="whatsapp" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wide text-white">
                    WhatsApp
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
                  Open
                </span>
              </a>

              <BookNowButton
                label={copy.bookingLabel}
                className="group flex w-full items-center justify-between rounded-xl border border-accent/50 bg-accent px-4 py-3 text-left text-black transition hover:bg-white"
              />
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/${safeLocale}`}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55 transition hover:text-accent"
              >
                Go To Main Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
