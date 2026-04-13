import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { getDictionary, getLocaleFromParams } from "@/lib/content";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  return {
    title: dict.nav.contact,
    description: dict.contact.subtitle,
    alternates: {
      canonical: `/${safeLocale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const safeLocale = getLocaleFromParams(locale);
  const dict = getDictionary(safeLocale);

  return (
    <section className="section-shell py-14 md:py-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-heading text-4xl uppercase tracking-wider text-white md:text-5xl">
          {dict.contact.title}
        </h1>
        <p className="mt-4 text-white/80">{dict.contact.subtitle}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="panel p-6 md:p-8">
          <h2 className="font-heading text-2xl uppercase tracking-wide text-white">
            {dict.contact.quickContactTitle}
          </h2>
          <ul className="mt-4 space-y-4">
            {dict.contact.quickContactItems.map((item) => (
              <li key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-steel">{item.label}</p>
                <a
                  className="mt-2 block text-sm font-semibold text-accent hover:text-white"
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-white/70">{dict.contact.formDescription}</p>
        </aside>

        <div>
          <h2 className="mb-4 font-heading text-2xl uppercase tracking-wide text-white">
            {dict.contact.formTitle}
          </h2>

          <form
            name="pitcrew-contact"
            data-netlify="true"
            netlify-honeypot="bot-field"
            hidden
          >
            <input type="hidden" name="form-name" value="pitcrew-contact" />
            <input type="text" name="name" />
            <input type="text" name="phone" />
            <input type="text" name="email" />
            <input type="text" name="vehicleType" />
            <input type="text" name="serviceInterest" />
            <textarea name="message" />
            <input type="text" name="locale" />
            <input type="text" name="source" />
            <input type="text" name="planSlug" />
            <input type="text" name="vehicleMakeModel" />
            <input type="text" name="vehicleYear" />
            <input type="text" name="addressLine" />
            <input type="text" name="cityArea" />
            <textarea name="notes" />
            <input type="text" name="bot-field" />
          </form>

          <ContactForm
            locale={safeLocale}
            labels={dict.contact}
            services={dict.services}
          />
        </div>
      </div>
    </section>
  );
}
