export const fallbackSiteUrl = "https://pitcrew-mobile-detailing.netlify.app";

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.DEPLOY_URL;

  if (!envUrl) {
    return fallbackSiteUrl;
  }

  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl.replace(/\/$/, "");
  }

  return `https://${envUrl.replace(/\/$/, "")}`;
}
