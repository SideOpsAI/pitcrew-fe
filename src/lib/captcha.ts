import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const captchaTtlMs = 5 * 60 * 1000;

const captchaChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type CaptchaPayload = {
  answer: string;
  expiresAt: number;
  nonce: string;
};

export type CaptchaChallenge = {
  svg: string;
  token: string;
};

export type CaptchaValidationResult =
  | { ok: true }
  | { ok: false; error: "captcha_not_configured" | "invalid_captcha" };

function getCaptchaSecret() {
  const secret = process.env.CAPTCHA_SECRET ?? process.env.BOOKING_CAPTCHA_SECRET;
  return secret?.trim() ? secret.trim() : null;
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeStringCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCaptchaText(length: number) {
  return Array.from({ length }, () => captchaChars[randomInt(0, captchaChars.length - 1)]).join("");
}

function randomColor() {
  const r = randomInt(140, 230);
  const g = randomInt(140, 230);
  const b = randomInt(140, 230);
  return `rgb(${r},${g},${b})`;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCaptchaSvg(text: string) {
  const width = 180;
  const height = 60;
  const spacing = width / (text.length + 1);

  const lines = Array.from({ length: 4 })
    .map(() => {
      const x1 = randomInt(0, width);
      const y1 = randomInt(0, height);
      const x2 = randomInt(0, width);
      const y2 = randomInt(0, height);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.35)" stroke-width="1" />`;
    })
    .join("");

  const glyphs = text
    .split("")
    .map((char, index) => {
      const x = Math.round(spacing * (index + 1));
      const y = randomInt(36, 50);
      const rotate = randomInt(-18, 18);
      const color = randomColor();
      return `<text x="${x}" y="${y}" fill="${color}" font-size="34" font-family="monospace" font-weight="700" text-anchor="middle" transform="rotate(${rotate} ${x} ${y})">${escapeSvgText(char)}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#090909" rx="8" />${lines}${glyphs}</svg>`;
}

export async function createCaptchaChallenge(): Promise<CaptchaChallenge | null> {
  const secret = getCaptchaSecret();
  if (!secret) {
    return null;
  }

  const text = randomCaptchaText(5);

  const payload: CaptchaPayload = {
    answer: text.toLowerCase(),
    expiresAt: Date.now() + captchaTtlMs,
    nonce: randomBytes(8).toString("hex"),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload, secret);

  return {
    svg: buildCaptchaSvg(text),
    token: `${encodedPayload}.${signature}`,
  };
}

export function verifyCaptchaChallenge({
  token,
  value,
}: {
  token: string;
  value: string;
}): CaptchaValidationResult {
  const secret = getCaptchaSecret();
  if (!secret) {
    return { ok: false, error: "captcha_not_configured" };
  }

  if (!token || !value) {
    return { ok: false, error: "invalid_captcha" };
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return { ok: false, error: "invalid_captcha" };
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  if (!safeStringCompare(signature, expectedSignature)) {
    return { ok: false, error: "invalid_captcha" };
  }

  let payload: CaptchaPayload;

  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8")) as CaptchaPayload;
  } catch {
    return { ok: false, error: "invalid_captcha" };
  }

  if (!payload.answer || !payload.expiresAt || Date.now() > payload.expiresAt) {
    return { ok: false, error: "invalid_captcha" };
  }

  const normalizedInput = value.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalizedInput) {
    return { ok: false, error: "invalid_captcha" };
  }

  if (!safeStringCompare(normalizedInput, payload.answer)) {
    return { ok: false, error: "invalid_captcha" };
  }

  return { ok: true };
}
