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
