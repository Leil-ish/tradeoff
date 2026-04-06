# Tradeoff

Tradeoff is a mobile-first decision tool for working professionals. It helps answer two common questions:

- Should I do this myself or outsource it?
- Should I keep searching for a better deal or stop?

The product is intentionally not a spreadsheet. It combines money, time, hassle, enjoyment, identity fit, and the user’s stated life priorities into a structured estimate that makes tradeoffs visible.

## What The Product Does

Tradeoff helps users compare:

- Direct financial cost
- Time cost based on a user-entered hourly value
- Friction such as coordination or urgency
- Personal fit, like whether they would miss doing the task themselves
- Opportunity cost, translated into what that time could become instead

The app currently supports preset scenarios for:

- House cleaning
- Lawn care
- Grocery shopping vs delivery
- Laundry
- Shopping for a deal on a product

## App Structure

The codebase stays intentionally small and flat.

```text
app/
  layout.tsx           App shell and metadata
  page.tsx             Top-level page composition
  globals.css          Global styles and shared UI polish

components/
  icons.tsx            Shared inline icons
  PriorityAllocator.tsx
  ResultPanel.tsx      Results UI and pending state
  ScenarioSelector.tsx
  forms/
    DealSearchForm.tsx
    OutsourceForm.tsx
  ui/
    Button.tsx
    Card.tsx
    FieldWrapper.tsx
    NumericField.tsx
    SectionHeader.tsx
    SegmentedControl.tsx
    SliderField.tsx

lib/
  constants.ts         Mode and preset labels
  decision-engine.ts   Deterministic scoring logic
  decision-types.ts    Result object types
  form-types.ts        Form models and enums
  presets.ts           Scenario defaults
  types.ts             Shared app-level types
  validation.ts        Input validation and result readiness helpers
```

## How To Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is ready for static frontend deployment on Vercel or any standard Next.js hosting setup.

- No database required
- No authentication required
- No external APIs required
- No environment variables required

### Vercel

1. Push the repo to GitHub, GitLab, or Bitbucket
2. Import the repository into Vercel
3. Use the default Next.js build settings
4. Deploy

## How The Decision Logic Works

The app uses explicit TypeScript heuristics. There is no AI scoring and no external API dependency.

### Mode 1: Do It Yourself Or Outsource

The engine considers:

- `DIY time cost = diyHours * hourlyTimeValue`
- `Outsource cost = outsourceCost + coordination friction cost`
- Professional speed as a modest turnaround bonus
- Preference adjustments for:
  - whether the user dislikes the task
  - whether they would miss doing it
  - whether it feels identity-relevant

The recommendation leans toward outsourcing when the user’s time cost clearly exceeds outsourcing plus friction, especially when the task is low-identity or disliked.

### Mode 2: Keep Searching Or Stop

The engine considers:

- `expected value = adjusted likely savings - time cost - delay cost + enjoyment adjustment`
- diminishing returns as search time rises
- urgency as a delay penalty
- enjoyment of deal-hunting as a small adjustment only

It is designed to often recommend:

- stopping
- or doing a short search, then stopping

instead of encouraging open-ended optimization.

### Opportunity Cost Layer

Users allocate 5 hours across priority categories. The engine uses that distribution to translate saved or spent time into a human-readable summary, such as what that time could go toward instead.

## Where To Tweak Presets And Assumptions

### Preset scenario defaults

Edit:

- `lib/presets.ts`

This file controls:

- default form values by preset
- default priority splits
- initial assumptions for each mode

### Result wording and scoring heuristics

Edit:

- `lib/decision-engine.ts`

This file controls:

- coordination friction weights
- urgency weights
- identity and enjoyment adjustments
- diminishing returns for continued search
- result summaries, rationale bullets, and stopping-rule copy

### Labels and selectable options

Edit:

- `lib/constants.ts`
- `lib/form-types.ts`

## Current Limitations

- No persistence yet; state is local to the page session
- No charts or history view
- No sensitivity simulation beyond lightweight close-call notes
- Presets are static and do not adapt from prior behavior
- The app is a framing tool, not a precise forecast or financial model

## Design Notes

The UI aims to feel calm, premium, and high-trust:

- mobile-first layout
- minimal visual noise
- short helper text instead of dense explanations
- explicit assumptions instead of black-box recommendations

The main goal is not perfect prediction. It is helping a user see the trade they are making before they drift into a default choice.
# tradeoff
