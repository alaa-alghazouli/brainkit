# brainkit

[![CI](https://github.com/alaa-alghazouli/brainkit/actions/workflows/ci.yml/badge.svg)](https://github.com/alaa-alghazouli/brainkit/actions/workflows/ci.yml)
[![Latest Release](https://img.shields.io/github/v/release/alaa-alghazouli/brainkit)](https://github.com/alaa-alghazouli/brainkit/releases)
[![npm version](https://img.shields.io/npm/v/%40alaagh%2Fbrainkit)](https://www.npmjs.com/package/@alaagh/brainkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Install production-ready AI skills with npm

## Why Brainkit

`brainkit` packages AI skills so teams can install, version, and reuse them through a single npm package.
It keeps skill delivery simple: discover skills, install artifacts or source, and integrate them into existing workflows.

## Quickstart

```bash
npm install @alaagh/brainkit
npx brainkit list
npx brainkit install threejs-performance-optimizer --dest ./skills
```

## JavaScript API

```js
import { listSkills, installSkill } from "@alaagh/brainkit";

const skills = listSkills();
await installSkill("threejs-performance-optimizer", "./local-skills");
```

```ts
import { listSkills, installSkill } from "@alaagh/brainkit";
import type { InstallResult } from "@alaagh/brainkit";

const skills: string[] = listSkills();
const result: InstallResult = await installSkill(
  "threejs-performance-optimizer",
  "./local-skills",
);
```

See `docs/API_REFERENCE.md` for all exported functions.

## CLI reference

```bash
brainkit list
brainkit manifest
brainkit catalog
brainkit where threejs-performance-optimizer
brainkit install <skill|all> --dest <path> [--mode artifact|source]
```

## What's included

- Current production skill: `threejs-performance-optimizer`
- Skill artifacts in `.skill` format for direct installation
- Tool registry space in `tools/manifest.json` for future expansion

## Repository layout

- `skills/` source skills
- `skill-artifacts/` packaged `.skill` files
- `tools/` AI tool metadata and future tool bundles
- `src/` package API and CLI implementation
- `scripts/` build and validation scripts
- `tests/` API, CLI, build, and script tests

## Development

```bash
npm install
npm test
```

## Contributing

See `CONTRIBUTING.md` and look for issues labeled `good first issue`.

## License

MIT. See `./LICENSE`.
