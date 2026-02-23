const CLEAN_URLS: Record<string, string> = {
  "/": "/index.html",
  "/support": "/support.html",
  "/privacy": "/privacy.html",
};

const server = Bun.serve({
  port: parseInt(process.env.PORT || "3000"),
  async fetch(req) {
    const url = new URL(req.url);
    const path = CLEAN_URLS[url.pathname] ?? url.pathname;

    const file = Bun.file(`.${path}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on port ${server.port}`);
