# Contributing

Thanks for contributing to `brainkit`.

## Getting started

Prerequisites: [Node.js](https://nodejs.org/) >= 18

```bash
git clone https://github.com/alaa-alghazouli/brainkit.git
cd brainkit
npm install
npm test
```

`npm test` runs the build, validates skill manifests, and runs all test suites.

## Architecture

The package has three source files:

- `src/index.js` - JavaScript API (7 exported functions: list, install, manifest, paths)
- `src/cli.js` - CLI entry point (5 commands: list, manifest, catalog, where, install)
- `src/index.d.ts` - Hand-written TypeScript definitions

Skills live in `skills/<name>/` with a `SKILL.md` frontmatter file. Packaged artifacts go in `skill-artifacts/<name>.skill`. Both are validated by `scripts/validate-skills.mjs` against `skills/manifest.json`.

The build (`scripts/build.mjs`) copies source and data directories to `dist/`.

For deeper detail, see `AGENTS.md`.

## Ways to contribute

- Improve optimization guidance in `skills/threejs-performance-optimizer/SKILL.md`
- Add or refine references under `skills/threejs-performance-optimizer/references/`
- Add new skills under `skills/<skill-name>/`
- Add corresponding packaged artifacts in `skill-artifacts/`
- Add AI tool packages under `tools/` and update `tools/manifest.json`
- Improve docs and demos in `docs/`
- Report outdated APIs, broken recommendations, or missing edge cases

## Contribution flow

1. Fork the repo and create a branch.
2. Make focused changes tied to one problem.
3. Validate locally:
   - Ensure frontmatter in `SKILL.md` has only `name` and `description`.
   - Ensure new guidance is measurable and version-safe.
4. Open a PR with:
   - Problem statement
   - What changed
   - Why it is better
   - How to verify

## Quality standards

- Prefer official docs over blog heuristics when conflicts exist.
- Treat hard thresholds as heuristics unless explicitly version-bound.
- Avoid deprecated API recommendations.
- Keep guidance concise, actionable, and testable.

## Good first issues

Look for issues labeled:

- `good first issue`
- `help wanted`

## Project direction

See [ROADMAP.md](./ROADMAP.md) for current priorities and planned work.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). Please read it before participating.
