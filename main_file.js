const { createServer } = require("http");
const { parse } = require("url");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const port = parseInt(process.env.PORT || "3000", 10);

// Verificar se .next existe, se não, fazer o build
const nextDir = path.join(__dirname, ".next");
if (!fs.existsSync(nextDir)) {
  console.log("📦 Building application...");
  try {
    execSync("npm run build", { stdio: "inherit" });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

const next = require("next");
const dev = false;

const app = next({ dev, dir: "." });
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

