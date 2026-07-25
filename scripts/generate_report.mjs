#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/generate_report.mjs <input.json> <output.html>");
  process.exit(1);
}

const raw = await readFile(inputPath, "utf8");
const data = JSON.parse(raw);
validate(data);

const html = renderReport(data);
await mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
await writeFile(outputPath, html, "utf8");
console.log(`Brand identity report created: ${path.resolve(outputPath)}`);

function validate(value) {
  const errors = [];
  if (!value || typeof value !== "object") errors.push("Root must be an object");
  if (!value?.meta?.startup) errors.push("meta.startup is required");
  if (!value?.meta?.title) errors.push("meta.title is required");
  if (!value?.meta?.status) errors.push("meta.status is required");
  if (value?.meta?.language !== "en") errors.push("meta.language must be en");
  if (!value?.strategy || typeof value.strategy !== "object") {
    errors.push("strategy is required");
  }
  if (!Array.isArray(value?.territories) || value.territories.length !== 3) {
    errors.push("territories must contain exactly three routes");
  }
  for (const [index, territory] of (value?.territories || []).entries()) {
    if (!territory.name) errors.push(`territories[${index}].name is required`);
    if (!territory.thesis) errors.push(`territories[${index}].thesis is required`);
    for (const [scoreName, score] of Object.entries(territory.scores || {})) {
      if (!Number.isFinite(score) || score < 1 || score > 10) {
        errors.push(`territories[${index}].scores.${scoreName} must be 1–10`);
      }
    }
    for (const [colorIndex, color] of (territory.palette || []).entries()) {
      if (!isHex(color.hex)) {
        errors.push(`territories[${index}].palette[${colorIndex}].hex is invalid`);
      }
    }
  }
  for (const [colorIndex, color] of (value?.brand_system?.palette || []).entries()) {
    if (!isHex(color.hex)) {
      errors.push(`brand_system.palette[${colorIndex}].hex is invalid`);
    }
  }
  if (errors.length) {
    console.error(`Invalid brand report:\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
}

function renderReport(data) {
  const { meta, strategy, territories, recommendation = {}, brand_system: system = {}, validation = {}, sources = [] } = data;
  const finalSystem = Object.keys(system).length > 0;
  const strongest = [...territories].sort((a, b) => weightedScore(b.scores) - weightedScore(a.scores))[0];
  const selectedName = system.selected_territory || recommendation.territory || strongest.name;
  const selectedTerritory = territories.find((route) => route.name === selectedName) || strongest;
  const accent = firstColor(selectedTerritory?.palette, "#7C3AED");
  const ink = "#141416";
  const paper = "#F4F1EA";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(meta.title)}</title>
  <style>
    :root {
      --accent: ${accent};
      --ink: ${ink};
      --paper: ${paper};
      --muted: #696866;
      --line: rgba(20,20,22,.14);
      --white: #fff;
      --radius: 24px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--paper);
      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    a { color: inherit; }
    .shell { display: grid; grid-template-columns: 252px minmax(0,1fr); min-height: 100vh; }
    aside {
      position: sticky; top: 0; height: 100vh; padding: 32px 24px;
      background: var(--ink); color: var(--white);
      display: flex; flex-direction: column; gap: 28px;
    }
    .brand-mark {
      width: 46px; height: 46px; border-radius: 14px;
      background: var(--accent); display: grid; place-items: center;
      color: ${foreground(accent)}; font-size: 20px; font-weight: 900;
      transform: rotate(-4deg);
    }
    .side-title { font-size: 18px; font-weight: 750; line-height: 1.15; }
    .side-meta { color: rgba(255,255,255,.58); font-size: 12px; text-transform: uppercase; letter-spacing: .12em; }
    nav { display: grid; gap: 7px; }
    nav a {
      color: rgba(255,255,255,.68); text-decoration: none; padding: 8px 10px;
      border-radius: 9px; font-size: 13px;
    }
    nav a:hover { background: rgba(255,255,255,.08); color: white; }
    .status {
      margin-top: auto; display: inline-flex; align-items: center; gap: 8px;
      color: rgba(255,255,255,.65); font-size: 12px;
    }
    .status::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
    main { min-width: 0; }
    .hero {
      min-height: 84vh; padding: clamp(52px, 8vw, 112px);
      display: flex; flex-direction: column; justify-content: space-between;
      border-bottom: 1px solid var(--line); position: relative; overflow: hidden;
    }
    .hero::after {
      content: ""; position: absolute; width: 430px; height: 430px; right: -120px; top: -120px;
      background: var(--accent); border-radius: 46% 54% 68% 32% / 41% 38% 62% 59%;
      opacity: .92; transform: rotate(17deg);
    }
    .kicker { text-transform: uppercase; letter-spacing: .15em; font-size: 12px; font-weight: 800; }
    h1 { max-width: 900px; margin: 28px 0; font-size: clamp(54px, 8vw, 118px); line-height: .88; letter-spacing: -.065em; }
    .hero-copy { max-width: 650px; font-size: clamp(18px, 2vw, 26px); color: var(--muted); }
    .hero-footer { display: flex; gap: 34px; flex-wrap: wrap; margin-top: 80px; font-size: 13px; }
    .hero-footer strong { display: block; font-size: 15px; }
    section { padding: clamp(56px, 7vw, 96px); border-bottom: 1px solid var(--line); }
    .section-head { display: grid; grid-template-columns: 160px 1fr; gap: 32px; margin-bottom: 46px; }
    .section-index { color: var(--muted); font-size: 13px; }
    h2 { margin: 0; font-size: clamp(38px, 5vw, 68px); line-height: .96; letter-spacing: -.045em; }
    h3 { margin: 0 0 12px; font-size: 24px; line-height: 1.1; letter-spacing: -.025em; }
    p { margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
    .card {
      background: rgba(255,255,255,.66); border: 1px solid rgba(255,255,255,.9);
      border-radius: var(--radius); padding: 26px; box-shadow: 0 16px 50px rgba(20,20,22,.04);
    }
    .span-4 { grid-column: span 4; } .span-6 { grid-column: span 6; } .span-8 { grid-column: span 8; } .span-12 { grid-column: span 12; }
    .label { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 10px; font-weight: 800; }
    .big-idea { font-size: clamp(30px, 4vw, 54px); line-height: 1.02; letter-spacing: -.04em; }
    .list { margin: 0; padding-left: 18px; }
    .list li + li { margin-top: 8px; }
    .routes { display: grid; gap: 22px; }
    .route {
      border-radius: 30px; overflow: hidden; background: #fff;
      border: 1px solid var(--line);
    }
    .route-head { min-height: 260px; padding: 30px; display: flex; flex-direction: column; justify-content: space-between; }
    .route-number { font-size: 12px; text-transform: uppercase; letter-spacing: .12em; font-weight: 850; opacity: .7; }
    .route h3 { font-size: clamp(38px, 5vw, 72px); max-width: 750px; letter-spacing: -.055em; }
    .route-body { padding: 30px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 34px; }
    .route-details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .quote { font-size: 28px; line-height: 1.14; letter-spacing: -.025em; }
    .palette { display: grid; grid-template-columns: repeat(auto-fit,minmax(92px,1fr)); gap: 8px; }
    .swatch { min-height: 108px; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; justify-content: flex-end; border: 1px solid rgba(20,20,22,.08); }
    .swatch strong, .swatch span { font-size: 11px; }
    .score-row { display: grid; grid-template-columns: 1fr 160px 34px; gap: 12px; align-items: center; font-size: 12px; margin: 10px 0; }
    .track { height: 7px; background: rgba(20,20,22,.09); border-radius: 99px; overflow: hidden; }
    .fill { height: 100%; background: var(--accent); border-radius: 99px; }
    .total { font-size: 54px; font-weight: 850; letter-spacing: -.06em; }
    .recommendation {
      background: var(--ink); color: white; border-radius: 32px; padding: clamp(30px, 5vw, 64px);
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
    }
    .recommendation .label { color: rgba(255,255,255,.5); }
    .recommendation h3 { font-size: clamp(40px, 6vw, 78px); }
    .system-preview {
      min-height: 330px; padding: 42px; border-radius: 30px; background: var(--accent);
      color: ${foreground(accent)}; display: flex; flex-direction: column; justify-content: space-between;
    }
    .system-preview .tagline { font-size: clamp(42px, 7vw, 90px); line-height: .9; letter-spacing: -.06em; max-width: 820px; }
    .pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    .application { min-height: 210px; display: flex; flex-direction: column; justify-content: space-between; }
    .application h3 { font-size: 30px; }
    .source-list { display: grid; gap: 10px; }
    .source-list a { overflow-wrap: anywhere; }
    footer { padding: 42px clamp(30px,7vw,96px); color: var(--muted); font-size: 12px; }
    @media (max-width: 920px) {
      .shell { display: block; } aside { position: relative; height: auto; } nav { display: none; }
      .hero::after { width: 240px; height: 240px; opacity: .35; }
      .section-head { grid-template-columns: 1fr; gap: 10px; }
      .span-4, .span-6, .span-8 { grid-column: span 12; }
      .route-body, .recommendation { grid-template-columns: 1fr; }
      .pillars { grid-template-columns: 1fr; }
    }
    @media print {
      aside { display: none; } .shell { display: block; }
      section, .route, .card { break-inside: avoid; }
      body { background: white; } .hero { min-height: 0; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <div class="brand-mark">${esc(initials(meta.startup))}</div>
      <div>
        <div class="side-title">${esc(meta.startup)}</div>
        <div class="side-meta">${esc(meta.title)}</div>
      </div>
      <nav>
        <a href="#strategy">Strategic core</a>
        <a href="#territories">Creative territories</a>
        <a href="#recommendation">Recommendation</a>
        ${finalSystem ? `<a href="#system">Brand system</a><a href="#applications">Applications</a>` : ""}
        <a href="#validation">Validation</a>
      </nav>
      <div class="status">${esc(meta.status)}</div>
    </aside>
    <main>
      <header class="hero">
        <div>
          <div class="kicker">${esc(meta.subtitle || "Startup brand identity")}</div>
          <h1>${esc(meta.startup)}</h1>
          <p class="hero-copy">${esc(strategy.salient_idea || strategy.positioning || strategy.product)}</p>
        </div>
        <div class="hero-footer">
          <div><span class="label">Status</span><strong>${esc(meta.status)}</strong></div>
          <div><span class="label">Prepared for</span><strong>${esc(meta.prepared_for || meta.startup)}</strong></div>
          <div><span class="label">Generated</span><strong>${esc(meta.generated_at || "")}</strong></div>
        </div>
      </header>

      <section id="strategy">
        ${sectionHead("01", "Strategic core")}
        <div class="grid">
          ${strategyCard("Product", strategy.product, "span-6")}
          ${strategyCard("Primary audience", strategy.audience, "span-6")}
          ${strategyCard("Problem", strategy.problem, "span-4")}
          ${strategyCard("Category", strategy.category, "span-4")}
          ${strategyCard("Current alternatives", strategy.alternatives, "span-4")}
          ${strategyCard("Positioning", strategy.positioning, "span-12")}
          <div class="card span-8"><div class="label">Salient brand idea</div><div class="big-idea">${esc(strategy.salient_idea || "—")}</div></div>
          ${strategyCard("Brand promise", strategy.promise, "span-4")}
          ${listCard("Proof points", strategy.proof_points, "span-6")}
          ${listCard("Personality", strategy.personality, "span-6")}
        </div>
      </section>

      <section id="territories">
        ${sectionHead("02", "Three creative territories")}
        <div class="routes">
          ${territories.map((route, index) => territoryCard(route, index)).join("")}
        </div>
      </section>

      <section id="recommendation">
        ${sectionHead("03", "Recommendation")}
        <div class="recommendation">
          <div>
            <div class="label">Recommended territory</div>
            <h3>${esc(recommendation.territory || strongest.name)}</h3>
            <p>${esc(recommendation.reason || "Highest weighted fit across the selected criteria.")}</p>
          </div>
          <div>
            <div class="label">Trade-off</div>
            <p>${esc(recommendation.tradeoff || strongest.risk || "Validate the route with target users before production.")}</p>
            <div class="label" style="margin-top:32px">Selection status</div>
            <p>${esc(recommendation.selection_status || meta.status)}</p>
          </div>
        </div>
      </section>

      ${finalSystem ? renderSystem(system) : ""}

      <section id="validation">
        ${sectionHead(finalSystem ? "06" : "04", "Validation plan")}
        <div class="grid">
          ${listCard("Strengths", validation.strengths, "span-6")}
          ${listCard("Assumptions", validation.assumptions, "span-6")}
          ${listCard("Risks", validation.risks, "span-6")}
          ${listCard("Next tests", validation.next_tests, "span-6")}
          ${validation.legal_note ? strategyCard("Legal and production note", validation.legal_note, "span-12") : ""}
        </div>
        ${sources.length ? `<div style="margin-top:46px"><div class="label">Sources</div><div class="source-list">${sources.map(sourceLink).join("")}</div></div>` : ""}
      </section>

      <footer>Generated with the Build Startup Brand skill. Strategy and creative recommendations remain hypotheses until tested with the intended audience.</footer>
    </main>
  </div>
</body>
</html>`;
}

function sectionHead(index, title) {
  return `<div class="section-head"><div class="section-index">${index}</div><h2>${esc(title)}</h2></div>`;
}

function strategyCard(label, value, span = "span-4") {
  if (!value) return "";
  return `<div class="card ${span}"><div class="label">${esc(label)}</div><p>${esc(value)}</p></div>`;
}

function listCard(label, values, span = "span-6") {
  const items = asArray(values);
  if (!items.length) return "";
  return `<div class="card ${span}"><div class="label">${esc(label)}</div><ul class="list">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>`;
}

function territoryCard(route, index) {
  const color = firstColor(route.palette, ["#E9FF70", "#A78BFA", "#FF725E"][index]);
  return `<article class="route">
    <div class="route-head" style="background:${color};color:${foreground(color)}">
      <div class="route-number">Territory 0${index + 1}</div>
      <div><h3>${esc(route.name)}</h3><p>${esc(route.thesis)}</p></div>
    </div>
    <div class="route-body">
      <div>
        <div class="label">Primary expression</div>
        <p class="quote">“${esc(route.tagline || route.thesis)}”</p>
        <div class="route-details" style="margin-top:34px">
          ${mini("Audience response", route.audience_response)}
          ${mini("Metaphor", route.metaphor)}
          ${mini("Symbol direction", route.symbol)}
          ${mini("Application", route.application)}
          ${mini("Voice", asArray(route.voice).join(" · "))}
          ${mini("Principal risk", route.risk)}
        </div>
        ${renderPalette(route.palette)}
      </div>
      <div>
        <div class="label">Weighted score</div>
        <div class="total">${weightedScore(route.scores).toFixed(1)}</div>
        ${scoreRows(route.scores)}
        <div class="label" style="margin-top:30px">Typography</div>
        <p><strong>Display:</strong> ${esc(route.typography?.display || "—")}</p>
        <p><strong>Body:</strong> ${esc(route.typography?.body || "—")}</p>
      </div>
    </div>
  </article>`;
}

function mini(label, value) {
  return `<div><div class="label">${esc(label)}</div><p>${esc(value || "—")}</p></div>`;
}

function renderPalette(palette) {
  const colors = asArray(palette).filter((color) => isHex(color.hex));
  if (!colors.length) return "";
  return `<div style="margin-top:34px"><div class="label">Palette direction</div><div class="palette">${colors.map((color) =>
    `<div class="swatch" style="background:${color.hex};color:${foreground(color.hex)}"><strong>${esc(color.name || color.role || "Color")}</strong><span>${esc(color.hex)}</span></div>`
  ).join("")}</div></div>`;
}

function scoreRows(scores = {}) {
  const labels = {
    strategic_fit: "Strategic fit",
    audience_relevance: "Audience relevance",
    distinctiveness: "Distinctiveness",
    credibility: "Credibility",
    memorability: "Memorability",
    extensibility: "Extensibility",
    execution_resilience: "Execution resilience"
  };
  return Object.entries(labels).map(([key, label]) => {
    const value = Number(scores[key] || 0);
    return `<div class="score-row"><span>${label}</span><span class="track"><span class="fill" style="width:${value * 10}%"></span></span><strong>${value}</strong></div>`;
  }).join("");
}

function renderSystem(system) {
  const traits = asArray(system.voice_traits);
  const pillars = asArray(system.message_pillars);
  const apps = asArray(system.applications);
  return `<section id="system">
    ${sectionHead("04", "Selected brand system")}
    <div class="system-preview">
      <div class="kicker">${esc(system.selected_territory || "Selected territory")}</div>
      <div class="tagline">${esc(system.tagline || system.one_liner || "—")}</div>
      <p>${esc(system.one_liner || system.value_proposition || "")}</p>
    </div>
    <div class="grid" style="margin-top:22px">
      ${strategyCard("Value proposition", system.value_proposition, "span-8")}
      ${strategyCard("Primary action", system.cta, "span-4")}
      ${strategyCard("Logo concept", system.logo_concept, "span-12")}
      <div class="card span-12"><div class="label">Final palette</div>${renderPalette(system.palette)}</div>
      ${strategyCard("Display typography", system.typography?.display, "span-6")}
      ${strategyCard("Body typography", system.typography?.body, "span-6")}
      ${strategyCard("Image direction", system.image_direction, "span-12")}
    </div>
    ${pillars.length ? `<div style="margin-top:48px"><div class="label">Message pillars</div><div class="pillars">${pillars.map((pillar) => `<div class="card"><h3>${esc(pillar.title)}</h3><p>${esc(pillar.message)}</p><div class="label" style="margin-top:22px">Proof</div><p>${esc(pillar.proof)}</p></div>`).join("")}</div></div>` : ""}
    ${traits.length ? `<div style="margin-top:48px"><div class="label">Voice behavior</div><div class="grid">${traits.map((trait) => `<div class="card span-4"><h3>${esc(trait.trait)}</h3><p>${esc(trait.meaning)}</p><div class="label" style="margin-top:20px">Do</div><p>${esc(trait.do)}</p><div class="label" style="margin-top:20px">Don't</div><p>${esc(trait.dont)}</p></div>`).join("")}</div></div>` : ""}
  </section>
  <section id="applications">
    ${sectionHead("05", "Brand in use")}
    <div class="grid">
      ${apps.map((app) => `<div class="card span-6 application"><div><div class="label">${esc(app.name)}</div><h3>${esc(app.headline)}</h3></div><p>${esc(app.direction)}</p></div>`).join("")}
      ${listCard("Do", system.dos, "span-6")}
      ${listCard("Don't", system.donts, "span-6")}
    </div>
  </section>`;
}

function sourceLink(source) {
  const url = safeUrl(source.url);
  return `<div class="card"><strong>${esc(source.label || "Source")}</strong>${source.note ? ` — ${esc(source.note)}` : ""}${url ? `<br><a href="${esc(url)}">${esc(url)}</a>` : ""}</div>`;
}

function weightedScore(scores = {}) {
  const weights = {
    strategic_fit: 0.20,
    audience_relevance: 0.20,
    distinctiveness: 0.20,
    credibility: 0.15,
    memorability: 0.10,
    extensibility: 0.10,
    execution_resilience: 0.05
  };
  return Object.entries(weights).reduce((total, [key, weight]) => total + Number(scores[key] || 0) * weight, 0);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isHex(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function firstColor(palette, fallback) {
  return asArray(palette).find((color) => isHex(color.hex))?.hex || fallback;
}

function foreground(hex) {
  if (!isHex(hex)) return "#111111";
  const [r, g, b] = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.58 ? "#111111" : "#FFFFFF";
}

function initials(name) {
  return String(name || "B").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
