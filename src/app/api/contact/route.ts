import { NextResponse } from "next/server";

import {
  BOOKING_MAX_PHOTO_BYTES,
  BOOKING_MAX_TOTAL_UPLOAD_BYTES,
  bytesToRoundedMb,
} from "@/lib/booking-upload";
import { verifyCaptchaChallenge } from "@/lib/captcha";
import { contactLeadSchema, type ContactLeadPayload } from "@/lib/contact";
import { bookingPlanPricing, type VehicleTypeKey } from "@/lib/vehicle-plans";

export const runtime = "nodejs";

const uploadFieldNames = [
  "vehiclePhotoFront",
  "vehiclePhotoSide",
  "vehiclePhotoExtra",
] as const;

type UploadFieldName = (typeof uploadFieldNames)[number];
type UploadFileMap = Partial<Record<UploadFieldName, File>>;

function formatValue(value: string | undefined) {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : "N/A";
}

function sanitizePhoneForLink(phone: string) {
  const normalized = phone.trim();
  const plusPrefix = normalized.startsWith("+") ? "+" : "";
  const digitsOnly = normalized.replace(/\D/g, "");
  return `${plusPrefix}${digitsOnly}`;
}

function getPlanLabel(planSlug: ContactLeadPayload["planSlug"]) {
  if (planSlug === "basic") return "Interior";
  if (planSlug === "medium") return "Exterior";
  if (planSlug === "full") return "Full Detail";
  return "N/A";
}

