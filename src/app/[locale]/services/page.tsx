import type { Metadata } from "next";

import { BookNowButton } from "@/components/booking/book-now-button";
import { ServiceCard } from "@/components/service-card";
import { getDictionary, getLocaleFromParams } from "@/lib/content";

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
