# JavaScript API Reference

## Functions

### listSkills()

**Signature**

```ts
export function listSkills(): string[];
```

Returns a sorted array of skill directory names under `skills/`.

**Parameters**

- None.

**Returns**

- `string[]`: Available skill slugs.

**Example**

```js
import { listSkills } from "@alaagh/brainkit";

const skills = listSkills();
```

**Throws**

- `Error`: Skills directory is missing.

### getManifest()

**Signature**

```ts
export function getManifest(): SkillManifest;
```

Reads and returns `skills/manifest.json`. If missing, returns a generated manifest from available skills.

**Parameters**

- None.

**Returns**

- `SkillManifest`: Manifest object with `version` and `skills`.

**Example**

```js
import { getManifest } from "@alaagh/brainkit";

const manifest = getManifest();
```

**Throws**

- May propagate errors from listing skills when generating fallback manifest.

### getToolsManifest()

**Signature**

```ts
export function getToolsManifest(): ToolManifest;
```

Reads and returns `tools/manifest.json`. If missing, returns `{ version: 1, tools: [] }`.

**Parameters**

- None.

**Returns**

- `ToolManifest`: Manifest object with `version` and `tools`.

**Example**

```js
import { getToolsManifest } from "@alaagh/brainkit";

const tools = getToolsManifest();
```

**Throws**

- No explicit throws in this function.

### getSkillSourcePath(skillName)

**Signature**

```ts
export function getSkillSourcePath(skillName: string): string;
```

Returns the absolute source directory path for a known skill slug.

**Parameters**

- `skillName` (`string`, required): Skill slug from `listSkills()`.

**Returns**

- `string`: Absolute path to `skills/<skillName>/`.

**Example**

```js
import { getSkillSourcePath } from "@alaagh/brainkit";

const sourcePath = getSkillSourcePath("threejs-performance-optimizer");
```

**Throws**

- `Error`: Skill slug is unknown.

### getSkillArtifactPath(skillName)

**Signature**

```ts
export function getSkillArtifactPath(skillName: string): string;
```

Returns the absolute path to the packaged `.skill` artifact for a known skill.

**Parameters**

- `skillName` (`string`, required): Skill slug from `listSkills()`.

**Returns**

- `string`: Absolute path to `skill-artifacts/<skillName>.skill`.

**Example**

```js
import { getSkillArtifactPath } from "@alaagh/brainkit";

const artifactPath = getSkillArtifactPath("threejs-performance-optimizer");
```

**Throws**

- `Error`: Skill slug is unknown.
- `Error`: Skill artifacts directory is missing.
- `Error`: Artifact file is missing for the skill.

### installSkill(skillName, destination, options?)

**Signature**

```ts
export function installSkill(
  skillName: string,
  destination: string,
  options?: InstallOptions,
): Promise<InstallResult>;
```

Installs one skill into a destination directory as either an artifact (default) or source copy.

**Parameters**

- `skillName` (`string`, required): Skill slug or known skill name.
- `destination` (`string`, required): Output directory. Created if it does not exist.
- `options` (`InstallOptions`, optional): Installation options.
  - `mode` (`"artifact" | "source"`, optional): Defaults to `"artifact"`.

**Returns**

- `Promise<InstallResult>`: Installation metadata with `skill`, `mode`, and `outputPath`.

**Example**

```js
import { installSkill } from "@alaagh/brainkit";

const result = await installSkill("threejs-performance-optimizer", "./skills");
```

**Throws**

- `Error`: Destination path is missing.
- `Error`: Mode is not `"artifact"` or `"source"`.
- `Error`: Skill slug is unknown.
- `Error`: Artifact/source path requirements are not met.

### installAll(destination, options?)

**Signature**

```ts
export function installAll(
  destination: string,
  options?: InstallOptions,
): Promise<InstallResult[]>;
```

Installs all available skills into a destination directory using the selected mode.

**Parameters**

- `destination` (`string`, required): Output directory for all installed skills.
- `options` (`InstallOptions`, optional): Installation options applied to each skill.

**Returns**

- `Promise<InstallResult[]>`: One installation result per skill.

**Example**

```js
import { installAll } from "@alaagh/brainkit";

const results = await installAll("./skills", { mode: "artifact" });
```

**Throws**

- Propagates errors from `listSkills()` and `installSkill()`.

## Types

### InstallMode

```ts
export type InstallMode = "artifact" | "source";
```

Install mode for copy behavior.

### InstallOptions

```ts
export interface InstallOptions {
  mode?: InstallMode;
}
```

Options accepted by `installSkill()` and `installAll()`.

### InstallResult

```ts
export interface InstallResult {
  skill: string;
  mode: InstallMode;
  outputPath: string;
}
```

- `skill`: Installed skill slug.
- `mode`: Effective install mode.
- `outputPath`: Absolute destination path of copied output.

### SkillManifestEntry

```ts
export interface SkillManifestEntry {
  slug: string;
  name?: string;
  description?: string;
  version?: string;
}
```

- `slug`: Skill identifier used by CLI and API.
- `name`: Optional display name.
- `description`: Optional summary.
- `version`: Optional skill version metadata.

### SkillManifest

```ts
export interface SkillManifest {
  version: number;
  skills: SkillManifestEntry[];
}
```

- `version`: Manifest schema/version number.
- `skills`: List of manifest entries.

### ToolManifestEntry

```ts
export interface ToolManifestEntry {
  slug: string;
  name?: string;
  description?: string;
  version?: string;
}
```

- `slug`: Tool identifier.
- `name`: Optional display name.
- `description`: Optional summary.
- `version`: Optional tool version metadata.

### ToolManifest

```ts
export interface ToolManifest {
  version: number;
  tools: ToolManifestEntry[];
}
```

- `version`: Manifest schema/version number.
- `tools`: List of tool entries.
