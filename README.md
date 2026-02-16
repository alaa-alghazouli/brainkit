# brainkit

[![CI](https://github.com/alaa-alghazouli/brainkit/actions/workflows/ci.yml/badge.svg)](https://github.com/alaa-alghazouli/brainkit/actions/workflows/ci.yml)
[![Latest Release](https://img.shields.io/github/v/release/alaa-alghazouli/brainkit)](https://github.com/alaa-alghazouli/brainkit/releases)
[![npm version](https://img.shields.io/npm/v/%40alaa-alghazouli%2Fbrainkit)](https://www.npmjs.com/package/@alaa-alghazouli/brainkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

`brainkit` is an installable npm package for AI-ready assets:

- skills
- skill artifacts (`.skill`)
- tool registry space (future)

It currently includes one production skill: `threejs-performance-optimizer`.

## Install with npm

```bash
npm install @alaa-alghazouli/brainkit
```

## Install the skill

1. List available skills:

```bash
npx brainkit list
```

2. Install the packaged skill artifact:

```bash
npx brainkit install threejs-performance-optimizer --dest ~/.config/opencode/skills
```

This creates:

`~/.config/opencode/skills/threejs-performance-optimizer.skill`

3. Optional: install source folder instead of `.skill` artifact:

```bash
npx brainkit install threejs-performance-optimizer --mode source --dest ~/.config/opencode/skills
```

## CLI quick reference

```bash
brainkit list
brainkit manifest
brainkit catalog
brainkit where threejs-performance-optimizer
brainkit install <skill|all> --dest <path> [--mode artifact|source]
```

## JavaScript API

```js
import { listSkills, installSkill } from "@alaa-alghazouli/brainkit";

const skills = listSkills();
await installSkill("threejs-performance-optimizer", "./local-skills");
```

## What is included today

- `threejs-performance-optimizer`: profile-first optimization playbook for Three.js and React Three Fiber performance.

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

See `CONTRIBUTING.md`.
