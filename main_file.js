#!/usr/bin/env node

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");

const cwd = process.cwd();
const port = parseInt(process.env.PORT || "3000", 10);

console.log("✅ Starting Next.js server...");

const next = require("next");
const app = next({ dev: false, dir: cwd });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`✓ Server running on port ${port}`);
  });
});
