import Link from "next/link";

import type { Locale, ServiceItem, TranslationSchema } from "@/types/content";

type ServiceCardProps = {
  locale: Locale;
  service: ServiceItem;
  labels: TranslationSchema["servicesPage"];
  detailLabel: string;
};

const serviceCardCopy: Record<
  Locale,
  {
    featured: string;
    price: string;
    time: string;
  }
> = {
  en: {
    featured: "Featured",
    price: "Price",
    time: "Time",
  },
  es: {
    featured: "Destacado",
    price: "Precio",
    time: "Tiempo",
  },
  "pt-BR": {
    featured: "Destaque",
    price: "Preco",
    time: "Tempo",
  },
  it: {
    featured: "In evidenza",
    price: "Prezzo",
    time: "Tempo",
  },
  "zh-CN": {
    featured: "Tuijian",
    price: "Jiage",
    time: "Shijian",
  },
  de: {
    featured: "Empfohlen",
    price: "Preis",
    time: "Dauer",
  },
};

export function ServiceCard({
  locale,
  service,
  labels,
  detailLabel,
}: ServiceCardProps) {
  const copy = serviceCardCopy[locale];

  return (
    <article className="panel flex h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-xl uppercase tracking-wider text-white">
          {service.name}
        </h3>
        {service.featured ? (
          <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
            {copy.featured}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-white/80">{service.shortDescription}</p>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <dt className="text-xs uppercase tracking-wider text-steel">{copy.price}</dt>
          <dd className="mt-1 font-semibold text-accent">{service.price}</dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <dt className="text-xs uppercase tracking-wider text-steel">{copy.time}</dt>
          <dd className="mt-1 font-semibold text-white">{service.duration}</dd>
        </div>
      </dl>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-steel">
          {labels.includesLabel}
        </p>
        <ul className="space-y-2 text-sm text-white/80">
          {service.highlights.slice(0, 3).map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1 block h-2 w-2 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <Link
          href={`/${locale}/services/${service.slug}`}
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-accent hover:text-accent"
        >
          {detailLabel}
        </Link>
      </div>
    </article>
  );
}
