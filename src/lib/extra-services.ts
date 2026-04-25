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
  ],
};
