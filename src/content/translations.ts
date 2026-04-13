import { defaultLocale, locales } from "@/lib/locales";
import type {
  FeatureItem,
  GalleryItem,
  Locale,
  QuickContactItem,
  ServiceItem,
  TestimonialItem,
  TranslationSchema,
} from "@/types/content";

const baseFeatures: FeatureItem[] = [
  {
    title: "We Come To You",
    description:
      "Fully mobile service at home, office, or parking deck across your service area.",
  },
  {
    title: "Expect Exceptional",
    description:
      "Paint-safe methods, precise interior care, and quality checks before handoff.",
  },
  {
    title: "You're In Good Hands",
    description:
      "Structured process from inspection to final walkaround with clear communication.",
  },
  {
    title: "Built On Experience",
    description: "Proven workflow refined through hundreds of detailing sessions.",
  },
  {
    title: "Industry Grade Products",
    description:
      "Premium compounds, pH-balanced cleaners, and microfiber-safe finishing products.",
  },
  {
    title: "Affordable Packages",
    description: "Simple and transparent packages: Basic, Medium, and Full.",
  },
];

const baseTestimonials: TestimonialItem[] = [
  {
    name: "Mia R.",
    quote:
      "They showed up on time, walked me through the package, and my SUV looked showroom-ready.",
  },
  {
    name: "Daniel C.",
    quote:
      "Best mobile detail I have booked. Very professional and the results lasted for weeks.",
  },
  {
    name: "Sofia M.",
    quote:
      "The interior reset was exactly what I needed after a long road trip with kids and pets.",
  },
];

const baseGallery: GalleryItem[] = [
  { src: "/gallery/detail-exterior.svg", alt: "Exterior detail finish" },
  { src: "/gallery/detail-interior.svg", alt: "Interior detail finish" },
  { src: "/gallery/detail-engine.svg", alt: "Engine bay refreshed" },
  { src: "/gallery/detail-headlight.svg", alt: "Restored headlights" },
  { src: "/gallery/detail-motorcycle.svg", alt: "Motorcycle detailing" },
  { src: "/gallery/detail-ceramic.svg", alt: "High-gloss protection finish" },
];

const contactItems: QuickContactItem[] = [
  { label: "Phone", value: "+1 (555) 214-7788", href: "tel:+15552147788" },
  {
    label: "WhatsApp",
    value: "+1 (555) 214-7788",
    href: "https://wa.me/15552147788",
  },
  {
    label: "Email",
    value: "bookings@pitcrewmobiledetailing.com",
    href: "mailto:bookings@pitcrewmobiledetailing.com",
  },
];

