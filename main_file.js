#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const nextDir = path.join(cwd, ".next");

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
execSync("npm start", { stdio: "inherit", cwd });
