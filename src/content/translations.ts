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
    description:
      "Transparent pricing with options for compact cars, SUVs, trucks, and motorcycles.",
  },
];

const baseServices: ServiceItem[] = [
  {
    slug: "total-vehicle-reset",
    name: "Total Vehicle Reset",
    shortDescription: "Complete interior + exterior restoration package.",
    longDescription:
      "Our most complete package for vehicles that need a full reset. We deep-clean interior surfaces, decontaminate exterior paint, and finish with protection to restore a sharp, premium look.",
    price: "$199+",
    duration: "3.5 - 5 hours",
    highlights: [
      "Interior vacuum + fabric and trim cleaning",
      "Exterior hand wash + decontamination",
      "Gloss finish and protection layer",
      "Wheels, tires, and door-jamb detail",
    ],
    featured: true,
  },
  {
    slug: "interior-reset",
    name: "Interior Reset",
    shortDescription: "Deep interior clean for seats, carpets, and trim.",
    longDescription:
      "Perfect for families and daily drivers that need a cleaner, fresher cabin. We focus on high-touch points, stains, and hard-to-reach areas to leave your interior revitalized.",
    price: "$119+",
    duration: "2 - 3 hours",
    highlights: [
      "Steam-safe detailing on key surfaces",
      "Carpet and mat extraction",
      "Dashboard, console, and vents cleaned",
      "UV-friendly trim dressing",
    ],
    featured: true,
  },
  {
    slug: "exterior-reset",
    name: "Exterior Reset",
    shortDescription: "Paint-safe wash, decontamination, and gloss finish.",
    longDescription:
      "Bring back curb appeal with a full exterior detail. This package removes bonded contamination and restores gloss while preserving paint with safe, controlled techniques.",
    price: "$109+",
    duration: "1.5 - 2.5 hours",
    highlights: [
      "Foam pre-wash and hand wash",
      "Clay-bar decontamination",
      "Trim and tire dressing",
      "Spray sealant protection",
    ],
    featured: true,
  },
  {
    slug: "motorcycle-detail",
    name: "Motorcycle Detail",
    shortDescription: "Targeted care for bikes, fairings, and chrome.",
    longDescription:
      "Specialized care for motorcycles with attention to delicate finishes and tight spaces. We clean and protect painted, plastic, and metallic surfaces without over-saturating components.",
    price: "$89+",
    duration: "1.5 - 2 hours",
    highlights: [
      "Safe wash for fairings and trim",
      "Detailing around engine area",
      "Chrome and wheel cleanup",
      "Finish protection",
    ],
    featured: true,
  },
  {
    slug: "gloss-enhancement",
    name: "Gloss Enhancement",
    shortDescription: "Single-step polish to elevate clarity and shine.",
    longDescription:
      "A one-step machine polish designed to improve gloss and reduce light swirl marks. Great for vehicles that look dull but do not require full paint correction.",
    price: "$169+",
    duration: "2.5 - 4 hours",
    highlights: [
      "Paint prep and panel wipe",
      "Single-step machine polish",
      "Noticeable gloss boost",
      "Sealant protection",
    ],
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    shortDescription: "Improve clarity and nighttime visibility.",
    longDescription:
      "Cloudy headlights reduce visibility and make a vehicle look older. We polish and refine the lens, then apply a protection layer to delay oxidation return.",
    price: "$69+",
    duration: "45 - 75 min",
    highlights: [
      "Lens oxidation removal",
      "Progressive polish finish",
      "UV-protection coating",
    ],
  },
  {
    slug: "clay-bar-treatment",
    name: "Clay Bar Treatment",
    shortDescription: "Removes bonded contamination from paint surfaces.",
    longDescription:
      "If paint feels rough after a wash, this treatment removes embedded contamination and leaves the surface smooth for better shine and protection performance.",
    price: "$59+",
    duration: "45 - 90 min",
    highlights: [
      "Surface decontamination",
      "Smoother paint finish",
      "Ideal prep before polishing",
    ],
  },
  {
    slug: "scratch-removal",
    name: "Light Scratch Reduction",
    shortDescription: "Targeted correction for minor clear-coat defects.",
    longDescription:
      "Focused treatment for isolated light scratches and scuffs. We assess paint depth and correct only where safe, aiming for major visual improvement.",
    price: "$99+",
    duration: "60 - 120 min",
    highlights: [
      "Spot polishing approach",
      "Paint-safe correction workflow",
      "Before/after walkthrough",
    ],
  },
  {
    slug: "engine-bay-cleaning",
    name: "Engine Bay Refresh",
    shortDescription: "Safe cleaning and dressing for engine compartments.",
    longDescription:
      "A careful, low-moisture process to remove dirt and grime from visible engine bay areas while protecting sensitive components.",
    price: "$49+",
    duration: "30 - 50 min",
    highlights: [
      "Controlled degreasing",
      "Plastic trim dressing",
      "Neat showroom-style finish",
    ],
  },
  {
    slug: "trim-restoration",
    name: "Trim Restoration",
    shortDescription: "Revives faded exterior plastic and rubber trim.",
    longDescription:
      "Bring faded trim back to life with cleaning and restorative treatment that darkens and evens out worn surfaces.",
    price: "$59+",
    duration: "45 - 75 min",
    highlights: [
      "Deep trim cleaning",
      "Restorative darkening treatment",
      "Weather-resistant finish",
    ],
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

const contactItemsEn: QuickContactItem[] = [
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

function copyServicesWithOverrides(
  overrides: Record<string, Partial<Omit<ServiceItem, "slug">>>,
): ServiceItem[] {
  return baseServices.map((service) => {
    const patch = overrides[service.slug];
    return {
      ...service,
      ...patch,
      highlights: patch?.highlights ?? [...service.highlights],
    };
  });
}

function copyGalleryWithAlt(altList: string[]): GalleryItem[] {
  return baseGallery.map((item, index) => ({
    ...item,
    alt: altList[index] ?? item.alt,
  }));
}

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
      "Pit Crew provides high-impact interior and exterior detailing for cars, SUVs, trucks, and motorcycles.",
    primaryCta: "Get a Free Quote",
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
    title: "Featured Services",
    subtitle:
      "Start with our most requested packages or browse every detail option.",
    viewAll: "View All Services",
  },
  servicesPage: {
    title: "Detailing Packages",
    subtitle:
      "Choose the right package for your vehicle and finish level. Every service can be customized.",
    includesLabel: "Includes",
    ctaTitle: "Need help choosing a package?",
    ctaCopy:
      "Tell us your vehicle type and condition. We will recommend the right service.",
    ctaButton: "Contact Pit Crew",
  },
  serviceDetail: {
    startingAt: "Starting at",
    duration: "Estimated duration",
    includes: "What's included",
    backToServices: "Back to services",
    getQuote: "Request this service",
  },
  services: baseServices,
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
    quickContactItems: contactItemsEn,
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
    serviceFallbackOption: "Select a service",
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
  cta: {
    title: "Ready For A Better Finish?",
    subtitle:
      "Book your detailing session and get clear pricing before the appointment.",
    primary: "Book With Form",
    secondary: "Open WhatsApp",
  },
  footer: {
    rights: "All rights reserved.",
    serviceArea: "Service area: mobile coverage by appointment.",
  },
};

const es: TranslationSchema = {
  ...en,
  localeName: "Español",
  meta: {
    siteName: "Pit Crew Mobile Auto Detailing",
    tagline: "Acabado de pista, comodidad a domicilio.",
    description:
      "Detailing móvil premium con precios claros, paquetes de servicio y reserva rápida.",
  },
  nav: {
    home: "Inicio",
    services: "Servicios",
    contact: "Contacto",
    bookNow: "Reservar",
  },
  hero: {
    eyebrow: "Detailing Móvil",
    title: "Detailing premium directo en tu ubicación.",
    subtitle:
      "Pit Crew ofrece limpieza interior y exterior de alto nivel para autos, SUVs, pickups y motos.",
    primaryCta: "Solicitar Cotización",
    secondaryCta: "Ver Servicios",
    badges: ["100% Móvil", "Seguro para pintura", "Precios claros"],
  },
  about: {
    title: "Hecho Para Quienes Cuidan Cada Detalle",
    body: "Desde el primer enjuague hasta la revisión final, cada paquete sigue una checklist para mantener resultados consistentes.",
  },
  features: {
    title: "Por Qué Eligen Pit Crew",
    subtitle:
      "Una experiencia móvil enfocada en calidad, comunicación y conveniencia.",
    items: [
      {
        title: "Vamos Hasta Tu Ubicación",
        description:
          "Servicio 100% móvil en casa, oficina o parqueadero dentro de cobertura.",
      },
      {
        title: "Resultados Excepcionales",
        description:
          "Métodos seguros para pintura y cuidado interior con control de calidad final.",
      },
      {
        title: "Tu Vehículo En Buenas Manos",
        description:
          "Proceso ordenado desde la inspección inicial hasta la entrega.",
      },
      {
        title: "Experiencia Comprobada",
        description:
          "Flujo de trabajo optimizado en cientos de servicios de detailing.",
      },
      {
        title: "Productos De Nivel Profesional",
        description:
          "Compuestos premium, limpiadores pH balanceado y microfibras de calidad.",
      },
      {
        title: "Precios Accesibles",
        description:
          "Tarifas transparentes con opciones para diferentes tipos de vehículo.",
      },
    ],
  },
  servicesHome: {
    title: "Servicios Destacados",
    subtitle:
      "Empieza con los paquetes más solicitados o revisa todo el catálogo.",
    viewAll: "Ver Todos Los Servicios",
  },
  servicesPage: {
    title: "Paquetes de Detailing",
    subtitle:
      "Elige el paquete ideal según el estado y nivel de acabado de tu vehículo.",
    includesLabel: "Incluye",
    ctaTitle: "¿No sabes cuál paquete elegir?",
    ctaCopy:
      "Cuéntanos tipo de vehículo y estado actual. Te recomendamos el mejor servicio.",
    ctaButton: "Contactar Pit Crew",
  },
  serviceDetail: {
    startingAt: "Desde",
    duration: "Duración estimada",
    includes: "Incluye",
    backToServices: "Volver a servicios",
    getQuote: "Solicitar este servicio",
  },
  services: copyServicesWithOverrides({
    "total-vehicle-reset": {
      name: "Reset Total del Vehículo",
      shortDescription: "Restauración completa interior + exterior.",
    },
    "interior-reset": {
      name: "Reset Interior",
      shortDescription: "Limpieza profunda de cabina, tapicería y paneles.",
    },
    "exterior-reset": {
      name: "Reset Exterior",
      shortDescription: "Lavado seguro, descontaminación y brillo.",
    },
    "motorcycle-detail": {
      name: "Detailing de Motocicleta",
      shortDescription: "Cuidado especializado para moto, plásticos y cromados.",
    },
    "gloss-enhancement": {
      name: "Mejora de Brillo",
      shortDescription: "Pulido de una etapa para mejorar reflejo y claridad.",
    },
    "headlight-restoration": {
      name: "Restauración de Farolas",
      shortDescription: "Mejora de transparencia y visibilidad nocturna.",
    },
    "clay-bar-treatment": {
      name: "Tratamiento Clay Bar",
      shortDescription: "Remueve contaminación adherida de la pintura.",
    },
    "scratch-removal": {
      name: "Reducción de Rayones Leves",
      shortDescription: "Corrección localizada de marcas superficiales.",
    },
    "engine-bay-cleaning": {
      name: "Refresh de Motor",
      shortDescription: "Limpieza segura del compartimiento del motor.",
    },
    "trim-restoration": {
      name: "Restauración de Plásticos",
      shortDescription: "Recupera plásticos exteriores opacos o decolorados.",
    },
  }),
  testimonials: {
    title: "Opiniones de Clientes",
    subtitle: "Comentarios reales de clientes recurrentes.",
    items: [
      {
        name: "Laura P.",
        quote:
          "Llegaron puntuales y dejaron mi camioneta impecable. Servicio muy profesional.",
      },
      {
        name: "Camilo G.",
        quote:
          "Excelente detailing móvil. El resultado se mantuvo por varias semanas.",
      },
      {
        name: "Andrés M.",
        quote:
          "El interior quedó como nuevo después de un viaje largo con niños.",
      },
    ],
  },
  gallery: {
    title: "Resultados Recientes",
    subtitle: "Ejemplos de acabado y consistencia de trabajo.",
    items: copyGalleryWithAlt([
      "Resultado de detailing exterior",
      "Resultado de detailing interior",
      "Motor detallado",
      "Farolas restauradas",
      "Detailing de motocicleta",
      "Acabado con alto brillo",
    ]),
  },
  contact: {
    title: "Contacto y Reserva",
    subtitle:
      "Envíanos tu solicitud y te responderemos con disponibilidad y precio.",
    quickContactTitle: "Contacto rápido",
    quickContactItems: contactItemsEn,
    formTitle: "Cuéntanos sobre tu vehículo",
    formDescription:
      "Revisamos cada solicitud para ofrecer una cotización precisa.",
    fields: {
      name: "Nombre completo",
      phone: "Teléfono o WhatsApp",
      email: "Correo (opcional)",
      vehicleType: "Tipo de vehículo",
      serviceInterest: "Servicio de interés",
      message: "Mensaje",
    },
    placeholders: {
      name: "Juan Pérez",
      phone: "+57 300 000 0000",
      email: "tu@email.com",
      vehicleType: "SUV - Mazda CX-5",
      message: "Comparte estado actual, ubicación y fecha ideal.",
    },
    serviceFallbackOption: "Selecciona un servicio",
    submit: "Enviar Solicitud",
    submitting: "Enviando...",
    success: "Solicitud enviada. Pit Crew te contactará pronto.",
    error:
      "No pudimos procesar tu solicitud ahora. Intenta de nuevo o escríbenos por WhatsApp.",
    validation: {
      required: "Completa los campos requeridos.",
      invalidEmail: "Ingresa un correo válido.",
      minMessage: "Agrega un poco más de detalle en tu mensaje.",
    },
  },
  cta: {
    title: "¿Listo Para Mejorar El Acabado?",
    subtitle:
      "Reserva tu sesión y recibe precio claro antes de la cita.",
    primary: "Reservar con Formulario",
    secondary: "Abrir WhatsApp",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    serviceArea: "Cobertura móvil bajo cita previa.",
  },
};

const ptBr: TranslationSchema = {
  ...en,
  localeName: "Português (Brasil)",
  nav: {
    home: "Início",
    services: "Serviços",
    contact: "Contato",
    bookNow: "Agendar",
  },
  hero: {
    ...en.hero,
    eyebrow: "Estética Automotiva Móvel",
    title: "Detalhamento premium no seu endereço.",
    subtitle:
      "A Pit Crew atende carros, SUVs, picapes e motos com padrão profissional.",
    primaryCta: "Solicitar Orçamento",
    secondaryCta: "Ver Serviços",
    badges: ["100% Móvel", "Seguro para pintura", "Preço transparente"],
  },
  about: {
    title: "Feito Para Quem Repara nos Detalhes",
    body: "Cada pacote segue checklist técnico do início ao acabamento final.",
  },
  features: {
    ...en.features,
    title: "Por Que Escolher a Pit Crew",
    subtitle: "Conveniência móvel com qualidade consistente.",
  },
  servicesHome: {
    title: "Serviços em Destaque",
    subtitle: "Pacotes mais pedidos para começar rápido.",
    viewAll: "Ver Todos os Serviços",
  },
  servicesPage: {
    ...en.servicesPage,
    title: "Pacotes de Detalhamento",
    subtitle:
      "Escolha o pacote ideal para o nível de cuidado e acabamento que você precisa.",
    includesLabel: "Inclui",
    ctaTitle: "Precisa de ajuda para escolher?",
    ctaCopy:
      "Informe o tipo e a condição do veículo para recomendarmos o melhor pacote.",
    ctaButton: "Falar com a Pit Crew",
  },
  serviceDetail: {
    startingAt: "A partir de",
    duration: "Duração estimada",
    includes: "Inclui",
    backToServices: "Voltar para serviços",
    getQuote: "Solicitar este serviço",
  },
  services: copyServicesWithOverrides({
    "total-vehicle-reset": { name: "Reset Total do Veículo" },
    "interior-reset": { name: "Reset Interno" },
    "exterior-reset": { name: "Reset Externo" },
    "motorcycle-detail": { name: "Detalhamento de Moto" },
    "gloss-enhancement": { name: "Aumento de Brilho" },
    "headlight-restoration": { name: "Restauração de Faróis" },
    "clay-bar-treatment": { name: "Tratamento com Clay Bar" },
    "scratch-removal": { name: "Redução de Riscos Leves" },
    "engine-bay-cleaning": { name: "Limpeza do Cofre do Motor" },
    "trim-restoration": { name: "Restauração de Plásticos Externos" },
  }),
  testimonials: {
    ...en.testimonials,
    title: "Avaliações de Clientes",
    subtitle: "Experiências reais de clientes recorrentes.",
  },
  gallery: {
    ...en.gallery,
    title: "Resultados Recentes",
    subtitle: "Acabamento consistente em diferentes tipos de veículo.",
  },
  contact: {
    ...en.contact,
    title: "Contato e Agendamento",
    subtitle:
      "Envie sua solicitação para receber disponibilidade e orçamento.",
    quickContactTitle: "Contato rápido",
    formTitle: "Conte sobre seu veículo",
    formDescription:
      "Cada solicitação é analisada para enviar um orçamento preciso.",
    fields: {
      name: "Nome completo",
      phone: "Telefone ou WhatsApp",
      email: "E-mail (opcional)",
      vehicleType: "Tipo de veículo",
      serviceInterest: "Serviço de interesse",
      message: "Mensagem",
    },
    placeholders: {
      name: "João Silva",
      phone: "+55 (11) 90000-0000",
      email: "voce@email.com",
      vehicleType: "SUV - Jeep Compass",
      message: "Informe estado atual, local e data desejada.",
    },
    serviceFallbackOption: "Selecione um serviço",
    submit: "Enviar Solicitação",
    submitting: "Enviando...",
    success: "Solicitação enviada. A Pit Crew falará com você em breve.",
    error: "Não foi possível enviar agora. Tente novamente em instantes.",
    validation: {
      required: "Preencha os campos obrigatórios.",
      invalidEmail: "Digite um e-mail válido.",
      minMessage: "Escreva um pouco mais de detalhes.",
    },
  },
  cta: {
    title: "Pronto Para Um Acabamento Superior?",
    subtitle: "Agende seu detalhamento com preço claro desde o início.",
    primary: "Agendar com Formulário",
    secondary: "Abrir WhatsApp",
  },
  footer: {
    rights: "Todos os direitos reservados.",
    serviceArea: "Atendimento móvel com agendamento prévio.",
  },
};

const it: TranslationSchema = {
  ...en,
  localeName: "Italiano",
  nav: {
    home: "Home",
    services: "Servizi",
    contact: "Contatto",
    bookNow: "Prenota",
  },
  hero: {
    ...en.hero,
    eyebrow: "Car Detailing Mobile",
    title: "Detailing premium direttamente da te.",
    subtitle:
      "Pit Crew offre servizi professionali per auto, SUV, pick-up e moto.",
    primaryCta: "Richiedi Preventivo",
    secondaryCta: "Scopri i Servizi",
  },
  about: {
    title: "Pensato Per Chi Nota La Differenza",
    body: "Ogni intervento segue un processo preciso, dal controllo iniziale alla consegna.",
  },
  features: {
    ...en.features,
    title: "Perché Scegliere Pit Crew",
    subtitle: "Qualità costante, comunicazione chiara e comodità totale.",
  },
  servicesHome: {
    title: "Servizi in Evidenza",
    subtitle: "I pacchetti più richiesti per risultati immediati.",
    viewAll: "Vedi Tutti i Servizi",
  },
  servicesPage: {
    ...en.servicesPage,
    title: "Pacchetti Detailing",
    subtitle:
      "Scegli il pacchetto in base alle condizioni del veicolo e al livello di finitura desiderato.",
    includesLabel: "Include",
    ctaTitle: "Hai dubbi sul pacchetto?",
    ctaCopy:
      "Scrivici tipo di veicolo e condizioni attuali: ti consigliamo l'opzione migliore.",
    ctaButton: "Contatta Pit Crew",
  },
  serviceDetail: {
    startingAt: "Da",
    duration: "Durata stimata",
    includes: "Include",
    backToServices: "Torna ai servizi",
    getQuote: "Richiedi questo servizio",
  },
  services: copyServicesWithOverrides({
    "total-vehicle-reset": { name: "Reset Totale Veicolo" },
    "interior-reset": { name: "Reset Interni" },
    "exterior-reset": { name: "Reset Esterni" },
    "motorcycle-detail": { name: "Detailing Moto" },
    "gloss-enhancement": { name: "Aumento Brillantezza" },
    "headlight-restoration": { name: "Ripristino Fari" },
    "clay-bar-treatment": { name: "Trattamento Clay Bar" },
    "scratch-removal": { name: "Riduzione Graffi Leggeri" },
    "engine-bay-cleaning": { name: "Pulizia Vano Motore" },
    "trim-restoration": { name: "Ripristino Plastiche Esterne" },
  }),
  testimonials: {
    ...en.testimonials,
    title: "Recensioni Clienti",
    subtitle: "Feedback reali da clienti abituali.",
  },
  gallery: {
    ...en.gallery,
    title: "Risultati Recenti",
    subtitle: "Qualità costante su più tipologie di veicoli.",
  },
  contact: {
    ...en.contact,
    title: "Contatto e Prenotazione",
    subtitle:
      "Invia la richiesta e ricevi disponibilità e prezzo in breve tempo.",
    quickContactTitle: "Contatto rapido",
    formTitle: "Parlaci del tuo veicolo",
    formDescription:
      "Ogni richiesta viene analizzata per fornire un preventivo preciso.",
    fields: {
      name: "Nome completo",
      phone: "Telefono o WhatsApp",
      email: "Email (opzionale)",
      vehicleType: "Tipo veicolo",
      serviceInterest: "Servizio richiesto",
      message: "Messaggio",
    },
    placeholders: {
      name: "Luca Bianchi",
      phone: "+39 333 000 0000",
      email: "tuo@email.it",
      vehicleType: "SUV - Audi Q5",
      message: "Indica condizioni attuali, posizione e data preferita.",
    },
    serviceFallbackOption: "Seleziona un servizio",
    submit: "Invia Richiesta",
    submitting: "Invio in corso...",
    success: "Richiesta inviata. Ti contatteremo presto.",
    error: "Invio non riuscito. Riprova o contattaci su WhatsApp.",
    validation: {
      required: "Compila i campi obbligatori.",
      invalidEmail: "Inserisci un'email valida.",
      minMessage: "Aggiungi qualche dettaglio in più.",
    },
  },
  cta: {
    title: "Vuoi Un Livello di Finitura Superiore?",
    subtitle: "Prenota oggi e ricevi subito prezzo e disponibilità.",
    primary: "Prenota con Modulo",
    secondary: "Apri WhatsApp",
  },
  footer: {
    rights: "Tutti i diritti riservati.",
    serviceArea: "Copertura mobile su appuntamento.",
  },
};

const zhCn: TranslationSchema = {
  ...en,
  localeName: "简体中文",
  nav: {
    home: "首页",
    services: "服务",
    contact: "联系",
    bookNow: "立即预约",
  },
  hero: {
    ...en.hero,
    eyebrow: "上门汽车精洗",
    title: "高端汽车美容，直接到您所在地服务。",
    subtitle:
      "Pit Crew 提供汽车、SUV、皮卡与摩托车的专业内外饰精洗与护理服务。",
    primaryCta: "获取报价",
    secondaryCta: "查看服务",
    badges: ["上门服务", "安全护漆", "价格透明"],
  },
  about: {
    title: "为注重细节的车主而设",
    body: "从初检到交付，每一步都有标准流程，确保每次服务品质稳定。",
  },
  features: {
    ...en.features,
    title: "选择 Pit Crew 的理由",
    subtitle: "便捷、专业、稳定的移动汽车美容体验。",
  },
  servicesHome: {
    title: "热门服务",
    subtitle: "先从最受欢迎的套餐开始，或浏览全部服务。",
    viewAll: "查看全部服务",
  },
  servicesPage: {
    ...en.servicesPage,
    title: "精洗套餐",
    subtitle: "根据车辆状况与目标效果选择最合适的套餐。",
    includesLabel: "包含内容",
    ctaTitle: "不确定该选哪个套餐？",
    ctaCopy: "告诉我们车型与当前车况，我们会推荐最合适的方案。",
    ctaButton: "联系 Pit Crew",
  },
  serviceDetail: {
    startingAt: "起价",
    duration: "预计时长",
    includes: "服务内容",
    backToServices: "返回服务列表",
    getQuote: "咨询此服务",
  },
  services: copyServicesWithOverrides({
    "total-vehicle-reset": { name: "全车焕新套餐" },
    "interior-reset": { name: "内饰深度焕新" },
    "exterior-reset": { name: "外观深度焕新" },
    "motorcycle-detail": { name: "摩托车精洗" },
    "gloss-enhancement": { name: "亮度提升护理" },
    "headlight-restoration": { name: "大灯修复" },
    "clay-bar-treatment": { name: "去污泥处理" },
    "scratch-removal": { name: "轻微划痕改善" },
    "engine-bay-cleaning": { name: "发动机舱清洁" },
    "trim-restoration": { name: "外饰塑料件修复" },
  }),
  testimonials: {
    ...en.testimonials,
    title: "客户评价",
    subtitle: "来自长期客户的真实反馈。",
  },
  gallery: {
    ...en.gallery,
    title: "近期效果展示",
    subtitle: "不同车型下的施工品质与一致性。",
    items: copyGalleryWithAlt([
      "外观精洗完成效果",
      "内饰深度清洁效果",
      "发动机舱清洁效果",
      "大灯修复效果",
      "摩托车精洗效果",
      "高亮保护效果",
    ]),
  },
  contact: {
    ...en.contact,
    title: "联系与预约",
    subtitle: "提交需求后，我们将尽快回复时间与报价。",
    quickContactTitle: "快速联系",
    formTitle: "请介绍您的车辆情况",
    formDescription: "我们会逐条审核需求，给出更准确的报价与建议。",
    fields: {
      name: "姓名",
      phone: "电话或 WhatsApp",
      email: "邮箱（可选）",
      vehicleType: "车型",
      serviceInterest: "感兴趣的服务",
      message: "留言",
    },
    placeholders: {
      name: "张伟",
      phone: "+86 138 0000 0000",
      email: "you@example.com",
      vehicleType: "SUV - BMW X3",
      message: "请填写车辆现状、所在位置和希望预约日期。",
    },
    serviceFallbackOption: "请选择服务",
    submit: "提交需求",
    submitting: "提交中...",
    success: "已提交成功，我们会尽快与您联系。",
    error: "提交失败，请稍后重试或通过电话联系。",
    validation: {
      required: "请填写必填字段。",
      invalidEmail: "请输入有效邮箱地址。",
      minMessage: "请补充更多车辆信息。",
    },
  },
  cta: {
    title: "准备好让爱车焕然一新了吗？",
    subtitle: "立即预约，先确认价格再安排服务。",
    primary: "表单预约",
    secondary: "打开 WhatsApp",
  },
  footer: {
    rights: "保留所有权利。",
    serviceArea: "上门服务范围按预约安排。",
  },
};

const de: TranslationSchema = {
  ...en,
  localeName: "Deutsch",
  nav: {
    home: "Start",
    services: "Leistungen",
    contact: "Kontakt",
    bookNow: "Buchen",
  },
  hero: {
    ...en.hero,
    eyebrow: "Mobiles Auto Detailing",
    title: "Premium-Detailing direkt bei dir vor Ort.",
    subtitle:
      "Pit Crew bietet professionelle Innen- und Außenaufbereitung für Auto, SUV, Truck und Motorrad.",
    primaryCta: "Angebot anfordern",
    secondaryCta: "Leistungen ansehen",
  },
  about: {
    title: "Für Fahrer, die auf Details achten",
    body: "Jeder Service folgt einer klaren Qualitäts-Checkliste vom Start bis zur Übergabe.",
  },
  features: {
    ...en.features,
    title: "Warum Kunden Pit Crew wählen",
    subtitle: "Mobile Flexibilität, saubere Prozesse und sichtbare Ergebnisse.",
  },
  servicesHome: {
    title: "Beliebte Leistungen",
    subtitle: "Starte mit den meistgebuchten Paketen.",
    viewAll: "Alle Leistungen ansehen",
  },
  servicesPage: {
    ...en.servicesPage,
    title: "Detailing-Pakete",
    subtitle:
      "Wähle das passende Paket nach Zustand und gewünschtem Finish.",
    includesLabel: "Enthält",
    ctaTitle: "Unsicher bei der Paketauswahl?",
    ctaCopy:
      "Schicke uns Fahrzeugtyp und Zustand, wir empfehlen dir die beste Option.",
    ctaButton: "Pit Crew kontaktieren",
  },
  serviceDetail: {
    startingAt: "Ab",
    duration: "Geschätzte Dauer",
    includes: "Leistungsumfang",
    backToServices: "Zurück zu Leistungen",
    getQuote: "Dieses Paket anfragen",
  },
  services: copyServicesWithOverrides({
    "total-vehicle-reset": { name: "Komplett-Reset Fahrzeug" },
    "interior-reset": { name: "Innenraum-Reset" },
    "exterior-reset": { name: "Außen-Reset" },
    "motorcycle-detail": { name: "Motorrad-Detailing" },
    "gloss-enhancement": { name: "Glanz-Upgrade" },
    "headlight-restoration": { name: "Scheinwerfer-Aufbereitung" },
    "clay-bar-treatment": { name: "Lackknete-Behandlung" },
    "scratch-removal": { name: "Leichte Kratzer reduzieren" },
    "engine-bay-cleaning": { name: "Motorraum-Reinigung" },
    "trim-restoration": { name: "Kunststoff-Aufbereitung" },
  }),
  testimonials: {
    ...en.testimonials,
    title: "Kundenstimmen",
    subtitle: "Echtes Feedback von wiederkehrenden Kunden.",
  },
  gallery: {
    ...en.gallery,
    title: "Aktuelle Ergebnisse",
    subtitle: "Beispiele für Finish-Qualität und saubere Ausführung.",
  },
  contact: {
    ...en.contact,
    title: "Kontakt & Buchung",
    subtitle:
      "Sende deine Anfrage und erhalte zeitnah Verfügbarkeit und Preis.",
    quickContactTitle: "Schnellkontakt",
    formTitle: "Infos zu deinem Fahrzeug",
    formDescription:
      "Wir prüfen jede Anfrage persönlich für ein passendes Angebot.",
    fields: {
      name: "Vollständiger Name",
      phone: "Telefon oder WhatsApp",
      email: "E-Mail (optional)",
      vehicleType: "Fahrzeugtyp",
      serviceInterest: "Gewünschte Leistung",
      message: "Nachricht",
    },
    placeholders: {
      name: "Max Mustermann",
      phone: "+49 170 000 0000",
      email: "du@example.de",
      vehicleType: "SUV - Mercedes GLC",
      message: "Beschreibe Zustand, Standort und Wunschtermin.",
    },
    serviceFallbackOption: "Leistung auswählen",
    submit: "Anfrage senden",
    submitting: "Wird gesendet...",
    success: "Anfrage gesendet. Pit Crew meldet sich zeitnah.",
    error:
      "Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.",
    validation: {
      required: "Bitte Pflichtfelder ausfüllen.",
      invalidEmail: "Bitte eine gültige E-Mail eingeben.",
      minMessage: "Bitte etwas mehr Details in die Nachricht schreiben.",
    },
  },
  cta: {
    title: "Bereit für ein besseres Finish?",
    subtitle: "Buche jetzt und erhalte transparente Preise vor dem Termin.",
    primary: "Per Formular buchen",
    secondary: "WhatsApp öffnen",
  },
  footer: {
    rights: "Alle Rechte vorbehalten.",
    serviceArea: "Mobiler Service nach Terminvereinbarung.",
  },
};

export const translations: Record<Locale, TranslationSchema> = {
  en,
  es,
  "pt-BR": ptBr,
  it,
  "zh-CN": zhCn,
  de,
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
