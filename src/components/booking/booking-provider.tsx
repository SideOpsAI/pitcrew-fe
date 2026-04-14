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

import { contactLeadSchema } from "@/lib/contact";
import type {
  ContactLeadErrors,
  ContactFormState,
} from "@/lib/contact";
import type {
  Locale,
  PlanSlug,
  ServiceItem,
  TranslationSchema,
} from "@/types/content";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "light" | "dark";
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

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
  vehicleType: string;
  vehicleMakeModel: string;
  vehicleYear: string;
  addressLine: string;
  cityArea: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  botField: string;
};

const initialFormData: BookingFormData = {
  planSlug: "",
  vehicleType: "",
  vehicleMakeModel: "",
  vehicleYear: "",
  addressLine: "",
  cityArea: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  botField: "",
};

const turnstileScriptId = "cf-turnstile-script";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const captchaMessages: Record<
  Locale,
  {
    required: string;
    unavailable: string;
    retry: string;
    loading: string;
    label: string;
  }
> = {
  en: {
    required: "Please complete the CAPTCHA before sending your booking.",
    unavailable: "Security check is not available right now. Please try again later.",
    retry: "CAPTCHA validation failed. Please complete it again and retry.",
    loading: "Loading security check...",
    label: "Security verification",
  },
  es: {
    required: "Completa el CAPTCHA antes de enviar tu reserva.",
    unavailable: "La validación de seguridad no está disponible en este momento.",
    retry: "No pudimos validar el CAPTCHA. Vuelve a completarlo e intenta otra vez.",
    loading: "Cargando validación de seguridad...",
    label: "Verificación de seguridad",
  },
  "pt-BR": {
    required: "Complete o CAPTCHA antes de enviar seu agendamento.",
    unavailable: "A verificacao de seguranca nao esta disponivel no momento.",
    retry: "Nao foi possivel validar o CAPTCHA. Complete novamente e tente de novo.",
    loading: "Carregando verificacao de seguranca...",
    label: "Verificacao de seguranca",
  },
  it: {
    required: "Completa il CAPTCHA prima di inviare la prenotazione.",
    unavailable: "Il controllo di sicurezza non e disponibile in questo momento.",
    retry: "Validazione CAPTCHA non riuscita. Completalo di nuovo e riprova.",
    loading: "Caricamento controllo di sicurezza...",
    label: "Verifica di sicurezza",
  },
  "zh-CN": {
    required: "Please complete CAPTCHA before sending.",
    unavailable: "Security verification is unavailable right now.",
    retry: "CAPTCHA verification failed. Please try again.",
    loading: "Loading security verification...",
    label: "Security verification",
  },
  de: {
    required: "Bitte CAPTCHA ausfullen, bevor du die Buchung sendest.",
    unavailable: "Die Sicherheitsprufung ist derzeit nicht verfugbar.",
    retry: "CAPTCHA-Prufung fehlgeschlagen. Bitte erneut ausfullen und versuchen.",
    loading: "Sicherheitsprufung wird geladen...",
    label: "Sicherheitsprufung",
  },
};

function getCaptchaMessages(locale: Locale) {
  return captchaMessages[locale];
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(turnstileScriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("turnstile_script_failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = turnstileScriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.loaded = "false";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error("turnstile_script_failed")),
      { once: true },
    );
    document.head.appendChild(script);
  });
}

function getStepTitle(step: number, labels: TranslationSchema["bookingModal"]) {
  if (step === 1) return labels.steps.choosePlan;
  if (step === 2) return labels.steps.vehicleInfo;
  return labels.steps.locationContact;
}

function isFocusable(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && !node.hasAttribute("disabled");
}

