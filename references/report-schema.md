# Report schema

Create one JSON source and generate the standalone report with `scripts/generate_report.mjs`.

## Command

```bash
node scripts/generate_report.mjs outputs/acme-brand-identity.json outputs/acme-brand-identity.html
```

The generator has no external dependencies and requires Node.js 18 or newer.

## Root object

```json
{
  "meta": {},
  "strategy": {},
  "territories": [],
  "recommendation": {},
  "brand_system": {},
  "validation": {},
  "sources": []
}
```

## Fields

### `meta`

Required:

- `startup`: display name
- `title`: report title
- `language`: always `en`
- `status`: `territories`, `provisional`, or `final`
- `generated_at`: ISO date

Optional:

- `subtitle`
- `prepared_for`

### `strategy`

Use:

- `product`
- `audience`
- `trigger`
- `problem`
- `category`
- `alternatives`
- `distinctive_value`
- `proof_points` as an array
- `positioning`
- `salient_idea`
- `promise`
- `personality` as an array
- `evidence_notes` as an array

### `territories`

Create exactly three objects:

```json
{
  "name": "Territory name",
  "thesis": "Strategic thesis",
  "audience_response": "What the audience understands and feels",
  "metaphor": "Organizing metaphor",
  "tagline": "Primary line",
  "tagline_alternates": ["Alternate one"],
  "voice": ["Trait one", "Trait two", "Trait three"],
  "voice_sample": "Example sentence",
  "symbol": "Symbol mechanism",
  "palette": [
    {"name": "Ink", "hex": "#111827", "role": "Text"}
  ],
  "typography": {
    "display": "Display direction",
    "body": "Body direction"
  },
  "application": "Concrete application scene",
  "risk": "Main risk",
  "scores": {
    "strategic_fit": 8,
    "audience_relevance": 8,
    "distinctiveness": 8,
    "credibility": 8,
    "memorability": 8,
    "extensibility": 8,
    "execution_resilience": 8
  }
}
```

The generator calculates the weighted score.

### `recommendation`

Use:

- `territory`
- `reason`
- `tradeoff`
- `selection_status`

### `brand_system`

Leave as `{}` in the territories report. For the final report use:

- `selected_territory`
- `tagline`
- `one_liner`
- `value_proposition`
- `cta`
- `logo_concept`
- `palette`
- `typography`
- `voice_traits`, each with `trait`, `meaning`, `do`, and `dont`
- `preferred_words`
- `avoided_words`
- `message_pillars`, each with `title`, `message`, and `proof`
- `image_direction`
- `layout_principles` as an array
- `applications`, each with `name`, `headline`, and `direction`
- `dos` as an array
- `donts` as an array

### `validation`

Use:

- `strengths`
- `assumptions`
- `risks`
- `next_tests`
- `legal_note`

All except `legal_note` are arrays.

### `sources`

Use objects containing:

- `label`
- `url`
- `note`

Include only sources actually consulted. Do not add fake citations.

## Output behavior

- Keep all important reasoning in the JSON; the HTML is a rendering, not the source of truth.
- Use valid six-digit hex colors so the report can render swatches.
- Do not embed untrusted HTML in JSON values; the generator escapes text.
- Inspect the resulting HTML visually before delivery.