const servicesByLocale: Record<Locale, ServiceItem[]> = {
  en: [
    {
      slug: "basic",
      name: "Basic Plan",
      shortDescription: "Maintenance wash with quick interior refresh.",
      longDescription:
        "Great for weekly or bi-weekly maintenance. Exterior hand wash, tire dressing, and a fast cabin reset so your vehicle stays clean between deeper sessions.",
      price: "$89+",
      duration: "60 - 90 min",
      highlights: [
        "Foam wash and hand dry",
        "Wheel face and tire dressing",
        "Quick vacuum and wipe-down",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "Medium Plan",
      shortDescription: "Deep clean for interior + enhanced exterior finish.",
      longDescription:
        "Balanced package for drivers who want visible transformation. Includes deeper interior cleaning, decontamination touchpoints, and longer-lasting shine.",
      price: "$149+",
      duration: "2 - 3.5 hours",
      highlights: [
        "Interior deep vacuum and plastics detail",
        "Carpet and mat treatment",
        "Exterior decontamination + gloss protection",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "Full Plan",
      shortDescription: "Complete premium detail with maximum finish quality.",
      longDescription:
        "Our most complete package for vehicles needing a full reset. Deep interior detailing, exterior decontamination, gloss enhancement, and protection from top to bottom.",
      price: "$229+",
      duration: "3.5 - 5.5 hours",
      highlights: [
        "Full interior detailing workflow",
        "Exterior decontamination and polish enhancement",
        "Longer-lasting protection finish",
      ],
      featured: true,
    },
  ],
  es: [
    {
      slug: "basic",
      name: "Plan Básico",
      shortDescription: "Lavado de mantenimiento y refresh interior rápido.",
      longDescription:
        "Ideal para mantenimiento semanal o quincenal. Lavado exterior a mano, brillo en llantas y limpieza ligera de cabina.",
      price: "$89+",
      duration: "60 - 90 min",
      highlights: [
        "Lavado con espuma y secado a mano",
        "Limpieza de rines y llantas",
        "Aspirado y limpieza rápida interior",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "Plan Medio",
      shortDescription: "Limpieza profunda interior + mejor acabado exterior.",
      longDescription:
        "Paquete balanceado para lograr cambio visible. Incluye limpieza interior profunda y mejor protección exterior.",
      price: "$149+",
      duration: "2 - 3.5 horas",
      highlights: [
        "Aspirado profundo y detalle de plásticos",
        "Tratamiento de tapetes y alfombras",
        "Descontaminación y protección de brillo",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "Plan Full",
      shortDescription: "Detailing premium completo con máximo nivel de acabado.",
      longDescription:
        "Nuestro paquete más completo para reset total del vehículo. Interior y exterior con procesos detallados y protección duradera.",
      price: "$229+",
      duration: "3.5 - 5.5 horas",
      highlights: [
        "Flujo completo de detalle interior",
        "Descontaminación exterior y mejora de brillo",
        "Acabado premium con mayor duración",
      ],
      featured: true,
    },
  ],
  "pt-BR": [
    {
      slug: "basic",
      name: "Plano Básico",
      shortDescription: "Lavagem de manutenção com limpeza interna rápida.",
      longDescription:
        "Ideal para manutenção semanal. Lavagem externa, acabamento dos pneus e organização rápida da cabine.",
      price: "$89+",
      duration: "60 - 90 min",
      highlights: [
        "Lavagem com espuma e secagem manual",
        "Limpeza de rodas e pneus",
        "Aspiração rápida interna",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "Plano Médio",
      shortDescription: "Limpeza interna profunda e acabamento externo superior.",
      longDescription:
        "Pacote equilibrado para quem quer transformação visível com mais cuidado em interior e proteção externa.",
      price: "$149+",
      duration: "2 - 3.5 horas",
      highlights: [
        "Aspiração profunda e detalhes internos",
        "Tratamento de tapetes",
        "Descontaminação externa e proteção",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "Plano Full",
      shortDescription: "Detalhamento premium completo com acabamento máximo.",
      longDescription:
        "Nosso pacote mais completo para reset total. Processo completo de interior e exterior com proteção duradoura.",
      price: "$229+",
      duration: "3.5 - 5.5 horas",
      highlights: [
        "Detalhamento interno completo",
        "Melhoria de brilho externo",
        "Proteção premium de longa duração",
      ],
      featured: true,
    },
  ],
  it: [
    {
      slug: "basic",
      name: "Piano Basic",
      shortDescription: "Lavaggio di mantenimento con refresh interno rapido.",
      longDescription:
        "Perfetto per mantenere l'auto pulita ogni settimana con lavaggio esterno e riordino rapido dell'abitacolo.",
      price: "$89+",
      duration: "60 - 90 min",
      highlights: [
        "Lavaggio esterno a mano",
        "Pulizia ruote e gomme",
        "Aspirazione interna rapida",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "Piano Medium",
      shortDescription: "Pulizia interna profonda + finitura esterna migliorata.",
      longDescription:
        "Pacchetto bilanciato per ottenere un miglioramento evidente con cura più approfondita di interni ed esterni.",
      price: "$149+",
      duration: "2 - 3.5 ore",
      highlights: [
        "Pulizia interna dettagliata",
        "Trattamento tappetini",
        "Decontaminazione esterna e protezione",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "Piano Full",
      shortDescription: "Detailing premium completo con finitura massima.",
      longDescription:
        "Il pacchetto più completo per un reset totale del veicolo con workflow completo interno/esterno.",
      price: "$229+",
      duration: "3.5 - 5.5 ore",
      highlights: [
        "Workflow completo interno",
        "Miglioria brillantezza esterna",
        "Protezione premium duratura",
      ],
      featured: true,
    },
  ],
  "zh-CN": [
    {
      slug: "basic",
      name: "????",
      shortDescription: "??????,????????",
      longDescription:
        "?????????????????????????????",
      price: "$89+",
      duration: "60 - 90 ??",
      highlights: [
        "?????????",
        "?????????",
        "?????????",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "????",
      shortDescription: "?????? + ???????",
      longDescription:
        "?????,?????????????,????????????",
      price: "$149+",
      duration: "2 - 3.5 ??",
      highlights: [
        "???????????",
        "???????",
        "?????????",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "????",
      shortDescription: "??????,?????????",
      longDescription:
        "??????????,????????????????????",
      price: "$229+",
      duration: "3.5 - 5.5 ??",
      highlights: [
        "????????",
        "?????????",
        "??????",
      ],
      featured: true,
    },
  ],
  de: [
    {
      slug: "basic",
      name: "Basic Paket",
      shortDescription: "Pflegewäsche mit schnellem Innenraum-Refresh.",
      longDescription:
        "Ideal für regelmäßige Pflege. Außenwäsche, Reifenfinish und schnelle Innenraumreinigung.",
      price: "$89+",
      duration: "60 - 90 Min",
      highlights: [
        "Handwäsche mit Schaum",
        "Felgen- und Reifenpflege",
        "Schnelles Saugen innen",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "Medium Paket",
      shortDescription: "Tiefenreinigung innen + verbessertes Außenfinish.",
      longDescription:
        "Ausgewogenes Paket für sichtbare Verbesserung mit stärkerem Fokus auf Innenraum und Lackbild.",
      price: "$149+",
      duration: "2 - 3.5 Std",
      highlights: [
        "Innenraum-Tiefenreinigung",
        "Matten- und Teppichbehandlung",
        "Außen-Decontamination und Schutz",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "Full Paket",
      shortDescription: "Komplettes Premium-Detailing mit maximalem Finish.",
      longDescription:
        "Unser umfassendstes Paket für den kompletten Fahrzeug-Reset mit Premium-Schutz.",
      price: "$229+",
      duration: "3.5 - 5.5 Std",
      highlights: [
        "Kompletter Innenraum-Workflow",
        "Glanzverbesserung außen",
        "Langanhaltendes Schutzfinish",
      ],
      featured: true,
    },
  ],
};

const en: TranslationSchema = {
  localeName: "English",
  meta: {
    siteName: "Pit Crew Mobile Auto Detailing",
    tagline: "Track-ready finish, street-ready convenience.",
    description:
      "Premium mobile auto detailing with transparent pricing, service packages, and fast booking.",
  },
  nav: {
    home: "Home",
    services: "Services",
    contact: "Contact",
    bookNow: "Book Now",
  },
  hero: {
    eyebrow: "Mobile Auto Detailing",
    title: "Premium detailing. Delivered to your driveway.",
    subtitle:
      "Pit Crew provides high-impact interior and exterior detailing for cars, SUVs, and trucks.",
    primaryCta: "Book Now",
    secondaryCta: "Explore Services",
    badges: ["Fully Mobile", "Paint-Safe", "Transparent Pricing"],
  },
  about: {
    title: "Built For Drivers Who Notice Details",
    body: "From first rinse to final wipe, every package follows a quality checklist so the finish is consistent every visit.",
  },
  features: {
    title: "Why Clients Choose Pit Crew",
    subtitle:
      "A mobile experience designed around quality, communication, and convenience.",
    items: baseFeatures,
  },
  servicesHome: {
    title: "Featured Plans",
    subtitle: "Choose Basic, Medium, or Full depending on your vehicle condition.",
    viewAll: "View All Plans",
  },
  servicesPage: {
    title: "Detailing Plans",
    subtitle: "Three clear plans built for different care levels.",
    includesLabel: "Includes",
    ctaTitle: "Need help choosing a plan?",
    ctaCopy: "Open booking and we will recommend the right plan for your vehicle.",
    ctaButton: "Book Now",
  },
  serviceDetail: {
    startingAt: "Starting at",
    duration: "Estimated duration",
    includes: "What's included",
    backToServices: "Back to plans",
    viewDetails: "View plan details",
    getQuote: "Book this plan",
  },
  services: servicesByLocale.en,
  testimonials: {
    title: "Customer Reviews",
    subtitle: "Real feedback from recurring clients.",
    items: baseTestimonials,
  },
  gallery: {
    title: "Recent Results",
    subtitle: "Examples of finish quality and detailing consistency.",
    items: baseGallery,
  },
  contact: {
    title: "Contact & Booking",
    subtitle:
      "Send your request and we will reply with availability, pricing, and next steps.",
    quickContactTitle: "Quick contact",
    quickContactItems: contactItems,
    formTitle: "Tell us about your vehicle",
    formDescription:
      "We review each request manually to give accurate pricing and scheduling options.",
    fields: {
      name: "Full name",
      phone: "Phone or WhatsApp",
      email: "Email (optional)",
      vehicleType: "Vehicle type",
      serviceInterest: "Service interest",
      message: "Message",
    },
    placeholders: {
      name: "John Carter",
      phone: "+1 (555) 000-0000",
      email: "you@example.com",
      vehicleType: "SUV - BMW X5",
      message: "Tell us current condition, location, and preferred date.",
    },
    serviceFallbackOption: "Select a plan",
    submit: "Send Request",
    submitting: "Sending...",
    success: "Your request was sent. Pit Crew will contact you soon.",
    error:
      "We could not process your request right now. Please try again or contact us by phone.",
    validation: {
      required: "Please complete all required fields.",
      invalidEmail: "Please enter a valid email address.",
      minMessage: "Please add a bit more detail to your message.",
    },
  },
  bookingModal: {
    title: "Book Your Detailing",
    subtitle: "Complete these steps and we will confirm pricing and schedule by email.",
    steps: {
      choosePlan: "Choose plan",
      vehicleInfo: "Vehicle information",
      locationContact: "Location and contact",
    },
    actions: {
      next: "Next",
      back: "Back",
      send: "Send Booking",
      close: "Close",
    },
    fields: {
      plan: "Plan",
      vehicleType: "Vehicle type",
      vehicleMakeModel: "Vehicle make/model",
      vehicleYear: "Vehicle year",
      addressLine: "Address",
      cityArea: "City / Area",
      name: "Full name",
      phone: "Phone",
      email: "Email (optional)",
      notes: "Notes (optional)",
    },
    placeholders: {
      vehicleType: "SUV, Sedan, Truck...",
      vehicleMakeModel: "Toyota RAV4, BMW 3 Series...",
      vehicleYear: "2022",
      addressLine: "123 Main St",
      cityArea: "Boston, MA",
      name: "John Carter",
      phone: "+1 (555) 000-0000",
      email: "you@example.com",
      notes: "Parking access, gate code, preferred time...",
    },
    validation: {
      required: "Please complete the required fields.",
      planRequired: "Please choose a plan.",
      phoneRequired: "Please enter a valid phone number.",
    },
    success: "Booking sent successfully. We'll contact you shortly.",
    error: "We couldn't send your booking. Please try again.",
  },
  cta: {
    title: "Ready For A Better Finish?",
    subtitle: "Book your detailing session and get clear pricing before the appointment.",
    primary: "Book Now",
    secondary: "Open WhatsApp",
  },
  footer: {
    rights: "All rights reserved.",
    serviceArea: "Service area: mobile coverage by appointment.",
  },
};

export const translations: Record<Locale, TranslationSchema> = {
  en,
  es: {
    ...en,
    localeName: "Español",
    nav: { home: "Inicio", services: "Servicios", contact: "Contacto", bookNow: "Reservar" },
    hero: {
      ...en.hero,
      eyebrow: "Detailing Móvil",
      title: "Detailing premium directo en tu ubicación.",
      primaryCta: "Reservar Ahora",
      secondaryCta: "Ver Planes",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Planes de Detailing",
      subtitle: "Tres planes claros: Básico, Medio y Full.",
      ctaButton: "Reservar",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Volver a planes",
      getQuote: "Reservar este plan",
      duration: "Duración estimada",
      startingAt: "Desde",
      includes: "Incluye",
    },
    services: servicesByLocale.es,
    contact: {
      ...en.contact,
      title: "Contacto y Reserva",
      subtitle: "Envíanos tu solicitud y te contactamos con disponibilidad y precio.",
      quickContactTitle: "Contacto rápido",
      formTitle: "Cuéntanos sobre tu vehículo",
      fields: {
        name: "Nombre completo",
        phone: "Teléfono o WhatsApp",
        email: "Correo (opcional)",
        vehicleType: "Tipo de vehículo",
        serviceInterest: "Plan de interés",
        message: "Mensaje",
      },
      placeholders: {
        name: "Juan Pérez",
        phone: "+57 300 000 0000",
        email: "tu@email.com",
        vehicleType: "SUV - Mazda CX-5",
        message: "Cuéntanos ubicación, estado y fecha ideal.",
      },
      serviceFallbackOption: "Selecciona un plan",
      submit: "Enviar Solicitud",
      submitting: "Enviando...",
      success: "Solicitud enviada. Te contactaremos pronto.",
      error: "No pudimos procesar la solicitud. Intenta nuevamente.",
      validation: {
        required: "Completa los campos requeridos.",
        invalidEmail: "Ingresa un correo válido.",
        minMessage: "Agrega más detalle en tu mensaje.",
      },
    },
    bookingModal: {
      ...en.bookingModal,
      title: "Reserva Tu Detailing",
      subtitle: "Completa estos pasos y confirmaremos precio y horario por email.",
      steps: {
        choosePlan: "Elegir plan",
        vehicleInfo: "Información del vehículo",
        locationContact: "Ubicación y contacto",
      },
      actions: { next: "Siguiente", back: "Atrás", send: "Enviar Reserva", close: "Cerrar" },
      fields: {
        plan: "Plan",
        vehicleType: "Tipo de vehículo",
        vehicleMakeModel: "Marca y modelo",
        vehicleYear: "Año",
        addressLine: "Dirección",
        cityArea: "Ciudad / Zona",
        name: "Nombre completo",
        phone: "Teléfono",
        email: "Correo (opcional)",
        notes: "Notas (opcional)",
      },
      placeholders: {
        vehicleType: "SUV, Sedan, Pickup...",
        vehicleMakeModel: "Toyota Corolla, Mazda CX-5...",
        vehicleYear: "2021",
        addressLine: "Calle 123 #45-67",
        cityArea: "Bogotá",
        name: "Juan Pérez",
        phone: "+57 300 000 0000",
        email: "tu@email.com",
        notes: "Acceso, parqueadero, horario preferido...",
      },
      validation: {
        required: "Completa los campos requeridos.",
        planRequired: "Selecciona un plan.",
        phoneRequired: "Ingresa un teléfono válido.",
      },
      success: "Reserva enviada. Te contactaremos pronto.",
      error: "No pudimos enviar tu reserva. Intenta nuevamente.",
    },
    cta: { ...en.cta, primary: "Reservar Ahora", secondary: "Abrir WhatsApp" },
    footer: { ...en.footer, rights: "Todos los derechos reservados." },
  },
  "pt-BR": {
    ...en,
    localeName: "Português (Brasil)",
    nav: { home: "Início", services: "Serviços", contact: "Contato", bookNow: "Agendar" },
    hero: {
      ...en.hero,
      eyebrow: "Detalhamento Móvel",
      title: "Detalhamento premium no seu endereço.",
      primaryCta: "Agendar Agora",
      secondaryCta: "Ver Planos",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Planos de Detalhamento",
      subtitle: "Três opções claras: Básico, Médio e Full.",
      ctaButton: "Agendar",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Voltar para planos",
      getQuote: "Agendar este plano",
      startingAt: "A partir de",
      duration: "Duração estimada",
      includes: "Inclui",
    },
    services: servicesByLocale["pt-BR"],
    bookingModal: {
      ...en.bookingModal,
      title: "Agende Seu Detalhamento",
      steps: {
        choosePlan: "Escolher plano",
        vehicleInfo: "Informações do veículo",
        locationContact: "Localização e contato",
      },
      actions: { next: "Próximo", back: "Voltar", send: "Enviar Agendamento", close: "Fechar" },
      validation: {
        required: "Preencha os campos obrigatórios.",
        planRequired: "Escolha um plano.",
        phoneRequired: "Informe um telefone válido.",
      },
      success: "Agendamento enviado com sucesso.",
      error: "Não foi possível enviar. Tente novamente.",
    },
    cta: { ...en.cta, primary: "Agendar Agora", secondary: "Abrir WhatsApp" },
    footer: { ...en.footer, rights: "Todos os direitos reservados." },
  },
  it: {
    ...en,
    localeName: "Italiano",
    nav: { home: "Home", services: "Servizi", contact: "Contatto", bookNow: "Prenota" },
    hero: {
      ...en.hero,
      eyebrow: "Detailing Mobile",
      title: "Detailing premium direttamente da te.",
      primaryCta: "Prenota Ora",
      secondaryCta: "Vedi Piani",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Piani Detailing",
      subtitle: "Tre piani chiari: Basic, Medium e Full.",
      ctaButton: "Prenota",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Torna ai piani",
      getQuote: "Prenota questo piano",
      startingAt: "Da",
      duration: "Durata stimata",
      includes: "Include",
    },
    services: servicesByLocale.it,
    bookingModal: {
      ...en.bookingModal,
      title: "Prenota il tuo detailing",
      steps: {
        choosePlan: "Scegli piano",
        vehicleInfo: "Info veicolo",
        locationContact: "Posizione e contatto",
      },
      actions: { next: "Avanti", back: "Indietro", send: "Invia Prenotazione", close: "Chiudi" },
      success: "Prenotazione inviata con successo.",
      error: "Invio non riuscito. Riprova.",
    },
    cta: { ...en.cta, primary: "Prenota Ora", secondary: "Apri WhatsApp" },
    footer: { ...en.footer, rights: "Tutti i diritti riservati." },
  },
  "zh-CN": {
    ...en,
    localeName: "????",
    nav: { home: "??", services: "??", contact: "??", bookNow: "????" },
    hero: {
      ...en.hero,
      eyebrow: "??????",
      title: "??????,??????????",
      primaryCta: "????",
      secondaryCta: "????",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "????",
      subtitle: "??????:?????????",
      ctaButton: "????",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "????",
      getQuote: "?????",
      startingAt: "??",
      duration: "????",
      includes: "????",
    },
    services: servicesByLocale["zh-CN"],
    bookingModal: {
      ...en.bookingModal,
      title: "????????",
      subtitle: "???????,???????????????",
      steps: {
        choosePlan: "????",
        vehicleInfo: "????",
        locationContact: "???????",
      },
      actions: { next: "???", back: "???", send: "????", close: "??" },
      validation: {
        required: "???????",
        planRequired: "??????",
        phoneRequired: "????????",
      },
      success: "??????,?????????",
      error: "??????,??????",
    },
    cta: { ...en.cta, primary: "????", secondary: "?? WhatsApp" },
    footer: { ...en.footer, rights: "???????" },
  },
  de: {
    ...en,
    localeName: "Deutsch",
    nav: { home: "Start", services: "Leistungen", contact: "Kontakt", bookNow: "Buchen" },
    hero: {
      ...en.hero,
      eyebrow: "Mobiles Auto Detailing",
      title: "Premium-Detailing direkt bei dir vor Ort.",
      primaryCta: "Jetzt Buchen",
      secondaryCta: "Pläne ansehen",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Detailing-Pläne",
      subtitle: "Drei klare Optionen: Basic, Medium und Full.",
      ctaButton: "Jetzt buchen",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Zurück zu Plänen",
      getQuote: "Diesen Plan buchen",
      startingAt: "Ab",
      duration: "Geschätzte Dauer",
      includes: "Enthält",
    },
    services: servicesByLocale.de,
    bookingModal: {
      ...en.bookingModal,
      title: "Detailing buchen",
      steps: {
        choosePlan: "Plan wählen",
        vehicleInfo: "Fahrzeuginfo",
        locationContact: "Ort und Kontakt",
      },
      actions: { next: "Weiter", back: "Zurück", send: "Buchung senden", close: "Schließen" },
      success: "Buchung erfolgreich gesendet.",
      error: "Buchung konnte nicht gesendet werden.",
    },
    cta: { ...en.cta, primary: "Jetzt buchen", secondary: "WhatsApp öffnen" },
    footer: { ...en.footer, rights: "Alle Rechte vorbehalten." },
  },
};

function validateTranslations() {
  const baselineSlugs = new Set(
    translations[defaultLocale].services.map((service) => service.slug),
  );

  for (const locale of locales) {
    const current = translations[locale];
    const currentSlugs = new Set(current.services.map((service) => service.slug));

    if (current.services.length !== baselineSlugs.size) {
      throw new Error(
        `Locale ${locale} has ${current.services.length} services, expected ${baselineSlugs.size}.`,
      );
    }

    for (const slug of baselineSlugs) {
      if (!currentSlugs.has(slug)) {
        throw new Error(`Locale ${locale} is missing service slug "${slug}".`);
      }
    }
  }
}

validateTranslations();

