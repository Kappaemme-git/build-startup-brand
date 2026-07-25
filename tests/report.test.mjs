import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const fixture = path.join(root, "tests", "fixtures", "sample-brand.json");
const temp = await mkdtemp(path.join(tmpdir(), "build-startup-brand-"));
const output = path.join(temp, "report.html");

const result = spawnSync(
  process.execPath,
  [path.join(root, "scripts", "generate_report.mjs"), fixture, output],
  { encoding: "utf8" }
);

assert.equal(result.status, 0, result.stderr);
const html = await readFile(output, "utf8");
assert.match(html, /Northstar/);
assert.match(html, /Three creative territories/);
assert.match(html, /Brand in use/);
assert.match(html, /Signal, not noise/);
assert.doesNotMatch(html, /<script/);

console.log("Report generator test passed");
