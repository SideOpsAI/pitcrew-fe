import { NextResponse } from "next/server";

import { createCaptchaChallenge } from "@/lib/captcha";

export const runtime = "nodejs";

export async function GET() {
  const challenge = await createCaptchaChallenge();

  if (!challenge) {
    return NextResponse.json(
      {
        ok: false,
        error: "captcha_not_configured",
        details: "Missing CAPTCHA_SECRET",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      svg: challenge.svg,
      token: challenge.token,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
