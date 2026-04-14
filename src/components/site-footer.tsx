import Link from "next/link";

import type { Locale, TranslationSchema } from "@/types/content";

type SiteFooterProps = {
  locale: Locale;
  nav: TranslationSchema["nav"];
  footer: TranslationSchema["footer"];
  siteName: string;
};

export function SiteFooter({ locale, nav, footer, siteName }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="section-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-lg uppercase tracking-[0.22em] text-white">
            {siteName}
          </p>
          <p className="mt-2 text-sm text-steel">{footer.serviceArea}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          <Link href={`/${locale}`}>{nav.home}</Link>
          <Link href={`/${locale}/services`}>{nav.services}</Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-steel">
        &copy; {year} {siteName}. {footer.rights}
      </div>
    </footer>
  );
}
