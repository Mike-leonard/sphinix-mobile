const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");

// Passenger sets PORT automatically
const port = process.env.PORT || 3000;

// Load Next.js
const next = require("next");
const app = next({
  dev: false,
  dir: __dirname,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Next.js ready on port ${port}`);
  });
});
