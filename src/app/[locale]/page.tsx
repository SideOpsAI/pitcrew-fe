import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import { ServiceCard } from "@/components/service-card";
import { getDictionary, getLocaleFromParams } from "@/lib/content";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  return {
    title: dict.meta.siteName,
    description: dict.meta.description,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  const featuredServices = dict.services.filter((service) => service.featured);

  return (
    <>
      <section className="section-shell relative overflow-hidden py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          data-scroll-fade
          data-scroll-fade-delay={40}
        >
          <div className="absolute inset-0 overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:w-1/2">
            <Image
              src="/hero-sportscar-black.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 639px) 100vw, 50vw"
              className="object-cover object-center opacity-25 sm:object-right"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/55 to-black/76" />
        </div>

        <div className="relative z-10 max-w-3xl" data-scroll-fade data-scroll-fade-delay={180}>
          <p className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-accent">
            {dict.hero.eyebrow}
          </p>
          <h1 className="font-heading text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-7xl">
            {dict.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            {dict.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {dict.hero.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookNowButton
              label={dict.hero.primaryCta}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
            />
            <Link
              href={`/${safeLocale}/services`}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-accent hover:text-accent"
            >
              {dict.hero.secondaryCta}
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-3" aria-label="Social media">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/85">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M22 12.07C22 6.506 17.523 2 12 2S2 6.506 2 12.07c0 5.026 3.657 9.191 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.49-3.912 3.774-3.912 1.094 0 2.238.197 2.238.197v2.474H15.19c-1.242 0-1.63.777-1.63 1.574v1.89h2.773l-.443 2.9H13.56V22c4.78-.739 8.44-4.904 8.44-9.93Z" />
              </svg>
            </span>
            <a
              href="https://www.instagram.com/pitcrewmobiledetailing?igsh=OXQ2NWx5dm83a3Q5&utm_source=ig_contact_invite"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/85 transition hover:border-accent hover:text-accent"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.97 1.38a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section
        className="section-shell py-8 md:py-12"
        data-scroll-fade
        data-scroll-fade-delay={80}
      >
        <div className="panel p-6 md:p-8">
          <h2 className="font-heading text-2xl uppercase tracking-wider text-white md:text-3xl">
            {dict.about.title}
          </h2>
          <p className="mt-4 max-w-4xl text-white/80">{dict.about.body}</p>
        </div>
      </section>

      <section
        className="section-shell py-14 md:py-20"
        data-scroll-fade
        data-scroll-fade-delay={110}
      >
        <div className="mb-8">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
            {dict.features.title}
          </h2>
          <p className="mt-3 max-w-3xl text-white/75">{dict.features.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dict.features.items.map((feature, index) => (
            <article
              key={feature.title}
              className="panel p-5"
              data-scroll-fade
              data-scroll-fade-delay={160 + index * 65}
            >
              <h3 className="font-heading text-lg uppercase tracking-wider text-accent">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-white/80">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section-shell py-14 md:py-20"
        data-scroll-fade
        data-scroll-fade-delay={130}
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
              {dict.servicesHome.title}
            </h2>
            <p className="mt-3 max-w-3xl text-white/75">{dict.servicesHome.subtitle}</p>
          </div>
          <Link
            href={`/${safeLocale}/services`}
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-accent hover:text-accent"
          >
            {dict.servicesHome.viewAll}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featuredServices.map((service, index) => (
            <div
              key={service.slug}
              data-scroll-fade
              data-scroll-fade-delay={180 + index * 75}
            >
              <ServiceCard
                locale={safeLocale}
                service={service}
                labels={dict.servicesPage}
                detailLabel={dict.serviceDetail.viewDetails}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20" data-scroll-fade data-scroll-fade-delay={160}>
        <div className="panel border-accent/30 bg-gradient-to-r from-accent/15 to-accent-deep/10 p-8 md:p-10">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white md:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">{dict.cta.subtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BookNowButton
              label={dict.cta.primary}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
            />
            <a
              href="https://wa.me/16032051026?text=Hola%2C%20quiero%20reservar%20un%20detailing."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-accent hover:text-accent"
            >
              {dict.cta.secondary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
