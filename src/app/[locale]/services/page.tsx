import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import { ServiceCard } from "@/components/service-card";
import { getDictionary, getLocaleFromParams } from "@/lib/content";
import { extraServicesByLocale, extraServicesCopyByLocale } from "@/lib/extra-services";

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};


export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  return {
    title: dict.nav.services,
    description: dict.servicesPage.subtitle,
    alternates: {
      canonical: `/${safeLocale}/services`,
    },
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);
  const extraServicesCopy = extraServicesCopyByLocale[safeLocale];
  const extraServices = extraServicesByLocale[safeLocale];

  return (
    <section className="section-shell py-14 md:py-20" data-scroll-fade>
      <header className="mb-10" data-scroll-fade data-scroll-fade-delay={80}>
        <h1 className="font-heading text-4xl uppercase tracking-wider text-white md:text-5xl">
          {dict.servicesPage.title}
        </h1>
        <p className="mt-4 max-w-4xl text-white/80">{dict.servicesPage.subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dict.services.map((service, index) => (
          <div key={service.slug} data-scroll-fade data-scroll-fade-delay={130 + index * 60}>
            <ServiceCard
              locale={safeLocale}
              service={service}
              labels={dict.servicesPage}
              detailLabel={dict.serviceDetail.viewDetails}
            />
          </div>
        ))}
      </div>

      <div className="mt-12" data-scroll-fade data-scroll-fade-delay={150}>
        <header className="mb-6">
          <h2 className="font-heading text-3xl uppercase tracking-wider text-white">
            {extraServicesCopy.title}
          </h2>
          <p className="mt-2 max-w-4xl text-white/75">{extraServicesCopy.subtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {extraServices.map((service, index) => (
            <article
              key={service.key}
              className="panel p-6"
              data-scroll-fade
              data-scroll-fade-delay={190 + index * 60}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-lg uppercase tracking-wider text-white">
                  {service.name}
                </h3>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase tracking-wide text-accent">{service.price}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">{service.duration}</p>
                </div>
              </div>

              <p className="mt-4 text-xs uppercase tracking-wide text-white/60">
                {extraServicesCopy.includesLabel}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {service.details.map((detail) => (
                  <li key={`${service.key}-${detail}`} className="flex items-start gap-2">
                    <span className="mt-1 block h-2 w-2 rounded-full bg-accent" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div
        className="panel mt-10 border-accent/25 bg-accent/10 p-6 md:p-8"
        data-scroll-fade
        data-scroll-fade-delay={180}
      >
        <h2 className="font-heading text-2xl uppercase tracking-wider text-white">
          {dict.servicesPage.ctaTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-white/80">{dict.servicesPage.ctaCopy}</p>
        <BookNowButton
          label={dict.servicesPage.ctaButton}
          className="mt-6 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
        />
      </div>
    </section>
  );
}
