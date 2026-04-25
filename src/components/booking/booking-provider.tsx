"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  buildBookingPhoneValue,
  contactLeadSchema,
  isValidUSAddressLine,
  isValidUSCityArea,
  normalizePhoneDigits,
} from "@/lib/contact";
import {
  BOOKING_MAX_PHOTO_BYTES,
  BOOKING_MAX_TOTAL_UPLOAD_BYTES,
  bytesToRoundedMb,
} from "@/lib/booking-upload";
import {
  bookingPlanDurations,
  bookingPlanPricing,
  vehicleTypeOrder,
  type VehicleTypeKey,
} from "@/lib/vehicle-plans";
import type { ContactLeadErrors, ContactFormState } from "@/lib/contact";
import type { Locale, PlanSlug, ServiceItem, TranslationSchema } from "@/types/content";

type OpenBookingOptions = {
  planSlug?: PlanSlug;
};

type BookingContextValue = {
  openBooking: (options?: OpenBookingOptions) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

type BookingProviderProps = {
  children: ReactNode;
  locale: Locale;
  labels: TranslationSchema["bookingModal"];
  services: ServiceItem[];
};

type BookingFormData = {
  planSlug: "" | PlanSlug;
  extraServiceKeys: ExtraServiceKey[];
  vehicleTypeKey: "" | VehicleTypeKey;
  vehicleType: string;
  vehicleMakeModel: string;
  vehicleYear: string;
  addressLine: string;
  cityArea: string;
  name: string;
  phoneDialCode: string;
  phoneNumber: string;
  email: string;
  notes: string;
  botField: string;
  vehiclePhotoFront: File | null;
  vehiclePhotoSide: File | null;
  vehiclePhotoExtra: File | null;
};

type BookingTextField = Exclude<
  keyof BookingFormData,
  "vehiclePhotoFront" | "vehiclePhotoSide" | "vehiclePhotoExtra" | "extraServiceKeys"
>;
type BookingPhotoField = "vehiclePhotoFront" | "vehiclePhotoSide" | "vehiclePhotoExtra";

type CaptchaChallenge = {
  svg: string;
  token: string;
};

type CaptchaApiResponse = {
  ok: boolean;
  svg?: string;
  token?: string;
  error?: string;
  details?: string;
};

const initialFormData: BookingFormData = {
  planSlug: "",
  extraServiceKeys: [],
  vehicleTypeKey: "",
  vehicleType: "",
  vehicleMakeModel: "",
  vehicleYear: "",
  addressLine: "",
  cityArea: "",
  name: "",
  phoneDialCode: "+1",
  phoneNumber: "",
  email: "",
  notes: "",
  botField: "",
  vehiclePhotoFront: null,
  vehiclePhotoSide: null,
  vehiclePhotoExtra: null,
};

const phoneDialCodeOptions = [
  { value: "+1", label: "US (+1)" },
  { value: "+52", label: "MX (+52)" },
  { value: "+55", label: "BR (+55)" },
  { value: "+57", label: "CO (+57)" },
  { value: "+34", label: "ES (+34)" },
] as const;

type VehiclePlanOption = {
  slug: PlanSlug;
  name: string;
  description: string;
  price: string;
  duration: string;
  includes: string[];
};

type BookingFlowCopy = {
  vehicleTypeRequired: string;
  vehicleStepDescription: string;
  planStepDescription: string;
  planIncludesLabel: string;
  planDurationLabel: string;
  vehicleTypes: Record<VehicleTypeKey, string>;
  planTitles: Record<PlanSlug, string>;
  planDescriptions: Record<PlanSlug, string>;
  planIncludes: Record<PlanSlug, string[]>;
};

type BookingPhotoCopy = {
  title: string;
  subtitle: string;
  frontLabel: string;
  sideLabel: string;
  extraLabel: string;
  hint: string;
  remove: string;
};

type ExtraServiceKey = "interior-steam-cleaning" | "compound-polish" | "child-seat";

type BookingExtraServiceOption = {
  key: ExtraServiceKey;
  name: string;
  price: string;
  duration: string;
  details: string[];
};

type BookingExtraServiceCopy = {
  title: string;
  subtitle: string;
  optionalTag: string;
  noneLabel: string;
  includesLabel: string;
};

const bookingPlanOrder = ["basic", "medium", "full"] as const satisfies readonly PlanSlug[];
const bookingPhotoFields = [
  "vehiclePhotoFront",
  "vehiclePhotoSide",
  "vehiclePhotoExtra",
] as const satisfies readonly BookingPhotoField[];
const bookingPhotoLimitByPlan: Record<PlanSlug, number> = {
  basic: 1,
  medium: 2,
  full: 3,
};

const bookingExtraServiceOptions: readonly BookingExtraServiceOption[] = [
  {
    key: "interior-steam-cleaning",
    name: "Interior steam cleaning",
    price: "$30",
    duration: "30 min",
    details: ["Interior steam cleaning and disinfection"],
  },
  {
    key: "compound-polish",
    name: "Compound and polish",
    price: "$60",
    duration: "1.5 hours",
    details: [
      "Correct imperfections, remove surface scratches and stains.",
      "A layer of wax applied to the bodywork to create a protective film over the paint.",
    ],
  },
  {
    key: "child-seat",
    name: "Child seat",
    price: "$50",
    duration: "45 min",
    details: ["Deep-cleaned, brushed, and disinfected"],
  },
] as const;

const bookingExtraServiceCopy: Record<Locale, BookingExtraServiceCopy> = {
  en: {
    title: "Extra service (optional)",
    subtitle: "Add one or more extra services to your booking request.",
    optionalTag: "Optional",
    noneLabel: "No extra service",
    includesLabel: "Includes",
  },
  es: {
    title: "Servicio extra (opcional)",
    subtitle: "Agrega uno o mas servicios extra a tu solicitud de reserva.",
    optionalTag: "Opcional",
    noneLabel: "Sin servicio extra",
    includesLabel: "Incluye",
  },
  "pt-BR": {
    title: "Servico extra (opcional)",
    subtitle: "Adicione um ou mais servicos extras ao pedido de agendamento.",
    optionalTag: "Opcional",
    noneLabel: "Sem servico extra",
    includesLabel: "Inclui",
  },
  it: {
    title: "Servizio extra (opzionale)",
    subtitle: "Aggiungi uno o piu servizi extra alla richiesta di prenotazione.",
    optionalTag: "Opzionale",
    noneLabel: "Nessun servizio extra",
    includesLabel: "Include",
  },
  "zh-CN": {
    title: "Extra service (optional)",
    subtitle: "Add one or more extra services to your booking request.",
    optionalTag: "Optional",
    noneLabel: "No extra service",
    includesLabel: "Includes",
  },
  de: {
    title: "Extra-Service (optional)",
    subtitle: "Fuege deiner Buchungsanfrage einen oder mehrere Extra-Services hinzu.",
    optionalTag: "Optional",
    noneLabel: "Kein Extra-Service",
    includesLabel: "Enthaelt",
  },
};

const bookingFlowCopyEn: BookingFlowCopy = {
  vehicleTypeRequired: "Please choose an allowed vehicle type.",
  vehicleStepDescription:
    "Select your vehicle type and add your vehicle details before choosing a plan.",
  planStepDescription:
    "Choose one detailing plan. Prices and scope adjust to your selected vehicle type.",
  planIncludesLabel: "What's included",
  planDurationLabel: "Estimated duration",
  vehicleTypes: {
    sedan: "Sedan",
    "small-suv": "Small SUV",
    "big-suv-minivan": "Big SUV / Mini van",
    "pickup-plus": "Pickup trucks & plus",
  },
  planTitles: {
    basic: "INTERIOR",
    medium: "EXTERIOR",
    full: "FULL DETAIL",
  },
  planDescriptions: {
    basic: "Interior-focused detailing for cabins that need a full reset.",
    medium: "Exterior-focused detailing to refresh paint and finish quality.",
    full: "Complete interior + exterior detailing package.",
  },
  planIncludes: {
    basic: [
      "Vacuum floors, mats, cloth seats, and trunk areas",
      "Clean dash, console, door panels, seats, and rubber floor mats",
      "Apply protective products to dash, console, door panels, seats, and rubber floor mats",
      "Clean door jambs",
      "Clean glass outside",
    ],
    medium: [
      "Hand wash wheels and tires",
      "Decontaminate paint to remove bugs, tar, grime, and any kind of dirt",
      "Apply tire dressing after cleaning the tires",
      "Clean glass inside",
    ],
    full: [
      "Vacuum floors, mats, cloth seats, and trunk areas",
      "Clean dash, console, door panels, seats, and rubber floor mats",
      "Apply protective products to dash, console, door panels, seats, and rubber floor mats",
      "Clean door jambs",
      "Hand wash wheels and tires",
      "Decontaminate paint to remove bugs, tar, grime, and any kind of dirt",
      "Apply tire dressing after cleaning the tires",
      "Clean glass outside and inside",
    ],
  },
};

const bookingFlowCopy: Record<Locale, BookingFlowCopy> = {
  en: bookingFlowCopyEn,
  es: {
    vehicleTypeRequired: "Selecciona un tipo de vehiculo permitido.",
    vehicleStepDescription:
      "Selecciona el tipo de vehiculo y completa los datos antes de elegir el plan.",
    planStepDescription:
      "Elige un plan de detailing. Precio y alcance cambian segun el tipo de vehiculo.",
    planIncludesLabel: "Que incluye",
    planDurationLabel: "Duracion estimada",
    vehicleTypes: {
      sedan: "Sedan",
      "small-suv": "Small SUV",
      "big-suv-minivan": "Big SUV / Mini van",
      "pickup-plus": "Pickup trucks & plus",
    },
    planTitles: {
      basic: "INTERIOR",
      medium: "EXTERIOR",
      full: "FULL DETAIL",
    },
    planDescriptions: {
      basic: "Detailing enfocado en interior para cabinas que necesitan un reset.",
      medium: "Detailing enfocado en exterior para recuperar acabado y brillo.",
      full: "Paquete completo de detailing interior + exterior.",
    },
    planIncludes: {
      basic: [
        "Vacuum floors, mats, cloth seats, and trunk areas",
        "Clean dash, console, door panels, seats, and rubber floor mats",
        "Apply protective products to dash, console, door panels, seats, and rubber floor mats",
        "Clean door jambs",
        "Clean glass outside",
      ],
      medium: [
        "Hand wash wheels and tires",
        "Decontaminate paint to remove bugs, tar, grime, and any kind of dirt",
        "Apply tire dressing after cleaning the tires",
        "Clean glass inside",
      ],
      full: [
        "Vacuum floors, mats, cloth seats, and trunk areas",
        "Clean dash, console, door panels, seats, and rubber floor mats",
        "Apply protective products to dash, console, door panels, seats, and rubber floor mats",
        "Clean door jambs",
        "Hand wash wheels and tires",
        "Decontaminate paint to remove bugs, tar, grime, and any kind of dirt",
        "Apply tire dressing after cleaning the tires",
        "Clean glass outside and inside",
      ],
    },
  },
  "pt-BR": {
    ...bookingFlowCopyEn,
    vehicleStepDescription:
      "Selecione o tipo de veiculo e preencha os dados antes de escolher o plano.",
    planStepDescription:
      "Escolha um plano de detailing. Preco e escopo mudam pelo tipo de veiculo.",
  },
  it: {
    ...bookingFlowCopyEn,
    vehicleStepDescription:
      "Seleziona il tipo di veicolo e completa i dettagli prima di scegliere il piano.",
    planStepDescription:
      "Scegli un piano. Prezzo e servizi cambiano in base al tipo di veicolo.",
  },
  "zh-CN": {
    ...bookingFlowCopyEn,
    vehicleStepDescription:
      "Xian xuanze chexing, zai buquan cheliang xinxi, ranhou zai xuan taocan.",
    planStepDescription:
      "Xuanze taocan. Jiage he fanwei hui genju chexing bianhua.",
  },
  de: {
    ...bookingFlowCopyEn,
    vehicleStepDescription:
      "Wahle zuerst den Fahrzeugtyp und erfasse danach die Fahrzeugdetails.",
    planStepDescription:
      "Wahle einen Plan. Preis und Umfang richten sich nach dem Fahrzeugtyp.",
  },
};

const bookingPhotoCopyEn: BookingPhotoCopy = {
  title: "Vehicle photos (optional)",
  subtitle: "Upload photos so we can better estimate your detailing service.",
  frontLabel: "Front view",
  sideLabel: "Side view",
  extraLabel: "Extra / damage area",
  hint: "JPG, PNG, or WEBP. Photos are auto-optimized before upload when needed.",
  remove: "Remove",
};

const bookingPhotoCopy: Record<Locale, BookingPhotoCopy> = {
  en: bookingPhotoCopyEn,
  es: {
    title: "Fotos del vehiculo (opcional)",
    subtitle: "Sube fotos para estimar mejor tu servicio de detailing.",
    frontLabel: "Vista frontal",
    sideLabel: "Vista lateral",
    extraLabel: "Extra / zona de dano",
    hint: "JPG, PNG o WEBP. Las fotos se optimizan automaticamente antes de enviar cuando es necesario.",
    remove: "Quitar",
  },
  "pt-BR": {
    ...bookingPhotoCopyEn,
    title: "Fotos do veiculo (opcional)",
    subtitle: "Envie fotos para estimarmos melhor o servico.",
    remove: "Remover",
  },
  it: {
    ...bookingPhotoCopyEn,
    title: "Foto del veicolo (opzionale)",
    subtitle: "Carica foto per stimare meglio il servizio.",
    remove: "Rimuovi",
  },
  "zh-CN": {
    ...bookingPhotoCopyEn,
    title: "Cheliang tupian (kexuan)",
    subtitle: "Shangchuan tupian, bangzhu women gengtunjun gujia.",
    remove: "Yichu",
  },
  de: {
    ...bookingPhotoCopyEn,
    title: "Fahrzeugfotos (optional)",
    subtitle: "Lade Fotos hoch, damit wir besser einschatzen konnen.",
    remove: "Entfernen",
  },
};

function getBookingFlowCopy(locale: Locale) {
  return bookingFlowCopy[locale];
}

function getBookingPhotoCopy(locale: Locale) {
  return bookingPhotoCopy[locale];
}

function getBookingExtraServiceCopy(locale: Locale) {
  return bookingExtraServiceCopy[locale];
}

function getPhotoLimitHint(locale: Locale, planSlug: "" | PlanSlug) {
  if (!planSlug) {
    if (locale === "es") {
      return "Selecciona un plan para definir el limite de fotos.";
    }

    return "Choose a plan to define the photo upload limit.";
  }

  const maxPhotos = bookingPhotoLimitByPlan[planSlug];
  const planLabel =
    planSlug === "basic" ? "Interior" : planSlug === "medium" ? "Exterior" : "Full Detail";

  if (locale === "es") {
    return `${planLabel}: hasta ${maxPhotos} ${maxPhotos === 1 ? "foto" : "fotos"}.`;
  }

  return `${planLabel}: up to ${maxPhotos} ${maxPhotos === 1 ? "photo" : "photos"}.`;
}

function buildVehiclePlanOptions(
  locale: Locale,
  vehicleTypeKey: VehicleTypeKey,
): VehiclePlanOption[] {
  const copy = getBookingFlowCopy(locale);
  const pricing = bookingPlanPricing[vehicleTypeKey];
  const durations = bookingPlanDurations[vehicleTypeKey];

  return bookingPlanOrder.map((slug) => ({
    slug,
    name: copy.planTitles[slug],
    description: copy.planDescriptions[slug],
    price: pricing[slug],
    duration: durations[slug],
    includes: copy.planIncludes[slug],
  }));
}

const bookingFieldValidationCopy: Record<
  Locale,
  {
    usAddressInvalid: string;
    usCityStateInvalid: string;
    usAddressPlaceholder: string;
    phoneCodeLabel: string;
    phoneNumberPlaceholder: string;
    cityStatePlaceholder: string;
  }
> = {
  en: {
    usAddressInvalid: "Enter a valid US street address (example: 123 Main St).",
    usCityStateInvalid: "Use US format: City, ST (example: Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Code",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
  es: {
    usAddressInvalid:
      "Ingresa una direccion valida de EE.UU. (ejemplo: 123 Main St).",
    usCityStateInvalid: "Usa formato de EE.UU.: Ciudad, ST (ejemplo: Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Codigo",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
  "pt-BR": {
    usAddressInvalid: "Informe um endereco valido dos EUA (exemplo: 123 Main St).",
    usCityStateInvalid: "Use o formato dos EUA: Cidade, ST (exemplo: Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Codigo",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
  it: {
    usAddressInvalid: "Inserisci un indirizzo USA valido (esempio: 123 Main St).",
    usCityStateInvalid: "Usa il formato USA: Citta, ST (esempio: Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Codice",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
  "zh-CN": {
    usAddressInvalid: "Qingshuru youxiao de meiguo jiedao dizhi (li: 123 Main St).",
    usCityStateInvalid: "Qingyong meiguo geshi: City, ST (li: Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Code",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
  de: {
    usAddressInvalid: "Bitte gib eine gueltige US-Adresse ein (z. B. 123 Main St).",
    usCityStateInvalid: "Bitte nutze US-Format: Stadt, ST (z. B. Miami, FL).",
    usAddressPlaceholder: "123 Main St",
    phoneCodeLabel: "Code",
    phoneNumberPlaceholder: "5551234567",
    cityStatePlaceholder: "Miami, FL",
  },
};

const captchaMessages: Record<
  Locale,
  {
    label: string;
    required: string;
    unavailable: string;
    retry: string;
    loading: string;
    refresh: string;
    inputPlaceholder: string;
  }
> = {
  en: {
    label: "Security verification",
    required: "Please enter the captcha text before sending your booking.",
    unavailable: "Security check is not available right now. Please try again later.",
    retry: "Captcha validation failed. Please try again.",
    loading: "Loading captcha...",
    refresh: "Refresh",
    inputPlaceholder: "Type the text from the image",
  },
  es: {
    label: "Verificacion de seguridad",
    required: "Escribe el captcha antes de enviar tu reserva.",
    unavailable: "La verificacion de seguridad no esta disponible en este momento.",
    retry: "No pudimos validar el captcha. Intenta de nuevo.",
    loading: "Cargando captcha...",
    refresh: "Recargar",
    inputPlaceholder: "Escribe el texto de la imagen",
  },
  "pt-BR": {
    label: "Verificacao de seguranca",
    required: "Digite o captcha antes de enviar o agendamento.",
    unavailable: "A verificacao de seguranca nao esta disponivel agora.",
    retry: "Nao foi possivel validar o captcha. Tente novamente.",
    loading: "Carregando captcha...",
    refresh: "Atualizar",
    inputPlaceholder: "Digite o texto da imagem",
  },
  it: {
    label: "Verifica di sicurezza",
    required: "Inserisci il captcha prima di inviare la prenotazione.",
    unavailable: "La verifica di sicurezza non e disponibile in questo momento.",
    retry: "Validazione captcha non riuscita. Riprova.",
    loading: "Caricamento captcha...",
    refresh: "Ricarica",
    inputPlaceholder: "Inserisci il testo dell'immagine",
  },
  "zh-CN": {
    label: "Anquan yanzheng",
    required: "Qingxian shuru yanzhengma zai fasong.",
    unavailable: "Dangqian wu fa shiyong anquan yanzheng.",
    retry: "Yanzhengma shibai, qing chongshi.",
    loading: "Zai jiazai yanzhengma...",
    refresh: "Shuaxin",
    inputPlaceholder: "Qing shuru tupian wenzi",
  },
  de: {
    label: "Sicherheitspruefung",
    required: "Bitte gib das Captcha ein, bevor du die Buchung sendest.",
    unavailable: "Die Sicherheitspruefung ist derzeit nicht verfuegbar.",
    retry: "Captcha-Pruefung fehlgeschlagen. Bitte erneut versuchen.",
    loading: "Captcha wird geladen...",
    refresh: "Neu laden",
    inputPlaceholder: "Text aus dem Bild eingeben",
  },
};

const bookingConfirmationMessages: Record<
  Locale,
  {
    title: string;
    body: string;
    action: string;
  }
> = {
  en: {
    title: "Booking request received",
    body: "Thank you. We will contact you shortly to schedule your appointment.",
    action: "Close",
  },
  es: {
    title: "Solicitud de booking enviada",
    body: "Gracias. Te contactaremos prontamente para agendar la reunion.",
    action: "Cerrar",
  },
  "pt-BR": {
    title: "Solicitacao de agendamento enviada",
    body: "Obrigado. Vamos entrar em contato em breve para agendar a reuniao.",
    action: "Fechar",
  },
  it: {
    title: "Richiesta di prenotazione inviata",
    body: "Grazie. Ti contatteremo a breve per programmare l'appuntamento.",
    action: "Chiudi",
  },
  "zh-CN": {
    title: "Booking request received",
    body: "Thank you. We will contact you shortly to schedule your appointment.",
    action: "Close",
  },
  de: {
    title: "Buchungsanfrage gesendet",
    body: "Danke. Wir melden uns in Kurze, um den Termin zu planen.",
    action: "Schliessen",
  },
};

const bookingUiMessages: Record<
  Locale,
  {
    stepLabel: string;
    sendingLabel: string;
    confirmationEyebrow: string;
  }
> = {
  en: {
    stepLabel: "Step",
    sendingLabel: "Sending...",
    confirmationEyebrow: "Booking",
  },
  es: {
    stepLabel: "Paso",
    sendingLabel: "Enviando...",
    confirmationEyebrow: "Reserva",
  },
  "pt-BR": {
    stepLabel: "Etapa",
    sendingLabel: "Enviando...",
    confirmationEyebrow: "Agendamento",
  },
  it: {
    stepLabel: "Passo",
    sendingLabel: "Invio...",
    confirmationEyebrow: "Prenotazione",
  },
  "zh-CN": {
    stepLabel: "Buzhou",
    sendingLabel: "Fasong zhong...",
    confirmationEyebrow: "Yuyue",
  },
  de: {
    stepLabel: "Schritt",
    sendingLabel: "Wird gesendet...",
    confirmationEyebrow: "Buchung",
  },
};

const bookingPhotoValidationCopy: Record<
  Locale,
  {
    fileTooLarge: (fileName: string, maxMb: number) => string;
    totalTooLarge: (maxMb: number) => string;
    optimizeFailed: string;
  }
> = {
  en: {
    fileTooLarge: (fileName, maxMb) =>
      `The file "${fileName}" is too large. Max size per photo: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `The total photo size is too large. Upload lighter images (max total: ${maxMb} MB).`,
    optimizeFailed: "We could not optimize your photos. Please retry with lighter images.",
  },
  es: {
    fileTooLarge: (fileName, maxMb) =>
      `El archivo "${fileName}" es muy grande. Tamano maximo por foto: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `El tamano total de fotos es muy grande. Sube imagenes mas livianas (maximo total: ${maxMb} MB).`,
    optimizeFailed: "No pudimos optimizar las fotos. Intenta nuevamente con imagenes mas livianas.",
  },
  "pt-BR": {
    fileTooLarge: (fileName, maxMb) =>
      `O arquivo "${fileName}" e muito grande. Tamanho maximo por foto: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `O tamanho total das fotos e muito grande. Envie imagens menores (maximo total: ${maxMb} MB).`,
    optimizeFailed: "Nao foi possivel otimizar as fotos. Tente novamente com imagens menores.",
  },
  it: {
    fileTooLarge: (fileName, maxMb) =>
      `Il file "${fileName}" e troppo grande. Dimensione massima per foto: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `La dimensione totale delle foto e troppo grande. Carica immagini piu leggere (totale massimo: ${maxMb} MB).`,
    optimizeFailed: "Non siamo riusciti a ottimizzare le foto. Riprova con immagini piu leggere.",
  },
  "zh-CN": {
    fileTooLarge: (fileName, maxMb) =>
      `The file "${fileName}" is too large. Max size per photo: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `The total photo size is too large. Upload lighter images (max total: ${maxMb} MB).`,
    optimizeFailed: "We could not optimize your photos. Please retry with lighter images.",
  },
  de: {
    fileTooLarge: (fileName, maxMb) =>
      `Die Datei "${fileName}" ist zu gross. Maximale Groesse pro Foto: ${maxMb} MB.`,
    totalTooLarge: (maxMb) =>
      `Die Gesamtgroesse der Fotos ist zu hoch. Bitte kleinere Bilder hochladen (maximal gesamt: ${maxMb} MB).`,
    optimizeFailed: "Die Fotos konnten nicht optimiert werden. Bitte versuche es mit kleineren Bildern erneut.",
  },
};

const bookingCloseGuardCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
    cancel: string;
    confirm: string;
  }
> = {
  en: {
    eyebrow: "Unsaved Booking",
    title: "Close booking form?",
    body: "If you close now, the entered data will be lost.",
    cancel: "Keep editing",
    confirm: "Close anyway",
  },
  es: {
    eyebrow: "Reserva Sin Guardar",
    title: "Cerrar formulario de reserva?",
    body: "Si cierras ahora, se perderan los datos ingresados.",
    cancel: "Seguir editando",
    confirm: "Cerrar de todos modos",
  },
  "pt-BR": {
    eyebrow: "Agendamento Nao Salvo",
    title: "Fechar formulario de agendamento?",
    body: "Se fechar agora, os dados inseridos serao perdidos.",
    cancel: "Continuar editando",
    confirm: "Fechar mesmo assim",
  },
  it: {
    eyebrow: "Prenotazione Non Salvata",
    title: "Chiudere il modulo di prenotazione?",
    body: "Se chiudi ora, i dati inseriti andranno persi.",
    cancel: "Continua a modificare",
    confirm: "Chiudi comunque",
  },
  "zh-CN": {
    eyebrow: "Unsaved Booking",
    title: "Close booking form?",
    body: "If you close now, the entered data will be lost.",
    cancel: "Keep editing",
    confirm: "Close anyway",
  },
  de: {
    eyebrow: "Ungespeicherte Buchung",
    title: "Buchungsformular schliessen?",
    body: "Wenn du jetzt schliesst, gehen die eingegebenen Daten verloren.",
    cancel: "Weiter bearbeiten",
    confirm: "Trotzdem schliessen",
  },
};

function getCaptchaMessages(locale: Locale) {
  return captchaMessages[locale];
}

function getBookingFieldValidationCopy(locale: Locale) {
  return bookingFieldValidationCopy[locale];
}

function getBookingConfirmationMessages(locale: Locale) {
  return bookingConfirmationMessages[locale];
}

function getBookingUiMessages(locale: Locale) {
  return bookingUiMessages[locale];
}

function getBookingPhotoValidationCopy(locale: Locale) {
  return bookingPhotoValidationCopy[locale];
}

function getStepTitle(step: number, labels: TranslationSchema["bookingModal"]) {
  if (step === 1) return labels.steps.vehicleInfo;
  if (step === 2) return labels.steps.choosePlan;
  return labels.steps.locationContact;
}

function isFocusable(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && !node.hasAttribute("disabled");
}

function replaceFileExtension(fileName: string, extension: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
  return `${baseName}.${extension}`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("image_load_failed"));
    };

    image.src = imageUrl;
  });
}

function drawCompressedBlob({
  image,
  quality,
  maxEdge,
}: {
  image: HTMLImageElement;
  quality: number;
  maxEdge: number;
}) {
  const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = longestEdge > maxEdge ? maxEdge / longestEdge : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return Promise.resolve<Blob | null>(null);
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

async function compressImageToTarget(file: File, targetBytes: number) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  let image: HTMLImageElement;
  try {
    image = await loadImageElement(file);
  } catch {
    return file;
  }
  let quality = 0.88;
  let maxEdge = 2400;
  let bestBlob: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const blob = await drawCompressedBlob({ image, quality, maxEdge });
    if (!blob) {
      break;
    }

    if (!bestBlob || blob.size < bestBlob.size) {
      bestBlob = blob;
    }

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      break;
    }

    if (quality > 0.5) {
      quality -= 0.1;
    } else {
      maxEdge = Math.max(1280, Math.round(maxEdge * 0.85));
    }
  }

  if (!bestBlob || bestBlob.size >= file.size) {
    return file;
  }

  return new File([bestBlob], replaceFileExtension(file.name, "jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

async function optimizePhotoEntriesForUpload(
  entries: Array<{ field: BookingPhotoField; file: File }>,
  limits: {
    maxSingleBytes: number;
    maxTotalBytes: number;
  },
) {
  const firstPass = await Promise.all(
    entries.map(async (entry) => {
      if (entry.file.size <= limits.maxSingleBytes) {
        return entry;
      }

      const compressed = await compressImageToTarget(entry.file, limits.maxSingleBytes);
      return { ...entry, file: compressed };
    }),
  );

  const firstPassTotal = firstPass.reduce((sum, entry) => sum + entry.file.size, 0);
  if (firstPassTotal <= limits.maxTotalBytes) {
    return firstPass;
  }

  const dynamicTargetPerFile = Math.max(
    Math.floor(limits.maxTotalBytes / firstPass.length) - 150 * 1024,
    900 * 1024,
  );

  return Promise.all(
    firstPass.map(async (entry) => {
      if (entry.file.size <= dynamicTargetPerFile) {
        return entry;
      }

      const recompressed = await compressImageToTarget(entry.file, dynamicTargetPerFile);
      return { ...entry, file: recompressed };
    }),
  );
}

function BookingModal({
  isOpen,
  onClose,
  locale,
  labels,
  services,
  preselectedPlan,
  onBooked,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  labels: TranslationSchema["bookingModal"];
  services: ServiceItem[];
  preselectedPlan: PlanSlug | null;
  onBooked: () => void;
}) {
  const MAX_SINGLE_PHOTO_SIZE_BYTES = BOOKING_MAX_PHOTO_BYTES;
  const MAX_TOTAL_PHOTO_SIZE_BYTES = BOOKING_MAX_TOTAL_UPLOAD_BYTES;
  const MAX_SINGLE_PHOTO_SIZE_MB = bytesToRoundedMb(MAX_SINGLE_PHOTO_SIZE_BYTES);
  const MAX_TOTAL_PHOTO_SIZE_MB = bytesToRoundedMb(MAX_TOTAL_PHOTO_SIZE_BYTES);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const initialPlanSlugRef = useRef<"" | PlanSlug>("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactLeadErrors>({});
  const [isEntering, setIsEntering] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isCloseGuardOpen, setIsCloseGuardOpen] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    errors: {},
    message: "",
  });
  const captchaCopy = getCaptchaMessages(locale);
  const fieldValidationCopy = getBookingFieldValidationCopy(locale);
  const uiCopy = getBookingUiMessages(locale);
  const flowCopy = getBookingFlowCopy(locale);
  const photoCopy = getBookingPhotoCopy(locale);
  const extraServiceCopy = getBookingExtraServiceCopy(locale);
  const photoValidationCopy = getBookingPhotoValidationCopy(locale);
  const closeGuardCopy = bookingCloseGuardCopy[locale];

  const selectedVehiclePlanOptions = useMemo(
    () =>
      formData.vehicleTypeKey
        ? buildVehiclePlanOptions(locale, formData.vehicleTypeKey)
        : [],
    [formData.vehicleTypeKey, locale],
  );
  const maxPhotoCount = formData.planSlug ? bookingPhotoLimitByPlan[formData.planSlug] : 3;
  const allowedPhotoFields = bookingPhotoFields.slice(
    0,
    maxPhotoCount,
  ) as readonly BookingPhotoField[];
  const photoSlots = useMemo(
    () =>
      [
        { field: "vehiclePhotoFront" as const, label: photoCopy.frontLabel },
        { field: "vehiclePhotoSide" as const, label: photoCopy.sideLabel },
        { field: "vehiclePhotoExtra" as const, label: photoCopy.extraLabel },
      ].slice(0, maxPhotoCount),
    [maxPhotoCount, photoCopy.extraLabel, photoCopy.frontLabel, photoCopy.sideLabel],
  );
  const photoLimitHint = useMemo(() => getPhotoLimitHint(locale, formData.planSlug), [locale, formData.planSlug]);
  const selectedExtraServices = useMemo(
    () =>
      bookingExtraServiceOptions.filter((option) =>
        formData.extraServiceKeys.includes(option.key),
      ),
    [formData.extraServiceKeys],
  );

  useEffect(() => {
    setFormData((prev) => {
      const next = { ...prev };
      let changed = false;

      if (maxPhotoCount < 2 && next.vehiclePhotoSide) {
        next.vehiclePhotoSide = null;
        changed = true;
      }

      if (maxPhotoCount < 3 && next.vehiclePhotoExtra) {
        next.vehiclePhotoExtra = null;
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [maxPhotoCount]);

  const isSubmitting = formState.status === "submitting";
  const isFormDirty = useMemo(() => {
    if (formData.planSlug && formData.planSlug !== initialPlanSlugRef.current) {
      return true;
    }

    return (
      Boolean(formData.vehicleTypeKey) ||
      formData.extraServiceKeys.length > 0 ||
      Boolean(formData.vehicleType.trim()) ||
      Boolean(formData.vehicleMakeModel.trim()) ||
      Boolean(formData.vehicleYear.trim()) ||
      Boolean(formData.addressLine.trim()) ||
      Boolean(formData.cityArea.trim()) ||
      Boolean(formData.name.trim()) ||
      Boolean(formData.phoneNumber.trim()) ||
      Boolean(formData.email.trim()) ||
      Boolean(formData.notes.trim()) ||
      Boolean(formData.botField.trim()) ||
      Boolean(formData.vehiclePhotoFront) ||
      Boolean(formData.vehiclePhotoSide) ||
      Boolean(formData.vehiclePhotoExtra) ||
      Boolean(captchaInput.trim())
    );
  }, [captchaInput, formData]);

  const tryCloseModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (isFormDirty) {
      setIsCloseGuardOpen(true);
      return;
    }

    onClose();
  }, [isFormDirty, isSubmitting, onClose]);

  const keepEditingBooking = useCallback(() => {
    setIsCloseGuardOpen(false);
  }, []);

  const confirmCloseBooking = useCallback(() => {
    setIsCloseGuardOpen(false);
    onClose();
  }, [onClose]);

  const fetchCaptchaChallenge = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 10000);

    setCaptchaLoading(true);

    try {
      const response = await fetch("/api/captcha", {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      const json = (await response.json().catch(() => null)) as CaptchaApiResponse | null;

      if (!response.ok) {
        const reason =
          json?.error === "captcha_not_configured"
            ? "captcha_not_configured"
            : "captcha_unavailable";
        throw new Error(reason);
      }

      if (!json?.ok || !json.svg || !json.token) {
        throw new Error("captcha_payload_invalid");
      }

      setCaptcha({
        svg: json.svg,
        token: json.token,
      });
    } catch {
      setCaptcha(null);
    } finally {
      window.clearTimeout(timeoutId);
      setCaptchaLoading(false);
    }
  }, []);

  const resetModalState = useCallback(
    (planSlug: PlanSlug | null) => {
      initialPlanSlugRef.current = planSlug ?? "";
      setStep(1);
      setErrors({});
      setCaptcha(null);
      setCaptchaInput("");
      setCaptchaLoading(false);
      setIsCloseGuardOpen(false);
      setFormState({ status: "idle", errors: {}, message: "" });
      setFormData({
        ...initialFormData,
        planSlug: planSlug ?? "",
      });
    },
    [],
  );

  useEffect(() => {
    if (isOpen) {
      resetModalState(preselectedPlan);
    }
  }, [isOpen, preselectedPlan, resetModalState]);

  useEffect(() => {
    if (!isOpen) {
      setIsEntering(false);
      return;
    }

    setIsEntering(false);
    const frameId = window.requestAnimationFrame(() => {
      setIsEntering(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeout = window.setTimeout(() => {
      const root = dialogRef.current;
      const target = root?.querySelector<HTMLElement>("[data-autofocus='true']");
      target?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isCloseGuardOpen) {
          setIsCloseGuardOpen(false);
          return;
        }
        tryCloseModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const root = dialogRef.current;
      if (!root) {
        return;
      }

      const focusableNodes = Array.from(
        root.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ),
      ).filter(isFocusable);

      if (focusableNodes.length === 0) {
        return;
      }

      const first = focusableNodes[0];
      const last = focusableNodes[focusableNodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCloseGuardOpen, isOpen, tryCloseModal]);

  useEffect(() => {
    if (!isOpen) {
      setCaptcha(null);
      setCaptchaInput("");
      setCaptchaLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 3 || captcha || captchaLoading) {
      return;
    }

    void fetchCaptchaChallenge();
  }, [captcha, captchaLoading, fetchCaptchaChallenge, isOpen, step]);

  const updateField = (field: BookingTextField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const nextErrors = { ...prev };
      const errorField = field as keyof ContactLeadErrors;

      if (nextErrors[errorField]) {
        nextErrors[errorField] = undefined;
      }

      if (field === "phoneDialCode" || field === "phoneNumber") {
        nextErrors.phone = undefined;
      }

      return nextErrors;
    });

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const updatePhoto = (
    field: "vehiclePhotoFront" | "vehiclePhotoSide" | "vehiclePhotoExtra",
    file: File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const toggleExtraService = (serviceKey: ExtraServiceKey) => {
    setFormData((prev) => {
      const isSelected = prev.extraServiceKeys.includes(serviceKey);
      const nextExtraServiceKeys = isSelected
        ? prev.extraServiceKeys.filter((key) => key !== serviceKey)
        : [...prev.extraServiceKeys, serviceKey];

      return {
        ...prev,
        extraServiceKeys: nextExtraServiceKeys,
      };
    });

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const clearExtraServices = () => {
    setFormData((prev) => ({
      ...prev,
      extraServiceKeys: [],
    }));

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const selectVehicleType = (vehicleTypeKey: VehicleTypeKey) => {
    const selectedVehicleType = flowCopy.vehicleTypes[vehicleTypeKey];

    setFormData((prev) => ({
      ...prev,
      vehicleTypeKey,
      vehicleType: selectedVehicleType,
      planSlug:
        prev.vehicleTypeKey && prev.vehicleTypeKey !== vehicleTypeKey
          ? ""
          : prev.planSlug,
    }));

    setErrors((prev) => ({
      ...prev,
      vehicleType: undefined,
      planSlug: undefined,
    }));

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const validateStep = (targetStep: number) => {
    const nextErrors: ContactLeadErrors = {};

    if (targetStep === 1) {
      if (!formData.vehicleTypeKey) {
        nextErrors.vehicleType = flowCopy.vehicleTypeRequired;
      }

      if (!formData.vehicleMakeModel.trim()) {
        nextErrors.vehicleMakeModel = labels.validation.required;
      }
    }

    if (targetStep === 2) {
      if (!formData.planSlug) {
        nextErrors.planSlug = labels.validation.planRequired;
      }
    }

    if (targetStep === 3) {
      if (!formData.addressLine.trim()) {
        nextErrors.addressLine = labels.validation.required;
      } else if (!isValidUSAddressLine(formData.addressLine)) {
        nextErrors.addressLine = fieldValidationCopy.usAddressInvalid;
      }

      if (!formData.cityArea.trim()) {
        nextErrors.cityArea = labels.validation.required;
      } else if (!isValidUSCityArea(formData.cityArea)) {
        nextErrors.cityArea = fieldValidationCopy.usCityStateInvalid;
      }

      if (!formData.name.trim()) {
        nextErrors.name = labels.validation.required;
      }

      const bookingPhone = buildBookingPhoneValue(
        formData.phoneDialCode,
        formData.phoneNumber,
      );
      const localPhoneDigits = normalizePhoneDigits(formData.phoneNumber);
      const isNorthAmericaCode = formData.phoneDialCode === "+1";
      const hasValidLength = isNorthAmericaCode
        ? localPhoneDigits.length === 10
        : localPhoneDigits.length >= 7 && localPhoneDigits.length <= 14;

      if (!bookingPhone || !hasValidLength) {
        nextErrors.phone = labels.validation.phoneRequired;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    if (!captcha?.token) {
      setFormState({
        status: "error",
        errors: {},
        message: captchaCopy.unavailable,
      });
      return;
    }

    if (!captchaInput.trim()) {
      setFormState({
        status: "error",
        errors: {},
        message: captchaCopy.required,
      });
      return;
    }

    const selectedVehiclePlan = selectedVehiclePlanOptions.find(
      (option) => option.slug === formData.planSlug,
    );
    const fallbackService = services.find((service) => service.slug === formData.planSlug);
    const bookingPhone = buildBookingPhoneValue(
      formData.phoneDialCode,
      formData.phoneNumber,
    );
    const extraServiceLabel = selectedExtraServices.map((service) => service.name).join(", ");
    const extraServiceKeysValue = selectedExtraServices.map((service) => service.key).join(",");
    const extraServiceNamesValue = selectedExtraServices.map((service) => service.name).join(", ");
    const extraServicePricesValue = selectedExtraServices.map((service) => service.price).join(", ");
    const extraServiceDurationsValue = selectedExtraServices
      .map((service) => service.duration)
      .join(", ");
    const extraServiceDetailsValue = selectedExtraServices
      .flatMap((service) => service.details.map((detail) => `${service.name}: ${detail}`))
      .join(" | ");
    const selectedPhotoEntries = allowedPhotoFields
      .map((photoField) => ({
        field: photoField,
        file: formData[photoField],
      }))
      .filter((entry): entry is { field: BookingPhotoField; file: File } => Boolean(entry.file));

    let optimizedPhotoEntries = selectedPhotoEntries;
    try {
      optimizedPhotoEntries = await optimizePhotoEntriesForUpload(selectedPhotoEntries, {
        maxSingleBytes: MAX_SINGLE_PHOTO_SIZE_BYTES,
        maxTotalBytes: MAX_TOTAL_PHOTO_SIZE_BYTES,
      });
    } catch {
      setFormState({
        status: "error",
        errors: {},
        message: photoValidationCopy.optimizeFailed,
      });
      return;
    }

    const selectedPhotoFiles = optimizedPhotoEntries.map((entry) => entry.file);
    const oversizePhoto = selectedPhotoFiles.find(
      (file) => file.size > MAX_SINGLE_PHOTO_SIZE_BYTES,
    );

    if (oversizePhoto) {
      setFormState({
        status: "error",
        errors: {},
        message: photoValidationCopy.fileTooLarge(
          oversizePhoto.name,
          MAX_SINGLE_PHOTO_SIZE_MB,
        ),
      });
      return;
    }

    const totalPhotoSize = selectedPhotoFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalPhotoSize > MAX_TOTAL_PHOTO_SIZE_BYTES) {
      setFormState({
        status: "error",
        errors: {},
        message: photoValidationCopy.totalTooLarge(MAX_TOTAL_PHOTO_SIZE_MB),
      });
      return;
    }

    const payload = {
      name: formData.name,
      phone: bookingPhone,
      email: formData.email,
      vehicleType:
        formData.vehicleType ||
        (formData.vehicleTypeKey ? flowCopy.vehicleTypes[formData.vehicleTypeKey] : ""),
      serviceInterest: selectedVehiclePlan
        ? `${selectedVehiclePlan.name} - ${formData.vehicleType}${
            extraServiceLabel ? ` + Extras: ${extraServiceLabel}` : ""
          }`
        : fallbackService?.name ?? formData.planSlug,
      message: formData.notes || "Booking modal request",
      locale,
      botField: formData.botField,
      source: "booking-modal" as const,
      planSlug: formData.planSlug || undefined,
      vehicleTypeKey: formData.vehicleTypeKey,
      extraServiceKey: extraServiceKeysValue,
      extraServiceName: extraServiceNamesValue,
      extraServicePrice: extraServicePricesValue,
      extraServiceDuration: extraServiceDurationsValue,
      extraServiceDetails: extraServiceDetailsValue,
      vehicleMakeModel: formData.vehicleMakeModel,
      vehicleYear: formData.vehicleYear,
      addressLine: formData.addressLine,
      cityArea: formData.cityArea,
      notes: formData.notes,
      captchaToken: captcha.token,
      captchaValue: captchaInput.trim(),
    };

    const parsed = contactLeadSchema.safeParse(payload);

    if (!parsed.success) {
      setFormState({
        status: "error",
        errors,
        message: labels.validation.required,
      });
      return;
    }

    setFormState({ status: "submitting", errors: {}, message: "" });

    try {
      const body = new FormData();
      body.append("form-name", "pitcrew-contact");
      body.append("name", parsed.data.name);
      body.append("phone", parsed.data.phone);
      body.append("email", parsed.data.email ?? "");
      body.append("vehicleType", parsed.data.vehicleType ?? "");
      body.append("serviceInterest", parsed.data.serviceInterest ?? "");
      body.append("message", parsed.data.message ?? "");
      body.append("locale", parsed.data.locale);
      body.append("source", parsed.data.source);
      body.append("planSlug", parsed.data.planSlug ?? "");
      body.append("vehicleTypeKey", parsed.data.vehicleTypeKey ?? "");
      body.append("extraServiceKey", parsed.data.extraServiceKey ?? "");
      body.append("extraServiceName", parsed.data.extraServiceName ?? "");
      body.append("extraServicePrice", parsed.data.extraServicePrice ?? "");
      body.append("extraServiceDuration", parsed.data.extraServiceDuration ?? "");
      body.append("extraServiceDetails", parsed.data.extraServiceDetails ?? "");
      body.append("vehicleMakeModel", parsed.data.vehicleMakeModel ?? "");
      body.append("vehicleYear", parsed.data.vehicleYear ?? "");
      body.append("addressLine", parsed.data.addressLine ?? "");
      body.append("cityArea", parsed.data.cityArea ?? "");
      body.append("notes", parsed.data.notes ?? "");
      body.append("bot-field", "");
      body.append("captchaToken", parsed.data.captchaToken ?? "");
      body.append("captchaValue", parsed.data.captchaValue ?? "");

      optimizedPhotoEntries.forEach((entry) => {
        body.append(entry.field, entry.file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { error?: string; details?: string }
        | null;

      if (!response.ok) {
        if (responseBody?.error === "invalid_captcha") {
          setCaptchaInput("");
          await fetchCaptchaChallenge();

          setFormState({
            status: "error",
            errors: {},
            message: captchaCopy.retry,
          });
          return;
        }

        if (responseBody?.error === "payload_too_large") {
          setFormState({
            status: "error",
            errors: {},
            message:
              responseBody.details ??
              photoValidationCopy.totalTooLarge(MAX_TOTAL_PHOTO_SIZE_MB),
          });
          return;
        }

        throw new Error("submit_failed");
      }

      onBooked();
    } catch {
      setFormState({
        status: "error",
        errors: {},
        message: labels.error,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 transition-opacity duration-300 sm:items-center sm:p-4 ${
        isEntering ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className={`relative flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-none border border-white/15 bg-black shadow-2xl transition-all duration-300 ease-out sm:h-[90dvh] sm:max-h-[90dvh] sm:rounded-2xl ${
          isEntering
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-6 opacity-0 sm:translate-y-3 sm:scale-95"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {uiCopy.stepLabel} {step} / 3
            </p>
            <h2 className="mt-2 font-heading text-2xl uppercase tracking-wider text-white">
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-white/70">{getStepTitle(step, labels)}</p>
          </div>
          <button
            type="button"
            onClick={tryCloseModal}
            className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {labels.actions.close}
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white">
                    {labels.fields.vehicleType}
                  </label>
                  <p className="mt-1 text-sm text-white/70">{flowCopy.vehicleStepDescription}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {vehicleTypeOrder.map((vehicleTypeKey, index) => (
                    <button
                      key={vehicleTypeKey}
                      type="button"
                      data-autofocus={index === 0 ? "true" : undefined}
                      onClick={() => selectVehicleType(vehicleTypeKey)}
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        formData.vehicleTypeKey === vehicleTypeKey
                          ? "border-accent bg-accent/15"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <p className="font-heading text-lg uppercase tracking-wider text-white">
                        {flowCopy.vehicleTypes[vehicleTypeKey]}
                      </p>
                    </button>
                  ))}
                </div>

                {errors.vehicleType ? (
                  <p className="text-sm text-red-300">{errors.vehicleType}</p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-1">
                    <span className="mb-2 block text-sm font-semibold text-white">
                      {labels.fields.vehicleYear}
                    </span>
                    <input
                      value={formData.vehicleYear}
                      onChange={(event) => updateField("vehicleYear", event.target.value)}
                      placeholder={labels.placeholders.vehicleYear}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                    />
                  </label>

                  <label className="block sm:col-span-1">
                    <span className="mb-2 block text-sm font-semibold text-white">
                      {labels.fields.vehicleMakeModel}
                    </span>
                    <input
                      value={formData.vehicleMakeModel}
                      onChange={(event) => updateField("vehicleMakeModel", event.target.value)}
                      placeholder={labels.placeholders.vehicleMakeModel}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                    />
                    {errors.vehicleMakeModel ? (
                      <span className="mt-1 block text-xs text-red-300">{errors.vehicleMakeModel}</span>
                    ) : null}
                  </label>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white">
                    {labels.fields.plan}
                  </label>
                  <p className="mt-1 text-sm text-white/70">{flowCopy.planStepDescription}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    {formData.vehicleType}
                  </p>
                </div>

                <div className="grid gap-3">
                  {selectedVehiclePlanOptions.map((planOption, index) => (
                    <button
                      key={planOption.slug}
                      type="button"
                      data-autofocus={index === 0 ? "true" : undefined}
                      onClick={() => updateField("planSlug", planOption.slug)}
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        formData.planSlug === planOption.slug
                          ? "border-accent bg-accent/15"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-heading text-xl uppercase tracking-wider text-white">
                          {planOption.name}
                        </p>
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                            {planOption.price}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-white/55">
                            {flowCopy.planDurationLabel}: {planOption.duration}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/75">{planOption.description}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/65">
                        {flowCopy.planIncludesLabel}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-white/75">
                        {planOption.includes.map((item) => (
                          <li key={`${planOption.slug}-${item}`}>- {item}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                {errors.planSlug ? (
                  <p className="text-sm text-red-300">{errors.planSlug}</p>
                ) : null}

                <div className="rounded-xl border border-white/15 bg-black/60 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{extraServiceCopy.title}</p>
                      <p className="mt-1 text-xs text-white/65">{extraServiceCopy.subtitle}</p>
                    </div>
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      {extraServiceCopy.optionalTag}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={clearExtraServices}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        formData.extraServiceKeys.length === 0
                          ? "border-accent bg-accent/15"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-wide text-white">
                        {extraServiceCopy.noneLabel}
                      </p>
                    </button>

                    {bookingExtraServiceOptions.map((extraService) => (
                      <button
                        key={extraService.key}
                        type="button"
                        onClick={() => toggleExtraService(extraService.key)}
                        className={`rounded-xl border px-4 py-4 text-left transition ${
                          formData.extraServiceKeys.includes(extraService.key)
                            ? "border-accent bg-accent/15"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-heading text-lg uppercase tracking-wider text-white">
                            {extraService.name}
                          </p>
                          <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                              {extraService.price}
                            </p>
                            <p className="mt-1 text-[11px] uppercase tracking-wide text-white/55">
                              {flowCopy.planDurationLabel}: {extraService.duration}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/65">
                          {extraServiceCopy.includesLabel}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-white/75">
                          {extraService.details.map((detail) => (
                            <li key={`${extraService.key}-${detail}`}>- {detail}</li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.addressLine}
                  </span>
                  <input
                    data-autofocus="true"
                    value={formData.addressLine}
                    onChange={(event) => updateField("addressLine", event.target.value)}
                    placeholder={fieldValidationCopy.usAddressPlaceholder}
                    autoComplete="address-line1"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                  {errors.addressLine ? (
                    <span className="mt-1 block text-xs text-red-300">{errors.addressLine}</span>
                  ) : null}
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.cityArea}
                  </span>
                  <input
                    value={formData.cityArea}
                    onChange={(event) => updateField("cityArea", event.target.value)}
                    onBlur={(event) => {
                      const normalized = event.target.value
                        .trim()
                        .replace(/\s*,\s*/g, ", ");
                      const match = normalized.match(/^(.*),\s*([A-Za-z]{2})$/);

                      if (!match) {
                        updateField("cityArea", normalized);
                        return;
                      }

                      const city = match[1].trim().replace(/\s{2,}/g, " ");
                      const state = match[2].toUpperCase();
                      updateField("cityArea", `${city}, ${state}`);
                    }}
                    placeholder={fieldValidationCopy.cityStatePlaceholder}
                    autoComplete="address-level2"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                  {errors.cityArea ? (
                    <span className="mt-1 block text-xs text-red-300">{errors.cityArea}</span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.name}
                  </span>
                  <input
                    value={formData.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder={labels.placeholders.name}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                  {errors.name ? <span className="mt-1 block text-xs text-red-300">{errors.name}</span> : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.phone}
                  </span>
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <label className="sr-only" htmlFor="booking-phone-code">
                      {fieldValidationCopy.phoneCodeLabel}
                    </label>
                    <select
                      id="booking-phone-code"
                      value={formData.phoneDialCode}
                      onChange={(event) => updateField("phoneDialCode", event.target.value)}
                      className="rounded-xl border border-white/15 bg-black/60 px-3 py-3 text-white outline-none ring-accent transition focus:ring-2"
                    >
                      {phoneDialCodeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={formData.phoneNumber}
                      onChange={(event) => {
                        const digits = normalizePhoneDigits(event.target.value).slice(0, 14);
                        updateField("phoneNumber", digits);
                      }}
                      placeholder={fieldValidationCopy.phoneNumberPlaceholder}
                      autoComplete="tel-national"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                    />
                  </div>
                  {errors.phone ? <span className="mt-1 block text-xs text-red-300">{errors.phone}</span> : null}
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.email}
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder={labels.placeholders.email}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.notes}
                  </span>
                  <textarea
                    value={formData.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    placeholder={labels.placeholders.notes}
                    className="min-h-28 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                </label>

                <div className="rounded-xl border border-white/15 bg-black/60 p-4 sm:col-span-2">
                  <p className="text-sm font-semibold text-white">{photoCopy.title}</p>
                  <p className="mt-1 text-xs text-white/65">{photoCopy.subtitle}</p>
                  <p className="mt-1 text-xs font-semibold text-accent">{photoLimitHint}</p>
                  <p className="mt-1 text-[11px] text-white/45">{photoCopy.hint}</p>

                  <div
                    className={`mt-3 grid gap-3 ${
                      maxPhotoCount === 1
                        ? "sm:grid-cols-1"
                        : maxPhotoCount === 2
                          ? "sm:grid-cols-2"
                          : "sm:grid-cols-3"
                    }`}
                  >
                    {photoSlots.map((slot) => {
                      const selectedPhoto = formData[slot.field];

                      return (
                        <div key={slot.field} className="rounded-lg border border-white/10 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/75">
                            {slot.label}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              updatePhoto(slot.field, event.target.files?.[0] ?? null);
                            }}
                            className="mt-2 block w-full text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black"
                          />
                          {selectedPhoto ? (
                            <button
                              type="button"
                              onClick={() => updatePhoto(slot.field, null)}
                              className="mt-2 text-xs font-semibold text-accent"
                            >
                              {photoCopy.remove}: {selectedPhoto.name}
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-black/60 p-4 sm:col-span-2">
                  <p className="text-sm font-semibold text-white">{captchaCopy.label}</p>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="overflow-hidden rounded-lg border border-white/20 bg-black/80 p-2">
                      {captcha ? (
                        <div
                          className="h-[60px] w-[180px]"
                          dangerouslySetInnerHTML={{ __html: captcha.svg }}
                        />
                      ) : (
                        <div className="flex h-[60px] w-[180px] items-center justify-center text-xs text-white/60">
                          {captchaLoading ? captchaCopy.loading : captchaCopy.unavailable}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void fetchCaptchaChallenge();
                      }}
                      disabled={captchaLoading || isSubmitting}
                      className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60"
                    >
                      {captchaCopy.refresh}
                    </button>
                  </div>

                  <input
                    value={captchaInput}
                    onChange={(event) => setCaptchaInput(event.target.value)}
                    placeholder={captchaCopy.inputPlaceholder}
                    className="mt-3 w-full rounded-xl border border-white/15 bg-black/70 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                    autoComplete="off"
                  />
                </div>
              </div>
            ) : null}

            {formState.message ? (
              <p
                className={`mt-4 text-sm ${
                  formState.status === "success" ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {formState.message}
              </p>
            ) : null}
          </div>

          <div className="border-t border-white/10 p-5 sm:p-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  {labels.actions.back}
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
                >
                  {labels.actions.next}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white disabled:opacity-60"
                >
                  {isSubmitting ? uiCopy.sendingLabel : labels.actions.send}
                </button>
              )}
            </div>
          </div>
        </form>

        {isCloseGuardOpen ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-black p-6 shadow-2xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                {closeGuardCopy.eyebrow}
              </p>
              <h3 className="mt-3 font-heading text-2xl uppercase tracking-wider text-white sm:text-3xl">
                {closeGuardCopy.title}
              </h3>
              <p className="mt-4 text-sm text-white/80">{closeGuardCopy.body}</p>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={keepEditingBooking}
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-accent hover:text-accent"
                >
                  {closeGuardCopy.cancel}
                </button>
                <button
                  type="button"
                  onClick={confirmCloseBooking}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
                >
                  {closeGuardCopy.confirm}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BookingConfirmationModal({
  isOpen,
  locale,
  onClose,
}: {
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
}) {
  const copy = getBookingConfirmationMessages(locale);
  const uiCopy = getBookingUiMessages(locale);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-black p-6 shadow-2xl sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          {uiCopy.confirmationEyebrow}
        </p>
        <h3 className="mt-3 font-heading text-3xl uppercase tracking-wider text-white">{copy.title}</h3>
        <p className="mt-4 text-sm text-white/80">{copy.body}</p>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white"
          >
            {copy.action}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookingProvider({
  children,
  locale,
  labels,
  services,
}: BookingProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState<PlanSlug | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((options?: OpenBookingOptions) => {
    const activeElement = document.activeElement;
    triggerRef.current = activeElement instanceof HTMLElement ? activeElement : null;
    setIsConfirmationOpen(false);
    setPreselectedPlan(options?.planSlug ?? null);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setPreselectedPlan(null);

    window.setTimeout(() => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }, 0);
  }, []);

  const closeConfirmation = useCallback(() => {
    setIsConfirmationOpen(false);

    window.setTimeout(() => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }, 0);
  }, []);

  const handleBookingCompleted = useCallback(() => {
    setIsOpen(false);
    setPreselectedPlan(null);
    setIsConfirmationOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      openBooking,
      closeBooking,
    }),
    [openBooking, closeBooking],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBooking}
        locale={locale}
        labels={labels}
        services={services}
        preselectedPlan={preselectedPlan}
        onBooked={handleBookingCompleted}
      />
      <BookingConfirmationModal
        isOpen={isConfirmationOpen}
        locale={locale}
        onClose={closeConfirmation}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
