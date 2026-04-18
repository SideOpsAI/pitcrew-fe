import { z } from "zod";

import { locales } from "@/lib/locales";
import type { ContactLeadInput, FormStatus, PlanSlug } from "@/types/content";

const planSlugs = ["basic", "medium", "full"] as const satisfies readonly PlanSlug[];
const usStateCodes = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

const usAddressPattern = /^\d+\s+[A-Za-z0-9][A-Za-z0-9\s.,'#/-]{2,}$/;
const usCityAreaPattern = /^([A-Za-z][A-Za-z\s.'-]{1,80}),\s*([A-Za-z]{2})$/;
const bookingPhonePattern = /^\+\d{1,3}\s\d{7,14}$/;

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function buildBookingPhoneValue(dialCode: string, phoneNumber: string) {
  const digits = normalizePhoneDigits(phoneNumber);
  return `${dialCode} ${digits}`.trim();
}

export function isValidBookingPhone(phone: string) {
  return bookingPhonePattern.test(phone.trim());
}

export function isValidUSAddressLine(addressLine: string) {
  const normalized = addressLine.trim();
  return usAddressPattern.test(normalized);
}

export function isValidUSCityArea(cityArea: string) {
  const normalized = cityArea.trim();
  const parsed = normalized.match(usCityAreaPattern);

  if (!parsed) {
    return false;
  }

  const stateCode = parsed[2].toUpperCase();
  return usStateCodes.has(stateCode);
}

export const bookingPlanSlugSchema = z.enum(planSlugs);

export const contactLeadSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(6).max(40),
    email: z.string().trim().email().optional().or(z.literal("")),
    vehicleType: z.string().trim().max(80).optional().or(z.literal("")),
    serviceInterest: z.string().trim().max(120).optional().or(z.literal("")),
    message: z.string().trim().max(1200).optional().or(z.literal("")),
    locale: z.enum(locales),
    botField: z.string().optional().default(""),
    captchaToken: z.string().trim().optional().default(""),
    captchaValue: z.string().trim().optional().default(""),
    source: z.enum(["contact-form", "booking-modal"]).optional().default("contact-form"),
    planSlug: bookingPlanSlugSchema.optional(),
    vehicleMakeModel: z.string().trim().max(120).optional().or(z.literal("")),
    vehicleYear: z.string().trim().max(10).optional().or(z.literal("")),
    addressLine: z.string().trim().max(180).optional().or(z.literal("")),
    cityArea: z.string().trim().max(120).optional().or(z.literal("")),
    notes: z.string().trim().max(1200).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.source === "booking-modal") {
      if (!data.planSlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["planSlug"],
          message: "Plan is required",
        });
      }

      if (!data.vehicleType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicleType"],
          message: "Vehicle type is required",
        });
      }

      if (!data.vehicleMakeModel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vehicleMakeModel"],
          message: "Vehicle model is required",
        });
      }

      if (!data.addressLine) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["addressLine"],
          message: "Address is required",
        });
      } else if (!isValidUSAddressLine(data.addressLine)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["addressLine"],
          message: "Address must be a valid US street address",
        });
      }

      if (!data.cityArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cityArea"],
          message: "City/area is required",
        });
      } else if (!isValidUSCityArea(data.cityArea)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cityArea"],
          message: "City/area must follow City, ST format",
        });
      }

      if (!isValidBookingPhone(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Phone must include country code and a valid number",
        });
      }

      if (!data.captchaToken) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["captchaToken"],
          message: "Captcha token is required",
        });
      }

      if (!data.captchaValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["captchaValue"],
          message: "Captcha value is required",
        });
      }

      return;
    }

    if (!data.serviceInterest) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceInterest"],
        message: "Service interest is required",
      });
    }

    if (!data.message || data.message.length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["message"],
        message: "Message is too short",
      });
    }
  });

export type ContactLeadPayload = z.infer<typeof contactLeadSchema>;

export type ContactLeadErrors = Partial<Record<keyof ContactLeadInput, string>>;

export type ContactFormState = {
  status: FormStatus;
  errors: ContactLeadErrors;
  message: string;
};

