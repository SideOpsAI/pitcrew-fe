import Link from "next/link";
import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import {
  getDictionary,
  getLocaleFromParams,
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/content";
import { locales } from "@/lib/locales";

type ServiceDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getServiceSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);
  const service = getServiceBySlug(safeLocale, slug);

  return {
    title: service.name,
    description: service.shortDescription,
    alternates: {
      canonical: `/${safeLocale}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} | ${dict.meta.siteName}`,
      description: service.shortDescription,
      images: [
        {
          url: "/pitcrew-logo.jpeg",
          width: 1280,
          height: 672,
          alt: dict.meta.siteName,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);
  const service = getServiceBySlug(safeLocale, slug);

  return (
    <section className="section-shell py-14 md:py-20">
      <Link
        href={`/${safeLocale}/services`}
        className="mb-6 inline-flex text-sm font-semibold uppercase tracking-wide text-accent"
      >
        {dict.serviceDetail.backToServices}
      </Link>

      <article className="panel p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h1 className="font-heading text-4xl uppercase tracking-wider text-white md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 text-lg text-white/80">{service.longDescription}</p>

            <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-steel">
              {dict.serviceDetail.includes}
            </h2>
            <ul className="mt-3 space-y-3 text-white/80">
              {service.highlights.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <dl className="space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-steel">
                  {dict.serviceDetail.startingAt}
                </dt>
                <dd className="mt-1 font-heading text-3xl text-accent">{service.price}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-steel">
                  {dict.serviceDetail.duration}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-white">{service.duration}</dd>
              </div>
            </dl>

            <BookNowButton
              label={dict.serviceDetail.getQuote}
              planSlug={service.slug}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
            />
          </aside>
        </div>
      </article>
    </section>
  );
}
