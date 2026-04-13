import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

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
      <section className="section-shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              {dict.hero.eyebrow}
            </p>
            <h1 className="font-heading text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
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
              <Link
                href={`/${safeLocale}/contact#contact-form`}
                className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
              >
                {dict.hero.primaryCta}
              </Link>
              <Link
                href={`/${safeLocale}/services`}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-accent hover:text-accent"
              >
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="panel p-4 sm:p-6">
            <Image
              src="/pitcrew-logo.jpeg"
              alt="Pit Crew logo"
              width={1200}
              height={670}
              className="h-auto w-full rounded-xl border border-white/10 object-cover"
              priority
            />
            <p className="mt-4 text-sm text-white/75">{dict.meta.tagline}</p>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 md:py-12">
        <div className="panel p-6 md:p-8">
          <h2 className="font-heading text-2xl uppercase tracking-wider text-white md:text-3xl">
            {dict.about.title}
          </h2>
          <p className="mt-4 max-w-4xl text-white/80">{dict.about.body}</p>
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
            {dict.features.title}
          </h2>
          <p className="mt-3 max-w-3xl text-white/75">{dict.features.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dict.features.items.map((feature) => (
            <article key={feature.title} className="panel p-5">
              <h3 className="font-heading text-lg uppercase tracking-wider text-accent">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-white/80">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
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
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.slug}
              locale={safeLocale}
              service={service}
              labels={dict.servicesPage}
              detailLabel={dict.serviceDetail.getQuote}
            />
          ))}
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
            {dict.testimonials.title}
          </h2>
          <p className="mt-3 text-white/75">{dict.testimonials.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {dict.testimonials.items.map((item) => (
            <article key={item.name} className="panel p-6">
              <p className="text-sm text-white/80">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 font-heading text-sm uppercase tracking-wider text-accent">
                {item.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-14 md:py-20">
        <div className="mb-8">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
            {dict.gallery.title}
          </h2>
          <p className="mt-3 text-white/75">{dict.gallery.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.gallery.items.map((item) => (
            <figure key={item.src} className="panel overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={800}
                className="h-52 w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-xs uppercase tracking-wide text-white/70">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="panel border-accent/30 bg-gradient-to-r from-accent/15 to-accent-deep/10 p-8 md:p-10">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white md:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">{dict.cta.subtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${safeLocale}/contact#contact-form`}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
            >
              {dict.cta.primary}
            </Link>
            <a
              href="https://wa.me/15552147788"
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