function splitList(value: string | undefined, separator: RegExp) {
  return (value ?? "")
    .split(separator)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function parseUsdAmount(value: string) {
  const normalized = value.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatUsdAmount(value: number) {
  return `$${value.toFixed(2)} USD`;
}

function normalizeVehicleTypeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function resolveVehicleTypeKey(parsed: ContactLeadPayload): VehicleTypeKey | null {
  if (parsed.vehicleTypeKey) {
    return parsed.vehicleTypeKey;
  }

  const normalized = normalizeVehicleTypeLabel(parsed.vehicleType ?? "");
  if (!normalized) {
    return null;
  }

  const aliases: Record<string, VehicleTypeKey> = {
    sedan: "sedan",
    smallsuv: "small-suv",
    bigsuvminivan: "big-suv-minivan",
    bigsuvminiban: "big-suv-minivan",
    pickuptrucksplus: "pickup-plus",
    pickupplus: "pickup-plus",
  };

  return aliases[normalized] ?? null;
}

function calculateBookingTotal(parsed: ContactLeadPayload) {
  const vehicleTypeKey = resolveVehicleTypeKey(parsed);
  const planSlug = parsed.planSlug;
  const basePrice =
    vehicleTypeKey && planSlug ? parseUsdAmount(bookingPlanPricing[vehicleTypeKey][planSlug]) : 0;
  const extrasTotal = splitList(parsed.extraServicePrice, /\s*,\s*/).reduce(
    (sum, entry) => sum + parseUsdAmount(entry),
    0,
  );
  const total = basePrice + extrasTotal;

  return {
    basePrice,
    extrasTotal,
    total,
    formattedBasePrice: basePrice > 0 ? formatUsdAmount(basePrice) : "N/A",
    formattedExtrasTotal: extrasTotal > 0 ? formatUsdAmount(extrasTotal) : "N/A",
    formattedTotal: total > 0 ? formatUsdAmount(total) : "N/A",
  };
}

function buildBookingSummaryText({
  parsed,
  files,
}: {
  parsed: ContactLeadPayload;
  files: UploadFileMap;
}) {
  const cleanPhone = sanitizePhoneForLink(parsed.phone);
  const callLink = cleanPhone ? `tel:${cleanPhone}` : "N/A";
  const whatsappLink = cleanPhone
    ? `https://wa.me/${cleanPhone.replace(/^\+/, "")}?text=${encodeURIComponent(
        "Hi, I want to book a detailing appointment.",
      )}`
    : "N/A";
  const uploadedFiles = uploadFieldNames
    .map((fieldName) => files[fieldName]?.name)
    .filter((fileName): fileName is string => Boolean(fileName));
  const extraServiceNames = splitList(parsed.extraServiceName, /\s*,\s*/);
  const pricing = calculateBookingTotal(parsed);
  const planLabel = getPlanLabel(parsed.planSlug);
  const lines: string[] = [
    "BOOKING REQUEST",
    "",
    "Client:",
    `- Name: ${formatValue(parsed.name)}`,
    `- Phone: ${formatValue(parsed.phone)}`,
    `- Email: ${formatValue(parsed.email)}`,
    "",
    "Vehicle:",
    `- Type: ${formatValue(parsed.vehicleType)}`,
    `- Make/Model: ${formatValue(parsed.vehicleMakeModel)}`,
    `- Year: ${formatValue(parsed.vehicleYear)}`,
    "",
    "Reservation:",
    `- Plan: ${planLabel}`,
    `- Extras: ${extraServiceNames.length > 0 ? extraServiceNames.join(", ") : "N/A"}`,
    `- Base Price: ${pricing.formattedBasePrice}`,
    `- Extras Total: ${pricing.formattedExtrasTotal}`,
    `- Total Price: ${pricing.formattedTotal}`,
    "",
    "Location:",
    `- Address: ${formatValue(parsed.addressLine)}`,
    `- City/State: ${formatValue(parsed.cityArea)}`,
    `- Notes: ${formatValue(parsed.notes || parsed.message)}`,
    "",
    "Quick Actions:",
    `- Call: ${callLink}`,
    `- WhatsApp: ${whatsappLink}`,
  ];

  if (uploadedFiles.length > 0) {
    lines.push("", "Photos:");
    uploadedFiles.forEach((fileName) => lines.push(`  - ${fileName}`));
  } else {
    lines.push("", "Photos:", "  - N/A");
  }

  lines.push("", `Locale: ${formatValue(parsed.locale)}`);

  return lines.join("\n");
}

function getNetlifyBaseUrl() {
  const value =
    process.env.NETLIFY_FORMS_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.DEPLOY_URL;

  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.replace(/\/$/, "");
  }

  return `https://${value.replace(/\/$/, "")}`;
}

function getNetlifyFormsTargetUrl(baseUrl: string) {
  return `${baseUrl}/__forms.html`;
}

function isMockFormDeliveryEnabled() {
  return process.env.MOCK_FORM_DELIVERY === "true";
}

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function validateUploadFiles(files: UploadFileMap) {
  const selectedFiles = uploadFieldNames
    .map((fieldName) => files[fieldName])
    .filter((file): file is File => Boolean(file));

  const oversizeFile = selectedFiles.find((file) => file.size > BOOKING_MAX_PHOTO_BYTES);
  if (oversizeFile) {
    return {
      ok: false as const,
      details: `File "${oversizeFile.name}" is larger than ${bytesToRoundedMb(BOOKING_MAX_PHOTO_BYTES)} MB.`,
    };
  }

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > BOOKING_MAX_TOTAL_UPLOAD_BYTES) {
    return {
      ok: false as const,
      details: `Total photo size exceeds ${bytesToRoundedMb(BOOKING_MAX_TOTAL_UPLOAD_BYTES)} MB.`,
    };
  }

  return {
    ok: true as const,
  };
}

function buildPayloadFromFormData(formData: FormData) {
  const getString = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  const payload = {
    name: getString("name"),
    phone: getString("phone"),
    email: getString("email"),
    vehicleType: getString("vehicleType"),
    serviceInterest: getString("serviceInterest"),
    message: getString("message"),
    locale: getString("locale"),
    botField: getString("bot-field") || getString("botField"),
    captchaToken: getString("captchaToken"),
    captchaValue: getString("captchaValue"),
    source: getString("source"),
    planSlug: getString("planSlug"),
    vehicleTypeKey: getString("vehicleTypeKey"),
    extraServiceKey: getString("extraServiceKey"),
    extraServiceName: getString("extraServiceName"),
    extraServicePrice: getString("extraServicePrice"),
    extraServiceDuration: getString("extraServiceDuration"),
    extraServiceDetails: getString("extraServiceDetails"),
    vehicleMakeModel: getString("vehicleMakeModel"),
    vehicleYear: getString("vehicleYear"),
    addressLine: getString("addressLine"),
    cityArea: getString("cityArea"),
    notes: getString("notes"),
  };

  const files: UploadFileMap = {};

  for (const fieldName of uploadFieldNames) {
    const fileCandidate = formData.get(fieldName);

    if (isFile(fileCandidate)) {
      files[fieldName] = fileCandidate;
    }
  }

  return { payload, files };
}

