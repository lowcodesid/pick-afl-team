# Find My AFL Team

A smart, adaptive AFL team recommendation engine built as a static React + TypeScript + Vite + Tailwind CSS app.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
# output is in /dist — deploy anywhere (Netlify, Vercel, GitHub Pages)
npm run preview  # preview the built app locally
```

---

## Architecture

### File Structure

```
src/
  data/
    teams.ts          — Complete metadata for all 18 AFL clubs
    questions.ts      — Question bank with filter logic per question
    factorMaps.ts     — Colour/mascot/state lookup tables used by filters

  engine/
    selectorEngine.ts — Central engine: handleAnswer(), resolveWinner(), replayFilters()
    filters.ts        — isApplicable(), isUseful(), getOptions() helpers
    nextQuestion.ts   — Dynamic next-question selection algorithm
    relaxation.ts     — Soft constraint relaxation when zero teams match
    explanation.ts    — Generates plain-English explanation bullets from answers

  components/
    Layout.tsx        — Root wrapper
    TeamBadge.tsx     — Coloured team badge from club uiColors
    ProgressBar.tsx   — Animated progress bar
    ContextSummary.tsx— Sticky sidebar showing answer history + team count
    PathwayCard.tsx   — Clickable pathway option card
    AnswerGrid.tsx    — Responsive answer option grid
    QuestionCard.tsx  — Full question display with back/restart
    TeamResultCard.tsx— Hero result card for winner
    RunnerUpCard.tsx  — Runner-up display

  pages/
    Home.tsx          — Landing screen
    Selector.tsx      — Pathway chooser + question screen
    Result.tsx        — Result screen

  types/
    team.ts           — Team interface
    question.ts       — Question, QuestionOption, AnswerRecord interfaces
    engine.ts         — EngineState, ResultData, Screen types

  App.tsx             — State machine: manages screen, remaining teams, answer history
```

### Engine Flow

1. **User picks a pathway** → App sets first question from `PATHWAY_FIRST_Q` map
2. **User answers** → `handleAnswer()` in `selectorEngine.ts`:
   - Applies the question's `filter()` function to the remaining team list
   - If result is empty → `relaxConstraints()` relaxes the least critical earlier answer
   - If 1 team remains → resolves to result
   - If 0 questions remain → `resolveWinner()` picks deterministically
   - Otherwise → `selectNextQuestion()` picks the best next question
3. **Next question selection** (`nextQuestion.ts`):
   - If 2 teams remain → force `final_choice` head-to-head
   - If user answered `social_influence = yes_align` → ask `social_team_pick` next
   - If 2–4 teams remain after 2+ answers → offer `social_influence`
   - Otherwise: score all remaining applicable+useful questions by `priority × 2 + tieBreakerStrength + pathwayBonus`
4. **Explanation** (`explanation.ts`): walks each `AnswerRecord` and generates a plain-English bullet using the question ID and actual answer value
5. **Back button**: removes last answer, replays all remaining answers with `replayFilters()` to reconstruct state

### Soft Relaxation

`relaxation.ts` maintains a `RELAXATION_ORDER` list — questions ordered from least to most critical. When filtering produces zero results, it tries removing each answer in that order until at least one team survives, and surfaces a human-readable message explaining what was broadened.

---

## Assumptions made in AFL metadata

- **Recent premiership** is set to `true` for clubs that have won since 2010 (Brisbane 2023/24, Collingwood 2023, Geelong 2022, Melbourne 2021, Richmond 2017/19/20, Sydney 2024, West Coast 2018, Hawthorn 2013–16, Western Bulldogs 2016)
- **successTier** is based on overall historical success + consistent finals participation, not just recent form
- **fanbaseSize** (giant/large/medium/small) is an approximation based on membership numbers and national profile: Carlton, Collingwood, Essendon, Richmond = `giant`; most others = `large`; North Melbourne, Western Bulldogs = `medium`; Gold Coast, GWS = `small`
- **homeGroundType**: MCG = Victorian clubs that traditionally play at the MCG; suburban = clubs with dedicated suburban/mid-tier grounds; interstate_fortress = all interstate clubs; regional_stronghold = Geelong
- **brandStyle**: clubs founded pre-1980 with unchanged identity = `traditional`; clubs founded post-1990 or with major rebrand = `modern`
- **uiColors** are visual approximations of each club's official colours, not exact hex codes — they're used purely for the UI gradient badge
- All club summaries are written to be encouraging, not disparaging
- Social influence (`social_influence` + `social_team_pick`) is intentionally held until 2–4 teams remain so it acts as a genuine tie-breaker rather than a leading question

---

## Extending

**Add a new question**: add a `Question` object to `src/data/questions.ts` with a `filter()` function and set `priority` / `tieBreakerStrength`. The engine picks it up automatically.

**Adjust relaxation order**: edit `RELAXATION_ORDER` in `src/engine/relaxation.ts`.

**Update team data**: all metadata is in `src/data/teams.ts` — edit any field and the filters update automatically.
