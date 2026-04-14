import { NextResponse } from "next/server";

import { contactLeadSchema } from "@/lib/contact";

export const runtime = "nodejs";

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

function getTurnstileSecretKey() {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  return secret ? secret.trim() : null;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return null;
}

type TurnstileVerificationResponse = {
  success: boolean;
};

async function verifyTurnstileToken({
  secret,
  token,
  remoteIp,
}: {
  secret: string;
  token: string;
  remoteIp: string | null;
}) {
  const payload = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    payload.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const json = (await response.json()) as TurnstileVerificationResponse;
  return json.success;
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = contactLeadSchema.safeParse(json);

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
      const secret = getTurnstileSecretKey();
      if (!secret) {
        return NextResponse.json(
          {
            ok: false,
            error: "captcha_not_configured",
            details: "Missing TURNSTILE_SECRET_KEY",
          },
          { status: 500 },
        );
      }

      const isCaptchaValid = await verifyTurnstileToken({
        secret,
        token: parsed.data.captchaToken,
        remoteIp: getClientIp(request),
      });

      if (!isCaptchaValid) {
        return NextResponse.json(
          {
            ok: false,
            error: "invalid_captcha",
          },
          { status: 400 },
        );
      }
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

    const encoded = new URLSearchParams({
      "form-name": "pitcrew-contact",
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      vehicleType: parsed.data.vehicleType ?? "",
      serviceInterest: parsed.data.serviceInterest ?? "",
      message: parsed.data.message ?? "",
      locale: parsed.data.locale,
      source: parsed.data.source,
      planSlug: parsed.data.planSlug ?? "",
      vehicleMakeModel: parsed.data.vehicleMakeModel ?? "",
      vehicleYear: parsed.data.vehicleYear ?? "",
      addressLine: parsed.data.addressLine ?? "",
      cityArea: parsed.data.cityArea ?? "",
      notes: parsed.data.notes ?? "",
      "bot-field": "",
    });

    const formsEndpoint = `${netlifyBaseUrl}/__forms.html`;

    const netlifyResponse = await fetch(formsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encoded.toString(),
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
