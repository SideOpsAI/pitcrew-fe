const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const routes = ["/en", "/en/services", "/en/contact", "/robots.txt", "/sitemap.xml"];

async function run() {
  console.log(`Running smoke test against ${baseUrl}`);
  let hasFailures = false;

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    const start = performance.now();

    try {
      const res = await fetch(url);
      const duration = Math.round(performance.now() - start);

      if (!res.ok) {
        hasFailures = true;
        console.error(`FAIL ${route} -> HTTP ${res.status} (${duration}ms)`);
      } else {
        console.log(`OK   ${route} -> HTTP ${res.status} (${duration}ms)`);
      }
    } catch (error) {
      hasFailures = true;
      const message =
        error instanceof Error ? error.message : "Unknown network error";
      console.error(`FAIL ${route} -> ${message}`);
    }
  }

  if (hasFailures) {
    process.exitCode = 1;
    console.error("Smoke test finished with failures.");
    return;
  }

  console.log("Smoke test finished successfully.");
}

run();
