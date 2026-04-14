export type Locale = "en" | "es" | "pt-BR" | "it" | "zh-CN" | "de";

export type PlanSlug = "basic" | "medium" | "full";

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface FeatureItem {
  title: string;
  description: string;
}

export interface ServiceItem {
  slug: PlanSlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  duration: string;
  highlights: string[];
  featured?: boolean;
}

export interface TestimonialItem {
  name: string;
  quote: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
}

export interface QuickContactItem {
  label: string;
  value: string;
  href: string;
}

export interface BookingModalCopy {
  title: string;
  subtitle: string;
  steps: {
    choosePlan: string;
    vehicleInfo: string;
    locationContact: string;
  };
  actions: {
    next: string;
    back: string;
    send: string;
    close: string;
  };
  fields: {
    plan: string;
    vehicleType: string;
    vehicleMakeModel: string;
    vehicleYear: string;
    addressLine: string;
    cityArea: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  placeholders: {
    vehicleType: string;
    vehicleMakeModel: string;
    vehicleYear: string;
    addressLine: string;
    cityArea: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  validation: {
    required: string;
    planRequired: string;
    phoneRequired: string;
  };
  success: string;
  error: string;
}

export interface TranslationSchema {
  localeName: string;
  meta: {
    siteName: string;
    tagline: string;
    description: string;
  };
  nav: {
    home: string;
    services: string;
    contact: string;
    bookNow: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
  };
  about: {
    title: string;
    body: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  servicesHome: {
    title: string;
    subtitle: string;
    viewAll: string;
  };
  servicesPage: {
    title: string;
    subtitle: string;
    includesLabel: string;
    ctaTitle: string;
    ctaCopy: string;
    ctaButton: string;
  };
  serviceDetail: {
    startingAt: string;
    duration: string;
    includes: string;
    backToServices: string;
    viewDetails: string;
    getQuote: string;
  };
  services: ServiceItem[];
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  gallery: {
    title: string;
    subtitle: string;
    items: GalleryItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    quickContactTitle: string;
    quickContactItems: QuickContactItem[];
    formTitle: string;
    formDescription: string;
    fields: {
      name: string;
      phone: string;
      email: string;
      vehicleType: string;
      serviceInterest: string;
      message: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
      vehicleType: string;
      message: string;
    };
    serviceFallbackOption: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    validation: {
      required: string;
      invalidEmail: string;
      minMessage: string;
    };
  };
  bookingModal: BookingModalCopy;
  cta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    rights: string;
    serviceArea: string;
  };
}

export interface ContactLeadInput {
  name: string;
  phone: string;
  email?: string;
  vehicleType?: string;
  serviceInterest?: string;
  message?: string;
  locale: Locale;
  source?: "contact-form" | "booking-modal";
  planSlug?: PlanSlug;
  vehicleMakeModel?: string;
  vehicleYear?: string;
  addressLine?: string;
  cityArea?: string;
  notes?: string;
  botField?: string;
  captchaToken?: string;
}

