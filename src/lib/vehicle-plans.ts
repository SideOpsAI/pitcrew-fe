import type { PlanSlug } from "@/types/content";

export type VehicleTypeKey = "sedan" | "small-suv" | "big-suv-minivan" | "pickup-plus";

export const vehicleTypeOrder = [
  "sedan",
  "small-suv",
  "big-suv-minivan",
  "pickup-plus",
] as const satisfies readonly VehicleTypeKey[];

export const bookingPlanPricing: Record<VehicleTypeKey, Record<PlanSlug, string>> = {
  sedan: {
    basic: "$150 USD",
    medium: "$100 USD",
    full: "$210 USD",
  },
  "small-suv": {
    basic: "$175 USD",
    medium: "$120 USD",
    full: "$230 USD",
  },
  "big-suv-minivan": {
    basic: "$190 USD",
    medium: "$130 USD",
    full: "$250 USD",
  },
  "pickup-plus": {
    basic: "$210 USD",
    medium: "$150 USD",
    full: "$270 USD",
  },
};

export const bookingPlanDurations: Record<VehicleTypeKey, Record<PlanSlug, string>> = {
  sedan: {
    basic: "2 hours",
    medium: "1 hour",
    full: "3.5 hours",
  },
  "small-suv": {
    basic: "2 hours",
    medium: "1 hour",
    full: "3.5 hours",
  },
  "big-suv-minivan": {
    basic: "2.5 hours",
    medium: "1.5 hours",
    full: "3.5 hours",
  },
  "pickup-plus": {
    basic: "2.5 hours",
    medium: "1.5 hours",
    full: "4 hours",
  },
};

export function getVehiclePlanBreakdown(planSlug: PlanSlug) {
  return vehicleTypeOrder.map((vehicleTypeKey) => ({
    vehicleTypeKey,
    price: bookingPlanPricing[vehicleTypeKey][planSlug],
    duration: bookingPlanDurations[vehicleTypeKey][planSlug],
  }));
}
