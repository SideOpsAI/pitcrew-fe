"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import {
  contactLeadSchema,
  type ContactFormState,
  type ContactLeadErrors,
} from "@/lib/contact";
import type { Locale, ServiceItem, TranslationSchema } from "@/types/content";

type ContactFormProps = {
  locale: Locale;
  labels: TranslationSchema["contact"];
  services: ServiceItem[];
};

type FormDataShape = {
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  serviceInterest: string;
  message: string;
  botField: string;
};

const initialFormData: FormDataShape = {
  name: "",
  phone: "",
  email: "",
  vehicleType: "",
  serviceInterest: "",
  message: "",
  botField: "",
};

function buildLocalizedErrors(
  rawErrors: ContactLeadErrors,
  labels: TranslationSchema["contact"],
): ContactLeadErrors {
  return {
    name: rawErrors.name ? labels.validation.required : undefined,
    phone: rawErrors.phone ? labels.validation.required : undefined,
    serviceInterest: rawErrors.serviceInterest
      ? labels.validation.required
      : undefined,
    message: rawErrors.message ? labels.validation.minMessage : undefined,
    email: rawErrors.email ? labels.validation.invalidEmail : undefined,
  };
}

export function ContactForm({ locale, labels, services }: ContactFormProps) {
  const [formData, setFormData] = useState<FormDataShape>(initialFormData);
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    errors: {},
    message: "",
  });

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.slug,
        label: service.name,
      })),
    [services],
  );

  const isSubmitting = formState.status === "submitting";

  const updateField =
    (field: keyof FormDataShape) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (formState.errors[field as keyof ContactLeadErrors]) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [field]: undefined },
          message: "",
          status: "idle",
        }));
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = contactLeadSchema.safeParse({
      ...formData,
      locale,
    });

    if (!parsed.success) {
      const rawErrors: ContactLeadErrors = {};

      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof ContactLeadErrors | undefined;
        if (path && !rawErrors[path]) {
          rawErrors[path] = issue.message;
        }
      }

      setFormState({
        status: "error",
        errors: buildLocalizedErrors(rawErrors, labels),
        message: labels.validation.required,
      });
      return;
    }

    setFormState({ status: "submitting", errors: {}, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error("submit_failed");
      }

      setFormState({
        status: "success",
        errors: {},
        message: labels.success,
      });
      setFormData(initialFormData);
    } catch {
      setFormState({
        status: "error",
        errors: {},
        message: labels.error,
      });
    }
  };

  return (
    <form
      id="contact-form"
      className="panel space-y-5 p-6 md:p-8"
      name="pitcrew-contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="pitcrew-contact" />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="bot-field">Do not fill this field</label>
        <input
          id="bot-field"
          name="bot-field"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={formData.botField}
          onChange={updateField("botField")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">
            {labels.fields.name}
          </span>
          <input
            name="name"
            value={formData.name}
            onChange={updateField("name")}
            placeholder={labels.placeholders.name}
            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
            required
          />
          {formState.errors.name ? (
            <span className="mt-1 block text-xs text-red-300">{formState.errors.name}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">
            {labels.fields.phone}
          </span>
          <input
            name="phone"
            value={formData.phone}
            onChange={updateField("phone")}
            placeholder={labels.placeholders.phone}
            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
            required
          />
          {formState.errors.phone ? (
            <span className="mt-1 block text-xs text-red-300">{formState.errors.phone}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">
            {labels.fields.email}
          </span>
          <input
            name="email"
            value={formData.email}
            onChange={updateField("email")}
            placeholder={labels.placeholders.email}
            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
            type="email"
          />
          {formState.errors.email ? (
            <span className="mt-1 block text-xs text-red-300">{formState.errors.email}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white">
            {labels.fields.vehicleType}
          </span>
          <input
            name="vehicleType"
            value={formData.vehicleType}
            onChange={updateField("vehicleType")}
            placeholder={labels.placeholders.vehicleType}
            className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-white">
          {labels.fields.serviceInterest}
        </span>
        <select
          name="serviceInterest"
          value={formData.serviceInterest}
          onChange={updateField("serviceInterest")}
          className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition focus:ring-2"
          required
        >
          <option value="">{labels.serviceFallbackOption}</option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        {formState.errors.serviceInterest ? (
          <span className="mt-1 block text-xs text-red-300">
            {formState.errors.serviceInterest}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-white">
          {labels.fields.message}
        </span>
        <textarea
          name="message"
          value={formData.message}
          onChange={updateField("message")}
          placeholder={labels.placeholders.message}
          className="min-h-36 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
          required
        />
        {formState.errors.message ? (
          <span className="mt-1 block text-xs text-red-300">{formState.errors.message}</span>
        ) : null}
      </label>

      {formState.message ? (
        <p
          className={`text-sm ${
            formState.status === "success" ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {formState.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
