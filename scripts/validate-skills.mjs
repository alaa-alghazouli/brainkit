import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsDirectory = path.join(root, "skills");
const artifactsDirectory = path.join(root, "skill-artifacts");
const manifestFile = path.join(skillsDirectory, "manifest.json");
const toolsManifestFile = path.join(root, "tools", "manifest.json");

if (!existsSync(skillsDirectory)) {
  throw new Error("Missing skills directory.");
}

if (!existsSync(artifactsDirectory)) {
  throw new Error("Missing skill-artifacts directory.");
}

if (!existsSync(manifestFile)) {
  throw new Error("Missing skills manifest file at skills/manifest.json.");
}

if (!existsSync(toolsManifestFile)) {
  throw new Error("Missing tools manifest file at tools/manifest.json.");
}

const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
if (manifest.version !== 1) {
  throw new Error("Manifest version must be 1.");
}

if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
  throw new Error("Manifest must include at least one skill entry.");
}

const toolsManifest = JSON.parse(readFileSync(toolsManifestFile, "utf8"));
if (toolsManifest.version !== 1 || !Array.isArray(toolsManifest.tools)) {
  throw new Error("Tools manifest must include version=1 and a tools array.");
}

const skillSlugs = readdirSync(skillsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const manifestSlugs = manifest.skills
  .map((entry) => entry.slug)
  .filter((value) => typeof value === "string")
  .sort();

if (skillSlugs.join("|") !== manifestSlugs.join("|")) {
  throw new Error(
    `Manifest skill slugs do not match skills directory. Directories: ${skillSlugs.join(", ")}; manifest: ${manifestSlugs.join(", ")}`,
  );
}

if (skillSlugs.length === 0) {
  throw new Error("At least one skill directory is required.");
}

for (const slug of skillSlugs) {
  const skillDirectory = path.join(skillsDirectory, slug);
  const skillFile = path.join(skillDirectory, "SKILL.md");
  const artifactFile = path.join(artifactsDirectory, `${slug}.skill`);
  const manifestEntry = manifest.skills.find((entry) => entry.slug === slug);

  if (!manifestEntry) {
    throw new Error(`Missing manifest entry for ${slug}`);
  }

  if (!existsSync(skillFile)) {
    throw new Error(`Missing SKILL.md for ${slug}`);
  }

  if (!existsSync(artifactFile)) {
    throw new Error(`Missing artifact for ${slug}`);
  }

  const content = readFileSync(skillFile, "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);

  if (!frontmatterMatch) {
    throw new Error(`Missing YAML frontmatter in ${skillFile}`);
  }

  const yamlLines = frontmatterMatch[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  const keySet = new Set(yamlLines.map((line) => line.split(":")[0].trim()));
  if (!(keySet.has("name") && keySet.has("description")) || keySet.size !== 2) {
    throw new Error(
      `Frontmatter in ${skillFile} must include only name and description.`,
    );
  }

  const artifactSize = statSync(artifactFile).size;
  if (artifactSize < 1000) {
    throw new Error(`Artifact appears too small for ${slug}`);
  }

  if (manifestEntry.artifact && manifestEntry.artifact !== `${slug}.skill`) {
    throw new Error(
      `Manifest artifact mismatch for ${slug}. Expected ${slug}.skill but found ${manifestEntry.artifact}`,
    );
  }

  if (manifestEntry.source && manifestEntry.source !== `skills/${slug}`) {
    throw new Error(
      `Manifest source mismatch for ${slug}. Expected skills/${slug} but found ${manifestEntry.source}`,
    );
  }
}

console.log(`Validated ${skillSlugs.length} skill(s).`);
