import type { Locale } from "@/types/content";

export type ExtraServiceItem = {
  key: string;
  name: string;
  price: string;
  duration: string;
  details: string[];
};

export type ExtraServicesCopy = {
  title: string;
  subtitle: string;
  includesLabel: string;
};

export const extraServicesCopyByLocale: Record<Locale, ExtraServicesCopy> = {
  en: {
    title: "Extra Services",
    subtitle: "Optional add-ons you can combine with any detailing plan.",
    includesLabel: "Includes",
  },
  es: {
    title: "Servicios Extra",
    subtitle: "Add-ons opcionales que puedes combinar con cualquier plan.",
    includesLabel: "Incluye",
  },
  "pt-BR": {
    title: "Servicos Extras",
    subtitle: "Adicionais opcionais que voce pode combinar com qualquer plano.",
    includesLabel: "Inclui",
  },
  it: {
    title: "Servizi Extra",
    subtitle: "Aggiunte opzionali da combinare con qualsiasi piano.",
    includesLabel: "Include",
  },
  "zh-CN": {
    title: "Extra Services",
    subtitle: "Optional add-ons you can combine with any detailing plan.",
    includesLabel: "Includes",
  },
  de: {
    title: "Extra-Services",
    subtitle: "Optionale Zusatzleistungen, kombinierbar mit jedem Plan.",
    includesLabel: "Enthaelt",
  },
};

