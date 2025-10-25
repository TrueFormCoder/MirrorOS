// ellari-go: Cloudflare Worker router for ellari.ai/go/*

const MAP: Record<string, string> = {
  "/go/mirroros-widget":
    "https://github.com/TrueFormCoder/mirroros-countdown-widget",
  "/go/mirroros-api":
    "https://render.com/deploy?repo=https://github.com/TrueFormCoder/MirrorOS",
  "/go/mirroros-banner": "https://ellari.ai/brand/mirroros-banner",
  // add more shortlinks here…
};

const PERMANENT = 301;
const NOT_FOUND = 404;

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    const key = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

    if (MAP[key]) {
      return Response.redirect(MAP[key], PERMANENT);
    }

    if (key.startsWith("/go/")) {
      const list = Object.entries(MAP)
        .map(
          ([k, v]) =>
            `<li><code>${k}</code> → <a href="${v}" target="_blank" rel="noopener noreferrer">${v}</a></li>`,
        )
        .join("");

      const html = `<!doctype html><meta charset="utf-8">
<title>ellari.ai/go</title>
<h1>ellari.ai/go</h1>
<p>Available short links:</p>
<ul>${list}</ul>`;

      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: NOT_FOUND });
  },
};
