# QFS Learning Platform

PolyU Quantitative Finance Society (founding) — an interactive platform for
learning quantitative finance from zero. This repository holds the **M0
skeleton**: page architecture, bilingual UI, and placeholder content.

Per the plan (v2.4 §4.6): **UI is bilingual (zh/en), learning content is
English-only.**

## Structure

```
src/app/[locale]/          Pages (home, learn/*, assignments, leaderboard)
src/components/            Header, Footer, LanguageSwitcher
src/content/curriculum.ts  Course structure (English) — single source of truth
src/i18n/                  next-intl routing / request / navigation
messages/zh.json en.json   UI strings (two languages)
```

Information architecture (plan v2.4 §2.1):

```
Home (top): learning map · my progress · placement assessment
├── Learning: Trading | Research | Coding   (three parallel tracks)
├── Assignments & Practice
└── Leaderboard
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Course content tests

```bash
npm test               # run every course-content, mistake-notebook and progress audit
npm run test:lessons   # audit coding answers and worked examples
npm run test:mistakes  # audit mistake derivation, mastery, and support thresholds
npm run test:progress  # audit level gates, the unlock order, and track totals
```

The lesson audit loads the actual TypeScript course content, executes every
reference solution against its expected output, runs every worked example, and
checks Chinese translations, example-note locations, and Chinese/English
starter-code parity. A new step must have a corresponding entry in
`scripts/audit_lessons.py`.

The test runner requires Node.js plus Python 3 with NumPy and pandas installed.
Set the `PYTHON` environment variable if the interpreter is not on `PATH`.
GitHub Actions runs the audit on pushes to `main` and on pull requests.

## Assignment tests and saved records

```bash
npm run test:assignments  # execute all five reference answers and every hidden test
```

The assignment audit covers every parameter variant and mirrors the browser's
isolated-namespace grader. It runs automatically as part of `npm test`.

For signed-in submission history and the mistake notebook, run
`supabase/migrations/0003_assignments_and_quizzes.sql` in the Supabase SQL Editor.
This creates `assignment_submissions` and `quiz_attempts`, with authenticated
users restricted by RLS to reading and inserting their own rows. Anonymous
grading remains available without database writes.

The notebook derives each question's failure count and latest mastery state
from those append-only records; no extra migration is required. A later correct
answer marks the question mastered, while a subsequent incorrect answer reopens
it. Three failed attempts on an unresolved question expose the email support
entry. Research quiz attempts are scoped to the active section so unanswered
questions in other sections are not counted as mistakes.

## Milestones

- **M0 (current)** — skeleton + bilingual UI, no content, no accounts
- **M1 (2027 Spring)** — accounts, Pyodide lessons, auto-graded assignments,
  admin dashboard, first content batch
- **M2 / M3** — simulated trading & leaderboard / auto-grading & showcase

For education and research only. All trading is simulated on historical data;
nothing here constitutes investment advice, and no returns are promised.
