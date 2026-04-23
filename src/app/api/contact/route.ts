import { NextResponse } from "next/server";

import { verifyCaptchaChallenge } from "@/lib/captcha";
import { contactLeadSchema, type ContactLeadPayload } from "@/lib/contact";

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

function escapeMarkdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br/>");
}

function buildBookingSummaryTable({
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
        "Hola, quiero reservar un detailing.",
      )}`
    : "N/A";
  const uploadedFiles = uploadFieldNames
    .map((fieldName) => files[fieldName]?.name)
    .filter((fileName): fileName is string => Boolean(fileName))
    .join(", ");

  const rows: Array<[string, string]> = [
    ["Lead Type", parsed.source === "booking-modal" ? "Booking Request" : "Contact Request"],
    ["Name", formatValue(parsed.name)],
    ["Phone", formatValue(parsed.phone)],
    ["Call Link", callLink],
    ["WhatsApp Link", whatsappLink],
    ["Email", formatValue(parsed.email)],
    ["Plan", getPlanLabel(parsed.planSlug)],
    ["Extra Services", formatValue(parsed.extraServiceName)],
    ["Extra Services Pricing", formatValue(parsed.extraServicePrice)],
    ["Extra Services Duration", formatValue(parsed.extraServiceDuration)],
    ["Extra Service Details", formatValue(parsed.extraServiceDetails)],
    ["Vehicle Type", formatValue(parsed.vehicleType)],
    ["Vehicle Make/Model", formatValue(parsed.vehicleMakeModel)],
    ["Vehicle Year", formatValue(parsed.vehicleYear)],
    ["Address", formatValue(parsed.addressLine)],
    ["City/State", formatValue(parsed.cityArea)],
    ["Notes", formatValue(parsed.notes || parsed.message)],
    ["Uploaded Photos", uploadedFiles || "N/A"],
    ["Locale", formatValue(parsed.locale)],
  ];

  const tableHeader = "| Field | Value |\n| --- | --- |";
  const tableRows = rows
    .map(([field, value]) => `| ${escapeMarkdownCell(field)} | ${escapeMarkdownCell(value)} |`)
    .join("\n");

  return `${tableHeader}\n${tableRows}`;
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

  body.append("form-name", "pitcrew-contact");
  body.append("name", parsed.name);
  body.append("phone", parsed.phone);
  body.append("email", parsed.email ?? "");
  body.append("vehicleType", parsed.vehicleType ?? "");
  body.append("serviceInterest", parsed.serviceInterest ?? "");
  body.append("message", parsed.message ?? "");
  body.append("locale", parsed.locale);
  body.append("source", parsed.source);
  body.append("planSlug", parsed.planSlug ?? "");
  body.append("extraServiceKey", parsed.extraServiceKey ?? "");
  body.append("extraServiceName", parsed.extraServiceName ?? "");
  body.append("extraServicePrice", parsed.extraServicePrice ?? "");
  body.append("extraServiceDuration", parsed.extraServiceDuration ?? "");
  body.append("extraServiceDetails", parsed.extraServiceDetails ?? "");
  body.append("vehicleMakeModel", parsed.vehicleMakeModel ?? "");
  body.append("vehicleYear", parsed.vehicleYear ?? "");
  body.append("addressLine", parsed.addressLine ?? "");
  body.append("cityArea", parsed.cityArea ?? "");
  body.append("notes", parsed.notes ?? "");
  body.append("bot-field", "");

  if (parsed.source === "booking-modal") {
    const summaryTable = buildBookingSummaryTable({ parsed, files });
    body.append("bookingSummary", summaryTable);
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
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "unexpected_error",
      },
      { status: 500 },
    );
  }
}
