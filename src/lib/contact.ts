import { z } from "zod";

import { locales } from "@/lib/locales";
import type { ContactLeadInput, FormStatus } from "@/types/content";

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().optional().or(z.literal("")),
  vehicleType: z.string().trim().max(80).optional().or(z.literal("")),
  serviceInterest: z.string().trim().min(2).max(120),
  message: z.string().trim().min(12).max(1200),
  locale: z.enum(locales),
  botField: z.string().optional().default(""),
});

export type ContactLeadPayload = z.infer<typeof contactLeadSchema>;

export type ContactLeadErrors = Partial<Record<keyof ContactLeadInput, string>>;

export type ContactFormState = {
  status: FormStatus;
  errors: ContactLeadErrors;
  message: string;
};
