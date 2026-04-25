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
  { label: "Phone", value: "+1 (603) 205-1026", href: "tel:+16032051026" },
  {
    label: "WhatsApp",
    value: "+1 (603) 205-1026",
    href: "https://wa.me/16032051026?text=Hola%2C%20quiero%20reservar%20un%20detailing.",
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
      name: "INTERIOR",
      shortDescription: "Maintenance wash with quick interior refresh.",
      longDescription:
        "Great for weekly or bi-weekly maintenance. Exterior hand wash, tire dressing, and a fast cabin reset so your vehicle stays clean between deeper sessions.",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 hours",
      highlights: [
        "Interior deep vacuum and plastics detail",
        "Carpet and mat treatment",
        "Exterior decontamination + gloss protection",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "EXTERIOR",
      shortDescription: "Deep clean for interior + enhanced exterior finish.",
      longDescription:
        "Balanced package for drivers who want visible transformation. Includes deeper interior cleaning, decontamination touchpoints, and longer-lasting shine.",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 hours",
      highlights: [
        "Foam wash and hand dry",
        "Wheel face and tire dressing",
        "Quick vacuum and wipe-down",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "Complete premium detail with maximum finish quality.",
      longDescription:
        "Our most complete package for vehicles needing a full reset. Deep interior detailing, exterior decontamination, gloss enhancement, and protection from top to bottom.",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 hours",
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
      name: "PLAN INTERIOR",
      shortDescription: "Lavado de mantenimiento y refresh interior rápido.",
      longDescription:
        "Ideal para mantenimiento semanal o quincenal. Lavado exterior a mano, brillo en llantas y limpieza ligera de cabina.",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 horas",
      highlights: [
        "Aspirado profundo y detalle de plásticos",
        "Tratamiento de tapetes y alfombras",
        "Descontaminación y protección de brillo",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "PLAN EXTERIOR",
      shortDescription: "Limpieza profunda interior + mejor acabado exterior.",
      longDescription:
        "Paquete balanceado para lograr cambio visible. Incluye limpieza interior profunda y mejor protección exterior.",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 horas",
      highlights: [
        "Lavado con espuma y secado a mano",
        "Limpieza de rines y llantas",
        "Aspirado y limpieza rápida interior",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "Detailing premium completo con máximo nivel de acabado.",
      longDescription:
        "Nuestro paquete más completo para reset total del vehículo. Interior y exterior con procesos detallados y protección duradera.",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 horas",
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
      name: "PLANO INTERIOR",
      shortDescription: "Lavagem de manutenção com limpeza interna rápida.",
      longDescription:
        "Ideal para manutenção semanal. Lavagem externa, acabamento dos pneus e organização rápida da cabine.",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 horas",
      highlights: [
        "Aspiração profunda e detalhes internos",
        "Tratamento de tapetes",
        "Descontaminação externa e proteção",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "PLANO EXTERIOR",
      shortDescription: "Limpeza interna profunda e acabamento externo superior.",
      longDescription:
        "Pacote equilibrado para quem quer transformação visível com mais cuidado em interior e proteção externa.",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 horas",
      highlights: [
        "Lavagem com espuma e secagem manual",
        "Limpeza de rodas e pneus",
        "Aspiração rápida interna",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "Detalhamento premium completo com acabamento máximo.",
      longDescription:
        "Nosso pacote mais completo para reset total. Processo completo de interior e exterior com proteção duradoura.",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 horas",
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
      name: "PIANO INTERIOR",
      shortDescription: "Lavaggio di mantenimento con refresh interno rapido.",
      longDescription:
        "Perfetto per mantenere l'auto pulita ogni settimana con lavaggio esterno e riordino rapido dell'abitacolo.",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 ore",
      highlights: [
        "Pulizia interna dettagliata",
        "Trattamento tappetini",
        "Decontaminazione esterna e protezione",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "PIANO EXTERIOR",
      shortDescription: "Pulizia interna profonda + finitura esterna migliorata.",
      longDescription:
        "Pacchetto bilanciato per ottenere un miglioramento evidente con cura più approfondita di interni ed esterni.",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 ore",
      highlights: [
        "Lavaggio esterno a mano",
        "Pulizia ruote e gomme",
        "Aspirazione interna rapida",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "Detailing premium completo con finitura massima.",
      longDescription:
        "Il pacchetto più completo per un reset totale del veicolo con workflow completo interno/esterno.",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 ore",
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
      name: "INTERIOR",
      shortDescription: "??????,????????",
      longDescription:
        "?????????????????????????????",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 ??",
      highlights: [
        "???????????",
        "???????",
        "?????????",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "EXTERIOR",
      shortDescription: "?????? + ???????",
      longDescription:
        "?????,?????????????,????????????",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 ??",
      highlights: [
        "?????????",
        "?????????",
        "?????????",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "??????,?????????",
      longDescription:
        "??????????,????????????????????",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 ??",
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
      name: "INTERIOR",
      shortDescription: "Pflegewäsche mit schnellem Innenraum-Refresh.",
      longDescription:
        "Ideal für regelmäßige Pflege. Außenwäsche, Reifenfinish und schnelle Innenraumreinigung.",
      price: "$150 - $210 USD",
      duration: "2 - 2.5 Std",
      highlights: [
        "Innenraum-Tiefenreinigung",
        "Matten- und Teppichbehandlung",
        "Außen-Decontamination und Schutz",
      ],
      featured: true,
    },
    {
      slug: "medium",
      name: "EXTERIOR",
      shortDescription: "Tiefenreinigung innen + verbessertes Außenfinish.",
      longDescription:
        "Ausgewogenes Paket für sichtbare Verbesserung mit stärkerem Fokus auf Innenraum und Lackbild.",
      price: "$100 - $150 USD",
      duration: "1 - 1.5 Std",
      highlights: [
        "Handwäsche mit Schaum",
        "Felgen- und Reifenpflege",
        "Schnelles Saugen innen",
      ],
      featured: true,
    },
    {
      slug: "full",
      name: "FULL DETAIL",
      shortDescription: "Komplettes Premium-Detailing mit maximalem Finish.",
      longDescription:
        "Unser umfassendstes Paket für den kompletten Fahrzeug-Reset mit Premium-Schutz.",
      price: "$210 - $270 USD",
      duration: "3.5 - 4 Std",
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
      subtitle:
        "Pit Crew ofrece detailing interior y exterior de alto impacto para autos, SUVs y camionetas.",
      primaryCta: "Reservar Ahora",
      secondaryCta: "Ver Planes",
      badges: ["Totalmente movil", "Seguro para pintura", "Precios transparentes"],
    },
    about: {
      title: "Hecho para conductores que notan los detalles",
      body: "Desde el primer enjuague hasta el acabado final, cada paquete sigue un control de calidad para mantener resultados consistentes en cada visita.",
    },
    features: {
      title: "Por que clientes eligen Pit Crew",
      subtitle: "Una experiencia movil centrada en calidad, comunicacion y conveniencia.",
      items: [
        {
          title: "Vamos hasta ti",
          description: "Servicio 100% movil en casa, oficina o parqueadero dentro del area de cobertura.",
        },
        {
          title: "Calidad excepcional",
          description: "Metodos seguros para pintura, detalle interior preciso y control final de calidad.",
        },
        {
          title: "Tu auto en buenas manos",
          description: "Proceso estructurado desde la inspeccion inicial hasta la entrega final.",
        },
        {
          title: "Experiencia comprobada",
          description: "Flujo de trabajo perfeccionado en cientos de sesiones de detailing.",
        },
        {
          title: "Productos grado profesional",
          description: "Compuestos premium, limpiadores balanceados y acabados seguros para microfibra.",
        },
        {
          title: "Paquetes accesibles",
          description: "Opciones simples y transparentes: Basico, Medio y Full.",
        },
      ],
    },
    servicesHome: {
      title: "Planes destacados",
      subtitle: "Elige Basico, Medio o Full segun la condicion de tu vehiculo.",
      viewAll: "Ver todos los planes",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Planes de Detailing",
      subtitle: "Tres planes claros: Básico, Medio y Full.",
      includesLabel: "Incluye",
      ctaTitle: "Necesitas ayuda para elegir un plan?",
      ctaCopy: "Abre el booking y te recomendamos el plan ideal para tu vehiculo.",
      ctaButton: "Reservar",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Volver a planes",
      viewDetails: "Ver detalle del plan",
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
      subtitle:
        "A Pit Crew oferece detalhamento interno e externo de alto impacto para carros, SUVs e caminhonetes.",
      primaryCta: "Agendar Agora",
      secondaryCta: "Ver Planos",
      badges: ["Totalmente movel", "Seguro para pintura", "Preco transparente"],
    },
    about: {
      title: "Feito para quem percebe os detalhes",
      body: "Do primeiro enxague ao acabamento final, cada pacote segue um checklist de qualidade para manter consistencia em todas as visitas.",
    },
    features: {
      title: "Por que clientes escolhem a Pit Crew",
      subtitle: "Uma experiencia movel focada em qualidade, comunicacao e conveniencia.",
      items: [
        {
          title: "Vamos ate voce",
          description: "Servico totalmente movel em casa, trabalho ou estacionamento da sua area.",
        },
        {
          title: "Qualidade excepcional",
          description: "Metodos seguros para pintura, cuidado interno preciso e revisao final.",
        },
        {
          title: "Seu carro em boas maos",
          description: "Processo organizado da inspecao inicial ate a entrega final.",
        },
        {
          title: "Experiencia comprovada",
          description: "Fluxo de trabalho refinado em centenas de atendimentos de detalhamento.",
        },
        {
          title: "Produtos profissionais",
          description: "Compostos premium, limpadores balanceados e acabamento seguro para microfibra.",
        },
        {
          title: "Pacotes acessiveis",
          description: "Opcoes transparentes e diretas: Basico, Medio e Full.",
        },
      ],
    },
    servicesHome: {
      title: "Planos em destaque",
      subtitle: "Escolha Basico, Medio ou Full conforme a condicao do seu veiculo.",
      viewAll: "Ver todos os planos",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Planos de Detalhamento",
      subtitle: "Três opções claras: Básico, Médio e Full.",
      includesLabel: "Inclui",
      ctaTitle: "Precisa de ajuda para escolher um plano?",
      ctaCopy: "Abra o booking e recomendaremos o plano ideal para seu veiculo.",
      ctaButton: "Agendar",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Voltar para planos",
      viewDetails: "Ver detalhes do plano",
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
      subtitle:
        "Pit Crew offre detailing interno ed esterno ad alto impatto per auto, SUV e pickup.",
      primaryCta: "Prenota Ora",
      secondaryCta: "Vedi Piani",
      badges: ["Completamente mobile", "Sicuro per la vernice", "Prezzi trasparenti"],
    },
    about: {
      title: "Pensato per chi nota i dettagli",
      body: "Dal primo risciacquo alla finitura finale, ogni pacchetto segue un controllo qualita per garantire risultati costanti a ogni visita.",
    },
    features: {
      title: "Perche i clienti scelgono Pit Crew",
      subtitle: "Un'esperienza mobile basata su qualita, comunicazione e comodita.",
      items: [
        {
          title: "Arriviamo noi da te",
          description: "Servizio mobile a casa, in ufficio o nel parcheggio della tua area.",
        },
        {
          title: "Qualita eccezionale",
          description: "Metodi sicuri per la vernice, cura interna precisa e controllo finale.",
        },
        {
          title: "La tua auto in ottime mani",
          description: "Processo strutturato dall'ispezione iniziale alla consegna finale.",
        },
        {
          title: "Esperienza concreta",
          description: "Workflow perfezionato in centinaia di sessioni di detailing.",
        },
        {
          title: "Prodotti professionali",
          description: "Composti premium, detergenti bilanciati e finiture sicure per microfibra.",
        },
        {
          title: "Pacchetti convenienti",
          description: "Opzioni semplici e trasparenti: Basic, Medium e Full.",
        },
      ],
    },
    servicesHome: {
      title: "Piani in evidenza",
      subtitle: "Scegli Basic, Medium o Full in base alle condizioni del veicolo.",
      viewAll: "Vedi tutti i piani",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Piani Detailing",
      subtitle: "Tre piani chiari: Basic, Medium e Full.",
      includesLabel: "Include",
      ctaTitle: "Hai bisogno di aiuto per scegliere un piano?",
      ctaCopy: "Apri il booking e ti consigliamo il piano giusto per il tuo veicolo.",
      ctaButton: "Prenota",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Torna ai piani",
      viewDetails: "Vedi dettagli del piano",
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
      subtitle:
        "Pit Crew wei jiaoche, SUV he kache tigong gaobiaozhun neiwai qingjie fuwu.",
      primaryCta: "????",
      secondaryCta: "????",
      badges: ["Quan yidong fuwu", "Anquan huqi", "Jiage touming"],
    },
    about: {
      title: "Wei zhongshi xijie de chezhu er sheji",
      body: "Cong shouci chongxi dao zuihou shiguang, mei ge taocan dou zunjun zhiliang jiancha liucheng, baozheng meici fuwu de yizhi xiaoguo.",
    },
    features: {
      title: "Weihe xuanze Pit Crew",
      subtitle: "Yi pinzhi, goutong he bianjie wei hexin de yidong xiche tiyan.",
      items: [
        {
          title: "Women shangmen fuwu",
          description: "Zai ni de jia, bangongdi dian huo tingchechang tigong quan yidong fuwu.",
        },
        {
          title: "Zhuoyue pinzhi",
          description: "Anquan huqi cheqi de gongfa, jingxi neishi qingjie he jiaofu qian zuihou jiancha.",
        },
        {
          title: "Nide che zai anquan shouzhong",
          description: "Cong jiancha dao jiaofu de biaozhunhua liucheng, quancheng qingxi goutong.",
        },
        {
          title: "Jingyan fengfu",
          description: "Liucheng jingguo da liang meirong anli de fanfu youhua.",
        },
        {
          title: "Zhuanye chanpin",
          description: "Gaoduan paoguang he qingjie chanpin, pH pingheng, dui caizhi geng youhao.",
        },
        {
          title: "Jiage touming",
          description: "Taocan qingchu touming: Basic, Medium he Full.",
        },
      ],
    },
    servicesHome: {
      title: "Tuijian taocan",
      subtitle: "Genju cheliang zhuangtai xuanze Basic, Medium huo Full.",
      viewAll: "Chakan suoyou taocan",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "????",
      subtitle: "??????:?????????",
      includesLabel: "Baohan",
      ctaTitle: "Xuyao bangzhu xuanze taocan ma?",
      ctaCopy: "Dakai booking, women hui tuijian shihe nide taocan.",
      ctaButton: "????",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "????",
      viewDetails: "Chakan taocan xiangqing",
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
      subtitle:
        "Pit Crew bietet hochwertiges Innen- und Aussen-Detailing fuer Autos, SUVs und Trucks.",
      primaryCta: "Jetzt Buchen",
      secondaryCta: "Pläne ansehen",
      badges: ["Voll mobil", "Lacksicher", "Transparente Preise"],
    },
    about: {
      title: "Gemacht fuer Fahrer mit Blick fuer Details",
      body: "Vom ersten Abspritzen bis zum finalen Finish folgt jedes Paket einer klaren Qualitaets-Checkliste fuer konstant starke Ergebnisse.",
    },
    features: {
      title: "Warum Kunden Pit Crew waehlen",
      subtitle: "Ein mobiles Erlebnis mit Fokus auf Qualitaet, Kommunikation und Komfort.",
      items: [
        {
          title: "Wir kommen zu dir",
          description: "Komplett mobiler Service bei dir zu Hause, im Buero oder am Parkplatz.",
        },
        {
          title: "Erstklassige Qualitaet",
          description: "Lacksichere Methoden, praezise Innenraumpflege und finale Qualitaetskontrolle.",
        },
        {
          title: "Dein Fahrzeug in guten Haenden",
          description: "Strukturierter Ablauf von der ersten Inspektion bis zur finalen Uebergabe.",
        },
        {
          title: "Praxisbewaehrte Erfahrung",
          description: "Bewaehrter Workflow aus hunderten Detailing-Einsaetzen.",
        },
        {
          title: "Produkte in Profi-Qualitaet",
          description: "Premium-Compounds, pH-neutrale Reiniger und mikrofasersichere Finish-Produkte.",
        },
        {
          title: "Faire Pakete",
          description: "Einfach und transparent: Basic, Medium und Full.",
        },
      ],
    },
    servicesHome: {
      title: "Empfohlene Pakete",
      subtitle: "Waehle Basic, Medium oder Full je nach Zustand deines Fahrzeugs.",
      viewAll: "Alle Pakete ansehen",
    },
    servicesPage: {
      ...en.servicesPage,
      title: "Detailing-Pläne",
      subtitle: "Drei klare Optionen: Basic, Medium und Full.",
      includesLabel: "Enthaelt",
      ctaTitle: "Brauchst du Hilfe bei der Paketwahl?",
      ctaCopy: "Oeffne das Booking und wir empfehlen das passende Paket.",
      ctaButton: "Jetzt buchen",
    },
    serviceDetail: {
      ...en.serviceDetail,
      backToServices: "Zurück zu Plänen",
      viewDetails: "Paketdetails ansehen",
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

