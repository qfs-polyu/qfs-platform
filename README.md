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
npm test               # audit all coding-lesson answers and worked examples
npm run test:lessons   # the same audit, called directly
```

The audit loads the actual TypeScript course content, executes every reference
solution against its expected output, runs every worked example, and checks
Chinese translations, example-note locations, and Chinese/English starter-code
parity. A new step must have a corresponding entry in `scripts/audit_lessons.py`.

The test runner requires Node.js plus Python 3 with NumPy and pandas installed.
Set the `PYTHON` environment variable if the interpreter is not on `PATH`.
GitHub Actions runs the audit on pushes to `main` and on pull requests.

## Milestones

- **M0 (current)** — skeleton + bilingual UI, no content, no accounts
- **M1 (2027 Spring)** — accounts, Pyodide lessons, auto-graded assignments,
  admin dashboard, first content batch
- **M2 / M3** — simulated trading & leaderboard / auto-grading & showcase

For education and research only. All trading is simulated on historical data;
nothing here constitutes investment advice, and no returns are promised.
