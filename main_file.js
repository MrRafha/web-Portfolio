#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { createServer } = require("http");
const { parse } = require("url");

const cwd = process.cwd();
const nextDir = path.join(cwd, ".next");
const port = parseInt(process.env.PORT || "3000", 10);

console.log("🔨 Checking if build exists...");

if (!fs.existsSync(nextDir)) {
  console.log("📦 Running build...");
  try {
    execSync("npm run build", { stdio: "inherit", cwd });
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
}

console.log("✅ Build ready, starting server...");

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
