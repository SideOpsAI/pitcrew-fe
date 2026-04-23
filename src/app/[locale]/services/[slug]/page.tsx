import Link from "next/link";
import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import { getVehiclePlanBreakdown, type VehicleTypeKey } from "@/lib/vehicle-plans";
import {
  getDictionary,
  getLocaleFromParams,
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/content";
import { locales } from "@/lib/locales";
import type { Locale } from "@/types/content";

type ServiceDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const vehicleTypeLabels: Record<Locale, Record<VehicleTypeKey, string>> = {
  en: {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  es: {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  "pt-BR": {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  it: {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  "zh-CN": {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  de: {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
};

const byVehicleLabel: Record<Locale, string> = {
  en: "By Vehicle Type",
  es: "Por Tipo de Vehiculo",
  "pt-BR": "Por Tipo de Veiculo",
  it: "Per Tipo di Veicolo",
  "zh-CN": "An chexing",
  de: "Nach Fahrzeugtyp",
};

const tableHeaderCopy: Record<Locale, { vehicle: string; price: string; time: string }> = {
  en: { vehicle: "Vehicle", price: "Price", time: "Time" },
  es: { vehicle: "Vehiculo", price: "Precio", time: "Tiempo" },
  "pt-BR": { vehicle: "Veiculo", price: "Preco", time: "Tempo" },
  it: { vehicle: "Veicolo", price: "Prezzo", time: "Tempo" },
  "zh-CN": { vehicle: "Chexing", price: "Jiage", time: "Shijian" },
  de: { vehicle: "Fahrzeug", price: "Preis", time: "Dauer" },
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
  const planBreakdown = getVehiclePlanBreakdown(service.slug);
  const headers = tableHeaderCopy[safeLocale];

  return (
    <section className="section-shell py-14 md:py-20" data-scroll-fade>
      <Link
        href={`/${safeLocale}/services`}
        className="mb-6 inline-flex text-sm font-semibold uppercase tracking-wide text-accent"
        data-scroll-fade
        data-scroll-fade-delay={80}
      >
        {dict.serviceDetail.backToServices}
      </Link>

      <article className="panel p-6 md:p-10" data-scroll-fade data-scroll-fade-delay={120}>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div data-scroll-fade data-scroll-fade-delay={160}>
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

          <aside
            className="rounded-2xl border border-white/15 bg-white/5 p-5"
            data-scroll-fade
            data-scroll-fade-delay={220}
          >
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

            <div className="mt-6 rounded-xl border border-white/10 bg-black/35 p-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-steel">
                {byVehicleLabel[safeLocale]}
              </p>
              <table className="w-full text-xs text-white/85">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wide text-white/55">
                    <th className="pb-1 pr-2">{headers.vehicle}</th>
                    <th className="pb-1 pr-2">{headers.price}</th>
                    <th className="pb-1">{headers.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {planBreakdown.map((item) => (
                    <tr key={item.vehicleTypeKey} className="align-top">
                      <td className="py-1 pr-2">
                        {vehicleTypeLabels[safeLocale][item.vehicleTypeKey]}
                      </td>
                      <td className="py-1 pr-2 text-accent">{item.price}</td>
                      <td className="py-1">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