function BookingModal({
  isOpen,
  onClose,
  locale,
  labels,
  services,
  preselectedPlan,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  labels: TranslationSchema["bookingModal"];
  services: ServiceItem[];
  preselectedPlan: PlanSlug | null;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactLeadErrors>({});
  const [isEntering, setIsEntering] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    errors: {},
    message: "",
  });
  const captchaCopy = getCaptchaMessages(locale);

  const isSubmitting = formState.status === "submitting";

  const resetModalState = useCallback(
    (planSlug: PlanSlug | null) => {
      setStep(planSlug ? 2 : 1);
      setErrors({});
      setCaptchaToken("");
      setCaptchaReady(false);
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
        if (!isSubmitting) {
          onClose();
        }
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
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setCaptchaToken("");
    setCaptchaReady(false);

    if (typeof window === "undefined") {
      turnstileWidgetIdRef.current = null;
      return;
    }

    if (window.turnstile && turnstileWidgetIdRef.current) {
      window.turnstile.remove?.(turnstileWidgetIdRef.current);
    }

    turnstileWidgetIdRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 3 || !turnstileSiteKey) {
      return;
    }

    let cancelled = false;

    const mountTurnstile = async () => {
      try {
        await loadTurnstileScript();

        if (
          cancelled ||
          !captchaContainerRef.current ||
          !window.turnstile
        ) {
          return;
        }

        if (turnstileWidgetIdRef.current) {
          setCaptchaReady(true);
          window.turnstile.reset(turnstileWidgetIdRef.current);
          return;
        }

        const widgetId = window.turnstile.render(captchaContainerRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            setCaptchaToken(token);
          },
          "expired-callback": () => {
            setCaptchaToken("");
          },
          "error-callback": () => {
            setCaptchaToken("");
          },
          theme: "dark",
        });

        turnstileWidgetIdRef.current = widgetId;
        setCaptchaReady(true);
      } catch {
        if (!cancelled) {
          setCaptchaReady(false);
        }
      }
    };

    void mountTurnstile();

    return () => {
      cancelled = true;
    };
  }, [isOpen, step]);

  const updateField = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (formState.message) {
      setFormState((prev) => ({ ...prev, message: "", status: "idle" }));
    }
  };

  const validateStep = (targetStep: number) => {
    const nextErrors: ContactLeadErrors = {};

    if (targetStep === 1) {
      if (!formData.planSlug) {
        nextErrors.planSlug = labels.validation.planRequired;
      }
    }

    if (targetStep === 2) {
      if (!formData.vehicleType.trim()) {
        nextErrors.vehicleType = labels.validation.required;
      }

      if (!formData.vehicleMakeModel.trim()) {
        nextErrors.vehicleMakeModel = labels.validation.required;
      }
    }

    if (targetStep === 3) {
      if (!formData.addressLine.trim()) {
        nextErrors.addressLine = labels.validation.required;
      }

      if (!formData.cityArea.trim()) {
        nextErrors.cityArea = labels.validation.required;
      }

      if (!formData.name.trim()) {
        nextErrors.name = labels.validation.required;
      }

      if (!formData.phone.trim() || formData.phone.trim().length < 6) {
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

    if (!turnstileSiteKey) {
      setFormState({
        status: "error",
        errors: {},
        message: captchaCopy.unavailable,
      });
      return;
    }

    if (!captchaToken) {
      setFormState({
        status: "error",
        errors: {},
        message: captchaCopy.required,
      });
      return;
    }

    const selectedService = services.find((service) => service.slug === formData.planSlug);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      vehicleType: formData.vehicleType,
      serviceInterest: selectedService?.name ?? formData.planSlug,
      message: formData.notes || "Booking modal request",
      locale,
      botField: formData.botField,
      source: "booking-modal" as const,
      planSlug: formData.planSlug || undefined,
      vehicleMakeModel: formData.vehicleMakeModel,
      vehicleYear: formData.vehicleYear,
      addressLine: formData.addressLine,
      cityArea: formData.cityArea,
      notes: formData.notes,
      captchaToken,
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        if (responseBody?.error === "invalid_captcha") {
          setCaptchaToken("");
          if (window.turnstile && turnstileWidgetIdRef.current) {
            window.turnstile.reset(turnstileWidgetIdRef.current);
          }

          setFormState({
            status: "error",
            errors: {},
            message: captchaCopy.retry,
          });
          return;
        }

        throw new Error("submit_failed");
      }

      setFormState({
        status: "success",
        errors: {},
        message: labels.success,
      });

      window.setTimeout(() => {
        onClose();
      }, 900);
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
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className={`flex h-[100dvh] w-full max-w-2xl flex-col rounded-none border border-white/15 bg-black shadow-2xl transition-all duration-300 ease-out sm:h-auto sm:max-h-[90vh] sm:rounded-2xl ${
          isEntering
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-6 opacity-0 sm:translate-y-3 sm:scale-95"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Step {step} / 3
            </p>
            <h2 className="mt-2 font-heading text-2xl uppercase tracking-wider text-white">
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-white/70">{getStepTitle(step, labels)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) {
                onClose();
              }
            }}
            className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {labels.actions.close}
          </button>
        </div>

        <form className="flex flex-1 flex-col" onSubmit={onSubmit}>
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-white">
                  {labels.fields.plan}
                </label>
                <div className="grid gap-3">
                  {services.map((service, index) => (
                    <button
                      key={service.slug}
                      type="button"
                      data-autofocus={index === 0 ? "true" : undefined}
                      onClick={() => updateField("planSlug", service.slug)}
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        formData.planSlug === service.slug
                          ? "border-accent bg-accent/15"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <p className="font-heading text-xl uppercase tracking-wider text-white">
                        {service.name}
                      </p>
                      <p className="mt-1 text-sm text-white/75">{service.shortDescription}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">
                        {service.price}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.planSlug ? <p className="text-sm text-red-300">{errors.planSlug}</p> : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                  <span className="mb-2 block text-sm font-semibold text-white">
                    {labels.fields.vehicleType}
                  </span>
                  <input
                    data-autofocus="true"
                    value={formData.vehicleType}
                    onChange={(event) => updateField("vehicleType", event.target.value)}
                    placeholder={labels.placeholders.vehicleType}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
                  {errors.vehicleType ? (
                    <span className="mt-1 block text-xs text-red-300">{errors.vehicleType}</span>
                  ) : null}
                </label>

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

                <label className="block sm:col-span-2">
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
                    placeholder={labels.placeholders.addressLine}
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
                    placeholder={labels.placeholders.cityArea}
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
                  <input
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={labels.placeholders.phone}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white outline-none ring-accent transition placeholder:text-white/40 focus:ring-2"
                  />
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
                  <p className="text-sm font-semibold text-white">{captchaCopy.label}</p>
                  <div ref={captchaContainerRef} className="mt-3 min-h-[65px]" />
                  {!turnstileSiteKey ? (
                    <p className="mt-2 text-xs text-red-300">{captchaCopy.unavailable}</p>
                  ) : null}
                  {turnstileSiteKey && !captchaReady ? (
                    <p className="mt-2 text-xs text-white/60">{captchaCopy.loading}</p>
                  ) : null}
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
                  {isSubmitting ? "..." : labels.actions.send}
                </button>
              )}
            </div>
          </div>
        </form>
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
  const [preselectedPlan, setPreselectedPlan] = useState<PlanSlug | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((options?: OpenBookingOptions) => {
    const activeElement = document.activeElement;
    triggerRef.current = activeElement instanceof HTMLElement ? activeElement : null;
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

