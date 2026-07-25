#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Build Startup Brand

Install the public Codex skill from GitHub.

Usage:
  npx build-startup-brand

Options:
  --help, -h   Show this help
`);
  process.exit(0);
}

console.log("Installing Build Startup Brand for all supported agents...");
const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["--yes", "skills", "add", "Kappaemme-git/build-startup-brand", "-g", "-y"],
  { stdio: "inherit" }
);

if (result.error) {
  console.error(`Could not start the installer: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
