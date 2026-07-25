---
name: build-startup-brand
description: Turn a startup idea, product, URL, pitch, or existing visual identity into a distinctive startup brand system and a polished standalone HTML report. Use when Codex needs to create or refine startup positioning, a salient brand idea, brand promise, tagline, messaging, voice, creative territories, logo or symbol directions, color palette, typography, visual language, brand applications, or compact brand guidelines. Also use for startup rebrands and brand audits that should end with an actionable, openable brand identity report.
---

# Build Startup Brand

Turn strategy into three differentiated creative territories, then develop the selected territory into a usable brand system. Deliver the work in conversation and in a standalone HTML report the user can open in Codex.

## Language

- Always conduct the conversation, discovery questions, analysis, recommendations, creative territories, brand copy, and final report in English.
- Use English even when the user writes in another language or supplies non-English material.
- Translate relevant input into English before developing the brand. Preserve proper nouns, registered product names, URLs, and source quotations when accuracy requires it.
- Set `meta.language` to `en` in every report JSON.

## Read the right references

- Read [references/discovery-and-positioning.md](references/discovery-and-positioning.md) before discovery, research, positioning, or rebranding.
- Read [references/creative-territories.md](references/creative-territories.md) before generating, scoring, or selecting creative directions.
- Read [references/visual-and-verbal-system.md](references/visual-and-verbal-system.md) before developing the selected identity or generating visual assets.
- Read [references/report-schema.md](references/report-schema.md) before creating the JSON source or HTML report.

## Choose the mode

- `new-brand` — Build a brand for a new startup. Use by default.
- `rebrand` — Preserve valuable recognition while solving specific brand problems.
- `strategy-only` — Stop after positioning, salient idea, promise, and messaging.
- `territories` — Deliver and score three creative territories, then stop for selection.
- `full` — Run discovery, territories, selection, complete system, and report.
- `one-shot` — When the user cannot review intermediate work, recommend one provisional route and complete it while marking assumptions clearly.

Use `full` unless the request implies another mode.

## Run the workflow

### 1. Inspect before asking

- Inspect any supplied URL, repository, pitch, screenshots, notes, or existing identity.
- Extract the product, stage, audience, job or pain, category, alternatives, promise, proof, personality, constraints, and existing brand equity.
- If current competitors, visual conventions, domains, or market claims matter, research current primary sources. Cite material facts in the report.
- Ask only for information that is missing and would change the direction. Prefer one compact batch of no more than five questions.
- Never ask the user to repeat information already available in the supplied material.

### 2. Establish the strategic core

- Define one primary audience and one buying or adoption trigger.
- State the category or competitive frame, current alternative, distinctive value, credible proof, and desired perception.
- Write one positioning statement, one salient brand idea, and one brand promise.
- Separate fact, user-provided claim, inference, and creative recommendation.
- Stop and expose the weakness when the startup lacks a specific audience, meaningful difference, or credible promise. Do not hide a positioning problem behind visual polish.

### 3. Build three territories

- Create exactly three strategically valid and visibly different creative territories.
- Give each territory a name, thesis, metaphor, tagline direction, voice, symbol direction, palette, typography direction, application example, and principal risk.
- Make each territory traceable to the same strategic core while expressing a different personality or mechanism.
- Score all territories with the weighted framework in `references/creative-territories.md`.
- Recommend the strongest territory and explain the trade-off, not merely the total score.
- Create the first HTML report containing the strategic core, three territories, scores, recommendation, assumptions, and open questions.

### 4. Pause for selection

- Ask the user to select a territory or request a hybrid.
- Do not silently combine routes. A hybrid must name exactly which elements come from which territory and why they remain coherent.
- Skip the pause only in `one-shot` mode; label the selected route provisional.

### 5. Develop the selected system

- Produce the messaging hierarchy, tagline, voice traits, vocabulary, color roles, typography roles, symbol logic, image direction, layout principles, and usage rules.
- Show at least four applications relevant to the startup, such as landing-page hero, product UI, social post, pitch cover, sales deck, packaging, or favicon.
- Use image generation for moodboards, art direction, or concept exploration when it materially improves the result.
- Do not present generated raster lettering as a production-ready logo. Rebuild approved simple marks as clean SVG when feasible, or label them as concept art requiring vector refinement.
- Check legibility, color contrast, monochrome behavior, small-size behavior, category confusion, and obvious similarity to named competitors.

### 6. Deliver the final report

- Store structured source data as `outputs/<startup-slug>-brand-identity.json`.
- Generate `outputs/<startup-slug>-brand-identity.html` with:

```bash
node scripts/generate_report.mjs <input.json> <output.html>
```

- Open or inspect the generated report and verify its layout, content, scores, palette, and applications.
- Return a clickable absolute link to the HTML report.
- Keep the JSON beside the report so future iterations can update the identity without starting over.

## Enforce the quality bar

- Build for a startup, not for the founder's personal brand.
- Produce every user-facing deliverable in English.
- Prefer one ownable idea over a collection of generic values.
- Treat the current workaround and doing nothing as competitors.
- Never invent customer evidence, traction, market facts, testimonials, or legal clearance.
- Avoid unsupported superlatives and default startup language such as “innovative,” “disruptive,” “game-changing,” and “next-generation.”
- Make distinctiveness strategic, verbal, and visual; unusual colors alone do not create a brand.
- Keep taglines short, specific, comprehensible without a pitch, and connected to the promise.
- Use accessible body-text color combinations. Flag decorative combinations that fail normal-text contrast.
- Treat competitor screening as preliminary and trademark availability as unverified unless a qualified search proves otherwise.
- End with concrete next tests: five-second recognition, audience comprehension, monochrome, favicon, landing-page message, and competitor-confusion checks.

## Default deliverable

Deliver:

1. Strategic core
2. Three creative territories
3. Weighted scorecard and recommendation
4. Selected brand system
5. Verbal identity
6. Visual identity
7. Application examples
8. Do and don't rules
9. Risks, assumptions, and validation plan
10. Standalone HTML report plus editable JSON source
