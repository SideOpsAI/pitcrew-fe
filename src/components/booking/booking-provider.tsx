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

type CaptchaChallenge = {
  svg: string;
  token: string;
};

type CaptchaApiResponse = {
  ok: boolean;
  svg?: string;
  token?: string;
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
    label: "Security verification",
    required: "Please enter the captcha before sending.",
    unavailable: "Security check is not available right now.",
    retry: "Captcha validation failed. Please try again.",
    loading: "Loading captcha...",
    refresh: "Refresh",
    inputPlaceholder: "Type the captcha text",
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

function getCaptchaMessages(locale: Locale) {
  return captchaMessages[locale];
}

function getBookingConfirmationMessages(locale: Locale) {
  return bookingConfirmationMessages[locale];
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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactLeadErrors>({});
  const [isEntering, setIsEntering] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    errors: {},
    message: "",
  });
  const captchaCopy = getCaptchaMessages(locale);

  const isSubmitting = formState.status === "submitting";

  const fetchCaptchaChallenge = useCallback(async () => {
    setCaptchaLoading(true);

    try {
      const response = await fetch("/api/captcha", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("captcha_unavailable");
      }

      const json = (await response.json()) as CaptchaApiResponse;

      if (!json.ok || !json.svg || !json.token) {
        throw new Error("captcha_payload_invalid");
      }

      setCaptcha({
        svg: json.svg,
        token: json.token,
      });
    } catch {
      setCaptcha(null);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  const resetModalState = useCallback(
    (planSlug: PlanSlug | null) => {
      setStep(planSlug ? 2 : 1);
      setErrors({});
      setCaptcha(null);
      setCaptchaInput("");
      setCaptchaLoading(false);
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
          setCaptchaInput("");
          await fetchCaptchaChallenge();

          setFormState({
            status: "error",
            errors: {},
            message: captchaCopy.retry,
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
        className={`flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-none border border-white/15 bg-black shadow-2xl transition-all duration-300 ease-out sm:h-[90dvh] sm:max-h-[90dvh] sm:rounded-2xl ${
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

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
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
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Booking</p>
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
