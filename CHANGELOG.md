# Changelog

All notable changes to this project are documented here.

## [2.0.0] - 2026-02-14

### Added

- Restructured repository into multi-skill layout with:
  - `skills/*` for source skill folders
  - `skill-artifacts/*.skill` for packaged artifacts
- Added npm package support under `@alaa-alghazouli/brainkit`.
- Added CLI tool `brainkit` with commands for list/manifest/path/install.
- Added JavaScript API for listing and installing skills.
- Added comprehensive automated test suite covering API, CLI, build output, and scripts.
- Added release publish workflow for npm on GitHub release publish.

### Changed

- Renamed project/repo identity to `brainkit`.
- Upgraded CI to run tests on every push and pull request across Node 18/20/22.

### Removed

- Removed legacy single-skill root structure.
- Removed tracked `dist` artifact from repository; build output is generated.

## [1.1.0] - 2026-02-14

### Added

- Expanded README with badges, quick start, demo links, and community sections.
- Added contributor guidance in `CONTRIBUTING.md`.
- Added MIT `LICENSE`.
- Added docs set:
  - `docs/DEMO.md`
  - `docs/USE_CASES.md`
  - `docs/API_REFERENCE.md`
  - `docs/LAUNCH_PLAYBOOK.md`
  - `docs/SHOWCASE.md`
- Added GitHub workflow for skill structure validation.
- Added issue templates and pull request template.

## [1.0.0] - 2026-02-14

### Added

- Initial release of `threejs-performance-optimizer` skill.
- Reference modules for workflow, render loop, assets/loaders, draw calls, memory, and R3F.
- Packaged distributable skill artifact.
