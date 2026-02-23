const CLEAN_URLS: Record<string, string> = {
  "/": "/index.html",
  "/support": "/support.html",
  "/privacy": "/privacy.html",
};

const SUBDOMAIN_OVERRIDES: Record<string, Record<string, string>> = {
  hangman: {
    "/privacy": "/privacy_hangman.html",
  },
};

const server = Bun.serve({
  port: parseInt(process.env.PORT || "3000"),
  async fetch(req) {
    const url = new URL(req.url);
    const subdomain = url.hostname.split(".")[0];

    const overrides = SUBDOMAIN_OVERRIDES[subdomain];
    const path =
      overrides?.[url.pathname] ??
      CLEAN_URLS[url.pathname] ??
      url.pathname;

    const file = Bun.file(`.${path}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on port ${server.port}`);