async function readIncomingRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as unknown;
    return { payload, files: {} as UploadFileMap };
  }

  const formData = await request.formData();
  return buildPayloadFromFormData(formData);
}

function buildNetlifyFormData({
  parsed,
  files,
}: {
  parsed: ContactLeadPayload;
  files: UploadFileMap;
}) {
  const body = new FormData();
  const summaryText = buildBookingSummaryText({ parsed, files });
  const isBookingLead = parsed.source === "booking-modal";
  const formName = "pitcrew-contact";

  body.append("form-name", formName);
  body.append("bot-field", "");
  
  if (isBookingLead) {
    body.append("bookingSummary", summaryText);
  } else {
    body.append("name", parsed.name);
    body.append("phone", parsed.phone);
    body.append("email", parsed.email ?? "");
    body.append("vehicleType", parsed.vehicleType ?? "");
    body.append("serviceInterest", parsed.serviceInterest ?? "");
    body.append("message", parsed.message ?? "");
    body.append("locale", parsed.locale);
    body.append("source", parsed.source);
  }

  for (const fieldName of uploadFieldNames) {
    const file = files[fieldName];

    if (file) {
      body.append(fieldName, file);
    }
  }

  return body;
}

export async function POST(request: Request) {
  try {
    const incoming = await readIncomingRequest(request);
    const parsed = contactLeadSchema.safeParse(incoming.payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (parsed.data.botField) {
      return NextResponse.json({ ok: true });
    }

    const uploadValidation = validateUploadFiles(incoming.files);
    if (!uploadValidation.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "payload_too_large",
          details: uploadValidation.details,
        },
        { status: 413 },
      );
    }

    if (parsed.data.source === "booking-modal") {
      const captchaValidation = verifyCaptchaChallenge({
        token: parsed.data.captchaToken,
        value: parsed.data.captchaValue,
      });

      if (!captchaValidation.ok && captchaValidation.error === "captcha_not_configured") {
        return NextResponse.json(
          {
            ok: false,
            error: "captcha_not_configured",
            details: "Missing CAPTCHA_SECRET or BOOKING_CAPTCHA_SECRET",
          },
          { status: 500 },
        );
      }

      if (!captchaValidation.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: "invalid_captcha",
          },
          { status: 400 },
        );
      }
    }

    if (isMockFormDeliveryEnabled()) {
      return NextResponse.json({ ok: true, mocked: true });
    }

    const netlifyBaseUrl = getNetlifyBaseUrl();
    if (!netlifyBaseUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "email_not_configured",
          details: "Missing NETLIFY_FORMS_URL (or URL/DEPLOY_PRIME_URL/DEPLOY_URL)",
        },
        { status: 500 },
      );
    }

    const formsEndpoint = getNetlifyFormsTargetUrl(netlifyBaseUrl);
    const body = buildNetlifyFormData({
      parsed: parsed.data,
      files: incoming.files,
    });

    const netlifyResponse = await fetch(formsEndpoint, {
      method: "POST",
      body,
    });

    if (!netlifyResponse.ok) {
      if (netlifyResponse.status === 413) {
        return NextResponse.json(
          {
            ok: false,
            error: "payload_too_large",
            details: `Netlify rejected the upload size. Maximum request size is about 8 MB; keep photos under ${bytesToRoundedMb(BOOKING_MAX_TOTAL_UPLOAD_BYTES)} MB total.`,
          },
          { status: 413 },
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: "delivery_failed",
          details: `Netlify response status: ${netlifyResponse.status} (${formsEndpoint})`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes("body exceeded") ||
      normalizedMessage.includes("body size") ||
      normalizedMessage.includes("request entity too large")
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "payload_too_large",
          details: `Uploaded photos are too large. Keep them under ${bytesToRoundedMb(BOOKING_MAX_TOTAL_UPLOAD_BYTES)} MB total.`,
        },
        { status: 413 },
      );
    }

    console.error("[api/contact] Unexpected error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "unexpected_error",
      },
      { status: 500 },
    );
  }
}
