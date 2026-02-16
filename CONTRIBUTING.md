# Contributing

Thanks for contributing to `brainkit`.

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

## Code of conduct

Be respectful, constructive, and specific.
