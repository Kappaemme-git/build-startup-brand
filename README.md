# Build Startup Brand

A Codex skill that turns a startup idea, product, URL, pitch, or existing identity into a complete and distinctive brand system, then delivers everything in a polished standalone HTML report.

You do not need to arrive with a finished positioning brief or visual direction. Build Startup Brand inspects the material you provide, asks only for the missing information that would change the result, defines the strategic core, creates three different creative territories, scores them, and develops the selected route into a usable verbal and visual identity.

All discovery questions, analysis, brand copy, creative directions, and reports are produced in English.

## What it does

- Analyzes a startup idea, product, URL, pitch, repository, or existing identity
- Identifies the primary audience, problem, category, alternatives, and distinctive value
- Defines the positioning, salient brand idea, promise, personality, and available proof
- Creates exactly three strategically and visually different creative territories
- Gives every territory its own thesis, metaphor, tagline, voice, symbol direction, palette, typography, application, and risk
- Scores the territories by strategic fit, audience relevance, distinctiveness, credibility, memorability, extensibility, and execution resilience
- Recommends the strongest route and explains the trade-off
- Waits for your selection before developing the final system
- Creates the tagline, messaging hierarchy, tone of voice, color roles, typography, symbol logic, image direction, and layout principles
- Shows the identity across real startup applications such as a landing page, product UI, social post, pitch deck, or favicon
- Produces a standalone HTML brand report that opens directly in Codex
- Keeps an editable JSON source beside the report for future iterations

## Installation

```bash
npx --yes build-startup-brand@latest
```

This installs the latest public version of the skill globally for Codex and other supported agents.

Open a new Codex task after installation.

## Usage

Start from a startup idea:

```text
Use $build-startup-brand in full mode.

My startup helps independent fitness studios manage member follow-up without spreadsheets or scattered WhatsApp messages.

Create the strategic core and three creative territories. Give me the report before developing the final route.
```

Start from an existing product or website:

```text
Use $build-startup-brand to create a complete brand identity for https://example.com.

Inspect the existing product first, ask only for information that is genuinely missing, and create three different brand directions before recommending one.
```

Rebrand an existing startup:

```text
Use $build-startup-brand in rebrand mode.

Audit the identity in this project, identify what recognition is worth preserving, and create three new territories that support the current positioning.
```

Run a one-shot exploration:

```text
Use $build-startup-brand in one-shot mode for this startup idea.

Choose the strongest provisional territory, complete the brand system, and clearly label every assumption that still needs validation.
```

## How it works

### 1. Discovery

The skill inspects the supplied startup material before asking questions. It extracts the product, audience, problem, category, alternatives, promise, proof, personality, constraints, and existing brand equity.

It asks no more than five focused questions and never asks you to repeat information already available in the supplied material.

### 2. Strategic core

The skill defines:

- Primary audience and adoption trigger
- Competitive frame and current alternatives
- Distinctive value and credible proof
- Positioning statement
- Salient brand idea
- Brand promise
- Brand personality

If the positioning is too generic, it exposes the weakness instead of hiding it behind visual polish.

### 3. Three creative territories

The skill creates three genuinely different routes. They cannot be cosmetic variations of the same idea.

Each territory includes:

- Strategic thesis
- Intended audience response
- Organizing metaphor
- Tagline direction
- Tone of voice
- Symbol direction
- Functional color palette
- Typography direction
- Application example
- Main execution risk

### 4. Weighted recommendation

Every territory is scored from 1 to 10 using:

- Strategic fit — 20%
- Audience relevance — 20%
- Distinctiveness — 20%
- Credibility — 15%
- Memorability — 10%
- Extensibility — 10%
- Execution resilience — 5%

The skill recommends the strongest territory, explains what it gains and gives up, and waits for your selection.

### 5. Final brand system

After selection, the skill develops:

- Primary tagline and one-line product explanation
- Value proposition and calls to action
- Message pillars and proof points
- Voice traits with “do” and “don't” examples
- Preferred and avoided vocabulary
- Symbol concept and usage logic
- Functional color system
- Display and body typography
- Image and art direction
- Layout principles
- Real application examples
- Usage rules and validation tests

Generated raster concepts are treated as exploration, not as automatically finished production logos.

## Modes

- `new-brand` — Build a brand for a new startup
- `rebrand` — Preserve useful recognition while solving current brand problems
- `strategy-only` — Stop after positioning, salient idea, promise, and messaging
- `territories` — Create and score three directions, then stop for selection
- `full` — Complete discovery, territories, selected system, and report
- `one-shot` — Complete a provisional route when intermediate review is not possible

The default mode is `full`.

## Output

```text
outputs/<startup-slug>-brand-identity.json
outputs/<startup-slug>-brand-identity.html
```

The HTML report includes the strategic core, all three territories, weighted scores, recommendation, selected verbal and visual identity, application examples, usage rules, assumptions, risks, and next validation tests.

The JSON file is the editable source of truth used to regenerate or refine the report.

## Quality rules

- Every user-facing deliverable is written in English
- Strategy comes before visual styling
- One ownable brand idea is preferred over generic values
- Customer evidence, traction, testimonials, and market claims are never invented
- Generated raster lettering is never presented as a production-ready logo
- Color contrast, monochrome behavior, small-size behavior, and competitor confusion are checked
- Trademark availability is never claimed without qualified professional review

## Alternative installation

Install directly from the public GitHub repository:

```bash
npx --yes skills add Kappaemme-git/build-startup-brand -g -y
```

Or clone the repository manually:

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/Kappaemme-git/build-startup-brand.git ~/.agents/skills/build-startup-brand
```

Open a new Codex task after installation.

## License

MIT