export const extraServicesByLocale: Record<Locale, ExtraServiceItem[]> = {
  en: [
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
        "A wax layer is applied to create a protective film over the paint.",
      ],
    },
    {
      key: "child-seat",
      name: "Child seat",
      price: "$50",
      duration: "45 min",
      details: ["Deep-cleaned, brushed, and disinfected"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 hour",
      details: [
        "Deep degreasing with premium products.",
        "Meticulous hand-brushing, agitation, and rinse.",
        "Air-pressure blow dry and heat-resistant non-greasy dressing.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 hours",
      details: [
        "Deep fabric agitation with professional rubberized brushes.",
        "High-powered vacuuming removes fur, dander, and hidden allergens.",
        "Fresh, odor-free finish for a clean cabin.",
      ],
    },
  ],
  es: [
    {
      key: "interior-steam-cleaning",
      name: "Limpieza a vapor interior",
      price: "$30",
      duration: "30 min",
      details: ["Limpieza y desinfeccion a vapor del interior"],
    },
    {
      key: "compound-polish",
      name: "Compound y polish",
      price: "$60",
      duration: "1.5 horas",
      details: [
        "Corrige imperfecciones, rayones superficiales y manchas.",
        "Se aplica una capa de cera para crear proteccion sobre la pintura.",
      ],
    },
    {
      key: "child-seat",
      name: "Silla de nino",
      price: "$50",
      duration: "45 min",
      details: ["Limpieza profunda, cepillado y desinfeccion"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 hora",
      details: [
        "Desengrase profundo con productos premium.",
        "Agitacion manual meticulosa con cepillado y enjuague.",
        "Secado con aire a presion y dressing no graso resistente al calor.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 horas",
      details: [
        "Agitacion profunda de tela con cepillos de goma profesionales.",
        "Aspirado de alta potencia para pelo, caspa y alergenos ocultos.",
        "Acabado fresco y libre de olores.",
      ],
    },
  ],
  "pt-BR": [
    {
      key: "interior-steam-cleaning",
      name: "Limpeza a vapor interna",
      price: "$30",
      duration: "30 min",
      details: ["Limpeza e desinfeccao interna a vapor"],
    },
    {
      key: "compound-polish",
      name: "Compound e polish",
      price: "$60",
      duration: "1.5 horas",
      details: [
        "Corrige imperfeicoes, remove riscos superficiais e manchas.",
        "Uma camada de cera cria uma pelicula protetora sobre a pintura.",
      ],
    },
    {
      key: "child-seat",
      name: "Cadeirinha infantil",
      price: "$50",
      duration: "45 min",
      details: ["Limpeza profunda, escovacao e desinfeccao"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 hora",
      details: [
        "Desengorduramento profundo com produtos premium.",
        "Agitacao manual meticulosa com escovacao e enxague.",
        "Secagem com ar pressurizado e acabamento nao oleoso resistente ao calor.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 horas",
      details: [
        "Agitacao profunda de tecido com escovas emborrachadas profissionais.",
        "Aspiracao de alta potencia para pelos, caspa e alergenos ocultos.",
        "Acabamento fresco e livre de odores.",
      ],
    },
  ],
  it: [
    {
      key: "interior-steam-cleaning",
      name: "Pulizia interna a vapore",
      price: "$30",
      duration: "30 min",
      details: ["Pulizia e disinfezione interna a vapore"],
    },
    {
      key: "compound-polish",
      name: "Compound e polish",
      price: "$60",
      duration: "1.5 ore",
      details: [
        "Corregge imperfezioni, rimuove graffi superficiali e macchie.",
        "Uno strato di cera crea una pellicola protettiva sulla vernice.",
      ],
    },
    {
      key: "child-seat",
      name: "Seggiolino bimbo",
      price: "$50",
      duration: "45 min",
      details: ["Pulizia profonda, spazzolatura e disinfezione"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 ora",
      details: [
        "Sgrassaggio profondo con prodotti premium.",
        "Spazzolatura manuale accurata con agitazione e risciacquo.",
        "Asciugatura ad aria compressa e dressing non grasso resistente al calore.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 ore",
      details: [
        "Agitazione profonda dei tessuti con spazzole gommate professionali.",
        "Aspirazione ad alta potenza per peli, forfora e allergeni nascosti.",
        "Finitura fresca e senza odori.",
      ],
    },
  ],
  "zh-CN": [
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
        "A wax layer is applied to create a protective film over the paint.",
      ],
    },
    {
      key: "child-seat",
      name: "Child seat",
      price: "$50",
      duration: "45 min",
      details: ["Deep-cleaned, brushed, and disinfected"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 hour",
      details: [
        "Deep degreasing with premium products.",
        "Meticulous hand-brushing, agitation, and rinse.",
        "Air-pressure blow dry and heat-resistant non-greasy dressing.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 hours",
      details: [
        "Deep fabric agitation with professional rubberized brushes.",
        "High-powered vacuuming removes fur, dander, and hidden allergens.",
        "Fresh, odor-free finish for a clean cabin.",
      ],
    },
  ],
  de: [
    {
      key: "interior-steam-cleaning",
      name: "Innenraum Dampfreinigung",
      price: "$30",
      duration: "30 min",
      details: ["Dampfreinigung und Desinfektion des Innenraums"],
    },
    {
      key: "compound-polish",
      name: "Compound und Polish",
      price: "$60",
      duration: "1.5 Std",
      details: [
        "Korrigiert Imperfektionen, entfernt leichte Kratzer und Flecken.",
        "Eine Wachsschicht bildet einen Schutzfilm auf dem Lack.",
      ],
    },
    {
      key: "child-seat",
      name: "Kindersitz",
      price: "$50",
      duration: "45 min",
      details: ["Tiefenreinigung, Buerstenreinigung und Desinfektion"],
    },
    {
      key: "engine-bay-cleaning",
      name: "ENGINE BAY CLEANING",
      price: "$50",
      duration: "1 Stunde",
      details: [
        "Tiefen-Entfettung mit Premium-Produkten.",
        "Sorgfaltige Handburstung mit Agitation und Spulung.",
        "Trocknung mit Luftdruck und nicht-fettendes, hitzebestandiges Finish.",
      ],
    },
    {
      key: "pet-hair-removal",
      name: "Pet hair removal",
      price: "$80",
      duration: "1.5 Stunden",
      details: [
        "Tiefe Textil-Agitation mit professionellen Gummibursten.",
        "Hochleistungs-Saugen fur Fell, Schuppen und versteckte Allergene.",
        "Frisches, geruchsfreies Finish.",
      ],
    },
  ],
};
