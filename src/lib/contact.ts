import { z } from "zod";

import { locales } from "@/lib/locales";
import type { ContactLeadInput, FormStatus, PlanSlug } from "@/types/content";

const planSlugs = ["basic", "medium", "full"] as const satisfies readonly PlanSlug[];

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
      }

      if (!data.cityArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cityArea"],
          message: "City/area is required",
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

