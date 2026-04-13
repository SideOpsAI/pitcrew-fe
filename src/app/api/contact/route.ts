import { NextResponse } from "next/server";

import { contactLeadSchema } from "@/lib/contact";

export const runtime = "nodejs";

function getNetlifyBaseUrl() {
  const value =
    process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? process.env.DEPLOY_URL;

  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.replace(/\/$/, "");
  }

  return `https://${value.replace(/\/$/, "")}`;
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

    const encoded = new URLSearchParams({
      "form-name": "pitcrew-contact",
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      vehicleType: parsed.data.vehicleType ?? "",
      serviceInterest: parsed.data.serviceInterest,
      message: parsed.data.message,
      locale: parsed.data.locale,
      "bot-field": "",
    });

    const netlifyBaseUrl = getNetlifyBaseUrl();

    if (netlifyBaseUrl) {
      const netlifyResponse = await fetch(netlifyBaseUrl, {
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
          },
          { status: 502 },
        );
      }
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
