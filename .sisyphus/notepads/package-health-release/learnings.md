- Always check boundary conditions (argv.length) and prevent flag-values when parsing simple CLI arguments manually without a library.
- When adding tests for existing CLI behavior, test edge cases like unhandled trailing tokens to document that the parser safely ignores them rather than crashing.
- To prevent brittle phrasing drift, explicitly lock down the regex phrasing to match actual current error output, as done in the unknown skill and trailing token tests.
- Validate-skills failure-path tests use the same rename+try/finally pattern as build failure tests in scripts.test.mjs. For file content mutations (manifest JSON, SKILL.md frontmatter, artifact content), readFileSync snapshot + writeFileSync restore in finally is the safest approach.
- When saving evidence files, never run happy-path validation in parallel with failure-path tests that mutate shared files — the race condition will produce false failures in the evidence capture.
- Regex assertions on stderr should match the exact throw message from the script (e.g. /Manifest must include at least one skill entry/) to catch phrasing drift early.

### Task 6: Code Fixes
- No minimal code fixes were necessary. Tasks 1-5 updates to tests aligned perfectly with the existing code and bug fixes handled in earlier patch tasks.
- Separated npm test into explicit steps in CI (build, validate:skills, test) to improve failure attribution in GitHub Actions UI.
- Release body drafted based on CHANGELOG details, securely citing contributions (Andre Fonseca and PR #8).

### Task F3: Manual QA
- All three CLI edge cases passed manual QA:
  1. `--dest` with no value → "Missing value for --dest." + exit 1
  2. `--mode` with no value → "Missing value for --mode." + exit 1
  3. Unknown trailing tokens (`--foo bar`) → silently ignored, install succeeds with exit 0
- Build step (`npm run build`) must always precede manual QA to test the latest dist/ output.
- Final cleanup wave: Minor unused variables and trailing whitespace in tests can sneak through earlier checks. Added minor fixes to validate-skills.test.mjs and cli.test.mjs.

### Final Verification Wave
- Final Verification Wave passed completely. Approvals were received from all four reviewers (F1, F2, F3, F4), and the plan execution is now finished.